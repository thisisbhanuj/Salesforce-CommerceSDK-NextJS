import React from 'react';
import Link from 'next/link';

interface Props {
  props: string;
  slogan: string;
}

const TopNavigationComponent: React.FC<Props> = ({ props, slogan }) => {
  return (
    <div className={`top-nav h-[30px] md:h-[44px] ${props}`}>
      <div className="container mx-auto h-full">
        <div className="top-nav-main flex h-full justify-between max-md:justify-center">
          <div className="text-button-uppercase flex items-center text-center text-white">
            {slogan}
          </div>
          <div className="right-content flex items-center gap-5 max-md:hidden">
            <Link href={'https://www.facebook.com/'} target="_blank">
              <i className="icon-facebook text-white"></i>
            </Link>
            <Link href={'https://www.instagram.com/'} target="_blank">
              <i className="icon-instagram text-white"></i>
            </Link>
            <Link href={'https://www.youtube.com/'} target="_blank">
              <i className="icon-youtube text-white"></i>
            </Link>
            <Link href={'https://twitter.com/'} target="_blank">
              <i className="icon-twitter text-white"></i>
            </Link>
            <Link href={'https://pinterest.com/'} target="_blank">
              <i className="icon-pinterest text-white"></i>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TopNavigationComponent;
