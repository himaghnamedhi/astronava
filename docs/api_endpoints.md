# Astronava Platform & API Directory

This document maps all official Astronava web subdomains, user-facing pages, and backend serverless API endpoints to help integrate both the web platform and the native Android application.

---

## 1. Official Subdomains & Web Entry Points

| Purpose | URL / Subdomain | Description |
| :--- | :--- | :--- |
| **Main Portal / Landing** | `https://www.astronava.com` | Main homepage, introductory Vedic wisdom, and overview. |
| **Authentication Hub** | `https://auth.astronava.com` | Central Google & Email sign-in / sign-up gateway for all services. |
| **Astrology App & Tools** | `https://app.astronava.com` | Interactive Kundli generator, daily horoscope dashboard, matchmaking, and numerology. |
| **Sacred Store & E-commerce** | `https://shop.astronava.com` | Certified gemstone catalog, rudraksha malas, cart, and checkout. |
| **SEO Index / Sitemap** | `https://www.astronava.com/sitemap` | Google Search Console indexable sitemap directory. |

---

## 2. Serverless API Endpoints (Firebase Cloud Functions)

**Base API URL:**
```
https://us-central1-ai-studio-goodastroverceld-5646e4e4.cloudfunctions.net
```

### Authentication Header Requirement:
All protected endpoints require a Firebase Auth token in the request header:
```http
Authorization: Bearer <FIREBASE_ID_TOKEN>
Content-Type: application/json
```

---

### Endpoint Reference

#### A. Get User Profile
* **API Route:** `GET /getUserProfile`
* **Web Equivalent:** `https://app.astronava.com/profile`
* **Description:** Retrieves seeker profile, birth coordinates, and preferences.

#### B. Calculate Janam Kundli
* **API Route:** `POST /calculateKundli`
* **Web Equivalent:** `https://app.astronava.com/generator`
* **Description:** Computes Lahiri ephemeris planetary positions, D1-D12 divisional charts, and Vimshottari Dasha.
* **Request Body Example:**
  ```json
  {
    "dob": "1995-11-23",
    "tob": "06:45",
    "latitude": 28.6139,
    "longitude": 77.2090
  }
  ```

#### C. Get Store Products
* **API Route:** `GET /getStoreProducts`
* **Web Equivalent:** `https://shop.astronava.com`
* **Description:** Fetches certified gemstones and consecrated rudraksha catalog.

#### D. Get User Orders
* **API Route:** `GET /getOrders`
* **Web Equivalent:** `https://shop.astronava.com/orders` (or `https://app.astronava.com/profile`)
* **Description:** Retrieves past consecrated orders and delivery statuses.
