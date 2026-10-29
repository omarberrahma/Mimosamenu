function submitOrderToPlatform() {
  if (cart.length === 0) {
    showToast(TRANSLATIONS[currentLang].emptyCart, 'alert-circle', true);
    return;
  }

  const info = validateCustomerInfo();
  if (!info) return;

  const orderRef = "MIM-" + Math.floor(100000 + Math.random() * 900000);
  const grandTotal = cart.reduce((acc, c) => acc + (c.unitPrice * c.quantity), 0);

  const orderPayload = {
    orderId: orderRef,
    restaurant: RESTAURANT_CONFIG.name,
    customer: info,
    items: cart.map(c => ({
      id: c.item.id,
      name: c.item.title.fr,
      quantity: c.quantity,
      unitPrice: c.unitPrice,
      extras: c.selectedExtras.map(e => e.name.fr),
      note: c.note
    })),
    totalPrice: grandTotal,
    currency: "DZD",
    createdAt: new Date().toISOString()
  };

  console.log("Transmission vers la plateforme Mimosa:", orderPayload);

  fetch('/api/orders', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(orderPayload)
  }).then(res => res.json())
    .then(data => console.log('Success:', data))
    .catch(err => console.error('Error:', err));

  showToast(`Commande #${orderRef} envoyée à la cuisine avec succès !`, "check-circle");

  setTimeout(() => {
    cart = [];
    renderCart();
    toggleCartDrawer(false);
  }, 1500);
}