import React, { useContext, useEffect } from 'react';

import { CustomizationContext } from '@/context/CustomizationContext';
import DecoratedRadioButton from '../ui/radioButton';

interface MaterialProps {
  onNext: () => void;
}

const Material: React.FC<MaterialProps> = ({ onNext }) => {
  const { selectedMaterial, setSelectedMaterial } =
    useContext(CustomizationContext);

  const options = [
    { label: 'Cotton', value: 'Cotton', bgclr: '#FFDAE9' },
    { label: 'Polyster', value: 'Polyster', bgclr: '#FFDAE9' },
  ];

  const handleMaterialChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSelectedMaterial(event.target.value);
  };

  useEffect(() => {
    if (selectedMaterial) {
      onNext();
    }
  }, [selectedMaterial, onNext]);

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
              name="material"
              onChange={handleMaterialChange}
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default Material;
