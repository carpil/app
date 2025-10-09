# Stripe Setup - Critical Configuration

Essential code changes and configuration to integrate Stripe payments in Carpil.

## Environment Configuration

**File**: `.env`

```env
EXPO_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_YOUR_PUBLISHABLE_KEY_HERE
```

**Note**: Use test key (`pk_test_...`) for development, live key (`pk_live_...`) for production.

---

## Test Cards

Use these cards in test mode:

| Card Number         | Result             |
| ------------------- | ------------------ |
| 4242 4242 4242 4242 | Success            |
| 4000 0000 0000 0002 | Card declined      |
| 4000 0000 0000 9995 | Insufficient funds |

- **Expiry**: Any future date (e.g., 12/34)
- **CVC**: Any 3 digits (e.g., 123)
- **ZIP**: Any valid code

---
