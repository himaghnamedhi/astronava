# Astronava Android Mobile App (Separate Codebase)

This directory contains the separate Android mobile application codebase for **Astronava**. 

## Architecture & Data Synchronization
- **Backend Sync**: The Android app connects to the exact same Firebase project (`project-51605426-b73c-4f18-be6`) and Firestore database (`ai-studio-goodastroverceld-5646e4e4-d002-465f-96df-bd2ecd9ebcf9`) as the Astronava web application.
- **Shared Data**:
  - **Authentication**: Firebase Auth (Email/Password & Google Sign-In) keeps user sessions synchronized across web and mobile.
  - **Kundli & Birth Details**: Stored in Firestore under `users/{uid}`, ensuring instant cross-device sync.
  - **Orders & Wishlist**: Shared cart and order history synced in real-time.
  - **Horoscope & Match Reports**: Synchronized astrological calculations.

---

## Getting Started

1. **Capacitor Mobile Wrapper Setup**:
   Initialize Capacitor in this separate directory pointing to the web build output or hosting URL:
   ```bash
   npm init -y
   npm install @capacitor/core @capacitor/cli @capacitor/android
   npx cap init Astronava com.astronava.app --web-dir ../dist
   npx cap add android
   ```

2. **Firebase Configuration (`google-services.json`)**:
   Place your Firebase Android `google-services.json` inside `android/app/`.

3. **Building & Running**:
   ```bash
   npx cap open android
   ```
   This opens Android Studio to build and run the native Android app.
