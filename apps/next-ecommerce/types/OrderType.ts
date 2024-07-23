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

export default interface OrderType {
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
  status: string;
  mode: string;
  itemsPrice: number;
  shippingPrice: number;
  taxPrice: number;
  totalPrice: number;
  user: string;
  orderEmail?: string;
  razorpayOrderId?: string;
  stripeChargeId?: string;
  stripePaymentIntentId?: string;
  paymentMethod?: string;
  paid?: boolean;
  delivered?: boolean;
  deliveryDate?: Date;
  note?: string;
  isOriginalOrder?: boolean;
  exchangeOrder?: string;
  returnOrder?: string;
  trackingNumber?: string;
}
