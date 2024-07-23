import { cache } from 'react';

import images from '@/utility/localImageHelper';
import { RestApiClient } from '@/utility/restApiClient';
import { DesignStateType } from '@/DesignStateType';
import { ProductType } from '@/ProductType';
import { PrimaryCategory } from '@/Category';

/**
 *
 * @param page The name of the page.
 * @param testMode A flag to indicate if the function is running in test mode.
 * @returns The design model of the page.
 */
const cachedDetchPageDesign = cache(async (page: string, testMode = false) => {
  if (testMode) {
    return {
      name: 'pdp',
      id: 'pdp',
      componentPath: '/product/Detail/ProductDisplayPage',
      sections: [
        {
          id: 'section1',
          componentPath: '/components/product/Detail/ImageContainer',
          order: 1,
        },
        {
          id: 'section2',
          componentPath: '/components/product/Detail/PurchaseView',
          order: 2,
        },
        {
          id: 'section3',
          componentPath: '/components/product/Detail/SubjectiveInformation',
          order: 3,
        },
        {
          id: 'section4',
          componentPath: '/components/product/Detail/RelatedProducts',
          order: 4,
        },
        {
          id: 'section5',
          componentPath: '/components/product/Detail/Reviews',
          order: 5,
        },
      ],
      gridContainers: [
        {
          id: 'container1',
          name: 'ImageContainer',
          sections: ['section1'],
          layout: {
            columns: 1,
          },
        },
        {
          id: 'container2',
          name: 'PurchaseView',
          sections: ['section2'],
          layout: {
            columns: 1,
          },
        },
        {
          id: 'container3',
          name: 'SubjectiveInformation',
          sections: ['section3'],
          layout: {
            columns: 2,
          },
        },
        {
          id: 'container4',
          name: 'RelatedProducts',
          sections: ['section4'],
          layout: {
            columns: 1,
          },
        },
        {
          id: 'container5',
          name: 'Reviews',
          sections: ['section5'],
          layout: {
            columns: 1,
          },
        },
      ],
      order: [
        'container1',
        'container2',
        'container3',
        'container4',
        'container5',
      ],
    };
  }
  const data = await RestApiClient.get<DesignStateType>(
    `/design?page=${page.toLowerCase()}`,
  );
  return data;
});

/**
 *
 * @param testMode A flag to indicate if the function is running in test mode.
 * @returns The carousel data.
 */
const cachedCarouselData = cache(
  async (pageName: string, position: string, testMode = false) => {
    if (testMode) {
      return [
        {
          id: 1,
          promotionalMessage1: 'Sale! Up To 20% Off!',
          promotionalMessage2: 'Women Tops Collection',
          url: '/category/women/tops',
          sliderImage: images.slider.slider1.src,
        },
        {
          id: 2,
          promotionalMessage1: 'Sale! Up To 30% Off!',
          promotionalMessage2: 'Fashion for Every Occasion',
          url: '/category/men/tshirts',
          sliderImage: images.slider.slider2.src,
        },
        {
          id: 3,
          promotionalMessage1: 'Sale! Up To 50% Off!',
          promotionalMessage2: 'Stylish Looks on Sale',
          url: '/category/sale/',
          sliderImage: images.slider.slider3.src,
        },
      ];
    }

    const data = await RestApiClient.get(
      `/carousel?page=${pageName}&position=${position}`,
    );
    return data;
  },
);

/**
 *  Fetches the navigation categories.
 */
const cachedFetchNavigationCategories = cache(async () => {
  type NavResult = {
    categories: PrimaryCategory[];
  };

  const data: NavResult = await RestApiClient.get<NavResult>(`/navigation`);

  return data.categories;
});

/**
 *
 * @param categoryId The category id.
 * @param subCategoryId The subcategory id.
 * @returns The products of the category.
 */
const cachedFetchCategoryProducts = cache(
  async (categoryId: string, subCategoryId: string) => {
    type ProductsModel = {
      productsModel: ProductType[];
      noProducts: boolean;
    };

    const data: {
      productsModel: ProductType[];
      noProducts: boolean;
    } = await RestApiClient.get<ProductsModel>(
      `/category?category=${categoryId}&subcategory=${subCategoryId}`,
    );

    return data.productsModel;
  },
);

/**
 *
 * @param productId The product id.
 * @returns The master product.
 */
const cachedFetchMasterProduct = cache(async (productId: string) => {
  const data = await RestApiClient.get(`/product?id=${productId}`);
  return data;
});

/**
 *
 * @param query The search query.
 * @returns The search results.
 */
const cachedFetchSearchResults = cache(async (query: string) => {
  type ProductsModel = {
    searchModel: ProductType[];
  };
  const data = await RestApiClient.get<ProductsModel>(`/search?query=${query}`);
  return data.searchModel;
});

export {
  cachedFetchCategoryProducts,
  cachedFetchNavigationCategories,
  cachedFetchMasterProduct,
  cachedFetchSearchResults,
  cachedDetchPageDesign,
  cachedCarouselData,
};
