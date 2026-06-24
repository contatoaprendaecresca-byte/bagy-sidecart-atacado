/*
 * Teste de integração base + override (sem navegador).
 * Carrega os fontes em um sandbox com jQuery/DOM mockados e valida que
 * sideCart.placeContent() compõe corretamente em cenários reais.
 *
 * Rodar: npm test
 */
'use strict';
const vm = require('vm');
const fs = require('fs');
const path = require('path');

const root = path.join(__dirname, '..');
const base = fs.readFileSync(path.join(root, 'src/aec-sidecart-base.js'), 'utf8');
const override = fs.readFileSync(path.join(root, 'src/aec-sidecart-override.js'), 'utf8');

let CAP = [];
function jq(arg) {
  const self = {
    _html: typeof arg === 'string' ? arg : '',
    on() { return self; }, ajaxComplete() { return self; },
    html(h) { if (h !== undefined) CAP.push(String(h)); return self; },
    append(h) { CAP.push(String(h)); return self; },
    appendTo() { CAP.push(self._html); return self; },
    empty() { return self; }, addClass() { return self; }, removeClass() { return self; },
    toggleClass() { return self; }, find() { return self; }, closest() { return self; },
    attr() { return ''; }, val() { return '1'; }, is() { return false; },
    hasClass() { return false; }, filter() { return self; }, each() { return self; }
  };
  return self;
}
jq.each = function (o, cb) {
  if (!o) return;
  if (Array.isArray(o)) o.forEach((v, i) => cb(i, v));
  else Object.keys(o).forEach(k => cb(k, o[k]));
};
jq.ajax = function () { return { done() { return this; }, fail() { return this; } }; };

const sb = {};
sb.window = sb; sb.globalThis = sb; sb.$ = jq; sb.jQuery = jq;
sb.console = console; sb.document = { addEventListener() {} };
vm.createContext(sb);
vm.runInContext(base, sb, { filename: 'base.js' });
vm.runInContext(override, sb, { filename: 'override.js' });

const sc = sb.sideCart;
let failures = 0;
function assert(cond, msg) { if (!cond) { failures++; console.log('  ✗ ' + msg); } }

assert(sc, 'base expõe window.sideCart');
assert(typeof sc.renderMinPurchase === 'function', 'override aplica renderMinPurchase');

function scenario(label, cartInfo, expects, forbids) {
  CAP = [];
  sc.cartInfo = cartInfo;
  sc.placeContent();
  const out = CAP.join('\n');
  let ok = true;
  (expects || []).forEach(s => { if (out.indexOf(s) < 0) { ok = false; failures++; console.log('  ✗ [' + label + '] faltou: ' + s); } });
  (forbids || []).forEach(s => { if (out.indexOf(s) >= 0) { ok = false; failures++; console.log('  ✗ [' + label + '] não deveria conter: ' + s); } });
  if (ok) console.log('✓ ' + label);
}

const item = { variation_id: 'V1', name: 'Vestido Rosa', image: 'x.jpg', variation: 'Tam M', quantity: 2, price: 75, discount: 0, subtotal: 150, total: 150 };

scenario('abaixo do mínimo (150 / 400)',
  { isEmpty: false, items: [item], subtotal: 150, min_purchase: 400, payments: [] },
  ['aec-sidecart-min-purchase', 'aria-label="Remover produto do carrinho"', 'type="number"', 'min="1"', 'inputmode="numeric"', 'Adicione mais', 'Vestido Rosa', 'Subtotal']);

scenario('mínimo atingido (500 / 400)',
  { isEmpty: false, items: [item], subtotal: 500, min_purchase: 400, payments: [] },
  ['aec-sidecart-min-purchase--ok', 'atingido']);

scenario('loja sem pedido mínimo (0)',
  { isEmpty: false, items: [item], subtotal: 150, min_purchase: 0, payments: [] },
  ['Subtotal'], ['aec-sidecart-min-purchase']);

scenario('carrinho vazio', { isEmpty: true }, []);

if (failures > 0) {
  console.log('\nFALHOU: ' + failures + ' verificação(ões).');
  process.exit(1);
}
console.log('\nTodos os cenários passaram.');
