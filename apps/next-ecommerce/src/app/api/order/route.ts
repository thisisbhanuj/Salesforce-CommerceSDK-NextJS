import { TransactionOptions } from 'mongodb';
import { NextRequest, NextResponse } from 'next/server';
import { HttpStatusCode } from 'axios';

import connectDB from '@/lib/db';
import { getCurrentUser } from '@/lib/session';
import { createOrderId } from '@/utility/orderHelpers';
import Order from '@/models/orderModel';
import Cart from '@/models/cartModel';
import { OrderStatus, OrderMode } from '@/Statuses';
import { kafkaProducer } from '@/kafka/producer';

/**
 * Creates an order from a cart.
 * @param cartId - The ID of the cart.
 * @returns An object containing the created order, the cart ID, and a success flag.
 */
async function createOrderFromCart(cartId: string) {
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
 * @returns An object containing the order ID, the cart ID, and a success flag.
 */
export async function POST(request: NextRequest) {
  const body = await request.json();
  const { cartId, paymentIntentId, stripeChargeId } = body;
  const client = await connectDB();
  const session = await client.startSession();
  const transactionOptions: TransactionOptions = {
    readPreference: 'primary',
    readConcern: { level: 'snapshot' },
    writeConcern: { w: 'majority' },
  };

  let result = {};

  try {
    await session.withTransaction(async () => {
      // Order Creation
      const createdOrderObj = await createOrderFromCart(cartId);
      if (!createdOrderObj.success || !createdOrderObj.order) {
        return NextResponse.json(
          { error: 'Failed to submit order' },
          { status: HttpStatusCode.BadRequest },
        );
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

        // Event Producer: The kafkaProducer function acts as an event producer. 
        // It publishes order confirmation data to the Kafka topic (order-topic).
        console.debug('Publishing Order Confirmation Email event to Kafka');
        kafkaProducer(
          JSON.stringify({
            id: updatedOrder,
            email: updatedOrder.orderEmail,
            firstName: updatedOrder.shippingAddress?.fullName,
            total: updatedOrder.finalOrderAmount,
            items: updatedOrder.commerceItems.map((item) => ({
              product: {
                name: item.name,
              },
              quantity: item.quantity,
            })),
          }),
          'order-topic',
          'order-email-schema-subject',
        );

        result = {
          order: updatedOrder.ID,
          success: true,
          cartId: createdOrderObj.cartId,
          error: null,
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

    return NextResponse.json(result, { status: HttpStatusCode.Accepted });
  } catch (error) {
    console.error('Failed to submit order : ', error);
    await session.abortTransaction();
    return NextResponse.json(
      { error: 'Failed to submit order' },
      { status: HttpStatusCode.InternalServerError },
    );
  } finally {
    await session.endSession();
    await client.close();
  }
}
