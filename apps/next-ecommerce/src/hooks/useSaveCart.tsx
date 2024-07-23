import { useEffect } from 'react';
import axios from 'axios';

import { CartState } from '../../types/CartType';

/**
 * Custom hook that saves the cart details in the database.
 * @param cart - The cart model containing the details to be saved.
 */

const useSaveCart = (cart: CartState) => {
  useEffect(() => {
    const saveCart = async () => {
      try {
        // Call the API to save the cart details in the database
        await saveCartDetails(cart);
        console.log('Cart details saved successfully!');
      } catch (error) {
        console.error('Error saving cart details:', error);
      }
    };

    saveCart();
  }, [cart]);
};

/**
 * Saves the cart details in the database.
 * @param cart - The cart model containing the details to be saved.
 */
const saveCartDetails = async (cart: CartState) => {
  const response = await axios.post(`/api/cart`, cart);
};

export default useSaveCart;
