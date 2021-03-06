const express = require('express')
const app = express()
const cors = require('cors')
const bodyParser = require('body-parser')
const stripe = require('stripe')('sk_test_51IQNqjHzOV3Y4X3pgssKRei86w2Xnk4H9nBSpDl4Tr1HBSR6iu6qPXN5cmunOPB69cJVoa4mpVPRsihICQdQqMCd00sjuXm24A');

const port = 3000

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))

// parse application/json
app.use(bodyParser.json())

app.use(cors())

app.post('/pay', async (req, res) => {
    const {email} = req.body;
    
    const paymentIntent = await stripe.paymentIntents.create({
        amount: 5000,
        currency: 'usd',
        // Verify your integration in this guide by including this parameter
        metadata: {integration_check: 'accept_a_payment'},
        receipt_email: email,
      });

      res.json({'client_secret': paymentIntent['client_secret']})
})

app.post('/sub', async (req, res) => {
  const {email, payment_method} = req.body;
  console.log('payment method', payment_method, email);
  const customer = await stripe.customers.create({
    payment_method: payment_method,
    email: email,
    invoice_settings: {
      default_payment_method: payment_method
    }
  })

  const subscription = await stripe.subscriptions.create({
    customer : customer.id,
    items: [{plan: "price_1IQQIVHzOV3Y4X3pMQyirH5f"}],
    expand: ["latest_invoice.payment_intent"]

  })

  const status = subscription['latest_invoice']['payment_intent']['status']
  const client_secret = subscription['latest_invoice']['payment_intent']['client_secret']

  res.json({
    'client_secret':client_secret,
    'status': status
  })
})

app.post('/webhooks', (req, res) => {
  const event = req.body

  switch(event.type) {
    case 'payment_intent.succeeded':
      const email = event[`data`]['object']['receipt_email']
      console.log(`Payment was successful for ${email}`)
    case 'payment_method.attached':
      const paymentMethod = event.data.object
      console.log('PaymentMethod was attached to a Customer')
      break;
    default:
      return res.status(400).end()
  }

  res.json({received: true})
})

app.listen(port, () => console.log(`Example app listening on port ${port}!`))