import mongoose, { Document, Schema, Model, Types } from 'mongoose';
import { OrderStatus, OrderMode } from '@/Statuses';

// Interface for Commerce Item
interface ICommerceItem {
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
  };
  trackingNumber?: string;
  isReturned?: boolean;
  state?: string;
}

// Interface for Shipping Address
interface IShippingAddress {
  fullName: string;
  address1: string;
  address2?: string;
  city: string;
  state: string;
  zipCode: string;
  mobile: string;
}

// Interface for Order document
interface IOrder extends Document {
  ID: string;
  status: string;
  mode?: string;
  commerceItems: ICommerceItem[];
  shippingAddress?: IShippingAddress;
  itemsPrice?: number;
  shippingPrice?: number;
  taxPrice?: number;
  totalPrice?: number;
  orderDiscount?: number;
  totalDiscount?: number;
  voucher?: string;
  finalOrderAmount?: number;
  user: Types.ObjectId;
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
  trackingNumber?: string[];
}

// Commerce Item definition
const commerceItemDef = {
  ID: { type: String, required: true },
  name: { type: String, required: true },
  color: { type: String, required: true },
  size: { type: String, required: true },
  quantity: { type: Number, required: true },
  image: { type: String, required: true },
  price: { type: Number, required: true },
  product: { type: String, required: true },
  isCustomized: { type: Boolean },
  customizations: {
    frontprint: {
      price: { type: Number, required: true },
      selected: { type: Boolean },
    },
    backprint: {
      price: { type: Number, required: true },
      selected: { type: Boolean },
    },
  },
  trackingNumber: { type: String },
  isReturned: { type: Boolean },
  state: { type: String },
};

// Shipping Address definition
const shippingAddressDef = {
  fullName: { type: String, required: false },
  address1: { type: String, required: false },
  address2: { type: String, required: false },
  city: { type: String, required: false },
  state: { type: String, required: false },
  zipCode: { type: String, required: false },
  mobile: { type: String, required: false },
};

// Order schema
const orderSchema: Schema<IOrder> = new Schema(
  {
    ID: { type: String, required: true, unique: true },
    status: {
      type: String,
      required: true,
      default: OrderStatus.Created,
      enum: [
        OrderStatus.Created,
        OrderStatus.Pending,
        OrderStatus.Processing,
        OrderStatus.Shipped,
        OrderStatus.Delivered,
        OrderStatus.Cancelled,
      ],
    },
    mode: {
      type: String,
      required: true,
      default: OrderMode.Online,
      enum: [OrderMode.Online, OrderMode.COD, OrderMode.Subscription],
    },
    commerceItems: [commerceItemDef],
    shippingAddress: shippingAddressDef,
    itemsPrice: { type: Number, required: false },
    shippingPrice: { type: Number, required: false },
    taxPrice: { type: Number, required: false },
    totalPrice: { type: Number, required: false },
    orderDiscount: { type: Number, required: false },
    totalDiscount: { type: Number, required: false },
    finalOrderAmount: { type: Number, required: false },
    voucher: { type: String, required: false },
    user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    orderEmail: { type: String, required: false },
    paymentMethod: {
      type: String,
      required: false,
      enum: [
        'Stripe',
        'Razorpay',
        'Wallet',
        'NetBanking',
        'UPI',
        'PayPal',
        'Paytm',
        'GooglePay',
        'PhonePe',
        'AmazonPay',
        'ApplePay',
        'SamsungPay',
      ],
    },
    razorpayOrderId: { type: String, required: false },
    stripeChargeId: { type: String, required: false },
    stripePaymentIntentId: { type: String, required: false },
    paid: { type: Boolean, required: false },
    delivered: { type: Boolean, required: false },
    deliveryDate: { type: Date, required: false },
    note: { type: String, required: false },
    isOriginalOrder: { type: Boolean, required: false },
    exchangeOrder: { type: String, required: false },
    returnOrder: { type: String, required: false },
    trackingNumber: { type: Array, required: false },
  },
  {
    timestamps: true,
  },
);

// Order model
let Order: Model<IOrder>;
try {
  Order = mongoose.model<IOrder>('Order');
} catch {
  Order = mongoose.model<IOrder>('Order', orderSchema);
}

export default Order;
