import Link from 'next/link';
import React from 'react';
import { usePathname } from 'next/navigation';
import { PrimaryCategory } from '@/Category';

type Props = {
  handleCustomization: () => void;
  navModel: PrimaryCategory[];
};

const Navigation: React.FC<Props> = ({ handleCustomization, navModel }) => {
  const pathname = usePathname();

  return (
    <div className="left flex items-center gap-16">
      <Link
        href={'/'}
        className="flex items-center max-lg:absolute max-lg:left-1/2 max-lg:-translate-x-1/2"
      >
        <div className="heading4">BHANUJ</div>
      </Link>
      <div className="menu-main h-full max-lg:hidden">
        <ul className="flex h-full items-center gap-8">
          {navModel?.map((category, index) => (
            <li key={category.name + '_' + index} className="h-full">
              <Link
                prefetch={true}
                href="#!"
                className={`text-button-uppercase flex h-full items-center justify-center duration-300 ${pathname.includes(category.name) ? 'active' : ''}`}
              >
                {category.name}
              </Link>
              <div className="mega-menu absolute left-0 top-[74px] w-screen bg-white">
                <div className="container">
                  <div className="flex justify-between py-8">
                    <div className="nav-link grid basis-2/3 grid-cols-4 gap-y-8">
                      <div className="nav-item">
                        <div className="text-button-uppercase pb-2">
                          For {category.name}
                        </div>
                        <ul>
                          {category?.subCategories?.map(
                            (subCategory, index) => (
                              <li key={category.name + '_' + subCategory}>
                                <Link
                                  href={
                                    '/category/' +
                                    category.name +
                                    '/' +
                                    subCategory
                                  }
                                  className={
                                    'link text-secondary duration-300 ' +
                                    (pathname ===
                                    '/category/' +
                                      category.name +
                                      '/' +
                                      subCategory
                                      ? 'active'
                                      : '')
                                  }
                                >
                                  {subCategory}
                                </Link>
                              </li>
                            ),
                          )}
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </li>
          ))}

          <li className="relative h-full">
            <Link
              href="#!"
              className={`text-button-uppercase flex h-full items-center justify-center duration-300 ${pathname.includes('/customization') ? 'active' : ''}`}
            >
              Customization
            </Link>
            <div className="sub-menu absolute w-52 rounded-b-xl bg-white px-5 py-3">
              <ul className="w-full">
                <li>
                  <button
                    onClick={handleCustomization}
                    className={`link cursor-pointer text-secondary duration-300`}
                  >
                    T-Shirt
                  </button>
                </li>
              </ul>
            </div>
          </li>

          <li className="relative h-full">
            <Link
              href="#!"
              className={`text-button-uppercase flex h-full items-center justify-center duration-300 ${pathname.includes('/pages') ? 'active' : ''}`}
            >
              Pages
            </Link>
            <div className="sub-menu absolute -left-10 rounded-b-xl bg-white px-5 py-3">
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
          </li>
        </ul>
      </div>
    </div>
  );
};

export default Navigation;
