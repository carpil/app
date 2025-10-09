# React Native Maps Setup Guide

This guide covers the critical configuration steps for React Native Maps in the Carpil app.

**Prerequisites**: You must have Google Maps API keys for iOS and Android from Google Cloud Console.

---

## Required Package

Ensure `react-native-maps` is installed:

```json
{
  "dependencies": {
    "react-native-maps": "^1.20.1"
  }
}
```

If not installed:

```bash
yarn add react-native-maps
```

---

## Environment Configuration

**File**: `.env`

```env
EXPO_PUBLIC_GOOGLE_MAPS_API_KEY=YOUR_API_KEY_HERE
```

---

## app.json Configuration

**File**: `app.json`

Add the `react-native-maps` plugin to the plugins array:

```json
{
  "expo": {
    "plugins": ["react-native-maps"]
  }
}
```

**Android Configuration** (same file):

```json
{
  "expo": {
    "android": {
      "config": {
        "googleMaps": {
          "apiKey": "YOUR_ANDROID_API_KEY_HERE"
        }
      }
    }
  }
}
```

**Important**: Use the actual API key value, not `"process.env.EXPO_PUBLIC_GOOGLE_MAPS_API_KEY"` as a string.

---

## iOS Configuration

### 1. Location Permissions

**File**: `ios/carpil/Info.plist`

Verify these keys exist (added automatically by Expo prebuild):

```xml
<key>NSLocationWhenInUseUsageDescription</key>
<string>We need your location to show nearby rides and provide navigation.</string>

<key>NSLocationAlwaysAndWhenInUseUsageDescription</key>
<string>We need your location to show nearby rides and provide navigation.</string>

<key>NSLocationAlwaysUsageDescription</key>
<string>We need your location to track your ride and provide accurate ETA.</string>
```

### 2. Install Pods

After running `npx expo prebuild`, install iOS dependencies:

```bash
cd ios && pod install && cd ..
```

### 3. Build

```bash
npx expo run:ios
```

---

## Android Configuration

### 1. Run Expo Prebuild

This automatically configures the native Android project:

```bash
npx expo prebuild --clean
```

After prebuild, **apply the Android post-prebuild fixes** from the main `INSTALLATION.md` (Kotlin version, JVM target, etc.).

### 2. Verify AndroidManifest.xml

**File**: `android/app/src/main/AndroidManifest.xml`

The Google Maps API key should be automatically added:

```xml
<application>
    <meta-data
        android:name="com.google.android.geo.API_KEY"
        android:value="YOUR_ANDROID_API_KEY_HERE"/>
</application>
```

Location permissions should also be present:

```xml
<uses-permission android:name="android.permission.ACCESS_FINE_LOCATION" />
<uses-permission android:name="android.permission.ACCESS_COARSE_LOCATION" />
```

### 3. Build

```bash
npx expo run:android
```
