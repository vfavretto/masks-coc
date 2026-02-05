---
description: Como fazer deploy do frontend para GitHub Pages
---

# Deploy do Frontend para GitHub Pages

## Pré-requisitos

- Estar na branch `main`
- Todas as alterações commitadas

## Passos

// turbo

1. Verificar se está na branch correta:

```bash
git branch --show-current
```

// turbo 2. Build de produção:

```bash
npm run build
```

// turbo 3. Deploy para GitHub Pages:

```bash
npm run deploy
```

4. Verificar o deploy em: https://vfavretto.github.io/masks-coc

## Troubleshooting

### Erro de CORS

Se o frontend não conseguir se comunicar com o backend, verificar:

1. A URL do backend em `src/services/api.ts`
2. Se o backend está online: https://masks-coc-backend.onrender.com/health

### Erro 404 em rotas

O projeto usa React Router. Verificar se `vite.config.ts` tem a base configurada:

```ts
base: "/masks-coc/";
```
