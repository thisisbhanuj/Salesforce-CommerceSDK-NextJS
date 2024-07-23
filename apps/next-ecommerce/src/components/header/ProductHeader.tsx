import React from 'react';
import { useSession } from 'next-auth/react';

import TopNavigationComponent from './TopNavigationComponent';
import BreadcrumbProduct from '../breadcrumb/BreadcrumbProduct';
import Menu from './menu/Menu';
import { PrimaryCategory } from '@/Category';

interface HeaderProps {
  productPage: string;
  skuId: string;
  category: string | null | undefined;
  navModel: PrimaryCategory[];
}

const ProductHeader: React.FC<HeaderProps> = ({
  productPage,
  skuId,
  category,
  navModel,
}) => {
  const { data: session } = useSession();
  return (
    <>
      <TopNavigationComponent
        props="bg-black"
        slogan="New customers save 10% with the code GET10"
      />
      <div id="header" className="relative w-full">
        <Menu props="bg-white" session={session} navigation={navModel} />
        <BreadcrumbProduct
          productPage={productPage}
          skuId={skuId}
          category={category}
        />
      </div>
    </>
  );
};

export default ProductHeader;
