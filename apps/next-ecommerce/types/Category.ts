import { ProductType } from './ProductType';

interface PrimaryCategory {
  name: string;
  description: string;
  hidden: boolean;
  subCategories?: string[];
  products?: ProductType[];
}
interface RootCategory {
  category: string;
  primaryCategories?: PrimaryCategory[];
}

export type { PrimaryCategory, RootCategory };
