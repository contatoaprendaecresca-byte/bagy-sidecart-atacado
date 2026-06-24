/* Captura do override inline em produção na loja Super Vaidosa Atacado
 * Fonte: https://www.supervaidosaatacado.com.br (HTML inline)
 * Capturado em: 2026-06-24
 * Observação: este arquivo NAO eh usado em producao aqui. Eh referencia
 * da engenharia reversa — mostra como a loja adicionava o pedido minimo
 * lendo sideCart.cartInfo.min_purchase (campo da API Dooca).
 */

sideCart.placeContent = function(){
  $('#sideCart .sideCart-content').empty();
  if(sideCart.cartInfo.isEmpty){
    $(`<p class="empty">${sideCart.lang.empty}</p>`).appendTo('#sideCart .sideCart-content');
    $('#sideCart .sideCart-values, #sideCart .sideCart-actions').empty();
  }else{
     $.each(sideCart.cartInfo.items, function(k,i){
      $(`<div class="row sideCart-item ml-0"><div class="col-3"><img class="img-responsive w-100" src=${i.image}></div><div class="col-9 title"><div class=row><div class="col name">${i.name}</div><div class=col-auto><button class=sideCart-item-delete type=button data-id=${i.variation_id}><i class="h-sc-color material-icons md-36">delete</i></button></div></div>${i.variation ? ' <small class="d-block mt-3">'+i.variation+'</small>':''}<br>${i.discount>0 ? ' <span class="d-flex align-items-center font-weight-bold mb-2 text" style=--tx-fs:10px;color:var(--success)><i class="h-sc-color material-icons md-36 mr-1" style="font-size:var(--tx-fs)">check</i> Você ganhou '+i.discount.toLocaleString('pt-BR',{style:'currency',currency:'BRL'})+' de desconto </span>':''}${sideCart.showGroupList(i)}<div class="row align-items-center"><div class=col><div class="d-flex sideCart-item-quantity"><button class=sideCart-item-remove type=button><i class="h-sc-color material-icons md-36">remove</i></button><input data-id=${i.variation_id} name=customCartQuantity type=number value=${i.quantity}><button class=sideCart-item-add type=button><i class="h-sc-color material-icons md-36">add</i></button></div></div><div class=col-auto><div class="align-items-center d-flex flex-column">${i.subtotal>i.total ? ' <s><small>'+ sideCart.itemPrice(i) +'</small></s>':''}<strong>${sideCart.itemSalePrice(i) }</strong></div></div></div></div></div>${i.gift_wrapping_accept ? `<small class="d-flex mx-3 align-items-center mt-3"><input type="checkbox" value="true" ${i.gift_wrapping_accept && i.has_gift_wrapping ? 'checked':''} data-id="${i.variation_id}" class="mr-1" name="gift_wrapping_accept"/>Embalar para presente (+ ${(i.gift_wrapping_price * i.quantity).toLocaleString('pt-BR', {style: 'currency', currency: 'BRL'})})</small>` : `` }<small class="d-flex align-items-center">${sideCart.showErrors(i)}</small><hr class=my-4>`).appendTo('#sideCart .sideCart-content');
    });
    $('#sideCart .sideCart-values').empty();
    
    $(`<div class='row justify-content-between'><div class="col"><span>Subtotal</span></div><div class="text-right col"><small>${sideCart.cartInfo.subtotal.toLocaleString('pt-BR', {style: 'currency', currency: 'BRL'})}</small><strong>${sideCart.findBestPaymentOptions(sideCart.cartInfo.payments)}<div></div></strong></div>`).appendTo('#sideCart .sideCart-values');
    $(`${sideCart.cartInfo.min_purchase > 0 && sideCart.cartInfo.subtotal < sideCart.cartInfo.min_purchase ? `<div class="row justify-content-between"><div class="col-auto"><small>Pedido mínimo: <b>${sideCart.cartInfo.min_purchase.toLocaleString('pt-BR', {style: 'currency', currency: 'BRL'})}</b></small></div><div class="text-right col-auto"><small>Faltam <strong style="color:red;">${(parseFloat(sideCart.cartInfo.min_purchase) - parseFloat(sideCart.cartInfo.subtotal)).toLocaleString('pt-BR', {style: 'currency', currency: 'BRL'})}</strong></small></div></div>` : ``}`).appendTo('#sideCart .sideCart-values');
    sideCart.updateFooterActions();
  }
  
  sideCart.updateFooterActions();
  $('body').removeClass('updatingSideCart');
};