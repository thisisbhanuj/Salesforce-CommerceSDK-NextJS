'use client';

import { createStore } from 'zustand';
import { ProductType } from '@/ProductType';

export type PDPState = {
  productMain: ProductType;
  setProduct: (product: ProductType) => void;
  activeColor: string;
  handleActiveColor: (color: string) => void;
  activeSize: string;
  handleActiveSize: (size: string) => void;
  selectedQuantity: number;
  handleIncreaseQuantity: () => void;
  handleDecreaseQuantity: () => void;
};

/**
 * Initializes the page designer state.
 * @returns The initial page designer state.
 */
export const initPDPState = (): PDPState => {
  return {
    productMain: {} as ProductType,
    setProduct: (product: ProductType) => {},
    activeColor: '',
    handleActiveColor: (color: string) => {},
    activeSize: '',
    handleActiveSize: (size: string) => {},
    selectedQuantity: 1,
    handleIncreaseQuantity: () => {},
    handleDecreaseQuantity: () => {},
  };
};

/**
 * The default initial state of the page designer.
 */
const defaultInitState: PDPState = {
  productMain: {} as ProductType,
  setProduct: (product: ProductType) => {},
  activeColor: '',
  handleActiveColor: (color: string) => {},
  activeSize: '',
  handleActiveSize: (size: string) => {},
  selectedQuantity: 1,
  handleIncreaseQuantity: () => {},
  handleDecreaseQuantity: () => {},
};

/**
 * Creates a PDP store.
 * @param initState - The initial state of the PDP.
 * @returns The PDP store.
 */
const createPDPStore = () =>
  createStore<PDPState>()((set) => ({
    ...defaultInitState,
    productMain: defaultInitState.productMain,
    setProduct: (product: ProductType) =>
      set((state) => ({ ...state, productMain: product })),
    activeColor: defaultInitState.activeColor,
    handleActiveColor: (color: string) =>
      set((state) => ({ ...state, activeColor: color })),
    activeSize: defaultInitState.activeSize,
    handleActiveSize: (size: string) =>
      set((state) => ({ ...state, activeSize: size })),
    selectedQuantity: defaultInitState.selectedQuantity,
    handleIncreaseQuantity: () =>
      set((state) => ({
        ...state,
        selectedQuantity: state.selectedQuantity + 1,
      })),
    handleDecreaseQuantity: () =>
      set((state) => ({
        ...state,
        selectedQuantity:
          state.selectedQuantity > 1 ? state.selectedQuantity - 1 : 1,
      })),
  }));

export default createPDPStore;
