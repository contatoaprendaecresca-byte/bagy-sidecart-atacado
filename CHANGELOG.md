# Changelog

## 1.1.0

Adoção da arquitetura **base + override** (espelha o padrão usado em produção, com risco
de comportamento mínimo).

- `src/aec-sidecart-base.js`: cópia fiel da lógica original (não alterar) + cabeçalho AEC.
- `src/aec-sidecart-override.js`: todas as melhorias (pedido mínimo da plataforma, classes
  próprias, acessibilidade, HTML limpo, configuração) redefinindo `placeContent`.
- Validação `window.sideCart` no override antes de sobrescrever (base obrigatória antes).
- Instalação via 3 arquivos (CSS → base → override), no campo Scripts da Bagy
  (Rodapé · Essencial · Tipo: Script).
- Removida a variante standalone (`aec-sidecart.js`) para evitar divergência.
- Teste de integração (sandbox) cobrindo: abaixo do mínimo, mínimo atingido, loja sem
  mínimo e carrinho vazio.

## 1.0.0

Primeira versão genérica do **Bagy SideCart Atacado** (APRENDA E CRESCE LTDA).

- Carrinho lateral reescrito e autossuficiente (sem dependência de CDN de terceiros).
- **Pedido mínimo lido automaticamente da plataforma** (`cartInfo.min_purchase`),
  funcionando em qualquer loja de atacado sem configuração.
- Camada de configuração opcional via `window.SIDECART_ATACADO` (textos, cores,
  valor fixo de pedido mínimo).
- Mensagem de pedido mínimo melhorada (rótulo + quanto falta), sem estilos inline.
- Classes próprias com prefixo `aec-sidecart-`.
- Estilo adaptável aos tokens de tema da loja (`var(--color-*)`, `var(--m-*)`).
- Aviso na página de produto configurável via `--aec-product-notice`
  (sem texto/loja fixos).
- Acessibilidade: `aria-label` nos botões e input de quantidade
  (`type=number`, `min=1`, `inputmode=numeric`).
- HTML do item e do subtotal reescrito (tags válidas e fechadas).
- `placeContent` instalado de forma defensiva (valida `window.sideCart`).
- Build minificado (terser + clean-css).

### Engenharia reversa

- Snapshots arquivados em `reference/`: arquivos públicos do CDN base e o override
  inline capturado de loja em produção (que revelou o uso de `cartInfo.min_purchase`).
- Guia de método em `docs/engenharia-reversa.md`.
