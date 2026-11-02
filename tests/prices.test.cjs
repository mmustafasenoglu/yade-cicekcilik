const assert = require('node:assert/strict');
global.window = {};
require('../dist/content.js');
const C = window.FLOWER_CONTENT;
const M = require('../dist/model.js');

const redPrice = C.products.find((product) => product.id === 'red-rose').unitPrice;
const eucalyptusPrice = C.products.find((product) => product.id === 'eucalyptus').unitPrice;
const s = M.create();
let q = M.quote(s, C.products, C.wraps);
assert.equal(q.total, 0);
assert.equal(q.wrapTotal, 0);

M.add(s, 'red-rose', 'r1');
M.add(s, 'red-rose', 'r2');
M.add(s, 'eucalyptus', 'e1');
q = M.quote(s, C.products, C.wraps);
assert.equal(q.lines[0].count, 2);
assert.equal(q.lines[0].unitPrice, redPrice);
assert.equal(q.lines[0].total, redPrice * 2);
assert.equal(q.productsTotal, redPrice * 2 + eucalyptusPrice);
assert.equal(q.wrapTotal, C.wraps[s.wrap].price);
assert.equal(q.total, q.productsTotal + q.wrapTotal);

s.wrap = 'kraft';
assert.equal(M.quote(s, C.products, C.wraps).total,
  redPrice * 2 + eucalyptusPrice + C.wraps.kraft.price);
const before = structuredClone(s);
M.remove(s, 'r2');
assert.equal(M.quote(s, C.products, C.wraps).total,
  redPrice + eucalyptusPrice + C.wraps.kraft.price);
assert.equal(M.quote(before, C.products, C.wraps).total,
  redPrice * 2 + eucalyptusPrice + C.wraps.kraft.price);
assert.equal(M.money(12050), '₺120,5');
assert.throws(() => M.quote({...s, stems: [{product: 'missing'}]}, C.products, C.wraps));
assert.throws(() => M.quote(s, C.products, {kraft: {price: -1}}));
console.log('PASS: unit × quantity, subtotal, wrapping, removal, snapshot, kuruş precision and invalid price guards');
