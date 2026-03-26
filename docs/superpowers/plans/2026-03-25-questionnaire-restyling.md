# Questionnaire Restyling Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace all `walnut`-based color tokens in the questionnaire with `black` (texts/borders) and `slate` (buttons/progress) to improve contrast on the `linen` background.

**Architecture:** Pure Tailwind class swap across 6 component files — no new components, no behavior changes, no new tests. Existing tests cover behavior only; they remain green throughout. Each task covers one file and ends with a passing test run and a commit.

**Tech Stack:** Next.js App Router, React, TypeScript, Tailwind CSS v4 (custom tokens: `walnut` #86725a, `slate` #95978a, `linen` #edeae1, `stone` #d5d0cc, `latte` #c0af9b, `black` = standard)

**Spec:** `docs/superpowers/specs/2026-03-25-questionnaire-restyling-design.md`

---

## Files Modified

- `src/components/questionnaire/QuestionnaireWizard.tsx` — progress bar track, fill, and label
- `src/components/questionnaire/Step1Identity.tsx` — input borders, labels, errors, Next button
- `src/components/questionnaire/Step2Environment.tsx` — all walnut/stone/slate tokens (most changes)
- `src/components/questionnaire/Step3Style.tsx` — labels, textarea, badge, overlay, buttons
- `src/components/questionnaire/Step4Scope.tsx` — radio states, select, labels, errors, buttons
- `src/components/questionnaire/SuccessScreen.tsx` — decorative icon, message text

---

### Task 1: QuestionnaireWizard — progress bar and label

**Files:**
- Modify: `src/components/questionnaire/QuestionnaireWizard.tsx:76-79`

- [ ] **Step 1: Run existing tests to confirm baseline**

```bash
npm test -- --testPathPattern="QuestionnaireWizard" --watchAll=false
```

Expected: all tests pass.

- [ ] **Step 2: Apply color swaps**

In `src/components/questionnaire/QuestionnaireWizard.tsx`, replace lines 76–79:

```tsx
// BEFORE
<p className="font-display italic text-sm text-walnut mb-3">{progressLabel}</p>
<div className="relative h-px bg-stone">
  <motion.div
    className="absolute inset-y-0 left-0 bg-walnut origin-left"
```

```tsx
// AFTER
<p className="font-display italic text-sm text-black mb-3">{progressLabel}</p>
<div className="relative h-px bg-black/20">
  <motion.div
    className="absolute inset-y-0 left-0 bg-slate origin-left"
```

- [ ] **Step 3: Run tests again — confirm no regressions**

```bash
npm test -- --testPathPattern="QuestionnaireWizard" --watchAll=false
```

Expected: same results as Step 1.

- [ ] **Step 4: Commit**

```bash
git add src/components/questionnaire/QuestionnaireWizard.tsx
git commit -m "style: restyle questionnaire progress bar to slate/black tokens"
```

---

### Task 2: Step1Identity — inputs, labels, errors, button

**Files:**
- Modify: `src/components/questionnaire/Step1Identity.tsx:53,101,103,111`

- [ ] **Step 1: Run existing tests**

```bash
npm test -- --testPathPattern="Step1" --watchAll=false
```

Expected: all tests pass (or no test file — that's fine, proceed).

- [ ] **Step 2: Apply color swaps**

In `src/components/questionnaire/Step1Identity.tsx`:

**Line 53 — `inputClass`:**
```tsx
// BEFORE
const inputClass = 'w-full border border-stone bg-linen/60 px-4 py-3 font-body text-sm placeholder:text-slate/60 focus:outline-none focus:border-walnut transition-colors duration-200'

// AFTER
const inputClass = 'w-full border border-black/30 bg-linen/60 px-4 py-3 font-body text-sm placeholder:text-slate/60 focus:outline-none focus:border-black transition-colors duration-200'
```

**Line 101 — label:**
```tsx
// BEFORE
<label className="mb-1 block font-body text-xs uppercase tracking-[0.2em] text-slate">{field.label} *</label>

// AFTER
<label className="mb-1 block font-body text-xs uppercase tracking-[0.2em] text-black">{field.label} *</label>
```

**Line 103 — error message:**
```tsx
// BEFORE
{field.error && <p className="mt-1 font-body text-xs text-walnut/80">{field.error}</p>}

// AFTER
{field.error && <p className="mt-1 font-body text-xs text-black/70">{field.error}</p>}
```

**Line 111 — Next button:**
```tsx
// BEFORE
className="mt-2 bg-walnut text-linen px-10 py-4 font-display italic hover:bg-latte transition-colors duration-150"

// AFTER
className="mt-2 bg-slate text-linen px-10 py-4 font-display italic hover:bg-slate/80 transition-colors duration-150"
```

- [ ] **Step 3: Run tests again**

```bash
npm test -- --testPathPattern="Step1" --watchAll=false
```

Expected: same results as Step 1.

- [ ] **Step 4: Commit**

```bash
git add src/components/questionnaire/Step1Identity.tsx
git commit -m "style: restyle Step1Identity inputs and button to black/slate tokens"
```

---

### Task 3: Step2Environment — all token swaps

**Files:**
- Modify: `src/components/questionnaire/Step2Environment.tsx` (multiple locations)

This file has the most changes. Apply them in document order.

- [ ] **Step 1: Run existing tests**

```bash
npm test -- --testPathPattern="Step2Environment" --watchAll=false
```

Expected: all 13 tests pass.

- [ ] **Step 2: Apply color swaps**

**Line 205 — `inputClass`:**
```tsx
// BEFORE
const inputClass = 'w-full border border-stone bg-linen/60 px-4 py-3 font-body text-sm placeholder:text-slate/60 focus:outline-none focus:border-walnut transition-colors duration-200'

// AFTER
const inputClass = 'w-full border border-black/30 bg-linen/60 px-4 py-3 font-body text-sm placeholder:text-slate/60 focus:outline-none focus:border-black transition-colors duration-200'
```

**Line 211 — roomType label:**
```tsx
// BEFORE
<p className="mb-3 font-body text-xs uppercase tracking-[0.2em] text-slate">{messages.roomType} *</p>

// AFTER
<p className="mb-3 font-body text-xs uppercase tracking-[0.2em] text-black">{messages.roomType} *</p>
```

**Lines 221–223 — room chip selected/unselected states:**
```tsx
// BEFORE
selected
  ? 'border-walnut bg-walnut/8 text-walnut'
  : 'border-stone bg-transparent text-text-primary hover:border-latte'

// AFTER
selected
  ? 'border-black bg-black/8 text-black'
  : 'border-black/30 bg-transparent text-text-primary hover:border-latte'
```

**Line 231 — roomType error:**
```tsx
// BEFORE
{errors.roomType && <p className="mt-2 font-body text-xs text-walnut/80">{errors.roomType}</p>}

// AFTER
{errors.roomType && <p className="mt-2 font-body text-xs text-black/70">{errors.roomType}</p>}
```

**Line 236 — area label:**
```tsx
// BEFORE
<label className="mb-1 block font-body text-xs uppercase tracking-[0.2em] text-slate">{messages.area}</label>

// AFTER
<label className="mb-1 block font-body text-xs uppercase tracking-[0.2em] text-black">{messages.area}</label>
```

**Line 248 — floorPlan label:**
```tsx
// BEFORE
<p className="mb-3 font-body text-xs uppercase tracking-[0.2em] text-slate">{messages.floorPlan}</p>

// AFTER
<p className="mb-3 font-body text-xs uppercase tracking-[0.2em] text-black">{messages.floorPlan}</p>
```

**Lines 272–276 — floor plan drop zone idle/drag-over:**
```tsx
// BEFORE
className={`flex h-40 w-full cursor-pointer flex-col items-center justify-center gap-3 border-2 border-dashed transition-colors duration-150 ${
  isFloorPlanDragging
    ? 'border-walnut bg-walnut/5'
    : 'border-stone hover:border-latte'
}`}

// AFTER
className={`flex h-40 w-full cursor-pointer flex-col items-center justify-center gap-3 border-2 border-dashed transition-colors duration-150 ${
  isFloorPlanDragging
    ? 'border-black bg-black/5'
    : 'border-black/30 hover:border-latte'
}`}
```

**Lines 278–279 — floor plan zone icon and hint:**
```tsx
// BEFORE
<ArrowUp className="w-5 h-5 text-slate" strokeWidth={1.5} />
<span className="font-body text-xs text-slate/60">{messages.floorPlanHint}</span>

// AFTER
<ArrowUp className="w-5 h-5 text-black/70" strokeWidth={1.5} />
<span className="font-body text-xs text-black/50">{messages.floorPlanHint}</span>
```

**Line 282 — image preview selected border:**
```tsx
// BEFORE
<div className="group relative h-40 w-full overflow-hidden border border-walnut">

// AFTER
<div className="group relative h-40 w-full overflow-hidden border border-black">
```

**Lines 309–318 — PDF panel (border, bg, icon, filename, X button):**
```tsx
// BEFORE
<div className="flex h-40 w-full items-center gap-4 border border-walnut bg-walnut/5 px-4">
  <FileText className="w-5 h-5 shrink-0 text-walnut" strokeWidth={1.5} />
  <span className="font-body text-sm text-walnut truncate flex-1">{data.floorPlanFile.name}</span>
  <button
    type="button"
    onClick={removeFloorPlan}
    className="shrink-0 p-1 hover:bg-walnut/10 transition-colors"
  >
    <X className="w-4 h-4 text-walnut" strokeWidth={1.5} />
  </button>
</div>

// AFTER
<div className="flex h-40 w-full items-center gap-4 border border-black bg-black/5 px-4">
  <FileText className="w-5 h-5 shrink-0 text-black" strokeWidth={1.5} />
  <span className="font-body text-sm text-black truncate flex-1">{data.floorPlanFile.name}</span>
  <button
    type="button"
    onClick={removeFloorPlan}
    className="shrink-0 p-1 hover:bg-black/10 transition-colors"
  >
    <X className="w-4 h-4 text-black" strokeWidth={1.5} />
  </button>
</div>
```

**Line 322 — floorPlan error:**
```tsx
// BEFORE
{errors.floorPlan && <p className="mt-1 font-body text-xs text-walnut/80">{errors.floorPlan}</p>}

// AFTER
{errors.floorPlan && <p className="mt-1 font-body text-xs text-black/70">{errors.floorPlan}</p>}
```

**Line 327 — photos label:**
```tsx
// BEFORE
<p className="mb-3 font-body text-xs uppercase tracking-[0.2em] text-slate">{messages.photos}</p>

// AFTER
<p className="mb-3 font-body text-xs uppercase tracking-[0.2em] text-black">{messages.photos}</p>
```

**Lines 363–370 — photos drop zone idle/drag-over + icon + hint:**
```tsx
// BEFORE
className={`flex h-40 w-full cursor-pointer flex-col items-center justify-center gap-3 border-2 border-dashed transition-colors duration-150 ${
  isPhotosDragging
    ? 'border-walnut bg-walnut/5'
    : 'border-stone hover:border-latte'
}`}
>
<ImagePlus className="w-5 h-5 text-slate" strokeWidth={1.5} />
<span className="font-body text-xs text-slate/60">{messages.photosHint}</span>

// AFTER
className={`flex h-40 w-full cursor-pointer flex-col items-center justify-center gap-3 border-2 border-dashed transition-colors duration-150 ${
  isPhotosDragging
    ? 'border-black bg-black/5'
    : 'border-black/30 hover:border-latte'
}`}
>
<ImagePlus className="w-5 h-5 text-black/70" strokeWidth={1.5} />
<span className="font-body text-xs text-black/50">{messages.photosHint}</span>
```

**Lines 384–386 — video thumbnail background, icon, filename:**
```tsx
// BEFORE
<div className="flex h-full w-full flex-col items-center justify-center gap-1 bg-stone/30">
  <Film className="w-5 h-5 text-slate" strokeWidth={1.5} />
  <span className="w-full truncate px-1 text-center font-body text-[10px] text-slate">{file.name}</span>
</div>

// AFTER
<div className="flex h-full w-full flex-col items-center justify-center gap-1 bg-black/10">
  <Film className="w-5 h-5 text-black/70" strokeWidth={1.5} />
  <span className="w-full truncate px-1 text-center font-body text-[10px] text-black/70">{file.name}</span>
</div>
```

**Line 404 — "Adicionar mais" link:**
```tsx
// BEFORE
className="mt-3 font-body text-xs text-slate/70 underline underline-offset-2 hover:text-walnut transition-colors"

// AFTER
className="mt-3 font-body text-xs text-black/50 underline underline-offset-2 hover:text-black transition-colors"
```

**Line 411 — photos error:**
```tsx
// BEFORE
{errors.photos && <p className="mt-1 font-body text-xs text-walnut/80">{errors.photos}</p>}

// AFTER
{errors.photos && <p className="mt-1 font-body text-xs text-black/70">{errors.photos}</p>}
```

**Lines 419 and 426 — Back link and Next button:**
```tsx
// BEFORE (Back link)
className="font-body text-sm text-slate hover:text-walnut transition-colors"

// AFTER (Back link)
className="font-body text-sm text-black hover:text-black/60 transition-colors"

// BEFORE (Next button)
className="bg-walnut text-linen px-10 py-4 font-display italic hover:bg-latte transition-colors duration-150"

// AFTER (Next button)
className="bg-slate text-linen px-10 py-4 font-display italic hover:bg-slate/80 transition-colors duration-150"
```

- [ ] **Step 3: Run tests again — confirm all 13 pass**

```bash
npm test -- --testPathPattern="Step2Environment" --watchAll=false
```

Expected: 13/13 tests pass.

- [ ] **Step 4: Commit**

```bash
git add src/components/questionnaire/Step2Environment.tsx
git commit -m "style: restyle Step2Environment upload zones and inputs to black/slate tokens"
```

---

### Task 4: Step3Style — labels, textarea, badge, overlay, buttons

**Files:**
- Modify: `src/components/questionnaire/Step3Style.tsx:42,66,77,89,95,97,105,112`

- [ ] **Step 1: Run existing tests**

```bash
npm test -- --testPathPattern="Step3" --watchAll=false
```

Expected: all tests pass (or no test file — proceed).

- [ ] **Step 2: Apply color swaps**

**Line 42 — styles label:**
```tsx
// BEFORE
<p className="mb-3 font-body text-xs uppercase tracking-[0.2em] text-slate">{messages.styles}</p>

// AFTER
<p className="mb-3 font-body text-xs uppercase tracking-[0.2em] text-black">{messages.styles}</p>
```

**Line 66 — selected style overlay (inline style):**
```tsx
// BEFORE
style={{ background: 'rgba(139,111,94,0.50)' }}

// AFTER
style={{ background: 'rgba(0,0,0,0.50)' }}
```

**Line 77 — style selection badge:**
```tsx
// BEFORE
<span className="absolute top-3 right-3 flex h-7 w-7 items-center justify-center rounded-full bg-walnut text-linen text-sm font-bold">

// AFTER
<span className="absolute top-3 right-3 flex h-7 w-7 items-center justify-center rounded-full bg-black text-white text-sm font-bold">
```

**Line 89 — mustHave label:**
```tsx
// BEFORE
<label className="mb-1 block font-body text-xs uppercase tracking-[0.2em] text-slate">{messages.mustHave}</label>

// AFTER
<label className="mb-1 block font-body text-xs uppercase tracking-[0.2em] text-black">{messages.mustHave}</label>
```

**Line 95 — textarea border and focus:**
```tsx
// BEFORE
className="w-full border border-stone bg-linen/60 px-4 py-3 font-body text-sm placeholder:text-slate/60 focus:outline-none focus:border-walnut transition-colors duration-200 resize-none"

// AFTER
className="w-full border border-black/30 bg-linen/60 px-4 py-3 font-body text-sm placeholder:text-slate/60 focus:outline-none focus:border-black transition-colors duration-200 resize-none"
```

**Line 97 — char counter hint:**
```tsx
// BEFORE
<p className="mt-1 font-body text-xs text-slate">{data.mustHave.length}/500 — {messages.mustHaveHint}</p>

// AFTER
<p className="mt-1 font-body text-xs text-black/70">{data.mustHave.length}/500 — {messages.mustHaveHint}</p>
```

**Line 105 — Back link:**
```tsx
// BEFORE
className="font-body text-sm text-slate hover:text-walnut transition-colors"

// AFTER
className="font-body text-sm text-black hover:text-black/60 transition-colors"
```

**Line 112 — Next button:**
```tsx
// BEFORE
className="bg-walnut text-linen px-10 py-4 font-display italic hover:bg-latte transition-colors duration-150"

// AFTER
className="bg-slate text-linen px-10 py-4 font-display italic hover:bg-slate/80 transition-colors duration-150"
```

- [ ] **Step 3: Run tests again**

```bash
npm test -- --testPathPattern="Step3" --watchAll=false
```

Expected: same results as Step 1.

- [ ] **Step 4: Commit**

```bash
git add src/components/questionnaire/Step3Style.tsx
git commit -m "style: restyle Step3Style labels, badge, and buttons to black/slate tokens"
```

---

### Task 5: Step4Scope — radio states, select, labels, errors, buttons

**Files:**
- Modify: `src/components/questionnaire/Step4Scope.tsx:44-47,54,59,64,69,74,83,87,97,106,114`

- [ ] **Step 1: Run existing tests**

```bash
npm test -- --testPathPattern="Step4" --watchAll=false
```

Expected: all tests pass (or no test file — proceed).

- [ ] **Step 2: Apply color swaps**

**Lines 44–47 — `radioClass` helper:**
```tsx
// BEFORE
const radioClass = (selected: boolean) =>
  `flex cursor-pointer items-center gap-3 border px-4 py-3 font-body text-sm transition-colors duration-150 ${
    selected
      ? 'border-walnut bg-walnut/8 text-walnut'
      : 'border-stone bg-transparent text-text-primary hover:border-latte'
  }`

// AFTER
const radioClass = (selected: boolean) =>
  `flex cursor-pointer items-center gap-3 border px-4 py-3 font-body text-sm transition-colors duration-150 ${
    selected
      ? 'border-black bg-black/8 text-black'
      : 'border-black/30 bg-transparent text-text-primary hover:border-latte'
  }`
```

**Line 54 — scopeType label:**
```tsx
// BEFORE
<p className="mb-3 font-body text-xs uppercase tracking-[0.2em] text-slate">{messages.scopeType} *</p>

// AFTER
<p className="mb-3 font-body text-xs uppercase tracking-[0.2em] text-black">{messages.scopeType} *</p>
```

**Line 59 — selected radio dot (scopeType):**
```tsx
// BEFORE
<span className={`text-xs ${data.scopeType === key ? 'text-walnut' : 'text-transparent'}`}>●</span>

// AFTER
<span className={`text-xs ${data.scopeType === key ? 'text-black' : 'text-transparent'}`}>●</span>
```

**Line 64 — scopeType error:**
```tsx
// BEFORE
{scopeError && <p className="mt-1 font-body text-xs text-walnut/80">{scopeError}</p>}

// AFTER
{scopeError && <p className="mt-1 font-body text-xs text-black/70">{scopeError}</p>}
```

**Line 69 — urgency label:**
```tsx
// BEFORE
<p className="mb-3 font-body text-xs uppercase tracking-[0.2em] text-slate">{messages.urgency}</p>

// AFTER
<p className="mb-3 font-body text-xs uppercase tracking-[0.2em] text-black">{messages.urgency}</p>
```

**Line 74 — selected radio dot (urgency):**
```tsx
// BEFORE
<span className={`text-xs ${data.urgency === key ? 'text-walnut' : 'text-transparent'}`}>●</span>

// AFTER
<span className={`text-xs ${data.urgency === key ? 'text-black' : 'text-transparent'}`}>●</span>
```

**Line 83 — budget label:**
```tsx
// BEFORE
<label className="mb-1 block font-body text-xs uppercase tracking-[0.2em] text-slate">{messages.budget}</label>

// AFTER
<label className="mb-1 block font-body text-xs uppercase tracking-[0.2em] text-black">{messages.budget}</label>
```

**Line 87 — budget select border and focus:**
```tsx
// BEFORE
className="w-full border border-stone bg-linen/60 px-4 py-3 font-body text-sm focus:outline-none focus:border-walnut transition-colors duration-200"

// AFTER
className="w-full border border-black/30 bg-linen/60 px-4 py-3 font-body text-sm focus:outline-none focus:border-black transition-colors duration-200"
```

**Line 97 — generic submit error:**
```tsx
// BEFORE
<p className="font-body text-sm text-walnut/80">{messages.errorGeneric}</p>

// AFTER
<p className="font-body text-sm text-black/70">{messages.errorGeneric}</p>
```

**Line 106 — Back link:**
```tsx
// BEFORE
className="font-body text-sm text-slate hover:text-walnut transition-colors disabled:opacity-50"

// AFTER
className="font-body text-sm text-black hover:text-black/60 transition-colors disabled:opacity-50"
```

**Line 114 — Submit button:**
```tsx
// BEFORE
className="bg-walnut text-linen px-10 py-4 font-display italic hover:bg-latte transition-colors duration-150 disabled:opacity-50"

// AFTER
className="bg-slate text-linen px-10 py-4 font-display italic hover:bg-slate/80 transition-colors duration-150 disabled:opacity-50"
```

- [ ] **Step 3: Run tests again**

```bash
npm test -- --testPathPattern="Step4" --watchAll=false
```

Expected: same results as Step 1.

- [ ] **Step 4: Commit**

```bash
git add src/components/questionnaire/Step4Scope.tsx
git commit -m "style: restyle Step4Scope radio states and buttons to black/slate tokens"
```

---

### Task 6: SuccessScreen — icon and message text

**Files:**
- Modify: `src/components/questionnaire/SuccessScreen.tsx:19,35`

- [ ] **Step 1: Run existing tests**

```bash
npm test -- --testPathPattern="SuccessScreen" --watchAll=false
```

Expected: all tests pass (or no test file — proceed).

- [ ] **Step 2: Apply color swaps**

**Line 19 — decorative ✦ icon:**
```tsx
// BEFORE
className="text-4xl text-walnut"

// AFTER
className="text-4xl text-black"
```

**Line 35 — message paragraph:**
```tsx
// BEFORE
className="font-body text-sm text-slate"

// AFTER
className="font-body text-sm text-black/70"
```

- [ ] **Step 3: Run tests again**

```bash
npm test -- --testPathPattern="SuccessScreen" --watchAll=false
```

Expected: same results as Step 1.

- [ ] **Step 4: Commit**

```bash
git add src/components/questionnaire/SuccessScreen.tsx
git commit -m "style: restyle SuccessScreen icon and message to black tokens"
```

---

### Task 7: Final regression check

- [ ] **Step 1: Run the full test suite**

```bash
npm test -- --watchAll=false
```

Expected: 81/82 tests pass (1 pre-existing failure in VideoSection is unrelated to this work — it was present before these changes).

- [ ] **Step 2: TypeScript check**

```bash
npx tsc --noEmit
```

Expected: 0 errors.
