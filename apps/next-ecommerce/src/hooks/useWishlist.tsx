import { useState } from 'react';

const useWishlistHook = () => {
  const [wishlist, setWishlist] = useState<string[]>([]);

  const addToWishlist = (productId: string) => {
    setWishlist((prevWishlist) => [...prevWishlist, productId]);
    window.localStorage.setItem('wishlist', JSON.stringify(wishlist));
  };

  const removeFromWishlist = (productId: string) => {
    setWishlist((prevWishlist) => {
      return prevWishlist.filter((id) => id !== productId);
    });
    window.localStorage.setItem('wishlist', JSON.stringify(wishlist));
  };

  return {
    wishlist,
    addToWishlist,
    removeFromWishlist,
  };
};

export default useWishlistHook;
