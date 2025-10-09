# Carpil - Installation Guide

Complete step-by-step guide to set up the Carpil React Native project from scratch on both iOS and Android platforms.

## Table of Contents

1. [Prerequisites](#prerequisites)
2. [Initial Project Setup](#initial-project-setup)
3. [Environment Configuration](#environment-configuration)
4. [iOS Platform Setup](#ios-platform-setup)
5. [Android Platform Setup](#android-platform-setup)
6. [Post-Prebuild Critical Fixes (Android)](#post-prebuild-critical-fixes-android)
7. [Troubleshooting](#troubleshooting)
8. [Additional Configuration](#additional-configuration)

---

## Prerequisites

Before starting, ensure you have the following tools installed:

### Required Software

- **Node.js** v18 or higher ([Download](https://nodejs.org/))
- **Yarn** or **npm** (npm comes with Node.js)
- **Xcode** (latest version) - For iOS development (macOS only)
  - Command Line Tools installed
- **Android Studio** - For Android development
  - Android SDK 35
  - Android SDK Build-Tools 35.0.0
  - Android Emulator or physical device
- **CocoaPods** - For iOS dependencies
  ```bash
  sudo gem install cocoapods
  ```
- **Expo CLI**
  ```bash
  npm install -g expo-cli
  ```

### Required API Keys

You'll need the following API keys (see [Additional Configuration](#additional-configuration) for setup):

- Google Maps API Key (iOS & Android)
- Firebase Project credentials
- Stripe Publishable Key
- Backend API URL

---

## Initial Project Setup

### 1. Clone the Repository

```bash
git clone <repository-url>
cd carpil/app
```

### 2. Install Dependencies

```bash
yarn install
# or
npm install
```

This will install all JavaScript dependencies listed in `package.json`.

---

## Environment Configuration

### 1. Create `.env` File

Create a `.env` file in the project root with the following variables:

```env
EXPO_PUBLIC_GOOGLE_MAPS_API_KEY=your_google_maps_api_key_here
EXPO_PUBLIC_API_URL=your_backend_api_url_here
EXPO_PUBLIC_IOS_GOOGLE_CLIENT_ID=your_ios_google_client_id_here
EXPO_PUBLIC_CHAT_SECRET_KEY=your_chat_secret_key_here
EXPO_PUBLIC_STRIPE_PUBLISHABLE_KEY=your_stripe_publishable_key_here
EXPO_PUBLIC_EXCHANGE_RATE_CRC_TO_USD=0.0020
```

### 2. Add Firebase Configuration Files

- **iOS**: Place your `GoogleService-Info.plist` in the project root
- **Android**: Place your `google-services.json` in the project root

These files are referenced in `app.json` and will be copied during the prebuild process.

---

## iOS Platform Setup

### 1. Navigate to iOS Directory

```bash
cd ios
```

### 2. Install CocoaPods Dependencies

```bash
pod install
# or from project root
npx pod-install
```

### 3. Return to Project Root

```bash
cd ..
```

### 4. Build and Run on iOS

```bash
yarn run ios
# or
npx expo run:ios
```

**Note**: The first build may take several minutes. Subsequent builds will be faster.

### 5. Verify iOS Configuration

The Podfile is automatically configured by Expo, but ensure:

- React Native Maps is properly linked
- Firebase is configured
- Google Sign-In is set up

For detailed iOS-specific configuration, see [docs/MAPS_SETUP.md](docs/MAPS_SETUP.md) and [docs/FIREBASE_SETUP.md](docs/FIREBASE_SETUP.md).

---

## Android Platform Setup

### Step 1: Verify `app.json` Configuration

Before running prebuild, ensure your `app.json` has the correct build properties:

```json
{
  "expo": {
    "plugins": [
      [
        "expo-build-properties",
        {
          "ios": {
            "useFrameworks": "static"
          },
          "android": {
            "kotlinVersion": "2.0.0"
          }
        }
      ]
    ]
  }
}
```

### Step 2: Run Expo Prebuild

```bash
npx expo prebuild --clean
```

This command generates the native Android and iOS projects.

### Step 3: Apply Post-Prebuild Fixes

⚠️ **CRITICAL**: After running prebuild, you MUST manually apply the fixes in [Section 6](#post-prebuild-critical-fixes-android) below.

### Step 4: Clean Gradle Cache

```bash
cd android
./gradlew clean
cd ..
```

### Step 5: Build and Run on Android

```bash
yarn run android
# or
npx expo run:android
```

---

## Post-Prebuild Critical Fixes (Android)

After running `npx expo prebuild --clean`, the following files need manual updates to fix Kotlin compatibility issues.

### File 1: `android/build.gradle`

#### Update 1: Kotlin Version (Line ~9)

Find:

```groovy
kotlinVersion = findProperty('android.kotlinVersion') ?: '1.9.25'
```

Replace with:

```groovy
kotlinVersion = findProperty('android.kotlinVersion') ?: '2.0.0'
```

#### Update 2: Kotlin Gradle Plugin (Line ~21)

Find:

```groovy
classpath('org.jetbrains.kotlin:kotlin-gradle-plugin')
```

Replace with:

```groovy
classpath("org.jetbrains.kotlin:kotlin-gradle-plugin:$kotlinVersion")
```

#### Update 3: Add Resolution Strategy (After `allprojects` block, ~Line 41)

Add this entire block after the closing `}` of the `allprojects` section:

```groovy
allprojects {
    repositories {
        google()
        mavenCentral()
        maven { url 'https://www.jitpack.io' }
    }

    configurations.all {
        resolutionStrategy {
            force "org.jetbrains.kotlin:kotlin-stdlib:${rootProject.ext.kotlinVersion}"
            force "org.jetbrains.kotlin:kotlin-stdlib-jdk7:${rootProject.ext.kotlinVersion}"
            force "org.jetbrains.kotlin:kotlin-stdlib-jdk8:${rootProject.ext.kotlinVersion}"
            force "org.jetbrains.kotlin:kotlin-reflect:${rootProject.ext.kotlinVersion}"
            force "org.jetbrains.kotlin:kotlin-compose-compiler-plugin-embeddable:${rootProject.ext.kotlinVersion}"
        }
    }
}
```

### File 2: `android/app/build.gradle`

#### Add Java 17 Compatibility (After `defaultConfig` block, ~Line 96)

Find the `defaultConfig` block:

```groovy
defaultConfig {
    applicationId 'com.carpil.carpil'
    minSdkVersion rootProject.ext.minSdkVersion
    targetSdkVersion rootProject.ext.targetSdkVersion
    versionCode 1
    versionName "1.0.0"
}
```

Add these blocks immediately after:

```groovy
compileOptions {
    sourceCompatibility JavaVersion.VERSION_17
    targetCompatibility JavaVersion.VERSION_17
}

kotlinOptions {
    jvmTarget = '17'
    freeCompilerArgs += ['-Xskip-metadata-version-check']
}
```

### Why These Changes Are Necessary

- **Kotlin 2.0.0**: Required for compatibility with `@react-native-google-signin/google-signin` v21.1.1
- **Resolution Strategy**: Forces all Kotlin dependencies to use the same version, preventing version conflicts
- **Java 17**: Ensures JVM target consistency between Java and Kotlin compilation
- **Compiler Flag**: Skips metadata version checks to prevent build failures with mixed Kotlin versions

---

## Troubleshooting

### Common Errors and Solutions

#### Error: `Could not find kotlin-compose-compiler-plugin-embeddable:1.9.25`

**Solution**: Apply the post-prebuild fixes in [Section 6](#post-prebuild-critical-fixes-android), specifically the resolution strategy in `android/build.gradle`.

#### Error: `codegenNativeCommands is not a function` (React Native Maps)

**Solution**:

1. Ensure Google Maps API key is properly configured in `.env`
2. Verify `app.json` has the correct Google Maps API key in the `android.config.googleMaps` section
3. Run `npx expo prebuild --clean` to regenerate native projects

#### Error: JVM target compatibility mismatch

**Solution**: Ensure both `compileOptions` and `kotlinOptions` in `android/app/build.gradle` are set to Java 17 (see Section 6).

#### iOS Build Fails

**Solution**:

1. Clean build folder: In Xcode, select Product > Clean Build Folder
2. Delete Pods: `cd ios && rm -rf Pods Podfile.lock && pod install`
3. Rebuild: `yarn run ios`

#### Android Gradle Build Fails

**Solution**:

1. Clean Gradle cache: `cd android && ./gradlew clean`
2. Re-run prebuild: `npx expo prebuild --clean --platform android`
3. Re-apply the fixes from Section 6
4. Build again: `yarn run android`

---

## Additional Configuration

Some dependencies require additional setup beyond the basic installation. See the following guides for detailed configuration:

### Firebase Setup

- **Guide**: [docs/FIREBASE_SETUP.md](docs/FIREBASE_SETUP.md)
- **Includes**:
  - Firebase project setup
  - Google Sign-In configuration
  - Firestore setup
  - Authentication configuration

### Stripe Integration

- **Guide**: [docs/STRIPE_SETUP.md](docs/STRIPE_SETUP.md)
- **Includes**:
  - API key configuration
  - Payment flow setup
  - Testing with test cards

### React Native Maps

- **Guide**: [docs/MAPS_SETUP.md](docs/MAPS_SETUP.md)
- **Includes**:
  - Google Maps API key setup
  - iOS Podfile configuration
  - Android manifest configuration
  - Location permissions

---

## Next Steps

After successful installation:

1. ✅ Verify all features work in development mode
2. ✅ Test on both iOS and Android devices/simulators
3. ✅ Configure backend API endpoints
4. ✅ Set up push notifications (see Firebase guide)
5. ✅ Review security settings before production deployment

---

## Need Help?

If you encounter issues not covered in this guide:

1. Check the [Troubleshooting](#troubleshooting) section
2. Review the detailed setup guides in the `docs/` folder
3. Check the React Native and Expo documentation
4. Contact the development team

---

**Last Updated**: January 2025
