# Client Confirmation Email Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Send a confirmation e-mail to the client after questionnaire submission, in their locale (pt/en/es), with a brief summary of what they filled in.

**Architecture:** Add `buildClientEmailHtml` to `questionnaireUtils.ts`, extend `submitQuestionnaire` with a `locale` param that fires a second silent Resend call, thread `locale` from the page down through the wizard.

**Tech Stack:** Next.js App Router, Resend SDK (`resend`), TypeScript, Jest + Testing Library

---

## File Map

| File | Change |
|---|---|
| `src/actions/questionnaireUtils.ts` | Add `CLIENT_EMAIL_STRINGS` constant + `buildClientEmailHtml` function |
| `src/actions/submitQuestionnaire.ts` | Add `locale: string` param, send second Resend email to client |
| `src/components/questionnaire/QuestionnaireWizard.tsx` | Add `locale: string` prop, forward to `submitQuestionnaire` |
| `src/app/[locale]/questionario/page.tsx` | Pass `locale` prop to `<QuestionnaireWizard>` |
| `src/components/__tests__/QuestionnaireWizard.test.tsx` | Add `locale="pt"` to all renders (TypeScript will fail without it) |

No new files needed.

---

### Task 1: Add `buildClientEmailHtml` to `questionnaireUtils.ts`

**Files:**
- Modify: `src/actions/questionnaireUtils.ts`

- [ ] **Step 1: Write the failing test**

Add a new test file at `src/actions/__tests__/questionnaireUtils.test.ts`:

```ts
import { buildClientEmailHtml } from '../questionnaireUtils'

describe('buildClientEmailHtml', () => {
  it('returns correct Portuguese subject', () => {
    const { subject } = buildClientEmailHtml({ name: 'Ana', roomType: ['sala'], styles: [] }, 'pt')
    expect(subject).toBe('Recebemos seu questionário — Carol Orofino')
  })

  it('returns correct English subject', () => {
    const { subject } = buildClientEmailHtml({ name: 'Ana', roomType: ['sala'], styles: [] }, 'en')
    expect(subject).toBe('We received your questionnaire — Carol Orofino')
  })

  it('returns correct Spanish subject', () => {
    const { subject } = buildClientEmailHtml({ name: 'Ana', roomType: ['sala'], styles: [] }, 'es')
    expect(subject).toBe('Recibimos tu cuestionario — Carol Orofino')
  })

  it('falls back to pt for unknown locale', () => {
    const { subject } = buildClientEmailHtml({ name: 'Ana', roomType: ['sala'], styles: [] }, 'fr')
    expect(subject).toBe('Recebemos seu questionário — Carol Orofino')
  })

  it('includes the client name in html', () => {
    const { html } = buildClientEmailHtml({ name: 'Maria', roomType: ['quarto'], styles: ['moderno'] }, 'pt')
    expect(html).toContain('Maria')
  })

  it('includes room types in html', () => {
    const { html } = buildClientEmailHtml({ name: 'Ana', roomType: ['sala', 'cozinha'], styles: [] }, 'pt')
    expect(html).toContain('sala, cozinha')
  })

  it('shows em dash when no styles selected', () => {
    const { html } = buildClientEmailHtml({ name: 'Ana', roomType: ['sala'], styles: [] }, 'pt')
    expect(html).toContain('—')
  })
})
```

- [ ] **Step 2: Run test to verify it fails**

```bash
cd "/c/Site carol/carol-orofino" && npx jest src/actions/__tests__/questionnaireUtils.test.ts --no-coverage
```

Expected: FAIL — `buildClientEmailHtml is not a function`

- [ ] **Step 3: Implement `buildClientEmailHtml` in `questionnaireUtils.ts`**

Append to `src/actions/questionnaireUtils.ts`:

```ts
const CLIENT_EMAIL_STRINGS: Record<string, {
  subject: string
  greeting: (name: string) => string
  confirmation: string
  summaryTitle: string
  roomLabel: string
  stylesLabel: string
  nextSteps: string
}> = {
  pt: {
    subject: 'Recebemos seu questionário — Carol Orofino',
    greeting: (name) => `Olá, ${name}!`,
    confirmation: 'Recebemos seu questionário e entraremos em contato em breve.',
    summaryTitle: 'Resumo do seu envio',
    roomLabel: 'Ambiente(s)',
    stylesLabel: 'Estilo(s)',
    nextSteps: 'Carol Orofino analisará suas respostas e entrará em contato pelo WhatsApp ou e-mail.',
  },
  en: {
    subject: 'We received your questionnaire — Carol Orofino',
    greeting: (name) => `Hello, ${name}!`,
    confirmation: 'We received your questionnaire and will be in touch shortly.',
    summaryTitle: 'Your submission summary',
    roomLabel: 'Room(s)',
    stylesLabel: 'Style(s)',
    nextSteps: 'Carol Orofino will review your answers and reach out via WhatsApp or email.',
  },
  es: {
    subject: 'Recibimos tu cuestionario — Carol Orofino',
    greeting: (name) => `¡Hola, ${name}!`,
    confirmation: 'Recibimos tu cuestionario y nos pondremos en contacto contigo pronto.',
    summaryTitle: 'Resumen de tu envío',
    roomLabel: 'Ambiente(s)',
    stylesLabel: 'Estilo(s)',
    nextSteps: 'Carol Orofino revisará tus respuestas y se pondrá en contacto por WhatsApp o correo electrónico.',
  },
}

type ClientEmailInput = {
  name: string
  roomType: string[]
  styles: string[]
}

export function buildClientEmailHtml(
  data: ClientEmailInput,
  locale: string
): { subject: string; html: string } {
  const s = CLIENT_EMAIL_STRINGS[locale] ?? CLIENT_EMAIL_STRINGS['pt']
  const stylesText = data.styles.length > 0 ? data.styles.join(', ') : '—'

  const html = `
    <div style="font-family:sans-serif;max-width:600px;margin:0 auto">
      <h2 style="color:#333">${s.greeting(data.name)}</h2>
      <p>${s.confirmation}</p>
      <hr/>
      <h3>${s.summaryTitle}</h3>
      <p>
        <strong>${s.roomLabel}:</strong> ${data.roomType.join(', ')}<br/>
        <strong>${s.stylesLabel}:</strong> ${stylesText}
      </p>
      <hr/>
      <p style="color:#555">${s.nextSteps}</p>
      <p style="margin-top:24px;color:#888;font-size:12px">Carol Orofino — carolorofino.com.br</p>
    </div>
  `

  return { subject: s.subject, html }
}
```

- [ ] **Step 4: Run test to verify it passes**

```bash
cd "/c/Site carol/carol-orofino" && npx jest src/actions/__tests__/questionnaireUtils.test.ts --no-coverage
```

Expected: 7 tests PASS

- [ ] **Step 5: Commit**

```bash
cd "/c/Site carol/carol-orofino" && git add src/actions/questionnaireUtils.ts src/actions/__tests__/questionnaireUtils.test.ts && git commit -m "feat: add buildClientEmailHtml with pt/en/es strings"
```

---

### Task 2: Extend `submitQuestionnaire` with client confirmation email

**Files:**
- Modify: `src/actions/submitQuestionnaire.ts`

- [ ] **Step 1: Add `locale` param and second Resend call**

In `src/actions/submitQuestionnaire.ts`, make these changes:

1. Add the import at the top (it's already imported — `buildEmailHtml` comes from `questionnaireUtils`). Update the import line:

```ts
import { normalizeWhatsApp, buildEmailHtml, buildClientEmailHtml } from './questionnaireUtils'
```

2. Change the function signature:

```ts
export async function submitQuestionnaire(data: QuestionnaireData, locale: string): Promise<ActionResult> {
```

3. After the existing `await resend.emails.send(...)` call (the Carol notification), add:

```ts
    try {
      const { subject, html: clientHtml } = buildClientEmailHtml(
        { name: data.name, roomType: data.roomType, styles: data.styles },
        locale
      )
      await resend.emails.send({
        from: 'questionario@carolorofino.com.br',
        to: data.email,
        replyTo: 'carolorofinoo@gmail.com',
        subject,
        html: clientHtml,
      })
    } catch {
      // silent — client confirmation failure does not affect success result
    }
```

The full updated function body after changes:

```ts
export async function submitQuestionnaire(data: QuestionnaireData, locale: string): Promise<ActionResult> {
  try {
    const resend = new Resend(process.env.RESEND_API_KEY)
    const normalizedWa = normalizeWhatsApp(data.whatsapp)

    // Upload floor plan
    let floorPlanUrl: string | null = null
    if (data.floorPlanFile) {
      const timestamp = Date.now()
      const safeName = data.floorPlanFile.name.replace(/[^a-zA-Z0-9._-]/g, '_')
      const blob = await put(`questionnaire/${timestamp}-${safeName}`, data.floorPlanFile, {
        access: 'public',
      })
      floorPlanUrl = blob.url
    }

    // Upload photos/videos
    const photoUrls: string[] = []
    for (const file of data.photoFiles) {
      const timestamp = Date.now()
      const safeName = file.name.replace(/[^a-zA-Z0-9._-]/g, '_')
      const blob = await put(`questionnaire/${timestamp}-${safeName}`, file, {
        access: 'public',
      })
      photoUrls.push(blob.url)
    }

    const html = buildEmailHtml({
      name: data.name,
      whatsapp: normalizedWa,
      email: data.email,
      roomType: data.roomType,
      area: data.area,
      floorPlanUrl,
      photoUrls,
      styles: data.styles,
      mustHave: data.mustHave,
      scopeType: data.scopeType,
      urgency: data.urgency,
      budget: data.budget,
    })

    await resend.emails.send({
      from: 'questionario@carolorofino.com.br',
      to: 'carolorofinoo@gmail.com',
      subject: `Novo questionário — ${data.name}`,
      html,
    })

    try {
      const { subject, html: clientHtml } = buildClientEmailHtml(
        { name: data.name, roomType: data.roomType, styles: data.styles },
        locale
      )
      await resend.emails.send({
        from: 'questionario@carolorofino.com.br',
        to: data.email,
        replyTo: 'carolorofinoo@gmail.com',
        subject,
        html: clientHtml,
      })
    } catch {
      // silent — client confirmation failure does not affect success result
    }

    return { success: true }
  } catch {
    return { success: false, error: 'generic' }
  }
}
```

- [ ] **Step 2: Run TypeScript check**

```bash
cd "/c/Site carol/carol-orofino" && npx tsc --noEmit 2>&1 | head -20
```

Expected: errors about callers not passing `locale` yet (QuestionnaireWizard). That's expected at this step.

- [ ] **Step 3: Commit**

```bash
cd "/c/Site carol/carol-orofino" && git add src/actions/submitQuestionnaire.ts && git commit -m "feat: add client confirmation email to submitQuestionnaire"
```

---

### Task 3: Thread `locale` through `QuestionnaireWizard`

**Files:**
- Modify: `src/components/questionnaire/QuestionnaireWizard.tsx`
- Modify: `src/components/__tests__/QuestionnaireWizard.test.tsx`

- [ ] **Step 1: Update `Props` type and `handleSubmit` in `QuestionnaireWizard.tsx`**

Change line 30:
```ts
type Props = { messages: WizardMessages; locale: string }
```

Change line 32:
```ts
export default function QuestionnaireWizard({ messages, locale }: Props) {
```

Change line 58:
```ts
    const result = await submitQuestionnaire({ ...step1, ...step2, ...step3, ...step4 }, locale)
```

- [ ] **Step 2: Update the test to pass `locale`**

In `src/components/__tests__/QuestionnaireWizard.test.tsx`, update both `render` calls:

```ts
render(<QuestionnaireWizard messages={messages} locale="pt" />)
```

(Both `it` blocks use `render` — update both.)

- [ ] **Step 3: Run tests**

```bash
cd "/c/Site carol/carol-orofino" && npx jest src/components/__tests__/QuestionnaireWizard.test.tsx --no-coverage
```

Expected: 2 tests PASS

- [ ] **Step 4: Run TypeScript check**

```bash
cd "/c/Site carol/carol-orofino" && npx tsc --noEmit 2>&1 | head -20
```

Expected: 1 error — `QuestionnairePage` not passing `locale` yet.

- [ ] **Step 5: Commit**

```bash
cd "/c/Site carol/carol-orofino" && git add src/components/questionnaire/QuestionnaireWizard.tsx src/components/__tests__/QuestionnaireWizard.test.tsx && git commit -m "feat: thread locale prop through QuestionnaireWizard"
```

---

### Task 4: Pass `locale` from `QuestionnairePage`

**Files:**
- Modify: `src/app/[locale]/questionario/page.tsx`

- [ ] **Step 1: Add `locale` prop to the wizard render**

In `src/app/[locale]/questionario/page.tsx`, line 128, change:

```ts
      <QuestionnaireWizard messages={messages} />
```

to:

```ts
      <QuestionnaireWizard messages={messages} locale={locale} />
```

- [ ] **Step 2: Run TypeScript check — must be clean**

```bash
cd "/c/Site carol/carol-orofino" && npx tsc --noEmit 2>&1 | head -20
```

Expected: 0 errors

- [ ] **Step 3: Run full test suite**

```bash
cd "/c/Site carol/carol-orofino" && npm test -- --no-coverage 2>&1 | tail -10
```

Expected: 88 passed (81 previous + 7 new), 1 pre-existing failure in VideoSection

- [ ] **Step 4: Commit**

```bash
cd "/c/Site carol/carol-orofino" && git add src/app/[locale]/questionario/page.tsx && git commit -m "feat: pass locale to QuestionnaireWizard for client confirmation email"
```
