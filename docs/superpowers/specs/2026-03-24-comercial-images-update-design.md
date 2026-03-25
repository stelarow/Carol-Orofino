# Spec: Atualização de Imagens e Seções — Página Comercial

**Data:** 2026-03-24
**Status:** Aprovado

---

## Objetivo

Substituir as duas imagens atuais da página `/comercial` por novas imagens fornecidas pela cliente, reescrever os textos de cada seção para refletir o conteúdo visual de cada imagem, e adicionar uma terceira seção para acomodar a terceira imagem.

**Estrutura da página preservada:** toda a estrutura ao redor (Hero, CTA, imports, assinatura da função, parâmetros `locale`) permanece inalterada. Apenas o conteúdo das Seções 1 e 2 e a adição da Seção 3 são modificados.

---

## Arco Narrativo

A narrativa das seções segue uma progressão temática em três capítulos:

**Identidade → Presença → Equilíbrio**

---

## Seções

### Seção 1 — Identidade (texto esquerda / imagem direita)

**Imagem:** `comercial-01.png`
**Alt:** `"Escritório comercial Carol Orofino — identidade"`
Escritório zen com madeira quente, estante iluminada, arte abstrata japonesa, janelas shoji. Atmosfera serena e curada.
**Posicionamento da imagem:** `object-cover object-center`
**Mobile (Seção 1):** texto vem primeiro no DOM, sem classes `order-*` — aparece acima da imagem em telas pequenas. Este é o comportamento existente, mantido sem alteração.

**Label:** `01 — Identidade`
**Título:** `Design que revela<br />quem você é`
*(O `<br />` após "revela" é intencional — quebra visualmente o título em "Design que revela" / "quem você é".)*
**Parágrafos:**
> O espaço comercial é uma extensão da sua marca. Antes de qualquer palavra, ele já comunica valores, cuidado e personalidade.

> Cada escolha — a madeira, a luz, o detalhe curatorial — é pensada para traduzir sua essência em ambiente.

---

### Seção 2 — Presença (imagem esquerda / texto direita)

**Imagem:** `comercial-02.png`
**Alt:** `"Escritório executivo Carol Orofino — presença"`
*(Alt diferente das demais — "executivo" reflete o estilo visual da imagem: mesa executiva escura, couro, mobiliário de prestígio. Divergência intencional.)*
Escritório executivo com madeira escura, mesa executiva, cadeiras de couro, estante com objetos decorativos, TV na parede, cortinas sheer.
**Posicionamento da imagem:** `object-cover object-center`
**Mobile (Seção 2):** a `<div>` da imagem tem `order-2 md:order-1` e a `<div>` do texto tem `order-1 md:order-2` — texto aparece acima da imagem em telas pequenas. Estas classes já existem no código e são preservadas.

**Label:** `02 — Presença`
**Título:** `Ambientes que<br />constroem autoridade`
*(O `<br />` após "que" é intencional — quebra em "Ambientes que" / "constroem autoridade".)*
**Parágrafos:**
> Credibilidade se constrói também no espaço. Um ambiente bem projetado transmite seriedade, inspira confiança e posiciona sua marca antes mesmo da primeira reunião.

> Do mobiliário à paleta, cada elemento reforça a mensagem que você quer passar.

---

### Seção 3 — Equilíbrio (texto esquerda / imagem direita) *(nova)*

**Imagem:** `comercial-03.png`
**Alt:** `"Escritório comercial Carol Orofino — equilíbrio"`
Escritório japandi com madeira natural clara, janelas amplas com vista para natureza, arte de tinta japonesa, design biofílico e minimalista.
**Posicionamento da imagem:** `object-cover object-center`
**Mobile (Seção 3):** texto vem primeiro no DOM, sem classes `order-*` — aparece acima da imagem em telas pequenas (mesmo padrão da Seção 1).

**Label:** `03 — Equilíbrio`
**Título:** `Funcionalidade<br />com leveza`
*(O `<br />` após "Funcionalidade" é intencional — quebra em "Funcionalidade" / "com leveza".)*
**Parágrafos:**
> Produtividade real exige conforto. Espaços que integram luz natural, proporção e materiais certos criam ambientes onde as pessoas trabalham melhor — e permanecem com prazer.

> Projeto para que beleza e função andem juntas, sem concessões.

---

## Arquivos

### Imagens a copiar

| Arquivo de origem | Destino no projeto |
|---|---|
| `Downloads/Adicione_a_logo_202603240843.png` | `public/images/categories/comercial-01.png` |
| `Downloads/Adicione_a_logo_202603240848.png` | `public/images/categories/comercial-02.png` |
| `Downloads/Adicione_a_logo_202603240844.png` | `public/images/categories/comercial-03.png` |

### Arquivo a editar

`src/app/[locale]/comercial/page.tsx`

---

## Mudanças no código

1. **Seção 1:** trocar `src` de `comercial-01.jpg` para `comercial-01.png`, substituir label/título/parágrafos conforme spec acima.
2. **Seção 2:** trocar `src` de `comercial-02.jpg` para `comercial-02.png`, substituir label/título/parágrafos conforme spec acima. Manter as classes `order-*` existentes nas `<div>`s.
3. **Seção 3 (nova):** inserir novo bloco `<section>` com o mesmo padrão da Seção 1 (texto primeiro no DOM, sem `order-*`), usando `comercial-03.png`.

---

## Layout das seções

```
Seção 1: [ texto | imagem ]   — texto `<div>` vem primeiro no DOM, sem classes order-*
Seção 2: [ imagem | texto ]   — imagem <div> tem order-2 md:order-1; texto <div> tem order-1 md:order-2
Seção 3: [ texto | imagem ]   — texto <div> vem primeiro no DOM, sem classes order-* (igual Seção 1)
```

**Posição de inserção da Seção 3:** diretamente após o `</section>` de fechamento da Seção 2. O `<SectionDivider />` existente (que já está entre a Seção 2 e o CTA) permanece no lugar — a Seção 3 é inserida entre o `</section>` da Seção 2 e esse `<SectionDivider />`.

**Sem `<SectionDivider />`** adicional entre Seção 2 e Seção 3 — as seções são adjacentes, mantendo o padrão já usado entre Seção 1 e Seção 2.

---

## Fora de escopo

- Hero image — não alterada
- Seção CTA — não alterada
- Traduções (en/es) — textos continuam hardcoded em pt, sem alteração
- Estrutura da função, imports, metadata — não alterados
