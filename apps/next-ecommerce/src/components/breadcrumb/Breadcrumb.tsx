'use client';

import React from 'react';
import Link from 'next/link';
import * as Icon from '@phosphor-icons/react/dist/ssr';
import { usePathname } from 'next/navigation';

import useBaseUrl from '@/utility/urlHelpers';

interface Props {
  heading: string;
  subHeading: string;
}

const Breadcrumb: React.FC<Props> = ({ heading, subHeading }) => {
  const pathname = usePathname();
  const { generateUrl } = useBaseUrl();
  const headingUrl = generateUrl(heading);

  return (
    <div className="breadcrumb-block style-shared">
      <div className="breadcrumb-main bg-linear overflow-hidden">
        <div className="container relative pb-10 pt-16 lg:pt-[120px]">
          <div className="main-content relative z-[1] flex h-full w-full flex-col items-center justify-center">
            <div className="text-content">
              {subHeading !== 'Cart' ? (
                <div className="link heading mt-3 flex items-center justify-center gap-1">
                  <Link href={'/'} className="breadcrumb-text">
                    Home
                  </Link>
                  {!!heading && (
                    <>
                      <Icon.CaretRight size={14} className="text-secondary2" />
                      <Link href={headingUrl} className="breadcrumb-text">
                        {heading}
                      </Link>
                      {!!subHeading && (
                        <>
                          <Icon.CaretRight
                            size={14}
                            className="text-secondary2"
                          />
                          <Link href={pathname} className="breadcrumb-text">
                            {subHeading}
                          </Link>
                        </>
                      )}
                    </>
                  )}
                </div>
              ) : (
                <Link href={'/'} className="heading2">
                  Home
                </Link>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Breadcrumb;
