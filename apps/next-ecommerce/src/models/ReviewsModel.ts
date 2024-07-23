import mongoose, { Document, Schema, Model, Types } from 'mongoose';

// Interface for Review document
interface IReview extends Document {
  userId: Types.ObjectId;
  productId: Types.ObjectId;
  heading: string;
  comment: string;
  rating: number;
}

// Review schema
const reviewSchema: Schema<IReview> = new Schema(
  {
    userId: { type: Schema.Types.ObjectId, ref: 'User' },
    productId: { type: Schema.Types.ObjectId, ref: 'Product' },
    heading: { type: String, required: true },
    comment: { type: String, required: true },
    rating: { type: Number, required: true },
  },
  {
    timestamps: true,
    toJSON: {
      versionKey: false,
      virtuals: true,
    },
  },
);

// Review model
let Review: Model<IReview>;
try {
  Review = mongoose.model<IReview>('Review');
} catch {
  Review = mongoose.model<IReview>('Review', reviewSchema);
}

export default Review;
