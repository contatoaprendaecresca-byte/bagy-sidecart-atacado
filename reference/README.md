# Referência — snapshots da engenharia reversa

Cópias arquivadas do material analisado para criar esta versão. **Não são usados em
produção** — servem como backup e para comparação futura. A loja usa apenas `dist/`.

## Procedência

| Arquivo | Fonte | Capturado em |
|---|---|---|
| `original/bagy_sidecart_pro.js` | `https://cdn.jsdelivr.net/gh/eduvlemes/sideCart/bagy_sidecart_pro.js` | 2026-06-24 |
| `original/bagy_sidecart.css` | `https://cdn.jsdelivr.net/gh/eduvlemes/sideCart/bagy_sidecart.css` | 2026-06-24 |
| `loja-supervaidosa/sidecart-override.inline.js` | HTML inline de loja em produção (`supervaidosaatacado.com.br`) | 2026-06-24 |

> O override inline foi o que revelou o uso de `cartInfo.min_purchase` (campo da API
> Dooca). Ver `docs/engenharia-reversa.md`.

## Checksums (SHA-256)

```
ee4f8de722258ac646e9a7de9d7c304347459f31e01fa1b1d17a969c08cd4011  original/bagy_sidecart_pro.js
9dd27f88c21723bab4775638d0390ca5da32d3619ea052ff375ef1f30743ce94  original/bagy_sidecart.css
537b43f9294bf0d9746e284c296af7e343d53f75ade46c7b96287f73e07456e3  loja-supervaidosa/sidecart-override.inline.js
```

Reconferir:

```bash
shasum -a 256 reference/original/*.js reference/original/*.css reference/loja-supervaidosa/*.js
```
