# Spec: Questionário de Briefing — Carol Orofino

**Data:** 2026-03-22
**Status:** Aprovado

---

## Visão Geral

Página dedicada `/[locale]/questionario` com um wizard em etapas que coleta informações de briefing do cliente antes de uma consulta de design de interiores. Ao enviar, os dados e arquivos são enviados por e-mail para Carol via Resend, com uploads armazenados no Vercel Blob.

---

## Localização

- Rota: `/pt/questionario`, `/en/questionnaire`, `/es/cuestionario`
- A página de Contato existente ganha um botão/link que preserva o locale atual do usuário via `useRouter` + `useLocale` do next-intl
- Chave i18n necessária na página de contato: `contact.questionnaireLink` (ex: "Preencher questionário de briefing")
- Idiomas: `pt`, `en`, `es` (via next-intl, já configurado no projeto)

---

## Fluxo do Wizard

4 etapas sequenciais com barra de progresso no topo. O cliente avança com botão "Próximo" e pode voltar com "Anterior". O envio ocorre apenas na etapa 4. O estado do formulário é mantido em React state durante a sessão (sem persistência — se o usuário fechar a aba, os dados são perdidos; fora de escopo para v1).

### Etapa 1 — Identificação e Contato
| Campo | Tipo | Obrigatório | Validação |
|-------|------|-------------|-----------|
| Nome completo | text input | ✅ | mínimo 2 caracteres |
| WhatsApp | text input | ✅ | apenas dígitos, 10–11 dígitos (aceita com ou sem +55) |
| E-mail | email input | ✅ | formato de e-mail válido |

### Etapa 2 — O Ambiente
| Campo | Tipo | Obrigatório | Notas |
|-------|------|-------------|-------|
| Tipo de ambiente | select | ✅ | Opções: Sala, Quarto, Cozinha, Escritório, Consultório, Outro |
| Metragem aproximada (m²) | number input (inteiro) | ❌ | min 1, max 10000, sem decimais |
| Upload: planta baixa / croqui | file input | ❌ | 1 arquivo, PDF/PNG/JPG/JPEG, máx. 10MB |
| Upload: fotos ou vídeos | file input (múltiplos) | ❌ | PNG/JPG/JPEG/WEBP/MP4/MOV, máx. 50MB total |

### Etapa 3 — Estilo e Referências
| Campo | Tipo | Obrigatório | Notas |
|-------|------|-------------|-------|
| Estilos preferidos | cards clicáveis, multi-seleção | ❌ | Minimalista, Industrial, Escandinavo, Clássico, Moderno |
| Link do Pinterest | url input | ❌ | aceita qualquer URL válida |
| O que não pode faltar | textarea | ❌ | máx. 500 caracteres |

### Etapa 4 — Escopo e Investimento
| Campo | Tipo | Obrigatório | Opções |
|-------|------|-------------|--------|
| Tipo de projeto | radio | ✅ | Consultoria de cores e móveis / Projeto 3D detalhado / Reforma completa com acompanhamento |
| Urgência | radio | ❌ | Imediata / Daqui a 3 meses / Apenas sondando |
| Faixa de investimento | select | ❌ | Até R$10k / R$10k–R$30k / R$30k–R$80k / Acima de R$80k |

---

## Arquitetura

### Componentes

```
src/
  app/[locale]/questionario/
    page.tsx                          # Server Component — renderiza wizard + metadados i18n
  components/questionnaire/
    QuestionnaireWizard.tsx           # Client Component — estado das etapas, barra de progresso
    Step1Identity.tsx
    Step2Environment.tsx
    Step3Style.tsx
    Step4Scope.tsx
    SuccessScreen.tsx                 # Tela de confirmação pós-envio
  actions/
    submitQuestionnaire.ts            # Server Action — upload (Vercel Blob) + e-mail (Resend)
```

### Server Action — formato de resposta

```ts
type ActionResult = { success: true } | { success: false; error: string }
```

O client component verifica `result.success` para decidir exibir `SuccessScreen` ou mensagem de erro inline.

### Fluxo de dados

1. `QuestionnaireWizard` acumula as respostas em state local por etapa
2. Na etapa 4, ao clicar em Enviar, chama o Server Action `submitQuestionnaire(formData)`
3. O Server Action:
   a. Faz upload dos arquivos para Vercel Blob → obtém URLs públicas
   b. Monta HTML do e-mail com todas as respostas e links dos arquivos
   c. Envia via Resend para `carol@carolorofino.com.br`
4. Em caso de sucesso, exibe `SuccessScreen`
5. Em caso de erro, exibe mensagem de erro inline na etapa 4 — os dados preenchidos são preservados em state. O usuário pode corrigir e tentar enviar novamente manualmente.

### Tratamento de erros

| Cenário | Comportamento |
|---------|---------------|
| Upload falha (Vercel Blob) | Retornar erro ao cliente; não enviar e-mail; exibir mensagem genérica |
| E-mail falha (Resend) | Retornar erro ao cliente; exibir mensagem genérica "Algo deu errado, tente novamente"; arquivos já enviados ficam no Blob (aceitável para v1 — nenhuma mensagem distingue o tipo de falha para o usuário) |
| Variável de ambiente ausente | Erro em build time — não chega à produção |
| Arquivo muito grande | Validado no cliente antes do envio; mensagem inline por campo |
| Tipo de arquivo inválido | Validado no cliente; mensagem inline por campo |

---

## E-mail (Resend)

- **Para:** `carol@carolorofino.com.br`
- **Assunto:** `Novo questionário — {nome do cliente}`
- **Corpo HTML:** Resumo estruturado por seção com todas as respostas; links clicáveis para os arquivos no Vercel Blob; link de resposta no WhatsApp (`https://wa.me/{whatsapp}` — abre conversa diretamente com o número do cliente)
- **Normalização do WhatsApp para wa.me:** remover todos os caracteres não numéricos, então prefixar com `55` se não iniciar com `55`. Ex: `(11) 99999-0000` → `5511999990000` → `https://wa.me/5511999990000`

---

## Uploads (Vercel Blob)

- **Planta baixa:** aceita `application/pdf`, `image/png`, `image/jpeg` — 1 arquivo, máx. 10MB
- **Fotos/vídeos:** aceita `image/png`, `image/jpeg`, `image/webp`, `video/mp4`, `video/quicktime` — múltiplos arquivos, máx. 50MB total
- Upload via `@vercel/blob` dentro do Server Action (server-side — seguro)
- Nome dos arquivos no Blob: `questionnaire/{timestamp}-{nome-original-sanitizado}`
- URLs resultantes incluídas no e-mail

---

## i18n

Todas as strings do wizard ficam em `messages/{pt,en,es}.json` sob o namespace `questionnaire`. Chaves completas a implementar:

```json
{
  "questionnaire": {
    "title": "Questionário de Briefing",
    "progress": "Etapa {current} de {total}",
    "next": "Próximo",
    "back": "Voltar",
    "submit": "Enviar",
    "submitting": "Enviando...",
    "errorGeneric": "Algo deu errado. Por favor, tente novamente.",
    "step1": {
      "title": "Identificação e Contato",
      "name": "Nome completo",
      "whatsapp": "WhatsApp",
      "email": "E-mail",
      "namePlaceholder": "Seu nome completo",
      "whatsappPlaceholder": "(11) 99999-0000",
      "emailPlaceholder": "seu@email.com",
      "nameError": "Nome obrigatório",
      "whatsappError": "WhatsApp inválido",
      "emailError": "E-mail inválido"
    },
    "step2": {
      "title": "O Ambiente",
      "roomType": "Qual ambiente deseja transformar?",
      "roomTypePlaceholder": "Selecione...",
      "roomOptions": { "sala": "Sala", "quarto": "Quarto", "cozinha": "Cozinha", "escritorio": "Escritório", "consultorio": "Consultório", "outro": "Outro" },
      "roomTypeError": "Selecione o tipo de ambiente",
      "area": "Metragem aproximada (m²)",
      "floorPlan": "Planta baixa ou croqui (opcional)",
      "floorPlanHint": "PDF, PNG ou JPG — máx. 10MB",
      "photos": "Fotos ou vídeos do ambiente (opcional)",
      "photosHint": "Múltiplos arquivos — máx. 50MB no total",
      "fileTooLarge": "Arquivo excede o tamanho máximo",
      "fileInvalidType": "Tipo de arquivo não permitido"
    },
    "step3": {
      "title": "Estilo e Referências",
      "styles": "Qual estilo combina com você?",
      "styleOptions": { "minimalista": "Minimalista", "industrial": "Industrial", "escandinavo": "Escandinavo", "classico": "Clássico", "moderno": "Moderno" },
      "pinterest": "Link do Pinterest (opcional)",
      "pinterestPlaceholder": "https://pinterest.com/...",
      "mustHave": "O que não pode faltar no seu projeto?",
      "mustHavePlaceholder": "Ex: mesa de trabalho grande, iluminação quente...",
      "mustHaveHint": "Máx. 500 caracteres"
    },
    "step4": {
      "title": "Escopo e Investimento",
      "scopeType": "O que você busca?",
      "scopeOptions": { "consultoria": "Consultoria de cores e móveis", "projeto3d": "Projeto 3D detalhado", "reforma": "Reforma completa com acompanhamento" },
      "scopeTypeError": "Selecione o tipo de projeto",
      "urgency": "Qual a sua urgência?",
      "urgencyOptions": { "imediata": "Imediata", "3meses": "Daqui a 3 meses", "sondando": "Apenas sondando" },
      "budget": "Faixa de investimento na execução",
      "budgetOptions": { "ate10k": "Até R$ 10.000", "10a30k": "R$ 10.000 – R$ 30.000", "30a80k": "R$ 30.000 – R$ 80.000", "acima80k": "Acima de R$ 80.000" }
    },
    "success": {
      "title": "Obrigado!",
      "message": "Recebemos seu questionário e entraremos em contato em breve."
    }
  }
}
```

---

## Metadados da página

```ts
// Para cada locale:
title: "Questionário de Briefing — Carol Orofino"
description: "Preencha nosso questionário para que possamos entender melhor o seu projeto e preparar uma proposta personalizada."
robots: "noindex" // formulário interno, não precisa ser indexado
```

---

## Dependências a instalar

```bash
npm install resend @vercel/blob
```

---

## Variáveis de ambiente necessárias

| Variável | Uso | Onde configurar |
|----------|-----|-----------------|
| `RESEND_API_KEY` | Autenticação na API do Resend | Vercel project settings + `.env.local` |
| `BLOB_READ_WRITE_TOKEN` | Autenticação no Vercel Blob | Vercel project settings + `.env.local` |

O e-mail de destino (`carol@carolorofino.com.br`) é hardcoded no Server Action. Não há variável de ambiente para isso.

---

## Fora de escopo (versão 1)

- Confirmação automática por e-mail para o cliente
- Persistência de rascunho (localStorage ou servidor)
- Dashboard para Carol visualizar respostas
- Integração com CRM
- Retry automático em caso de falha de envio
