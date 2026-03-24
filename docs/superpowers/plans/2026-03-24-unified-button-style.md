# Unified Button Style Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Aplicar estilo visual consistente (bg-slate, borda branca, fonte Cormorant itálica) a todos os botões CTA do site.

**Architecture:** Edição direta dos classNames dos botões existentes em cada arquivo afetado. Sem novo componente — as mudanças são localizadas e pontuais. O WhatsAppButton inline é alterado no componente; os demais botões nas páginas são alterados in-place.

**Tech Stack:** Next.js App Router, Tailwind CSS v4, Cormorant Garamond (font-display), paleta customizada (bg-slate = #95978a).

---

## Arquivos Modificados

- Modify: `src/components/WhatsAppButton.tsx` — variant inline
- Modify: `src/app/[locale]/contato/page.tsx` — botão WhatsApp inline
- Modify: `src/app/[locale]/page.tsx` — botão "Ver todos os posts"
- Modify: `src/app/[locale]/residencial/page.tsx` — botão CTA final
- Modify: `src/app/[locale]/comercial/page.tsx` — botão CTA final
- Modify: `src/app/[locale]/design-de-interiores/page.tsx` — botão CTA final
- Modify: `src/app/[locale]/projetos/page.tsx` — botão CTA final
- Modify: `src/components/questionnaire/Step1Identity.tsx` — botão "Próximo"
- Modify: `src/components/questionnaire/Step2Environment.tsx` — botão "Próximo"
- Modify: `src/components/questionnaire/Step3Style.tsx` — botão "Próximo"
- Modify: `src/components/questionnaire/Step4Scope.tsx` — botão "Enviar"
- Test: `src/components/__tests__/WhatsAppButton.test.tsx`

---

### Task 1: WhatsAppButton — variant inline

**Files:**
- Modify: `src/components/WhatsAppButton.tsx`
- Test: `src/components/__tests__/WhatsAppButton.test.tsx`

- [ ] **Step 1: Ler o teste existente**

```bash
cat src/components/__tests__/WhatsAppButton.test.tsx
```

- [ ] **Step 2: Atualizar o teste para refletir o novo estilo**

No arquivo `src/components/__tests__/WhatsAppButton.test.tsx`, encontrar o teste do variant `inline` e verificar se há asserção sobre className. Se houver, atualizar para incluir `bg-slate` e `text-white`. Se não houver, adicionar:

```typescript
it('renders inline variant with slate style', () => {
  render(<WhatsAppButton variant="inline" message="oi" label="Falar" />)
  const link = screen.getByRole('link')
  expect(link.className).toContain('bg-slate')
  expect(link.className).toContain('text-white')
})
```

- [ ] **Step 3: Rodar o teste para verificar que falha**

```bash
npx jest src/components/__tests__/WhatsAppButton.test.tsx --no-coverage
```

Esperado: FAIL (className não contém `bg-slate`)

- [ ] **Step 4: Atualizar o className do variant inline em WhatsAppButton.tsx**

No arquivo `src/components/WhatsAppButton.tsx`, localizar o `return` do variant inline (linha ~42) e substituir o className do `<Link>`:

**Antes:**
```tsx
className={`inline-flex items-center gap-2 rounded-none border border-text-primary px-6 py-3 text-sm font-body uppercase tracking-widest text-text-primary transition-colors hover:bg-text-primary hover:text-background focus:outline-none focus:ring-2 focus:ring-text-primary focus:ring-offset-2 ${className}`}
```

**Depois:**
```tsx
className={`inline-flex items-center gap-2 rounded-none bg-slate border border-white/60 px-6 py-3 font-display font-light italic text-white transition-opacity hover:opacity-80 focus:outline-none focus:ring-2 focus:ring-white/60 focus:ring-offset-2 ${className}`}
```

> Nota: `rounded-none` é mantido explicitamente — estava no className original e deve permanecer.

- [ ] **Step 5: Rodar o teste para verificar que passa**

```bash
npx jest src/components/__tests__/WhatsAppButton.test.tsx --no-coverage
```

Esperado: PASS

- [ ] **Step 6: Commit**

```bash
git add src/components/WhatsAppButton.tsx src/components/__tests__/WhatsAppButton.test.tsx
git commit -m "style(button): apply slate style to WhatsAppButton inline variant"
```

---

### Task 2: Página /contato — botão WhatsApp inline

**Files:**
- Modify: `src/app/[locale]/contato/page.tsx`

- [ ] **Step 1: Substituir o className do botão WhatsApp**

No arquivo `src/app/[locale]/contato/page.tsx`, localizar o `<Link>` do botão WhatsApp (linha ~36) e substituir seu className:

**Antes:**
```tsx
className="inline-flex items-center gap-3 border border-text-primary px-10 py-4 font-body text-sm uppercase tracking-widest text-text-primary transition-colors hover:bg-mauve hover:text-background"
```

**Depois:**
```tsx
className="inline-flex items-center gap-3 bg-slate border border-white/60 px-10 py-4 font-display font-light italic text-white transition-opacity hover:opacity-80"
```

- [ ] **Step 2: Verificar visualmente em dev**

```bash
npm run dev
```

Abrir `http://localhost:3000/pt/contato` e verificar que o botão tem fundo slate, borda branca e texto branco itálico.

- [ ] **Step 3: Commit**

```bash
git add src/app/[locale]/contato/page.tsx
git commit -m "style(button): apply slate style to contato page WhatsApp button"
```

---

### Task 3: Home page — botão "Ver todos os posts"

**Files:**
- Modify: `src/app/[locale]/page.tsx`

- [ ] **Step 1: Substituir o className do botão do blog**

No arquivo `src/app/[locale]/page.tsx`, localizar o `<Link>` do botão do blog (linha ~197) e substituir seu className:

**Antes:**
```tsx
className="inline-block font-body text-xs uppercase tracking-widest text-primary border border-primary px-8 py-3 transition-colors hover:bg-mauve hover:text-background"
```

**Depois:**
```tsx
className="inline-block bg-slate border border-white/60 px-8 py-3 font-display font-light italic text-white transition-opacity hover:opacity-80"
```

- [ ] **Step 2: Verificar em dev**

Abrir `http://localhost:3000/pt` e rolar até a seção blog, verificar o botão.

- [ ] **Step 3: Commit**

```bash
git add "src/app/[locale]/page.tsx"
git commit -m "style(button): apply slate style to home blog button"
```

---

### Task 4: Páginas Residencial, Comercial, Design de Interiores e Projetos — botões CTA

**Files:**
- Modify: `src/app/[locale]/residencial/page.tsx`
- Modify: `src/app/[locale]/comercial/page.tsx`
- Modify: `src/app/[locale]/design-de-interiores/page.tsx`
- Modify: `src/app/[locale]/projetos/page.tsx`

Todos os quatro arquivos têm o mesmo className no botão CTA final:
```tsx
className="font-body text-xs uppercase tracking-widest border border-text-primary text-text-primary px-8 py-3 transition-colors hover:bg-mauve hover:text-background hover:border-mauve"
```

- [ ] **Step 1: Atualizar residencial/page.tsx**

Substituir o className do `<Link>` CTA:

**Depois:**
```tsx
className="bg-slate border border-white/60 px-8 py-3 font-display font-light italic text-white transition-opacity hover:opacity-80"
```

- [ ] **Step 2: Atualizar comercial/page.tsx**

Mesma substituição no CTA de comercial.

- [ ] **Step 3: Atualizar design-de-interiores/page.tsx**

Mesma substituição.

- [ ] **Step 4: Atualizar projetos/page.tsx**

Mesma substituição.

- [ ] **Step 5: Commit**

```bash
git add "src/app/[locale]/residencial/page.tsx" "src/app/[locale]/comercial/page.tsx" "src/app/[locale]/design-de-interiores/page.tsx" "src/app/[locale]/projetos/page.tsx"
git commit -m "style(button): apply slate style to category page CTA buttons"
```

---

### Task 5: Questionário — botões Next e Submit

**Files:**
- Modify: `src/components/questionnaire/Step1Identity.tsx`
- Modify: `src/components/questionnaire/Step2Environment.tsx`
- Modify: `src/components/questionnaire/Step3Style.tsx`
- Modify: `src/components/questionnaire/Step4Scope.tsx`

- [ ] **Step 1: Atualizar Step1Identity.tsx — botão "Próximo"**

Localizar o `<button>` na linha ~84:

**Antes:**
```tsx
className="mt-2 border border-text-primary px-10 py-4 font-body text-sm uppercase tracking-widest transition-colors hover:bg-text-primary hover:text-background"
```

**Depois:**
```tsx
className="mt-2 bg-slate border border-white/60 px-10 py-4 font-display font-light italic text-white transition-opacity hover:opacity-80"
```

- [ ] **Step 2: Atualizar Step2Environment.tsx — botão "Próximo"**

Localizar o `<button>` do `nextLabel` na linha ~157:

**Antes:**
```tsx
className="border border-text-primary px-10 py-4 font-body text-sm uppercase tracking-widest transition-colors hover:bg-text-primary hover:text-background"
```

**Depois:**
```tsx
className="bg-slate border border-white/60 px-10 py-4 font-display font-light italic text-white transition-opacity hover:opacity-80"
```

- [ ] **Step 3: Atualizar Step3Style.tsx — botão "Próximo"**

Localizar o `<button>` do `nextLabel` na linha ~68:

**Antes:**
```tsx
className="border border-text-primary px-10 py-4 font-body text-sm uppercase tracking-widest transition-colors hover:bg-text-primary hover:text-background"
```

**Depois:**
```tsx
className="bg-slate border border-white/60 px-10 py-4 font-display font-light italic text-white transition-opacity hover:opacity-80"
```

- [ ] **Step 4: Atualizar Step4Scope.tsx — botão "Enviar"**

Localizar o `<button>` do `submitLabel` na linha ~86:

**Antes:**
```tsx
className="border border-text-primary px-10 py-4 font-body text-sm uppercase tracking-widest transition-colors hover:bg-text-primary hover:text-background disabled:opacity-50"
```

**Depois:**
```tsx
className="bg-slate border border-white/60 px-10 py-4 font-display font-light italic text-white transition-opacity hover:opacity-80 disabled:opacity-50"
```

- [ ] **Step 5: Rodar todos os testes**

```bash
npm run test
```

Esperado: todos os testes passam.

- [ ] **Step 6: Commit**

```bash
git add src/components/questionnaire/Step1Identity.tsx src/components/questionnaire/Step2Environment.tsx src/components/questionnaire/Step3Style.tsx src/components/questionnaire/Step4Scope.tsx
git commit -m "style(button): apply slate style to questionnaire Next/Submit buttons"
```

---

### Task 6: Verificação final

- [ ] **Step 1: Build de produção**

```bash
npm run build
```

Esperado: sem erros de build.

- [ ] **Step 2: Lint**

```bash
npm run lint
```

Esperado: sem erros.

- [ ] **Step 3: Verificação visual das páginas em dev**

```bash
npm run dev
```

Conferir cada página com botão modificado:
- `/pt` — botão blog
- `/pt/sobre` — botão WhatsApp inline (referência visual do spec — verificar com atenção)
- `/pt/contato` — botão WhatsApp
- `/pt/residencial` — botão CTA
- `/pt/comercial` — botão CTA
- `/pt/design-de-interiores` — botão CTA
- `/pt/projetos` — botão CTA
- `/pt/questionario` — botões Next/Submit nos 4 steps

Verificar que o botão floating do WhatsApp permanece inalterado (verde, round, fixo).
