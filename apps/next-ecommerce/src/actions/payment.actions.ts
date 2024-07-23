'use server';

import Stripe from 'stripe';

async function createStripeInvoker() {
  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
    typescript: true,
    apiVersion: '2024-04-10',
  });
  return stripe;
}

export async function createPaymentIntent(
  orderTotal: number,
  currency: string,
) {
  try {
    const stripe = await createStripeInvoker();
    if (stripe) {
      const reposnse = await stripe.paymentIntents.create({
        currency: currency,
        amount: orderTotal * 100,
        automatic_payment_methods: {
          enabled: true,
        },
      });

      if (!reposnse) {
        console.error(reposnse);
        return {
          clientSecret: '',
          currency,
          amount: 0,
          success: false,
        };
      }

      if (reposnse?.client_secret && reposnse.amount > 0) {
        console.log('************Payment Intent Created************');
        console.log(reposnse);
        return {
          clientSecret: reposnse.client_secret,
          currency: currency,
          amount: reposnse.amount / 100,
          success: true,
        };
      }
    }
  } catch (error) {
    console.error('Error in creating payment intent', error);
    return {
      clientSecret: '',
      currency,
      amount: 0,
      success: false,
    };
  }
}

export async function fetchStripeCharge(paymentIntentId: string) {
  try {
    const stripe = await createStripeInvoker();
    if (stripe) {
      const reposnse = await stripe.paymentIntents.retrieve(paymentIntentId);

      if (!reposnse) {
        console.error(reposnse);
        return {
          success: false,
        };
      } else if (
        reposnse.object === 'payment_intent' &&
        reposnse.id === paymentIntentId
      ) {
        console.log(reposnse);
        return {
          chargeId: reposnse.latest_charge?.toString(),
          success: true,
        };
      }
    }
  } catch (error) {
    console.error('Error in fetching payment', error);
    return {
      success: false,
    };
  }
}

// When Stripe redirects the customer to the return_url,
// the payment_intent_client_secret query parameter is appended by Stripe.js.
// Retrieve the PaymentIntent to determine what to show to customer.
// **************** NOT IN USE AT PRESENT ****************
// const StripeProvider = () => {
//   const stripe = useStripe();

//   const [message, setMessage] = useState(null);

//   useEffect(() => {
//     const clientSecret = new URLSearchParams(window.location.search).get(
//       "payment_intent_client_secret"
//     );

//     if (!stripe || !clientSecret) {
//       return;
//     }

//     stripe.retrievePaymentIntent(clientSecret).then(({ paymentIntent }) => {
//       switch (paymentIntent.status) {
//         case "succeeded":
//           setMessage("Stripe Payment succeeded!");
//           sfccSubmitHandler();
//           break;
//         case "processing":
//           setMessage("Your payment is processing.");
//           break;
//         case "requires_payment_method":
//           setMessage("Your payment was not successful, please try again.");
//           break;
//         default:
//           setMessage("Something went wrong.");
//           break;
//       }

//       console.log(message);
//     }, []);
//   });
// };
