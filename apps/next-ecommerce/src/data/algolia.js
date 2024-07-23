import algoliasearch from 'algoliasearch';
import products from './products.json';

async function upload(products) {
  try {
    // Connect and authenticate with your Algolia app
    const client = algoliasearch(
      process.env.ALGOLIA_SEARCH_APP_ID,
      process.env.ALGOLIA_WRITE_API_KEY,
    );
    // Create a new index and add all products to it
    const index = client.initIndex(process.env.ALGOLIA_SEARCH_INDEX_NAME);

    index.clearObjects();

    // Batching for optimal performance (adjust batch size as needed)
    const batchSize = 10;
    for (let i = 0; i < products.length; i += batchSize) {
      const batch = products.slice(i, i + batchSize);
      await index.saveObjects(batch);
      console.log(
        `Uploaded batch ${Math.floor(i / batchSize) + 1} of ${Math.ceil(products.length / batchSize)}`,
      );
    }

    console.log('All products uploaded successfully!');
  } catch (error) {
    console.error('Error uploading products:', error);
  }
}

const uploadProductsToAlgolia = async () => {
  await upload(products);
};

export default uploadProductsToAlgolia;
