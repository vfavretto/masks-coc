---
description: Como criar novos componentes padronizados no projeto
---

# Criação de Componentes

## Estrutura de Arquivos

Para componentes de UI (reutilizáveis):

```
src/components/ui/{component-name}.tsx
```

Para features específicas:

```
src/features/{feature-name}/components/{Component}.tsx
```

## Template de Componente

```tsx
import { forwardRef } from "react";
import { cn } from "@/lib/utils";

interface ComponentNameProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: "default" | "outline";
  size?: "sm" | "md" | "lg";
}

const ComponentName = forwardRef<HTMLDivElement, ComponentNameProps>(
  ({ className, variant = "default", size = "md", ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          "base-classes-here",
          variant === "outline" && "border border-primary/40",
          size === "sm" && "p-2 text-sm",
          size === "md" && "p-4 text-base",
          size === "lg" && "p-6 text-lg",
          className,
        )}
        {...props}
      />
    );
  },
);

ComponentName.displayName = "ComponentName";

export { ComponentName };
export type { ComponentNameProps };
```

## Checklist

- [ ] Usar cores do design system (ver `.agent/skills/design-system/SKILL.md`)
- [ ] Usar `forwardRef` para componentes de UI
- [ ] Exportar o type das props
- [ ] Usar `cn()` para merge de classes
- [ ] Transições de 300ms mínimo
- [ ] Testar em mobile
