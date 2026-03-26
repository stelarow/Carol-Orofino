# Questionnaire Restyling — Design Spec
**Date:** 2026-03-25
**Scope:** `src/components/questionnaire/`
**Approach:** Inline color token swap — no new components, no structural changes

---

## Goal

Replace all `walnut`-based colors in the questionnaire with `black` (texts/borders) and `slate` (buttons/progress), matching the footer's visual language and improving contrast on the `linen` background.

---

## Color Mapping

| Element | Current | New |
|---|---|---|
| Primary action buttons | `bg-walnut text-linen hover:bg-latte` | `bg-slate text-linen hover:bg-slate/80` |
| Labels / section headers | `text-slate` | `text-black` |
| Hint & secondary texts | `text-slate` | `text-black/70` |
| Error messages | `text-walnut/80` | `text-black/70` |
| Back links | `text-slate hover:text-walnut` | `text-black hover:text-black/60` |
| Input/textarea/select borders (idle) | `border-stone` | `border-black/30` |
| Input focus state | `focus:border-walnut` | `focus:border-black` |
| Upload zone idle border | `border-stone` | `border-black/30` |
| Upload zone drag-over border | `border-walnut` | `border-black` |
| Upload zone drag-over bg | `bg-walnut/5` | `bg-black/5` |
| PDF selected state border | `border-walnut` | `border-black` |
| PDF selected state bg | `bg-walnut/5` | `bg-black/5` |
| PDF panel icon & filename text | `text-walnut` | `text-black` |
| PDF panel remove button hover | `hover:bg-walnut/10` | `hover:bg-black/10` |
| "Adicionar mais" link base | `text-slate/70` | `text-black/50` |
| "Adicionar mais" link hover | `hover:text-walnut` | `hover:text-black` |
| Video thumbnail background | `bg-stone/30` | `bg-black/10` |
| Video thumbnail icon & filename | `text-slate` | `text-black/70` |
| Chips/radios unselected idle border | `border-stone` | `border-black/30` |
| Chips/radios selected border | `border-walnut` | `border-black` |
| Chips/radios selected bg | `bg-walnut/8` | `bg-black/8` |
| Chips/radios selected text | `text-walnut` | `text-black` |
| Selected radio dot | `text-walnut` | `text-black` |
| Style selection badge (Step3) | `bg-walnut text-linen` | `bg-black text-white` |
| Style selected overlay (Step3) | `rgba(139,111,94,0.50)` | `rgba(0,0,0,0.50)` |
| Progress bar track | `bg-stone` | `bg-black/20` |
| Progress bar fill | `bg-walnut` | `bg-slate` |
| Progress label | `text-walnut` | `text-black` |
| SuccessScreen ✦ icon | `text-walnut` | `text-black` |
| SuccessScreen message text | `text-slate` | `text-black/70` |

---

## Files to Modify

- `src/components/questionnaire/QuestionnaireWizard.tsx` — progress bar + progress label
- `src/components/questionnaire/Step1Identity.tsx` — input borders, labels, errors, Next button
- `src/components/questionnaire/Step2Environment.tsx` — input borders, labels, errors, upload zones, navigation buttons
- `src/components/questionnaire/Step3Style.tsx` — textarea border, labels, style badge, selected overlay, navigation buttons
- `src/components/questionnaire/Step4Scope.tsx` — radio/select borders, selected states, labels, errors, navigation buttons
- `src/components/questionnaire/SuccessScreen.tsx` — ✦ icon color and message text

---

## Out of Scope

- `useImageUpload` hook — no changes
- `Step*Data` types — no changes
- i18n message files — no changes
- Any layout, spacing, or animation changes
- Any component outside `src/components/questionnaire/`
- `hover:border-latte` on unselected chip/radio hover states — left as-is (transient hover, warm tone acceptable)
- `placeholder:text-slate/60` on inputs — left as-is (placeholder text is transient and visually subordinate)
