/* eslint-disable @typescript-eslint/no-explicit-any */
import Cart from '@/models/cartModel';
import { CartItem, CartTotals } from '../../types/CartType';

export function getAddressObject(address: any) {
  return {
    id: address._id.toString(),
    default: address.default,
    fullName: address.fullName,
    address_line_1: address.address_line_1,
    address_line_2: address.address_line_2 ?? '',
    city: address.city,
    state: address.state,
    postCode: address.postCode,
    mobile: address.mobile,
  };
}

export function getCartModel(userCart: any) {
  return {
    ID: userCart.ID,
    commerceItems:
      userCart?.commerceItems?.map((item: any) => {
        delete item._id;
        return { ...item };
      }) ?? [],
    shippingAddress: userCart.shippingAddresses?.map(getAddressObject) ?? [],
    itemsPrice: userCart.itemsPrice ?? 0,
    itemsDiscount: userCart.itemsDiscount ?? 0,
    shippingPrice: userCart.shippingPrice ?? 0,
    shippingDiscount: userCart.shippingDiscount ?? 0,
    taxPrice: userCart.taxPrice ?? 0,
    totalPrice: userCart.totalPrice ?? 0,
    totalDiscount: userCart.totalDiscount ?? 0,
    orderDiscount: userCart.orderDiscount ?? 0,
    voucher: userCart.voucher ?? '',
    finalOrderAmount: userCart.finalOrderAmount ?? 0,
    user: userCart.user?._id.toString(),
  };
}

/**
 * Create to a custom cart item.
 * @function
 * @returns {CartItem} The converted cart item.
 */
export const createCustomCartItem = (customizations: {
  selectedColor: string;
  selectedSize: string;
  isBackPosterSelected: boolean;
  isLogoSelected: boolean;
  isPosterSelected: boolean;
  isSleeveSelected: boolean;
  isTextSelected: boolean;
}) => {
  const skuId = createCustomSKUId();

  let totalCustomizationsAmount = 0;
  if (customizations.isLogoSelected) {
    totalCustomizationsAmount += 100;
  }
  if (customizations.isPosterSelected) {
    totalCustomizationsAmount += 200;
  }
  if (customizations.isBackPosterSelected) {
    totalCustomizationsAmount += 200;
  }

  return {
    ID: skuId,
    name: 'Custom T-Shirt',
    color: customizations.selectedColor,
    size: customizations.selectedSize,
    quantity: 1,
    image: '/images/product/product-2-large-2.webp',
    price: 300,
    product: 'CUSTOM-TSHIRT',
    isCustomized: true,
    customizations: {
      frontprint: {
        price: 200,
        selected: customizations.isPosterSelected,
      },
      backprint: {
        price: 200,
        selected: customizations.isBackPosterSelected,
      },
      logo: {
        price: 100,
        selected: customizations.isLogoSelected,
      },
      totalAmount: totalCustomizationsAmount,
    },
    totalAmountWithCustomizations: 300 + totalCustomizationsAmount,
    discount: 0,
    selectedSize: '',
    selectedColor: '',
  };
};

/**
 * Converts a product to a cart item.
 * @param product - The product to convert.
 * @param selectedColor - The selected color for the cart item.
 * @param selectedSize - The selected size for the cart item.
 * @param selectedQuantity - The selected quantity for the cart item.
 * @returns The converted cart item.
 */
export const convertProductToCartItem = (
  product: any,
  selectedColor: string,
  selectedSize: string,
  selectedQuantity: number,
): CartItem => {
  return {
    ID: product.skuId,
    name: product.name,
    color: selectedColor,
    size: selectedSize,
    quantity: selectedQuantity,
    image: product.images[0],
    price: product.price.listPrice,
    product: product.skuId,
    isCustomized: false,
    customizations: {
      frontprint: {
        price: 0,
        selected: false,
      },
      backprint: {
        price: 0,
        selected: false,
      },
    },
    discount: 0,
    selectedSize: '',
    selectedColor: '',
  };
};

/**
 * Creates a new cart for the specified user.
 * @param user - Session User
 * @returns The created cart, or null if there was an error.
 */
export async function createCart(user: any) {
  try {
    const createdCart = await Cart.create({
      ID: createCartId(),
      commerceItems: [] as CartItem[],
      user: user.id,
      shippingAddress: {
        fullName: user.name,
      },
    });
    if (createdCart) {
      return createdCart;
    } else {
      console.error('Error creating cart: Cart not created');
      return null;
    }
  } catch (error) {
    console.error('Error creating cart:', error);
    return null;
  }
}

/**
 * Adds or merges a commerce item to the cart.
 * @param commerceItem - The commerce item to add or merge.
 * @param cart - The cart to add the commerce item to.
 * @param skuId - The ID of the SKU.
 * @param selectedColor - The selected color for the commerce item.
 * @param selectedSize - The selected size for the commerce item.
 * @param quantity - The quantity of the commerce item.
 * @returns The updated cart.
 */
export function addOrMerge(
  commerceItem: CartItem,
  cart: any,
  skuId: string,
  selectedColor: string,
  selectedSize: string,
  quantity: number,
) {
  const existingItem = cart.commerceItems?.find((item: any) => {
    return (
      item.ID === skuId &&
      item.color === selectedColor &&
      item.size === selectedSize
    );
  });

  // If the item already exists in the cart, update the quantity
  if (existingItem) {
    console.log('Item already exists in cart, updating quantity');
    existingItem.quantity += quantity;
  } else {
    // Otherwise, add the item to the cart
    cart.commerceItems = cart.commerceItems || [];
    cart.commerceItems.push(commerceItem);
  }

  return cart;
}

/**
 * Adds a commerce item to the cart.
 * @param commerceItem - The commerce item to add.
 * @param cart - The cart to add the commerce item to.
 * @returns The updated cart.
 */
export async function addOnlyToCart(commerceItem: CartItem, cart: any) {
  cart.commerceItems = cart.commerceItems || [];
  cart.commerceItems.push(commerceItem);
  return cart;
}

/**
 * Finds an existing cart for the specified user or creates a new one if none exists.
 * @param user- Session user
 * @returns The existing or created cart.
 */
export async function findExistingOrCreateCart(user: any) {
  if (!user?.id) {
    console.error('findExistingOrCreateCart: User not found');
    return null;
  }
  let cart = await Cart.findOne({ user: user.id }).lean(true);
  if (!cart) {
    console.log('findExistingOrCreateCart: Cart not found, creating new cart');
    cart = (await createCart(user)) as any;
  }
  return cart;
}

/**
 * Prepares the cart object for JSON serialization.
 * @param cart - The cart object to prepare.
 * @returns The prepared cart object.
 */
export function prepareCartJSON(cart: any) {
  return {
    ID: cart.ID,
    commerceItems:
      cart?.commerceItems?.map((item: any) => {
        delete item._id;
        return { ...item };
      }) ?? [],
    shippingAddress: cart.shippingAddress,
    itemsPrice: cart.itemsPrice ?? 0,
    itemsDiscount: cart.itemsDiscount ?? 0,
    shippingPrice: cart.shippingPrice ?? 0,
    shippingDiscount: cart.shippingDiscount ?? 0,
    taxPrice: cart.taxPrice ?? 0,
    totalPrice: cart.totalPrice ?? 0,
    totalDiscount: cart.totalDiscount ?? 0,
    orderDiscount: cart.orderDiscount ?? 0,
    voucher: cart.voucher ?? '',
    prorationFactor: cart.prorationFactor ?? 0,
    finalOrderAmount: cart.finalOrderAmount ?? 0,
    user: cart.user?._id.toString(),
  };
}

/**
 * Recalculates the prices and discounts of the cart.
 * @param cart - The cart to recalculate.
 */
export async function reCalculateCart(cart: any) {
  let itemsPrice = 0;
  let itemsDiscount = 0;
  let shippingPrice = 0;
  let shippingDiscount = 0;
  const prorationFactor = cart.prorationFactor ?? 0;

  cart.commerceItems.forEach((item: CartItem) => {
    itemsPrice += item.price * item.quantity;
    itemsDiscount += item?.discount ?? 0 * item.quantity;
  });

  cart.itemsPrice = itemsPrice;
  cart.itemsDiscount = itemsDiscount;
  cart.shippingPrice = shippingPrice;
  cart.shippingDiscount = shippingDiscount;
  cart.totalPrice =
    cart.itemsPrice + (cart.shippingPrice ?? 0) + (cart.taxPrice ?? 0);
  cart.orderDiscount =
    prorationFactor > 0
      ? Math.floor((cart.totalPrice / 100) * prorationFactor)
      : 0;
  cart.totalDiscount =
    cart.itemsDiscount +
    (cart.shippingDiscount ?? 0) +
    (cart.orderDiscount ?? 0);

  cart.finalOrderAmount = cart.totalPrice - cart.totalDiscount;
}

/**
 * Generates a unique custom product ID based on the current timestamp.
 * @returns {string} The generated custom product ID.
 */
export function createCustomSKUId(): string {
  const skuNumberPrefix = 'CUSTOMSKU';
  return `${skuNumberPrefix}-${new Date().toISOString().replace(/[-:.]/g, '')}`;
}

/**
 * Generates a unique cart ID based on the current timestamp.
 * @returns {string} The generated cart ID.
 */
export function createCartId(): string {
  const cartNumberPrefix = 'CART';
  return `${cartNumberPrefix}-${new Date().toISOString().replace(/[-:.]/g, '')}`;
}

/**
 * Calculates the price of a customized product based on the selected customizations.
 * @param {Record<string, { selected: boolean; price: number }>} customizations - The object containing the selected customizations and their prices.
 * @returns {number} The calculated price of the customized product.
 */
export function calculateCustomizedProductPrice(
  customizations: Record<string, { selected: boolean; price: number }>,
): number {
  return Object.values(customizations).reduce(
    (acc, customization) =>
      acc + (customization.selected ? customization.price : 0),
    0,
  );
}

/**
 * Calculates the total prices and discounts for the cart items.
 * @param {CartItem[]} cartItems - The array of cart items.
 * @returns {CartTotals} The object containing the calculated totals.
 */
export function calculateCartTotals(cartItems: CartItem[]): CartTotals {
  const totals: CartTotals = {
    itemsPrice: 0,
    itemsDiscount: 0,
    shippingPrice: 0,
    shippingDiscount: 0,
    taxPrice: 0,
    totalPrice: 0,
    totalDiscount: 0,
    orderDiscount: 0,
    finalOrderAmount: 0,
  };

  totals.itemsPrice = cartItems.reduce((acc, item) => {
    acc = acc + item.price * item.quantity;
    let customizationPrice = 0;
    if (item.isCustomized) {
      customizationPrice = calculateCustomizedProductPrice(
        item.customizations ?? {},
      );
    }
    return acc + customizationPrice;
  }, 0);
  // Item discount is applied to each item and saved WHOLE on the item
  totals.itemsDiscount = cartItems.reduce(
    (acc, item) => acc + (item.discount ?? 0),
    0,
  );
  totals.totalPrice =
    totals.itemsPrice + (totals.shippingPrice ?? 0) + (totals.taxPrice ?? 0);
  totals.orderDiscount = totals.orderDiscount ?? 0;
  totals.totalDiscount =
    totals.itemsDiscount +
    (totals.shippingDiscount ?? 0) +
    totals.orderDiscount;
  totals.finalOrderAmount = totals.totalPrice - totals.totalDiscount;

  return totals;
}

/**
 * Validates the cart by checking if it is empty, if any item quantity is zero or negative,
 * and if the prices and discounts are valid.
 * @param {CartItem[]} cartItems - The array of cart items.
 * @returns {boolean} True if the cart is valid, otherwise throws an error.
 * @throws {Error} If the cart is empty, if any item quantity is zero or negative,
 * or if the prices and discounts are invalid.
 */
export function validateCart(cartItems: CartItem[]): boolean {
  // Check if aart exists
  if (!cartItems) {
    throw new Error('Cart does not exist');
  }

  // Check if cart is empty
  if (!!cartItems && cartItems.length === 0) {
    throw new Error('Cart is empty');
  }

  // Check if any item quantity is zero or negative
  const invalidItems = cartItems.filter((item) => item.quantity <= 0);
  if (invalidItems.length > 0) {
    throw new Error('Invalid item quantity');
  }

  // Check prices and discounts
  const totals: CartTotals = calculateCartTotals(cartItems);

  if (totals.totalPrice <= 0) {
    throw new Error('Invalid total price');
  } else if ((totals.itemsDiscount ?? 0) > totals.itemsPrice) {
    throw new Error('Item Discount greater than items price');
  } else if ((totals.shippingDiscount ?? 0) > totals.totalPrice) {
    throw new Error('Shipping Discount greater than total price');
  } else if ((totals.orderDiscount ?? 0) > totals.totalPrice) {
    throw new Error('Order Discount greater than total price');
  } else if ((totals.totalDiscount ?? 0) > totals.totalPrice) {
    throw new Error('Total Discount greater than total price');
  } else if (totals.finalOrderAmount <= 0) {
    throw new Error('Final order amount less than zero');
  }

  // If all validations pass, return true
  return true;
}
