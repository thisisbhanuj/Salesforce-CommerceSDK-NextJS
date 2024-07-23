/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
'use server';

import { revalidatePath } from 'next/cache';
import { HttpStatusCode } from 'axios';
import { redirect, RedirectType } from 'next/navigation';

import connectDB from '@/lib/db';
import { getCurrentUser } from '@/lib/session';
import { createToken, hashPassword } from '@/lib/auth';
import User from '@/models/userModel';
import ShippingAddress from '@/models/shippingAddress';
import NewsletterSubscription from '@/models/newsletter';
import { findUserId } from '@/utility/userHelpers';
import { sendPasswordResetEmail, subscribeEmail } from '@/utility/emailHelper';
import { ShippingAddressType } from '../../types/CheckoutType';

/**
 * Subscribes the user to the newsletter.
 *
 * @param {object} formData - Form data containing user email.
 * @returns {object} An object with success state and message on success.
 */
export async function subscribeEmailNewsletter(formData: FormData) {
  try {
    await connectDB();
    const email = formData.get('email') as string;
    if (!email) {
      return { success: false, message: 'Please check the email for typos' };
    }

    const isExisting = await NewsletterSubscription.findOne({ email });
    if (isExisting) {
      return { success: false, message: 'Email already subscribed' };
    }

    const subscribed = await NewsletterSubscription.create({ email });
    if (!subscribed) {
      return { success: false, message: 'Subscription Failed' };
    }

    //Asynchronous Email Sending
    const emailSent = await subscribeEmail(email).catch(() => false);

    return {
      success: true,
      message: emailSent
        ? 'Subscription Successful'
        : 'Subscription Successful, but email delivery might be delayed.',
    };
  } catch (error: any) {
    return { success: false, message: error.message ?? 'An error occurred' };
  }
}

/**
 * Forgot password action to send an email to the user with a link to reset the password
 *
 * @param {object} prevState - Previous state containing success state, message, and data.
 * @param {object} formData - Form data containing user information.
 * @returns {object} An object with success state, message, and data on success.
 */
export async function forgotPasswordAction(
  prevState: { success: boolean; message?: string },
  formData: FormData,
) {
  try {
    const email = formData.get('email') as string;
    if (!email) {
      return { success: false, message: 'Please check the email for typos' };
    }

    await connectDB();
    const user = await User.findOne({ email });

    if (user) {
      const token = await createToken({
        email: user.email,
        id: user._id,
        type: 'reset',
      });

      const response = await sendPasswordResetEmail(email, token);

      if (!response) {
        console.error('Email not sent');
        return { success: false, message: 'Email not sent' };
      }
    }

    return {
      success: true,
      message:
        'If the account was created with the email, you will receive a link.',
    };
  } catch (error: any) {
    return { success: false, message: error.message ?? 'An error occurred' };
  }
}

/**
 * Fetches user shipping addresses from the database.
 *
 * @param {object} prevState - Previous state containing success state, data, userId, and message.
 * @returns {object} An object with success state, data (array of shipping addresses), userId, and message.
 */
export async function fetchAddressesAction(prevState: {
  success: boolean;
  data?: ShippingAddressType[];
  userId?: string;
  message?: string;
}) {
  const userId = await findUserId(prevState.userId);
  if (!userId) {
    console.error('fetchAddressesAction : No user id found');
    return { success: false, message: 'Invalid User ID' };
  }

  try {
    await connectDB();
    const user = await User.findById(userId);
    if (!user) {
      return { success: false, message: `User ${userId} not found`, userId };
    } else if (user?.shippingAddresses?.length > 0) {
      const shippingAddresses = await ShippingAddress.find({
        _id: { $in: user.shippingAddresses },
      });

      if (shippingAddresses?.length > 0) {
        const addressesObj: ShippingAddressType[] = shippingAddresses.map(
          (address) => ({
            title: address.title,
            address_line_1: address.address_line_1,
            address_line_2: address.address_line_2,
            city: address.city,
            state: address.state,
            postCode: address.postCode,
            mobile: address.mobile,
            id: address._id.toString(),
          }),
        );

        return {
          success: true,
          data: addressesObj,
          userId: userId,
          message: 'Shipping Addresses for user found',
        };
      } else {
        return {
          success: true,
          message: 'No saved addresses',
          userId: userId,
          data: [],
        };
      }
    } else {
      return {
        success: true,
        message: 'No saved addresses',
        userId: userId,
        data: [],
      };
    }
  } catch (error) {
    console.error(error);
    return {
      success: false,
      message: 'Error fetching shipping addresses',
      userId: userId,
    };
  }
}

/**
 * Adds a new profile address for the user.
 *
 * @param {object} prevState - Previous state containing success state, data, userId, and message.
 * @param {object} formData - Form data containing new address information.
 * @returns {object} An object with success state, data (array containing the new address), and userId.
 */
export async function addNewProfileAddressActionWithFormState(
  prevState: {
    success: boolean;
    data: ShippingAddressType[] | null;
    userId: string | undefined;
    message: string;
  },
  formData: FormData,
) {
  const userId: string = await findUserId(prevState.userId);
  if (!userId) {
    console.error('fetchAddressesAction : No user id found');
    return {
      ...prevState,
      success: false,
      data: null,
      message: 'Invalid User ID',
      userId: userId,
    };
  }

  try {
    await connectDB();

    const user = await User.findById(userId);
    if (!user) {
      console.error(`User ${userId} not found`);
      return {
        ...prevState,
        success: false,
        data: null,
        userId: userId,
        message: `User ${userId} not found`,
      };
    }

    if (!formData) {
      console.error('Form data not found');
      return {
        ...prevState,
        success: false,
        data: null,
        userId: userId,
        message: 'Form data not found',
      };
    }

    const newShippingAddress: ShippingAddressType = {
      title: formData.get('title') as string,
      default: true,
      address_line_1: formData.get('address_line_1') as string,
      address_line_2: formData.get('address_line_2') as string,
      city: formData.get('city') as string,
      state: formData.get('state') as string,
      postCode: formData.get('postCode') as string,
      mobile: formData.get('mobile') as string,
    };

    const shippingAddress = await ShippingAddress.create(newShippingAddress);

    if (!shippingAddress) {
      console.error('Shipping Address not created in MongoDB');
      return {
        ...prevState,
        success: false,
        data: null,
        userId: userId,
        message: 'Shipping Address not created in MongoDB',
      };
    } else {
      user.populate('shippingAddresses');
      user.shippingAddresses.push(shippingAddress._id);
      await user.save();

      if (user.shippingAddresses?.length > 0) {
        const addressesObj: ShippingAddressType = {
          ...newShippingAddress,
          id: shippingAddress._id.toString(),
        };

        console.debug('New Address added to Profile: ', addressesObj);

        return {
          ...prevState,
          success: true,
          data: [addressesObj],
          userId: userId,
          message: 'New Address added to Profile',
        };
      }
    }
  } catch (error) {
    console.log('Error adding new shipping address: ', error);
    return {
      ...prevState,
      success: false,
      data: null,
      userId: userId,
      message: 'Error adding new shipping address',
    };
  }

  revalidatePath('/checkout');
  redirect('/checkout', RedirectType.replace);
}

/**
 * Adds a new profile address for the user.
 *
 * @param {object} formData - Form data containing new address information.
 * @returns {object} An object with success state, data (array containing the new address), and userId.
 */
export async function addNewProfileAddressAction(formData: FormData) {
  const userId: string = await findUserId('');
  if (!userId) {
    console.error('fetchAddressesAction : No user id found');
    return {
      success: false,
      data: null,
      message: 'Invalid User ID',
      userId: userId,
    };
  }

  try {
    await connectDB();

    const user = await User.findById(userId);
    if (!user) {
      console.error(`User ${userId} not found`);
      return {
        success: false,
        data: null,
        userId: userId,
        message: `User ${userId} not found`,
      };
    }

    if (!formData) {
      console.error('Form data not found');
      return {
        success: false,
        data: null,
        userId: userId,
        message: 'Form data not found',
      };
    }

    const newShippingAddress: ShippingAddressType = {
      title: formData.get('title') as string,
      default: true,
      address_line_1: formData.get('address_line_1') as string,
      address_line_2: formData.get('address_line_2') as string,
      city: formData.get('city') as string,
      state: formData.get('state') as string,
      postCode: formData.get('postCode') as string,
      mobile: formData.get('mobile') as string,
    };

    const shippingAddress = await ShippingAddress.create(newShippingAddress);

    if (!shippingAddress) {
      console.error('Shipping Address not created in MongoDB');
      return {
        success: false,
        data: null,
        userId: userId,
        message: 'Shipping Address not created in MongoDB',
      };
    } else {
      user.populate('shippingAddresses');
      user.shippingAddresses.push(shippingAddress._id);
      await user.save();

      if (user.shippingAddresses?.length > 0) {
        const addressesObj: ShippingAddressType = {
          ...newShippingAddress,
          id: shippingAddress._id.toString(),
        };

        console.debug('New Address added to Profile: ', addressesObj);

        return {
          success: true,
          data: [addressesObj],
          userId: userId,
          message: 'New Address added to Profile',
        };
      }
    }
  } catch (error) {
    console.log('Error adding new shipping address: ', error);
    return {
      success: false,
      data: null,
      userId: userId,
      message: 'Error adding new shipping address',
    };
  }

  revalidatePath('/checkout');
  redirect('/checkout', RedirectType.push);
}

/**
 * Updates an existing shipping address for the user.
 *
 * @param {object} prevState - Previous state containing success state, message, and address ID.
 * @param {object} formData - Form data containing updated address information.
 * @returns {object} An object with success state, message, and addressId.
 */
export async function updateAddressAction(
  prevState: { success: boolean; message: string; addressId: string },
  formData: FormData,
) {
  const addressId = prevState.addressId
    ? prevState.addressId
    : (formData.get('addressId') as string);

  try {
    await connectDB();

    if (!addressId) {
      console.log('Address ID not present on page');
      return { success: false, message: 'Invalid Address ID' };
    }
    const updatedShippingAddress: ShippingAddressType = {
      title: formData.get('title') as string,
      default: true,
      address_line_1: formData.get('address_line_1') as string,
      address_line_2: formData.get('address_line_2') as string,
      city: formData.get('city') as string,
      state: formData.get('state') as string,
      postCode: formData.get('postCode') as string,
      mobile: formData.get('mobile') as string,
    };
    const updatedAddress = await ShippingAddress.findByIdAndUpdate(
      addressId,
      updatedShippingAddress,
      { new: true },
    );
    if (!updatedAddress) {
      console.log('Address not updated on Profile');
      return { success: false, message: 'Address not updated, please retry.' };
    } else {
      console.log('Address updated on Profile');
      return {
        success: true,
        message: 'Address updated!',
        addressId: addressId,
      };
    }
  } catch (error) {
    console.error(error);
    return { success: false, message: 'Address not updated, please retry.' };
  } finally {
    revalidatePath('/profile');
    redirect('/profile', RedirectType.replace);
  }
}

/**
 * Deletes a shipping address for the user.
 *
 * @param {string} userId - User ID for which to delete the address.
 * @param {string} addressId - ID of the address to be deleted.
 * @returns {object} An object with success state, message, and status code.
 */
export async function deleteAddressAction(userId: string, addressId: string) {
  if (!(await findUserId(userId))) {
    console.error('fetchAddressesAction : No user id found');
    return { success: false, message: 'Invalid User ID' };
  }

  try {
    await connectDB();

    const user = await User.findById(userId);
    if (!user) {
      console.error(`User ${userId} not found`);
      return {
        success: false,
        message: `User ${userId} not found`,
        status: HttpStatusCode.NotFound,
      };
    }

    // Update user's shippingAddresses first
    user.shippingAddresses = user.shippingAddresses.filter(
      (address: any) => address._id.toString() !== addressId,
    );
    await user.save();

    // Now proceed with deleting the address document
    const deletedAddress = await ShippingAddress.findByIdAndDelete(addressId);
    if (!deletedAddress) {
      console.log('Address not deleted on Profile');
      return {
        success: false,
        message: 'Address not deleted on Profile',
        status: HttpStatusCode.BadRequest,
      };
    } else {
      console.debug('Address deleted on Profile');
      return {
        success: true,
        message: 'Address deleted on Profile',
        status: HttpStatusCode.Accepted,
      };
    }
  } catch (error) {
    console.error(error);
    return {
      success: false,
      message: error,
      status: HttpStatusCode.BadRequest,
    };
  } finally {
    revalidatePath('/profile');
    redirect('/profile', RedirectType.push);
  }
}

/**
 * Changes the user's password.
 *
 * @param {object} prevState - Previous state containing success state, message, and userId.
 * @param {object} formData - Form data containing current password, new password, and confirm password.
 * @returns {object} An object with success state, message, and userId on success, indicating password update.
 */
export async function changePasswordAction(
  prevState: { success: boolean; message: string; userId: string },
  formData: FormData,
) {
  const userId = await findUserId(prevState.userId);
  if (!userId) {
    console.error('fetchAddressesAction : No user id found');
    return { success: false, message: 'Invalid User ID' };
  }

  try {
    console.log(
      'changePasswordAction : Updating password for user with id : ',
      userId,
    );

    const objectToUpdate = {
      password: formData.get('password') as string,
      newPassword: formData.get('newPassword') as string,
      confirmPassword: formData.get('confirmPassword') as string,
    };

    const updates: { [key: string]: any } = {};
    if (objectToUpdate.password) {
      const hashedPassword = await hashPassword(objectToUpdate.password);
      updates.password = hashedPassword;
    }
    if (objectToUpdate.newPassword) {
      const hashedPassword = await hashPassword(objectToUpdate.newPassword);
      updates.password = hashedPassword;
    }
    if (objectToUpdate.confirmPassword) {
      const hashedPassword = await hashPassword(objectToUpdate.newPassword);
      updates.password = hashedPassword;
    }

    await connectDB();

    const user = await User.findById(userId);
    if (user) {
      if (user.password !== updates.password) {
        console.log('User Password not matching in DB');
        return {
          success: false,
          message: 'User password not matching in DB',
        };
      }

      if (updates.newPassword !== updates.confirmPassword) {
        console.log('New Password and Confirm Password do not match');
        return {
          success: false,
          message: 'New Password and Confirm Password do not match',
        };
      }

      user.findByIdAndUpdate(userId, updates, { new: true });

      console.log('User Password updated in DB');
      return {
        success: true,
        message: 'User password updated in DB',
        userId: userId,
      };
    } else {
      console.log('User Password not updated in DB');
      return {
        success: false,
        message: 'User profile not updated in MongoDB',
      };
    }
  } catch (error: any) {
    return {
      success: false,
      message: error.message ?? 'An error occurred',
    };
  }
}

/**
 * Updates the user's account information (first name, last name, phone number).
 *
 * @param {object} prevState - Previous state containing success state, message, and userId.
 * @param {object} formData - Form data containing updated user information.
 * @returns {object} An object with success state, message, and userId on success.
 */
export async function updateAccountInfo(
  prevState: { success: boolean; message: string; userId: string },
  formData: FormData,
) {
  const userId = await findUserId(prevState.userId);
  if (!userId) {
    console.error('fetchAddressesAction : No user id found');
    return { success: false, message: 'Invalid User ID' };
  }

  try {
    console.log(
      'updateAccountInfo: Updating account info for user with id : ',
      userId,
    );

    const objectToUpdate = {
      firstName: formData.get('firstName') as string,
      lastName: formData.get('lastName') as string,
      phoneNumber: formData.get('phoneNumber') as string,
    };

    const updates: { [key: string]: any } = {};
    if (objectToUpdate.firstName) {
      updates.firstName = objectToUpdate.firstName;
    }
    if (objectToUpdate.lastName) {
      updates.lastName = objectToUpdate.lastName;
    }
    if (objectToUpdate.phoneNumber) {
      updates.mobile = objectToUpdate.phoneNumber;
    }

    await connectDB();

    const user = await User.findByIdAndUpdate(userId, updates, { new: true });
    if (user) {
      console.log('updateAccountInfo: User Details updated in DB');
      return {
        success: true,
        message: 'User updated in DB',
        userId: userId,
      };
    } else {
      return {
        success: false,
        message: 'User profile not updated in MongoDB',
      };
    }
  } catch (error: any) {
    return {
      success: false,
      message: error.message ?? 'An error occurred',
    };
  }
}

/**
 *
 * @param prevState  - Previous state containing success state, data, userId, sku, and message.
 * @param formData - Form data containing review information.
 * @returns {object} An object with success state, data, userId, sku, and message on success.
 */
export async function saveReviewAction(
  prevState: { success: boolean; data: string; userId: string; sku?: string },
  formData: FormData,
) {
  const userId = await findUserId(prevState.userId);
  if (!userId) {
    console.error('fetchAddressesAction : No user id found');
    return { ...prevState, success: false, data: 'Invalid User ID' };
  }

  try {
    const review = {
      rating: formData.get('rating') as string,
      review: formData.get('review') as string,
      sku: prevState.sku,
      userId: userId,
    };

    console.log(review);

    // await connectDB();

    // const user = await User.findById(userId);
    // if (!user) {
    //     return { success: false, message: `User ${userId} not found` };
    // }

    // user.reviews.push(review);
    // await user.save();

    return {
      ...prevState,
      success: true,
      data: 'Review saved successfully',
    };
  } catch (error: any) {
    return {
      ...prevState,
      data: error.message ?? 'An error occurred',
    };
  }
}

/*
 * @param prevState  - Previous state containing success state, data, userId, sku, and message.
 * @param formData - Form data containing review information.
 * @returns {object} An object with success state, data, userId, sku, and message on success.
 */
export async function addNewShippingAddressesAction(formData: FormData) {
  try {
    await connectDB();

    const userFromSession = await getCurrentUser().then((user) => user);
    if (!userFromSession)
      return {
        success: false,
        message: 'User not found',
        status: HttpStatusCode.BadRequest,
      };

    const currentUser = await User.findById(userFromSession.id);
    if (!currentUser)
      return {
        success: false,
        message: 'User not found',
        status: HttpStatusCode.BadRequest,
      };

    const newShippingAddress: ShippingAddressType = {
      title: formData.get('title') as string,
      default: true,
      address_line_1: formData.get('address_line_1') as string,
      address_line_2: formData.get('address_line_2') as string,
      city: formData.get('city') as string,
      state: formData.get('state') as string,
      postCode: formData.get('postCode') as string,
      mobile: formData.get('mobile') as string,
    };

    const shippingAddress = await ShippingAddress.create(newShippingAddress);
    if (!shippingAddress) {
      return {
        success: false,
        message: 'Shipping Address not created in MongoDB',
        status: HttpStatusCode.BadRequest,
      };
    }
    currentUser.populate('shippingAddresses');
    currentUser.shippingAddresses.push(shippingAddress._id);
    await currentUser.save();

    return { success: true, status: HttpStatusCode.Accepted };
  } catch (error) {
    console.log('Error adding new shipping address: ', error);
    return {
      success: false,
      message: error,
      status: HttpStatusCode.BadRequest,
    };
  } finally {
    revalidatePath('/checkout');
  }
}

/**
 * Updates user's wishlist.
 *
 * @param {string[]} wishlistArray - Array of product IDs to be added to the wishlist.
 * @returns {object} An object with success state and message on success.
 *
 **/
export async function updateWishlistAction(wishlistArray: string[]) {
  const userId = await findUserId(undefined);
  if (!userId) {
    console.error('updateWishlistAction : No user id found');
    return { success: false, data: 'Invalid User ID' };
  }

  try {
    await connectDB();
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { wishlist: wishlistArray },
      { new: true },
    );
    if (!updatedUser) {
      return { success: false, data: 'Wishlist not updated' };
    }

    return {
      success: true,
      data: 'Wishlist updated successfully',
    };
  } catch (error: any) {
    return {
      success: false,
      message: error.message ?? 'An error occurred',
    };
  }
}

/**
 * Fetches user's wishlist.
 *
 * @returns {object} An object with success state, wishlist and message on success.
 *
 **/
export async function fetchWishlistAction() {
  const userId = await findUserId(undefined);
  if (!userId) {
    console.error('fetchWishlistAction : No user id found');
    return { success: false, data: 'Invalid User ID' };
  }

  try {
    await connectDB();
    const user = await User.findById(userId);
    if (!user) {
      return { success: false, message: `User ${userId} not found` };
    }

    return {
      success: true,
      wishlist: JSON.stringify(user.wishlist),
      message: 'Wishlist fetched successfully',
    };
  } catch (error: any) {
    return {
      success: false,
      message: error.message ?? 'An error occurred',
    };
  }
}
