'use client';

import React, { createContext, useContext, useState, ReactNode } from 'react';

interface ModalSearchContextProps {
  children: ReactNode;
}

interface ModalSearchContextValue {
  isModalOpen: boolean;
  openModalSearch: () => void;
  closeModalSearch: () => void;
}

const ModalSearchContext = createContext<ModalSearchContextValue | undefined>(
  undefined,
);

export const useModalSearchContext = (): ModalSearchContextValue => {
  const context = useContext(ModalSearchContext);
  if (!context) {
    throw new Error(
      'useModalSearchContext must be used within a ModalSearchProvider',
    );
  }
  return context;
};

export const ModalSearchProvider: React.FC<ModalSearchContextProps> = ({
  children,
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const openModalSearch = () => {
    setIsModalOpen(true);
  };

  const closeModalSearch = () => {
    setIsModalOpen(false);
  };

  const contextValue: ModalSearchContextValue = {
    isModalOpen,
    openModalSearch,
    closeModalSearch,
  };

  return (
    <ModalSearchContext.Provider value={contextValue}>
      {children}
    </ModalSearchContext.Provider>
  );
};
