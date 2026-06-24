# Configuração

O script funciona **sem nenhuma configuração** — o pedido mínimo vem da plataforma
(`cartInfo.min_purchase`, definido no admin Dooca da loja). A configuração abaixo é
**opcional**, para personalizar textos, cores ou forçar valores.

## Como configurar

Defina `window.SIDECART_ATACADO` **antes** de carregar os scripts (base + override):

```html
<script>
  window.SIDECART_ATACADO = {
    locale: 'pt-BR',
    currency: 'BRL',
    minPurchase: null,
    messages: {
      header: 'Meu Carrinho',
      back: 'Continuar Comprando',
      next: 'Finalizar Compra',
      empty: 'Ops... seu carrinho está vazio!',
      minLabel: 'Pedido mínimo atacado:',
      minMissing: 'Adicione mais {value} para finalizar seu pedido.',
      minReached: 'Pedido mínimo atingido. Você já pode finalizar! ✓',
      discount: 'Você ganhou {value} de desconto',
      giftWrap: 'Embalar para presente (+ {value})',
      cartRule: 'Revise seu carrinho! Alguma regra está impedindo a finalização da compra.'
    }
  };
</script>
<script src="https://cdn.jsdelivr.net/gh/contatoaprendaecresca-byte/bagy-sidecart-atacado@1.3.0/dist/aec-sidecart-base.min.js"></script>
<script src="https://cdn.jsdelivr.net/gh/contatoaprendaecresca-byte/bagy-sidecart-atacado@1.3.0/dist/aec-sidecart-override.min.js"></script>
```

> A configuração (`window.SIDECART_ATACADO`) deve vir **antes** dos scripts; e o
> override deve vir **depois** da base.

## Opções

| Opção | Padrão | Descrição |
|---|---|---|
| `locale` | `'pt-BR'` | Locale para formatação de moeda. |
| `currency` | `'BRL'` | Moeda usada na formatação. |
| `minPurchase` | `null` | `null` = usa o valor da plataforma (`cartInfo.min_purchase`). Um número (ex.: `400`) **força** um mínimo fixo, ignorando a plataforma. |
| `messages.header` | `'Meu Carrinho'` | Título do carrinho. |
| `messages.back` | `'Continuar Comprando'` | Botão voltar. |
| `messages.next` | `'Finalizar Compra'` | Botão finalizar. |
| `messages.empty` | `'Ops... seu carrinho está vazio!'` | Carrinho vazio. |
| `messages.minLabel` | `'Pedido mínimo atacado:'` | Rótulo do pedido mínimo. |
| `messages.minMissing` | `'Adicione mais {value} para finalizar seu pedido.'` | Quanto falta. `{value}` = valor restante. |
| `messages.minReached` | `'Pedido mínimo atingido...'` | Mensagem ao atingir o mínimo. `''` oculta o aviso. |
| `messages.discount` | `'Você ganhou {value} de desconto'` | Selo de desconto do item. `{value}` = desconto. |
| `messages.giftWrap` | `'Embalar para presente (+ {value})'` | Embalagem para presente. `{value}` = preço. |
| `messages.cartRule` | `'Revise seu carrinho!...'` | Erro genérico de regra do carrinho. |

> Placeholders `{value}` são substituídos pelo script. Não remova-os das mensagens
> que os utilizam.

## Personalização visual (CSS)

O estilo usa os tokens do tema da loja, então as cores acompanham a marca
automaticamente. Para ajustes finos, sobrescreva as variáveis no CSS do tema:

```css
:root {
  /* Aviso na página de produto (ative com o texto desejado) */
  --aec-product-notice: "Site Atacado • Pedido mínimo de R$ 400,00";
  --aec-product-notice-mobile: "Atacado • Pedido mínimo R$ 400,00";

  /* Cores do aviso de pedido mínimo (opcional) */
  --aec-highlight: var(--color-highlight);
  --aec-danger-bg: #f6e8e8;
  --aec-danger-border: #ec8787;
}
```

> O aviso na página de produto fica oculto por padrão (texto `"Atacado"` neutro).
> Defina `--aec-product-notice` com o texto da loja para exibi-lo.
