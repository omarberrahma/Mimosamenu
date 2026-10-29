function validateCustomerInfo() {
  const name = document.getElementById('cust-name').value.trim();
  const tableOrPhone = document.getElementById('cust-table-or-phone').value.trim();

  if (!name || !tableOrPhone) {
    showToast(TRANSLATIONS[currentLang].validationError, 'alert-circle', true);
    return null;
  }
  const orderType = document.querySelector('input[name="order-type"]:checked').value;
  return { name, tableOrPhone, orderType };
}

function submitOrderViaWhatsApp() {
  if (cart.length === 0) {
    showToast(TRANSLATIONS[currentLang].emptyCart, 'alert-circle', true);
    return;
  }

  const info = validateCustomerInfo();
  if (!info) return;

  const orderRef = "MIM-" + Math.floor(100000 + Math.random() * 900000);
  const isArabic = currentLang === 'ar';
  let grandTotal = 0;

  let msg = "";
  if (isArabic) {
    msg += `✨ *طلب جديد من مطعم ${RESTAURANT_CONFIG.name}* ✨\n`;
    msg += `🔖 *رقم الطلب:* #${orderRef}\n`;
    msg += `👤 *اسم العميل:* ${info.name}\n`;
    msg += `📍 *النوع:* ${info.orderType === 'sur_place' ? 'طاولة داخل المطعم: ' + info.tableOrPhone : 'طلب خارجي / هاتف: ' + info.tableOrPhone}\n`;
    msg += `--------------------------------\n`;
    msg += `📋 *تفاصيل الأطباق:*\n\n`;

    cart.forEach((c, idx) => {
      const itemTotal = c.unitPrice * c.quantity;
      grandTotal += itemTotal;
      const dishTitle = c.item.title.ar || c.item.title.fr;
      msg += `${idx + 1}. *${dishTitle}* (x${c.quantity})\n`;
      msg += `   السعر: ${itemTotal} ${RESTAURANT_CONFIG.currency}\n`;
      if (c.selectedExtras.length > 0) {
        const extrasStr = c.selectedExtras.map(e => e.name.ar || e.name.fr).join(' + ');
        msg += `   الإضافات: [${extrasStr}]\n`;
      }
      if (c.note) {
        msg += `   ملاحظة: _${c.note}_\n`;
      }
      msg += `\n`;
    });

    msg += `--------------------------------\n`;
    msg += `💰 *المجموع الكلي:* *${grandTotal} ${RESTAURANT_CONFIG.currency}*\n`;
    msg += `⏱️ تم الطلب عبر القائمة الرقمية التفاعلية.`;
  } else {
    msg += `✨ *NOUVELLE COMMANDE - ${RESTAURANT_CONFIG.name.toUpperCase()}* ✨\n`;
    msg += `🔖 *Référence:* #${orderRef}\n`;
    msg += `👤 *Client:* ${info.name}\n`;
    msg += `📍 *Mode:* ${info.orderType === 'sur_place' ? 'À Table (N° ' + info.tableOrPhone + ')' : 'À Emporter / ' + info.tableOrPhone}\n`;
    msg += `--------------------------------\n`;
    msg += `📋 *Détail des Plats:*\n\n`;

    cart.forEach((c, idx) => {
      const itemTotal = c.unitPrice * c.quantity;
      grandTotal += itemTotal;
      const dishTitle = c.item.title.fr;
      msg += `${idx + 1}. *${dishTitle}* (x${c.quantity})\n`;
      msg += `   Prix: ${itemTotal} ${RESTAURANT_CONFIG.currency}\n`;
      if (c.selectedExtras.length > 0) {
        const extrasStr = c.selectedExtras.map(e => e.name.fr).join(' + ');
        msg += `   Suppléments: [${extrasStr}]\n`;
      }
      if (c.note) {
        msg += `   Instruction: _${c.note}_\n`;
      }
      msg += `\n`;
    });

    msg += `--------------------------------\n`;
    msg += `💰 *TOTAL À RÉGLER:* *${grandTotal} ${RESTAURANT_CONFIG.currency}*\n`;
    msg += `🚀 Commandé depuis le menu digital.`;
  }

  const whatsappUrl = `https://wa.me/${RESTAURANT_CONFIG.whatsappNumber}?text=${encodeURIComponent(msg)}`;
  window.open(whatsappUrl, '_blank');
  showToast("Ouverture de WhatsApp en cours...", "message-circle");
}