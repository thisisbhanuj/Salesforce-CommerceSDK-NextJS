'use client';

import React, { useRef, useState, useEffect } from 'react';

import { ProductType } from '../../../../types/ProductType';
import PLPHeader from './PLPHeader';
import PLPSortHeader from './PLPSortHeader';
import Facets from './Facets';
import PLPSelectedFactesHeader from './PLPSelectedFactesHeader';
import PLPGrid from './PLPGrid';
import HandlePagination from '../../standalone/HandlePagination';

interface Props {
  data: Array<ProductType>;
  productPerPage: number;
  productType: string | null | undefined;
  gender: string | null;
  category: string | null;
  facet: { [key: string]: string | string[] | undefined };
  noProducts: boolean;
}

const PLPFacetsLeft: React.FC<Props> = ({
  data,
  productPerPage,
  productType,
  gender,
  category,
  facet,
  noProducts,
}) => {
  const [showOnlySale, setShowOnlySale] = useState(false);
  const [filteredData, setFilteredData] = useState<ProductType[]>();
  const [currentProducts, setCurrentProducts] = useState<ProductType[]>([]);
  const [totalProducts, setTotalProducts] = useState(0);
  const [sortOption, setSortOption] = useState('');
  const [selectedProductType, setSelectedProductType] = useState<
    string | null | undefined
  >(productType);
  const [selectedSize, setSelectedSize] = useState<string | null>();
  const [colors, setColors] = useState<string[]>([]);
  const [isFilterSelected, setIsFilterSelected] = useState<boolean>(false);
  const [currentPage, setCurrentPage] = useState(0);
  const pageCountRef = useRef(0);

  const productsPerPage = productPerPage;
  const offset = currentPage * productsPerPage;

  const handleType = (productType: string | null) => {
    setSelectedProductType((prevType) =>
      prevType === productType ? null : productType,
    );
    setIsFilterSelected(true);
  };

  const handleSize = (size: string) => {
    setSelectedSize((prevSize) => (prevSize === size ? null : size));
    setIsFilterSelected(true);
  };

  const handleColor = (selectedColor: string) => {
    setColors((prevColors) => {
      if (prevColors.includes(selectedColor)) {
        // If the color is already selected, remove it from the array
        return prevColors.filter((color) => color !== selectedColor);
      } else {
        // If the color is not selected, add it to the array
        return [...prevColors, selectedColor];
      }
    });
    setIsFilterSelected(true);
  };

  const handleSortChange = (option: string) => {
    setSortOption(option);
    setCurrentPage(0);
  };

  const handlePageChange = (selected: number) => {
    setCurrentPage(selected);
  };

  const handleClearAll = () => {
    setShowOnlySale(false);
    setSortOption('');
    setSelectedProductType(null);
    setSelectedSize(null);
    setColors([]);
    setCurrentPage(0);
    handleType(null);
    setIsFilterSelected(false);
    setCurrentProducts(data);
  };

  // Combined filtering and total products calculation
  useEffect(() => {
    if (data && data.length > 0 && !noProducts) {
      const filteredData = data.filter((product) => {
        const isMaster = product.master;
        const isShowOnlySaleMatched = showOnlySale ? product.sale : true;
        const isProductTypeMatched =
          !selectedProductType ||
          selectedProductType === 'all' ||
          product.productType === selectedProductType;
        const isSizeMatched =
          !selectedSize || product.sizes.includes(selectedSize);
        const isColorMatched =
          colors.length === 0 ||
          product.variation.some((item) => colors.includes(item.color));

        return (
          isMaster &&
          isShowOnlySaleMatched &&
          isProductTypeMatched &&
          isSizeMatched &&
          isColorMatched
        );
      });

      const totalProducts = filteredData.length;
      setFilteredData(filteredData);
      setTotalProducts(totalProducts);
    }
  }, [
    data,
    showOnlySale,
    selectedProductType,
    selectedSize,
    colors,
    noProducts,
  ]);

  // Combined pagination and current products update
  useEffect(() => {
    if (!filteredData || filteredData.length === 0) {
      setCurrentProducts([]); // Empty array for no data case
      return; // Early exit to prevent unnecessary calculations
    }

    const totalProducts = filteredData.length;
    const pageCount = Math.ceil(totalProducts / productsPerPage);
    const currentPageProducts = filteredData.slice(
      offset,
      offset + productsPerPage,
    );

    pageCountRef.current = pageCount;
    setCurrentProducts(currentPageProducts);
  }, [filteredData, offset, productsPerPage]);

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
    if (!filteredData || filteredData.length === 0) return;

    const sortedData = [...filteredData].sort(sortFn);

    setFilteredData(sortedData);
  }, [sortOption]);

  return (
    <>
      <PLPHeader
        category={category}
        selectedProductType={selectedProductType}
      />

      <div className="shop-product breadcrumb1 py-10 md:py-14 lg:py-20">
        <div className="container">
          <div className="list-product-block w-full md:pl-3">
            <div className="mb-5 flex gap-y-8">
              <Facets
                currentProducts={currentProducts}
                selectedProductType={selectedProductType}
                selectedSize={selectedSize}
                colors={colors}
                handleColor={handleColor}
                handleSize={handleSize}
                handleType={handleType}
              />
            </div>

            <PLPSortHeader
              handleSortChange={handleSortChange}
              showOnlySale={setShowOnlySale}
            />
            <PLPSelectedFactesHeader
              colors={colors}
              selectedProductType={selectedProductType}
              selectedSize={selectedSize}
              handleClearAll={handleClearAll}
              isFilterSelected={isFilterSelected}
              setColors={setColors}
              setSelectedProductType={setSelectedProductType}
              setSelectedSize={setSelectedSize}
              totalProducts={totalProducts}
              noProducts={noProducts}
            />

            <PLPGrid
              currentProducts={currentProducts}
              totalProducts={totalProducts}
              noProducts={noProducts}
            />

            {pageCountRef.current > 1 && (
              <div className="list-pagination mt-7 flex items-center md:mt-10">
                <HandlePagination
                  pageCount={pageCountRef.current}
                  onPageChange={handlePageChange}
                />
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default PLPFacetsLeft;
