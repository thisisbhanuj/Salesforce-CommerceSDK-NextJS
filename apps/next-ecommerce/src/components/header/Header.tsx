import React from 'react';

import TopNavigationComponent from './TopNavigationComponent';
import Menu from './menu/Menu';
import Breadcrumb from '@/components/breadcrumb/Breadcrumb';
import { PrimaryCategory } from '@/Category';
import { getCurrentSession } from '@/lib/session';

interface HeaderProps {
  heading: string;
  subHeading: string | undefined;
  navModel: PrimaryCategory[];
}

const Header: React.FC<HeaderProps> = async ({
  heading,
  subHeading,
  navModel,
}) => {
  const session = await getCurrentSession();
  return (
    <>
      <TopNavigationComponent
        props="bg-black"
        slogan="New customers save 10% with the code GET10"
      />
      <div id="header" className="relative w-full">
        <Menu props="bg-transparent" session={session} navigation={navModel} />
        <Breadcrumb heading={heading} subHeading={subHeading ?? heading} />
      </div>
    </>
  );
};

export default Header;
