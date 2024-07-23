import React from 'react';
import * as Icon from '@phosphor-icons/react/dist/ssr';

interface Props {
  handleSortChange: (value: string) => void;
  showOnlySale: (toggleSelect: boolean) => void;
}

const PLPSortHeader: React.FC<Props> = ({ handleSortChange, showOnlySale }) => {
  const handleShowOnlySale = (toggleSelect: boolean) => {
    showOnlySale(toggleSelect);
  };

  return (
    <div className="filter-heading flex flex-wrap items-center justify-between gap-5">
      <div className="left has-line flex flex-wrap items-center gap-5">
        <div className="check-sale flex items-center gap-2">
          <input
            type="checkbox"
            name="filterSale"
            id="filter-sale"
            className="border-line"
            onChange={(event: React.ChangeEvent<HTMLInputElement>) =>
              handleShowOnlySale(event.target.checked)
            }
          />
          <label htmlFor="filter-sale" className="cation1 cursor-pointer">
            Sale Only
          </label>
        </div>
      </div>
      <div className="right flex items-center gap-3">
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
  );
};

export default PLPSortHeader;
