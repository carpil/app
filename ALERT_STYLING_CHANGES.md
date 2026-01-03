# Alert Dialog Styling Changes

## Summary
Replaced all native React Native `Alert.alert` calls with a custom styled alert component that matches the app's dark theme design system.

## Changes Made

### 1. Created Custom Styled Alert Component
**File:** `components/styled-alert.tsx`

- Created `StyledAlert` utility with `.alert()` method matching React Native's Alert API
- Created `StyledAlertProvider` component to wrap the app
- Styled alerts with:
  - Dark theme colors (`COLORS.inactive_gray`, `COLORS.gray_600`)
  - Rounded corners (16px border radius)
  - Proper spacing and typography
  - Button states (default, cancel, destructive)
  - Semi-transparent overlay backdrop
  - Shadow effects for depth
  - Support for multiple buttons
  - Queued alerts (one at a time)

### 2. Integrated Provider
**File:** `components/providers/app-providers.tsx`

- Added `StyledAlertProvider` to the app's provider tree
- Wraps all content to make alerts available throughout the app

### 3. Replaced All Alert.alert Calls
Updated the following files to use `StyledAlert.alert` instead of `Alert.alert`:

#### Authentication
- `app/login/login-email.tsx` (2 instances)
- `services/auth/apple.ts` (1 instance)
- `services/auth/google.ts` (1 instance)

#### Ride Management
- `app/ride/[id].tsx` (5 instances)
- `app/create-ride/ride-overview.tsx` (1 instance)
- `app/create-ride/ride-request-overview.tsx` (1 instance)

#### Payments & Checkout
- `hooks/use-debit-card.ts` (5 instances)
- `app/checkout/[rideId]/sinpe-movil.tsx` (4 instances)
- `app/checkout/[rideId]/index.tsx` (3 instances)
- `app/checkout/modal/index.tsx` (2 instances)

#### Ratings & Chat
- `app/ratings/modal.tsx` (2 instances)
- `app/chats/[chatId].tsx` (1 instance)

**Total:** 28 Alert.alert calls replaced across 13 files

## Design System Integration

The styled alerts match the app's design:
- **Background:** `COLORS.inactive_gray` (#1F2937)
- **Border:** `COLORS.gray_600` (#4B5563)
- **Title:** White, bold, 18px
- **Message:** `COLORS.gray_400` (#9CA3AF), 15px
- **Primary Button:** `COLORS.primary` (#6F52EA)
- **Cancel Button:** White text
- **Destructive Button:** Red (#EF4444)
- **Overlay:** Semi-transparent black (rgba(0, 0, 0, 0.6))

## Benefits

1. **Consistent Branding:** All alerts now match the app's dark theme
2. **Better UX:** Custom styling provides a more cohesive user experience
3. **Maintainability:** Centralized alert styling makes future updates easier
4. **Platform Consistency:** Same appearance on iOS and Android
5. **Flexibility:** Easy to add more button types or styling options

## Testing

To test the alerts:
1. Trigger any user flow that shows an alert (login, payment, ratings, etc.)
2. Verify the alert appears with the dark theme styling
3. Check that buttons work correctly (onPress handlers fire)
4. Ensure alerts queue properly (only one visible at a time)

## Notes

- The API remains compatible with React Native's Alert.alert
- Supports all button styles: 'default', 'cancel', 'destructive'
- Alerts are rendered in a Modal with fade animation
- Multiple alerts are queued and shown one at a time
