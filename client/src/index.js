import React, { useState } from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import reportWebVitals from './reportWebVitals';
import {Elements} from '@stripe/react-stripe-js';
import {loadStripe} from '@stripe/stripe-js';
import Modal from "react-modal";

import CheckoutForm from './CheckoutForm';
const env = require("dotenv").config({ path: "./.env" });
const stripePromise = loadStripe(process.env.REACT_APP_STRIPE_KEY);

class App extends React.Component {
  constructor() {
    super();
    this.state = {
      isOpen: false,
      count: 0,
      error: null,
      clientSecret: null,
    };
  }
  
  createPaymentIntent = () => {
    const orderData = {
      items: this.state.count,
      currency: "usd"
    };

    fetch("http://localhost:4242/pay", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(orderData)
    })
      .then(res => res.json())
      .then(
        (result) => {
          this.setState({
            isLoaded: true,
            clientSecret: result.clientSecret
          });
          this.toggleModal();
        },
        // Note: it's important to handle errors here
        // instead of a catch() block so that we don't swallow
        // exceptions from actual bugs in components.
        (error) => {
          this.setState({
            isLoaded: true,
            error
          });
        }
      )
  }

  handleChange = (event) => {
    this.setState({count: event.target.value});
  }

  toggleModal = () => {
    this.setState({isOpen:!this.state.isOpen});
  }

  render() {
    return (
    <Elements stripe={stripePromise}>
      <form>
        <label>
          Buy hotdog pins ($12 / pin):
          <input type="text" name="count" value={this.state.count} onChange={this.handleChange}/>
        </label>
      </form>

      <br /><br />
      <button onClick={() => this.createPaymentIntent()}>
        Checkout
      </button>
      
      <Modal
        isOpen={this.state.isOpen}
        onRequestClose={this.toggleModal}
        contentLabel="Payment"
      >
        <CheckoutForm clientSecret={this.state.clientSecret}/>
        <button onClick={this.toggleModal}>Finished</button>
      </Modal>
    </Elements>);
  }
}

ReactDOM.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
  document.getElementById('root')
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
