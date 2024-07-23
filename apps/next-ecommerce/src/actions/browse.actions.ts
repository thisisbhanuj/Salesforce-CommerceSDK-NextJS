'use server';

import connectDB from '@/lib/db';
import { ProductType } from '../../types/ProductType';
import CategoryModel from '@/models/categoryModel';
import { PrimaryCategory } from '@/Category';
import { Product } from '@/models/productModel';

/**
 * Server action to fetch navigation categories.
 * @returns {Object} An object containing the fetched category data and additional info.
 */
export async function fetchNavigationCategories() {
  try {
    await connectDB();

    // Fetch the existing root category
    const rootCategory = await CategoryModel.findOne({ category: 'root' });
    const activeCategories = rootCategory?.primaryCategories.filter(
      (primaryCategory) => !primaryCategory.hidden,
    );

    if (!activeCategories) {
      console.error('No categories found');
      return {
        categories: [],
        success: false,
        message: 'No categories found',
      };
    }

    if ((activeCategories as PrimaryCategory[])?.length > 0) {
      return {
        categories: JSON.stringify(activeCategories),
        success: true,
        message: 'Categories fetched successfully',
      };
    }
  } catch (error) {
    console.error('Error fetching categories:', error);
    return {
      categories: [],
      success: false,
      message: 'Error fetching categories',
    };
  }
}

/**
 * Server action to fetch products based on category and product type.
 * @param {string} category - The category of the products.
 * @param {string} productType - The type of the products.
 * @returns {Object} An object containing the fetched product data and additional info.
 */
export async function fetchCategoryProducts(
  category: string,
  productType: string,
) {
  try {
    await connectDB();
    const productsModel =
      category === 'all'
        ? await Product.find({ master: true })
        : await Product.find({
            category: category,
            productType: productType || 'tops',
            master: true,
          });

    if (productsModel.length > 0) {
      const products: ProductType[] = productsModel.map((product) => ({
        id: product.id,
        productType: product.productType,
        skuId: product.skuId,
        name: product.name,
        price: product.price,
        images: product.images,
        category: product.category,
        variation: product.variation,
        description: product.description,
        rating: product.rating,
        numReviews: product.numReviews,
        color: product.color,
        colorCode: product.colorCode,
        sizes: product.sizes,
        inStock: product.inStock,
        sold: product.sold,
        available: product.available,
        gender: product.gender,
        material: product.material,
        new: product.new,
        sale: product.sale,
        master: product.master,
        parentProduct: product.parentProduct,
        quantity: product.quantity,
        slug: product.slug,
      }));

      console.log(
        '************* fetchCategoryProducts : Fetched **************',
      );
      return {
        productsModel: JSON.stringify(products),
        success: true,
        message: 'Products fetched successfully',
      };
    }
  } catch (error) {
    console.error(`Error fetching products of category ${category}:`, error);
    return {
      productData: [],
      success: false,
      message: `Error fetching products of category ${category}:`,
    };
  }
}

/**
 * Server action to fetch product data for SEO.
 * @param {string} skuId - The SKU ID of the product.
 * @returns {Object} An object containing the fetched product data and additional info.
 */
export async function fetchProductForSEO(skuId: string) {
  try {
    await connectDB();
    const product = await Product.findOne({ id: skuId });

    if (!product) {
      return {
        productModel: {},
        success: false,
        message: `Product with SKU ID ${skuId} not found`,
      };
    }

    const productModelforSEO = {
      id: product.id,
      skuId: product.skuId,
      name: product.name,
      price: {
        listPrice: product.price.listPrice,
        salesPrice: product.price.salesPrice ?? 0,
        embroideryLogoPrice: product.price.embroideryLogoPrice ?? 0,
        embroiderySleevePrice: product.price.embroiderySleevePrice ?? 0,
        A3Price: product.price.A3Price ?? 0,
        A4Price: product.price.A4Price ?? 0,
      },
      images: product.images ?? [],
      category: product.category,
      description: product.description,
    };

    return {
      productModelforSEO: productModelforSEO,
      success: true,
      message: 'Product fetched successfully',
    };
  } catch (error) {
    console.error(`Error fetching product with SKU ID ${skuId}:`, error);
  }
}

/**
 * Server action to fetch category data for SEO.
 * @param {string} cid - The Category ID of the product.
 * @returns {Object} An object containing the fetched category data and additional info.
 */
export async function fetchCategoryForSEO(cid: string) {
  try {
    await connectDB();
    const rootCategory = await CategoryModel.findOne({ category: 'root' });
    const currentCategory = rootCategory?.primaryCategories.filter(
      (primaryCategory) => primaryCategory.name === cid,
    );

    if (!currentCategory || currentCategory.length === 0) {
      return {
        categoryModelforSEO: {},
        success: false,
        message: `Category ID ${cid} not found`,
      };
    }

    const categoryModelforSEO = {
      name: currentCategory[0].name,
      description: currentCategory[0]?.description,
      subCategories: currentCategory[0]?.subCategories,
    };

    return {
      categoryModelforSEO: JSON.stringify(categoryModelforSEO),
      success: true,
      message: 'Category fetched successfully',
    };
  } catch (error) {
    console.error(`Error fetching category with ID ${cid}:`, error);
  }
}
