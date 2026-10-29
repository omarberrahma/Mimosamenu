let currentLang = 'fr';
let activeCategory = 'all';
let searchQuery = '';
let activeModalItem = null;
let modalSelectedExtras = [];
let modalQuantity = 1;

window.addEventListener('DOMContentLoaded', () => {
  renderCategoryBar();
  renderMenu();
  updateStaticTexts();
  lucide.createIcons();
});

function changeLanguage(lang) {
  currentLang = lang;
  const html = document.documentElement;

  if (lang === 'ar') {
    html.setAttribute('dir', 'rtl');
    html.setAttribute('lang', 'ar');
    document.body.classList.add('font-arabic');
  } else {
    html.setAttribute('dir', 'ltr');
    html.setAttribute('lang', lang);
    document.body.classList.remove('font-arabic');
  }

  updateStaticTexts();
  renderCategoryBar();
  renderMenu();
  renderCart();
  lucide.createIcons();
}

function updateStaticTexts() {
  const t = TRANSLATIONS[currentLang];
  document.getElementById('hero-badge').innerText = t.heroBadge;
  document.getElementById('hero-title').innerText = t.heroTitle;
  document.getElementById('hero-subtitle').innerText = t.heroSubtitle;
  document.getElementById('cart-header-label').innerText = t.orderLabel;
  document.getElementById('cart-drawer-title').innerText = t.cartTitle;
  document.getElementById('search-input').placeholder = t.searchPlaceholder;
  document.getElementById('lbl-dine-in').innerText = t.dineIn;
  document.getElementById('lbl-takeaway').innerText = t.takeaway;
  document.getElementById('cust-name').placeholder = t.namePlaceholder;
  document.getElementById('lbl-subtotal').innerText = t.subtotal;
  document.getElementById('lbl-tax').innerText = t.taxIncluded;
  document.getElementById('lbl-total').innerText = t.total;
  document.getElementById('btn-send-whatsapp').innerText = t.btnWhatsApp + " (+213 562 16 39 00)";
  document.getElementById('btn-send-platform').innerText = t.btnPlatform;
  document.getElementById('modal-extras-heading').innerText = t.extrasHeading;
  document.getElementById('modal-notes-label').innerText = t.notesLabel;
  document.getElementById('modal-submit-btn').innerText = t.addToCart;

  const orderTypeEl = document.querySelector('input[name="order-type"]:checked');
  if (orderTypeEl) {
    const orderTypeVal = orderTypeEl.value;
    document.getElementById('cust-table-or-phone').placeholder = orderTypeVal === 'sur_place' ? t.tablePlaceholder : t.phonePlaceholder;
  }
}

function renderCategoryBar() {
  const bar = document.getElementById('category-bar');
  bar.innerHTML = MENU_CATEGORIES.map(cat => {
    const isActive = activeCategory === cat.id;
    const activeStyles = isActive
      ? "bg-mimosa-500 text-slate-950 font-extrabold shadow-md shadow-mimosa-500/20"
      : "bg-slate-900/80 text-slate-300 hover:bg-slate-800 border border-slate-700/60";
    return `
      <button
        onclick="setCategory('${cat.id}')"
        class="flex items-center gap-2 px-4 py-2 rounded-xl whitespace-nowrap transition cursor-pointer ${activeStyles}">
        <i data-lucide="${cat.icon}" class="w-3.5 h-3.5"></i>
        <span>${cat.name[currentLang] || cat.name.fr}</span>
      </button>
    `;
  }).join('');
  lucide.createIcons();
}

function setCategory(id) {
  activeCategory = id;
  renderCategoryBar();
  renderMenu();
}

function handleSearch(val) {
  searchQuery = val.trim().toLowerCase();
  renderMenu();
}

function renderMenu() {
  const container = document.getElementById('menu-container');
  const resultsCountEl = document.getElementById('results-count');

  const filtered = MENU_ITEMS.filter(item => {
    const matchesCategory = (activeCategory === 'all' || item.categoryId === activeCategory);
    const titleStr = (item.title[currentLang] || item.title.fr).toLowerCase();
    const descStr = (item.description[currentLang] || item.description.fr).toLowerCase();
    const matchesSearch = !searchQuery || titleStr.includes(searchQuery) || descStr.includes(searchQuery);
    return matchesCategory && matchesSearch;
  });

  resultsCountEl.innerText = `${filtered.length} ${TRANSLATIONS[currentLang].showingAll}`;

  if (filtered.length === 0) {
    container.innerHTML = `
      <div class="col-span-full py-16 text-center space-y-3">
        <i data-lucide="coffee" class="w-10 h-10 text-slate-600 mx-auto"></i>
        <p class="text-sm text-slate-400">Aucun plat ne correspond à votre recherche.</p>
      </div>
    `;
    lucide.createIcons();
    return;
  }

  container.innerHTML = filtered.map(item => {
    const title = item.title[currentLang] || item.title.fr;
    const description = item.description[currentLang] || item.description.fr;
    const badge = item.badge ? item.badge[currentLang] || item.badge.fr : null;

    return `
      <div class="group bg-slate-900/60 border border-slate-800 hover:border-mimosa-500/50 rounded-2xl overflow-hidden transition-all duration-300 flex flex-col justify-between hover:shadow-xl hover:shadow-mimosa-500/5">
        <div class="relative h-48 overflow-hidden bg-slate-800">
          <img
            src="${item.image}"
            alt="${title}"
            loading="lazy"
            onerror="this.src='https://placehold.co/600x400/1e293b/eab308?text=Mimosa+Brunch'"
            class="w-full h-full object-cover group-hover:scale-105 transition duration-500"
          />
          <div class="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent opacity-80"></div>

          ${badge ? `
            <span class="absolute top-3 left-3 bg-amber-500 text-slate-950 text-[10px] font-extrabold uppercase px-2.5 py-1 rounded-full shadow-md">
              ${badge}
            </span>
          ` : ''}

          <div class="absolute bottom-3 left-3 right-3 flex items-center justify-between">
            <span class="bg-night/90 backdrop-blur-md text-mimosa-400 font-serif font-extrabold text-sm px-3 py-1 rounded-xl border border-mimosa-500/30">
              ${item.price} ${RESTAURANT_CONFIG.currency}
            </span>
          </div>
        </div>

        <div class="p-5 flex-1 flex flex-col justify-between space-y-4">
          <div>
            <h3 class="font-serif font-bold text-lg text-white group-hover:text-mimosa-300 transition">
              ${title}
            </h3>
            <p class="text-xs text-slate-400 mt-2 line-clamp-3 leading-relaxed">
              ${description}
            </p>
          </div>

          <button
            onclick="openCustomizeModal('${item.id}')"
            class="w-full bg-slate-800/80 hover:bg-gradient-to-r hover:from-mimosa-500 hover:to-amber-500 hover:text-slate-950 text-slate-200 font-semibold text-xs py-2.5 px-4 rounded-xl flex items-center justify-center gap-2 border border-slate-700 hover:border-transparent transition active:scale-95">
            <i data-lucide="sliders-horizontal" class="w-3.5 h-3.5"></i>
            <span>Personnaliser & Ajouter</span>
          </button>
        </div>
      </div>
    `;
  }).join('');

  lucide.createIcons();
}

function openCustomizeModal(itemId) {
  activeModalItem = MENU_ITEMS.find(i => i.id === itemId);
  if (!activeModalItem) return;

  modalSelectedExtras = [];
  modalQuantity = 1;
  document.getElementById('modal-note-input').value = '';

  const title = activeModalItem.title[currentLang] || activeModalItem.title.fr;
  const desc = activeModalItem.description[currentLang] || activeModalItem.description.fr;
  const catObj = MENU_CATEGORIES.find(c => c.id === activeModalItem.categoryId);
  const catName = catObj ? (catObj.name[currentLang] || catObj.name.fr) : '';

  document.getElementById('modal-category').innerText = catName;
  document.getElementById('modal-title').innerText = title;
  document.getElementById('modal-description').innerText = desc;
  document.getElementById('modal-base-price').innerText = `${activeModalItem.price} ${RESTAURANT_CONFIG.currency}`;
  document.getElementById('modal-qty').innerText = modalQuantity;

  const extrasListContainer = document.getElementById('modal-extras-list');
  if (!activeModalItem.extras || activeModalItem.extras.length === 0) {
    extrasListContainer.innerHTML = `<p class="text-xs text-slate-500 italic">Aucun supplément requis pour ce plat.</p>`;
  } else {
    extrasListContainer.innerHTML = activeModalItem.extras.map((extra, index) => {
      const extraName = extra.name[currentLang] || extra.name.fr;
      return `
        <label class="flex items-center justify-between p-2.5 rounded-xl bg-slate-950/80 border border-slate-800 hover:border-slate-700 cursor-pointer text-xs">
          <div class="flex items-center gap-2.5">
            <input
              type="checkbox"
              value="${index}"
              onchange="toggleModalExtra(${index}, this.checked)"
              class="rounded border-slate-700 text-mimosa-500 focus:ring-0 w-4 h-4"
            />
            <span class="text-slate-200">${extraName}</span>
          </div>
          <span class="text-mimosa-400 font-bold">+${extra.price} ${RESTAURANT_CONFIG.currency}</span>
        </label>
      `;
    }).join('');
  }

  updateModalTotal();
  document.getElementById('customize-modal').classList.remove('hidden');
  lucide.createIcons();
}

function toggleModalExtra(extraIndex, isChecked) {
  const extra = activeModalItem.extras[extraIndex];
  if (isChecked) {
    modalSelectedExtras.push(extra);
  } else {
    modalSelectedExtras = modalSelectedExtras.filter(e => e !== extra);
  }
  updateModalTotal();
}

function changeModalQty(delta) {
  modalQuantity = Math.max(1, modalQuantity + delta);
  document.getElementById('modal-qty').innerText = modalQuantity;
  updateModalTotal();
}

function updateModalTotal() {
  if (!activeModalItem) return;
  const extrasSum = modalSelectedExtras.reduce((sum, e) => sum + e.price, 0);
  const totalPerItem = activeModalItem.price + extrasSum;
  const grandTotal = totalPerItem * modalQuantity;
  document.getElementById('modal-total-btn').innerText = `(${grandTotal} ${RESTAURANT_CONFIG.currency})`;
}

function closeModal() {
  document.getElementById('customize-modal').classList.add('hidden');
  activeModalItem = null;
}

function confirmAddToCart() {
  if (!activeModalItem) return;

  const extrasSum = modalSelectedExtras.reduce((sum, e) => sum + e.price, 0);
  const itemUnitPrice = activeModalItem.price + extrasSum;
  const note = document.getElementById('modal-note-input').value.trim();

  const extrasIds = modalSelectedExtras.map(e => e.name.fr).sort().join('|');

  const existingCartIndex = cart.findIndex(c =>
    c.item.id === activeModalItem.id &&
    c.extrasKey === extrasIds &&
    c.note === note
  );

  if (existingCartIndex > -1) {
    cart[existingCartIndex].quantity += modalQuantity;
  } else {
    cart.push({
      cartId: Date.now() + Math.random(),
      item: activeModalItem,
      selectedExtras: [...modalSelectedExtras],
      extrasKey: extrasIds,
      unitPrice: itemUnitPrice,
      quantity: modalQuantity,
      note: note
    });
  }

  closeModal();
  renderCart();
  showToast(TRANSLATIONS[currentLang].addedToast, 'check-circle');
}

function showToast(message, iconName = 'info', isError = false) {
  const toast = document.getElementById('toast');
  const toastMsg = document.getElementById('toast-message');
  const toastIcon = document.getElementById('toast-icon');

  toastMsg.innerText = message;
  toastIcon.innerHTML = `<i data-lucide="${iconName}" class="w-4 h-4"></i>`;

  if (isError) {
    toast.className = "fixed bottom-5 left-1/2 -translate-x-1/2 z-50 bg-rose-950 border border-rose-500 text-white px-4 py-3 rounded-2xl shadow-2xl flex items-center gap-3 text-xs";
  } else {
    toast.className = "fixed bottom-5 left-1/2 -translate-x-1/2 z-50 bg-slate-900 border border-mimosa-500 text-white px-4 py-3 rounded-2xl shadow-2xl flex items-center gap-3 text-xs";
  }

  toast.classList.remove('hidden');
  lucide.createIcons();

  setTimeout(() => {
    toast.classList.add('hidden');
  }, 3500);
}