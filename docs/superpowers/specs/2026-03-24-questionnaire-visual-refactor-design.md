# Questionnaire Visual Refactor — Design Spec

**Date:** 2026-03-24
**Status:** Approved

## Problem

The current questionnaire has two UX weaknesses:

1. **Style selection (Step 3)** uses text-only chips (Minimalista, Industrial, etc.). Most users don't know what these style names mean, making the choice arbitrary.
2. **Measurements (Step 2)** uses `<input type="number">` for m². Most residential clients don't know their exact square footage, so the field feels like a blocker even though it's optional.

## Solution

### Step 3 — Visual style cards

Replace the text chips with a **3-column grid of square (1:1) image cards**. Each card shows a real Unsplash photo of the style and the style name as a white label overlaid at the bottom of the image. Users can select multiple cards (multi-select unchanged).

**Style list expands from 5 → 10:**
| Key | Label |
|-----|-------|
| minimalista | Minimalista |
| industrial | Industrial |
| escandinavo | Escandinavo |
| classico | Clássico |
| moderno | Moderno |
| boho | Boho |
| japandi | Japandi |
| rustico | Rústico |
| contemporaneo | Contemporâneo |
| provencal | Provençal |

**Card visual spec:**
- `aspect-ratio: 1/1`, `overflow: hidden`, brand border `2px solid transparent`
- `object-fit: contain` — image shown fully without cropping; background fills with warm neutral (`#e8e0d6`) for letterbox areas
- Label: `position: absolute; bottom: 0.6rem; left: 50%; transform: translateX(-50%)` — small caps white text, semi-transparent dark pill background
- Selected state: walnut border + box-shadow + walnut-tinted label pill + `✓` badge top-right

**Unsplash CDN URLs (final, curated):**
```
minimalista:    photo-1741394546743-2d64519ba0d3
industrial:     photo-1759264244827-1dde5bee00a5
escandinavo:    photo-1631679706909-1844bbd07221
classico:       photo-1638284457192-27d3d0ec51aa
moderno:        photo-1704040686428-7534b262d0d8
boho:           photo-1633505899118-4ca6bd143043
japandi:        photo-1604578762246-41134e37f9cc
rustico:        photo-1726090401458-7abb00f7450c
contemporaneo:  photo-1594873604892-b599f847e859
provencal:      photo-1756358789192-c55b1ca45bb9
```
URL format: `https://images.unsplash.com/photo-{id}?w=400&h=400&fit=contain&q=80`

### Step 2 — Free-text measurements

Replace `<input type="number">` (area in m²) with a `<textarea>` (2 rows). The field remains optional.

- Label: keep existing i18n key, update text to something like "Medidas (se souber)"
- Placeholder: `"Ex: sala 4x5m, quarto 3x3m, ou só 'apartamento de 60m²'"`
- State type: `area: string` (was `area: number | null`)

## Scope — What Changes

| File | Change |
|------|--------|
| `src/components/questionnaire/Step3Style.tsx` | Replace chip buttons with image card grid |
| `src/components/questionnaire/Step2Environment.tsx` | Replace `<input type="number">` with `<textarea>` |
| `src/components/questionnaire/QuestionnaireWizard.tsx` | Update `step2.area` type from `number \| null` to `string` |
| `src/messages/pt.json` | Add 5 new style keys, update area label/placeholder |
| `src/messages/en.json` | Same |
| `src/messages/es.json` | Same |

## Scope — What Does NOT Change

- Step 1 (identity fields)
- Step 4 (scope/urgency/budget)
- roomType chips in Step 2
- File upload in Step 2
- mustHave textarea in Step 3
- Multi-step wizard navigation and animation
- Server action (`submitQuestionnaire.ts`)
- Overall wizard layout and branding

## i18n Notes

Style labels are proper nouns / loanwords — they stay the same across pt/en/es (e.g. "Japandi", "Boho"). The area field placeholder should be translated naturally per locale.

## Acceptance Criteria

1. Step 3 shows 10 image cards in a 3-column grid; cards are clickable and toggle selected state with walnut styling.
2. Each card shows the full photo without cropping; letterbox areas use warm neutral background.
3. Step 2 area field is a textarea; accepts free text; submits as string to server action.
4. All three locales (pt/en/es) have the 5 new style keys and updated area field copy.
5. No regressions in Step 1, Step 4, or other Step 2/3 fields.
