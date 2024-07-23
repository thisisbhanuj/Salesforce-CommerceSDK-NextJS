// @ts-nocheck

import React from 'react';
import * as Icon from '@phosphor-icons/react/dist/ssr';

interface Props {
  isFilterSelected: boolean;
  totalProducts: number;
  selectedProductType: string | null | undefined;
  selectedSize: string | null | undefined;
  colors: string[];
  setSelectedProductType: (productType: string | null) => void;
  setSelectedSize: (size: string | null) => void;
  setColors: (colors: string[]) => void;
  handleClearAll: () => void;
  noProducts: boolean;
}

const PLPSelectedFactesHeader: React.FC<Props> = ({
  isFilterSelected,
  totalProducts,
  selectedProductType,
  selectedSize,
  noProducts,
  colors,
  setSelectedProductType,
  setSelectedSize,
  setColors,
  handleClearAll,
}) => {
  return (
    <div className="list-filtered mt-4 flex items-center gap-3">
      <div className="total-product">
        {(isFilterSelected && totalProducts == 0 && (
          <span className="pl-1 text-center text-secondary">
            No products as per the selected filters
          </span>
        )) ||
        totalProducts > 0 ? (
          <span className="pl-1 text-secondary">
            {totalProducts} Products Found
          </span>
        ) : (
          (noProducts && (
            <span className="pl-1 text-center text-secondary"></span>
          )) || (
            <span className="pl-1 text-center text-secondary">Loading...</span>
          )
        )}
      </div>
      {totalProducts > 0 && (
        <>
          <div className="list flex items-center gap-3">
            <div className="h-4 w-px bg-line"></div>
            {selectedProductType && (
              <button
                className="item bg-linear flex items-center gap-1 rounded-full px-2 py-1 capitalize"
                onClick={() => {
                  setSelectedProductType(null);
                }}
              >
                <Icon.X className="cursor-pointer" />
                <span>{selectedProductType}</span>
              </button>
            )}
            {selectedSize && (
              <button
                className="item bg-linear flex items-center gap-1 rounded-full px-2 py-1 capitalize"
                onClick={() => {
                  setSelectedSize(null);
                }}
              >
                <Icon.X className="cursor-pointer" />
                <span>{selectedSize}</span>
              </button>
            )}
            {colors.length > 0 &&
              colors.map((color, index) => (
                <button
                  key={color + '_' + index}
                  className="item bg-linear flex items-center gap-1 rounded-full px-2 py-1 capitalize"
                  onClick={() => {
                    setColors((prevColors: string[]) =>
                      prevColors.filter((c) => c !== color),
                    );
                  }}
                >
                  <Icon.X className="cursor-pointer" />
                  <span>{color}</span>
                </button>
              ))}
          </div>
          {(!!selectedProductType || !!selectedSize || colors.length > 0) && (
            <button
              className="clear-btn flex cursor-pointer items-center gap-1 rounded-full border border-red px-2 py-1"
              onClick={handleClearAll}
            >
              <Icon.X color="rgb(219, 68, 68)" className="cursor-pointer" />
              <span className="text-button-uppercase text-red">
                Clear Filter(s)
              </span>
            </button>
          )}
        </>
      )}
    </div>
  );
};

export default PLPSelectedFactesHeader;
