# Astronava Android App Design & Development Prompt

Copy and paste this prompt into Claude to design, architect, and build the native Android application for **Astronava**.

---

```markdown
# Role & Objective
You are a Principal Android Architect and Senior Mobile UI/UX Engineer specializing in high-performance Kotlin, Jetpack Compose, and Firebase-connected mobile applications. Your task is to design, architect, and implement the complete Android mobile application for **Astronava** (astronava.com) — a premier Vedic Astrology, Janam Kundli, Gemstone Recommender, and Sacred Store platform.

## 1. App Identity & Core Philosophy
- **App Name**: Astronava
- **Tagline**: Authentic Vedic Astrology, Janam Kundli, Gemstones & Sacred Store
- **Design Aesthetic**: Premium, spiritual, trustworthy, and modern. Uses a warm celestial color palette (Warm parchment `#FAF8F5`, deep charcoal `#1C1917`, sacred gold/amber accents `#F59E0B` and `#B45309`).
- **Target Audience**: Seekers of Vedic wisdom, astrological guidance, gemstone remedies, and authentic spiritual artifacts.

---

## 2. Architecture & Tech Stack Recommendations
- **Language**: Kotlin 1.9+
- **UI Toolkit**: Jetpack Compose with Material 3 design system.
- **Navigation**: Jetpack Navigation Compose (Bottom Navigation Bar with 5 primary tabs: Home, Horoscope, Generator/Kundli, Store, Profile).
- **Backend & Database**: Firebase Authentication (Email/Password & Google Sign-In) and Cloud Firestore (synchronized with the Astronava web backend).
- **Local Storage**: DataStore Preferences for user settings and offline caching.
- **Astrology Engine**: Kotlin port of Vedic ephemeris calculations (Ayanamsa Lahiri, house cusps, planet longitudes, Vimshottari Dasa periods, and 36 Guna Milan scoring).

---

## 3. Core Feature Modules to Design & Build

### Module A: Authentication & Onboarding
- **Sign In / Sign Up**: Firebase Auth integration supporting Email/Password and Google Sign-In.
- **Profile Setup**: Native birth details capture (Name, Gender, Date of Birth, Time of Birth, City of Birth with auto-complete, Latitude/Longitude).

### Module B: Home Dashboard Tab (`/home`)
- **Hero Banner**: Daily planetary transits & Vedic insight.
- **Quick Tools Grid**:
  1. Personalized Daily Horoscope
  2. Free Janam Kundli Maker
  3. Interactive Kundli Builder
  4. Gemstone Recommender
  5. 36 Guna Match Finder
  6. Numerology Calculator
  7. Vedic Name Correction
  8. Sacred Store

### Module C: Horoscope & Transits Tab (`/horoscope`)
- Daily sun sign / moon sign horoscope breakdown.
- Auspicious timings (Abhijit Muhurta, Rahu Kaal, Hora).
- Planetary transit notifications and insights.

### Module D: Kundli Maker & Builder Tabs (`/generator` & `/builder`)
- **Kundli Generator**: Enter birth details to compute North & South Indian chart styles, Bhava Chalit, planetary degrees, Ashtakavarga, and Vimshottari Dasa timeline.
- **Kundli Builder & Visualizer**: Interactive house and planet placement editor allowing users to drag/select planets across houses 1-12 with instant chart rendering and sequential fade-in entry animations.

### Module E: Gemstone Recommender Tab (`/gemstones`)
- Lagna-based Ratna analysis (Benefic stones: Neelam, Pukhraj, Manik, Panna, Munga, Diamond/Opal, etc.).
- Weight guidelines, wearing finger, metal (Gold/Silver), and mantra recitation rules.

### Module F: Horoscope Matching (Kundli Milan) Tab (`/match`)
- 36 Guna compatibility score calculator (Ashtakoota matching: Varna, Vashya, Tara, Yoni, Graha Maitri, Gana, Nadi, Bhakoot).
- Manglik dosha analysis and remedy suggestions.

### Module G: Sacred Store Tab (`/store`)
- Product catalog categorized into Certified Gemstones, Nepali Rudraksha, Yantras, and Energized Crystals.
- Product detail view with high-res imagery, certificate verification, and user reviews.
- Shopping Cart & Secure Checkout flow.
- Order tracking synced with Firestore.

### Module H: User Profile & Admin Master Control (`/profile` & `/mastercontrol`)
- Saved Kundlis and birth profiles.
- Order history and wishlist.
- **Admin Master Control (`/mastercontrol`)**: Authorized admin panel displaying API documentation, analytics, user management, and order fulfillment.

---

## 4. UI/UX & Component Guidelines
- **Bottom Navigation Bar**: Clean, persistent navigation with icons for Home, Horoscope, Kundli, Store, and Profile.
- **Typography**: Custom or system serif headings for Vedic titles, sans-serif body text for readability.
- **Animations**: Subtle entry animations (`AnimatedVisibility`, sequential fade-ins for chart grids and cards).
- **Accessibility**: Dark mode support, high contrast ratios, and clear touch targets (min 48dp).

## 5. Output Requirements
Please generate the complete project structure, key Jetpack Compose screens, ViewModels, Firebase repository interfaces, and ephemeris calculation utilities required to bootstrap and build the **Astronava Android App**.
```
