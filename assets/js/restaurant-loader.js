window.loadRestaurantMenu = async function loadRestaurantMenu() {
  const slug = window.location.pathname.split('/').filter(Boolean)[0] || 'mimosa';
  const useStaticMimosaMenu = slug === 'mimosa';

  const unavailable = (message) => {
    document.getElementById('category-bar').innerHTML = '';
    document.getElementById('menu-container').innerHTML =
      '<div class="col-span-full py-16 text-center space-y-3">' +
      '<div class="text-3xl">🍽️</div>' +
      '<h2 class="text-white font-semibold">Menu indisponible</h2>' +
      '<p class="text-sm text-slate-400">' + message + '</p>' +
      '</div>';
  };

  const fallbackOrStop = (message) => {
    if (useStaticMimosaMenu) return true;
    unavailable(message);
    return false;
  };

  try {
    const configResponse = await fetch('/api/config', { cache: 'no-store' });
    if (!configResponse.ok) {
      return fallbackOrStop('La plateforme n’est pas encore connectée à sa base de données.');
    }

    const config = await configResponse.json();
    if (!config.supabaseUrl || !config.supabaseKey || !window.supabase) {
      return fallbackOrStop('La plateforme n’est pas encore connectée à sa base de données.');
    }

    const client = window.supabase.createClient(config.supabaseUrl, config.supabaseKey, {
      auth: { persistSession: false, autoRefreshToken: false }
    });

    const { data: restaurant, error: restaurantError } = await client
      .from('restaurants')
      .select('id, slug, name, description, whatsapp_number, currency, is_active')
      .eq('slug', slug)
      .eq('is_active', true)
      .maybeSingle();

    if (restaurantError || !restaurant) {
      return fallbackOrStop('Ce lien ne correspond à aucun restaurant actif.');
    }

    const [categoriesResult, itemsResult] = await Promise.all([
      client.from('menu_categories')
        .select('id, name, icon, sort_order')
        .eq('restaurant_id', restaurant.id)
        .eq('is_active', true)
        .order('sort_order', { ascending: true }),
      client.from('menu_items')
        .select('id, category_id, name, description, price, image_url, badge, extras, sort_order')
        .eq('restaurant_id', restaurant.id)
        .eq('is_available', true)
        .order('sort_order', { ascending: true })
    ]);

    if (categoriesResult.error || itemsResult.error) {
      return fallbackOrStop('Impossible de charger le menu pour le moment.');
    }

    // Keep Mimosa's current static data until those products are migrated to Supabase.
    if (!categoriesResult.data.length || !itemsResult.data.length) {
      return fallbackOrStop('Le menu de ce restaurant est en cours de préparation.');
    }

    const allCategory = {
      id: 'all',
      icon: 'utensils',
      name: { fr: 'Tout le Menu', ar: 'القائمة كاملة', en: 'Full Menu' }
    };

    const mappedCategories = categoriesResult.data.map((category) => ({
      id: category.id,
      icon: category.icon || 'utensils',
      name: category.name || {}
    }));

    const mappedItems = itemsResult.data.map((item) => ({
      id: item.id,
      categoryId: item.category_id,
      title: item.name || {},
      description: item.description || {},
      price: Number(item.price || 0),
      image: item.image_url || '',
      badge: item.badge || null,
      extras: Array.isArray(item.extras) ? item.extras : []
    }));

    MENU_CATEGORIES.splice(0, MENU_CATEGORIES.length, allCategory, ...mappedCategories);
    MENU_ITEMS.splice(0, MENU_ITEMS.length, ...mappedItems);

    RESTAURANT_CONFIG.id = restaurant.id;
    RESTAURANT_CONFIG.slug = restaurant.slug;
    RESTAURANT_CONFIG.name = restaurant.name;
    RESTAURANT_CONFIG.whatsappNumber = restaurant.whatsapp_number || '';
    RESTAURANT_CONFIG.currency = restaurant.currency === 'DZD' ? 'دج' : (restaurant.currency || 'دج');

    const brand = document.getElementById('restaurant-brand-name');
    const footerBrand = document.getElementById('footer-restaurant-name');
    if (brand) brand.textContent = restaurant.name;
    if (footerBrand) footerBrand.textContent = restaurant.name;
    document.title = restaurant.name + ' | Menu en ligne — RestoMenu';

    if (restaurant.description) {
      const subtitle = document.getElementById('hero-subtitle');
      if (subtitle) subtitle.textContent = restaurant.description;
    }

    return true;
  } catch (error) {
    console.error('RestoMenu menu loading failed:', error);
    return fallbackOrStop('Une erreur est survenue pendant le chargement du menu.');
  }
};
