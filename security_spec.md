# Security Specification: Astronava Data Rules

## 1. Data Invariants

### A. Match Finder Rules (`/matchSubmissions/{matchId}`)
- **Immutability**: Match records are permanent snapshots once written; updates are prohibited (`allow update: if false`).
- **24-Hour Expiration (TTL)**: Every submission must have `createdAt` equal to `request.time` and `expiresAt` set to exactly 24 hours in the future (`request.time + duration.value(24, 'h')`).
- **Read Guard**: No record can be read or queried after its `expiresAt` timestamp has passed (`resource.data.expiresAt > request.time`).
- **Strict Key Schema**: Only designated keys (`id`, `partner1`, `partner2`, `ashtakootaScore`, `maximumScore`, `compatibilityVerdict`, `createdAt`, `expiresAt`, `sessionId`) are allowed on creation.
- **Payload Boundary Limits**: String lengths for names, places, and verdicts are bounded; coordinates and Guna scores must adhere to numerical physical ranges.

### B. User Profiles & Birth Details (`/users/{userId}`)
- **Owner-Exclusive Access**: Only the authenticated user matching `userId` (`request.auth.uid == userId`) may read, create, update, or delete their profile.
- **Birth Details Boundary Limits**: `latitude` must be between -90 and 90; `longitude` between -180 and 180; `timezoneOffset` between -14 and 14; `dob` format YYYY-MM-DD (length 10).
- **Consent Guard**: User contact details (phone, email notifications) require explicit consent flag (`consentGiven == true`).

### C. Daily Horoscope Records (`/users/{userId}/dailyHoroscopes/{date}`)
- **Owner-Exclusive Access**: Read and written only within the authenticated user's subcollection (`request.auth.uid == userId`).
- **Date Key Constraint**: Document ID must be a valid ISO date string (length 10, e.g. `2026-09-21`) matching `incoming().date`.
- **Score Range Verification**: `overallScore` and category scores must strictly reside in [0, 100].
- **Request Time Integrity**: Document `createdAt` must equal `request.time`.

### D. User Accuracy Feedback (`/users/{userId}/horoscopeFeedback/{feedbackId}`)
- **Owner-Exclusive Write**: Authenticated user may only submit feedback under their own subcollection.
- **Star Rating Guard**: `rating` must be an integer between 1 and 4 inclusive.
- **Payload Size Bound**: Optional comments capped at 500 characters to prevent buffer bloat.
- **Immutability**: Once feedback is recorded, updates are prohibited (`allow update: if false`).

### E. Horoscope Subscriptions (`/users/{userId}/horoscopeSubscriptions/{subId}`)
- **Owner-Exclusive Access**: Subscriptions are scoped strictly to the authenticated user.
- **Channel Validation**: Channels list may only contain recognized notification mediums (`email`, `push`, `sms`, `whatsapp`).

## 2. The "Dirty Dozen" Adversarial Payloads
1. **Ghost Field Injection**: Adding an unapproved administrative or tracking field (e.g. `isAdmin: true` or `verified: true`) on creation.
2. **Backdated/Manipulated Timestamp**: Setting `createdAt` to a fabricated past or future timestamp instead of `request.time`.
3. **Eternal Record Bypass**: Setting `expiresAt` to 10 years in the future to evade retention ceilings.
4. **Negative or Inflated Astrological Scores**: Submitting scores < 0 or > 100 for horoscope categories or > 36 for Ashtakoota.
5. **Excessive String Length (Denial of Wallet)**: Setting horoscope text or comments to 500KB junk strings.
6. **Path Traversal / ID Poisoning**: Using path characters `/`, `..`, or control characters in document IDs.
7. **Invalid Latitude/Longitude**: Submitting `latitude: 999` or `longitude: -400`.
8. **Invalid Rating Bound**: Submitting a feedback rating of `0`, `5`, or `99`.
9. **Cross-User Tampering**: User A attempting to read, overwrite, or delete User B's `/users/{userB}/dailyHoroscopes/{date}`.
10. **Expired Document Snooping**: Attempting to read a temporary document whose `expiresAt` has already lapsed.
11. **Blanket Query Scraping**: Attempting an unrestricted collection query across all users or subscriptions without authenticated scoping.
12. **Non-Numeric / Corrupted Time Structure**: Submitting malformed time strings or impossible timezone offsets.

