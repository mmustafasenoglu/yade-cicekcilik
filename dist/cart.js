(() => {
  'use strict';

  const STORAGE_KEY = 'yade_cart_items_v1';

  function loadCart() {
    try {
      return JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];
    } catch {
      return [];
    }
  }

  function saveCart(items) {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
    } catch {}
  }

  let items = loadCart();

  const YadeCart = {
    getItems() {
      return items;
    },

    addItem(product) {
      const existing = items.find(i => i.id === product.id);
      if (existing) {
        existing.count = (existing.count || 1) + 1;
      } else {
        items.push({
          id: product.id,
          name: product.name,
          price: product.price || 0,
          originalPrice: product.originalPrice || Math.round(((product.price || 0) / 100) / 0.8) * 100,
          image: product.image || '',
          count: 1
        });
      }
      saveCart(items);
      YadeCart.updateBadge();
      YadeCart.showToast(`“${product.name}” sepete eklendi ✿`);
    },

    removeItem(id) {
      items = items.filter(i => i.id !== id);
      saveCart(items);
      YadeCart.updateBadge();
      YadeCart.render();
    },

    updateCount(id, delta) {
      const item = items.find(i => i.id === id);
      if (!item) return;
      item.count = Math.max(1, (item.count || 1) + delta);
      saveCart(items);
      YadeCart.updateBadge();
      YadeCart.render();
    },

    clear() {
      items = [];
      saveCart(items);
      YadeCart.updateBadge();
      YadeCart.render();
    },

    getTotal() {
      return items.reduce((sum, item) => sum + (item.price || 0) * (item.count || 1), 0);
    },

    getTotalOriginal() {
      return items.reduce((sum, item) => sum + (item.originalPrice || item.price || 0) * (item.count || 1), 0);
    },

    getCount() {
      return items.reduce((sum, item) => sum + (item.count || 1), 0);
    },

    updateBadge() {
      const count = YadeCart.getCount();
      document.querySelectorAll('.yade-cart-count').forEach(el => {
        el.textContent = count;
        el.hidden = count === 0;
      });
      const badge = document.querySelector('#cart-floating-btn .yade-cart-count');
      if (badge) badge.textContent = count;
    },

    showToast(message) {
      let toast = document.querySelector('.yade-cart-toast');
      if (!toast) {
        toast = document.createElement('div');
        toast.className = 'yade-cart-toast';
        document.body.append(toast);
      }
      toast.innerHTML = `<span>${message}</span> <button type="button" onclick="window.YadeCart.open()">Sepeti Gör ↗</button>`;
      toast.classList.add('is-visible');
      clearTimeout(toast._timer);
      toast._timer = setTimeout(() => {
        toast.classList.remove('is-visible');
      }, 3500);
    },

    open() {
      const dialog = document.querySelector('#cart-dialog');
      if (dialog) {
        YadeCart.render();
        dialog.showModal();
      }
    },

    close() {
      const dialog = document.querySelector('#cart-dialog');
      if (dialog) dialog.close();
    },

    render() {
      const container = document.querySelector('#cart-items-container');
      const footer = document.querySelector('#cart-dialog-footer');
      const emptyState = document.querySelector('#cart-empty-state');
      if (!container) return;

      container.replaceChildren();

      if (!items.length) {
        if (emptyState) emptyState.hidden = false;
        if (footer) footer.hidden = true;
        return;
      }

      if (emptyState) emptyState.hidden = true;
      if (footer) footer.hidden = false;

      for (const item of items) {
        const row = document.createElement('div');
        row.className = 'cart-item-row';

        const thumb = document.createElement('img');
        thumb.className = 'cart-item-thumb';
        thumb.src = item.image;
        thumb.alt = item.name;

        const details = document.createElement('div');
        details.className = 'cart-item-details';

        const title = document.createElement('h4');
        title.textContent = item.name;

        const code = document.createElement('span');
        code.className = 'cart-item-code';
        code.textContent = item.id;

        const priceRow = document.createElement('div');
        priceRow.className = 'cart-item-price';
        if (item.price > 0) {
          const money = typeof BouquetModel !== 'undefined' ? BouquetModel.money : n => '₺' + (n / 100).toLocaleString('tr-TR');
          priceRow.innerHTML = `<strong>${money(item.price * (item.count || 1))}</strong> <small>${money(item.price)} × ${item.count}</small>`;
        } else {
          priceRow.innerHTML = `<em>Fiyat için iletişime geçilir</em>`;
        }

        details.append(title, code, priceRow);

        const actions = document.createElement('div');
        actions.className = 'cart-item-actions';

        const minusBtn = document.createElement('button');
        minusBtn.type = 'button';
        minusBtn.className = 'cart-qty-btn';
        minusBtn.textContent = '−';
        minusBtn.onclick = () => YadeCart.updateCount(item.id, -1);

        const qty = document.createElement('span');
        qty.className = 'cart-qty-num';
        qty.textContent = item.count || 1;

        const plusBtn = document.createElement('button');
        plusBtn.type = 'button';
        plusBtn.className = 'cart-qty-btn';
        plusBtn.textContent = '+';
        plusBtn.onclick = () => YadeCart.updateCount(item.id, 1);

        const removeBtn = document.createElement('button');
        removeBtn.type = 'button';
        removeBtn.className = 'cart-remove-btn';
        removeBtn.innerHTML = '×';
        removeBtn.setAttribute('aria-label', `${item.name} ürününü sepetten kaldır`);
        removeBtn.onclick = () => YadeCart.removeItem(item.id);

        actions.append(minusBtn, qty, plusBtn, removeBtn);
        row.append(thumb, details, actions);
        container.append(row);
      }

      // Totals
      const total = YadeCart.getTotal();
      const origTotal = YadeCart.getTotalOriginal();
      const money = typeof BouquetModel !== 'undefined' ? BouquetModel.money : n => '₺' + (n / 100).toLocaleString('tr-TR');

      const totalEl = document.querySelector('#cart-total-amount');
      const origTotalEl = document.querySelector('#cart-original-amount');
      const savingsEl = document.querySelector('#cart-savings-amount');

      if (totalEl) totalEl.textContent = money(total);
      if (origTotalEl) origTotalEl.textContent = money(origTotal);
      if (savingsEl && origTotal > total) {
        savingsEl.textContent = `%20 İndirim Kazancınız: ${money(origTotal - total)}`;
        savingsEl.hidden = false;
      } else if (savingsEl) {
        savingsEl.hidden = true;
      }
    },

    getWhatsAppUrl(senderName, cardNote, orderNote) {
      const whatsapp = window.FLOWER_CONTENT ? window.FLOWER_CONTENT.whatsapp : '905522048615';
      const money = typeof BouquetModel !== 'undefined' ? BouquetModel.money : n => '₺' + (n / 100).toLocaleString('tr-TR');

      let text = 'Merhaba Yade Flowers,\nSiteniz üzerinden sipariş talebi oluşturmak istiyorum:\n\n';
      items.forEach((item, idx) => {
        const p = item.price > 0 ? money(item.price * item.count) : 'Fiyat sorulacak';
        text += `${idx + 1}. ${item.name} (${item.id}) — ${item.count} adet [${p}]\n`;
      });

      const total = YadeCart.getTotal();
      if (total > 0) {
        text += `\nHesaplanan Toplam: ${money(total)}\n`;
      }

      if (senderName && senderName.trim()) {
        text += `Gönderen: ${senderName.trim()}\n`;
      }
      if (cardNote && cardNote.trim()) {
        text += `Kart Notu: "${cardNote.trim()}"\n`;
      }
      if (orderNote && orderNote.trim()) {
        text += `Özel Talep: ${orderNote.trim()}\n`;
      }

      text += '\nSipariş özet belgemin (PDF) detaylarını da iletiyorum. Stok, hazırlık ve teslimat durumunu teyit edebilir misiniz?';

      return `https://wa.me/${whatsapp}?text=${encodeURIComponent(text)}`;
    }
  };

  window.YadeCart = YadeCart;

  document.addEventListener('DOMContentLoaded', () => {
    YadeCart.updateBadge();
  });
})();
