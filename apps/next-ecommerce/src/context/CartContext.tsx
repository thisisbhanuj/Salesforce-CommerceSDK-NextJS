// @ts-nocheck

'use client';

import React, { createContext, useContext, useReducer } from 'react';
import { CartItem, CartState, CartType } from '../../types/CartType';

/**
 * Type for the props of the CartProvider component.
 * @typedef {Object} CartProps
 * @property {React.ReactNode} children - The children of the component.
 * @property {CartContent} cartContent - The content of the cart.
 */
type CartProps = {
  children: React.ReactNode;
  cartContent:
    | {
        success: boolean | null;
        message: string | null;
        userCartModel: CartType | null | {};
      }
    | null
    | {};
};

/**
 * Type for the possible actions that can be dispatched to the cart reducer.
 * @typedef {Object} CartAction
 * @property {'ADD_TO_CART' | 'REMOVE_FROM_CART' | 'UPDATE_CART' | 'LOAD_CART'} type - The type of the action.
 * @property {CartItem | string | { itemId: string; quantity: number; selectedSize: string; selectedColor: string } | CartItem[]} payload - The payload of the action.
 */
type CartAction =
  | { type: 'ADD_TO_CART'; payload: CartItem }
  | { type: 'REMOVE_FROM_CART'; payload: string }
  | {
      type: 'UPDATE_CART';
      payload: {
        itemId: string;
        quantity: number;
        selectedSize: string;
        selectedColor: string;
      };
    }
  | { type: 'LOAD_CART'; payload: CartItem[] };
/**
 * Interface for the context value provided by CartContext.
 * @interface
 * @property {CartState} cartState - The state of the cart.
 * @property {(item: CartItem) => void} addToCart - Function to add an item to the cart.
 * @property {(itemId: string) => void} removeFromCart - Function to remove an item from the cart by ID.
 * @property {(itemId: string, quantity: number, selectedSize: string, selectedColor: string) => void} updateCart - Function to update a cart item.
 */
interface CartContextProps {
  cartState: CartState;
  addToCart: (item: CartItem) => void;
  removeFromCart: (itemId: string) => void;
  updateCart: (
    itemId: string,
    quantity: number,
    selectedSize: string,
    selectedColor: string,
  ) => void;
  loadCart: (items: CartItem[]) => void;
}

/**
 * The context object for providing and consuming the cart state and actions.
 * @type {React.Context<CartContextProps | undefined>}
 */
const CartContext = createContext<CartContextProps | undefined>(undefined);

/**
 * Reducer function for managing the state of the cart.
 * @function
 * @param {CartState} state - The current state of the cart.
 * @param {CartAction} action - The action to be applied to the cart.
 * @returns {CartState} The new state of the cart.
 */
const cartReducer = (state: CartState, action: CartAction): CartState => {
  switch (action.type) {
    case 'ADD_TO_CART':
      const newItem: CartItem = {
        ...action.payload,
        selectedSize: '',
        selectedColor: '',
      };
      return {
        ...state,
        cartArray: [...state.cartArray, newItem],
      };
    case 'REMOVE_FROM_CART':
      return {
        ...state,
        cartArray: state.cartArray.filter((item) => item.ID !== action.payload),
      };
    case 'UPDATE_CART':
      return {
        ...state,
        cartArray: state.cartArray.map((item) =>
          item.ID === action.payload.itemId
            ? {
                ...item,
                quantity: action.payload.quantity,
                selectedSize: action.payload.selectedSize,
                selectedColor: action.payload.selectedColor,
              }
            : item,
        ),
      };
    case 'LOAD_CART':
      return {
        ...state,
        cartArray: action.payload,
      };
    default:
      return state;
  }
};

/**
 * Provider component for managing the cart state and actions.
 * @param {React.PropsWithChildren<CartProps>} props - The component props.
 * @returns {JSX.Element} The CartProvider component.
 */
export const CartProvider: React.FC<CartProps> = ({
  children,
  cartContent,
}) => {
  const [cartState, dispatch] = useReducer(cartReducer, {
    cartArray: cartContent?.userCartModel?.commerceItems ?? [],
  });

  const addToCart = (item: CartItem) => {
    dispatch({ type: 'ADD_TO_CART', payload: item });
  };

  const removeFromCart = (itemId: string) => {
    dispatch({ type: 'REMOVE_FROM_CART', payload: itemId });
  };

  const updateCart = (
    itemId: string,
    quantity: number,
    selectedSize: string,
    selectedColor: string,
  ) => {
    dispatch({
      type: 'UPDATE_CART',
      payload: { itemId, quantity, selectedSize, selectedColor },
    });
  };

  const loadCart = (items: CartItem[]) => {
    dispatch({ type: 'LOAD_CART', payload: items });
  };

  return (
    <CartContext.Provider
      value={{ cartState, addToCart, removeFromCart, updateCart, loadCart }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};
