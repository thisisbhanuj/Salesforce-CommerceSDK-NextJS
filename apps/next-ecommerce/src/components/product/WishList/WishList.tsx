'use client';

import React, { useEffect, useRef, useState } from 'react';
import * as Icon from '@phosphor-icons/react/dist/ssr';

import HandlePagination from '@/components/standalone/HandlePagination';
import { useWishlist } from '@/context/WishlistContext';
import { ProductType } from '@/ProductType';
import Product from '../Product';

const WishList = () => {
  const { wishlistState } = useWishlist();
  const [wishlistProducts, setWishlistProducts] = useState<ProductType[]>();
  const [currentProducts, setCurrentProducts] = useState<ProductType[]>([]);
  const [totalProducts, setTotalProducts] = useState(0);
  const [sortOption, setSortOption] = useState('');
  const [type, setType] = useState<string | undefined>();
  const [currentPage, setCurrentPage] = useState(0);

  const selectedProductType = type;
  const pageCountRef = useRef(0);
  const productsPerPage = 12;
  const offset = currentPage * productsPerPage;

  //const wishlistIDs = wishlistState.wishlistArray.map((item) => item.id);

  const handleType = (type: string) => {
    setType((prevType) => (prevType === type ? undefined : type));
  };

  const handleSortChange = (option: string) => {
    setSortOption(option);
  };

  const handlePageChange = (selected: number) => {
    setCurrentPage(selected);
  };

  useEffect(() => {
    // const fetchWishlist = async () => {
    //     const response = await fetchWishlistAction();
    //     if (response?.success && response.wishlist) {
    //         setWishlistProducts(JSON.parse(response.wishlist) ?? []);
    //     }
    // }

    //fetchWishlist();
    setWishlistProducts(wishlistState.wishlistArray ?? []);
  }, []);

  // Combined filtering and total products calculation
  useEffect(() => {
    if (!wishlistProducts || wishlistProducts.length === 0) {
      setTotalProducts(0);
      return; // Early exit to prevent unnecessary calculations
    }

    const filteredData = wishlistProducts.filter((product) => {
      const isProductTypeMatched =
        !selectedProductType || product.productType === selectedProductType;
      return isProductTypeMatched;
    });

    const totalProducts = filteredData.length;
    setWishlistProducts(filteredData);
    setTotalProducts(totalProducts);
  }, [wishlistProducts, selectedProductType]);

  // Combined pagination and current products update
  useEffect(() => {
    if (!wishlistProducts || wishlistProducts.length === 0) {
      setCurrentProducts([]); // Empty array for no data case
      return; // Early exit to prevent unnecessary calculations
    }

    const totalProducts = wishlistProducts.length;
    const pageCount = Math.ceil(totalProducts / productsPerPage);
    const currentPageProducts = wishlistProducts.slice(
      offset,
      offset + productsPerPage,
    );

    pageCountRef.current = pageCount;
    setCurrentProducts(currentPageProducts);
  }, [wishlistProducts, offset, productsPerPage]);

  const sortFn = React.useMemo(() => {
    switch (sortOption) {
      case 'discountHighToLow':
        return (a: ProductType, b: ProductType) =>
          Math.floor(
            100 -
              (Number(b.price.salesPrice) / Number(b.price.listPrice)) * 100,
          ) -
          Math.floor(
            100 -
              (Number(a.price.salesPrice) / Number(a.price.listPrice)) * 100,
          );
      case 'priceHighToLow':
        return (a: ProductType, b: ProductType) =>
          Number(b.price.listPrice) - Number(a.price.listPrice);
      case 'priceLowToHigh':
        return (a: ProductType, b: ProductType) =>
          Number(a.price.listPrice) - Number(b.price.listPrice);
      default:
        return undefined;
    }
  }, [sortOption]); // Re-create sortFn only when sortOption changes

  // Re-run the effect when sortOption changes
  useEffect(() => {
    if (!sortFn) return;
    if (!wishlistProducts || wishlistProducts.length === 0) return;

    const sortedData = [...wishlistProducts].sort(sortFn);

    setWishlistProducts(sortedData);
  }, [sortOption]);

  return (
    <div className="shop-product breadcrumb1 py-10 md:py-14 lg:py-20">
      <div className="container">
        <div className="list-product-block relative">
          <div className="filter-heading flex flex-wrap items-center justify-between gap-5">
            <div className="left has-line flex flex-wrap items-center gap-5"></div>
            <div className="right flex items-center gap-3">
              <div className="select-block filter-type relative">
                <select
                  className="caption1 rounded-lg border border-line py-2 pl-3 pr-8 capitalize md:pr-12"
                  name="select-type"
                  id="select-type"
                  onChange={(e) => handleType(e.target.value)}
                  value={type ?? 'T-Shirt'}
                >
                  <option value="Type" disabled>
                    Type
                  </option>
                  {['tshirt', 'dress', 'top'].map((item, index) => (
                    <option
                      key={item}
                      className={`item cursor-pointer ${type === item ? 'active' : ''}`}
                    >
                      {item}
                    </option>
                  ))}
                </select>
                <Icon.CaretDown
                  size={12}
                  className="absolute right-2 top-1/2 -translate-y-1/2 md:right-4"
                />
              </div>
              <div className="select-block relative">
                <select
                  id="select-filter"
                  name="select-filter"
                  className="caption1 rounded-lg border border-line py-2 pl-3 pr-10 md:pr-20"
                  onChange={(e) => {
                    handleSortChange(e.target.value);
                  }}
                  defaultValue={'Sorting'}
                >
                  <option value="Sorting" disabled>
                    Sorting
                  </option>
                  <option value="discountHighToLow">Best Discount</option>
                  <option value="priceHighToLow">Price High To Low</option>
                  <option value="priceLowToHigh">Price Low To High</option>
                </select>
                <Icon.CaretDown
                  size={12}
                  className="absolute right-2 top-1/2 -translate-y-1/2 md:right-4"
                />
              </div>
            </div>
          </div>

          <div className="list-filtered mt-4 flex items-center gap-3">
            <div className="total-product">
              {totalProducts}
              <span className="pl-1 text-secondary">Products Found</span>
            </div>
            {selectedProductType && (
              <>
                <div className="list flex items-center gap-3">
                  <div className="h-4 w-px bg-line"></div>
                  {selectedProductType && (
                    <div
                      className="item bg-linear flex items-center gap-1 rounded-full px-2 py-1 capitalize"
                      onClick={() => {
                        setType(undefined);
                      }}
                    >
                      <Icon.X className="cursor-pointer" />
                      <span>{selectedProductType}</span>
                    </div>
                  )}
                </div>
                <div
                  className="clear-btn flex cursor-pointer items-center gap-1 rounded-full border border-red px-2 py-1"
                  onClick={() => {
                    setType(undefined);
                  }}
                >
                  <Icon.X color="rgb(219, 68, 68)" className="cursor-pointer" />
                  <span className="text-button-uppercase text-red">
                    Clear All
                  </span>
                </div>
              </>
            )}
          </div>

          <div
            className={`list-product hide-product-sold mt-7 grid grid-cols-2 gap-[20px] sm:grid-cols-3 sm:gap-[30px] lg:grid-cols-4`}
          >
            {currentProducts.map((item) => (
              <Product key={item.id} data={item} type="grid" />
            ))}
          </div>

          {pageCountRef.current > 1 && (
            <div className="list-pagination mt-7 flex items-center justify-center md:mt-10">
              <HandlePagination
                pageCount={pageCountRef.current}
                onPageChange={handlePageChange}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default WishList;
