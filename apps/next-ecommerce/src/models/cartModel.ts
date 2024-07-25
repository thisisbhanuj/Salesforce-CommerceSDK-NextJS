import mongoose, { Document, Schema, Model, Types } from 'mongoose';

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

// Interface for Cart document
interface ICart extends Document {
  ID: string;
  commerceItems?: ICommerceItem[];
  shippingAddress?: {
    fullName: { type: string };
    address1: { type: string };
    address2: { type: string };
    city: { type: string };
    state: { type: string };
    zipCode: { type: string };
    mobile: { type: string };
  };
  itemsPrice?: number;
  itemsDiscount?: number;
  shippingPrice?: number;
  shippingDiscount?: number;
  taxPrice?: number;
  totalPrice: number;
  totalDiscount?: number;
  orderDiscount?: number;
  voucher?: string;
  finalOrderAmount?: number;
  prorationFactor?: number;
  user?: Types.ObjectId;
}

// Cart schema
const cartSchema: Schema<ICart> = new Schema(
  {
    ID: { type: String, required: true, unique: true },
    commerceItems: [
      {
        ID: { type: String, required: true },
        product: { type: String, required: true },
        name: { type: String, required: true },
        color: { type: String, required: true },
        size: { type: String, required: true },
        quantity: { type: Number, required: true },
        image: { type: String, required: false },
        price: { type: Number, required: true },
        isCustomized: { type: Boolean, default: false },
        customizations: {
          frontprint: {
            price: { type: Number, required: false },
            selected: { type: Boolean },
          },
          backprint: {
            price: { type: Number, required: false },
            selected: { type: Boolean },
          },
          logo: {
            price: { type: Number, required: false },
            selected: { type: Boolean },
          },
          totalAmount: { type: Number, required: false },
        },
        totalAmountWithCustomizations: { type: Number, required: false },
        discount: { type: Number, required: false },
        selectedSize: { type: String, required: false },
        selectedColor: { type: String, required: false },
      },
    ],
    shippingAddress: {
      fullName: { type: String, required: false },
      address1: { type: String, required: false },
      address2: { type: String, required: false },
      city: { type: String, required: false },
      state: { type: String, required: false },
      zipCode: { type: String, required: false },
      mobile: { type: String, required: false },
    },
    itemsDiscount: { type: Number, required: false },
    itemsPrice: { type: Number, required: false },
    shippingPrice: { type: Number, required: false },
    shippingDiscount: { type: Number, required: false },
    taxPrice: { type: Number, required: false },
    totalPrice: { type: Number, required: false, default: 0 },
    totalDiscount: { type: Number, required: false },
    orderDiscount: { type: Number, required: false },
    prorationFactor: { type: Number, required: false },
    voucher: { type: String, required: false },
    finalOrderAmount: { type: Number, required: false },
    user: { type: Schema.Types.ObjectId, ref: 'User', required: false },
  },
  {
    timestamps: true,
    toJSON: {
      versionKey: false,
      virtuals: false,
      transform: (_, ret) => {
        delete ret._id;
      },
    },
  },
);

// Cart model
let Cart: Model<ICart>;
try {
  Cart = mongoose.model<ICart>('Cart');
} catch {
  Cart = mongoose.model<ICart>('Cart', cartSchema);
}

export default Cart;
