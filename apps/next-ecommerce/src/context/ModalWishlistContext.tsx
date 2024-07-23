'use client';

import React, { createContext, useContext, useState, ReactNode } from 'react';

interface ModalWishlistContextProps {
  children: ReactNode;
}

interface ModalWishlistContextValue {
  isModalOpen: boolean;
  openModalWishlist: () => void;
  closeModalWishlist: () => void;
}

const ModalWishlistContext = createContext<
  ModalWishlistContextValue | undefined
>(undefined);

export const useModalWishlistContext = (): ModalWishlistContextValue => {
  const context = useContext(ModalWishlistContext);
  if (!context) {
    throw new Error(
      'useModalWishlistContext must be used within a ModalWishlistProvider',
    );
  }
  return context;
};

export const ModalWishlistProvider: React.FC<ModalWishlistContextProps> = ({
  children,
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const openModalWishlist = () => {
    setIsModalOpen(true);
  };

  const closeModalWishlist = () => {
    setIsModalOpen(false);
  };

  const contextValue: ModalWishlistContextValue = {
    isModalOpen,
    openModalWishlist,
    closeModalWishlist,
  };

  return (
    <ModalWishlistContext.Provider value={contextValue}>
      {children}
    </ModalWishlistContext.Provider>
  );
};
