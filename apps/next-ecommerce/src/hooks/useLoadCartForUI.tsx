import { useCart } from '@/context/CartContext';
import { CartItem, CartType } from '@/CartType';

type CartContent =
  | {
      success: boolean | null;
      message: string | null;
      userCartModel: {} | CartType | null;
    }
  | null
  | {}
  | undefined;

const useLoadCartForUI = (cartContent: CartContent) => {
  const { loadCart } = useCart();

  if (
    cartContent &&
    'success' in cartContent &&
    cartContent.success &&
    cartContent.userCartModel
  ) {
    const currentCartModel =
      JSON.parse(cartContent.userCartModel.toString()) ?? {};
    console.log('currentCartModel', currentCartModel);
    const commerceItems = currentCartModel.commerceItems ?? ([] as CartItem[]);
    loadCart(commerceItems);
  }
};

export default useLoadCartForUI;
