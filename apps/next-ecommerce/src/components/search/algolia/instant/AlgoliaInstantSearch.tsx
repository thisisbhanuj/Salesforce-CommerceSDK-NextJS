'use client';

import { SearchConfig } from '@/SearchType';
import algoliasearch from 'algoliasearch';
import { Hits, RefinementList, SearchBox } from 'react-instantsearch';
import { InstantSearchNext } from 'react-instantsearch-nextjs';

import Button from '@/components/ui/button';
import Image from 'next/image';

interface AlgoliaProps {
  configuration: SearchConfig;
}

const AlgoliaInstantSearch = ({ configuration }: AlgoliaProps) => {
  const searchClient = algoliasearch(configuration.appId, configuration.apiKey);

  return (
    <div className="">
      <InstantSearchNext
        searchClient={searchClient}
        indexName={configuration.indexName}
        routing={true}
        insights
      >
        <SearchBox />
        {/* <RefinementList attribute="category" /> */}
        <div className="">
          <Hits hitComponent={Hit} />
        </div>
      </InstantSearchNext>
    </div>
  );
};

const Hit = ({ hit }: any) => (
  <div className="flex-0">
    <div
      key={hit.id}
      className="overflow-hidden rounded-md bg-background shadow-md"
    >
      <Image
        src={hit.images[0]}
        alt={hit.name}
        width={400}
        height={600}
        className="h-64 w-full object-cover"
      />
      <div className="p-4">
        <h3 className="text-lg font-semibold uppercase">{hit.name}</h3>
        <p className="text-muted-foreground">${hit.price.listPrice}</p>
        <Button
          className="mt-4 w-full"
          type="button"
          label="MORE INFO"
        ></Button>
      </div>
    </div>
  </div>
);

export default AlgoliaInstantSearch;
