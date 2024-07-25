'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { useSession } from 'next-auth/react';

import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation } from 'swiper/modules';
import 'swiper/css/bundle';
import * as Icon from '@phosphor-icons/react/dist/ssr';

import Rate from '@/components/standalone/Rate';
import Button from '@/components/ui/button';

import { useFormState } from 'react-dom';
import Ratings from '@/components/standalone/Ratings';
import { saveReviewAction } from '@/actions/user.actions';

import { usePDPStore } from '@/zustand/context/usePDPStore';

interface Props {}

const Reviews: React.FC<Props> = () => {
  const { data: session } = useSession();

  const [productMain] = usePDPStore((state) => [state.productMain]);

  const [currentRating, setCurrentRating] = useState(0);
  const [addReviewState, addReviewAction] = useFormState(saveReviewAction, {
    success: false,
    data: '',
    userId: session?.user.id,
    sku: productMain?.skuId,
  });

  return (
    !!productMain && (
      <div className="review-block bg-surface py-10 md:py-20">
        <div className="container">
          <div className="heading flex flex-wrap items-center justify-between gap-4">
            <div className="heading4">Customer Reviews</div>
          </div>

          {/* All Ratings and Reviews Slot : Starts*/}
          <div className="top-overview flex justify-between gap-y-6 py-6 max-md:flex-col">
            <div className="rating md:w-[30%] md:pr-[35px] lg:w-1/4 lg:pr-[75px]">
              <div className="heading flex flex-wrap items-center justify-center gap-3 gap-y-4">
                <div className="text-display">4.6</div>
                <div className="flex flex-col items-center">
                  <Rate currentRate={1} size={18} />
                  <div className="mt-1 text-center text-secondary">
                    (1,968 Ratings)
                  </div>
                </div>
              </div>
              <div className="list-rating mt-3">
                <div className="item flex items-center justify-between gap-1.5">
                  <div className="flex items-center gap-1">
                    <div className="caption1">5</div>
                    <Icon.Star size={14} weight="fill" />
                  </div>
                  <div className="progress relative h-2 w-3/4 bg-line">
                    <div className="progress-percent absolute left-0 top-0 h-full w-[50%] bg-yellow"></div>
                  </div>
                  <div className="caption1">50%</div>
                </div>
                <div className="item mt-1 flex items-center justify-between gap-1.5">
                  <div className="flex items-center gap-1">
                    <div className="caption1">4</div>
                    <Icon.Star size={14} weight="fill" />
                  </div>
                  <div className="progress relative h-2 w-3/4 bg-line">
                    <div className="progress-percent absolute left-0 top-0 h-full w-[20%] bg-yellow"></div>
                  </div>
                  <div className="caption1">20%</div>
                </div>
                <div className="item mt-1 flex items-center justify-between gap-1.5">
                  <div className="flex items-center gap-1">
                    <div className="caption1">3</div>
                    <Icon.Star size={14} weight="fill" />
                  </div>
                  <div className="progress relative h-2 w-3/4 bg-line">
                    <div className="progress-percent absolute left-0 top-0 h-full w-[10%] bg-yellow"></div>
                  </div>
                  <div className="caption1">10%</div>
                </div>
                <div className="item mt-1 flex items-center justify-between gap-1.5">
                  <div className="flex items-center gap-1">
                    <div className="caption1">2</div>
                    <Icon.Star size={14} weight="fill" />
                  </div>
                  <div className="progress relative h-2 w-3/4 bg-line">
                    <div className="progress-percent absolute left-0 top-0 h-full w-[10%] bg-yellow"></div>
                  </div>
                  <div className="caption1">10%</div>
                </div>
                <div className="item mt-1 flex items-center justify-between gap-1.5">
                  <div className="flex items-center gap-2">
                    <div className="caption1">1</div>
                    <Icon.Star size={14} weight="fill" />
                  </div>
                  <div className="progress relative h-2 w-3/4 bg-line">
                    <div className="progress-percent absolute left-0 top-0 h-full w-[10%] bg-yellow"></div>
                  </div>
                  <div className="caption1">10%</div>
                </div>
              </div>
            </div>
            <div className="list-img md:w-[70%] md:pl-[15px] lg:w-3/4 lg:pl-[15px]">
              <div className="heading5">All Image (128)</div>
              <div className="list mt-3 md:mt-6">
                <Swiper
                  spaceBetween={16}
                  slidesPerView={3}
                  modules={[Navigation]}
                  breakpoints={{
                    576: {
                      slidesPerView: 4,
                      spaceBetween: 16,
                    },
                    640: {
                      slidesPerView: 5,
                      spaceBetween: 16,
                    },
                    768: {
                      slidesPerView: 4,
                      spaceBetween: 16,
                    },
                    992: {
                      slidesPerView: 5,
                      spaceBetween: 20,
                    },
                    1100: {
                      slidesPerView: 5,
                      spaceBetween: 20,
                    },
                    1290: {
                      slidesPerView: 7,
                      spaceBetween: 20,
                    },
                  }}
                >
                  <SwiperSlide>
                    <Image
                      priority={false}
                      src={'/images/product/product-1-large.webp'}
                      width={400}
                      height={400}
                      alt=""
                      className="aspect-square w-[120px] rounded-lg object-cover"
                    />
                  </SwiperSlide>
                  <SwiperSlide>
                    <Image
                      priority={false}
                      src={'/images/product/product-1-large.webp'}
                      width={400}
                      height={400}
                      alt=""
                      className="aspect-square w-[120px] rounded-lg object-cover"
                    />
                  </SwiperSlide>
                  <SwiperSlide>
                    <Image
                      priority={false}
                      src={'/images/product/product-1-large.webp'}
                      width={400}
                      height={400}
                      alt=""
                      className="aspect-square w-[120px] rounded-lg object-cover"
                    />
                  </SwiperSlide>
                  <SwiperSlide>
                    <Image
                      priority={false}
                      src={'/images/product/product-1-large.webp'}
                      width={400}
                      height={400}
                      alt=""
                      className="aspect-square w-[120px] rounded-lg object-cover"
                    />
                  </SwiperSlide>
                  <SwiperSlide>
                    <Image
                      priority={false}
                      src={'/images/product/product-1-large.webp'}
                      width={400}
                      height={400}
                      alt=""
                      className="aspect-square w-[120px] rounded-lg object-cover"
                    />
                  </SwiperSlide>
                  <SwiperSlide>
                    <Image
                      priority={false}
                      src={'/images/product/product-1-large.webp'}
                      width={400}
                      height={400}
                      alt=""
                      className="aspect-square w-[120px] rounded-lg object-cover"
                    />
                  </SwiperSlide>
                  <SwiperSlide>
                    <Image
                      priority={false}
                      src={'/images/product/product-1-large.webp'}
                      width={400}
                      height={400}
                      alt=""
                      className="aspect-square w-[120px] rounded-lg object-cover"
                    />
                  </SwiperSlide>
                </Swiper>
              </div>
              <div className="sorting mt-6 flex flex-wrap items-center gap-3 gap-y-3 md:gap-5">
                <div className="text-button">Sort by</div>
                <div className="item rounded-full border border-line bg-white px-4 py-1">
                  Newest
                </div>
                <div className="item rounded-full border border-line bg-white px-4 py-1">
                  5 Star
                </div>
                <div className="item rounded-full border border-line bg-white px-4 py-1">
                  4 Star
                </div>
                <div className="item rounded-full border border-line bg-white px-4 py-1">
                  3 Star
                </div>
                <div className="item rounded-full border border-line bg-white px-4 py-1">
                  2 Star
                </div>
                <div className="item rounded-full border border-line bg-white px-4 py-1">
                  1 Star
                </div>
              </div>
            </div>
          </div>
          {/* All Ratings and Reviews Slot : Ends*/}

          {/* Purchased Product Info : Starts*/}
          <div className="list-review">
            <div className="item flex w-full gap-y-4 border-t border-line py-6 max-lg:flex-col">
              {addReviewState?.success && (
                <div className="text-success">{addReviewState?.data}</div>
              )}

              <div className="left w-full lg:w-1/4 lg:pr-[15px]">
                <div className="list-img-review flex gap-2">
                  <Image
                    priority={false}
                    src={'/images/product/product-1-large.webp'}
                    width={200}
                    height={200}
                    alt="img"
                    className="aspect-square w-[60px] rounded-lg"
                  />
                  <Image
                    priority={false}
                    src={'/images/product/product-1-large.webp'}
                    width={200}
                    height={200}
                    alt="img"
                    className="aspect-square w-[60px] rounded-lg"
                  />
                  <Image
                    priority={false}
                    src={'/images/product/product-1-large.webp'}
                    width={200}
                    height={200}
                    alt="img"
                    className="aspect-square w-[60px] rounded-lg"
                  />
                </div>
                <div className="user mt-3">
                  <div className="text-title">Tony Nguyen</div>
                  <div className="flex items-center gap-2">
                    <div className="text-secondary2">1 days ago</div>
                    <div className="text-secondary2">-</div>
                    <div className="text-secondary2">
                      <span>Yellow</span> / <span>XL</span>
                    </div>
                  </div>
                </div>
              </div>
              <div className="right w-full lg:w-3/4 lg:pl-[15px]">
                <Rate currentRate={5} size={16} />
                <div className="heading5 mt-3">
                  Unbeatable Style and Quality: A Fashion Brand That Delivers
                </div>
                <div className="body1 mt-3">
                  I can{String.raw`'t`} get enough of the fashion pieces from
                  this brand. They have a great selection for every occasion and
                  the prices are reasonable. The shipping is fast and the items
                  always arrive in perfect condition.
                </div>
                <div className="action mt-3">
                  <div className="flex items-center gap-4">
                    <div className="like-btn flex cursor-pointer items-center gap-1">
                      <Icon.HandsClapping size={18} />
                      <div className="text-button">20</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <Button
              type="button"
              className={`more-review-btn mt-2 text-center ${window.innerWidth <= 768 ? 'ml-32' : 'mx-auto'}`}
              label="View More Comments"
            ></Button>
          </div>
          {/* Purchased Product Info : Ends*/}

          {/* Form Review : Starts*/}
          <div id="form-review" className="form-review pt-6">
            <div className="heading4">Leave a comment</div>
            <form
              action={addReviewAction}
              id="form-review"
              className="mt-6 grid gap-4 gap-y-5 sm:grid-cols-1"
            >
              <div className="rating">
                <label
                  htmlFor="rating"
                  className="block text-sm font-medium text-gray-700"
                >
                  Your Rating *
                </label>
                <div className="flex w-full">
                  <Ratings
                    size={24}
                    onChange={(newRating) => {
                      setCurrentRating(newRating);
                    }}
                    initialValue={currentRating}
                  />
                </div>
                <input
                  type="hidden"
                  name="rating"
                  id="rating"
                  value={currentRating}
                />
              </div>
              <div className="heading">
                <label
                  htmlFor="heading"
                  className="block text-sm font-medium text-gray-700"
                >
                  Heading * (max 50 words)
                </label>
                <input
                  className="w-auto rounded-lg border border-line px-4 pb-3 pt-3"
                  id="heading"
                  type="text"
                  name="heading"
                  maxLength={50}
                  placeholder="Enter heading..."
                  required
                />
              </div>
              <div className="review col-span-full">
                <label
                  htmlFor="review"
                  className="block text-sm font-medium text-gray-700"
                >
                  Your review * (max 1000 words)
                </label>
                <textarea
                  className="w-full rounded-lg border border-line px-4 py-3"
                  id="review"
                  name="review"
                  maxLength={1000}
                  placeholder="Write your review..."
                  required
                ></textarea>
              </div>
              <div className="col-span-full sm:pt-3">
                <Button
                  type="submit"
                  className="button-main border border-black bg-white text-black"
                  label="Submit Review"
                ></Button>
              </div>
            </form>
          </div>
          {/* Form Review : Ends*/}
        </div>
      </div>
    )
  );
};

export default Reviews;
