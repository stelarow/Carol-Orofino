# Questionnaire Visual Refactor — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace text-only style chips with a 10-card visual image grid and replace the numeric area input with a free-text textarea.

**Architecture:** All changes are isolated to 3 component files, 1 page file, and 3 i18n JSON files. No new files needed. No server action changes needed — `area` is already spread into the submit payload and the server action accepts it as-is.

**Tech Stack:** Next.js App Router, TypeScript, Tailwind CSS v4, Framer Motion, next-intl

---

## File Map

| File | Change |
|------|--------|
| `src/messages/pt.json` | Add 5 style keys; add `areaPlaceholder`; soften `area` label |
| `src/messages/en.json` | Same |
| `src/messages/es.json` | Same |
| `src/app/[locale]/questionario/page.tsx` | Add 5 style entries; add `areaPlaceholder` to step2 block |
| `src/components/questionnaire/QuestionnaireWizard.tsx` | Change `area: null as number \| null` → `area: '' as string` |
| `src/components/questionnaire/Step2Environment.tsx` | Change `area` type to `string`; add `areaPlaceholder` to Props; replace `<input>` with `<textarea>` |
| `src/components/questionnaire/Step3Style.tsx` | Replace chip buttons with image card grid; add `STYLE_PHOTOS` constant |

---

### Task 1: Update i18n — 5 new styles + area placeholder + softer area label

**Files:**
- Modify: `src/messages/pt.json`
- Modify: `src/messages/en.json`
- Modify: `src/messages/es.json`

- [ ] **Step 1: Update `pt.json`**

In `src/messages/pt.json`:

1. Change `"area": "Medidas aproximadas"` → `"area": "Medidas (se souber)"` in step2.

2. Add `"areaPlaceholder"` after `"area"` in step2:
```json
"areaPlaceholder": "Ex: sala 4x5m, quarto 3x3m, ou só 'apartamento de 60m²'",
```

3. Replace `step3.styleOptions` with:
```json
"styleOptions": {
  "minimalista": "Minimalista",
  "industrial": "Industrial",
  "escandinavo": "Escandinavo",
  "classico": "Clássico",
  "moderno": "Moderno",
  "boho": "Boho",
  "japandi": "Japandi",
  "rustico": "Rústico",
  "contemporaneo": "Contemporâneo",
  "provencal": "Provençal"
},
```

- [ ] **Step 2: Update `en.json`**

In `src/messages/en.json`:

1. Change `"area": "Approximate measurements"` → `"area": "Measurements (if you know them)"`

2. Add after `"area"`:
```json
"areaPlaceholder": "E.g.: living room 4x5m, bedroom 3x3m, or just 'a 60m² apartment'",
```

3. Replace `step3.styleOptions` with:
```json
"styleOptions": {
  "minimalista": "Minimalist",
  "industrial": "Industrial",
  "escandinavo": "Scandinavian",
  "classico": "Classic",
  "moderno": "Modern",
  "boho": "Boho",
  "japandi": "Japandi",
  "rustico": "Rustic",
  "contemporaneo": "Contemporary",
  "provencal": "Provençal"
},
```

- [ ] **Step 3: Update `es.json`**

In `src/messages/es.json`:

1. Change `"area": "Medidas aproximadas"` → `"area": "Medidas (si las tienes)"`

2. Add after `"area"`:
```json
"areaPlaceholder": "Ej: sala 4x5m, dormitorio 3x3m, o simplemente 'apartamento de 60m²'",
```

3. Replace `step3.styleOptions` with:
```json
"styleOptions": {
  "minimalista": "Minimalista",
  "industrial": "Industrial",
  "escandinavo": "Escandinavo",
  "classico": "Clásico",
  "moderno": "Moderno",
  "boho": "Boho",
  "japandi": "Japandi",
  "rustico": "Rústico",
  "contemporaneo": "Contemporáneo",
  "provencal": "Provençal"
},
```

- [ ] **Step 4: Verify JSON validity**

```bash
node -e "require('./src/messages/pt.json'); require('./src/messages/en.json'); require('./src/messages/es.json'); console.log('OK')"
```
Expected: `OK`

- [ ] **Step 5: Commit**

```bash
git add src/messages/pt.json src/messages/en.json src/messages/es.json
git commit -m "feat(i18n): add 5 new style options, area placeholder, and softer area label"
```

---

### Task 2: Update page.tsx — wire new keys

**Files:**
- Modify: `src/app/[locale]/questionario/page.tsx`

- [ ] **Step 1: Add `areaPlaceholder` to step2 block**

In `src/app/[locale]/questionario/page.tsx`, find the step2 block (around line 65):

```ts
      area: t('step2.area'),
      floorPlan: t('step2.floorPlan'),
```

Change to:
```ts
      area: t('step2.area'),
      areaPlaceholder: t('step2.areaPlaceholder'),
      floorPlan: t('step2.floorPlan'),
```

- [ ] **Step 2: Add 5 new style keys to step3 block**

Find the `styleOptions` block (around line 76-82):

```ts
      styleOptions: {
        minimalista: t('step3.styleOptions.minimalista'),
        industrial: t('step3.styleOptions.industrial'),
        escandinavo: t('step3.styleOptions.escandinavo'),
        classico: t('step3.styleOptions.classico'),
        moderno: t('step3.styleOptions.moderno'),
      },
```

Replace with:
```ts
      styleOptions: {
        minimalista: t('step3.styleOptions.minimalista'),
        industrial: t('step3.styleOptions.industrial'),
        escandinavo: t('step3.styleOptions.escandinavo'),
        classico: t('step3.styleOptions.classico'),
        moderno: t('step3.styleOptions.moderno'),
        boho: t('step3.styleOptions.boho'),
        japandi: t('step3.styleOptions.japandi'),
        rustico: t('step3.styleOptions.rustico'),
        contemporaneo: t('step3.styleOptions.contemporaneo'),
        provencal: t('step3.styleOptions.provencal'),
      },
```

- [ ] **Step 3: Commit**

```bash
git add src/app/[locale]/questionario/page.tsx
git commit -m "feat(page): wire areaPlaceholder and 5 new style keys to questionnaire wizard"
```

---

### Task 3: Update QuestionnaireWizard — area type string

**Files:**
- Modify: `src/components/questionnaire/QuestionnaireWizard.tsx` (line 40)

- [ ] **Step 1: Change initial state**

Find line 40:
```ts
const [step2, setStep2] = useState({ roomType: [] as string[], area: null as number | null, floorPlanFile: null as File | null, photoFiles: [] as File[] })
```

Replace with:
```ts
const [step2, setStep2] = useState({ roomType: [] as string[], area: '' as string, floorPlanFile: null as File | null, photoFiles: [] as File[] })
```

- [ ] **Step 2: Commit (batch with Task 4)**

Hold this commit — commit together with Step2Environment changes in Task 4.

---

### Task 4: Update Step2Environment — textarea + string type

**Files:**
- Modify: `src/components/questionnaire/Step2Environment.tsx`

- [ ] **Step 1: Update `Step2Data` type**

Find (line 19-24):
```ts
type Step2Data = {
  roomType: string[]
  area: number | null
  floorPlanFile: File | null
  photoFiles: File[]
}
```

Change `area: number | null` → `area: string`:
```ts
type Step2Data = {
  roomType: string[]
  area: string
  floorPlanFile: File | null
  photoFiles: File[]
}
```

- [ ] **Step 2: Add `areaPlaceholder` to Props messages type**

Find (around line 32-37):
```ts
    area: string; floorPlan: string; floorPlanHint: string
```

Replace with:
```ts
    area: string; areaPlaceholder: string; floorPlan: string; floorPlanHint: string
```

- [ ] **Step 3: Replace the `<input type="number">` with `<textarea>`**

Find (lines 121-132):
```tsx
      {/* Area */}
      <motion.div custom={1} variants={fieldVariants} initial="hidden" animate="visible">
        <label className="mb-1 block font-body text-xs uppercase tracking-[0.2em] text-slate">{messages.area}</label>
        <input
          type="number"
          min={1}
          max={10000}
          step={1}
          value={data.area ?? ''}
          onChange={e => onChange({ ...data, area: e.target.value ? parseInt(e.target.value) : null })}
          className={inputClass}
        />
      </motion.div>
```

Replace with:
```tsx
      {/* Area */}
      <motion.div custom={1} variants={fieldVariants} initial="hidden" animate="visible">
        <label className="mb-1 block font-body text-xs uppercase tracking-[0.2em] text-slate">{messages.area}</label>
        <textarea
          value={data.area}
          onChange={e => onChange({ ...data, area: e.target.value })}
          placeholder={messages.areaPlaceholder}
          rows={2}
          className={`${inputClass} resize-none`}
        />
      </motion.div>
```

- [ ] **Step 4: Build check**

```bash
npm run build 2>&1 | head -50
```
Expected: clean build, no type errors

- [ ] **Step 5: Commit**

```bash
git add src/components/questionnaire/Step2Environment.tsx src/components/questionnaire/QuestionnaireWizard.tsx
git commit -m "feat(step2): replace area number input with free-text textarea"
```

---

### Task 5: Update Step3Style — image card grid

**Files:**
- Modify: `src/components/questionnaire/Step3Style.tsx`

- [ ] **Step 1: Add `STYLE_PHOTOS` constant after the imports**

After the `fieldVariants` block (line 11), add:

```ts
const STYLE_PHOTOS: Record<string, string> = {
  minimalista:    'photo-1741394546743-2d64519ba0d3',
  industrial:     'photo-1759264244827-1dde5bee00a5',
  escandinavo:    'photo-1631679706909-1844bbd07221',
  classico:       'photo-1638284457192-27d3d0ec51aa',
  moderno:        'photo-1704040686428-7534b262d0d8',
  boho:           'photo-1633505899118-4ca6bd143043',
  japandi:        'photo-1604578762246-41134e37f9cc',
  rustico:        'photo-1726090401458-7abb00f7450c',
  contemporaneo:  'photo-1594873604892-b599f847e859',
  provencal:      'photo-1756358789192-c55b1ca45bb9',
}

function stylePhotoUrl(key: string): string | undefined {
  const id = STYLE_PHOTOS[key]
  return id ? `https://images.unsplash.com/${id}?w=400&h=400&fit=contain&q=80` : undefined
}
```

- [ ] **Step 2: Replace the chip buttons with the image card grid**

Find the style chips section (lines 40-61):
```tsx
      {/* Style chips */}
      <motion.div custom={0} variants={fieldVariants} initial="hidden" animate="visible">
        <p className="mb-3 font-body text-xs uppercase tracking-[0.2em] text-slate">{messages.styles}</p>
        <div className="flex flex-wrap gap-3">
          {Object.entries(messages.styleOptions).map(([key, label]) => {
            const selected = data.styles.includes(key)
            return (
              <button
                key={key}
                type="button"
                onClick={() => toggleStyle(key)}
                className={`border px-6 py-3 font-body text-sm uppercase tracking-widest transition-colors duration-150 ${
                  selected
                    ? 'border-walnut bg-walnut/8 text-walnut'
                    : 'border-stone bg-transparent text-text-primary hover:border-latte'
                }`}
              >
                {label}
              </button>
            )
          })}
        </div>
      </motion.div>
```

Replace with:
```tsx
      {/* Style image cards */}
      <motion.div custom={0} variants={fieldVariants} initial="hidden" animate="visible">
        <p className="mb-3 font-body text-xs uppercase tracking-[0.2em] text-slate">{messages.styles}</p>
        <div className="grid grid-cols-3 gap-3">
          {Object.entries(messages.styleOptions).map(([key, label]) => {
            const selected = data.styles.includes(key)
            const photoUrl = stylePhotoUrl(key)
            return (
              <button
                key={key}
                type="button"
                onClick={() => toggleStyle(key)}
                className={`relative aspect-square overflow-hidden border-2 transition-all duration-150 ${
                  selected ? 'border-walnut' : 'border-transparent hover:border-latte'
                }`}
                style={{
                  background: '#e8e0d6',
                  boxShadow: selected ? '0 0 0 1px var(--color-walnut)' : undefined,
                }}
              >
                {photoUrl && (
                  <img
                    src={photoUrl}
                    alt={label}
                    className="w-full h-full object-contain"
                    loading="lazy"
                  />
                )}
                <span
                  className="absolute bottom-2 left-1/2 -translate-x-1/2 whitespace-nowrap px-2 py-1 font-body text-[0.6rem] uppercase tracking-[0.12em] font-bold text-white"
                  style={{ background: selected ? 'rgba(139,111,94,0.85)' : 'rgba(0,0,0,0.50)' }}
                >
                  {label}
                </span>
                {selected && (
                  <span className="absolute top-1.5 right-1.5 flex h-5 w-5 items-center justify-center rounded-full bg-walnut text-linen text-[0.6rem] font-bold">
                    ✓
                  </span>
                )}
              </button>
            )
          })}
        </div>
      </motion.div>
```

Note: `boxShadow` and label background use inline `style` props with CSS custom properties (`var(--color-walnut)`) because Tailwind v4 does not support `theme()` inside arbitrary values.

- [ ] **Step 3: Build check**

```bash
npm run build 2>&1 | head -50
```
Expected: clean build

- [ ] **Step 4: Start dev server and visually verify**

```bash
npm run dev
```

Open `http://localhost:3000/pt/questionario` and navigate to Step 3. Verify:
- 10 cards in a 3-column grid
- Each card is square, shows the full photo without cropping; neutral warm background fills any letterbox areas
- Style name appears as white text with dark semi-transparent pill at the bottom
- Clicking a card: walnut border + shadow ring + ✓ badge + walnut-tinted label
- Clicking again deselects
- Multiple cards can be selected

Navigate to Step 2 and verify:
- Area field is a 2-row textarea
- Placeholder shows example text
- Accepts free text

Check en and es locales:
- `http://localhost:3000/en/questionario` — 10 cards with English labels, translated placeholder
- `http://localhost:3000/es/questionario` — 10 cards with Spanish labels, translated placeholder

- [ ] **Step 5: Commit**

```bash
git add src/components/questionnaire/Step3Style.tsx
git commit -m "feat(step3): replace style chips with visual image card grid (10 styles)"
```

---

### Task 6: Final verification

- [ ] **Step 1: Lint**

```bash
npm run lint
```
Expected: no errors

- [ ] **Step 2: Tests**

```bash
npm run test
```
Expected: all passing (no component tests exist for these files — OK)

- [ ] **Step 3: Production build**

```bash
npm run build
```
Expected: clean build, no type errors

- [ ] **Done** — all changes shipped.
