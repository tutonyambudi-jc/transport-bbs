# 🚌 Plateforme Aigle Royale - Réservation de Billets de Bus & Gestion de Fret

Plateforme web complète pour la réservation et la vente de billets de bus avec gestion de fret et module publicitaire.

## 🚀 Fonctionnalités

### Module Client
- Recherche de trajets (ville départ/arrivée, date)
- Choix de siège interactif sur plan du bus
- Réservation et paiement (Mobile Money, Carte bancaire, Paiement en agence)
- Génération de billets électroniques avec QR code
- Historique des voyages
- Annulation/modification de réservations

### Module Agents Agréés
- Vente de billets pour clients
- Vente de fret (colis)
- Impression ou envoi de billets
- Commission automatique par vente
- Historique des transactions
- Rapports journaliers

### Module Agence Mère
- Vente directe au guichet
- Réservation pour paiement ultérieur
- Gestion des clients sans compte
- Impression de billets officiels
- Suivi caisse journalière

### Module Gestion du Fret
- Enregistrement de colis (poids, type, valeur)
- Association colis ↔ voyage
- Code de suivi unique
- Statuts : reçu / en transit / livré
- Tarification automatique

### Module Publicité
- Vente d'espaces publicitaires (bannières homepage, résultats, confirmation)
- Gestion des annonceurs
- Statistiques d'impressions & clics
- Facturation annonceurs

### Back-Office
- Gestion des bus & flotte
- Gestion des trajets & horaires
- Tarification
- Gestion des agences & agents
- Utilisateurs & rôles
- Tableau de bord avec KPI
- Rapports exportables (Excel / PDF)

## 🛠️ Technologies

- **Frontend**: Next.js 14, React, TypeScript, Tailwind CSS
- **Backend**: Next.js API Routes
- **Base de données**: PostgreSQL avec Prisma ORM
- **Authentification**: NextAuth.js
- **Validation**: Zod, React Hook Form

## 📦 Installation

1. Cloner le projet
```bash
git clone <repository-url>
cd "Aigle royale"
```

2. Installer les dépendances
```bash
npm install
```

3. Configurer la base de données
```bash
# Créer un fichier .env à partir de env.example
# Windows PowerShell :
Copy-Item env.example .env

# Modifier DATABASE_URL dans .env avec vos credentials PostgreSQL

# Générer le client Prisma
npm run db:generate

# Créer la base de données et appliquer les migrations
npm run db:push
```

4. Lancer le serveur de développement
```bash
npm run dev
```

5. Ouvrir [http://localhost:3000](http://localhost:3000)

## 📁 Structure du Projet

```
├── app/                    # App Router Next.js
│   ├── (auth)/            # Routes d'authentification
│   ├── (client)/          # Interface client
│   ├── (agent)/           # Interface agent agréé
│   ├── (agency)/          # Interface agence mère
│   ├── (admin)/           # Back-office
│   └── api/               # API Routes
├── components/            # Composants React réutilisables
├── lib/                   # Utilitaires et configurations
├── prisma/                # Schéma Prisma
└── public/                # Assets statiques
```

## 🔐 Rôles Utilisateurs

- **CLIENT**: Achat de billets et envoi de colis
- **AGENT**: Vente de billets & fret via le système
- **AGENCY_STAFF**: Vente physique centralisée
- **ADMINISTRATOR**: Supervision globale
- **ACCOUNTANT**: Suivi financier
- **SUPERVISOR**: Contrôle des agences et agents

## 📝 Scripts Disponibles

- `npm run dev` - Lancer le serveur de développement
- `npm run build` - Construire pour la production
- `npm run start` - Lancer le serveur de production
- `npm run db:generate` - Générer le client Prisma
- `npm run db:push` - Pousser les changements vers la DB
- `npm run db:migrate` - Créer une migration
- `npm run db:studio` - Ouvrir Prisma Studio

## 🔒 Sécurité

- Authentification sécurisée avec NextAuth.js
- Hashage des mots de passe avec bcryptjs
- Validation des données avec Zod
- Protection CSRF intégrée
- Gestion des rôles et permissions

## 📄 Licence

Propriétaire - Aigle Royale
# eticketbbs
# -Aigleroyale.
