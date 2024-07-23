'use client';

import algoliasearch from 'algoliasearch';
import { Hits, InstantSearch, Pagination } from 'react-instantsearch-hooks-web';
import { getAlgoliaResults } from '@algolia/autocomplete-js';

import { AutoComplete } from './AutoComplete';
import { Hit } from './Hit';
import { AlgoliaAPIItem } from './AlgoliaAPIItem';
import { SearchConfig } from '@/SearchType';

import './InstantWithAutoComplete.scss';
import 'instantsearch.css/themes/satellite.css';

interface AlgoliaProps {
  configuration: SearchConfig;
  params?: Record<string, string>;
}

const InstantWithAutoComplete = ({ configuration, params }: AlgoliaProps) => {
  const searchClient = algoliasearch(configuration.appId, configuration.apiKey);
  const INSTANT_SEARCH_INDEX_NAME = configuration.indexName;
  return (
    <div>
      <InstantSearch
        searchClient={searchClient}
        indexName={INSTANT_SEARCH_INDEX_NAME}
        routing
      >
        <div className="mx-72 min-w-80 items-center justify-center px-4 pt-3 max-md:mx-24 max-sm:mx-12">
          <AutoComplete
            insights={true}
            searchClient={searchClient}
            openOnFocus={true}
            getSources={({ query }) => [
              {
                sourceId: 'products',
                getItems() {
                  return getAlgoliaResults({
                    searchClient,
                    queries: [
                      {
                        indexName: INSTANT_SEARCH_INDEX_NAME,
                        query,
                        params: {
                          hitsPerPage: 5,
                          attributesToSnippet: ['name:7', 'description:15'],
                          snippetEllipsisText: '…',
                        },
                      },
                    ],
                  });
                },
                templates: {
                  item({ item, components }: any) {
                    return (
                      <AlgoliaAPIItem
                        hit={item}
                        components={components}
                        key={item.objectID}
                      />
                    );
                  },
                },
              },
            ]}
          />
        </div>

        <div className="">
          <Hits
            hitComponent={Hit}
            classNames={{
              root: 'list-product-block relative pt-6 md:pt-10',
              list: 'list-product hide-product-sold w-full flex-wrap justify-center items-center mt-5 grid grid-cols-2 gap-[20px] sm:grid-cols-3 sm:gap-[30px] lg:grid-cols-4',
            }}
          />
          <Pagination />
        </div>
      </InstantSearch>
    </div>
  );
};

export default InstantWithAutoComplete;
