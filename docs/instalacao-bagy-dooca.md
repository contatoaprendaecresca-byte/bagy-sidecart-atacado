# Instalação no tema Bagy/Dooca

Guia para aplicar o **Bagy SideCart Atacado** em qualquer loja de atacado.

## Pré-requisitos

- Acesso ao painel da loja na Bagy/Dooca.
- Pedido mínimo configurado no admin da loja (campo de pedido mínimo da Dooca) — é dele
  que o script lê o valor automaticamente.
- Arquivos de `dist/` (gere com `npm install && npm run build`).

---

## Onde inserir (UI da Bagy)

Painel Bagy → **Loja → Scripts** (área de "Inserir script"). Crie um script com:

| Campo | Valor |
|---|---|
| **Onde inserir na página** | Rodapé (recomendado) |
| **Categoria do script** | Essencial |
| **Tipo do script** | Script |

No campo de conteúdo, cole o bloco abaixo. É o **mesmo método** usado hoje — só muda o
conteúdo (mais curto e sem depender de terceiro).

---

## Arquitetura: base + override

Igual ao padrão usado hoje. São **três arquivos**, e a **ordem importa**:

1. **CSS** — `aec-sidecart.min.css`
2. **Base** — `aec-sidecart-base.min.js` (a lógica do carrinho)
3. **Override** — `aec-sidecart-override.min.js` (melhorias + pedido mínimo) — **depois da base**

A base é uma cópia fiel da lógica original (risco mínimo); todas as melhorias ficam no
override, que valida a base antes de aplicar.

## Opção A — Via CDN (repositório público) — recomendado

Cole este bloco no conteúdo do script (Rodapé · Essencial · Tipo: Script). Bloco pronto
também em [`examples/bagy-script-rodape.html`](../examples/bagy-script-rodape.html).

```html
<!-- START AEC SIDE CART -->
<link rel="stylesheet" href="https://cdn.jsdelivr.net/gh/contatoaprendaecresca-byte/bagy-sidecart-atacado@1.2.0/dist/aec-sidecart.min.css">
<script src="https://cdn.jsdelivr.net/gh/contatoaprendaecresca-byte/bagy-sidecart-atacado@1.2.0/dist/aec-sidecart-base.min.js" charset="utf-8"></script>
<script src="https://cdn.jsdelivr.net/gh/contatoaprendaecresca-byte/bagy-sidecart-atacado@1.2.0/dist/aec-sidecart-override.min.js" charset="utf-8"></script>
<!-- END AEC SIDE CART -->
```

> Fixe a versão (`@1.2.0`) para evitar quebras quando houver atualização. Para forçar
> atualização imediata em todas as lojas, use `@latest` (com cache do jsDelivr).

---

## Opção B — Colando o código (repositório privado / sem CDN)

Se preferir não usar CDN, no mesmo campo (Rodapé · Essencial · Tipo: Script) cole, **nesta ordem**:

1. `<style>` + o conteúdo de `dist/aec-sidecart.min.css`;
2. `<script>` + o conteúdo de `dist/aec-sidecart-base.min.js`;
3. `<script>` + o conteúdo de `dist/aec-sidecart-override.min.js`.

---

## Importante: remover o carrinho antigo

Antes (ou ao salvar este), **remova o script antigo** que carrega o carrinho de terceiro —
normalmente o bloco entre `<!-- START APX SIDE CART -->` e `<!-- END APX SIDE CART -->`.
Caso contrário, dois carrinhos são carregados e podem conflitar.

Esse bloco antigo contém:

- `<script src="...cdn.jsdelivr.net/gh/eduvlemes/sideCart/bagy_sidecart_pro.js">`
- O `<script>` inline que redefine `sideCart.placeContent`
- `<link ...bagy_sidecart.css>` e um `<style>` do `.alert-danger`

Tudo isso é substituído pelo bloco AEC (2 linhas).

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
