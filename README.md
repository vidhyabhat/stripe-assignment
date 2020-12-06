# stripe-assignment

## Installation

In server/.env, add the stripe secret (test) key.
Also add the webhook signature that we will use to authenticate the webhook.

```
STATIC_DIR="../client/build"
WEBHOOK_SIGNATURE="whsec_..."
STRIPE_KEY="sk_..."
```

In client/.env, add the stripe publishable (test) key.

```
REACT_APP_STRIPE_KEY="pk_..."
```

## Running the example

1. Run the server

```
cd server/
npm install
npm start
```

The server will run on port 4242.

2. Run the client

```
cd client/
npm install
npm start
```

The client will run on port 3000.

## Testing the integration

Navigate to http://localhost:3000.
You can now purchase one or more of the hotdog pins at $12.00/pin from this website.