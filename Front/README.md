# Paris Urban Explorer - Frontend

Un frontend interactif basé sur Mapbox pour explorer les données urbaines de Paris.

## 🚀 Caractéristiques

- 🗺️ Carte interactive Mapbox centrée sur Paris
- 📊 Couches de données multiples :
  - Zones IRIS
  - Logements sociaux
  - Transactions immobilières (DVF)
  - Encadrement des loyers
  - Signalements de délinquance
  - Gares et transports
- 🎛️ Filtres interactifs
- 📈 Panneau de statistiques en temps réel
- 🌙 Interface sombre professionnelle

## 📋 Prérequis

- Node.js 18+
- npm ou yarn
- Compte Mapbox (token d'API gratuit)

## 🔧 Installation

1. Cloner le repository
```bash
cd Front
npm install
```

2. Configurer le token Mapbox
```bash
cp .env.example .env.local
# Éditer .env.local et ajouter votre token Mapbox
```

3. Lancer le serveur de développement
```bash
npm run dev
```

L'application s'ouvre automatiquement sur `http://localhost:5173`

## 📦 Dépendances principales

- **React 18** - Bibliothèque UI
- **Vite** - Bundler ultra-rapide
- **Mapbox GL JS** - Cartographie
- **Tailwind CSS** - Styling
- **Recharts** - Graphiques
- **Lucide React** - Icons

## 🏗️ Structure du projet

```
src/
├── components/
│   ├── Map/          - Composant carte Mapbox
│   ├── Sidebar/      - Panneau latéral (filtres + stats)
│   └── Header/       - En-tête
├── main.tsx          - Point d'entrée React
├── App.tsx           - Composant principal
└── index.css         - Styles globaux (Tailwind)
```

## 🛠️ Développement

### Fichiers de configuration
- `vite.config.ts` - Configuration Vite
- `tsconfig.json` - Configuration TypeScript
- `tailwind.config.js` - Configuration Tailwind CSS

### Build
```bash
npm run build  # Production build
npm run preview  # Aperçu du build
```

## 🌐 Connexion avec le backend

Le frontend est prêt à se connecter à une API backend. Modifier l'URL API dans `.env.local` :
```
VITE_API_URL=http://localhost:3000/api
```

## 📝 Notes

- Le token Mapbox doit être remplacé dans `src/components/Map/Map.tsx`
- Les données des sources GeoJSON doivent être alimentées depuis l'API backend
- Les statistiques du panneau sont actuellement en placeholders

## 📄 Licence

MIT
