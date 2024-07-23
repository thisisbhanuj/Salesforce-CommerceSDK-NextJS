import { ProductType } from './ProductType';
import type { Hit as AlgoliaHit } from 'instantsearch.js/es/types';

export type SearchConfig = {
  appId: string;
  apiKey: string;
  indexName: string;
};

export type ProductHit = ProductType &
  AlgoliaHit & {
    _highlightResult: {
      name: {
        value: string;
        matchLevel: string;
        matchedWords: string[];
      };
      description: {
        value: string;
        matchLevel: string;
        matchedWords: string[];
      };
      color: {
        value: string;
        matchLevel: string;
        matchedWords: string[];
      };
      category: {
        value: string;
        matchLevel: string;
        matchedWords: string[];
      };
    };
};

export interface SearchComponentType {
  configuration: SearchConfig;
  params: Record<string, string>;
};

export interface SearchProviderComponent {
  config: SearchConfig;
  component: React.ComponentType<SearchComponentType>;
}
