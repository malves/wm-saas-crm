# NewsletterPro CRM

Application Node.js de gestion de newsletters et CRM, construite avec Express et EJS.

## Architecture

- **Backend**: Node.js + Express
- **Templates**: EJS (Embedded JavaScript)
- **CSS**: Tailwind CSS (via CDN)
- **Base de données**: JSON (fichier local avec écriture atomique)
- **Authentification**: Sessions + bcrypt

## Structure

```
src/
├── config/          # Configuration (port, sessions)
├── data/            # Base de données JSON
├── repositories/    # Couche d'accès aux données (pattern Repository)
├── services/        # Logique métier
├── controllers/     # Controllers Express
├── routes/          # Routes Express
├── middlewares/     # Middlewares (auth, validation, etc.)
├── views/           # Templates EJS
│   ├── layouts/     # Layouts principaux
│   ├── partials/    # Composants réutilisables
│   └── pages/       # Pages de l'application
└── app.js           # Point d'entrée
```

## Installation

```bash
# Installer les dépendances
npm install

# Créer le premier utilisateur admin (optionnel si db.json existe déjà)
node scripts/createAdmin.js
```

## Utilisation

```bash
# Développement (avec auto-reload)
npm run dev

# Production
npm start
```

L'application sera accessible sur **http://localhost:3000**

## Compte par défaut

- **Email**: admin@newsletterpro.com
- **Mot de passe**: admin123

⚠️ **Changez ce mot de passe après la première connexion!**

## Fonctionnalités

### Authentification
- ✅ Inscription avec validation
- ✅ Connexion avec bcrypt
- ✅ Déconnexion
- ✅ Protection des routes
- 🚧 Récupération de mot de passe (structure prête)

### Newsletters (CRUD complet)
- ✅ Créer une newsletter
- ✅ Lister toutes les newsletters
- ✅ Voir les détails d'une newsletter
- ✅ Modifier une newsletter
- ✅ Supprimer une newsletter

### Abonnés (CRUD complet)
- ✅ Ajouter un abonné
- ✅ Lister tous les abonnés
- ✅ Supprimer un abonné
- ✅ Gérer les abonnements aux newsletters

### Activité
- ✅ Journal d'activité
- ✅ Vue collection
- ✅ Statistiques en temps réel

## Routes principales

| Route | Méthode | Protection | Description |
|-------|---------|------------|-------------|
| `/` | GET | Auth requise | Dashboard |
| `/newsletters` | GET | Auth requise | Liste des newsletters |
| `/newsletters/create` | GET/POST | Auth requise | Créer une newsletter |
| `/newsletters/:id` | GET | Auth requise | Détails d'une newsletter |
| `/newsletters/:id/edit` | GET/POST | Auth requise | Modifier une newsletter |
| `/newsletters/:id/delete` | POST | Auth requise | Supprimer une newsletter |
| `/subscribers` | GET | Auth requise | Liste des abonnés |
| `/subscribers/create` | GET/POST | Auth requise | Ajouter un abonné |
| `/activity` | GET | Auth requise | Journal d'activité |
| `/auth/login` | GET/POST | Guest uniquement | Connexion |
| `/auth/register` | GET/POST | Guest uniquement | Inscription |
| `/auth/logout` | GET | - | Déconnexion |

## Architecture des données

Le fichier `src/data/db.json` contient 4 collections:

- **users**: Utilisateurs avec mots de passe hashés
- **newsletters**: Newsletters avec stats
- **subscribers**: Abonnés et leurs abonnements
- **activities**: Journal des activités

## Avantages de cette architecture

1. **Séparation des responsabilités**: Pattern MVC avec couche Repository
2. **Maintenabilité**: Pas de duplication, composants réutilisables
3. **Évolutivité**: Remplacer JSON par SQL/MongoDB sans toucher aux controllers
4. **Sécurité**: Mots de passe hashés, sessions sécurisées, validation des entrées
5. **Simplicité**: Stack minimale, pas de build process

## Migration future vers base de données

Pour migrer vers MySQL/PostgreSQL/MongoDB:

1. Installer le driver (pg, mysql2, mongoose)
2. Créer un nouveau service (ex: `sqlDatabaseService.js`)
3. Remplacer `require('../data/jsonDatabaseService')` dans les repositories
4. **Aucun changement** dans controllers, services ou routes!

## Variables d'environnement

Créez un fichier `.env`:

```
PORT=3000
NODE_ENV=development
SESSION_SECRET=votre-secret-super-securise-ici
```

## Développement

Pour ajouter une nouvelle fonctionnalité:

1. **Repository**: Ajouter méthodes d'accès aux données
2. **Service**: Ajouter logique métier
3. **Controller**: Ajouter actions
4. **Routes**: Définir les routes
5. **Views**: Créer les templates EJS

## Support

Pour toute question, consultez la documentation Express et EJS.
