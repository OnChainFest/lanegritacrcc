# Stripe Integration Guide - Torneo La Negrita CRCC 2025

## Overview

This tournament platform uses Stripe for secure payment processing. Players can pay for their registration using credit/debit cards through Stripe Checkout.

---

## Features

- ✅ Secure payment processing with Stripe Checkout
- ✅ Automatic payment verification via webhooks
- ✅ Multiple package options with dynamic pricing
- ✅ Early bird discount support
- ✅ Scratch add-on option
- ✅ Email confirmations
- ✅ Refund handling

---

## Setup Instructions

### 1. Create Stripe Account

1. Go to [stripe.com](https://stripe.com) and create an account
2. Complete account verification
3. Navigate to Developers > API keys

### 2. Get API Keys

You'll need three keys:

**Test Mode Keys** (for development):
- Publishable key: `pk_test_...`
- Secret key: `sk_test_...`

**Live Mode Keys** (for production):
- Publishable key: `pk_live_...`
- Secret key: `sk_live_...`

### 3. Configure Environment Variables

Add to your `.env.local` file:

```bash
# Stripe Keys
STRIPE_SECRET_KEY=sk_test_your_secret_key_here
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_your_publishable_key_here
STRIPE_WEBHOOK_SECRET=whsec_your_webhook_secret_here

# Application URL
NEXT_PUBLIC_URL=http://localhost:3000
```

### 4. Set Up Webhooks

1. Go to Stripe Dashboard > Developers > Webhooks
2. Click "Add endpoint"
3. Enter your webhook URL:
   - **Development**: Use [Stripe CLI](https://stripe.com/docs/stripe-cli) for local testing
   - **Production**: `https://yourdomain.com/api/stripe/webhook`

4. Select events to listen to:
   - `checkout.session.completed`
   - `payment_intent.succeeded`
   - `payment_intent.payment_failed`
   - `charge.refunded`

5. Copy the webhook signing secret to `STRIPE_WEBHOOK_SECRET`

---

## Testing Locally

### Using Stripe CLI

1. Install Stripe CLI:
```bash
# macOS
brew install stripe/stripe-cli/stripe

# Windows
scoop install stripe

# Linux
wget https://github.com/stripe/stripe-cli/releases/download/v1.19.4/stripe_1.19.4_linux_x86_64.tar.gz
```

2. Login to Stripe:
```bash
stripe login
```

3. Forward webhooks to local server:
```bash
stripe listen --forward-to localhost:3000/api/stripe/webhook
```

4. Use test card numbers:
```
Success: 4242 4242 4242 4242
Decline: 4000 0000 0000 0002
Requires Auth: 4000 0025 0000 3155
```

---

## API Endpoints

### POST /api/stripe/create-checkout

Create a Stripe Checkout session for player payment.

**Request:**
```json
{
  "playerId": "uuid",
  "playerName": "John Doe",
  "playerEmail": "john@example.com",
  "nationality": "CR",
  "packageSize": 3,
  "hasScratch": true,
  "categories": ["handicap", "senior"],
  "isEarlyBird": true
}
```

**Response:**
```json
{
  "success": true,
  "sessionId": "cs_test_...",
  "url": "https://checkout.stripe.com/c/pay/cs_test_..."
}
```

### POST /api/stripe/webhook

Webhook endpoint for Stripe events (handled automatically).

**Headers:**
- `stripe-signature`: Webhook signature for verification

**Events Handled:**
- `checkout.session.completed` - Payment successful
- `payment_intent.succeeded` - Payment processed
- `payment_intent.payment_failed` - Payment failed
- `charge.refunded` - Payment refunded

---

## Pricing Structure

All prices in USD:

### National (Costa Rica) Packages

| Package | Early Bird | Regular | + Scratch |
|---------|-----------|---------|-----------|
| 3 Games | $125 | $135 | +$22 |
| 4 Games | $140 | $150 | +$22 |

### International Packages

| Package | Early Bird | Regular | + Scratch |
|---------|-----------|---------|-----------|
| 3 Games | $122 | $132 | +$22 |
| 5 Games | $153 | $163 | +$22 |
| 8 Games | $201 | $210 | +$22 |

**Early Bird Deadline**: July 22, 2025 at 23:59:59 UTC

---

## Client-Side Integration

### Using the Hook

```typescript
import { useStripeCheckout } from '@/hooks/use-stripe-checkout'

function RegistrationForm() {
  const { initiateCheckout, loading, error } = useStripeCheckout()

  const handlePayment = async () => {
    try {
      await initiateCheckout({
        playerId: 'player-uuid',
        playerName: 'John Doe',
        playerEmail: 'john@example.com',
        nationality: 'CR',
        packageSize: 3,
        hasScratch: true,
        categories: ['handicap'],
        isEarlyBird: true,
      })
      // User will be redirected to Stripe Checkout
    } catch (err) {
      console.error('Payment failed:', err)
    }
  }

  return (
    <button onClick={handlePayment} disabled={loading}>
      {loading ? 'Processing...' : 'Pay with Card'}
    </button>
  )
}
```

### Direct Integration

```typescript
import { initiateStripeCheckout } from '@/lib/stripe-client'

const handlePayment = async () => {
  await initiateStripeCheckout({
    playerId: 'player-uuid',
    playerName: 'John Doe',
    playerEmail: 'john@example.com',
    nationality: 'INTL',
    packageSize: 5,
    hasScratch: false,
    isEarlyBird: false,
  })
}
```

---

## Payment Flow

```
1. Player fills registration form
   ↓
2. Client calls /api/stripe/create-checkout
   ↓
3. Server creates Stripe Checkout Session
   ↓
4. Player redirected to Stripe Checkout
   ↓
5. Player enters card details
   ↓
6. Stripe processes payment
   ↓
7. [SUCCESS] → Redirect to /payment/success
   └→ Webhook updates player status to "verified"

   [CANCEL] → Redirect to /payment/cancel
```

---

## Database Updates

When payment is successful, the webhook updates:

```sql
UPDATE players SET
  payment_status = 'verified',
  amount_paid = <session.amount_total / 100>,
  currency = 'USD',
  payment_method = 'stripe',
  stripe_session_id = <session.id>,
  stripe_payment_intent = <payment_intent.id>,
  verified_at = NOW()
WHERE id = <playerId>
```

---

## Refunds

To issue a refund:

1. Go to Stripe Dashboard > Payments
2. Find the payment
3. Click "Refund"
4. Webhook will automatically update player status to `refunded`

Or use the API:

```bash
stripe refunds create --payment-intent=pi_xxx --amount=12500
```

---

## Security Best Practices

1. ✅ **Never expose secret keys** - Use environment variables
2. ✅ **Verify webhook signatures** - Prevents fake webhooks
3. ✅ **Use HTTPS in production** - Required by Stripe
4. ✅ **Validate amounts server-side** - Don't trust client
5. ✅ **Log all transactions** - For auditing
6. ✅ **Test in test mode first** - Before going live

---

## Troubleshooting

### Webhook Not Receiving Events

1. Check webhook URL is accessible publicly
2. Verify `STRIPE_WEBHOOK_SECRET` is correct
3. Check Stripe Dashboard > Webhooks for failed attempts
4. Use Stripe CLI for local testing

### Payment Shows as Pending

1. Check webhook is configured correctly
2. Verify webhook handler is not throwing errors
3. Check database connection
4. Review server logs

### Test Cards Not Working

1. Ensure using test mode keys (`sk_test_`, `pk_test_`)
2. Use proper test card numbers from Stripe docs
3. Check for any validation errors

---

## Going Live

Before accepting real payments:

1. ✅ Switch to live mode keys
2. ✅ Update webhook endpoint to production URL
3. ✅ Test end-to-end flow with test cards
4. ✅ Verify webhook is receiving events
5. ✅ Check email confirmations are working
6. ✅ Review Stripe account settings
7. ✅ Enable production logging

---

## Support

- **Stripe Documentation**: https://stripe.com/docs
- **Stripe Support**: https://support.stripe.com
- **Test Cards**: https://stripe.com/docs/testing

---

## Changelog

### Version 1.0.0 (2025-01-01)
- Initial Stripe integration
- Checkout session creation
- Webhook handling
- Success/cancel pages
- Database updates
- Email confirmations (pending)
