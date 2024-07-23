'use client';

import Link from 'next/link';
import React, { useState } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import * as Icon from '@phosphor-icons/react/dist/ssr';

import { PrimaryCategory } from '@/Category';
import InteractiveDiv from '@/components/ui/interactiveDiv';
import useMenuMobile from '@/hooks/useMenuMobile';

type Props = {
  handleCustomization: () => void;
  navModel: PrimaryCategory[];
};

const MobileNavigation: React.FC<Props> = ({
  handleCustomization,
  navModel,
}) => {
  const pathname = usePathname();
  const [searchKeyword, setSearchKeyword] = useState('');
  const { openMenuMobile, handleMenuMobile } = useMenuMobile();
  const [openSubNavMobile, setOpenSubNavMobile] = useState<number | null>(null);
  const router = useRouter();

  const handleOpenSubNavMobile = (index: number) => {
    setOpenSubNavMobile(openSubNavMobile === index ? null : index);
  };

  const handleSubCategoryClick = (category: string, subCategory: string) => {
    router.push(`/category/${category}/${subCategory}`);
  };

  const handleSearch = async (value: string) => {
    handleMenuMobile();
    setSearchKeyword('');
    router.push(`/search?query=${value}`);
  };

  const totalCategories = navModel.length;

  return (
    <>
      <InteractiveDiv
        className={'menu-mobile-icon flex items-center lg:hidden'}
        onClickHandler={handleMenuMobile}
      >
        <i className="icon-category text-2xl"></i>
      </InteractiveDiv>
      <div id="menu-mobile" className={`${openMenuMobile ? 'open' : ''}`}>
        <div className="menu-container h-full bg-white">
          <div className="container h-full">
            <div className="menu-main h-full overflow-hidden">
              <div className="heading relative flex items-center justify-center py-2">
                <InteractiveDiv
                  className="close-menu-mobile-btn absolute left-0 top-1/2 flex h-6 w-6 -translate-y-1/2 items-center justify-center rounded-full bg-surface"
                  withEventClickHandler={handleMenuMobile}
                >
                  <Icon.X size={14} />
                </InteractiveDiv>
                <Link
                  href={'/'}
                  className="logo text-center text-3xl font-semibold"
                >
                  BHANUJ
                </Link>
              </div>
              <div className="form-search relative mt-2">
                <Icon.MagnifyingGlass
                  size={20}
                  className="absolute left-3 top-1/2 -translate-y-1/2 cursor-pointer"
                  onClick={() => {
                    handleSearch(searchKeyword);
                  }}
                />
                <input
                  type="text"
                  placeholder="What are you looking for?"
                  className="h-12 w-full rounded-lg border border-line pl-10 pr-4 text-sm"
                  value={searchKeyword}
                  onChange={(e) => setSearchKeyword(e.target.value)}
                  onKeyDown={(e) =>
                    e.key === 'Enter' && handleSearch(searchKeyword)
                  }
                />
              </div>
              <div className="list-nav mt-6">
                <ul>
                  {navModel?.map((category, index) => (
                    <li
                      key={category.name + '_' + index}
                      className={`${openSubNavMobile === index ? 'open' : ''}`}
                      onClick={() => handleOpenSubNavMobile(index)}
                      role="button"
                      tabIndex={index}
                    >
                      <a
                        href={'#!'}
                        className="mt-5 flex items-center justify-between text-xl font-semibold uppercase"
                      >
                        {category.name}
                        <span className="text-right">
                          <Icon.CaretRight size={20} />
                        </span>
                      </a>
                      <div className="sub-nav-mobile h-80">
                        <InteractiveDiv
                          className="back-btn flex items-center gap-3"
                          onClickHandler={() => handleOpenSubNavMobile(index)}
                        >
                          <Icon.CaretLeft />
                          Back
                        </InteractiveDiv>
                        <div className="list-nav-item w-full pb-12 pt-3">
                          <div className="nav-link grid grid-cols-2 gap-5 gap-y-6">
                            <div className="nav-item">
                              <div className="text-button-uppercase pb-1">
                                For {category.name}
                              </div>
                              <ul>
                                {category?.subCategories?.map(
                                  (subCategory, index) => (
                                    <li key={category.name + '_' + subCategory}>
                                      <InteractiveDiv
                                        onClickHandler={() =>
                                          handleSubCategoryClick(
                                            category.name,
                                            subCategory.toLowerCase(),
                                          )
                                        }
                                        className={
                                          'cursor-pointer uppercase text-secondary duration-300'
                                        }
                                      >
                                        {subCategory}
                                      </InteractiveDiv>
                                    </li>
                                  ),
                                )}
                              </ul>
                            </div>
                          </div>
                        </div>
                      </div>
                    </li>
                  ))}

                  <li
                    className={`${openSubNavMobile === 4 ? 'open' : ''}`}
                    onClick={() => handleOpenSubNavMobile(4)}
                    role="button"
                    tabIndex={totalCategories}
                  >
                    <a
                      href={'#!'}
                      className="mt-5 flex items-center justify-between text-xl font-semibold"
                    >
                      CUSTOMIZATION
                      <span className="text-right">
                        <Icon.CaretRight size={20} />
                      </span>
                    </a>
                    <div className="sub-nav-mobile">
                      <InteractiveDiv
                        className="back-btn flex items-center gap-3"
                        onClickHandler={() => handleOpenSubNavMobile(4)}
                      >
                        <Icon.CaretLeft />
                        Back
                      </InteractiveDiv>
                      <div className="list-nav-item w-full pb-6 pt-2">
                        <ul className="w-full">
                          <InteractiveDiv
                            onClickHandler={handleCustomization}
                            className={`link cursor-pointer text-secondary duration-300`}
                          >
                            T-Shirt
                          </InteractiveDiv>
                        </ul>
                      </div>
                    </div>
                  </li>
                  <li
                    className={`${openSubNavMobile === 6 ? 'open' : ''}`}
                    onClick={() => handleOpenSubNavMobile(6)}
                    role="button"
                    tabIndex={totalCategories + 1}
                  >
                    <a
                      href={'#!'}
                      className="mt-5 flex items-center justify-between text-xl font-semibold"
                    >
                      PAGES
                      <span className="text-right">
                        <Icon.CaretRight size={20} />
                      </span>
                    </a>
                    <div className="sub-nav-mobile">
                      <InteractiveDiv
                        className="back-btn flex items-center gap-3"
                        onClickHandler={() => handleOpenSubNavMobile(6)}
                      >
                        <Icon.CaretLeft />
                        Back
                      </InteractiveDiv>
                      <div className="list-nav-item w-full pb-6 pt-2">
                        <ul className="w-full">
                          <li>
                            <Link
                              href="/pages/blog"
                              className={`link text-secondary duration-300 ${pathname === '/pages/blog' ? 'active' : ''}`}
                            >
                              Blog
                            </Link>
                          </li>
                          <li>
                            <Link
                              href="/pages/about"
                              className={`link text-secondary duration-300 ${pathname === '/pages/about' ? 'active' : ''}`}
                            >
                              About Us
                            </Link>
                          </li>
                          <li>
                            <Link
                              href="/pages/contact"
                              className={`link text-secondary duration-300 ${pathname === '/pages/contact' ? 'active' : ''}`}
                            >
                              Contact Us
                            </Link>
                          </li>

                          <li>
                            <Link
                              href="/pages/faqs"
                              className={`link text-secondary duration-300 ${pathname === '/pages/faqs' ? 'active' : ''}`}
                            >
                              FAQs
                            </Link>
                          </li>
                          <li>
                            <Link
                              href="/pages/coming-soon"
                              className={`link text-secondary duration-300 ${pathname === '/pages/coming-soon' ? 'active' : ''}`}
                            >
                              Coming Soon
                            </Link>
                          </li>
                          <li>
                            <Link
                              href="/pages/customer-feedbacks"
                              className={`link text-secondary duration-300 ${pathname === '/pages/customer-feedbacks' ? 'active' : ''}`}
                            >
                              Customer Feedbacks
                            </Link>
                          </li>
                        </ul>
                      </div>
                    </div>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default MobileNavigation;
