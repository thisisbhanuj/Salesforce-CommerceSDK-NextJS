'use client';

// ModalQuickviewContext.tsx
import React, { createContext, useContext, useState, ReactNode } from 'react';
import { ProductType } from '../../types/ProductType';

interface ModalQuickviewContextProps {
  children: ReactNode;
}

interface ModalQuickviewContextValue {
  selectedProduct: ProductType | null;
  openQuickview: (product: ProductType) => void;
  closeQuickview: () => void;
}

const ModalQuickviewContext = createContext<
  ModalQuickviewContextValue | undefined
>(undefined);

export const ModalQuickviewProvider: React.FC<ModalQuickviewContextProps> = ({
  children,
}) => {
  const [selectedProduct, setSelectedProduct] = useState<ProductType | null>(
    null,
  );

  const openQuickview = (product: ProductType) => {
    setSelectedProduct(product);
  };

  const closeQuickview = () => {
    setSelectedProduct(null);
  };

  return (
    <ModalQuickviewContext.Provider
      value={{ selectedProduct, openQuickview, closeQuickview }}
    >
      {children}
    </ModalQuickviewContext.Provider>
  );
};

export const useModalQuickviewContext = () => {
  const context = useContext(ModalQuickviewContext);
  if (!context) {
    throw new Error(
      'useModalQuickviewContext must be used within a ModalQuickviewProvider',
    );
  }
  return context;
};
