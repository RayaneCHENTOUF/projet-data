# 🏙️ Urban Data Explorer — Paris Dashboard

> Interface moderne de visualisation des indicateurs clés (KPI) immobiliers et urbains de la ville de Paris.

Ce projet est une application frontend interactive permettant d'explorer les 80 quartiers administratifs de Paris à travers divers prismes : confort urbain, sûreté, prix de l'immobilier, encadrement des loyers et logements sociaux.

---

## 🚀 Fonctionnalités

- **Carte Interactive** : Navigation par quartier et arrondissement sur un fond de carte Mapbox.
- **Tableau de Bord KPI** : Visualisation détaillée des scores et données historiques pour chaque quartier.
- **Classement par Arrondissement** : Comparaison des quartiers au sein d'un même arrondissement.
- **Recherche d'Adresse** : Localisation précise et identification du quartier correspondant.
- **Design Premium** : Interface sombre moderne avec effets de flou (glassmorphism) et animations fluides.

---

## 🛠️ Installation et Lancement

### Prérequis
- [Node.js](https://nodejs.org/) (version 16+)
- [npm](https://www.npmjs.com/)

### Lancement local
1. Allez dans le dossier frontend :
   ```bash
   cd front
   ```
2. Installez les dépendances :
   ```bash
   npm install
   ```
3. Lancez le serveur de développement :
   ```bash
   npm run dev
   ```

L'application sera accessible sur `http://localhost:5173`.

---

## 📂 Structure du Projet

L'application est désormais **front-only**, utilisant des données locales pré-calculées :

```
projet-data/
│
├── front/                   # Application React + Vite + TypeScript
│   ├── src/
│   │   ├── components/      # Composants UI (Carte, Sidebar, KPI, Ranking)
│   │   ├── data/            # Données JSON locales (Quartiers, KPI, Mocks)
│   │   ├── services/        # Service de données (Mock API Service)
│   │   └── App.tsx          # Point d'entrée principal
│   ├── index.css            # Design system (TailwindCSS)
│   └── package.json         # Dépendances frontend
│
└── README.md
```

---

## 📊 Données
Les données affichées proviennent de sources Open Data Paris (DVF, INSEE, Ville de Paris) et ont été intégrées directement sous forme de fichiers JSON dans l'application pour permettre un fonctionnement autonome sans backend.

---

## 👥 Équipe
Réalisé par Chentouf Rayan, Yacine Bakour, Nawfel Younes et Alexandre Kosutic dans le cadre du cursus **Data Engineering — EFREI Paris**.

