import mongoose, { Model, Schema } from 'mongoose';
import NewsletterSubscriptionType from '@/NewsletterSubscriptionType';

const subscriptionSchema: Schema<NewsletterSubscriptionType> = new Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true,
    },
    isSubscribed: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
    toJSON: {
      versionKey: false,
      virtuals: true,
    },
  },
);

let NewsletterSubscription: Model<NewsletterSubscriptionType>;
try {
  NewsletterSubscription = mongoose.model<NewsletterSubscriptionType>(
    'NewsletterSubscription',
  );
} catch {
  NewsletterSubscription = mongoose.model<NewsletterSubscriptionType>(
    'NewsletterSubscription',
    subscriptionSchema,
  );
}

export default NewsletterSubscription;
