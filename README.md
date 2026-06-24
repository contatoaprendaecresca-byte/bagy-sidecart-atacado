# Bagy SideCart Atacado

Carrinho lateral (side cart) **genérico e reutilizável** para lojas de **atacado** na
plataforma **Bagy/Dooca**. Funciona em qualquer loja: o **pedido mínimo é lido
automaticamente da plataforma** — nenhuma loja precisa de configuração para funcionar.

> Mantido por **APRENDA E CRESCE LTDA** — CNPJ 39.827.887/0001-21.

## Recursos

- Lista de produtos com imagem, nome e variação.
- Aumentar / diminuir quantidade e remover item.
- Desconto, subtotal e melhor condição de pagamento.
- Embalagem para presente (quando o produto permite).
- Erros do carrinho e ações do rodapé.
- **Pedido mínimo de atacado** lido de `cartInfo.min_purchase` (definido no admin Dooca),
  com aviso de quanto falta para fechar o pedido.
- Acessível: `aria-label` nos botões e input de quantidade `type=number`/`inputmode`.
- Estilo adaptável: usa os tokens de tema da própria loja (`var(--color-*)`).

## Como aplicar (via script)

Mesmo método de hoje: incluir o CSS e o JS no tema da loja. **Sem configuração**, já
funciona — o pedido mínimo vem da plataforma.

### Via CDN (jsDelivr) — recomendado se o repositório for público

```html
<link rel="stylesheet" href="https://cdn.jsdelivr.net/gh/<org>/bagy-sidecart-atacado@1.0.0/dist/aec-sidecart.min.css">
<script src="https://cdn.jsdelivr.net/gh/<org>/bagy-sidecart-atacado@1.0.0/dist/aec-sidecart.min.js" charset="utf-8"></script>
```

### Colando no tema — se o repositório for privado

Cole o conteúdo de `dist/aec-sidecart.min.css` no CSS do tema e o de
`dist/aec-sidecart.min.js` dentro de uma tag `<script>`. Passo a passo completo em
[`docs/instalacao-bagy-dooca.md`](docs/instalacao-bagy-dooca.md).

> Ao adotar esta versão, **remova do tema** a referência ao carrinho externo antigo
> (o `bagy_sidecart_pro.js`/`.css` do CDN de terceiros e qualquer override inline),
> para não carregar dois carrinhos.

### Ordem recomendada de carregamento

1. CSS base do tema
2. CSS customizado da loja
3. CSS do Bagy SideCart Atacado
4. JS do Bagy SideCart Atacado

## Configuração (opcional)

Para personalizar textos, cores ou forçar um pedido mínimo fixo, defina
`window.SIDECART_ATACADO` **antes** do script. Veja todas as opções em
[`docs/configuracao.md`](docs/configuracao.md) e um exemplo em
[`examples/config-exemplo.html`](examples/config-exemplo.html).

```html
<script>
  window.SIDECART_ATACADO = {
    minPurchase: null, // null = usa o valor da plataforma (recomendado)
    messages: {
      minLabel: 'Pedido mínimo atacado:',
      minMissing: 'Adicione mais {value} para finalizar seu pedido.'
    }
  };
</script>
```

## Build

```bash
npm install
npm run build   # gera dist/ a partir de src/
```

> Edite sempre `src/` e rode o build. Nunca edite `dist/` à mão.

## Estrutura

```
bagy-sidecart-atacado/
├── README.md, CHANGELOG.md, LICENSE, LICENSE-NOTES.md, package.json
├── src/   → aec-sidecart.{js,css}        (fonte)
├── dist/  → aec-sidecart.min.{js,css}    (gerado)
├── docs/  → instalacao-bagy-dooca.md, configuracao.md, engenharia-reversa.md
├── examples/ → config-exemplo.html
└── reference/ → snapshots da engenharia reversa (não usado em produção)
```

## Engenharia reversa / independência

Esta versão é **autossuficiente**: não depende de nenhum CDN de terceiros. O histórico
e o método de captura estão em [`docs/engenharia-reversa.md`](docs/engenharia-reversa.md)
e os snapshots originais em [`reference/`](reference/).

## Licença

Uso reservado à APRENDA E CRESCE LTDA e às lojas por ela atendidas. Ver [`LICENSE`](LICENSE).
