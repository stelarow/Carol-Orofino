# Spec — Redesign Visual do Questionário

**Data:** 2026-03-24
**Escopo:** Refatoração puramente visual dos componentes de questionário. Nenhuma lógica de negócio, validação ou estrutura de dados é alterada.

---

## Objetivo

Aplicar a regra 60-30-10 da paleta existente do projeto, eliminar todas as classes Tailwind genéricas (`gray-*`, `red-*`, `bg-slate`) e adicionar animações com Framer Motion para criar uma experiência moderna e luxuosa, consistente com a identidade visual do restante do site.

---

## Paleta e Hierarquia de Cores

| Proporção | Tokens | Aplicação |
|---|---|---|
| 60% | `linen`, `sand` | Fundo da página (já definido), fundo dos inputs, fundo geral do formulário |
| 30% | `stone`, `slate`, `latte` | Bordas em repouso, labels/captions, botão Voltar, barra de progresso inativa |
| 10% | `walnut` | Botão primário, borda de foco de input, chips/radios selecionados, barra de progresso ativa, ícone de sucesso |

**Remoção obrigatória:**
- Todas as classes `border-gray-*`, `bg-gray-*`, `text-gray-*`, `hover:bg-gray-*`
- `bg-slate` nos botões primários
- `text-red-600` nos erros (substituído por `text-walnut/80`)

---

## Tipografia

| Elemento | Classes |
|---|---|
| Título do step | `font-display text-4xl font-light tracking-tight` |
| Indicador de progresso | `font-display italic text-sm text-walnut` |
| Labels de campo | `font-body text-xs uppercase tracking-[0.2em] text-slate` |
| Texto de input | `font-body text-sm text-text-primary` |
| Hint / contador | `font-body text-xs text-slate` |
| Botão primário | `font-display italic text-linen` |
| Botão Voltar | `font-body text-sm text-slate` |
| Mensagem de erro | `font-body text-xs text-walnut/80` |

---

## Componentes

### Título do Step (`QuestionnaireWizard`)

O `h2` do step title usa atualmente a classe `font-heading` (token não definido no tema). Substituir por `font-display text-4xl font-light tracking-tight` — remover `font-heading` completamente.

### Barra de Progresso (`QuestionnaireWizard`)

- 4 traços finos (`h-px`) em `bg-stone`
- Trecho ativo: `motion.div` com `bg-walnut`, animado via `scaleX` com `transformOrigin: left` e `transition: { type: 'spring', stiffness: 80, damping: 20 }`
- Indicador textual: `font-display italic text-sm text-walnut`

### Inputs e Textarea

- Borda: `border border-stone` em repouso
- Foco: `focus:border-walnut` com `transition-colors duration-200`
- Fundo: `bg-linen/60`
- Sem `border-radius` (sharp corners = estética de luxo)
- Placeholder: `placeholder:text-slate/60`

### Chips de Seleção (Step 2 — ambiente, Step 3 — estilos)

- Repouso: `border border-stone bg-transparent text-text-primary`
- Hover: `border-latte`
- Selecionado: `border-walnut bg-walnut/8 text-walnut` — nota: `/8` significa 8% de opacidade; Tailwind v4 suporta valores arbitrários de opacidade, não é typo de `/80`
- Transição: `transition-colors duration-150`

### Radio Groups (Step 4 — escopo, urgência)

- Mesma lógica dos chips, layout em coluna full-width
- Ícone de seleção: ponto `●` em `text-walnut` no lado esquerdo quando selecionado (substituindo o radio HTML oculto visualmente)

### Upload de Arquivo

- Repouso: `border border-stone`
- Com arquivo: `border-walnut bg-walnut/5`
- Texto do hint: `text-slate/60`
- Texto com arquivo: `text-walnut`

### Select (orçamento)

- Mesma borda `border-stone`, foco `border-walnut`, `bg-linen/60`

### Botão Primário (Próximo / Enviar)

Classes Tailwind completas (substituem integralmente as classes existentes, incluindo remoção de `transition-opacity` e `hover:opacity-80`):
```
bg-walnut text-linen px-10 py-4 font-display italic hover:bg-latte transition-colors duration-150
```

Props Framer Motion:
```tsx
<motion.button
  whileHover={{ scale: 1.01 }}
  transition={{ duration: 0.15 }}
  ...
>
```

### Botão Voltar

- Sem borda, sem fundo: `text-slate hover:text-walnut transition-colors`
- Texto: `← {backLabel}` com `font-body text-sm`

### SuccessScreen

- Ícone ornamental `✦` (ou `✓`) em `text-walnut text-4xl`
- Animado: `motion.div` com `initial={{ scale: 0.88, opacity: 0 }}` → `animate={{ scale: 1, opacity: 1 }}`, `transition={{ type: 'spring', stiffness: 100, damping: 18 }}`
- Título: `font-display text-3xl font-light`
- Mensagem: `font-body text-sm text-slate`

---

## Animações (Framer Motion)

### Transição entre Steps

**Tracking de direção:** Adicionar estado `direction: 1 | -1` ao `QuestionnaireWizard`. Ao avançar (`setStep(n)` onde `n > step`), setar `direction = 1`; ao voltar, `direction = -1`. Passar `direction` como prop `custom` para `AnimatePresence` e `motion.div`.

**Reestruturação obrigatória do render:** O render atual usa quatro condicionais paralelos (`{step === N && <StepN />}`). Para que `AnimatePresence mode="wait"` funcione corretamente com Framer Motion v11+, o step ativo deve ser envolvido em um único `<motion.div key={step} custom={direction}>`. Estrutura esperada:

```tsx
<AnimatePresence mode="wait" custom={direction}>
  <motion.div
    key={step}
    custom={direction}
    variants={stepVariants}
    initial="enter"
    animate="center"
    exit="exit"
  >
    {step === 1 && <Step1Identity ... />}
    {step === 2 && <Step2Environment ... />}
    {step === 3 && <Step3Style ... />}
    {step === 4 && <Step4Scope ... />}
  </motion.div>
</AnimatePresence>
```

**Variants:**
```ts
const stepVariants = {
  enter: (dir: number) => ({ x: dir * 32, opacity: 0 }),
  center: { x: 0, opacity: 1, transition: { duration: 0.30, ease: [0.25, 0, 0, 1] } },
  exit: (dir: number) => ({ x: dir * -32, opacity: 0, transition: { duration: 0.20, ease: [0.25, 0, 0, 1] } }),
}
```

### Entrada de Campos (por Step)

Cada `<div>` de campo dentro de cada step usa `motion.div`:
- `initial={{ opacity: 0, y: 12 }}`
- `animate={{ opacity: 1, y: 0 }}`
- `transition={{ delay: i * 0.07, duration: 0.35, ease: [0.25, 0, 0, 1] }}` — onde `i` é o índice zero-based do campo dentro do step (0 para o primeiro campo, 1 para o segundo, etc.)

### Barra de Progresso

- `motion.div` com `animate={{ scaleX: step / TOTAL }}`
- `transformOrigin: 'left'`
- `transition={{ type: 'spring', stiffness: 80, damping: 20 }}`

---

## Arquivos a Modificar

| Arquivo | O que muda |
|---|---|
| `QuestionnaireWizard.tsx` | AnimatePresence + step transition + progress bar animada |
| `Step1Identity.tsx` | Cores + animação de entrada dos campos |
| `Step2Environment.tsx` | Cores + chips redesenhados + animação de entrada |
| `Step3Style.tsx` | Cores + chips redesenhados + animação de entrada |
| `Step4Scope.tsx` | Cores + radio visual + select + animação de entrada |
| `SuccessScreen.tsx` | Ícone + cores + animação de entrada |

---

## O que NÃO muda

- Lógica de validação
- Estrutura de dados / estado
- Server actions
- Traduções (messages JSON)
- Estrutura da página (`questionario/page.tsx`)
- Props dos componentes

---

## Critérios de Sucesso

1. Nenhuma classe `gray-*` permanece nos componentes do questionário
2. Todas as cores são tokens da paleta customizada
3. Transições entre steps são suaves e direcionais
4. Campos entram escalonados ao trocar de step
5. Barra de progresso anima suavemente
6. SuccessScreen tem entrada animada
7. Build passa sem erros TypeScript
