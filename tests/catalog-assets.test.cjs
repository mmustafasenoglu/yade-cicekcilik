const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');

const dist = path.resolve(__dirname, '../dist');
const context = {window: {}};
vm.runInNewContext(fs.readFileSync(path.join(dist, 'content.js'), 'utf8'), context);
const products = context.window.FLOWER_CONTENT.readyBouquets;

assert.ok(products.length > 0);
for (const product of products) {
  assert.ok(product.image?.endsWith('.thumb.webp'), `${product.id}: thumbnail missing`);
  assert.ok(product.fullImage?.endsWith('.webp'), `${product.id}: full image missing`);
  for (const image of [product.image, product.fullImage, ...(product.images || [])]) {
    const file = path.join(dist, image);
    assert.ok(fs.existsSync(file), `${product.id}: ${image} does not exist`);
    assert.ok(fs.statSync(file).mode & 0o004, `${product.id}: ${image} is not readable by Nginx`);
  }
}

console.log(`PASS: ${products.length} products have readable thumbnails and full-size images`);
