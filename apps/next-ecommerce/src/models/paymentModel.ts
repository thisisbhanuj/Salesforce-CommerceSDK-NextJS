import mongoose, { Document, Schema, Model } from 'mongoose';

// Interface for Payment document
interface IPayment extends Document {
  mode: string;
  method: string;
  stripe_payment_intent_id?: string;
  stripe_charge_id?: string;
  razorpay_payment_id?: string;
  razorpay_order_id?: string;
  razorpay_signature?: string;
  razorpay_event_id?: string;
  last4?: string;
  card_type?: string;
}

// Payment schema
const paymentSchema: Schema<IPayment> = new Schema(
  {
    mode: { type: String, required: true, default: 'razorpay' },
    method: { type: String, required: true, default: 'Card' },
    stripe_payment_intent_id: { type: String, required: false },
    stripe_charge_id: { type: String, required: false },
    razorpay_payment_id: { type: String, required: false },
    razorpay_order_id: { type: String, required: false },
    razorpay_signature: { type: String, required: false },
    razorpay_event_id: { type: String, required: false },
    last4: { type: String, required: false },
    card_type: { type: String, required: false },
  },
  {
    timestamps: true,
  },
);

// Payment model
let Payment: Model<IPayment>;
try {
  Payment = mongoose.model<IPayment>('Payment');
} catch {
  Payment = mongoose.model<IPayment>('Payment', paymentSchema);
}

export default Payment;
