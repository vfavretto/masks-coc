---
name: Design System Lovecraftiano
description: Diretrizes e padrões para criar componentes UI no estilo Neo-Noir Lovecraftiano do projeto Masks of Nyarlathotep
---

# Design System - Masks of Nyarlathotep

## Filosofia de Design

O design do site captura a atmosfera sombria e misteriosa da campanha de Call of Cthulhu, combinando elementos:

- **Neo-Noir**: Contrastes fortes, sombras profundas, iluminação dramática
- **Horror Cósmico**: Sensação de antiguidade, mistério e vastidão desconhecida
- **Era 1920s**: Toques de Art Déco e tipografia da época

## Paleta de Cores

### Cores Primárias

```css
--color-primary: #c9a55c; /* Ouro envelhecido - ação principal */
--color-primary-dark: #a88940; /* Ouro escuro - hover states */
--color-primary-muted: #c9a55c20; /* Ouro transparente - backgrounds sutis */
```

### Cores de Base

```css
--color-background: #0a0908; /* Preto profundo - fundo principal */
--color-surface: #1a1815; /* Cinza escuro - cards e superfícies */
--color-surface-elevated: #252220; /* Superfície elevada - modais */
--color-border: #3d3833; /* Bordas sutis */
--color-border-accent: #c9a55c40; /* Bordas com brilho dourado */
```

### Cores de Texto

```css
--color-text: #e8e4dc; /* Texto principal - tom de pergaminho */
--color-text-muted: #9a958a; /* Texto secundário */
--color-text-accent: #c9a55c; /* Texto de destaque */
```

### Cores Semânticas

```css
--color-danger: #a33939; /* Vermelho sangue - ações destrutivas */
--color-warning: #b87333; /* Bronze - alertas */
--color-success: #4a7c4e; /* Verde musgo - confirmações */
--color-info: #5a6a7a; /* Cinza azulado - informações */
```

## Tipografia

### Fontes

- **Display/Títulos**: `Playfair Display` - serifada elegante para headings
- **Corpo**: `Crimson Pro` - serifada legível para textos longos
- **Monospace**: `JetBrains Mono` - para código ou dados técnicos

### Hierarquia

```css
.heading-1 {
  font-size: 2.5rem;
  font-weight: 700;
  font-family: "Playfair Display";
}
.heading-2 {
  font-size: 2rem;
  font-weight: 600;
  font-family: "Playfair Display";
}
.heading-3 {
  font-size: 1.5rem;
  font-weight: 600;
  font-family: "Playfair Display";
}
.body {
  font-size: 1rem;
  font-family: "Crimson Pro";
  line-height: 1.7;
}
.caption {
  font-size: 0.875rem;
  color: var(--color-text-muted);
}
```

## Componentes

### Botões

```tsx
// Variantes disponíveis
<Button variant="primary">Ação Principal</Button>  // Fundo dourado
<Button variant="secondary">Secundário</Button>    // Borda dourada, fundo transparente
<Button variant="ghost">Sutil</Button>              // Sem borda, apenas texto
<Button variant="destructive">Deletar</Button>      // Vermelho sangue
```

### Cards

Todos os cards devem ter:

- Fundo semi-transparente com backdrop-blur
- Borda sutil que brilha ao hover
- Sombra suave para profundidade

```tsx
<Card className="hover:border-primary/60 transition-all duration-300">
  <CardHeader>
    <CardTitle>Título Misterioso</CardTitle>
  </CardHeader>
  <CardContent>Conteúdo do card...</CardContent>
</Card>
```

### Inputs

```tsx
<Input
  placeholder="Buscar nos tomos antigos..."
  className="bg-surface border-border focus:border-primary focus:ring-primary/20"
/>
```

## Efeitos Especiais

### Texture Overlay

Adicionar textura de papel envelhecido sobre seções importantes:

```tsx
<div className="relative">
  <div className="absolute inset-0 bg-[url('/texture-paper.png')] opacity-5 pointer-events-none" />
  {/* conteúdo */}
</div>
```

### Flicker Effect

Para elementos que devem ter um efeito de luz piscando (velas, lanternas):

```tsx
useEffect(() => {
  const interval = setInterval(() => {
    element.style.opacity = Math.random() < 0.97 ? "1" : "0.7";
  }, 2000);
  return () => clearInterval(interval);
}, []);
```

### Glow Border

Para elementos importantes no hover:

```css
.glow-border:hover {
  box-shadow: 0 0 20px rgba(201, 165, 92, 0.2);
  border-color: rgba(201, 165, 92, 0.6);
}
```

## Diretrizes de Implementação

1. **Nunca usar cores puras** - Sempre usar tons dessaturados
2. **Preferir bordas sutis** - Usar opacidade em vez de cores sólidas
3. **Animações lentas** - Transições de 300-500ms para sensação de peso
4. **Espaçamento generoso** - O vazio é parte da atmosfera
5. **Imagens com overlay escuro** - Todas as imagens devem ter overlay para manter contraste

## Uso com shadcn/ui

Ao usar componentes do shadcn/ui, sempre sobrescrever com as variáveis CSS do tema:

```tsx
// Em components.json do shadcn
{
  "style": "default",
  "tailwind": {
    "config": "tailwind.config.js",
    "css": "src/index.css",
    "baseColor": "zinc",
    "cssVariables": true
  }
}
```
