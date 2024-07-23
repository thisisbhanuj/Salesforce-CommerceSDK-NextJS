'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import * as Icon from '@phosphor-icons/react/dist/ssr';

import { useModalSearchContext } from '@/context/ModalSearchContext';

const ModalSearch = () => {
  const { isModalOpen, closeModalSearch } = useModalSearchContext();
  const [searchKeyword, setSearchKeyword] = useState('');
  const router = useRouter();

  const handleSearch = async (value: string) => {
    router.push(`/search?query=${value}`);
    closeModalSearch();
    setSearchKeyword('');
  };

  return (
    <div className={`modal-search-block`} onClick={closeModalSearch}>
      <div
        className={`modal-search-main rounded-[32px] p-6 md:p-10 ${isModalOpen ? 'open' : ''}`}
        onClick={(e) => {
          e.stopPropagation();
        }}
      >
        <div className="form-search relative">
          <Icon.MagnifyingGlass
            className="heading5 absolute right-6 top-1/2 -translate-y-1/2 cursor-pointer"
            onClick={() => {
              handleSearch(searchKeyword);
            }}
          />
          <input
            type="text"
            placeholder="What are you looking for?"
            className="text-button-lg h-14 w-full rounded-2xl border border-line pl-6 pr-12"
            value={searchKeyword}
            onChange={(e) => setSearchKeyword(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSearch(searchKeyword)}
          />
        </div>
        <div className="keyword mt-8">
          <div className="heading5">Featured keywords</div>
          <div className="list-keyword mt-4 flex flex-wrap items-center gap-3">
            <button
              className="item cursor-pointer rounded-full border border-line px-4 py-1.5 duration-300 hover:bg-black hover:text-white"
              onClick={() => handleSearch('tshirt')}
            >
              T-Shirt
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ModalSearch;
