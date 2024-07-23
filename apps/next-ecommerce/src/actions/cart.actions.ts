'use server';

import { revalidatePath } from 'next/cache';

import connectDB from '@/lib/db';
import { getCurrentSession, getCurrentUser } from '@/lib/session';
import Cart from '@/models/cartModel';
import User from '@/models/userModel';
import ShippingAddress from '@/models/shippingAddress';
import {
  addOnlyToCart,
  addOrMerge,
  convertProductToCartItem,
  createCustomCartItem,
  findExistingOrCreateCart,
  getAddressObject,
  getCartModel,
  prepareCartJSON,
  reCalculateCart,
} from '@/utility/cartHelpers';
import { findSku } from '@/utility/productHelper';
import { CartType } from '@/CartType';

/**
 * Applies a voucher to the cart.
 * @param voucherCode - The code of the voucher to apply.
 * @param voucherDiscount - The discount to apply.
 * @param prorationFactor - The proration factor to apply.
 * @returns An object containing the updated user's cart model, success status, and message.
 */
export async function applyVoucherOnCart(
  voucherCode: string,
  voucherDiscount: number,
  prorationFactor: number,
) {
  const session = await getCurrentSession();

  if (!session?.user?.id) {
    return {
      userCartModel: {} as CartType,
      success: false,
      message: 'applyVoucher : User not found',
    };
  }

  try {
    const cart = await Cart.findOne({ user: session.user.id });

    if (!cart || cart.totalPrice <= 0) {
      return {
        userCartModel: {} as CartType,
        success: false,
        message: 'applyVoucher : Cart not found or empty',
      };
    }

    if (cart.voucher?.toLowerCase() === voucherCode.toLowerCase()) {
      return {
        userCartModel: {} as CartType,
        success: false,
        message: 'applyVoucher : Voucher already applied',
      };
    }

    if (voucherDiscount <= 0) {
      return {
        userCartModel: {} as CartType,
        success: false,
        message: 'applyVoucher : Invalid voucher discount',
      };
    }

    const updatedCart = await Cart.findByIdAndUpdate(
      cart._id,
      {
        totalDiscount: (cart.totalDiscount ?? 0) + voucherDiscount,
        voucher: voucherCode.toLowerCase(),
        orderDiscount: voucherDiscount,
        finalOrderAmount: cart.totalPrice - voucherDiscount,
        prorationFactor,
      },
      { new: true },
    ).lean(true);

    if (updatedCart) {
      const userCartModel = prepareCartJSON(updatedCart);
      console.info('Voucher applied:', userCartModel);

      return {
        userCartModel: JSON.stringify(userCartModel),
        success: true,
        message: `applyVoucher : Voucher ${voucherCode} applied to cart`,
      };
    }
  } catch (error) {
    console.log(error);
    return {
      userCartModel: {} as CartType,
      success: false,
      message: 'applyVoucher : Error applying voucher',
    };
  } finally {
    revalidatePath('/cart');
  }
}


/**
 * Creates a new cart for the specified user.
 * It is intended to be used when a user logs in and may not have a cart.
 * IMPORTANT : It SHOULD NOT br used for checkout pages.
 * @param user - Session User
 * @returns The created cart, or null if there was an error.
 */
export async function existingOrNewCart() {
  const session = await getCurrentSession();
  try {
    if (session?.user?.id) {
      await connectDB();
      const userCart = await findExistingOrCreateCart(session?.user);
      if (!userCart) {
        return {
          userCartModel: {} as CartType,
          success: false,
          message: 'existingOrNewCart : Cart not found',
        };
      }

      const userCartModel: CartType = {
        ID: userCart.ID,
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        commerceItems:
          userCart?.commerceItems?.map((item: any) => {
            delete item._id;
            return { ...item };
          }) ?? [],
        shippingAddress: userCart.shippingAddress,
        itemsPrice: userCart.itemsPrice ?? 0,
        itemsDiscount: userCart.itemsDiscount ?? 0,
        shippingPrice: userCart.shippingPrice ?? 0,
        shippingDiscount: userCart.shippingDiscount ?? 0,
        taxPrice: userCart.taxPrice ?? 0,
        totalPrice: userCart.totalPrice ?? 0,
        finalOrderAmount: userCart.finalOrderAmount ?? 0,
        totalDiscount: userCart.totalDiscount ?? 0,
        orderDiscount: userCart.orderDiscount ?? 0,
        voucher: userCart.voucher ?? '',
        prorationFactor: userCart.prorationFactor ?? 0,
        user: userCart.user?._id.toString(),
      };

      return {
        userCartModel: JSON.stringify(userCartModel),
        success: true,
        message: 'existingOrNewCart : Cart fetched',
      };
    } else {
      return {
        userCartModel: {},
        success: false,
        message: 'existingOrNewCart : User not found',
      };
    }
  } catch (error) {
    console.log(error);
    return {
      userCartModel: {},
      success: false,
      message: 'existingOrNewCart : Error fetching cart',
    };
  }
}

/**
 * Fetches the cart for the current user.
 * IMPORTANT: This function is intended for checkout pages,
 * as we dont want empty/invalid cart at checkout.
 * Moreover, we are not creating a new cart if not found.
 * @returns An object containing the user's cart model, success status, and message.
 */
export async function fetchCartForUser() {
  const userFromSession = await getCurrentUser().then((user) => user);
  if (!userFromSession)
    return {
      userCartModel: {} as CartType,
      success: false,
      message: 'User not found',
    };

  try {
    await connectDB();
    const currentUser = await User.findById(userFromSession.id).populate(
      'shippingAddresses',
    );
    if (!currentUser) {
      return {
        userCartModel: {} as CartType,
        success: false,
        message: 'fetchCartForUser : User not found',
      };
    }

    const userCart = await Cart.findOne({ user: currentUser.id }).lean(true);
    if (!userCart) {
      return {
        userCartModel: {} as CartType,
        success: false,
        message: `Cart with User ID ${currentUser.id} not found`,
      };
    }

    const userCartModel = getCartModel(userCart);
    const shippingGroups = currentUser.shippingAddresses?.map(getAddressObject);

    return {
      userCartModel: JSON.stringify(userCartModel),
      shippingGroups: JSON.stringify(shippingGroups),
      success: true,
      message: 'fetchCartForUser : Cart Model Created',
    };
  } catch (error) {
    console.error(`Error fetching cart `, error);
    return {
      userCartModel: {} as CartType,
      success: false,
      message: 'Error fetching cart',
    };
  }
}

/**
 * Deletes the cart for the current user.
 * @param cartId - The ID of the cart to delete.
 * @returns An object containing the success status and message.
 */
export async function deleteCart(cartId: string) {
  const session = await getCurrentSession();

  try {
    if (session?.user?.id && cartId) {
      await connectDB();
      const result = await Cart.deleteOne({
        ID: cartId,
        user: session.user.id,
      });
      if (result?.deletedCount > 0) {
        console.log(`deleteCart : Cart deleted with ID ${cartId}`);
        return {
          success: true,
          message: `deleteCart : Cart deleted with ID ${cartId}`,
        };
      } else {
        console.error(`deleteCart : deletedCount is ${result.deletedCount}`);
        return {
          success: false,
          message: `deleteCart : deletedCount is ${result.deletedCount}`,
        };
      }
    } else {
      console.error(`deleteCart : User not found`);
      return {
        success: false,
        message: 'deleteCart : User not found',
      };
    }
  } catch (error) {
    console.error(error);
    return {
      success: false,
      message: `deleteCart : Error deleting cart with ID ${cartId}`,
    };
  } finally {
    revalidatePath('/');
  }
}

/**
 * Adds SKU to the cart.
 * @param skuId - The ID of the SKU to add.
 * @param selectedColor - The selected color for the SKU.
 * @param selectedSize - The selected size for the SKU.
 * @param quantity - The quantity of the SKU to add.
 * @returns An object containing the updated user's cart model, success status, and message.
 */
export async function addSkuToCart(
  skuId: string,
  selectedColor: string,
  selectedSize: string,
  quantity: number,
) {
  const session = await getCurrentSession();

  try {
    if (session?.user?.id) {
      await connectDB();
      const cart = await findExistingOrCreateCart(session?.user);

      if (cart && cart.user) {
        const product = await findSku(skuId);
        const commerceItem = convertProductToCartItem(
          product,
          selectedColor,
          selectedSize,
          quantity,
        );
        addOrMerge(
          commerceItem,
          cart,
          skuId,
          selectedColor,
          selectedSize,
          quantity,
        );

        await reCalculateCart(cart);

        const updatedCart = await Cart.findByIdAndUpdate(cart._id, cart, {
          new: true,
          runValidators: true,
          upsert: true,
        }).lean(true);

        if (updatedCart) {
          const userCartModel = prepareCartJSON(updatedCart);

          return {
            userCartModel: JSON.stringify(userCartModel),
            success: true,
            message: 'addToCart : Product added to cart',
          };
        }
      } else {
        return {
          userCartModel: {} as CartType,
          success: false,
          message: 'addToCart : Cart not found',
        };
      }
    } else {
      return {
        userCartModel: {} as CartType,
        success: false,
        message: 'addToCart : User not found',
      };
    }
  } catch (error) {
    console.log(error);
    return {
      userCartModel: {} as CartType,
      success: false,
      message: 'addToCart : Error adding to cart',
    };
  } finally {
    revalidatePath('/cart');
  }
}

/**
 * Updates the quantity and totals of a SKU in the cart.
 * @param skuId - The ID of the SKU to update.
 * @param cumulativeQuantity - The cumulative quantity of the SKU.
 * @param selectedColor - The selected color for the SKU.
 * @param selectedSize - The selected size for the SKU.
 * @returns An object containing the updated user's cart model, success status, and message.
 */
export async function updateCartQuantityAndTotals(
  skuId: string,
  cumulativeQuantity: number,
  selectedColor: string,
  selectedSize: string,
) {
  const session = await getCurrentSession();

  try {
    if (session?.user?.id) {
      await connectDB();
      const cart = await Cart.findOne({ user: session.user.id });
      if (!cart) {
        return {
          userCartModel: {} as CartType,
          success: false,
          message: 'updateCart : Cart not found, nothing to update',
        };
      }

      const itemToUpdate = await Cart.findOneAndUpdate(
        {
          user: session.user.id,
          'commerceItems.product': skuId,
          'commerceItems.color': selectedColor,
          'commerceItems.size': selectedSize,
        },
        { $set: { 'commerceItems.$.quantity': cumulativeQuantity } },
        { new: true },
      );

      if (!itemToUpdate) {
        return {
          userCartModel: {} as CartType,
          success: false,
          message: 'updateCart : Item not found in cart',
        };
      }

      await reCalculateCart(itemToUpdate);
      await itemToUpdate.save();

      const updatedCart = await Cart.findById(itemToUpdate._id).lean(true);

      if (updatedCart) {
        const userCartModel = prepareCartJSON(updatedCart);
        console.info('Quantity and totals updated:', userCartModel);

        return {
          userCartModel: JSON.stringify(userCartModel),
          success: true,
          message: `addToCart : Product ${skuId} updated in cart`,
        };
      }
    } else {
      return {
        userCartModel: {} as CartType,
        success: false,
        message: 'addToCart : User not found',
      };
    }
  } catch (error) {
    console.log(error);
    return {
      userCartModel: {} as CartType,
      success: false,
      message: 'addToCart : Error updating cart',
    };
  } finally {
    revalidatePath('/cart');
  }
}

/**
 * Removes an item from the cart by ID.
 * @param ID - The ID of the item to remove.
 * @returns An object containing the updated user's cart model, success status, and message.
 */
export async function removeItemFromCartById(ID: string) {
  const session = await getCurrentSession();

  try {
    if (session?.user?.id) {
      await connectDB();
      let cart = await Cart.findOne({ user: session.user.id });
      if (!cart) {
        return {
          userCartModel: {} as CartType,
          success: false,
          message: 'removeItemFromCartById : Cart not found, nothing to remove',
        };
      }

      const itemToRemove = await Cart.findOneAndUpdate(
        { user: session.user.id, 'commerceItems.ID': ID },
        { $pull: { commerceItems: { ID: ID } } },
        { new: true },
      );

      if (!itemToRemove) {
        return {
          userCartModel: {} as CartType,
          success: false,
          message: 'removeItemFromCartById : Item not found in cart',
        };
      }

      await reCalculateCart(itemToRemove);
      await itemToRemove.save();

      const updatedCart = await Cart.findById(itemToRemove._id).lean(true);

      if (updatedCart) {
        const userCartModel = prepareCartJSON(updatedCart);
        console.info('Item removed:', userCartModel);

        return {
          userCartModel: JSON.stringify(userCartModel),
          success: true,
          message: `removeItemFromCartById : Product ${ID} removed from cart`,
        };
      }
    } else {
      return {
        userCartModel: {} as CartType,
        success: false,
        message: 'removeItemFromCartById : User not found',
      };
    }
  } catch (error) {
    console.log(error);
    return {
      userCartModel: {} as CartType,
      success: false,
      message: 'removeItemFromCartById : Error removing from cart',
    };
  } finally {
    revalidatePath('/cart');
  }
}

/**
 * Updates the shipping address in the cart.
 * @param sgid - The ID of the shipping address to add.
 * @returns An object containing the updated user's cart model, success status, and message.
 */
export async function addShippingAddressToCart(sgid: string) {
  const session = await getCurrentSession();

  try {
    if (session?.user?.id) {
      await connectDB();
      const cart = await Cart.findOne({ user: session.user.id });
      if (!cart) {
        return {
          userCartModel: {} as CartType,
          success: false,
          message:
            'addShippingAddressToCart : Cart not found, nothing to update',
        };
      }

      const shippingAddress = await ShippingAddress.findById(sgid);
      if (!shippingAddress) {
        return {
          userCartModel: {} as CartType,
          success: false,
          message: 'addShippingAddressToCart : Shipping address not found',
        };
      }

      console.log('Shipping Address:', shippingAddress);

      const updatedCart = await Cart.findByIdAndUpdate(
        cart._id,
        {
          shippingAddress: {
            fullName: session.user.name,
            address1: shippingAddress?.address_line_1,
            address2: shippingAddress?.address_line_2,
            city: shippingAddress?.city,
            state: shippingAddress?.state,
            zipCode: shippingAddress?.postCode,
            mobile: shippingAddress?.mobile,
          },
        },
        { new: true },
      );

      if (!updatedCart) {
        return {
          userCartModel: {} as CartType,
          success: false,
          message:
            'addShippingAddressToCart : Shipping address not found in cart',
        };
      }

      const userCartModel = prepareCartJSON(updatedCart);
      console.info('Shipping address added:', userCartModel);

      return {
        userCartModel: JSON.stringify(userCartModel),
        success: true,
        message: `addShippingAddressToCart : Shipping address ${sgid} added to cart`,
      };
    } else {
      return {
        userCartModel: {} as CartType,
        success: false,
        message: 'addShippingAddressToCart : User not found',
      };
    }
  } catch (error) {
    console.log(error);
    return {
      userCartModel: {} as CartType,
      success: false,
      message:
        'addShippingAddressToCart : Error adding shipping address to cart',
    };
  } finally {
    revalidatePath('/cart');
  }
}

/**
 * Clears the cart for the current user.
 * @returns An object containing the updated user's cart model, success status, and message.
 */
export async function clearCart() {
  const session = await getCurrentSession();

  try {
    if (session?.user?.id) {
      await connectDB();
      let cart = await Cart.findOne({ user: session.user.id });
      if (!cart) {
        return {
          userCartModel: {} as CartType,
          success: false,
          message: 'clearCart : Cart not found, nothing to clear',
        };
      }

      cart.commerceItems = [];
      cart.itemsPrice = 0;
      cart.itemsDiscount = 0;
      cart.shippingPrice = 0;
      cart.shippingDiscount = 0;
      cart.taxPrice = 0;
      cart.totalPrice = 0;
      cart.totalDiscount = 0;
      cart.orderDiscount = 0;
      cart.finalOrderAmount = 0;
      cart.voucher = '';
      cart.prorationFactor = 0;

      await cart.save();

      const updatedCart = await Cart.findById(cart._id).lean(true);

      if (updatedCart) {
        const userCartModel = prepareCartJSON(updatedCart);
        console.info('Cart cleared:', userCartModel);

        return {
          userCartModel: JSON.stringify(userCartModel),
          success: true,
          message: `clearCart : Cart cleared`,
        };
      }
    } else {
      return {
        userCartModel: {} as CartType,
        success: false,
        message: 'clearCart : User not found',
      };
    }
  } catch (error) {
    console.log(error);
    return {
      userCartModel: {} as CartType,
      success: false,
      message: 'clearCart : Error clearing cart',
    };
  } finally {
    revalidatePath('/cart');
  }
}

/**
 * Adds a custom product to the cart.
 * @param customizations - The customizations for the product.
 * @returns An object containing the updated user's cart model, success status, and message.
 */
export async function addCustomProductToCart(customizations: {
  selectedColor: string;
  selectedSize: string;
  isBackPosterSelected: boolean;
  isLogoSelected: boolean;
  isPosterSelected: boolean;
  isSleeveSelected: boolean;
  isTextSelected: boolean;
}) {
  const session = await getCurrentSession();
  try {
    if (session?.user?.id) {
      await connectDB();
      const cart = await findExistingOrCreateCart(session?.user);

      if (cart && cart.user) {
        const commerceItem = createCustomCartItem(customizations);
        await addOnlyToCart(commerceItem, cart);
        await reCalculateCart(cart);

        const updatedCart = await Cart.findByIdAndUpdate(cart._id, cart, {
          new: true,
          runValidators: true,
          upsert: true,
        }).lean(true);

        if (updatedCart) {
          const userCartModel = prepareCartJSON(updatedCart);

          return {
            userCartModel: JSON.stringify(userCartModel),
            success: true,
            message: 'addCustomProductToCart : Product added to cart',
          };
        }
      } else {
        return {
          userCartModel: {} as CartType,
          success: false,
          message: 'addCustomProductToCart : Cart not found',
        };
      }
    } else {
      return {
        userCartModel: {} as CartType,
        success: false,
        message: 'addCustomProductToCart : User not found',
      };
    }
  } catch (error) {
    console.log(error);
    return {
      userCartModel: {} as CartType,
      success: false,
      message: 'addCustomProductToCart : Error adding to cart',
    };
  } finally {
    revalidatePath('/cart');
  }
}
