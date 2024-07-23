'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';

import * as Icon from '@phosphor-icons/react/dist/ssr';

import blogData from '@/data/Blog.json';

const BlogContent: React.FC<{}> = () => {
  const searchParams = useSearchParams();
  const router = useRouter();

  const handleBlogDetail = (id: string) => {
    router.push(`/pages/blog?cid=${id}`);
  };

  let blogId = searchParams.get('cid');
  if (blogId === null) {
    blogId = '14';
  }

  const blogMain = blogData[Number(blogId) - 1];

  return (
    <div className="container pt-10 md:pt-14 lg:pt-20">
      <div className="blog-content flex justify-between gap-y-10 max-lg:flex-col">
        <div className="main lg:w-2/3 lg:pr-[15px] xl:w-3/4">
          <div className="blog-tag text-button-uppercase inline-block rounded-full bg-green px-2.5 py-1">
            {blogMain.tag}
          </div>
          <div className="heading3 mt-3">{blogMain.title}</div>
          <div className="author mt-4 flex items-center gap-4">
            <div className="avatar h-10 w-10 flex-shrink-0 overflow-hidden rounded-full">
              <Image
                priority={false}
                src={blogMain.avatar}
                width={200}
                height={200}
                alt="avatar"
                className="h-full w-full object-cover"
              />
            </div>
            <div className="flex items-center gap-2">
              <div className="caption1 text-secondary">
                by {blogMain.author}
              </div>
              <div className="line h-px w-5 bg-secondary"></div>
              <div className="caption1 text-secondary">{blogMain.date}</div>
            </div>
          </div>
          <div className="bg-img py-6 md:py-10">
            <Image
              priority={false}
              src={blogMain.thumbImg}
              width={5000}
              height={4000}
              alt={blogMain.thumbImg}
              className="w-full rounded-3xl object-cover"
            />
          </div>
          <div className="content">
            <div className="body1">{blogMain.description}</div>
            <div className="heading4 mt-5 md:mt-8">How did SKIMS start?</div>
            <div className="body1 mt-2">
              I’ve always been passionate about underwear and shapewear and have
              a huge collection from over the years! When it came to shapewear,
              I could never find exactly what I was looking for and I would cut
              up pieces and sew them together to create the style and
              compression I needed.
            </div>
            <div className="mt-5 grid gap-[30px] sm:grid-cols-2 md:mt-8">
              {blogMain.subImg.map((item, index) => (
                <Image
                  priority={false}
                  key={index}
                  src={item}
                  width={3000}
                  height={2000}
                  alt={item}
                  className="w-full rounded-3xl"
                />
              ))}
            </div>
            <div className="body1 mt-4">
              For bras, I love our Cotton Jersey Scoop Bralette – it
              {String.raw`'s`} lined with this amazing power mesh so you get
              great support and is so comfy I can sleep in it. I also love our
              Seamless Sculpt Bodysuit – it{String.raw`'s`} the perfect all in
              one sculpting, shaping and smoothing shapewear piece with
              different levels of support woven throughout.
            </div>
            <div className="quote-block mt-5 flex items-center gap-6 rounded-2xl border border-line px-6 py-6 md:mt-8 md:gap-10 md:rounded-[20px] md:px-10">
              <Icon.Quotes
                className="flex-shrink-0 rotate-180 text-3xl text-green"
                weight="fill"
              />
              <div>
                <div className="heading6">
                  {String.raw`"`}For bras, I love our Cotton Jersey Scoop
                  Bralette – it{String.raw`'s`} lined with this amazing power
                  mesh so you get great support and is so comfy I can sleep in
                  it.{String.raw`"`}
                </div>
                <div className="text-button-uppercase mt-4 text-secondary">
                  - Anthony Bourdain
                </div>
              </div>
            </div>
            <div className="body1 mt-5 md:mt-8">
              For bras, I love our Cotton Jersey Scoop Bralette – it
              {String.raw`'s`} lined with this amazing power mesh so you get
              great support and is so comfy I can sleep in it. I also love our
              Seamless Sculpt Bodysuit – it{String.raw`'s`} the perfect all in
              one sculpting, shaping and smoothing shapewear piece with
              different levels of support woven throughout.
            </div>
          </div>

          <div className="action mt-5 flex flex-wrap items-center justify-between gap-6 md:mt-8">
            <div className="right list-social flex flex-wrap items-center gap-3">
              <p>Share:</p>
              <div className="list flex flex-wrap items-center gap-3">
                <Link
                  href={'https://www.facebook.com/'}
                  target="_blank"
                  className="flex h-10 w-10 items-center justify-center rounded-full bg-surface duration-300 hover:bg-black hover:text-white"
                >
                  <div className="icon-facebook duration-100"></div>
                </Link>
                <Link
                  href={'https://www.instagram.com/'}
                  target="_blank"
                  className="flex h-10 w-10 items-center justify-center rounded-full bg-surface duration-300 hover:bg-black hover:text-white"
                >
                  <div className="icon-instagram duration-100"></div>
                </Link>
                <Link
                  href={'https://www.twitter.com/'}
                  target="_blank"
                  className="flex h-10 w-10 items-center justify-center rounded-full bg-surface duration-300 hover:bg-black hover:text-white"
                >
                  <div className="icon-twitter duration-100"></div>
                </Link>
                <Link
                  href={'https://www.youtube.com/'}
                  target="_blank"
                  className="flex h-10 w-10 items-center justify-center rounded-full bg-surface duration-300 hover:bg-black hover:text-white"
                >
                  <div className="icon-youtube duration-100"></div>
                </Link>
                <Link
                  href={'https://www.pinterest.com/'}
                  target="_blank"
                  className="flex h-10 w-10 items-center justify-center rounded-full bg-surface duration-300 hover:bg-black hover:text-white"
                >
                  <div className="icon-pinterest duration-100"></div>
                </Link>
              </div>
            </div>
          </div>

          <div className="next-pre mt-5 flex items-center justify-between border-y border-line py-6 md:mt-8">
            {blogId === '1' ? (
              <div
                className="left cursor-pointer"
                onClick={() => handleBlogDetail(String(blogData.length))}
              >
                <div className="text-button-uppercase text-secondary2">
                  Previous
                </div>
                <div className="text-title mt-2">
                  {blogData[blogData.length - 1].title}
                </div>
              </div>
            ) : (
              <div
                className="left cursor-pointer"
                onClick={() =>
                  handleBlogDetail(blogData[Number(blogId) - 2].id)
                }
              >
                <div className="text-button-uppercase text-secondary2">
                  Previous
                </div>
                <div className="text-title mt-2">
                  {blogData[Number(blogId) - 2].title}
                </div>
              </div>
            )}
            {Number(blogId) === blogData.length ? (
              <div
                className="right cursor-pointer text-right"
                onClick={() => handleBlogDetail('1')}
              >
                <div className="text-button-uppercase text-secondary2">
                  Next
                </div>
                <div className="text-title mt-2">{blogData[0].title}</div>
              </div>
            ) : (
              <div
                className="right cursor-pointer text-right"
                onClick={() => handleBlogDetail(blogData[Number(blogId)].id)}
              >
                <div className="text-button-uppercase text-secondary2">
                  Next
                </div>
                <div className="text-title mt-2">
                  {blogData[Number(blogId)].title}
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="right lg:w-1/3 lg:pl-[45px] xl:w-1/4">
          <div className="about-author">
            <div className="heading flex gap-5">
              <div className="avatar h-[100px] w-[100px] flex-shrink-0 overflow-hidden rounded-full">
                <Image
                  priority={false}
                  src={blogMain.avatar}
                  width={500}
                  height={500}
                  alt="avatar"
                  className="h-full w-full object-cover"
                />
              </div>
              <div>
                <div className="heading6">{blogMain.author}</div>
                <div className="caption1 mt-1 text-secondary">200 Follower</div>
                <div className="button-main text-button mt-2 rounded-full border border-line bg-white px-5 py-1 capitalize text-black">
                  Follow
                </div>
              </div>
            </div>
            <div className="mt-5 text-secondary">{blogMain.author}</div>
            <div className="list-social mt-4 flex flex-wrap items-center gap-6">
              <Link
                href={'https://www.facebook.com/'}
                target="_blank"
                className=""
              >
                <div className="icon-facebook duration-100 md:text-xl"></div>
              </Link>
              <Link
                href={'https://www.instagram.com/'}
                target="_blank"
                className=""
              >
                <div className="icon-instagram duration-100 md:text-xl"></div>
              </Link>
              <Link
                href={'https://www.twitter.com/'}
                target="_blank"
                className=""
              >
                <div className="icon-twitter duration-100 md:text-xl"></div>
              </Link>
              <Link
                href={'https://www.youtube.com/'}
                target="_blank"
                className=""
              >
                <div className="icon-youtube duration-100 md:text-xl"></div>
              </Link>
              <Link
                href={'https://www.pinterest.com/'}
                target="_blank"
                className=""
              >
                <div className="icon-pinterest duration-100 md:text-xl"></div>
              </Link>
            </div>
          </div>

          <div className="recent mt-6 md:mt-10">
            <div className="heading6">Recent Posts</div>
            <div className="list-recent pt-1">
              {blogData.slice(12, 15).map((item) => (
                <div
                  className="item mt-5 flex cursor-pointer gap-4"
                  key={item.id}
                  onClick={() => handleBlogDetail(item.id)}
                >
                  <Image
                    priority={false}
                    src={item.thumbImg}
                    width={500}
                    height={400}
                    alt={item.thumbImg}
                    className="h-20 w-20 flex-shrink-0 rounded-lg object-cover"
                  />
                  <div>
                    <div className="blog-tag text-button-uppercase inline-block whitespace-nowrap rounded-full bg-green px-2 py-0.5 text-xs">
                      {item.tag}
                    </div>
                    <div className="text-title mt-1">{item.title}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BlogContent;
