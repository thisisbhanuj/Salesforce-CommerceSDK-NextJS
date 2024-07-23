import mongoose, { Document, Schema, Model } from 'mongoose';

// Interface for Return document
interface IReturn extends Document {
  ID: string;
  originalOrder: string;
  razorpay_refund_id: string;
  razorpay_payment_id: string;
  razorpay_order_id: string;
  status: string;
  mode?: string;
  commerceItem: string;
  paymentMethod: string;
  amountRefunded: number;
  reason?: string;
  note1?: string;
  note2?: string;
  isExchange?: boolean;
  isReturnOrder: boolean;
  user?: mongoose.Schema.Types.ObjectId;
  returnLabel?: string;
  createdAt: Date;
  updatedAt: Date;
}

// Return schema
const returnSchema: Schema<IReturn> = new Schema(
  {
    ID: { type: String, required: true, unique: true },
    originalOrder: { type: String, required: true },
    razorpay_refund_id: { type: String, required: true },
    razorpay_payment_id: { type: String, required: true },
    razorpay_order_id: { type: String, required: true },
    status: { type: String, required: true },
    mode: { type: String },
    commerceItem: { type: String, required: true },
    paymentMethod: { type: String, required: true },
    amountRefunded: { type: Number, required: true },
    reason: { type: String },
    note1: { type: String },
    note2: { type: String },
    isExchange: { type: Boolean, default: false },
    isReturnOrder: { type: Boolean, required: true, default: true },
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    returnLabel: { type: String },
  },
  {
    timestamps: true,
  },
);

// Return model
const Returns: Model<IReturn> = mongoose.model<IReturn>(
  'Returns',
  returnSchema,
);

export default Returns;
