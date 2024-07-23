'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { countdownTime } from '@/utility/countdownTime';
import * as Icon from '@phosphor-icons/react/dist/ssr';

const ComingSoon = () => {
  const [timeLeft, setTimeLeft] = useState(countdownTime());

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(countdownTime());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  return (
    <div className="coming-soon relative h-screen w-screen">
      <Image
        priority={false}
        src={'/images/other/bg-coming-soon.png'}
        width={4000}
        height={3000}
        alt="bg"
        className="absolute left-0 top-0 h-full w-full object-cover"
      />
      <div className="container h-full w-full">
        <div className="text-content relative flex h-full w-full items-center justify-center">
          <div className="content-main flex w-full flex-col items-center sm:w-3/5 lg:w-1/2">
            <div className="text-display">Coming Soon</div>
            <div className="countdown-time mt-6 flex items-center gap-5 md:mt-10 lg:mt-[60px]">
              <div className="item flex flex-col items-center">
                <div className="days time heading1">
                  {timeLeft.days < 10 ? `0${timeLeft.days}` : timeLeft.days}
                </div>
                <div className="text-button-uppercase font-medium">Days</div>
              </div>
              <span className="heading4">:</span>
              <div className="item flex flex-col items-center">
                <div className="hours time heading1">
                  {timeLeft.hours < 10 ? `0${timeLeft.hours}` : timeLeft.hours}
                </div>
                <div className="text-button-uppercase font-medium">Hours</div>
              </div>
              <span className="heading4">:</span>
              <div className="item flex flex-col items-center">
                <div className="minutes time heading1">
                  {timeLeft.minutes < 10
                    ? `0${timeLeft.minutes}`
                    : timeLeft.minutes}
                </div>
                <div className="text-button-uppercase font-medium">Minutes</div>
              </div>
              <span className="heading4">:</span>
              <div className="item flex flex-col items-center">
                <div className="seconds time heading1">
                  {timeLeft.seconds < 10
                    ? `0${timeLeft.seconds}`
                    : timeLeft.seconds}
                </div>
                <div className="text-button-uppercase font-medium">Seconds</div>
              </div>
            </div>
            <div className="input-block mt-6 h-[52px] w-full">
              <form className="relative h-full w-full" action="post">
                <input
                  type="email"
                  placeholder="Enter your e-mail"
                  className="caption1 h-full w-full rounded-xl border border-line pl-4 pr-14"
                  required
                />
                <button className="absolute bottom-1 right-1 top-1 flex aspect-square items-center justify-center rounded-xl bg-black text-white">
                  <Icon.ArrowRight className="heading5 text-white" />
                </button>
              </form>
            </div>
            <div className="list-link mt-6 flex items-center justify-center gap-6">
              <Link href={'https://www.facebook.com/'} target="_blank">
                <div className="icon-facebook text-xl"></div>
              </Link>
              <Link href={'https://www.instagram.com/'} target="_blank">
                <div className="icon-instagram text-xl"></div>
              </Link>
              <Link href={'https://www.youtube.com/'} target="_blank">
                <div className="icon-youtube text-xl"></div>
              </Link>
              <Link href={'https://www.twitter.com/'} target="_blank">
                <div className="icon-twitter text-xl"></div>
              </Link>
              <Link href={'https://www.pinterest.com/'} target="_blank">
                <div className="icon-pinterest text-xl"></div>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ComingSoon;
