import React from 'react';
import Link from 'next/link';
import * as Icon from '@phosphor-icons/react/dist/ssr';

import useBaseUrl from '@/utility/urlHelpers';

interface Props {
  selectedProductType: string | null | undefined;
  category: string | null | undefined;
}

const PLPHeader: React.FC<Props> = ({ selectedProductType, category }) => {
  const { generateUrl } = useBaseUrl();
  const categoryURL = category
    ? generateUrl('category/' + category + '/')
    : '/';

  return (
    <div className="breadcrumb-block style-img">
      <div className="breadcrumb-main bg-linear overflow-hidden">
        <div className="container relative pb-10 pt-16 lg:pt-[120px]">
          <div className="main-content relative z-[1] flex h-full w-full flex-col items-center justify-center">
            <div className="text-content">
              <div className="link mt-3 flex items-center justify-center gap-1">
                <Link href={categoryURL} className="breadcrumb-text capitalize">
                  {category}
                </Link>
                <Icon.CaretRight size={14} className="text-secondary2" />
                <div className="breadcrumb-text capitalize text-secondary2">
                  {selectedProductType ?? 'All'}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PLPHeader;
