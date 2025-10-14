# Firebase Setup - Critical Configuration

Essential code changes and configuration to integrate Firebase in Carpil.

## Required Files

### 1. GoogleService-Info.plist (iOS)

**Location**: Project root  
**File**: `/GoogleService-Info.plist`

Place your Firebase iOS configuration file in the project root.

### 2. google-services.json (Android)

**Location**: Project root  
**File**: `/google-services.json`

Place your Firebase Android configuration file in the project root.

---

## Configuration in app.json

**File**: `app.json`

Verify these plugins and file references exist:

```json
{
  "expo": {
    "plugins": [
      "@react-native-google-signin/google-signin",
      "@react-native-firebase/app",
      "@react-native-firebase/auth"
    ],
    "ios": {
      "googleServicesFile": "./GoogleService-Info.plist"
    },
    "android": {
      "googleServicesFile": "./google-services.json"
    }
  }
}
```

---

## Environment Variables

**File**: `.env`

Add your iOS Google Client ID:

```env
EXPO_PUBLIC_IOS_GOOGLE_CLIENT_ID=YOUR_CLIENT_ID.apps.googleusercontent.com
```

**Where to find it**: In `GoogleService-Info.plist`, look for the `CLIENT_ID` key.

---

## Android SHA-1 Configuration

### Get SHA-1 Fingerprint

```bash
cd android
./gradlew signingReport
```

Copy the SHA-1 from the output and add it to your Firebase project settings.

---

## Troubleshooting

### Google Sign-In Fails on Android

- Verify SHA-1 fingerprint is added to Firebase project
- Ensure `google-services.json` is in project root
- Run `npx expo prebuild --clean` and rebuild

### Google Sign-In Fails on iOS

- Verify `EXPO_PUBLIC_IOS_GOOGLE_CLIENT_ID` in `.env`
- Ensure `GoogleService-Info.plist` is in project root
- Run `cd ios && pod install` and rebuild

### Firestore Permission Denied

- Check Firestore security rules allow the operation
- Verify user is authenticated: `auth().currentUser`

---
