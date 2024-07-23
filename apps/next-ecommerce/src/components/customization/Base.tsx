import React, { useContext, useEffect } from 'react';

import { CustomizationContext } from '@/context/CustomizationContext';
import DecoratedRadioButton from '../ui/radioButton';

interface BaseProps {
  onNext: () => void;
}

const Base: React.FC<BaseProps> = ({ onNext }) => {
  const { selectedProduct, setSelectedProduct } =
    useContext(CustomizationContext);

  const options = [
    { label: 'T-Shirt', value: 'tshirt', bgclr: '#FFDAE9' },
    { label: 'Sweatshirt', value: 'sweatshirt', bgclr: '#FFDAE9' },
    { label: 'Top', value: 'top', bgclr: '#FFDAE9' },
  ];

  const handleProductChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSelectedProduct(event.target.value);
  };

  useEffect(() => {
    if (selectedProduct) {
      onNext();
    }
  }, [selectedProduct, onNext]);

  return (
    <div>
      <h2 className="mb-4 justify-center text-center text-2xl font-bold tracking-tight">
        Select Material
      </h2>
      <div className="flex flex-col gap-5">
        {options.map((option) => (
          <div className="flex flex-col" key={option.label}>
            <DecoratedRadioButton
              key={option.value}
              label={option.label}
              value={option.value}
              name="product"
              onChange={handleProductChange}
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default Base;
