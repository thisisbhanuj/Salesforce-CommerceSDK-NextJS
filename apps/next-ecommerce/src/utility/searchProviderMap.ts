'use server';

import InstantWithAutoComplete from '@/components/search/algolia/instant-auto-complete/InstantWithAutoComplete';
import { SearchConfig, SearchProviderComponent } from '@/SearchType';

const ServerSearchProviderMap: Map<string, SearchProviderComponent> = new Map([
  [
    'algoliaAutoComplete',
    {
      component: InstantWithAutoComplete,
      config: {
        appId: process.env.ALGOLIA_SEARCH_APP_ID ?? '',
        apiKey: process.env.ALGOLIA_SEARCH_API_KEY ?? '',
        indexName: process.env.ALGOLIA_SEARCH_INDEX_NAME ?? '',
      } as SearchConfig,
    },
  ],
  ['elasticSearch', null],
  ['cloudinary', null],
]);

export const getSearchProviderComponent = async (
  providerName: string,
): Promise<SearchProviderComponent | null> => {
  if (!ServerSearchProviderMap.has(providerName)) {
    console.warn(`Search provider "${providerName}" not found. Using default.`);
    return null;
  }

  return ServerSearchProviderMap.get(providerName)!;
};
