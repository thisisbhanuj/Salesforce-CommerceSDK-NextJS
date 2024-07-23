import { ShippingAddressType } from './CheckoutType';

export interface User {
  firstName: string;
  lastName: string;
  email: string;
  mobile?: string;
  password: string;
  badge: boolean;
  newsletter: boolean;
  isAdmin: boolean;
  passwordResetToken?: string;
  shippingAddresses?: { type: ShippingAddressType }[];
  wishlist: string[];
  savedCart?: string;
}
