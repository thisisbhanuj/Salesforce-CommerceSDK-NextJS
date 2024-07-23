'use client';

import React from 'react';

import TopNavigationComponent from '@/components/header/TopNavigationComponent';
import Menu from '@/components/header/menu/Menu';
import BlogContent from '@/components/blog/BlogContent';
import NewsInsight from '@/components/blog/NewsInsight';
import Footer from '@/components/footer/Footer';

import blogData from '@/data/Blog.json';

const Blog = () => {
  return (
    <>
      <TopNavigationComponent
        props="bg-black"
        slogan="New customers save 10% with the code GET10"
      />
      <div id="header" className="relative w-full">
        <Menu props="bg-white" session={null} navigation={[]} />
      </div>
      <div className="blog detail2 mt-[56px] border-t border-line md:mt-[74px]">
        <BlogContent />
        <div className="pb-10 md:pb-14 lg:pb-20">
          <NewsInsight data={blogData} start={0} limit={3} />
        </div>
      </div>
      <Footer />
    </>
  );
};

export default Blog;
