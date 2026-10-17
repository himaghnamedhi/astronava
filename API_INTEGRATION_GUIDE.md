# Astronava Mobile App API Integration Guide

This guide provides instructions and examples for integrating your separate mobile app project with the Astronava backend API and Firebase cloud database.

---

## 1. Base URL & Endpoints

- **Development Base URL**: `https://ais-dev-zxttfjvhxjhlskfajqp3e3-747336900579.asia-southeast1.run.app`
- **Production Base URL**: `https://www.astronava.com` (or your deployed domain)

---

## 2. Authentication & Data Sync (Firebase)
Both your web app and mobile app connect to the same Firebase project:
- **Project ID**: `project-51605426-b73c-4f18-be6`
- **Firestore Database ID**: `ai-studio-goodastroverceld-5646e4e4-d002-465f-96df-bd2ecd9ebcf9`

By initializing the Firebase SDK in your mobile app with these credentials and enabling Firebase Auth (Email/Password & Google Sign-In), user profiles, birth details, horoscope history, wishlist items, and store orders automatically sync in real-time across devices.

---

## 3. REST API Endpoints

### A. Generate Complete Vedic Kundli
Calculates full birth chart ephemeris, D1/D9 houses, planetary degrees, Vimshottari dasha, and Ashtakavarga.

- **Endpoint**: `POST /api/mobile/kundli`
- **Content-Type**: `application/json`

**Request Body Example**:
```json
{
  "name": "Himaghna Medhi",
  "gender": "male",
  "dob": "2003-12-12",
  "tob": "06:20",
  "city": "Nalbari, Assam",
  "latitude": 26.4449,
  "longitude": 91.4429,
  "timezoneOffset": 5.5
}
```

**JavaScript / Fetch Example**:
```javascript
const response = await fetch('https://ais-dev-zxttfjvhxjhlskfajqp3e3-747336900579.asia-southeast1.run.app/api/mobile/kundli', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    name: "Himaghna Medhi",
    dob: "2003-12-12",
    tob: "06:20",
    latitude: 26.4449,
    longitude: 91.4429,
    timezoneOffset: 5.5
  })
});
const data = await response.json();
console.log(data.kundliData);
```

---

### B. Generate 36 Guna Match Report (Kundli Milan)
Compares two birth charts and returns Ashtakoota Guna scores, Manglik analysis, and dosha evaluations.

- **Endpoint**: `POST /api/mobile/match`
- **Content-Type**: `application/json`

**Request Body Example**:
```json
{
  "p1": {
    "name": "Aarav Sharma",
    "gender": "male",
    "dob": "1996-05-15",
    "tob": "08:30",
    "latitude": 26.4449,
    "longitude": 91.4429,
    "timezoneOffset": 5.5
  },
  "p2": {
    "name": "Priya Das",
    "gender": "female",
    "dob": "1998-11-20",
    "tob": "14:15",
    "latitude": 27.4728,
    "longitude": 94.9120,
    "timezoneOffset": 5.5
  }
}
```

**JavaScript / Fetch Example**:
```javascript
const response = await fetch('https://ais-dev-zxttfjvhxjhlskfajqp3e3-747336900579.asia-southeast1.run.app/api/mobile/match', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ p1: groomDetails, p2: brideDetails })
});
const data = await response.json();
console.log(data.matchReport);
```

---

### C. AI Kundli Summary & Reports
- **Endpoint**: `POST /api/ai/summarize-kundli`
- **Endpoint**: `POST /api/ai/full-astrology-report`
- **Endpoint**: `POST /api/ai/match-analysis`

These endpoints take the generated Kundli / match data and return AI-powered narrative analyses using Gemini.
