import { NextRequest, NextResponse } from 'next/server';
import { HttpStatusCode } from 'axios';

import { hashPassword } from '@/lib/auth';
import connectDB from '@/lib/db';
import User from '@/models/userModel';
import ShippingAddress from '@/models/shippingAddress';
import { ShippingAddressType } from '../../../../types/CheckoutType';

/**
 * Updates the user profile in MongoDB.
 * @param request - The NextRequest object.
 * @returns A NextResponse object with the updated user profile or an error message.
 */
export async function PATCH(request: NextRequest) {
  try {
    const body = await request.json();
    const { id, password, firstName, lastName } = body;

    await connectDB();

    const updates: { [key: string]: any } = {};

    if (password) {
      const hashedPassword = await hashPassword(password);
      updates.password = hashedPassword;
    }

    if (firstName) {
      updates.firstName = firstName;
    }

    if (lastName) {
      updates.lastName = lastName;
    }

    console.log(updates);

    const user = await User.findByIdAndUpdate(id, updates, { new: true });

    if (user) {
      return NextResponse.json(
        { user, message: 'User profile updated in MongoDB' },
        { status: HttpStatusCode.Accepted },
      );
    } else {
      return NextResponse.json(
        { message: 'User profile not updated in MongoDB' },
        { status: HttpStatusCode.BadRequest },
      );
    }
  } catch (error: any) {
    console.log(error);
    return NextResponse.json(
      { message: error.message ?? 'An error occurred' },
      { status: HttpStatusCode.BadRequest },
    );
  }
}

/**
 * Adds a new shipping address to the user's profile in MongoDB.
 * @param request - The NextRequest object.
 * @returns A NextResponse object with the updated user profile or an error message.
 */
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      id,
      title,
      address_line_1,
      address_line_2,
      city,
      state,
      postCode,
      mobile,
    } = body;

    await connectDB();

    const newShippingAddress: ShippingAddressType = {
      title,
      default: true,
      address_line_1,
      address_line_2,
      city,
      state,
      postCode,
      mobile,
    };

    const shippingAddress = await ShippingAddress.create(newShippingAddress);

    if (!shippingAddress) {
      return NextResponse.json(
        { message: 'Shipping Address not created in MongoDB' },
        { status: HttpStatusCode.BadRequest },
      );
    } else {
      const user = await User.findById({ _id: id }).populate(
        'shippingAddresses',
      );
      if (user) {
        user.shippingAddresses.push(shippingAddress._id);
        await user.save();

        return NextResponse.json(
          { user, message: 'Address updated on Profile' },
          { status: HttpStatusCode.Accepted },
        );
      } else {
        return NextResponse.json(
          { message: 'Address not updated on Profile' },
          { status: HttpStatusCode.BadRequest },
        );
      }
    }
  } catch (error: any) {
    return NextResponse.json(
      { message: error.message ?? 'An error occurred' },
      { status: HttpStatusCode.BadRequest },
    );
  }
}
