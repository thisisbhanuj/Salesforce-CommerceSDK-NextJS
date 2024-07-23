import { Model, Schema, model } from 'mongoose';
import { Product } from './productModel';

// Interface for Primary Category
interface PrimaryCategory {
  name: string; // "Men", "Women", "Kids", etc.
  description: string; // Description of the primary category
  hidden: boolean; // Whether the category is hidden from the UI
  subCategories?: string[]; // Array of sub-categories within this primary category[]
  products?: (typeof Product)[]; // Array of Product documents within this primary category
}

// Interface for Root Category
interface RootCategory {
  category: string; // "root"
  primaryCategories: PrimaryCategory[]; // Array of primary categories under root
}

// Mongoose Schema for PrimaryCategory
const primaryCategorySchema = new Schema<PrimaryCategory>({
  name: { type: String, required: true, unique: true },
  description: { type: String, default: '', required: false },
  hidden: { type: Boolean, default: false },
  subCategories: { type: [String], default: [] },
  products: {
    type: [{ type: Schema.Types.ObjectId, ref: 'Product' }],
    default: [],
  },
});

// Mongoose Schema for RootCategory
const rootCategorySchema = new Schema<RootCategory>({
  category: { type: String, required: true, default: 'root' }, // Ensure it's always "root"
  primaryCategories: { type: [primaryCategorySchema], required: true },
});

let CategoryModel: Model<RootCategory>;
try {
  CategoryModel = model<RootCategory>('Category');
} catch {
  CategoryModel = model<RootCategory>('Category', rootCategorySchema);
}

export default CategoryModel;
