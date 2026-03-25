# Merge Services into Sobre Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Incorporar o conteúdo da página `/servicos` na página `/sobre`, remover a página de serviços e atualizar todos os links de navegação.

**Architecture:** A seção de serviços é inserida na página `sobre` como uma nova `<section>` com `id="servicos"`, usando exatamente os mesmos estilos da página atual. Os links de navegação no Navbar e Footer passam a apontar para `/sobre#servicos`. A pasta `/servicos` é deletada e o sitemap é atualizado.

**Tech Stack:** Next.js App Router, next-intl, Tailwind CSS v4

---

### Task 1: Adicionar tradução `servicesTitle` aos arquivos de mensagens

**Files:**
- Modify: `src/messages/pt.json`
- Modify: `src/messages/en.json`
- Modify: `src/messages/es.json`

- [ ] **Step 1: Verificar namespace `about` nos arquivos de mensagens**

```bash
grep -n "about" src/messages/pt.json | head -20
```

- [ ] **Step 2: Adicionar chave `servicesTitle` no namespace `about`**

Em `src/messages/pt.json`, dentro do objeto `about`, adicionar:
```json
"servicesTitle": "Serviços"
```

Em `src/messages/en.json`, dentro do objeto `about`, adicionar:
```json
"servicesTitle": "Services"
```

Em `src/messages/es.json`, dentro do objeto `about`, adicionar:
```json
"servicesTitle": "Servicios"
```

- [ ] **Step 3: Commit**

```bash
git add src/messages/pt.json src/messages/en.json src/messages/es.json
git commit -m "feat(i18n): add servicesTitle key to about namespace"
```

---

### Task 2: Adicionar seção de serviços à página Sobre

**Files:**
- Modify: `src/app/[locale]/sobre/page.tsx`

- [ ] **Step 1: Adicionar imports necessários**

No topo do arquivo `src/app/[locale]/sobre/page.tsx`, adicionar os imports:
```tsx
import { services } from '@/data/services'
```

Na linha que já importa de `@/lib/i18n`, adicionar `type Locale` ao import existente:
```tsx
import { routing, type Locale } from '@/lib/i18n'
```

- [ ] **Step 2: Adicionar a seção de serviços**

Inserir após o segundo `<SectionDivider />` (antes de `{/* Section 3 — CTA */}`), incluindo um terceiro `<SectionDivider />` para separar da seção CTA:

```tsx
      <SectionDivider />

      {/* Section 3 — Serviços */}
      <section id="servicos" className="bg-linen py-20 px-6 md:px-24">
        <div className="mx-auto max-w-5xl">
          <h2 className="font-display text-4xl md:text-5xl text-primary tracking-wide mb-16">
            {t('servicesTitle')}
          </h2>
          <div className="grid grid-cols-1 gap-px bg-sage md:grid-cols-2">
            {services.map((service) => {
              const translation = service.translations[locale as Locale]
              return (
                <div key={service.id} className="bg-background p-8">
                  <h3 className="font-display text-2xl text-text-primary tracking-wide mb-4">
                    {translation.title}
                  </h3>
                  <p className="font-body text-base text-dark leading-relaxed">
                    {translation.description}
                  </p>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      <SectionDivider />

      {/* Section 4 — CTA */}
```

O bloco `{/* Section 3 — CTA */}` existente deve ser renomeado para `{/* Section 4 — CTA */}` e o `<SectionDivider />` antes dele deve ser removido (já está incluído no trecho acima).

- [ ] **Step 3: Verificar que o build compila sem erros**

```bash
npm run build
```

Expected: build sem erros de tipo ou importação.

- [ ] **Step 4: Commit**

```bash
git add src/app/[locale]/sobre/page.tsx
git commit -m "feat(sobre): add services section merged from /servicos page"
```

---

### Task 3: Atualizar Navbar — trocar link `/servicos` por `/sobre#servicos`

**Files:**
- Modify: `src/components/Navbar.tsx`

- [ ] **Step 1: Localizar a entrada do link de serviços**

Na linha ~40 de `src/components/Navbar.tsx`:
```tsx
{ href: `/${locale}/servicos`, label: t('services') },
```

- [ ] **Step 2: Substituir o href**

```tsx
{ href: `/${locale}/sobre#servicos`, label: t('services') },
```

- [ ] **Step 3: Confirmar que o build passa**

```bash
npm run build
```

- [ ] **Step 4: Commit**

```bash
git add src/components/Navbar.tsx
git commit -m "feat(nav): update services link to /sobre#servicos"
```

---

### Task 4: Atualizar Footer — trocar link `/servicos` por `/sobre#servicos`

**Files:**
- Modify: `src/components/Footer.tsx`

- [ ] **Step 1: Localizar o link de serviços no footer**

Na linha ~42 de `src/components/Footer.tsx`:
```tsx
href={`/${locale}/servicos`}
```

- [ ] **Step 2: Substituir o href**

```tsx
href={`/${locale}/sobre#servicos`}
```

- [ ] **Step 3: Commit**

```bash
git add src/components/Footer.tsx
git commit -m "feat(footer): update services link to /sobre#servicos"
```

---

### Task 5: Remover a página `/servicos`

**Files:**
- Delete: `src/app/[locale]/servicos/page.tsx`
- Delete: `src/app/[locale]/servicos/` (pasta)

- [ ] **Step 1: Deletar o arquivo da página**

```bash
rm "src/app/[locale]/servicos/page.tsx"
rmdir "src/app/[locale]/servicos"
```

- [ ] **Step 2: Confirmar que o build passa sem a página**

```bash
npm run build
```

Expected: nenhum erro. A rota `/servicos` deixará de existir.

- [ ] **Step 3: Commit**

```bash
git add -A
git commit -m "feat(servicos): remove /servicos page (merged into /sobre)"
```

---

### Task 6: Atualizar o sitemap

**Files:**
- Modify: `src/app/sitemap.ts`

- [ ] **Step 1: Remover `/servicos` da lista de rotas estáticas**

De:
```ts
const staticRoutes = ['', '/sobre', '/servicos', '/contato']
```

Para:
```ts
const staticRoutes = ['', '/sobre', '/contato']
```

- [ ] **Step 2: Rodar build final**

```bash
npm run build
```

Expected: build limpo sem erros.

- [ ] **Step 3: Rodar testes**

```bash
npm run test
```

Expected: todos os testes passando (o test de `services.ts` continua válido pois o arquivo de dados não foi removido).

- [ ] **Step 4: Commit e push**

```bash
git add src/app/sitemap.ts
git commit -m "feat(sitemap): remove /servicos route"
git push origin master
```
