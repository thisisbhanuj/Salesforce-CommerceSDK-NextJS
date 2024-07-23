'use client';

import React from 'react';
import { useRouter } from 'next/navigation';

import PageSelector from './PageSelector';
import { cachedDetchPageDesign } from '@/cachefns/cachefns';
// import ReDesign from './framer/component/ReDesign'
// import Resizer from './Resizer';

const PageLayoutDesigner = () => {
  const router = useRouter();

  const pageSelectHandler = async (selectedPage: string) => {
    const res = await cachedDetchPageDesign(selectedPage.toLowerCase(), false);
    router.push(`/backoffice/builder/${res.name}`);
  };

  return (
    <div className="page-layout-designer">
      <PageSelector pageSelectHandler={pageSelectHandler} />
    </div>
  );
};

export default PageLayoutDesigner;
