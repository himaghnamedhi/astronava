# Implementation Plan - Remove Algorithmic Fallback & Enforce Pure AI Summary

We will remove the algorithmic fallback functions (`generateAlgorithmicVedicSummary`) and static templates from `src/server/geminiAstrology.ts` and ensure `AiKundliSummaryView.tsx` relies strictly on live Gemini AI generation. If the API key is missing or fails, we will show a clean, direct prompt to configure the API key or trigger AI generation rather than falling back to repetitive hardcoded templates.

## Proposed Changes

### 1. Backend (`src/server/geminiAstrology.ts`)
- Remove or disable `generateAlgorithmicVedicSummary` so that no static templates are used.
- Ensure `generateKundliAiSummary` throws a clear error if Gemini API key is missing or fails, rather than falling back.

### 2. Frontend (`src/components/astrology/AiKundliSummaryView.tsx`)
- Remove any rendering of static fallback boxes ("POSITIVE POTENTIAL" / "VULNERABILITIES & CHALLENGES" template boxes).
- Ensure the view displays loading states and pure AI-generated sections from Gemini.

## Verification Plan
- Compile applet with `compile_applet`.
- Verify pure AI-generated summaries load correctly without static template text.
