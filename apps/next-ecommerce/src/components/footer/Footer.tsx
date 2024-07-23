import React from 'react';
import Link from 'next/link';

import NewsletterSubscription from '../forms/NewsletterSubscription';

const Footer = () => {
  return (
    <footer id="footer" className="footer">
      <div className="footer-main bg-surface">
        <div className="container">
          <div className="content-footer flex flex-wrap justify-between gap-y-8 py-[60px]">
            <div className="company-infor basis-1/4 pr-7 max-lg:basis-full">
              <Link href={'/'} className="logo">
                <div className="heading4">BHANUJ</div>
              </Link>
              <div className="mt-3 flex gap-3">
                <div className="flex flex-col">
                  <span className="text-button">Mail:</span>
                  <span className="text-button mt-3">Phone:</span>
                  <span className="text-button mt-3">Address:</span>
                </div>
                <div className="flex flex-col">
                  <span className="">tobhanuj.kashyap@gmail.com</span>
                  <span className="mt-3">+91-000 000 0000</span>
                  <span className="mt-3 pt-px">
                    549 Oak St.Crystal Lake, IL 60014
                  </span>
                </div>
              </div>
            </div>
            <div className="right-content flex basis-3/4 flex-wrap gap-y-8 max-lg:basis-full">
              <div className="list-nav flex basis-2/3 justify-between gap-4 max-md:basis-full">
                <div className="item flex basis-1/3 flex-col">
                  <div className="text-button-uppercase pb-3">Information</div>
                  <Link
                    className="caption1 has-line-before w-fit duration-300"
                    href={'/pages/contact'}
                  >
                    Contact Us
                  </Link>
                  <Link
                    className="caption1 has-line-before w-fit pt-2 duration-300"
                    href={'/pages/contact'}
                  >
                    Career
                  </Link>
                  <Link
                    className="caption1 has-line-before w-fit pt-2 duration-300"
                    href={'/profile'}
                  >
                    My Account
                  </Link>
                  <Link
                    className="caption1 has-line-before w-fit pt-2 duration-300"
                    href={'/pages/faqs'}
                  >
                    Order & Returns
                  </Link>
                  <Link
                    className="caption1 has-line-before w-fit pt-2 duration-300"
                    href={'/pages/faqs'}
                  >
                    FAQs
                  </Link>
                </div>
                <div className="item flex basis-1/3 flex-col">
                  <div className="text-button-uppercase pb-3">Quick Shop</div>
                  <Link
                    className="caption1 has-line-before w-fit duration-300"
                    href={'/category/women'}
                  >
                    Women
                  </Link>
                  <Link
                    className="caption1 has-line-before w-fit pt-2 duration-300"
                    href={'/category/men'}
                  >
                    Men
                  </Link>
                  <Link
                    className="caption1 has-line-before w-fit pt-2 duration-300"
                    href={'/category/kids'}
                  >
                    Kids
                  </Link>
                  <Link
                    className="caption1 has-line-before w-fit pt-2 duration-300"
                    href={'/category/sale'}
                  >
                    Sale
                  </Link>
                  <Link
                    className="caption1 has-line-before w-fit pt-2 duration-300"
                    href={'/customization'}
                  >
                    Customization
                  </Link>
                </div>
                <div className="item flex basis-1/3 flex-col">
                  <div className="text-button-uppercase pb-3">
                    Customer Services
                  </div>
                  <Link
                    className="caption1 has-line-before w-fit duration-300"
                    href={'/pages/faqs'}
                  >
                    Orders FAQs
                  </Link>
                  <Link
                    className="caption1 has-line-before w-fit pt-2 duration-300"
                    href={'/pages/faqs'}
                  >
                    Shipping
                  </Link>
                  <Link
                    className="caption1 has-line-before w-fit pt-2 duration-300"
                    href={'/pages/faqs'}
                  >
                    Privacy Policy
                  </Link>
                  <Link
                    className="caption1 has-line-before w-fit pt-2 duration-300"
                    href={'/pages/faqs'}
                  >
                    Return & Refund
                  </Link>
                </div>
              </div>
              <div className="newsletter basis-1/3 pl-7 max-md:basis-full max-md:pl-0">
                <NewsletterSubscription />
                <div className="list-social mt-4 flex items-center gap-6">
                  <Link href={'https://www.facebook.com/'} target="_blank">
                    <div className="icon-facebook text-2xl text-black"></div>
                  </Link>
                  <Link href={'https://www.instagram.com/'} target="_blank">
                    <div className="icon-instagram text-2xl text-black"></div>
                  </Link>
                  <Link href={'https://www.twitter.com/'} target="_blank">
                    <div className="icon-twitter text-2xl text-black"></div>
                  </Link>
                  <Link href={'https://www.youtube.com/'} target="_blank">
                    <div className="icon-youtube text-2xl text-black"></div>
                  </Link>
                  <Link href={'https://www.pinterest.com/'} target="_blank">
                    <div className="icon-pinterest text-2xl text-black"></div>
                  </Link>
                </div>
              </div>
            </div>
          </div>
          <div className="footer-bottom flex items-center justify-between gap-5 border-t border-line py-3 max-lg:flex-col max-lg:justify-center">
            <div className="left flex items-center gap-8">
              <div className="copyright caption1 text-secondary">
                ©2023 BHANUJ. All Rights Reserved.
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
