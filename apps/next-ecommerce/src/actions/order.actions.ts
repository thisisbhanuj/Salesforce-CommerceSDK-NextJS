'use server';

import connectDB from '@/lib/db';
import { getCurrentUser } from '@/lib/session';
import { createOrderId } from '@/utility/orderHelpers';
import Order from '@/models/orderModel';
import Cart from '@/models/cartModel';
import { orderConfirmationEmail } from '@/utility/emailHelper';
import { OrderStatus, OrderMode } from '@/Statuses';
import { TransactionOptions } from 'mongodb';

/**
 * Creates an order from a cart.
 * @param cartId - The ID of the cart.
 * @returns An object containing the created order, the cart ID, and a success flag.
 */
export async function createOrderFromCart(cartId: string) {
  try {
    const currentUser = await getCurrentUser().then((user) => user);
    if (!currentUser) {
      throw new Error('User not found');
    }

    const cart = await Cart.findOne({ user: currentUser.id, ID: cartId }).lean(
      true,
    );
    if (!cart) {
      throw new Error('Cart not found');
    }

    const newOrder = {
      ID: createOrderId(),
      commerceItems: cart.commerceItems,
      shippingAddress: cart.shippingAddress,
      status: OrderStatus.Created,
      mode: OrderMode.Online,
      itemsPrice: cart.itemsPrice,
      shippingPrice: cart.shippingPrice,
      taxPrice: cart.taxPrice,
      totalPrice: cart.totalPrice,
      orderDiscount: cart.orderDiscount,
      totalDiscount: cart.totalDiscount,
      finalOrderAmount: cart.finalOrderAmount,
      voucher: cart.voucher,
      user: currentUser.id,
      orderEmail: currentUser.email,
      paid: false,
      delivered: false,
      isOriginalOrder: true,
    };

    const order = await Order.create(newOrder);
    return {
      order: order,
      cartId: cart._id,
      success: true,
    };
  } catch (error) {
    console.error('Failed to create order : ', error);
    return {
      success: false,
      error: 'Failed to create order',
    };
  }
}

/**
 * Submits an order by creating an order from a cart and updating the order with payment details.
 * It also sends an order confirmation email to the user.
 * @param cartId - The ID of the cart.
 * @param paymentIntentId - The ID of the payment intent.
 * @param stripeChargeId - The ID of the stripe charge.
 * @returns An object containing the order ID, the cart ID, and a success flag.
 */
export async function submitOrder(
  cartId: string,
  paymentIntentId: string,
  stripeChargeId: string,
) {
  const client = await connectDB();
  const session = await client.startSession();
  const transactionOptions: TransactionOptions = {
    readPreference: 'primary',
    readConcern: { level: 'snapshot' },
    writeConcern: { w: 'majority' },
  };

  let result = {
    order: '',
    success: false,
    error: '',
    cartId: cartId,
  };

  try {
    await session.withTransaction(async () => {
      // Order Creation
      const createdOrderObj = await createOrderFromCart(cartId);
      if (!createdOrderObj.success || !createdOrderObj.order) {
        throw new Error('Failed to create order.');
      }

      // Order Update
      const updatedOrder = await Order.findByIdAndUpdate(
        createdOrderObj.order._id,
        {
          status: OrderStatus.Processing,
          stripePaymentIntentId: paymentIntentId,
          stripeChargeId: stripeChargeId,
          paid: true,
        },
        { new: true, session }, // Include session in options
      );

      if (updatedOrder) {
        console.debug('Order SUBMITTED : ', updatedOrder);

        // Order Confirmation Email
        const response = await orderConfirmationEmail({
          id: updatedOrder.ID,
          email: updatedOrder.orderEmail || '',
          firstName: updatedOrder.shippingAddress?.fullName || '',
          total: updatedOrder.finalOrderAmount || 0,
          items: updatedOrder.commerceItems.map((item) => ({
            product: {
              name: item.name,
            },
            quantity: item.quantity,
          })),
        });

        //Email functionality should not block order submission
        if (response) {
          console.debug(
            'Order confirmation email sent for order ID: ',
            updatedOrder.ID,
          );
        } else {
          console.error(
            'Failed to send order confirmation email for order ID: ',
            updatedOrder.ID,
          );
        }

        result = {
          order: JSON.stringify(updatedOrder.ID),
          success: true,
          cartId: JSON.stringify(createdOrderObj.cartId),
          error: '',
        };
      } else {
        console.error(
          'Failed to update order with payment details. Order ID: ',
          createdOrderObj.order._id,
          ' is created.',
        );
        console.error(
          'Payment Intent ID: ',
          paymentIntentId,
          ' and Stripe Charge ID: ',
          stripeChargeId,
          ' are not saved.',
        );
        console.error(
          'Trnsaction was not aborted intentionally. Please check the order status and payment details.',
        );
      }
    }, transactionOptions);

    return result;
  } catch (error) {
    console.error('Failed to submit order : ', error);
    await session.abortTransaction();
    return {
      order: '',
      success: false,
      error: 'Failed to submit order',
      cartId: cartId,
    };
  } finally {
    await session.endSession();
  }
}

/**
 * Finds an order by its ID.
 * @param orderId - The ID of the order.
 * @returns The found order.
 */
export async function findOrderById(orderId: string) {
  try {
    await connectDB();
    const currentUser = await getCurrentUser().then((user) => user);
    const userId = currentUser.id;
    const order = await Order.findOne({ ID: orderId, user: userId });

    return order;
  } catch (error) {
    console.error('Failed to find order', error);
  }
}

/**
 * Finds orders for a user.
 * @param page - The page number.
 * @param limit - The number of orders per page.
 * @returns An array of orders.
 *
 * Benefits:
 * Scalability: This approach allows you to retrieve large datasets efficiently
 * by fetching only a limited number of orders per request. You can handle millions
 * of orders without overwhelming the database or the API.
 *
 * Performance: By using pagination, you can significantly reduce the amount of data
 * transferred between the client and server.
 * This improves the overall performance of your application.
 *
 */
export async function findOrders(page = 1, limit = 5) {
  const maxLimit = 10; // Maximum number of orders per page
  if (limit > maxLimit) {
    limit = maxLimit; // Limit the number of orders per page
  }

  try {
    await connectDB();

    const currentUser = await getCurrentUser().then((user) => user);
    if (!currentUser?.id) {
      throw new Error('User not found');
    }

    const userId = currentUser.id;
    const skip = (page - 1) * limit; // Calculate skip for pagination

    // Use aggregation pipeline to count total orders and fetch paginated data
    const [totalCount, orders] = await Promise.all([
      Order.countDocuments({ user: userId }),
      Order.find({ user: userId })
        .limit(limit)
        .sort({ createdAt: -1 })
        .skip(skip)
        .lean(true),
    ]);

    const ordersJSON = orders.map((order) => ({
      id: order._id.toString(),
      orderId: order.ID,
      commerceItems: order.commerceItems.map((item) => ({
        ID: item.ID,
        name: item.name,
        color: item.color,
        size: item.size,
        quantity: item.quantity,
        image: item.image,
        price: item.price,
        isCustomized: item.isCustomized,
      })),
      shippingAddress: {
        fullName: order.shippingAddress?.fullName,
        address1: order.shippingAddress?.address1,
        address2: order.shippingAddress?.address2,
        city: order.shippingAddress?.city,
        state: order.shippingAddress?.state,
        zipCode: order.shippingAddress?.zipCode,
      },
      status: order.status,
      mode: order.mode,
      shippingPrice: order.shippingPrice,
      taxPrice: order.taxPrice,
      totalPrice: order.totalPrice,
      orderDiscount: order.orderDiscount,
      totalDiscount: order.totalDiscount,
      finalOrderAmount: order.finalOrderAmount,
      voucher: order.voucher,
      paid: order.paid,
      delivered: order.delivered,
      deliveryDate: order.deliveryDate,
    }));

    return JSON.stringify({
      ordersJSON: ordersJSON,
      total: totalCount,
    });
  } catch (error) {
    console.error('Failed to find orders:', error);
    return '';
  }
}
