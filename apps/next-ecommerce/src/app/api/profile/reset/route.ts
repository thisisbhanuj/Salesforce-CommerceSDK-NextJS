import { NextRequest, NextResponse } from 'next/server';
import { HttpStatusCode } from 'axios';

import { hashPassword, verifyToken } from '@/lib/auth';
import connectDB from '@/lib/db';
import User from '@/models/userModel';

const handleError = (error: any) => {
  console.error(error);
  return NextResponse.json(
    { message: error },
    { status: HttpStatusCode.BadRequest },
  );
};

// This API endpoint is used to reset the password of the user.
export async function POST(request: NextRequest) {
  const body = await request.json();
  const { token, password } = body;

  // Validate required fields
  if (!token || !password) {
    return handleError(
      new Error('Missing required fields: token and password'),
    );
  }

  try {
    const verifiedPayload = await verifyToken(token);
    if (!verifiedPayload) {
      return NextResponse.json(
        { message: 'Token is invalid' },
        { status: HttpStatusCode.BadRequest },
      );
    }

    console.debug('verifiedPayload : ' + JSON.stringify(verifiedPayload));

    const hashedPassword = await hashPassword(password);

    await connectDB();

    const user = await User.findOneAndUpdate(
      { email: verifiedPayload.email },
      {
        password: hashedPassword,
      },
    );

    if (user) {
      return NextResponse.json(
        { user, message: 'User updated in MongoDB' },
        { status: HttpStatusCode.Created },
      );
    } else {
      return NextResponse.json(
        { message: 'User not updated in MongoDB' },
        { status: HttpStatusCode.BadRequest },
      );
    }
  } catch (error) {
    console.log(error);
    handleError(new Error('An error occurred while resetting the password'));
  }
}
