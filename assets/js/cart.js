let cart = []; // Array of items in cart

function toggleCartDrawer(open) {
  const drawer = document.getElementById('cart-drawer');
  if (open) {
    drawer.classList.remove('hidden');
    renderCart();
  } else {
    drawer.classList.add('hidden');
  }
  lucide.createIcons();
}

function toggleOrderType(val) {
  const field = document.getElementById('cust-table-or-phone');
  const t = TRANSLATIONS[currentLang];
  field.placeholder = (val === 'sur_place') ? t.tablePlaceholder : t.phonePlaceholder;
}

function updateCartItemQty(cartId, delta) {
  const item = cart.find(c => c.cartId === cartId);
  if (!item) return;

  item.quantity += delta;
  if (item.quantity <= 0) {
    cart = cart.filter(c => c.cartId !== cartId);
  }
  renderCart();
}

function renderCart() {
  const list = document.getElementById('cart-items-list');
  const badge = document.getElementById('cart-badge-count');
  const subtotalEl = document.getElementById('cart-subtotal-price');
  const totalEl = document.getElementById('cart-total-price');

  const totalCount = cart.reduce((acc, c) => acc + c.quantity, 0);
  badge.innerText = totalCount;

  if (cart.length === 0) {
    list.innerHTML = `
      <div class="h-64 flex flex-col items-center justify-center text-center p-6 space-y-3">
        <div class="w-12 h-12 rounded-full bg-slate-900 border border-slate-800 flex items-center justify-center text-slate-500">
          <i data-lucide="shopping-bag" class="w-6 h-6"></i>
        </div>
        <p class="text-xs text-slate-400">${TRANSLATIONS[currentLang].emptyCart}</p>
      </div>
    `;
    subtotalEl.innerText = `0 ${RESTAURANT_CONFIG.currency}`;
    totalEl.innerText = `0 ${RESTAURANT_CONFIG.currency}`;
    lucide.createIcons();
    return;
  }

  let grandTotal = 0;

  list.innerHTML = cart.map(entry => {
    const title = entry.item.title[currentLang] || entry.item.title.fr;
    const itemTotal = entry.unitPrice * entry.quantity;
    grandTotal += itemTotal;

    const extrasNames = entry.selectedExtras.map(e => e.name[currentLang] || e.name.fr).join(', ');

    return `
      <div class="p-3.5 bg-slate-900/80 border border-slate-800 rounded-xl space-y-2">
        <div class="flex items-start justify-between gap-2">
          <div>
            <h4 class="font-bold text-xs text-white">${title}</h4>
            <span class="text-[11px] text-mimosa-400 font-semibold">${entry.unitPrice} ${RESTAURANT_CONFIG.currency}</span>
          </div>
          <span class="font-bold text-xs text-slate-200">${itemTotal} ${RESTAURANT_CONFIG.currency}</span>
        </div>

        ${extrasNames ? `
          <p class="text-[10px] text-slate-400 bg-slate-950 p-1.5 rounded-lg border border-slate-800">
            <span class="text-mimosa-400 font-semibold">+</span> ${extrasNames}
          </p>
        ` : ''}

        ${entry.note ? `
          <p class="text-[10px] text-slate-400 italic">Note: "${entry.note}"</p>
        ` : ''}

        <div class="flex items-center justify-between pt-1">
          <div class="flex items-center border border-slate-700 bg-slate-950 rounded-lg px-2 py-0.5 gap-2.5 text-xs">
            <button onclick="updateCartItemQty(${entry.cartId}, -1)" class="text-slate-400 hover:text-white font-bold">-</button>
            <span class="text-white font-bold">${entry.quantity}</span>
            <button onclick="updateCartItemQty(${entry.cartId}, 1)" class="text-slate-400 hover:text-white font-bold">+</button>
          </div>

          <button onclick="updateCartItemQty(${entry.cartId}, -${entry.quantity})" class="text-[11px] text-rose-400 hover:underline">
            Supprimer
          </button>
        </div>
      </div>
    `;
  }).join('');

  subtotalEl.innerText = `${grandTotal} ${RESTAURANT_CONFIG.currency}`;
  totalEl.innerText = `${grandTotal} ${RESTAURANT_CONFIG.currency}`;
  lucide.createIcons();
}