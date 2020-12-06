import React from 'react';
import {useStripe, useElements, CardElement} from '@stripe/react-stripe-js';

import CardSection from './CardSection';
import { useState } from 'react';

const CheckoutForm = (props) => {
  const stripe = useStripe();
  const [msg, setMsg] = useState("");
  const elements = useElements();

  const handleSubmit = async (event) => {
    // We don't want to let default form submission happen here,
    // which would refresh the page.
    event.preventDefault();

    if (!stripe || !elements) {
      // Stripe.js has not yet loaded.
      // Make sure to disable form submission until Stripe.js has loaded.
      return;
    }

    const result = await stripe.confirmCardPayment(props.clientSecret, {
      payment_method: {
        card: elements.getElement(CardElement),
        billing_details: {
          name: 'Jenny Rosen',
        },
      }
    });

    if (result.error) {
      setMsg(result.error);
    } else {
      // The payment has been processed!
      if (result.paymentIntent.status === 'succeeded') {
        setMsg("payment succeeded");
      }
    }
  };

  return (
    <>
      <form onSubmit={handleSubmit} >
        <CardSection />
        <button disabled={!stripe && msg === null}>Confirm order</button>
      </form>
      <hr />
      
      <br />
      <div id="status">
        { msg }
      </div>
      <br />
    </>
  ); 
}

export default CheckoutForm;