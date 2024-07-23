import { NextRequest, NextResponse } from 'next/server';
import { HttpStatusCode } from 'axios';

import connectDB from '@/lib/db';
import User from '@/models/userModel';
import ShippingAddress from '@/models/shippingAddress';

export async function GET(
  _: NextRequest,
  { params }: { params: { id: string } },
) {
  try {
    await connectDB();
    const user = await User.findById(params.id);
    if (!user) {
      return NextResponse.json(
        { message: `User ${params.id} not found` },
        { status: HttpStatusCode.NotFound },
      );
    } else if (user?.shippingAddresses?.length > 0) {
      const shippingAddresses = await ShippingAddress.find({
        _id: { $in: user.shippingAddresses },
      });
      return NextResponse.json(shippingAddresses);
    } else {
      return NextResponse.json(
        { message: 'Shipping Addresses for user not present' },
        { status: HttpStatusCode.Ok },
      );
    }
  } catch (error) {
    console.error('GET Shipping Address Failed');
    return NextResponse.json(
      { message: error },
      { status: HttpStatusCode.BadRequest },
    );
  }
}

export async function POST(
  req: NextRequest,
  { params }: { params: { id: string } },
) {
  try {
    await connectDB();
    const user = await User.findById(params.id);
    if (!user) {
      return NextResponse.json(
        { message: `User ${params.id} not found` },
        { status: HttpStatusCode.NotFound },
      );
    } else {
      const newAddress = new ShippingAddress(req.body);
      const savedAddress = await newAddress.save();

      user.shippingAddresses.push(savedAddress._id);
      await user.save();

      return NextResponse.json(savedAddress);
    }
  } catch (error) {
    console.error('POST Shipping Address Failed');
    return NextResponse.json(
      { message: error },
      { status: HttpStatusCode.BadRequest },
    );
  }
}

/* Insert Dummy Data */
// export async function POST(_: NextRequest, { params }: { params: { id: string } }) {
//     try {
//         await connectDB();
//         const user = await User.findById(params.id);

//         const dummyAddressesData = await ShippingAddress.create(
//             {
//                 title: "Home",
//                 default: true,
//                 address_line_1: "123 Main Street",
//                 city: "City",
//                 state: "State",
//                 postCode: "12345",
//                 mobile: "1234567890"
//             },
//             {
//                 title: "Work",
//                 default: false,
//                 address_line_1: "456 Elm Street",
//                 city: "City",
//                 state: "State",
//                 postCode: "54321",
//                 mobile: "9876543210"
//             }
//         );

//         if (!!dummyAddressesData) {
//             // Insert dummy shipping addresses into the database and associate them with the created users
//             const insertedAddresses = await ShippingAddress.insertMany(dummyAddressesData);
//             user.shippingAddresses = insertedAddresses.map(addr => addr._id);
//             await user.save();
//         }

//         return NextResponse.json(user);

//     } catch (error) {
//         console.error("Adding Shipping Address Failed");
//         return NextResponse.json({ message: error }, { status: HttpStatusCode.BadRequest });
//     }
// }

// export async function DELETE(_: NextRequest, { params }: { params: { id: string } }) {
//     try {
//         await connectDB();
//         const user = await User.findById(params.id);
//         if (user?.shippingAddresses?.length > 0) {
//             await User.findByIdAndDelete(user._id);
//             return NextResponse.json({ message: `Shipping Addresses for user ${params.id} has been deleted` });
//         }
//         return NextResponse.json({ message: `Shipping Addresses for user ${params.id} not found` }, { status: HttpStatusCode.NotFound });
//     } catch (error) {
//         return NextResponse.json({ message: error }, { status: HttpStatusCode.BadRequest });
//     }
// }

// export async function PATCH(request: NextRequest, { params }: { params: { id: string, shippingAddressId: string } }) {
//     try {
//         const { shippingAddressId } = params;
//         const body = await request.json();
//         const updates: Partial<ShippingAddress> = {
//             title: body.title,
//             default: body.default,
//             address_line_1: body.address_line_1,
//             address_line_2: body.address_line_2,
//             city: body.city,
//             state: body.state,
//             postCode: body.postCode,
//             mobile: body.mobile
//         };

//         await connectDB();
//         const user = await User.findById(params.id);
//         if (!user) {
//             return NextResponse.json({ message: `User with ID ${params.id} not found` }, { status: HttpStatusCode.NotFound });
//         }

//         const shippingAddressIndex = user.shippingAddresses.findIndex(addr => addr._id.toString() === shippingAddressId);
//         if (shippingAddressIndex === -1) {
//             return NextResponse.json({ message: `Shipping address with ID ${shippingAddressId} not found for user ${params.id}` }, { status: HttpStatusCode.NotFound });
//         }

//         user.shippingAddresses[shippingAddressIndex].set(updates);
//         await user.save();

//         return NextResponse.json({ message: `Shipping address with ID ${shippingAddressId} for user ${params.id} has been updated` });
//     } catch (error) {
//         return NextResponse.json({ message: error }, { status: HttpStatusCode.BadRequest });
//     }
// }
