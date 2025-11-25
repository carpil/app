# Professional Logger System - Usage Guide

## Overview

The Carpil app now features a professional logging system that integrates with **Sentry** and **Firebase Crashlytics**. This system provides:

- ✅ **Context-aware logging** - Automatically captures screen, user, and app information
- ✅ **Environment-based behavior** - Different logging strategies for dev vs production
- ✅ **Automatic user tracking** - Syncs with authentication state
- ✅ **Navigation breadcrumbs** - Tracks user journey through the app
- ✅ **Performance tracing** - Measure operation durations
- ✅ **Sampling strategy** - 10% of production sessions get full logging

## Log Levels

The system has 4 log levels:

1. **DEBUG** - Development troubleshooting (console only in production)
2. **INFO** - General information (console only in production unless sampled)
3. **WARN** - Concerning issues (always sent to Sentry/Crashlytics)
4. **ERROR** - Critical errors (always sent to Sentry/Crashlytics)

## Basic Usage

### In Non-Component Files

```typescript
import { logger } from '@utils/logs'

// Simple logging
logger.info('User profile loaded')

// Logging with context
logger.info('Ride created', {
  screen: 'CreateRideScreen',
  action: 'ride_create',
  metadata: { rideId: '123', passengers: 3 }
})

// Error logging
logger.error('Failed to load rides', {
  action: 'fetch_rides_error',
  metadata: { endpoint: '/api/rides' }
})

// Exception handling
try {
  await api.createRide(data)
} catch (error) {
  logger.exception(error, {
    screen: 'CreateRideScreen',
    action: 'create_ride_failed',
    metadata: { rideData: data }
  })
}
```

### In React Components (Recommended)

Use the `useLogger` hook to automatically include screen context:

```typescript
import { useLogger } from 'hooks/useLogger'

function ProfileScreen() {
  const log = useLogger()  // Screen name automatically detected

  useEffect(() => {
    log.info('Screen mounted', { action: 'screen_view' })
  }, [])

  const handleUpdate = async () => {
    try {
      log.info('Updating profile', { action: 'profile_update_start' })
      await updateProfile(data)
      log.info('Profile updated successfully', { action: 'profile_update_success' })
    } catch (error) {
      log.exception(error, {
        action: 'profile_update_failed',
        metadata: { profileData: data }
      })
    }
  }

  return <View>...</View>
}
```

### Custom Screen Names

```typescript
// Override auto-detected screen name
const log = useLogger('CustomScreenName')

log.info('Custom event', { action: 'custom_action' })
```

## Advanced Features

### Performance Tracing

Track operation durations:

```typescript
import { logger } from '@utils/logs'

async function fetchUserRides() {
  const span = logger.startSpan('fetch_rides', 'Loading user rides')
  
  try {
    const rides = await api.getRides()
    span.finish({ ridesCount: rides.length, success: true })
    return rides
  } catch (error) {
    span.finish({ success: false, error: error.message })
    throw error
  }
}
```

### Manual Breadcrumbs

Add breadcrumbs for important user actions:

```typescript
logger.addBreadcrumb('User clicked payment button', 'user_action', {
  paymentMethod: 'card',
  amount: 50.00
})
```

### User Identification

The system automatically syncs with your auth state, but you can also set user context manually:

```typescript
logger.setUser(userId, userEmail, userName)

// Clear user context
logger.setUser(null)
```

## How It Works

### Development Mode (`__DEV__` = true)

- ✅ All logs written to console with emojis and colors
- ❌ Nothing sent to Sentry
- ❌ Nothing sent to Crashlytics
- 🎯 Fast feedback for development

### Production Mode

**For WARN and ERROR levels:**
- ✅ Always sent to Sentry with full context
- ✅ Always sent to Crashlytics
- ✅ Written to console

**For DEBUG and INFO levels:**
- ✅ Written to console
- ⚡ Sent to Sentry/Crashlytics only for sampled sessions (10%)

### Sampling Strategy

- On app start, a random decision is made: "Should this session send all logs?"
- 10% of sessions are selected for full logging
- The decision is stored for 24 hours
- WARN/ERROR logs are ALWAYS sent regardless of sampling

This approach reduces costs while still capturing comprehensive data from enough sessions.

## Automatic Features

### User Context

When a user logs in/out, their information is automatically:
- Set in Sentry (`id`, `email`, `username`)
- Set in Crashlytics (`userId`, attributes)
- Included in every log message

### Navigation Tracking

Every screen navigation automatically:
- Creates a Sentry breadcrumb
- Logs a screen view with the route path
- Tracks the navigation trail

### Screen Name Detection

The `useLogger` hook automatically determines the screen name from:
- Tab routes: `(tabs)/profile` → `ProfileTab`
- Standard routes: `create-ride` → `CreateRideScreen`
- Dynamic routes: `[id]` → `IdScreen`

## Best Practices

### 1. Use Appropriate Log Levels

```typescript
// ✅ Good
logger.debug('Cache hit for user data')  // Development info
logger.info('User completed onboarding')  // Milestone events
logger.warn('API rate limit approaching')  // Potential issues
logger.error('Payment processing failed')  // Critical errors

// ❌ Bad
logger.error('User clicked button')  // Not an error!
logger.debug('Payment failed')  // Too low for critical issue
```

### 2. Include Actionable Context

```typescript
// ✅ Good - Clear action and useful metadata
logger.info('Ride created', {
  action: 'ride_create',
  metadata: {
    rideId: ride.id,
    origin: ride.origin,
    destination: ride.destination,
    passengers: ride.passengerIds.length
  }
})

// ❌ Bad - Vague, no context
logger.info('Something happened')
```

### 3. Use the Hook in Components

```typescript
// ✅ Good - Screen context automatic
const log = useLogger()
log.info('Profile loaded')  // Screen name included

// ❌ Less ideal - Manual screen tracking
import { logger } from '@utils/logs'
logger.info('Profile loaded', { screen: 'ProfileScreen' })
```

### 4. Track User Flows

```typescript
// Track complete user journeys
const log = useLogger()

log.info('Checkout started', { action: 'checkout_start' })
log.info('Payment method selected', { action: 'payment_method', metadata: { method: 'card' } })
log.info('Payment submitted', { action: 'payment_submit' })
log.info('Checkout completed', { action: 'checkout_complete' })
```

### 5. Always Use Exception Method for Errors

```typescript
// ✅ Good - Full error details captured
try {
  await riskyOperation()
} catch (error) {
  log.exception(error, {
    action: 'operation_failed',
    metadata: { context: 'additional info' }
  })
}

// ❌ Bad - Loses stack trace
catch (error) {
  log.error(error.message)
}
```

## Troubleshooting

### Not Seeing Logs in Sentry/Crashlytics?

1. Check you're in production mode (`__DEV__` = false)
2. For DEBUG/INFO logs, remember only 10% of sessions send them
3. WARN/ERROR logs should always appear

### User Context Not Appearing?

The `LoggerAuthSync` component in `AppProviders` watches auth state. Ensure:
1. `AppProviders` wraps your app
2. User logs in through `useAuthStore.login()`

### Screen Names Incorrect?

Override with custom screen name:
```typescript
const log = useLogger('MyCustomScreenName')
```

## Implementation Files

- **Types**: `types/logger.ts`
- **Logger Core**: `utils/logs.ts`
- **Setup/Config**: `utils/logger-setup.ts`
- **React Hook**: `hooks/useLogger.ts`
- **Navigation Integration**: `app/_layout.tsx`
- **Auth Integration**: `components/providers/app-providers.tsx`

## Console Output Format

```
🐛 Debug message [ScreenName] {action} (user: userId)
ℹ️  Info message [ScreenName] {action} (user: userId)
⚠️  Warning message [ScreenName] {action} (user: userId)
❌ Error message [ScreenName] {action} (user: userId)
```

## Questions?

For solopreneurs tracking app health, this logging system provides:
- 📊 Clear visibility into user behavior
- 🐛 Fast error diagnosis with full context
- 💰 Cost-effective with sampling
- 🎯 Production-ready observability

Happy logging! 🚀

