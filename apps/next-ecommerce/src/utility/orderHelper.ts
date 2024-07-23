import axios from 'axios';

export async function submitOrder(
  cartId: string,
  paymentIntentId: string,
  stripeChargeId: string,
) {
  return axios
    .post('/api/order', {
      cartId,
      paymentIntentId,
      stripeChargeId,
    })
    .then((response) => response.data);
}
