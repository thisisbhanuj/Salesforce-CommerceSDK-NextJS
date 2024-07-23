import React, { FormEvent, useState } from 'react';
import {
  useStripe,
  useElements,
  PaymentElement,
} from '@stripe/react-stripe-js';

import Button from '@/components/ui/button';

type StripePaymentFormProps = {
  clientSecret: string;
  orderSubmitHandler: (paymentIntentId: string) => void;
};

const StripePaymentForm = ({
  clientSecret,
  orderSubmitHandler,
}: StripePaymentFormProps) => {
  const stripe = useStripe();
  const elements = useElements();

  const [errorMessage, setErrorMessage] = useState('');

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();

    if (!stripe || !elements) {
      // Stripe.js hasn't yet loaded.
      // Disable form submission until Stripe.js has loaded.
      console.log('Stripe.js has not loaded yet');
      return;
    }

    if (elements == null) {
      console.error('Elements not loaded');
      return;
    }

    // Trigger form validation and wallet collection
    const { error: submitError } = await elements.submit();
    if (submitError) {
      // Show error to customer
      setErrorMessage(submitError?.message ?? 'An unknown error occured');
      console.error(submitError.message);
      return;
    }
    //**************************************************************** */
    // Confirm the payment that was created server-side
    // Cannot use Server-Action because elements are not built-in type
    //**************************************************************** */
    await stripe
      .confirmPayment({
        elements,
        clientSecret,
        confirmParams: {
          return_url:
            window.location.hostname === 'localhost'
              ? 'http://localhost:3000'
              : window.location.origin,
        },
        redirect: 'if_required',
      })
      .then((result) => {
        console.debug(result);

        if (result.error) {
          setErrorMessage(result.error?.message ?? 'An unknown error occured');
          console.error(result.error.message);
        } else if (result.paymentIntent.status === 'succeeded') {
          orderSubmitHandler(result.paymentIntent.id);
        }
      });
  };

  return (
    <div>
      <form className="stripe" onSubmit={handleSubmit}>
        <PaymentElement />
        <Button
          type="submit"
          className="mt-5"
          disabled={!clientSecret}
          label="Place Order"
        ></Button>
      </form>

      {/* Show error message to your customers */}
      {errorMessage && <div>{errorMessage}</div>}
    </div>
  );
};

export default StripePaymentForm;
