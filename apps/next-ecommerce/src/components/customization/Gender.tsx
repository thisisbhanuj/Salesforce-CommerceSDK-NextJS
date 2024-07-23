import React, { useContext, useEffect } from 'react';

import { CustomizationContext } from '@/context/CustomizationContext';

import './index.css';
import DecoratedRadioButton from '../ui/radioButton';

interface GenderProps {
  onNext: () => void;
}

const Gender: React.FC<GenderProps> = ({ onNext }) => {
  const { selectedGender, setSelectedGender } =
    useContext(CustomizationContext);

  const handleGenderChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSelectedGender(event.target.value);
  };

  const options = [
    { label: 'Male', value: 'male', bgclr: '#FFDAE9' },
    { label: 'Female', value: 'female', bgclr: '#FFDAE9' },
    { label: 'Unisex', value: 'unisex', bgclr: '#FFDAE9' },
  ];

  useEffect(() => {
    if (selectedGender) {
      onNext();
    }
  }, [selectedGender, onNext]);

  return (
    <>
      <h2 className="mb-4 justify-center text-center text-2xl font-bold tracking-tight">
        Select Gender
      </h2>
      <div className="flex flex-col gap-5">
        {options.map((option) => (
          <div className="flex flex-col" key={option.label}>
            <DecoratedRadioButton
              key={option.value}
              label={option.label}
              value={option.value}
              name="gender"
              onChange={handleGenderChange}
            />
          </div>
        ))}
      </div>
    </>
  );
};

export default Gender;
