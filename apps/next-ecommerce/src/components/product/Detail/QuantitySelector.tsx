import React, { useState } from 'react';
import * as Icon from '@phosphor-icons/react/dist/ssr';
import { useRouter } from 'next/navigation';
import toast, { Toaster } from 'react-hot-toast';
import { useSession } from 'next-auth/react';

import debouncer from '@/utility/debouncer';
import { useCart } from '@/context/CartContext';
import { addSkuToCart } from '@/actions/cart.actions';

import { ProductType } from '../../../../types/ProductType';
import { CartItem } from '../../../../types/CartType';

import Button from '@/components/ui/button';
import PopoverNotiifcation from '@/components/ui/popover-notifcation';

import { usePDPStore } from '@/zustand/context/usePDPStore';

interface Props {}

const QuantitySelector: React.FC<Props> = ({}) => {
  const [
    productMain,
    handleIncreaseQuantity,
    handleDecreaseQuantity,
    selectedQuantity,
    activeColor,
    activeSize,
  ] = usePDPStore((state) => [
    state.productMain,
    state.handleIncreaseQuantity,
    state.handleDecreaseQuantity,
    state.selectedQuantity,
    state.activeColor,
    state.activeSize,
  ]);

  const { data: session, status } = useSession();

  const [isPendingAddToCart, setIsPendingAddToCart] = useState<boolean>(false);

  const router = useRouter();
  const { loadCart } = useCart();

  const isAuthenticatd = session?.user && status === 'authenticated';

  const findVariantId = (
    product: ProductType | undefined,
    activeColor: string,
    activeSize: string,
  ) => {
    const variant = product?.variation?.find(
      (variant) =>
        variant.color === activeColor && product.sizes.includes(activeSize),
    );
    return variant?.skuId ?? '';
  };

  async function processAddToCart(
    selectedVariant: string,
    activeColor: string,
    activeSize: string,
    selectedQuantity: number,
  ) {
    const result = await addSkuToCart(
      selectedVariant,
      activeColor,
      activeSize,
      selectedQuantity,
    );
    if (result?.success && result.userCartModel) {
      const cartModel = JSON.parse(result.userCartModel.toString()) ?? {};
      const commerceItems: CartItem[] =
        cartModel.commerceItems ?? ([] as CartItem[]);
      loadCart(commerceItems);
      toast.success('Added to cart');
      setIsPendingAddToCart(false);
    }
  }

  const handleAddToCart = async () => {
    if (!isAuthenticatd) {
      router.push(`/login?callbackUrl=/product/${productMain?.id}`);
    } else {
      if (!activeColor || !activeSize) {
        window.document
          .querySelector('.popover-content')
          ?.classList.add('open');
        return;
      }

      setIsPendingAddToCart(true);

      const variantId = findVariantId(productMain, activeColor, activeSize);

      if (variantId) {
        await processAddToCart(
          variantId,
          activeColor,
          activeSize,
          selectedQuantity,
        );
      }
    }
  };

  const handleAddToCartDebounced = debouncer(handleAddToCart, 1000);

  return (
    <>
      <div className="text-title mt-5">Quantity:</div>
      <div className="choose-quantity mt-3 gap-5 gap-y-3 lg:justify-between">
        <div className="flex gap-4">
          <div className="quantity-block flex w-[120px] flex-shrink-0 items-center justify-between rounded-lg border border-line max-md:px-3 max-md:py-1.5 sm:w-[180px] md:p-3">
            <Icon.Minus
              size={20}
              onClick={handleDecreaseQuantity}
              className={`${productMain?.quantityPurchase === 1 ? 'disabled' : ''} cursor-pointer`}
            />

            <div className="body1 font-semibold">{selectedQuantity}</div>

            <Icon.Plus
              size={20}
              onClick={handleIncreaseQuantity}
              className="cursor-pointer"
            />
          </div>
          {/* flex-auto is required to fill the extra space in responsive manner */}
          <div className="flex flex-auto">
            <Button
              type="button"
              label={'Add to cart'}
              loading={isPendingAddToCart}
              disabled={isPendingAddToCart}
              className={`add-to-cart w-500px h-12 min-w-[200px] flex-auto cursor-pointer rounded-lg bg-black px-8 py-2 font-medium text-white md:h-14 md:w-[200px]`}
              onClick={handleAddToCartDebounced}
            />
          </div>
        </div>
        <PopoverNotiifcation message="Please select a size and color" />
      </div>
      <div className="mt-7 border-b border-line"></div>
      <Toaster
        position="top-center"
        toastOptions={{
          className: '',
          duration: 3000,
          style: {
            background: '#363636',
            color: '#ffff',
          },
          success: {
            style: {},
          },
          error: {
            style: {},
          },
        }}
      />
    </>
  );
};

export default QuantitySelector;
