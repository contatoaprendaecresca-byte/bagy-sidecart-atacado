/*!
 * Bagy SideCart Atacado — OVERRIDE
 * Melhorias sobre a base (aec-sidecart-base.js).
 *
 * © APRENDA E CRESCE LTDA — CNPJ 39.827.887/0001-21
 *
 * Carregue este arquivo DEPOIS de aec-sidecart-base.js.
 * Espelha o padrão usado em produção (redefinir sideCart.placeContent),
 * acrescentando:
 *   - Pedido mínimo de atacado lido da plataforma (cartInfo.min_purchase).
 *   - Classes próprias (aec-sidecart-) e remoção de estilos inline.
 *   - Acessibilidade (aria-label, input type=number/min/inputmode).
 *   - HTML válido (tags fechadas) no item e no subtotal.
 *   - Textos/cores configuráveis via window.SIDECART_ATACADO.
 *
 * Versão: 1.1.0
 */
(function (window) {
  'use strict';

  /* ----------------------------------------------------------------------
   * Configuração opcional (window.SIDECART_ATACADO) com defaults.
   * -------------------------------------------------------------------- */
  var DEFAULTS = {
    locale: 'pt-BR',
    currency: 'BRL',
    // null = usa o pedido mínimo da plataforma (cartInfo.min_purchase). [recomendado]
    // número = força um valor fixo.
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

  function deepMerge(base, extra) {
    var out = {}, k;
    for (k in base) { if (base.hasOwnProperty(k)) { out[k] = base[k]; } }
    if (extra) {
      for (k in extra) {
        if (extra.hasOwnProperty(k)) {
          out[k] = (base[k] && typeof base[k] === 'object' && typeof extra[k] === 'object')
            ? deepMerge(base[k], extra[k])
            : extra[k];
        }
      }
    }
    return out;
  }

  var CONFIG = deepMerge(DEFAULTS, window.SIDECART_ATACADO || {});

  function fmt(value) {
    return Number(value || 0).toLocaleString(CONFIG.locale, { style: 'currency', currency: CONFIG.currency });
  }
  function tpl(str, value) {
    return String(str).replace('{value}', value);
  }

  /* ----------------------------------------------------------------------
   * Requisito: validar window.sideCart (a base) antes de sobrescrever.
   * -------------------------------------------------------------------- */
  if (!window.sideCart) {
    console.error('[Bagy SideCart Atacado] Base não encontrada (window.sideCart). ' +
      'Carregue aec-sidecart-base.js ANTES do override.');
    return;
  }

  var $ = window.jQuery;
  var sideCart = window.sideCart;
  sideCart.config = CONFIG;

  // Aplica textos configuráveis (a base usa sideCart.lang no buildTemplate,
  // que roda no DOMContentLoaded — depois deste arquivo ser interpretado).
  sideCart.lang = sideCart.lang || {};
  sideCart.lang.header = CONFIG.messages.header;
  sideCart.lang.back = CONFIG.messages.back;
  sideCart.lang.next = CONFIG.messages.next;
  sideCart.lang.empty = CONFIG.messages.empty;

  /* ----------------------------------------------------------------------
   * Fechamento robusto do carrinho
   * "Continuar Comprando" (.btn-back) e o X do topo fecham o carrinho.
   * Handler delegado no document (independe da ordem de inicialização da base).
   * -------------------------------------------------------------------- */
  $(document).on('click', '#sideCart .btn-back, #sideCart .sideCart-header button', function (e) {
    e.preventDefault();
    $('body').removeClass('sideCart-open');
  });

  /* ----------------------------------------------------------------------
   * Pedido mínimo de atacado (lido da plataforma)
   * -------------------------------------------------------------------- */
  sideCart.minPurchaseValue = function () {
    if (CONFIG.minPurchase != null) {
      return Number(CONFIG.minPurchase) || 0;
    }
    return Number(sideCart.cartInfo && sideCart.cartInfo.min_purchase) || 0;
  };

  sideCart.minPurchaseRemaining = function () {
    var subtotal = Number(sideCart.cartInfo && sideCart.cartInfo.subtotal) || 0;
    return Math.max(0, sideCart.minPurchaseValue() - subtotal);
  };

  sideCart.renderMinPurchase = function () {
    var min = sideCart.minPurchaseValue();
    if (min <= 0) { return ''; } // loja sem pedido mínimo definido

    var remaining = sideCart.minPurchaseRemaining();
    var reached = remaining <= 0;

    if (reached && !CONFIG.messages.minReached) { return ''; }

    var line = reached
      ? CONFIG.messages.minReached
      : tpl(CONFIG.messages.minMissing,
          '<span class="aec-sidecart-min-purchase__missing">' + fmt(remaining) + '</span>');

    return '<div class="aec-sidecart-min-purchase' + (reached ? ' aec-sidecart-min-purchase--ok' : '') + '">' +
      '<small>' + CONFIG.messages.minLabel + ' ' +
      '<span class="aec-sidecart-min-purchase__value">' + fmt(min) + '</span>' +
      '<br>' + line + '</small></div>';
  };

  /* ----------------------------------------------------------------------
   * Render do item (HTML válido, sem estilo inline, com aria-labels)
   * -------------------------------------------------------------------- */
  function renderItem(i) {
    var giftWrap = i.gift_wrapping_accept
      ? '<small class="d-flex mx-3 align-items-center mt-3">' +
          '<input type="checkbox" value="true" ' + (i.has_gift_wrapping ? 'checked ' : '') +
          'data-id="' + i.variation_id + '" class="mr-1" name="gift_wrapping_accept" aria-label="Embalar para presente">' +
          tpl(CONFIG.messages.giftWrap, fmt(i.gift_wrapping_price * i.quantity)) + '</small>'
      : '';

    return '' +
      '<div class="row sideCart-item ml-0">' +
        '<div class="col-3"><img class="img-responsive w-100" src="' + i.image + '" alt="' + (i.name || '') + '"></div>' +
        '<div class="col-9 title">' +
          '<div class="row">' +
            '<div class="col name">' + i.name + '</div>' +
            '<div class="col-auto">' +
              '<button class="sideCart-item-delete" type="button" data-id="' + i.variation_id + '" aria-label="Remover produto do carrinho">' +
                '<i class="h-sc-color material-icons md-36">delete</i></button>' +
            '</div>' +
          '</div>' +
          (i.variation ? '<small class="d-block mt-3">' + i.variation + '</small>' : '') +
          (i.discount > 0
            ? '<span class="aec-sidecart-item__discount d-flex align-items-center font-weight-bold mb-2 mt-2">' +
                '<i class="h-sc-color material-icons md-36 mr-1">check</i> ' + tpl(CONFIG.messages.discount, fmt(i.discount)) + '</span>'
            : '') +
          sideCart.showGroupList(i) +
          '<div class="row align-items-center">' +
            '<div class="col">' +
              '<div class="d-flex sideCart-item-quantity">' +
                '<button class="sideCart-item-remove" type="button" aria-label="Diminuir quantidade">' +
                  '<i class="h-sc-color material-icons md-36">remove</i></button>' +
                '<input data-id="' + i.variation_id + '" name="customCartQuantity" type="number" min="1" inputmode="numeric" ' +
                  'value="' + i.quantity + '" aria-label="Quantidade do produto">' +
                '<button class="sideCart-item-add" type="button" aria-label="Aumentar quantidade">' +
                  '<i class="h-sc-color material-icons md-36">add</i></button>' +
              '</div>' +
            '</div>' +
            '<div class="col-auto">' +
              '<div class="align-items-center d-flex flex-column">' +
                (i.subtotal > i.total ? '<s><small>' + sideCart.itemPrice(i) + '</small></s>' : '') +
                '<strong>' + sideCart.itemSalePrice(i) + '</strong>' +
              '</div>' +
            '</div>' +
          '</div>' +
        '</div>' +
      '</div>' +
      giftWrap +
      '<small class="d-flex align-items-center">' + sideCart.showErrors(i) + '</small>' +
      '<hr class="my-4">';
  }

  function renderSubtotal() {
    return '' +
      '<div class="row justify-content-between sideCart-subtotal">' +
        '<div class="col"><span>Subtotal</span></div>' +
        '<div class="col text-right">' +
          '<small>' + fmt(sideCart.cartInfo.subtotal) + '</small>' +
          '<strong>' + sideCart.findBestPaymentOptions(sideCart.cartInfo.payments) + '</strong>' +
        '</div>' +
      '</div>';
  }

  /* ----------------------------------------------------------------------
   * Override do placeContent (mesmo ponto de extensão usado hoje)
   * -------------------------------------------------------------------- */
  sideCart.placeContent = function () {
    var $content = $('#sideCart .sideCart-content').empty();

    if (sideCart.cartInfo.isEmpty) {
      $('<p class="empty">' + sideCart.lang.empty + '</p>').appendTo($content);
      $('#sideCart .sideCart-values, #sideCart .sideCart-actions').empty();
    } else {
      $.each(sideCart.cartInfo.items, function (k, i) {
        $(renderItem(i)).appendTo($content);
      });

      $('#sideCart .sideCart-values')
        .empty()
        .append(renderSubtotal())
        .append(sideCart.renderMinPurchase());

      sideCart.updateFooterActions();
    }

    sideCart.updateFooterActions();
    $('body').removeClass('updatingSideCart');
  };
})(window);
