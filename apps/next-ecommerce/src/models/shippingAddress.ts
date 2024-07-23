import mongoose from 'mongoose';

export interface ShippingAddress extends mongoose.Document {
  title: string;
  default: boolean;
  address_line_1: string;
  address_line_2: string;
  city: string;
  state: string;
  postCode: string;
  mobile?: string;
}

const ShippingAddressSchema = new mongoose.Schema<ShippingAddress>(
  {
    title: {
      type: String,
      required: [true, 'Please provide name.'],
      maxlength: [15, 'Name cannot be more than 20 characters'],
      default: 'Home',
    },
    default: {
      type: Boolean,
      default: true,
    },
    address_line_1: {
      type: String,
      required: [true, 'Address Line 1'],
      maxlength: [100, 'Address Line 1 cannot be more than 100 characters'],
    },
    address_line_2: {
      type: String,
      required: [false, 'Address Line 2'],
      maxlength: [100, 'Address Line 1 cannot be more than 100 characters'],
    },
    city: {
      type: String,
      required: [true, 'Please specify the city'],
    },
    state: {
      type: String,
      required: [true, 'Please specify the state'],
    },
    postCode: {
      type: String,
      required: [true, 'Please specify the post code'],
    },
    mobile: {
      type: String,
      required: [true, 'Please specify the 10 digits mobile number'],
    },
  },
  {
    timestamps: true,
    toJSON: {
      versionKey: false,
      virtuals: true,
      transform: (_, ret) => {
        delete ret._id;
      },
    },
  },
);

export default mongoose.models.ShippingAddress ||
  mongoose.model<ShippingAddress>('ShippingAddress', ShippingAddressSchema);
