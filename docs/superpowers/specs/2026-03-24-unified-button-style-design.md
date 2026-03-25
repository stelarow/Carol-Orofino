# Spec: Estilo Visual Unificado de Botões

**Data:** 2026-03-24
**Status:** Aprovado

## Objetivo

Aplicar um estilo visual consistente a todos os botões CTA do site, alinhado ao estilo da seção "Filosofia de Design" da página /sobre: fundo `bg-slate`, borda `border-white/60`, texto branco com fonte Cormorant Garamond itálico leve.

## Estilo Novo

```
bg-slate border border-white/60 px-{mantido} py-{mantido}
font-display font-light italic text-white
transition-opacity hover:opacity-80
```

- `bg-slate` — cor `#95978a` (verde-cinza da paleta do site)
- `border border-white/60` — borda branca com 60% de opacidade
- `font-display font-light italic text-white` — Cormorant Garamond, peso light, itálico, branco
- `hover:opacity-80` — hover sutil via opacidade

O padding existente (`px-6 py-3`, `px-8 py-3`, `px-10 py-4`) é preservado por botão.

## Arquivos e Botões Afetados

| Arquivo | Botão | Notas |
|---|---|---|
| `src/components/WhatsAppButton.tsx` | Variant `inline` | SVG branco via `currentColor` |
| `src/app/[locale]/contato/page.tsx` | Botão WhatsApp inline | SVG branco via `currentColor` |
| `src/app/[locale]/page.tsx` | "Ver todos os posts" (blog) | |
| `src/app/[locale]/residencial/page.tsx` | "Preencher questionário" (CTA) | |
| `src/app/[locale]/comercial/page.tsx` | "Preencher questionário" (CTA) | |
| `src/app/[locale]/design-de-interiores/page.tsx` | CTA final | |
| `src/app/[locale]/projetos/page.tsx` | CTA final | |
| `src/components/questionnaire/Step1Identity.tsx` | "Próximo" | |
| `src/components/questionnaire/Step2Environment.tsx` | "Próximo" | |
| `src/components/questionnaire/Step3Style.tsx` | "Próximo" | |
| `src/components/questionnaire/Step4Scope.tsx` | "Enviar" | |

## O Que Não Muda

- `WhatsAppButton` variant `floating` — preservado
- Botões "Voltar" nos steps do questionário — ação secundária, não CTA
- Toggle buttons dos steps (tipos de ambiente, estilos, escopo, urgência) — inputs de formulário
- Links texto com sublinhado (QuestionnaireSection, AboutTeaser, blog "Ler mais") — links editoriais

## Notas Técnicas

- O ícone SVG do WhatsApp usa `fill="currentColor"`, portanto herda `text-white` automaticamente — nenhuma mudança explícita de cor necessária no SVG
- A classe `rounded-none` existente no WhatsAppButton inline é mantida
- O estado `disabled:opacity-50` nos botões do Step4 é mantido
