import { NextRequest, NextResponse } from 'next/server';
import { HttpStatusCode } from 'axios';

import { hashPassword } from '@/lib/auth';
import connectDB from '@/lib/db';
import User from '@/models/userModel';
import { sendWelcomeEmail } from '@/utility/emailHelper';

/*
 * This route is responsible for creating a new user in MongoDB
 * It receives the user's details in the request body
 * It hashes the user's password before saving it in the database
 * It sends a welcome email to the user after successfully creating the user
 */
export async function POST(request: NextRequest) {
  const body = await request.json();
  const { email, password, firstName, lastName } = body;

  const hashedPassword = await hashPassword(password);

  try {
    await connectDB();

    const user = await User.create({
      firstName: firstName,
      lastName: lastName,
      email: email,
      password: hashedPassword,
    });

    if (user) {
      // Send welcome email to the user
      const response = await sendWelcomeEmail(email, firstName);
      if (response) {
        console.log('Welcome Email sent successfully');
      } else {
        console.log('Welcome Email not sent');
      }

      return NextResponse.json(
        { user, message: 'User created in MongoDB' },
        { status: HttpStatusCode.Created },
      );
    } else {
      return NextResponse.json(
        { message: 'User not created in MongoDB' },
        { status: HttpStatusCode.BadRequest },
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
