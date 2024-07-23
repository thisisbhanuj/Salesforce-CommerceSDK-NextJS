import { NextRequest, NextResponse } from 'next/server';
import { HttpStatusCode } from 'axios';

import connectDB from '@/lib/db';
import Cart from '@/models/cartModel';
import User from '@/models/userModel';
import ShippingAddress from '@/models/shippingAddress';
import { CartItem } from '../../../../types/CartType';
import {
  createCartId,
  validateCart,
  calculateCartTotals,
} from '@/utility/cartHelpers';
import { getCurrentSession } from '@/lib/session';

/**
 * Handles the GET request for the cart route.
 * @param {NextRequest} _: The request object.
 * @returns {Promise<NextResponse>} The response object.
 */
export async function GET(_: NextRequest): Promise<NextResponse> {
  let shippingAddress = [];

  const session = await getCurrentSession();
  try {
    //1. First find session user
    if (session?.user?.id) {
      const userId = session.user.id;

      await connectDB();

      // 2. Find user from DB
      const user = await User.findById(userId);
      if (!user) {
        return NextResponse.json(
          { message: `User ${userId} not found` },
          { status: HttpStatusCode.Unauthorized },
        );
      } else {
        // 3. Find shipping address array for user
        if (user?.shippingAddresses?.length > 0) {
          console.debug('User has shipping addresses');
          shippingAddress = await ShippingAddress.find({
            _id: { $in: user.shippingAddresses },
          });
        }
        // 4. Find cart for user
        const sessionCart = await Cart.findOne({ user: userId });
        const isValid = validateCart(sessionCart?.commerceItems || []);

        // 5. Return cart and shipping address
        if (isValid) {
          return NextResponse.json(
            { cart: sessionCart, shippingAddress },
            { status: HttpStatusCode.Ok },
          );
        } else {
          return NextResponse.json(
            { message: 'Invalid Cart' },
            { status: HttpStatusCode.BadRequest },
          );
        }
      }
    } else {
      return NextResponse.json(
        { message: 'User not authenticated' },
        { status: HttpStatusCode.Unauthorized },
      );
    }
  } catch (error) {
    console.log(error);
    return NextResponse.json(
      { message: error },
      { status: HttpStatusCode.BadRequest },
    );
  }
}

/**
 * Handles the POST request for the cart route.
 * @param {NextRequest} request: The request object.
 * @returns {Promise<NextResponse>} The response object.
 */
export async function POST(request: NextRequest): Promise<NextResponse> {
  const body = await request.json();
  const productData: [CartItem] = body;

  const session = await getCurrentSession();

  try {
    if (session?.user?.id) {
      validateCart(productData);
      const cartTotals = calculateCartTotals(productData);

      await connectDB();

      const createdCart = await Cart.create({
        ID: createCartId(),
        commerceItems: productData,
        itemsPrice: cartTotals.itemsPrice,
        itemsDiscount: cartTotals.itemsDiscount,
        shippingPrice: cartTotals.shippingPrice,
        shippingDiscount: cartTotals.shippingDiscount,
        taxPrice: cartTotals.taxPrice,
        totalPrice: cartTotals.totalPrice,
        orderDiscount: cartTotals.orderDiscount,
        totalDiscount: cartTotals.totalDiscount,
        finalOrderAmount: cartTotals.finalOrderAmount,
        user: session.user.id,
      });

      if (createdCart) {
        return NextResponse.json(
          { createdCart, message: 'Cart created in MongoDB' },
          { status: HttpStatusCode.Created },
        );
      } else {
        return NextResponse.json(
          { message: 'Cart not created in MongoDB' },
          { status: HttpStatusCode.BadRequest },
        );
      }
    } else {
      return NextResponse.json(
        { message: 'User not authenticated' },
        { status: HttpStatusCode.Unauthorized },
      );
    }
  } catch (error) {
    console.log(error);
    return NextResponse.json(
      { message: error },
      { status: HttpStatusCode.BadRequest },
    );
  }
}
