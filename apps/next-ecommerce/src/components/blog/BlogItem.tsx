'use client';

import React from 'react';
import Image from 'next/image';

import { useRouter } from 'next/navigation';
import { BlogType } from '../../../types/BlogType';

interface BlogProps {
  data: BlogType;
}

const BlogItem: React.FC<BlogProps> = ({ data }) => {
  const router = useRouter();
  const handleBlogClick = (blogId: string) => {
    router.push(`/pages/blog?cid=${blogId}`);
  };

  return (
    <button
      className="blog-item style-default h-full cursor-pointer"
      onClick={() => handleBlogClick(data.id)}
    >
      <div className="blog-main block h-full border-b border-line pb-8">
        <div className="blog-thumb overflow-hidden rounded-[20px]">
          <Image
            priority={false}
            src={data.thumbImg}
            width={2000}
            height={1500}
            alt="blog-img"
            className="w-full duration-500"
          />
        </div>
        <div className="blog-infor mt-7">
          <div className="blog-tag text-button-uppercase inline-block rounded-full bg-green px-2.5 py-1">
            {data.tag}
          </div>
          <div className="heading6 blog-title mt-3 duration-300">
            {data.title}
          </div>
          <div className="mt-2 flex items-center gap-2">
            <div className="blog-author caption1 text-secondary">
              by {data.author}
            </div>
            <span className="h-[1px] w-[20px] bg-black"></span>
            <div className="blog-date caption1 text-secondary">{data.date}</div>
          </div>
          <div className="body1 mt-4 text-secondary">{data.shortDesc}</div>
          <div
            className="text-button mt-4 underline"
            onClick={() => handleBlogClick(data.id)}
          >
            Read More
          </div>
        </div>
      </div>
    </button>
  );
};

export default BlogItem;
