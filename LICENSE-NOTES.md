# License Notes

Mantenedor: **APRENDA E CRESCE LTDA** — CNPJ 39.827.887/0001-21.

Este projeto é uma **reescrita independente e genérica** de um carrinho lateral
(side cart) para a plataforma **Bagy/Dooca**, destinada a lojas de atacado.

## Origem / engenharia reversa

A base de referência foi um carrinho lateral servido publicamente via CDN, somado a
um *override* inline observado em uma loja em produção. Ambos foram analisados,
arquivados em `reference/` e reescritos do zero. Nenhuma loja específica está embutida
no código — o comportamento é configurável e o pedido mínimo é lido da plataforma.

Fontes analisadas:

- https://cdn.jsdelivr.net/gh/eduvlemes/sideCart/bagy_sidecart_pro.js
- https://cdn.jsdelivr.net/gh/eduvlemes/sideCart/bagy_sidecart.css
- Override inline capturado de loja em produção (ver `reference/loja-supervaidosa/`).

## Autoria / licença das fontes

Na data da análise (2026-06-24), **nenhum dos arquivos de referência continha cabeçalho
de licença, aviso de copyright ou indicação explícita de autoria**. Caso o autor original
(`eduvlemes`) publique posteriormente uma licença ou exija crédito, este arquivo deve ser
atualizado para preservar a atribuição.

## Natureza desta versão

- Reescrita (namespace, helpers, configuração, separação de responsabilidades).
- Genérica e reutilizável em qualquer loja de atacado Bagy/Dooca.
- Pedido mínimo lido automaticamente de `sideCart.cartInfo.min_purchase` (API da plataforma).
- Sem nomes de loja, valores ou textos fixos no código (tudo configurável).
- HTML válido, sem estilos inline, classes próprias com prefixo `aec-sidecart-`.

A licença de uso deste software está em `LICENSE`.
