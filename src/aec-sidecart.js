/*!
 * Bagy SideCart Atacado
 * Carrinho lateral para lojas de atacado em Bagy/Dooca.
 *
 * © APRENDA E CRESCE LTDA — CNPJ 39.827.887/0001-21
 * Uso interno e em lojas atendidas pela Aprenda e Cresce.
 *
 * Genérico e reutilizável: o pedido mínimo é lido automaticamente da
 * plataforma (sideCart.cartInfo.min_purchase). Nenhuma loja precisa de
 * configuração para funcionar — basta incluir o script.
 *
 * Configuração opcional via window.SIDECART_ATACADO (ver docs/configuracao.md).
 *
 * Versão: 1.0.0
 */
(function (window) {
  'use strict';

  /* ----------------------------------------------------------------------
   * Configuração (com defaults). A loja pode sobrescrever definindo
   * window.SIDECART_ATACADO ANTES de carregar este script.
   * -------------------------------------------------------------------- */
  var DEFAULTS = {
    locale: 'pt-BR',
    currency: 'BRL',
    /**
     * Pedido mínimo:
     *   null  -> usa o valor da plataforma (cartInfo.min_purchase). [recomendado]
     *   número -> força um valor fixo (ex.: 400), ignorando a plataforma.
     */
    minPurchase: null,
    messages: {
      header: 'Meu Carrinho',
      back: 'Continuar Comprando',
      next: 'Finalizar Compra',
      empty: 'Ops... seu carrinho está vazio!',
      minLabel: 'Pedido mínimo atacado:',
      // {value} = quanto falta
      minMissing: 'Adicione mais {value} para finalizar seu pedido.',
      // mensagem ao atingir o mínimo ('' = oculta)
      minReached: 'Pedido mínimo atingido. Você já pode finalizar! ✓',
      // {value} = valor do desconto
      discount: 'Você ganhou {value} de desconto',
      // {value} = preço da embalagem
      giftWrap: 'Embalar para presente (+ {value})',
      cartRule: 'Revise seu carrinho! Alguma regra está impedindo a finalização da compra.'
    }
  };

  function deepMerge(base, extra) {
    var out = {};
    var k;
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

  /* jQuery é resolvido no boot (Bagy/Dooca expõe window.jQuery globalmente). */
  var $ = window.jQuery;

  /* ----------------------------------------------------------------------
   * Namespace do carrinho (mantém a API original do SideCart)
   * -------------------------------------------------------------------- */
  var sideCart = window.sideCart || {};
  window.sideCart = sideCart;

  sideCart.config = CONFIG;
  sideCart.cartInfo = sideCart.cartInfo || { isEmpty: true };
  sideCart.lang = {
    header: CONFIG.messages.header,
    back: CONFIG.messages.back,
    next: CONFIG.messages.next,
    empty: CONFIG.messages.empty
  };

  /* ----------------------------------------------------------------------
   * Melhor condição de pagamento
   * -------------------------------------------------------------------- */
  sideCart.findBestPaymentOptions = function (paymentOptions) {
    var bestCashOption = { markup: 99999 };
    var bestInstallmentOption = { parcels_no_interest: 0 };

    (paymentOptions || []).forEach(function (option) {
      if ((option.method === 'pix' || option.method === 'billet') && option.markup < bestCashOption.markup) {
        bestCashOption = option;
      }
      if (option.method === 'creditcard' && option.parcels_no_interest > bestInstallmentOption.parcels_no_interest) {
        bestInstallmentOption = option;
      }
    });

    var html = '';

    if (bestCashOption.installments && bestCashOption.installments.length > 0) {
      var cash = bestCashOption.installments[0];
      html += '<div class="d-flex flex-column align-items-end justify-content-end mb-2">' +
        fmt(cash.total) +
        (cash.discount_percentage > 0
          ? ' <small class="d-block">à vista com ' + Math.ceil(cash.discount_percentage) + '% OFF</small>'
          : '') +
        '</div>';
    }

    if (bestInstallmentOption.installments && bestInstallmentOption.installments.length > 0) {
      var parcels = bestInstallmentOption.parcels_no_interest;
      var parcel = bestInstallmentOption.installments[parcels - 1];
      html += '<div class="d-flex align-items-center justify-content-end">' +
        '<small class="font-weight-bold">em até ' + parcels + 'x de ' + fmt(parcel.parcel_price) + '</small></div>';
    }

    return html;
  };

  /* ----------------------------------------------------------------------
   * Bind de eventos + inicialização
   * -------------------------------------------------------------------- */
  sideCart.run = function () {
    $('body').on('click', 'ajax-nav-cart a, .cart-redirect-checkout', function (e) {
      e.preventDefault();
      $('body').toggleClass('sideCart-open');
    });

    $('body').on('click', '#sideCart .sideCart-header button, #sideCart .sideCart-footer .sideCart-actions button', function (e) {
      e.preventDefault();
      $('body').removeClass('sideCart-open');
    });

    $('body').on('click', '.sideCart-content .sideCart-item-delete', function () {
      var variationId = $(this).attr('data-id');
      sideCart.cartInfo.items = sideCart.cartInfo.items.filter(function (el) {
        return el.variation_id != variationId;
      });
      sideCart.cartUpdate();
    });

    $('body').on('click', '.sideCart-content .sideCart-item-quantity button', function () {
      var $input = $(this).closest('.sideCart-item-quantity').find('input');
      var variationId = $input.attr('data-id');
      var quantity = parseInt($input.val(), 10);
      var updateItem = sideCart.cartInfo.items.find(function (el) {
        return el.variation_id == variationId;
      });

      quantity = $(this).hasClass('sideCart-item-add') ? quantity + 1 : quantity - 1;

      if (updateItem) {
        updateItem.quantity = quantity;
        sideCart.cartUpdate();
      }
    });

    $('body').on('change', '.sideCart-content [name="gift_wrapping_accept"]', function () {
      var variationId = $(this).attr('data-id');
      var status = $(this).is(':checked');
      var updateItem = sideCart.cartInfo.items.find(function (el) {
        return el.variation_id == variationId;
      });
      if (updateItem) {
        updateItem.has_gift_wrapping = status;
        sideCart.cartUpdate();
      }
    });

    sideCart.buildTemplate();
    sideCart.getCart();

    $(document).ajaxComplete(function (event, xhr, settings) {
      if (settings.url && settings.url.includes('/add')) {
        sideCart.getCart();
        $('body').addClass('sideCart-open');
      }
    });
  };

  /* ----------------------------------------------------------------------
   * Template base
   * -------------------------------------------------------------------- */
  function templateMarkup() {
    return '' +
      '<div class="loading"><div class="lds-ellipsis"><div></div><div></div><div></div><div></div></div></div>' +
      '<div class="sideCart-header"><span>' + sideCart.lang.header + '</span>' +
        '<button type="button" aria-label="Fechar carrinho"><i class="h-sc-color material-icons md-36">close</i></button></div>' +
      '<div class="sideCart-content"></div>' +
      '<div class="sideCart-footer"><hr>' +
        '<div class="sideCart-values"></div>' +
        '<div class="sideCart-actions">' +
          '<a class="btn-checkout" href="/carrinho">' + sideCart.lang.next + '</a> ' +
          '<button class="btn-back" type="button">' + sideCart.lang.back + '</button>' +
        '</div></div>';
  }

  sideCart.buildTemplate = function () {
    if ($('#sideCart').length === 0) {
      $('body').append('<div id="sideCart">' + templateMarkup() + '</div>');
    }
    $('#sideCart').html(templateMarkup());
  };

  /* ----------------------------------------------------------------------
   * Ações do rodapé
   * -------------------------------------------------------------------- */
  sideCart.updateFooterActions = function () {
    var errors = sideCart.showErrors(sideCart.cartInfo, 'subtotal');
    $('#sideCart .sideCart-footer .sideCart-actions').html(
      (errors.length > 0 ? errors : '<a class="btn-checkout" href="/carrinho">' + sideCart.lang.next + '</a>') +
      ' <button class="btn-back" type="button">' + sideCart.lang.back + '</button>'
    );
  };

  /* ----------------------------------------------------------------------
   * Preços do item
   * -------------------------------------------------------------------- */
  sideCart.itemPrice = function (i) {
    return fmt(i.price * i.quantity);
  };

  sideCart.itemSalePrice = function (i) {
    var price = i.price;
    if (i.discount) {
      price = price - i.discount;
    }
    return fmt(price * i.quantity);
  };

  /* ----------------------------------------------------------------------
   * Erros do carrinho
   * -------------------------------------------------------------------- */
  sideCart.showErrors = function (i, type) {
    var text = '';

    if (type !== 'subtotal') {
      $.each(i.errors, function (k, msg) {
        text += (text !== '' ? '<br>' : '') + msg;
      });
    }

    if (type === 'subtotal' && sideCart.cartInfo) {
      $.each(sideCart.cartInfo.errors, function (k, msg) {
        text += (text !== '' ? '<br>' : '') + msg;
      });

      if (text.length === 0 && sideCart.cartInfo.items) {
        var hasErr = sideCart.cartInfo.items.filter(function (el) { return el.errors; });
        if (hasErr.length > 0) {
          text += CONFIG.messages.cartRule;
        }
      }
    }

    if (text !== '') {
      return '<div class="alert-danger mt-3 ' + (type !== 'subtotal' ? 'mx-3' : '') + '">' + text + '</div>';
    }
    return '';
  };

  /* ----------------------------------------------------------------------
   * Lista de componentes (kits/grupos)
   * -------------------------------------------------------------------- */
  sideCart.showGroupList = function (i) {
    var text = '';
    $.each(i.components, function (k, comp) {
      text += '<p>' + comp.quantity + 'x ' + comp.name + '</p>';
    });
    if (text !== '') {
      return '<div class="group-list mb-3">' + text + '</div>';
    }
    return '<span></span>';
  };

  /* ----------------------------------------------------------------------
   * Pedido mínimo de atacado
   * Lê automaticamente da plataforma (cartInfo.min_purchase),
   * salvo se CONFIG.minPurchase forçar um valor fixo.
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
    if (min <= 0) {
      return ''; // loja sem pedido mínimo definido
    }

    var remaining = sideCart.minPurchaseRemaining();
    var reached = remaining <= 0;

    var line = reached
      ? CONFIG.messages.minReached
      : tpl(CONFIG.messages.minMissing,
          '<span class="aec-sidecart-min-purchase__missing">' + fmt(remaining) + '</span>');

    if (reached && !CONFIG.messages.minReached) {
      return ''; // mínimo atingido e mensagem desativada
    }

    return '<div class="aec-sidecart-min-purchase' + (reached ? ' aec-sidecart-min-purchase--ok' : '') + '">' +
      '<small>' + CONFIG.messages.minLabel + ' ' +
      '<span class="aec-sidecart-min-purchase__value">' + fmt(min) + '</span>' +
      '<br>' + line + '</small></div>';
  };

  /* ----------------------------------------------------------------------
   * Renderização do conteúdo do carrinho
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

  function placeContent() {
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
  }

  /**
   * Instala o placeContent.
   * Requisito: validar window.sideCart antes de sobrescrever.
   */
  function installPlaceContent() {
    if (!window.sideCart) {
      console.error('[Bagy SideCart Atacado] window.sideCart indisponível: placeContent não foi instalado.');
      return;
    }
    window.sideCart.placeContent = placeContent;
  }
  installPlaceContent();

  /* ----------------------------------------------------------------------
   * Comunicação com a API do checkout (Dooca)
   * -------------------------------------------------------------------- */
  function cartEndpoint() {
    var cookie = new window._dcs.Cookies();
    return {
      url: window.shop_ctx.api_checkout_url + '/carts/' + cookie.get('_dc_cart'),
      cartId: cookie.get('_dc_cart')
    };
  }

  function applyCartResponse(data) {
    window.currentCart = data;
    sideCart.cartInfo = (data.items && data.items.length > 0) ? data : { isEmpty: true };
    sideCart.placeContent();
  }

  sideCart.cartUpdate = function () {
    $('body').addClass('updatingSideCart');
    var endpoint = cartEndpoint();

    $.ajax({
      url: endpoint.url,
      headers: {
        shopid: window.dooca.shop_id,
        'Access-Control-Allow-Origin': '*',
        'Content-Type': 'application/json'
      },
      contentType: 'application/json',
      method: 'PUT',
      cache: false,
      data: JSON.stringify({ items: sideCart.cartInfo.items })
    }).done(function (data) {
      sideCart.cartInfo = (data.items && data.items.length > 0) ? data : { isEmpty: true };
      sideCart.placeContent();
    }).fail(function () {
      sideCart.cartInfo = { isEmpty: true };
    });
  };

  sideCart.getCart = function () {
    $('body').addClass('updatingSideCart');
    var endpoint = cartEndpoint();

    if (endpoint.cartId) {
      $.ajax({
        url: endpoint.url,
        headers: {
          shopid: window.dooca.shop_id,
          'Access-Control-Allow-Origin': '*',
          'Content-Type': 'application/json'
        },
        method: 'GET',
        cache: false
      }).done(function (data) {
        applyCartResponse(data);
      }).fail(function () {
        sideCart.cartInfo = { isEmpty: true };
      });
    } else {
      sideCart.cartInfo = { isEmpty: true };
      sideCart.placeContent();
    }
  };

  /* ----------------------------------------------------------------------
   * Boot
   * -------------------------------------------------------------------- */
  function boot() {
    $ = window.jQuery;
    if (!$) {
      console.error('[Bagy SideCart Atacado] jQuery não encontrado. Verifique a ordem de carregamento dos scripts.');
      return;
    }
    if (!window.sideCart) {
      console.error('[Bagy SideCart Atacado] window.sideCart indisponível. O carrinho lateral não foi inicializado.');
      return;
    }
    sideCart.run();
  }

  document.addEventListener('DOMContentLoaded', boot);
})(window);
