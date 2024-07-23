'use client';

import React, { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';

import Product from '@/components/product/Product';
import HandlePagination from '@/components/standalone/HandlePagination';

import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';
import { ProductType } from '@/ProductType';

type SearchResultsProps = {
  searchResults: ProductType[] | [];
};

const SearchResults = ({ searchResults }: SearchResultsProps) => {
  const [searchKeyword, setSearchKeyword] = useState<string>('');
  const [currentPage, setCurrentPage] = useState(0);
  const searchParams = useSearchParams();
  const router = useRouter();
  const productsPerPage = 8;
  const offset = currentPage * productsPerPage;

  let query = searchParams.get('query') as string;
  if (query === null || query === '' || query === 'undefined') {
    query = '';
  }

  let currentProducts: ProductType[];

  if (searchResults.length > 0) {
    currentProducts = searchResults.slice(offset, offset + productsPerPage);
  } else {
    currentProducts = [];
  }

  const pageCount = Math.ceil(searchResults.length / productsPerPage);

  const handlePageChange = (selected: number) => {
    setCurrentPage(selected);
  };

  const handleSearch = (value: string) => {
    if (value && value !== 'undefined' && value !== '' && value !== 'null') {
      router.push(`/search?query=${value}`);
      setSearchKeyword('');
    }
  };

  return (
    <div className="shop-product breadcrumb1 py-10 md:py-14 lg:py-20">
      <div className="container">
        <div className="heading flex flex-col items-center">
          <div className="input-block mt-5 h-[44px] w-full sm:mt-8 sm:w-3/5 md:h-[52px] lg:w-1/2">
            <div className="relative h-full w-full">
              <input
                type="text"
                placeholder="Search..."
                className="caption1 h-full w-full rounded-xl border border-line pl-4 pr-32 md:pr-[150px]"
                value={searchKeyword}
                onChange={(e) => setSearchKeyword(e.target.value)}
                onKeyDown={(e) =>
                  e.key === 'Enter' && handleSearch(searchKeyword)
                }
                required
              />
              <button
                className="button-main absolute bottom-1 right-1 top-1 flex items-center justify-center"
                onClick={() => handleSearch(searchKeyword)}
              >
                search
              </button>
            </div>
          </div>
          <div className="search-result mt-8 text-center">
            {searchResults.length} results for {String.raw`"`}
            {query}
            {String.raw`"`}
          </div>
        </div>
        <div className="list-product-block relative pt-6 md:pt-10">
          <div
            className={`list-product hide-product-sold mt-5 grid grid-cols-2 gap-[20px] sm:grid-cols-3 sm:gap-[30px] lg:grid-cols-4`}
          >
            {currentProducts?.map((item) => (
              <Product key={item.id} data={item} type="grid" />
            ))}
            {currentProducts.length === 0 && query && (
              <>
                <Skeleton className="skeleton-tile" height={400} width="100%" />
                <Skeleton className="skeleton-tile" height={400} width="100%" />
                <Skeleton className="skeleton-tile" height={400} width="100%" />
                <Skeleton className="skeleton-tile" height={400} width="100%" />
              </>
            )}
          </div>

          {pageCount > 1 && (
            <div className="list-pagination mt-7 flex items-center justify-center md:mt-10">
              <HandlePagination
                pageCount={pageCount}
                onPageChange={handlePageChange}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SearchResults;
