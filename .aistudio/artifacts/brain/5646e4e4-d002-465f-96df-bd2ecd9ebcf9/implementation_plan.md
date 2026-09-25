# Dedicated A4 Printable Kundli Layout for Astronava Web App

A dedicated, multi-page printable layout and CSS print media query architecture implemented directly within the **Astronava Web Application**, ensuring all website UI chrome (header, navigation tabs, edit forms, footers) is completely suppressed during printing while formatting the Janam Kundli into a publication-grade 3-page A4 dossier.

---

## User Review & Critical Decisions

> [!IMPORTANT]
> The following revisions and specifications are locked into this plan based on your latest direction:

- **Web App Implementation Only (Mobile App Decoupled)**: Native Android app development is a separate project and is completely excluded from this scope. All changes are implemented directly inside this web application (`src/components/KundliGenerator.tsx`, `src/components/reports/`, and `src/index.css`).
- **3-Page Multi-Page Dossier**: Formatted for standard ISO A4 portrait paper:
  - **Page 1**: Native birth details, Panchang, Avakahada Chakra, and D1 Lagna & Chalit/Chandra diamond charts.
  - **Page 2**: Divisional Varga 2×2 Grid (**D1 Rashi, D9 Navamsha, D7 Saptamsha, D10 Dashamsha**) + Complete Graha Spashta (Planetary Longitudes & Dignities) table.
  - **Page 3**: Vimshottari Dasha 120-Year Timeline, Sarvashtakavarga 337-Bindu Matrix, Parashari Yogas, and Astrological Dosha Diagnostics (Manglik, Kaal Sarp, Sade Sati).
- **Remedies Omitted**: Vedic remedies and gemstone recommendations are excluded from print to ensure a compact, strict 3-page layout with no awkward page overflows.
- **Pure CSS `@media print` Suppression**: Web navigation header, tab bar, search modal, interactive sliders, edit form, famous people carousel, and website footer are completely hidden (`display: none !important`), rendering only the clean white `#printable-kundli-dossier`.

---

## 1. Overview & Core Concept

### What It Does
When a seeker or astrologer using the Astronava website clicks **"Print Kundli (A4)"** or presses `Ctrl+P` / `Cmd+P` on any generated chart, the browser print engine outputs a clean, ink-efficient 3-page Vedic Patrika document. The website layout seamlessly transitions using CSS print media queries, hiding web controls and rendering vector charts and tables formatted specifically for A4 paper.

### Target Audience & Persona
- **Web Seekers & Astrologers**: Accessing Astronava from desktop and laptop web browsers (Chrome, Safari, Edge, Firefox), requiring physical or PDF-printed horoscopes for consultations and archive records.

### Key Value
- **Zero Web UI Clutter**: Clean removal of website buttons, navigation bar, dark background gradients, and footer.
- **Strict A4 Paging**: Zero text splitting across paper breaks using `page-break-inside: avoid;` and `page-break-after: always;`.
- **High-Definition Vector Output**: SVG diamond charts scale crisply at any printer DPI (300+ DPI).

---

## 2. User Experience & Visual Design

### Web User Flows

1. **Generation & Print Trigger**:
   - The user calculates a Kundli on the **Kundli Maker** tab (or selects a sample profile).
   - In the top action bar of the generated report, a dedicated **"Print Kundli (A4)"** button (with a printer icon) sits alongside "Edit Details" and "Vedic Kundli PDF".
   - Clicking this button immediately invokes the browser's print dialog via `window.print()`.

2. **A4 Printed Document Breakdown**:
   - **Page 1: Janam Patrika & Birth Panchang**
     - Traditional Header: `॥ श्री गणेशाय नमः ॥` with Astronava wordmark, native name, and unique document reference ID.
     - Ephemeris & Birth Details: Full name, DOB, TOB, birth city, coordinates, timezone, and Chitrapaksha Lahiri Ayanamsha.
     - Panchanga Elements Table: Tithi, Paksha, Vaar (Day), Nakshatra & Pada, Yoga, Karana, Sun Sign, and Moon Sign.
     - Avakahada Chakra Table: Varna, Vashya, Yoni, Gana, Nadi, Tatva, and Rashi Lord.
     - Core Charts: D1 Lagna Kundli and Chalit/Moon Chart rendered side-by-side with house numbers and planetary symbols.
     - Page 1 footer with certification line and website URL (`www.astronava.com`).

   - **Page 2: Divisional Vargas (D1, D9, D7, D10) & Graha Spashta**
     - Header: `ग्रह स्पष्ट एवं प्रमुख षोडशवर्ग चक्र` (Planetary Longitudes & Divisional Charts).
     - 4-Chart Balanced 2×2 Grid:
       - **D1 Rashi Chart**: General life, physical vitality, self.
       - **D9 Navamsha Chart**: Dharma, destiny, spouse, inner potential.
       - **D7 Saptamsha Chart**: Progeny, children, creative lineage.
       - **D10 Dashamsha Chart**: Career, professional authority, public prestige.
     - Graha Spashta Table: 9 grahas (Sun to Ketu) with Nirayana sign, exact degrees/minutes/seconds, Nakshatra & Pada, Bhava placement, dignity (Exalted, Moolatrikona, Own, Friendly, Debilitated), avastha, and motion (Vakri/Direct).
     - Page 2 footer.

   - **Page 3: Vimshottari Dasha, Ashtakavarga & Classical Yogas**
     - Header: `विंशोत्तरी महादशा एवं सर्वाष्टकवर्ग चक्र` (120-Year Dasha Timeline & Strength Matrix).
     - Vimshottari Mahadasha Table: All 9 planetary periods with start dates, end dates, duration, and active period highlight.
     - Sarvashtakavarga 12-Sign Matrix: 337 total bindus distribution with strength status.
     - Classical Parashari Yogas & Diagnostics: Identified yogas with brief scriptural interpretations.
     - Astrological Dosha Diagnostics: Manglik status, Kaal Sarp status, and Sade Sati current phase.
     - Page 3 footer with authenticity checksum.

### Visual Identity & Theme Tokens for Print

```
[ PRINT STYLESHEET PALETTE & SPATIAL TOKENS ]
┌──────────────────────────┬──────────────┬────────────────────────────────────────┐
│ Token                    │ Value        │ Application                            │
├──────────────────────────┼──────────────┼────────────────────────────────────────┤
│ Page Geometry            │ 210mm x 297mm│ Standard ISO A4 Portrait Dimension     │
│ Margins                  │ 12mm - 14mm  │ Inner container padding, 0mm @page     │
│ Paper Base               │ #FFFFFF      │ Pure ink-saving white                  │
│ Primary Ink              │ #1C1917      │ Rich stone black for ultra-crisp type  │
│ Classical Vedic Accent   │ #78350F      │ Deep amber/burnt umber for titles      │
│ Ornamental Border Hairline│ #A8A29E      │ 1px double border frame                │
│ Table Header Fill        │ #F5F5F4      │ Light stone grey (monochrome safe)     │
│ Display Typography       │ Cinzel       │ Traditional classical serif headlines  │
│ Body & Ephemeris Data    │ Plus Jakarta │ Modern high-legibility sans-serif      │
│ Degrees & Timestamps     │ Tabular Mono │ Fixed-width alignment for minutes/secs │
└──────────────────────────┴──────────────┴────────────────────────────────────────┘
```

---

## 3. Key Product Decisions & Trade-Offs

- **Dedicated Print Component vs. CSS Overrides on Screen Cards**:
  - *Chosen Approach*: Implement a dedicated `PrintableKundliDossier` component mounted inside `KundliGenerator.tsx`. It is hidden on the screen via standard CSS (`hidden`), and set to `display: block !important` under `@media print`.
  - *Why*: The web application uses interactive accordions, zoom sliders, hover states, and dark luxury themes. Attempting to override dark-mode cards with print CSS results in broken borders and unwanted backgrounds. A dedicated print layout guarantees exact millimeter sizing and high printing quality.
- **Divisional Charts (D1, D9, D7, D10)**:
  - *Chosen Approach*: Focus on the 4 primary divisional charts in a 2×2 grid on Page 2, giving each chart approximately 130mm–135mm width so planetary symbols and rashi numbers remain crisp and readable on paper.
- **Remedies Omission**:
  - *Chosen Approach*: Strictly exclude gemstones, rudraksha, and ritual remedies from the print document, maintaining a clean 3-page astronomical report.

---

## 4. Technical Architecture & File Plan

### Architecture Diagram

```
┌────────────────────────────────────────────────────────────────────────┐
│ ASTRONAVA WEB APPLICATION (Screen Mode)                                │
│                                                                        │
│ ┌────────────────────────────────────────────────────────────────────┐ │
│ │ <Header> Navigation & User Status                                 │ │
│ ├────────────────────────────────────────────────────────────────────┤ │
│ │ <KundliGenerator>                                                  │ │
│ │   • Birth Details Input / Famous People Profiles                   │ │
│ │   • Interactive North Indian Diamond Chart (Zoom/Pan/Houses)       │ │
│ │   • Action Bar: [Edit] [New Chart] [Print Kundli (A4)] [PDF]      │ │
│ │   • Interactive Tab Panels (Dasha, Houses, Yogas, Remedies)       │ │
│ ├────────────────────────────────────────────────────────────────────┤ │
│ │ <footer> Site Links & Policies                                    │ │
│ └────────────────────────────────────────────────────────────────────┘ │
│                                                                        │
│ [Hidden on Screen: #printable-kundli-dossier (display: none)]          │
└────────────────────────────────────────────────────────────────────────┘

                                    │
                         User Triggers Print (Ctrl+P / Button)
                                    ▼

┌────────────────────────────────────────────────────────────────────────┐
│ PRINT VIEWPORT (@media print)                                          │
│                                                                        │
│ ❌ HIDDEN: header, footer, nav, button, input, modals, .no-print        │
│                                                                        │
│ ✅ VISIBLE: #printable-kundli-dossier                                  │
│                                                                        │
│ ┌────────────────────────────────────────────────────────────────────┐ │
│ │ PAGE 1 (A4: 210mm x 297mm)                                         │ │
│ │ • Invocation & Document Header (Astronava Seal)                    │ │
│ │ • Native Identity & Coordinates Block                              │ │
│ │ • Panchanga & Avakahada Chakra Tables                              │ │
│ │ • D1 Lagna Kundli + Chalit / Chandra Kundli (Vector SVGs)          │ │
│ │ • Running Footer & Page 1 of 3 Marker                              │ │
│ ├────────────────────────────────────────────────────────────────────┤ │
│ │ PAGE 2 (A4: 210mm x 297mm - page-break-after: always)              │ │
│ │ • Header: Graha Spashta & Divisional Vargas                        │ │
│ │ • 2x2 Core Varga Grid (D1 Rashi, D9 Navamsha, D7, D10)             │ │
│ │ • Complete Planetary Longitudes & Dignities Table                  │ │
│ │ • Running Footer & Page 2 of 3 Marker                              │ │
│ ├────────────────────────────────────────────────────────────────────┤ │
│ │ PAGE 3 (A4: 210mm x 297mm - page-break-after: avoid)               │ │
│ │ • Header: Vimshottari Dasha & Ashtakavarga Matrix                  │ │
│ │ • Full 120-Year Vimshottari Mahadasha Timeline Table               │ │
│ │ • Sarvashtakavarga 12-Sign Bindu Matrix (337 Bindus)               │ │
│ │ • Parashari Yogas & Astrological Doshas Diagnostics                │ │
│ │ • Authenticity Checksum & Page 3 of 3 Marker                       │ │
│ └────────────────────────────────────────────────────────────────────┘ │
└────────────────────────────────────────────────────────────────────────┘
```

### Specific Code Changes Planned
1. **`src/index.css`**:
   - Refine `@media print` rules to ensure `@page { size: A4 portrait; margin: 0; }` is strictly enforced.
   - Add `.print-dossier-page` styles with exact `210mm × 297mm`, `page-break-after: always;`, and `break-inside: avoid;`.
   - Hide all non-print elements: `header, footer, nav, button, [role="dialog"], .no-print`.
2. **`src/components/reports/PrintableKundliDossier.tsx` (New Component)**:
   - Create clean, modular 3-page A4 document component displaying:
     - Page 1: Native summary, Panchang, Avakahada, D1 & Chalit charts.
     - Page 2: D1, D9, D7, D10 divisional charts in 2×2 grid with Graha Spashta table.
     - Page 3: Vimshottari Dasha timeline, Sarvashtakavarga grid, and classical Yogas/Doshas.
3. **`src/components/KundliGenerator.tsx`**:
   - Add the **"Print Kundli (A4)"** button to the action bar with `window.print()` handler.
   - Render `<PrintableKundliDossier>` within the component when `kundliData` is available.
4. **Verification**:
   - Run `compile_applet` to confirm clean TypeScript compilation and build success.
