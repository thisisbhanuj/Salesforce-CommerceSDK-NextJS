'use client';
import React, { useEffect, useState } from 'react';

import { countdownTime } from '@/utility/countdownTime';

const Banner = () => {
  const [timeLeft, setTimeLeft] = useState(countdownTime());

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(countdownTime());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  return (
    <div className="time flex items-center rounded-lg bg-green px-5 py-3">
      <div className="heding5">🔥</div>
      <div className="caption1 pl-2">
        Your cart will expire in{' '}
        <span className="min text-button fw-700 text-red">
          {timeLeft.minutes}:
          {timeLeft.seconds < 10 ? `0${timeLeft.seconds}` : timeLeft.seconds}
        </span>
        <span> minutes! Please checkout now before your items sell out!</span>
      </div>
    </div>
  );
};

export default Banner;
