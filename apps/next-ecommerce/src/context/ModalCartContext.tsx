'use client';

import React, {
  createContext,
  useContext,
  useState,
  ReactNode,
  useMemo,
} from 'react';

interface ModalCartContextProps {
  children: ReactNode;
}

interface ModalCartContextValue {
  isModalOpen: boolean;
  openModalCart: () => void;
  closeModalCart: () => void;
}

const ModalCartContext = createContext<ModalCartContextValue | undefined>(
  undefined,
);

export const ModalCartProvider: React.FC<ModalCartContextProps> = ({
  children,
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const contextValue: ModalCartContextValue = useMemo(
    () => ({
      isModalOpen,
      openModalCart: () => {
        setIsModalOpen(true);
      },
      closeModalCart: () => {
        setIsModalOpen(false);
      },
    }),
    [isModalOpen],
  );

  return (
    <ModalCartContext.Provider value={contextValue}>
      {children}
    </ModalCartContext.Provider>
  );
};

export const useModalCartContext = (): ModalCartContextValue => {
  const context = useContext(ModalCartContext);
  if (!context) {
    throw new Error(
      'useModalCartContext must be used within a ModalCartProvider',
    );
  }
  return context;
};
