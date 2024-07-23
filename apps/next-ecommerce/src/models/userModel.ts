import mongoose, { Schema, model, Types } from 'mongoose';

export interface User extends Document {
  firstName: string;
  lastName: string;
  email: string;
  mobile?: string;
  password: string;
  badge: boolean;
  newsletter: boolean;
  isAdmin: boolean;
  passwordResetToken?: string;
  shippingAddresses?: Types.ObjectId[];
  wishlist?: string[];
}

const UserSchema = new Schema<User>(
  {
    firstName: {
      type: String,
      required: [true, 'Please provide a user name'],
      maxlength: [60, 'Name cannot be more than 60 characters'],
    },
    lastName: {
      type: String,
      required: [true, 'Please provide the last name.'],
      maxlength: [60, "Owner's Name cannot be more than 60 characters"],
    },
    email: {
      type: String,
      required: [true, 'Please specify the email.'],
      maxlength: [40, 'Species specified cannot be more than 40 characters'],
    },
    password: {
      type: String,
      required: [true, 'Please specify the password.'],
    },
    badge: {
      type: Boolean,
      default: false,
    },
    newsletter: {
      type: Boolean,
      default: false,
    },
    isAdmin: {
      type: Boolean,
      default: false,
    },
    passwordResetToken: {
      type: String,
    },
    mobile: {
      type: String,
      required: [false, 'Please specify the 10 digits mobile number'],
    },
    shippingAddresses: {
      type: [{ type: Schema.Types.ObjectId, ref: 'ShippingAddress' }],
    },
    wishlist: {
      type: [String],
      required: false,
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

export default mongoose.models.User || model<User>('User', UserSchema);
