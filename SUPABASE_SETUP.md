# Configurer Supabase et Vercel pour RestoMenu

Cette configuration active le compte Master, la base de données multi-restaurants et les menus publics.

## 1. Créer le projet Supabase

1. Créez un projet Supabase.
2. Ouvrez **SQL Editor**.
3. Exécutez les fichiers dans cet ordre :
   - `supabase/migrations/20261120000000_restomenu_multitenant.sql`
   - `supabase/migrations/20261120010000_seed_mimosa_menu.sql`

Le premier fichier crée les profils, restaurants, membres, catégories et produits, puis active les politiques Row Level Security (RLS). Le deuxième importe les 4 catégories et les 12 produits actuellement présents dans le menu Mimosa.

## 2. Créer le compte Master

1. Dans **Authentication → Users**, créez l'utilisateur qui sera l'administrateur principal.
2. Copiez son **User UID**.
3. Dans SQL Editor, attribuez-lui le rôle Master en remplaçant le UUID :

```sql
update public.profiles
set platform_role = 'master_admin'
where id = 'COLLER-ICI-LE-USER-UID';
```

La migration crée automatiquement un profil normal pour chaque utilisateur Auth. Elle n'attribue jamais le rôle Master automatiquement. Ne donnez pas ce rôle depuis le navigateur.

Pour cette première version, gardez la création des comptes sous contrôle depuis Supabase. Le formulaire d'inscription/invitation des administrateurs de restaurants sera ajouté dans une prochaine étape.

## 3. Configurer Vercel

Dans **Project → Settings → Environment Variables**, ajoutez :

- `SUPABASE_URL` — Project URL.
- `SUPABASE_PUBLISHABLE_KEY` — publishable key du projet.

Pour un ancien projet, `SUPABASE_ANON_KEY` est également accepté. Le code envoie uniquement cette clé publique au navigateur. **N'ajoutez jamais la clé `service_role` dans le HTML, JavaScript ou une variable publique.**

Redéployez le projet Vercel après avoir enregistré les variables.

## 4. Tester la première version

1. Ouvrez `/root` et connectez-vous avec le compte Master.
2. Vérifiez que Mimosa apparaît dans le tableau.
3. Ouvrez `/mimosa` : le menu devrait être chargé depuis Supabase après les deux migrations.
4. Ajoutez un restaurant test avec un slug unique, par exemple `dar-lben`.
5. Son URL publique sera `/dar-lben`. Il affichera un message de préparation tant que ses catégories et produits n'auront pas été ajoutés.

## Ce qui fonctionne dans cette version

- Connexion e-mail/mot de passe via Supabase Auth.
- Vérification du rôle `master_admin` avant l'accès au tableau Master.
- Liste des restaurants et création de nouveaux enregistrements.
- Isolation des restaurants par RLS et memberships.
- Lecture publique des restaurants actifs, catégories actives et produits disponibles.
- Route publique par slug et chargement du menu depuis Supabase.
- Import du menu Mimosa actuel : 4 catégories et 12 produits multilingues.
- Menu Mimosa statique conservé comme solution de secours si Supabase n'est pas configuré ou si le menu DB est vide.
- Commande WhatsApp ; un restaurant sans numéro configuré reçoit un message explicite au lieu d'un lien erroné.

## Ce qui reste à développer

- Invitation et gestion des comptes administrateurs de restaurants.
- Éditeur de catégories, produits, prix, photos et suppléments dans le dashboard.
- Gestion des commandes dans la base et affichage cuisine/POS.
- Gestion des paramètres de restaurant et des abonnements.
- Tests automatisés des politiques RLS et vérification en environnement Supabase réel.

## Sécurité

Les tables exposées sont protégées par des politiques RLS. Le rôle Master est attribué manuellement dans Supabase SQL Editor. La clé publishable/anon n'est pas un secret et ne remplace pas RLS ; la clé `service_role` contourne RLS et doit rester exclusivement côté serveur.
