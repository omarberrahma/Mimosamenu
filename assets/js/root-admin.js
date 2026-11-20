(() => {
  const loginPanel = document.getElementById('login-panel');
  const dashboard = document.getElementById('dashboard');
  const setupNotice = document.getElementById('setup-notice');
  const loginForm = document.getElementById('login-form');
  const loginError = document.getElementById('login-error');
  const statusLine = document.getElementById('status-line');
  const restaurantsBody = document.getElementById('restaurants-body');
  const restaurantForm = document.getElementById('restaurant-form');
  const restaurantMessage = document.getElementById('restaurant-message');
  const createButton = document.getElementById('create-restaurant-button');
  const logoutButton = document.getElementById('logout-button');

  let supabaseClient = null;
  let signedInUser = null;

  const escapeHtml = (value) => String(value ?? '').replace(/[&<>"']/g, (char) => ({
    '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'
  })[char]);

  function showMessage(element, message, isError = false) {
    element.textContent = message;
    element.classList.toggle('text-rose-300', isError);
    element.classList.toggle('text-emerald-300', !isError);
    element.classList.remove('hidden');
  }

  function showLogin(message = '') {
    loginPanel.classList.remove('hidden');
    dashboard.classList.add('hidden');
    if (message) showMessage(loginError, message, true);
  }

  function showDashboard() {
    loginPanel.classList.add('hidden');
    dashboard.classList.remove('hidden');
  }

  async function loadSupabase() {
    const response = await fetch('/api/config', { cache: 'no-store' });
    const config = await response.json().catch(() => ({}));

    if (!response.ok || !config.supabaseUrl || !config.supabaseKey) {
      setupNotice.textContent = config.message || 'Configuration Supabase indisponible.';
      setupNotice.classList.remove('hidden');
      loginForm.querySelector('button[type="submit"]').disabled = true;
      return;
    }

    if (!window.supabase || typeof window.supabase.createClient !== 'function') {
      setupNotice.textContent = 'La bibliothèque Supabase n’a pas pu être chargée. Actualisez la page.';
      setupNotice.classList.remove('hidden');
      return;
    }

    supabaseClient = window.supabase.createClient(config.supabaseUrl, config.supabaseKey, {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
        detectSessionInUrl: true
      }
    });

    const { data, error } = await supabaseClient.auth.getSession();
    if (error) {
      showLogin('Impossible de vérifier la session. Connectez-vous à nouveau.');
      return;
    }

    if (data.session) {
      await verifyMasterAndOpen(data.session.user);
    } else {
      showLogin();
    }
  }

  async function verifyMasterAndOpen(user) {
    signedInUser = user;
    statusLine.textContent = user.email || 'Compte Master';

    const { data: profile, error } = await supabaseClient
      .from('profiles')
      .select('id, display_name, platform_role')
      .eq('id', user.id)
      .maybeSingle();

    if (error || !profile) {
      await supabaseClient.auth.signOut();
      signedInUser = null;
      showLogin('Profil introuvable. Vérifiez que la migration SQL a été exécutée.');
      return;
    }

    if (profile.platform_role !== 'master_admin') {
      await supabaseClient.auth.signOut();
      signedInUser = null;
      showLogin('Ce compte ne possède pas le rôle Master Admin.');
      return;
    }

    showDashboard();
    await loadRestaurants();
  }

  async function loadRestaurants() {
    restaurantsBody.innerHTML = '<tr><td colspan="5" class="px-5 py-8 text-center text-slate-400">Chargement…</td></tr>';

    const { data, error } = await supabaseClient
      .from('restaurants')
      .select('id, slug, name, is_active, currency, created_at')
      .order('created_at', { ascending: false });

    if (error) {
      restaurantsBody.innerHTML = '<tr><td colspan="5" class="px-5 py-8 text-center text-rose-300">Erreur de chargement des restaurants.</td></tr>';
      showMessage(restaurantMessage, error.message, true);
      return;
    }

    document.getElementById('restaurant-count').textContent = String(data.length).padStart(2, '0');
    document.getElementById('active-count').textContent = String(data.filter((item) => item.is_active).length).padStart(2, '0');
    document.getElementById('inactive-count').textContent = String(data.filter((item) => !item.is_active).length).padStart(2, '0');

    if (!data.length) {
      restaurantsBody.innerHTML = '<tr><td colspan="5" class="px-5 py-8 text-center text-slate-400">Aucun restaurant enregistré.</td></tr>';
      return;
    }

    restaurantsBody.innerHTML = data.map((restaurant) => {
      const menuLink = restaurant.slug === 'mimosa'
        ? '<a class="text-emerald-300 hover:text-emerald-200 font-semibold" href="/mimosa">Ouvrir le menu ↗</a>'
        : '<span class="text-slate-500">Route du menu à connecter</span>';
      const activeBadge = restaurant.is_active
        ? '<span class="rounded-full bg-emerald-400/10 text-emerald-300 px-3 py-1.5 text-xs">Actif</span>'
        : '<span class="rounded-full bg-slate-700 text-slate-300 px-3 py-1.5 text-xs">Inactif</span>';

      return '<tr class="border-t border-slate-800">' +
        '<td class="px-5 py-5"><div class="font-bold">' + escapeHtml(restaurant.name) + '</div><div class="text-xs text-slate-500 mt-1">' + escapeHtml(restaurant.currency) + '</div></td>' +
        '<td class="px-5 py-5 font-mono text-xs text-slate-300">' + escapeHtml(restaurant.slug) + '</td>' +
        '<td class="px-5 py-5">' + menuLink + '</td>' +
        '<td class="px-5 py-5">' + activeBadge + '</td>' +
        '<td class="px-5 py-5 text-xs text-slate-500">Données isolées par restaurant</td>' +
      '</tr>';
    }).join('');
  }

  loginForm.addEventListener('submit', async (event) => {
    event.preventDefault();
    loginError.classList.add('hidden');
    const email = document.getElementById('master-email').value.trim();
    const password = document.getElementById('master-password').value;
    const submit = loginForm.querySelector('button[type="submit"]');
    submit.disabled = true;
    submit.textContent = 'Connexion…';

    const { data, error } = await supabaseClient.auth.signInWithPassword({ email, password });
    submit.disabled = false;
    submit.textContent = 'Se connecter';

    if (error) {
      showMessage(loginError, 'Connexion refusée. Vérifiez les identifiants et la configuration Auth.', true);
      return;
    }

    await verifyMasterAndOpen(data.user);
  });

  restaurantForm.addEventListener('submit', async (event) => {
    event.preventDefault();
    restaurantMessage.classList.add('hidden');

    const name = document.getElementById('restaurant-name').value.trim();
    const slug = document.getElementById('restaurant-slug').value.trim().toLowerCase();
    const description = document.getElementById('restaurant-description').value.trim();

    if (!/^[a-z0-9]+(-[a-z0-9]+)*$/.test(slug)) {
      showMessage(restaurantMessage, 'Identifiant invalide : utilisez des lettres minuscules, chiffres et tirets.', true);
      return;
    }

    createButton.disabled = true;
    createButton.textContent = 'Création…';

    const { error } = await supabaseClient.from('restaurants').insert({
      name,
      slug,
      description: description || null,
      currency: 'DZD'
    });

    createButton.disabled = false;
    createButton.textContent = 'Ajouter le restaurant';

    if (error) {
      showMessage(restaurantMessage, error.code === '23505'
        ? 'Cet identifiant existe déjà.'
        : 'Impossible de créer le restaurant : ' + error.message, true);
      return;
    }

    restaurantForm.reset();
    showMessage(restaurantMessage, 'Restaurant ajouté à la base de données.');
    await loadRestaurants();
  });

  logoutButton.addEventListener('click', async () => {
    await supabaseClient.auth.signOut();
    signedInUser = null;
    showLogin('Vous êtes déconnecté.');
  });

  loadSupabase().catch((error) => {
    setupNotice.textContent = 'Erreur initialisation Supabase : ' + error.message;
    setupNotice.classList.remove('hidden');
  });
})();
