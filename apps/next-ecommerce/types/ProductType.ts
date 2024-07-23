// Interface for Review document
interface Review {
  email: string;
  name: string;
  comment?: string;
  rating: number;
  createdAt: Date;
  updatedAt: Date;
}

// Interface for Variation document
interface Variation {
  skuId: string;
  color: string;
  colorCode: string;
  colorImage: string;
  image: string;
}

// Interface for Product document
export interface ProductType {
  id: string;
  name: string;
  master: boolean;
  skuId: string;
  parentProduct: string;
  productType: string;
  variation: Variation[];
  images: Array<string>;
  sizes: Array<string>;
  material: string;
  color: string;
  colorCode: string;
  category: string;
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
  quantityPurchase?: number;
  rating?: number;
  numReviews?: number;
  reviews?: Review[];
  isCustom?: boolean;
  options?: {
    frontprint: {
      selected: boolean;
      price?: number;
    };
    backprint: {
      selected: boolean;
      price?: number;
    };
  };
  slug: string;
}
