"use server";

export async function convertJSONToModel(searchJSON: any) {
  return {
    total: searchJSON.total,
    products: searchJSON.hits.map((product: any) => {
      return {
        id: product.productId,
        name: product.productName,
        price: product.price,
        currency: product.currency,
        image: product.image,
        imageGroups: product.imageGroups,
        priceRanges: product.priceRanges,
      };
    }),
    offset: searchJSON.offset,
    limit: searchJSON.limit,
  };
}
