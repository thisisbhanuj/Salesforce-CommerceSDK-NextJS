import React from 'react';

import * as Icon from '@phosphor-icons/react/dist/ssr';
import { ProductType } from '../../../../types/ProductType';
import InteractiveDiv from '@/components/ui/interactiveDiv';

interface Props {
  currentProducts: ProductType[];
  selectedProductType: string | null | undefined;
  selectedSize: string | null | undefined;
  colors: string[];
  handleType: (type: string) => void;
  handleSize: (size: string) => void;
  handleColor: (color: string) => void;
}

const Facets: React.FC<Props> = ({
  currentProducts,
  selectedProductType,
  selectedSize,
  colors,
  handleType,
  handleSize,
  handleColor,
}) => {
  const colorsArray = [
    'pink',
    'red',
    'green',
    'yellow',
    'purple',
    'black',
    'white',
  ];
  const sizesArray = ['XS', 'S', 'M', 'L', 'XL', '2XL', '3XL', 'One'];

  const [openSidebar, setOpenSidebar] = React.useState(false);

  const handleOpenSidebar = () => {
    setOpenSidebar((toggleOpen) => !toggleOpen);
  };

  return (
    <>
      <InteractiveDiv
        className={`sidebar style-canvas ${openSidebar ? 'open' : ''}`}
        onClickHandler={handleOpenSidebar}
      >
        <InteractiveDiv
          className="sidebar-main"
          onClickHandler={(e) => {
            e.stopPropagation();
          }}
        >
          <div className="heading flex items-center justify-between">
            <div className="heading5">Filters</div>
            <Icon.X
              size={20}
              weight="bold"
              onClick={handleOpenSidebar}
              className="cursor-pointer"
            />
          </div>
          <div className="filter-type mt-7 border-b border-line pb-8">
            <div className="heading6">Products Type</div>
            <div className="list-type mt-4">
              {['tshirts', 'jeans', 'tops'].map((item, index) => (
                <button
                  key={item}
                  className={`item flex cursor-pointer items-center justify-between ${selectedProductType === item ? 'active' : ''}`}
                  onClick={() => handleType(item)}
                >
                  <div className="has-line-before capitalize text-secondary hover:text-black">
                    {item}
                  </div>
                  <div className="-mr-52 text-secondary2">
                    (
                    {
                      currentProducts.filter(
                        (dataItem) => dataItem.productType === item,
                      ).length
                    }
                    )
                  </div>
                </button>
              ))}
            </div>
          </div>
          <div className="filter-size mt-8 border-b border-line pb-8">
            <div className="heading6">Size</div>
            <div className="list-size mt-4 flex flex-wrap items-center gap-3 gap-y-4">
              {sizesArray.map((item, index) => (
                <button
                  key={item}
                  className={`size-item text-button flex h-[44px] w-[44px] items-center justify-center rounded-full border border-line ${selectedSize === item ? 'active' : ''}`}
                  onClick={() => handleSize(item)}
                >
                  {item}
                </button>
              ))}
            </div>
          </div>

          <div className="filter-color mt-8 border-b border-line pb-8">
            <div className="heading6">Colors</div>
            <div className="list-color mt-4 flex flex-wrap items-center gap-3 gap-y-4">
              {colorsArray.map((color, index) => (
                <button
                  key={color}
                  className={`color-item flex items-center justify-center gap-2 rounded-full border border-line px-3 py-[5px] ${colors.includes(color) ? 'active' : ''}`}
                  onClick={() => handleColor(color)}
                >
                  <div
                    className={`color bg-${color} h-5 w-5 rounded-full`}
                  ></div>
                  <div className="caption1 capitalize">{color}</div>
                </button>
              ))}
            </div>
          </div>
        </InteractiveDiv>
      </InteractiveDiv>

      <div className="sidebar w-full md:w-1/3 md:pr-12 lg:w-1/4">
        <InteractiveDiv
          className="filter-sidebar-btn flex cursor-pointer items-center gap-2"
          onClickHandler={handleOpenSidebar}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
          >
            <path
              d="M4 21V14"
              stroke="#1F1F1F"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M4 10V3"
              stroke="#1F1F1F"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M12 21V12"
              stroke="#1F1F1F"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M12 8V3"
              stroke="#1F1F1F"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M20 21V16"
              stroke="#1F1F1F"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M20 12V3"
              stroke="#1F1F1F"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M1 14H7"
              stroke="#1F1F1F"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M9 8H15"
              stroke="#1F1F1F"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M17 16H23"
              stroke="#1F1F1F"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
          <span>Filters</span>
        </InteractiveDiv>
      </div>
    </>
  );
};

export default Facets;
