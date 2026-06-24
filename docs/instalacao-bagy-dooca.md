# Instalação no tema Bagy/Dooca

Guia para aplicar o **Bagy SideCart Atacado** em qualquer loja de atacado.

## Pré-requisitos

- Acesso ao painel da loja na Bagy/Dooca.
- Pedido mínimo configurado no admin da loja (campo de pedido mínimo da Dooca) — é dele
  que o script lê o valor automaticamente.
- Arquivos de `dist/` (gere com `npm install && npm run build`).

---

## Opção A — Via CDN (repositório público)

Mesmo método do carrinho externo antigo. Adicione no tema:

```html
<!-- 3. CSS do SideCart -->
<link rel="stylesheet" href="https://cdn.jsdelivr.net/gh/<org>/bagy-sidecart-atacado@1.0.0/dist/aec-sidecart.min.css">

<!-- 4. JS do SideCart -->
<script src="https://cdn.jsdelivr.net/gh/<org>/bagy-sidecart-atacado@1.0.0/dist/aec-sidecart.min.js" charset="utf-8"></script>
```

> Fixe a versão (`@1.0.0`) para evitar quebras quando houver atualização. Para forçar
> atualização imediata em todas as lojas, use `@latest` (com cache do jsDelivr).

---

## Opção B — Colando no tema (repositório privado)

1. Painel Bagy → **Loja → Tema → Editar código**.
2. Cole o conteúdo de `dist/aec-sidecart.min.css` **depois** do CSS do tema.
3. Cole o conteúdo de `dist/aec-sidecart.min.js` dentro de uma tag `<script>` no rodapé.
4. Salve e publique.

---

## Importante: remover o carrinho antigo

Se a loja já usava um carrinho externo (ex.: `bagy_sidecart_pro.js` de terceiro) **e/ou**
um override inline de pedido mínimo no tema, **remova-os**. Caso contrário, dois carrinhos
serão carregados e podem conflitar.

Procure no tema e remova:

- `<script src="...cdn.jsdelivr.net/gh/eduvlemes/sideCart/...">`
- `<link ...bagy_sidecart.css>`
- Qualquer bloco inline que redefina `sideCart.placeContent`.

---

## Configuração opcional

Por padrão **não precisa de nada**. Para personalizar textos/cores ou forçar um pedido
mínimo fixo, defina `window.SIDECART_ATACADO` antes do script — ver
[`configuracao.md`](configuracao.md).

Para exibir o aviso na página de produto, defina no CSS do tema:

```css
:root {
  --aec-product-notice: "Site Atacado • Pedido mínimo de R$ 400,00";
  --aec-product-notice-mobile: "Atacado • Pedido mínimo R$ 400,00";
}
```

---

## Validação pós-instalação

- [ ] O carrinho lateral abre ao clicar no ícone do carrinho.
- [ ] Adicionar um produto abre o carrinho automaticamente.
- [ ] Imagem, nome e variação aparecem.
- [ ] Botões **+ / −** alteram a quantidade; lixeira remove.
- [ ] Desconto, subtotal e melhor condição de pagamento aparecem.
- [ ] Embalagem para presente aparece quando o produto permite.
- [ ] O aviso de **pedido mínimo** aparece quando a loja tem mínimo definido e o subtotal
      está abaixo dele (mostra quanto falta).
- [ ] Não há dois carrinhos abrindo (carrinho antigo removido).

Se algo falhar, abra o console (F12) e procure mensagens `[Bagy SideCart Atacado]`.
