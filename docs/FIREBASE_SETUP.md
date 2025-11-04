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

**Note for Android**: The Web Client ID is automatically read from `google-services.json`, so you don't need to set it as an environment variable.

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

- Verify `google-services.json` is in project root and contains the correct OAuth client configuration
  - The library automatically reads the Web Client ID from this file
- Verify SHA-1 fingerprint is added to Firebase project (critical for Android)
  - Run `cd android && ./gradlew signingReport` to get your SHA-1
  - Add it in Firebase Console: Project Settings > General > Your apps > Android app > Add fingerprint
- Ensure `@react-native-google-signin/google-signin` plugin is configured in `app.config.ts`
- Run `npx expo prebuild --clean` and rebuild

### Google Sign-In Fails on iOS

- Verify `EXPO_PUBLIC_IOS_GOOGLE_CLIENT_ID` in `.env`
- Ensure `GoogleService-Info.plist` is in project root
- Run `cd ios && pod install` and rebuild

### Firestore Permission Denied

- Check Firestore security rules allow the operation
- Verify user is authenticated: `auth().currentUser`

---
