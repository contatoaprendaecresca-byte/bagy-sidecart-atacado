# Engenharia reversa — como esta versão foi obtida

Este projeto nasceu da análise de um carrinho lateral de terceiro, para que a
**APRENDA E CRESCE LTDA** tenha uma versão própria, independente e reutilizável, sem
depender de quem desenvolveu o original.

O código é client-side e servido aberto (sem ofuscação), então "engenharia reversa" aqui
foi: **capturar → entender → reescrever**.

## O que foi encontrado

A loja analisada carregava **duas camadas**:

1. **Base pública (CDN de terceiro):**
   - `cdn.jsdelivr.net/gh/eduvlemes/sideCart/bagy_sidecart_pro.js`
   - `cdn.jsdelivr.net/gh/eduvlemes/sideCart/bagy_sidecart.css`
   Esta base **não** tinha pedido mínimo.

2. **Override inline no tema da loja** (capturado em `reference/loja-supervaidosa/`):
   redefinia `sideCart.placeContent` para adicionar o bloco de pedido mínimo, lendo
   **`sideCart.cartInfo.min_purchase`** — um campo que vem da **API da Dooca**:

   ```js
   sideCart.cartInfo.min_purchase > 0 && sideCart.cartInfo.subtotal < sideCart.cartInfo.min_purchase
     ? `Pedido mínimo: ... Faltam ...` : ``
   ```

### Conclusão-chave

O pedido mínimo **não é hardcoded** — vem da plataforma, por loja. Por isso esta versão
genérica lê `cartInfo.min_purchase` automaticamente e funciona em **qualquer** loja de
atacado Dooca, sem valor fixo no código.

## Mapa de dependências

| Dependência | De onde vem | Risco |
|---|---|---|
| `jQuery` | Plataforma Bagy/Dooca | Nenhum |
| `window.dooca` (shop_id) | Plataforma | Nenhum |
| `window.shop_ctx` (api_checkout_url) | Plataforma | Nenhum |
| `window._dcs.Cookies` | Plataforma | Nenhum |
| `cartInfo.min_purchase` | Plataforma (API de carrinho) | Nenhum |
| **JS/CSS do carrinho** | Era do terceiro → **agora é nosso** | Eliminado |

## Como recapturar / comparar no futuro

```bash
# Base pública
curl -sL "https://cdn.jsdelivr.net/gh/eduvlemes/sideCart/bagy_sidecart_pro.js" -o /tmp/base.js
diff reference/original/bagy_sidecart_pro.js /tmp/base.js

# O que uma loja carrega ao vivo (use User-Agent de navegador; lojas bloqueiam curl puro)
curl -sL "https://SUA-LOJA.com.br" -H "User-Agent: Mozilla/5.0 ... Chrome/126 Safari/537.36" -o /tmp/loja.html
grep -ioE "sidecart|min_purchase|jsdelivr[^\"']*" /tmp/loja.html | sort -u
```

Para inspecionar o que é carregado e de onde: DevTools do navegador (F12) → aba
**Network** → filtrar por `sidecart`.

## Integridade dos snapshots

Os arquivos arquivados em `reference/` possuem checksums registrados em
`reference/README.md`.

## Legitimidade

- Arquivos servidos publicamente, sem ofuscação e sem aviso de licença/copyright
  (verificado em 2026-06-24 — ver `LICENSE-NOTES.md`).
- Esta é uma **reescrita adaptada e genérica**, não uma redistribuição do original.
- Caso o autor publique uma licença depois, o crédito será preservado em `LICENSE-NOTES.md`.
