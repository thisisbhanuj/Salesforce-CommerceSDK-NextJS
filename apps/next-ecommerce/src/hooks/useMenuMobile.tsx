import { useState, useEffect } from 'react';

const useMenuMobile = () => {
  const [openMenuMobile, setOpenMenuMobile] = useState(false);

  const handleMenuMobile = () => {
    setOpenMenuMobile((toggleOpen) => !toggleOpen);
  };

  // Check if the click event occurs outside the popup.
  const handleClickOutsideMenuMobile: EventListener = (event) => {
    // Cast event.target to Element to use the closest method.
    const targetElement = event.target as Element;

    if (openMenuMobile && !targetElement.closest('#menu-mobile')) {
      setOpenMenuMobile(false);
    }
  };

  useEffect(() => {
    // Add a global click event to track clicks outside the popup.
    document.addEventListener('click', handleClickOutsideMenuMobile);

    // Cleanup to avoid memory leaks.
    return () => {
      document.removeEventListener('click', handleClickOutsideMenuMobile);
    };
  }, [openMenuMobile]);

  return {
    openMenuMobile,
    handleMenuMobile,
  };
};

export default useMenuMobile;
