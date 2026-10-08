# Astronava Janam Kundli & Natal Dossier Redesign Specification

## 1. Design Rationale (Max 10 Bullets)
1. **Unified Color Palette & Contrast**: Established a warm cream and brown foundation (`#FAF7F2` background, `#FFFFFF` surface, `#2A1A12` text) with a single refined gold accent (`#C9A24A`) to eliminate visual clutter and ensure WCAG AA contrast (minimum 4.5:1).
2. **Strict Typography Hierarchy**: Utilized a single serif display font (`Cinzel`) for section titles in sentence/title case (no all-caps small caps), paired with clean sans (`Inter`) and Devanagari font scaling for Hindi parity.
3. **8px Grid & Single Card Standard**: Eliminated nested cards ("cards inside cards inside cards"). Enforced a uniform 16px radius white surface card with 1px border (`#E8DFD2`) and soft shadow.
4. **Ergonomic Button Hierarchy**: Standardized on exactly one primary filled brown button per section, secondary outlines, and tertiary text buttons with distinct hover, active, focus, and disabled states.
5. **Compact Hero & Profile Switcher**: Streamlined the hero section with compact title/subtitle and a grouped action toolbar on the right, plus a horizontal selectable card row for saved kundlis.
6. **Equal-Width Key-Facts Grid**: Organized birth summary facts into a clean, equal-width neutral tile grid, separating quick shortcuts (AI Synthesis, Full Report) into dedicated right-aligned action buttons.
7. **5/12 + 7/12 Sticky Two-Column Workspace**: Anchored the chart card and analysis tabs side-by-side with sticky top alignment for effortless desktop scanning and smooth mobile stacking.
8. **Precision SVG Kundli Chart**: Redesigned the astrological chart with thin 1.5px muted brown lines, fixed sign number positioning, and clean planet stack formatting (`Ju 24°` with superscript `R` for retrograde and Lagna badge highlighting).
9. **Streamlined AI Summary Panel**: Replaced multi-box nesting with a single banner, visible non-truncated selects, 2-column checklist, and ONE primary action button.
10. **Consistent Spacing & Accessibility**: Ensured all touch targets are at least 44px, keyboard navigation is fully supported, and contrast meets rigorous accessibility standards.

---

## 2. Design Tokens (CSS Variables)

```css
:root {
  --bg-app: #FAF7F2;
  --surface: #FFFFFF;
  --border-subtle: #E8DFD2;
  --text-main: #2A1A12;
  --text-muted: #6B5B50;
  --brand-brown: #7A3410;
  --gold-accent: #C9A24A;
  
  --radius-card: 16px;
  --radius-button: 10px;
  --radius-pill: 9999px;
  
  --font-display: 'Cinzel', serif;
  --font-sans: 'Inter', sans-serif;
}
```

---

## 3. Before / After Checklist

| Aspect | Before | After (Redesigned Dashboard) |
| :--- | :--- | :--- |
| **Visual Hierarchy** | Cluttered pastels, heavy gradients, competing accent buttons. | Warm cream/brown base, single gold accent, clean 1-primary button rule. |
| **Card Nesting** | Multiple cards nested 3-levels deep, causing visual fatigue. | Flat 1-level card system with 16px radius and 8px grid spacing. |
| **Typography** | Mixed uppercase small-caps, inconsistent font weights. | Title/sentence case serif display font, clean Inter sans, accessible contrast. |
| **Kundli Chart** | Thick framing, crowded text, overlapping degree labels. | Thin 1.5px clean lines, fixed sign numbers, stacked `Ju 24°` with `R` superscript. |
| **Workspace Layout** | Full-width vertical scrolling stack of disconnected sections. | 5/12 + 7/12 sticky two-column desktop workspace with scrollable tab rows. |
| **AI Summary Panel** | Cluttered nested boxes and duplicate generation triggers. | Streamlined single banner, visible dropdowns, 2-column checklist, 1 button. |
