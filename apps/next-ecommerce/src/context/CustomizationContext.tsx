'use client';

import React, { createContext, useMemo, useState } from 'react';

const CustomizationContext = createContext({
  selectedGender: '',
  selectedProduct: '',
  selectedMaterial: '',
  setSelectedGender: (arg: string) => {},
  setSelectedProduct: (arg: string) => {},
  setSelectedMaterial: (arg: string) => {},
});

const CustomizationProvider = ({ children }: { children: React.ReactNode }) => {
  const [selectedGender, setSelectedGender] = useState('');
  const [selectedProduct, setSelectedProduct] = useState('');
  const [selectedMaterial, setSelectedMaterial] = useState('');

  const contextValue = useMemo(() => {
    return {
      selectedGender,
      selectedProduct,
      selectedMaterial,
      setSelectedGender,
      setSelectedProduct,
      setSelectedMaterial,
    };
  }, [
    selectedGender,
    selectedProduct,
    selectedMaterial,
    setSelectedGender,
    setSelectedProduct,
    setSelectedMaterial,
  ]);

  return (
    <CustomizationContext.Provider value={contextValue}>
      {children}
    </CustomizationContext.Provider>
  );
};

export { CustomizationContext, CustomizationProvider };
