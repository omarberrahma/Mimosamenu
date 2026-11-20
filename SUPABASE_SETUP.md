# Configurer Supabase pour RestoMenu

Cette étape connecte l'espace Master à Supabase Auth et Postgres.

## 1. Créer le projet Supabase

1. Créez un projet dans Supabase.
2. Ouvrez **SQL Editor**.
3. Exécutez tout le fichier `supabase/migrations/20261120000000_restomenu_multitenant.sql`.

La migration crée les profils, restaurants, membres, catégories et produits. Elle active RLS et ajoute les premières règles d'accès. Elle enregistre aussi Mimosa comme premier restaurant.

## 2. Créer le compte Master

1. Dans **Authentication → Users**, créez un utilisateur avec votre e-mail et un mot de passe fort.
2. Copiez son User UID.
3. Dans SQL Editor, exécutez en remplaçant le UUID :

```sql
update public.profiles
set platform_role = 'master_admin'
where id = 'COLLER-ICI-LE-USER-UID';
```

Ne donnez jamais le rôle `master_admin` depuis le navigateur. La migration n'accorde aux utilisateurs le droit de modifier que leur nom d'affichage, pas leur rôle.

## 3. Configurer Vercel

Dans **Project → Settings → Environment Variables**, ajoutez :

- `SUPABASE_URL` — Project URL.
- `SUPABASE_PUBLISHABLE_KEY` — publishable key du projet.

Pour un projet ancien, `SUPABASE_ANON_KEY` est aussi accepté par le code. Le code ne renvoie jamais de service-role key au navigateur.

Redéployez ensuite Vercel pour appliquer les variables.

## 4. Tester

1. Ouvrez `/root`.
2. Connectez-vous avec l'utilisateur Master créé.
3. Vérifiez que Mimosa apparaît dans la liste.
4. Ajoutez un restaurant de test avec un slug unique.

## État des fonctions

- Connexion e-mail/mot de passe via Supabase Auth : implémentée, après configuration.
- Vérification du rôle Master depuis la table profiles : implémentée.
- Liste et création des enregistrements restaurants : implémentées, après migration.
- Cloisonnement par RLS : tables et règles de base créées.
- Invitations de comptes restaurant : pas encore implémentées.
- Menus publics dynamiques pour chaque slug : pas encore implémentés.
- Gestion CRUD des catégories et produits depuis Dashboard : pas encore implémentée.
- Commandes stockées et affichées : pas encore implémenté.

## Sécurité

Le client Supabase utilise uniquement une clé publishable/anon. Ne stockez pas `service_role`, mots المرور ou secrets dans GitHub, HTML, ou JavaScript côté client. RLS est la barrière de sécurité réelle pour les données exposées.
