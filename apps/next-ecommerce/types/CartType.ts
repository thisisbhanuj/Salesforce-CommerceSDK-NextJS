export interface CommerceItemType {
  ID: string;
  name: string;
  color: string;
  size: string;
  quantity: number;
  image: string;
  price: number;
  product: string;
  isCustomized?: boolean;
  customizations?: {
    frontprint?: {
      price: number;
      selected?: boolean;
    };
    backprint?: {
      price: number;
      selected?: boolean;
    };
    logo?: {
      price: number;
      selected?: boolean;
    };
    totalAmount?: number;
  };
  totalAmountWithCustomizations?: number;
  discount?: number;
  selectedSize?: string;
  selectedColor?: string;
}

/**
 * Interface for the cart line item.
 * @interface
 */
export interface CartItem extends CommerceItemType {}

/**
 * Interface for the state of the cart.
 * @interface
 * @property {CartItem[]} cartArray - An array of cart items.
 */
export interface CartState {
  cartArray: CartItem[];
}

export interface CartType {
  ID: string;
  commerceItems: CommerceItemType[];
  shippingAddress?: {
    fullName: { type: string };
    address1: { type: string };
    address2: { type: string };
    city: { type: string };
    state: { type: string };
    zipCode: { type: string };
    mobile: { type: string };
  };
  itemsPrice: number;
  itemsDiscount: number;
  shippingPrice: number;
  shippingDiscount: number;
  taxPrice: number;
  totalPrice: number;
  totalDiscount?: number;
  orderDiscount?: number;
  voucher?: string;
  finalOrderAmount: number;
  prorationFactor?: number;
  user?: string;
}

export interface CartTotals {
  itemsPrice: number;
  itemsDiscount?: number;
  shippingPrice?: number;
  shippingDiscount?: number;
  taxPrice?: number;
  totalPrice: number;
  totalDiscount?: number;
  orderDiscount?: number;
  finalOrderAmount?: number;
}
