import Footer from '@/components/footer/Footer';
import Header from '@/components/header/Header';
import { cachedFetchSearchResults } from '@/cachefns/cachefns';
import { ProductType } from '@/ProductType';
import { SearchProviderComponent } from '@/SearchType';
import { getSearchProviderComponent } from '@/utility/searchProviderMap';
import Default from '@/components/search/default/Default';

const Search = async ({
  searchParams,
}: Readonly<{
  searchParams: {
    query?: string;
    page?: string;
  };
}>) => {
  let searchResults = [] as ProductType[];
  const params = {};

  const searchProviderName = process.env.NEXT_PUBLIC_SEARCH_NAME ?? 'default';
  const searchProviderConfiguration: SearchProviderComponent | null =
    await getSearchProviderComponent(searchProviderName);

  if (!searchProviderConfiguration) {
    console.warn(
      `Search provider "${searchProviderName}" not found. Using default.`,
    );
  } else if (
    searchParams.query &&
    searchParams.query !== 'undefined' &&
    searchParams.query !== '' &&
    searchParams.query !== 'null'
  ) {
    searchResults = await cachedFetchSearchResults(searchParams.query);
  }

  // Render the search provider component with configuration / results
  const renderedSearchJSX = () => {
    return searchProviderName !== 'default' &&
      searchProviderConfiguration?.component ? (
      <searchProviderConfiguration.component
        configuration={searchProviderConfiguration?.config}
        params={params}
      />
    ) : (
      <Default searchResults={searchResults} />
    );
  };

  return (
    <>
      <Header heading="Search" subHeading="" navModel={[]} />
      {renderedSearchJSX()}
      <Footer />
    </>
  );
};

export default Search;
