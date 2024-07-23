'use client';

import React, { createContext, useContext, useReducer } from 'react';
import { ProductType } from '../../types/ProductType';

interface CompareItem extends ProductType {}

interface CompareState {
  compareArray: CompareItem[];
}

type CompareAction =
  | { type: 'ADD_TO_COMPARE_LIST'; payload: ProductType }
  | { type: 'REMOVE_FROM_COMPARE_LIST'; payload: string }
  | { type: 'LOAD_COMPARE_LIST'; payload: CompareItem[] };

interface CompareContextProps {
  compareState: CompareState;
  addToCompare: (item: ProductType) => void;
  removeFromCompare: (itemId: string) => void;
}

const CompareContext = createContext<CompareContextProps | undefined>(
  undefined,
);

const CompareReducer = (
  state: CompareState,
  action: CompareAction,
): CompareState => {
  switch (action.type) {
    case 'ADD_TO_COMPARE_LIST':
      const newItem: CompareItem = { ...action.payload };
      return {
        ...state,
        compareArray: [...state.compareArray, newItem],
      };
    case 'REMOVE_FROM_COMPARE_LIST':
      return {
        ...state,
        compareArray: state.compareArray.filter(
          (item) => item.id !== action.payload,
        ),
      };
    case 'LOAD_COMPARE_LIST':
      return {
        ...state,
        compareArray: action.payload,
      };
    default:
      return state;
  }
};

export const CompareProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [compareState, dispatch] = useReducer(CompareReducer, {
    compareArray: [],
  });

  const addToCompare = (item: ProductType) => {
    dispatch({ type: 'ADD_TO_COMPARE_LIST', payload: item });
  };

  const removeFromCompare = (itemId: string) => {
    dispatch({ type: 'REMOVE_FROM_COMPARE_LIST', payload: itemId });
  };

  return (
    <CompareContext.Provider
      value={{ compareState, addToCompare, removeFromCompare }}
    >
      {children}
    </CompareContext.Provider>
  );
};

export const useCompare = () => {
  const context = useContext(CompareContext);
  if (!context) {
    throw new Error('useCompare must be used within a CompareProvider');
  }
  return context;
};
