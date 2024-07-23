import mongoose, { Document, Schema, Model } from 'mongoose';

// Interface for Variation
interface IVariation {
  skuId: string;
  color: string;
  colorCode: string;
  colorImage: string;
  image: string;
}

// Interface for Product document
export interface IProduct extends Document {
  id: string;
  name: string;
  master: boolean;
  parentProduct: string;
  productType: string;
  skuId: string;
  variation: IVariation[];
  images: Array<string>;
  color: string;
  colorCode: string;
  sizes: Array<string>;
  category: string;
  material: string;
  description: string;
  gender: string;
  new: boolean;
  sale: boolean;
  price: {
    listPrice: number;
    salesPrice: number;
    embroideryLogoPrice: number;
    embroiderySleevePrice: number;
    A3Price: number;
    A4Price: number;
  };
  available: boolean;
  inStock: number;
  sold: number;
  quantity: number;
  quantityPurchase: number;
  rating: number;
  numReviews: number;
  isCustom: boolean;
  options: {
    frontprint: {
      selected: boolean;
      price: number;
    };
    backprint: {
      selected: boolean;
      price: number;
    };
  };
  slug: string;
}

// Product Schema
const productSchema: Schema<IProduct> = new Schema(
  {
    id: { type: String, required: true, unique: true },
    name: { type: String, required: true, unique: true },
    master: { type: Boolean, default: true, required: true },
    productType: { type: String, required: false, unique: false },
    parentProduct: { type: String, required: false, unique: false },
    skuId: { type: String, required: false, unique: true },
    variation: [
      {
        skuId: { type: String, required: false, unique: false },
        color: { type: String, required: false, unique: false },
        colorCode: { type: String, required: false, unique: false },
        colorImage: { type: String, required: false, unique: false },
        image: { type: String, required: false, unique: false },
      },
    ],
    images: { type: [String] },
    color: { type: String, required: false, unique: false },
    colorCode: { type: String, required: false, unique: false },
    sizes: { type: [String] },
    gender: { type: String, required: false, unique: false },
    new: { type: Boolean, required: false, default: true, unique: false },
    sale: { type: Boolean, required: false, default: false, unique: false },
    category: { type: String, required: true },
    material: { type: String, required: true },
    description: { type: String, required: true },
    price: {
      listPrice: { type: Number, required: true },
      salesPrice: { type: Number, default: 0, required: false },
      embroideryLogoPrice: { type: Number, default: 0, required: false },
      embroiderySleevePrice: { type: Number, default: 0, required: false },
      A3Price: { type: Number, default: 0, required: false },
      A4Price: { type: Number, default: 0, required: false },
    },
    available: { type: Boolean, default: false, required: true },
    inStock: { type: Number, default: 10, required: true },
    sold: { type: Number, required: false },
    quantity: { type: Number, required: false },
    quantityPurchase: { type: Number, required: false },
    rating: { type: Number, required: false },
    numReviews: { type: Number, required: false },
    isCustom: { type: Boolean, default: false },
    options: {
      frontprint: {
        selected: { type: Boolean, default: false },
        price: { type: Number },
      },
      backprint: {
        selected: { type: Boolean, default: false },
        price: { type: Number },
      },
    },
    slug: { type: String, required: false },
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

// ERORR: OverwriteModelError: Cannot overwrite Product model once compiled.
// If this code is run more than once
// (for example, if you're watching files and re-running your code
// whenever a file changes), Mongoose will try to compile the Product model again,
// causing the OverwriteModelError.
// To avoid this error, check if the model already exists before compiling it.
let Product: Model<IProduct>;
try {
  Product = mongoose.model<IProduct>('Product');
} catch {
  Product = mongoose.model<IProduct>('Product', productSchema);
}

export { Product };
