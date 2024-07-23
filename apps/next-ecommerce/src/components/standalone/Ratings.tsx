import React, { useState } from 'react';
import * as Icon from '@phosphor-icons/react/dist/ssr';

interface RateProps {
  size: number;
  onChange?: (rating: number) => void;
  initialValue?: number;
}

const Ratings: React.FC<RateProps> = ({ size, onChange, initialValue = 0 }) => {
  const [currentRate, setCurrentRate] = useState(initialValue);

  const handleClick = (newRating: number) => {
    setCurrentRate((prevRate) => newRating);
    if (onChange) {
      onChange(newRating);
    }
  };

  return (
    <div className="rate flex">
      {[...Array(5)].map((_, index) => (
        <Icon.Star
          key={index}
          size={size}
          color={index < currentRate ? '#ECB018' : '#9FA09C'}
          weight="fill"
          onClick={() => handleClick(index + 1)} // Set rating on click
          style={{ cursor: 'pointer' }} // Add cursor pointer for hover feedback
        />
      ))}
    </div>
  );
};

export default Ratings;
