# Client Confirmation Email — Design Spec

**Date:** 2026-03-25
**Status:** Approved

## Overview

After the client submits the questionnaire, they receive a confirmation e-mail acknowledging receipt and showing a brief summary of their submission. The e-mail is sent in the same locale the client used to fill the form (pt / en / es).

## Affected Files

| File | Change |
|---|---|
| `src/app/[locale]/questionario/page.tsx` | Pass `locale` prop to `QuestionnaireWizard` |
| `src/components/questionnaire/QuestionnaireWizard.tsx` | Accept `locale` prop, forward to `submitQuestionnaire` |
| `src/actions/submitQuestionnaire.ts` | Accept `locale` param, send second Resend email to client |
| `src/actions/questionnaireUtils.ts` | Add `buildClientEmailHtml` and `CLIENT_EMAIL_STRINGS` |

## Data Flow

```
QuestionnairePage (server, has locale from params)
  → <QuestionnaireWizard messages={messages} locale={locale} />
      → handleSubmit() calls submitQuestionnaire({ ...formData }, locale)
          → resend.emails.send(...)  // Carol's notification (existing)
          → resend.emails.send(...)  // Client confirmation (new)
```

## `submitQuestionnaire` changes

Signature change:
```ts
export async function submitQuestionnaire(
  data: QuestionnaireData,
  locale: string         // new param
): Promise<ActionResult>
```

After the existing Carol email send, add:

```ts
try {
  const { subject, html } = buildClientEmailHtml({ name: data.name, roomType: data.roomType, styles: data.styles }, locale)
  await resend.emails.send({
    from: 'questionario@carolorofino.com.br',
    to: data.email,
    replyTo: 'carolorofinoo@gmail.com',
    subject,
    html,
  })
} catch {
  // silent — client confirmation failure does not affect success result
}
```

The outer try/catch still returns `{ success: true }` even if the client email fails. Only the Carol notification failure causes `{ success: false }`.

## `buildClientEmailHtml`

New function in `questionnaireUtils.ts`:

```ts
type ClientEmailInput = {
  name: string
  roomType: string[]
  styles: string[]
}

export function buildClientEmailHtml(
  data: ClientEmailInput,
  locale: string
): { subject: string; html: string }
```

Uses hardcoded i18n strings (no need to pull from next-intl — this runs server-side outside the request i18n context). Strings defined as a `CLIENT_EMAIL_STRINGS` constant keyed by locale, falling back to `'pt'`.

## Email Content (per locale)

### Subject
- pt: `Recebemos seu questionário — Carol Orofino`
- en: `We received your questionnaire — Carol Orofino`
- es: `Recibimos tu cuestionario — Carol Orofino`

### Body sections
1. **Greeting** — `Olá, {name}` / `Hello, {name}` / `Hola, {name}`
2. **Confirmation line** — "Recebemos seu questionário e entraremos em contato em breve." (pt) / "We received your questionnaire and will be in touch shortly." (en) / "Recibimos tu cuestionario y nos pondremos en contacto contigo pronto." (es)
3. **Summary** — labeled section with:
   - Room type(s): joined list
   - Styles: joined list (or `—` if empty)
4. **Next steps** — "Carol Orofino analisará suas respostas e entrará em contato pelo WhatsApp ou e-mail." (pt) / English/Spanish equivalents
5. **Signature** — "Carol Orofino — carolorofino.com.br"

Visual style: same plain `font-family:sans-serif` approach as existing `buildEmailHtml`, keeps it lightweight and widely compatible.

## Error Handling

| Scenario | Behavior |
|---|---|
| Carol email fails | `{ success: false, error: 'generic' }` — wizard shows error |
| Client email fails | Silent — `{ success: true }` returned, wizard shows success |
| Both fail | Carol failure is caught first, returns `{ success: false }` |

## Testing

- Update `QuestionnaireWizard.test.tsx`: pass `locale="pt"` prop (currently not required — will fail TypeScript after change)
- No new test for the server action email content (Resend is mocked at the module level in existing tests)
- `buildClientEmailHtml` can be tested as a pure function in `questionnaireUtils` — add unit tests for pt/en/es output shape

## Out of Scope

- Attaching uploaded files to the client email
- Tracking delivery/opens
- Unsubscribe link
