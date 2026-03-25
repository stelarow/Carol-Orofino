# Spec: VideoSection — Página Sobre

**Data:** 2026-03-25

## Contexto

Na página `/sobre`, adicionar um vídeo full-width entre a seção "Projetos sob medida" e a seção "Filosofia de Design". O vídeo roda automaticamente quando entra na viewport, sem controles, e ao terminar exibe uma frase tipográfica em seu lugar.

## Posição na Página

```
... Seção "Projetos sob medida" (Section 1b)
<SectionDivider />    ← o SectionDivider após Section 1b, linha ~100 do page.tsx original
<VideoSection />      ← novo
<SectionDivider />    ← existente (antes de Filosofia de Design)
... Seção "Filosofia de Design"
```

## Arquivo de Vídeo

1. Criar o diretório `public/videos/` caso não exista
2. Copiar o arquivo fonte para `public/videos/carol-reel.mp4`
- Fonte: `C:\Users\Alessandro\Downloads\Person_walks_with_202603251421.mp4`
- Resolução: 1080p, ~30fps

## Componente: `src/components/VideoSection.tsx`

**Client component** (`'use client'`).

### Estrutura JSX

```tsx
<section aria-hidden="true">
  <div className="relative w-full overflow-hidden aspect-video">
    <video
      ref={videoRef}
      src="/videos/carol-reel.mp4"
      muted
      playsInline
      preload="none"
      className="w-full h-full object-cover scale-105"
      onEnded={() => setEnded(true)}
    />
    {ended && <EndScreen />}
  </div>
</section>
```

### Comportamento

| Evento | Ação |
|--------|------|
| Componente monta | Cria `IntersectionObserver` com threshold 0.3 e observa `videoRef.current` |
| Vídeo entra na viewport | `videoRef.current?.play().catch(() => {})` — `.catch` silencia rejeições de autoplay |
| Vídeo sai da viewport | `videoRef.current?.pause()` |
| Vídeo termina (`onEnded`) | `setEnded(true)` |
| `ended === true` | Renderiza `<EndScreen>` com fade-in |
| Componente desmonta (`useEffect` cleanup) | `observer.disconnect()` |

Todos os acessos a `videoRef.current` dentro do callback do observer devem ter null-guard (`if (!videoRef.current) return`).

### Controles

- `controls` ausente — nenhum controle nativo visível
- `muted` obrigatório para autoplay funcionar nos browsers
- `playsInline` para iOS não abrir fullscreen automaticamente
- Não loopa (`loop` ausente)
- `aria-hidden="true"` na `<section>` — vídeo decorativo, screen readers devem ignorar

### Ocultação da Marca d'Água

- Container com `overflow-hidden`
- Vídeo com `scale-105` (Tailwind → `transform: scale(1.05)`)
- O zoom de 5% corta aproximadamente 2,5% da altura/largura renderizada em cada borda, suficiente para eliminar uma marca d'água no canto inferior direito que ocupa os ~2% externos do frame — independente da resolução de renderização

### Performance

- `preload="none"` — nenhum dado de rede até o `IntersectionObserver` disparar
- O observer dispara `play()` apenas quando o vídeo é visível, não no carregamento da página

### Tela de Encerramento (`<EndScreen>`)

- `absolute inset-0` sobre o container do vídeo
- Fundo: `bg-linen` (token `#edeae1`, mesma cor da seção ao redor)
- Animação: fade-in de 0.8s via Framer Motion:
  ```tsx
  <motion.div
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    transition={{ duration: 0.8 }}
    className="absolute inset-0 bg-linen flex items-center justify-center px-8"
  >
  ```
- Frase: `"Ambientes que revelam quem você é."`
  - Tipografia: `font-display text-5xl md:text-7xl font-light italic text-primary`
  - `text-primary` resolve para walnut `#86725a` (token CSS `--color-primary`)
  - Alinhamento: centralizado horizontal e vertical

## Integração em `sobre/page.tsx`

Adicionar import:
```tsx
import VideoSection from '@/components/VideoSection'
```

Inserir após o `<SectionDivider />` que sucede a seção "Projetos sob medida" (Section 1b, linha ~100 no arquivo atual):

```tsx
<SectionDivider />
<VideoSection />
<SectionDivider />

{/* Section 2 — Filosofia de Design */}
```

## Dependências

- Framer Motion — já presente no projeto
- Nenhuma nova dependência necessária

## Fora do Escopo

- Legendas ou transcrição
- Versão mobile com vídeo diferente
- Controles de acessibilidade além de `aria-hidden`
