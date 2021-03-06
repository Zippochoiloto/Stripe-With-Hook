import React from 'react';
// Components
import HomePage from './HomePage';
// Stripe
import {Elements} from '@stripe/react-stripe-js';
import {loadStripe} from '@stripe/stripe-js';
// Styles
import '../index.scss';

const stripePromise = loadStripe('pk_test_51IQNqjHzOV3Y4X3pSWpMN2TRrLny3QTBWDBMvM1VCxfIgKzOy2hEMRlIJdZoC7O8qR3zlcAVyWFUBY0M5EozjTeo00qq0jneW6');

function App() {
  return (
    <Elements stripe={stripePromise}>
      <HomePage />
    </Elements>
  );
}

export default App;
