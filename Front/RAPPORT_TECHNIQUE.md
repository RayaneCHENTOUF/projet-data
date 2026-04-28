# Rapport Technique : Paris Urban Explorer

**Date :** 27 Avril 2026  
**Version :** 1.2.0  
**Auteur :** Antigravity AI Engineering  

---

## 1. Introduction
Le projet **Paris Urban Explorer** est une plateforme de visualisation de données géospatiales conçue pour explorer les 80 quartiers administratifs de Paris. L'objectif est de fournir une interface immersive, performante et esthétiquement premium pour l'analyse des KPIs de confort urbain.

## 2. Stack Technique
Le choix de la stack a été guidé par des impératifs de fluidité cartographique et de modularité.

*   **Frontend Core :** React 18, TypeScript, ViteJS. Garantit une réactivité optimale et une gestion rigoureuse des types pour les données GeoJSON complexes.
*   **Cartographie :** MapLibre GL, React-Map-GL. Utilisation de moteurs vectoriels haute performance permettant un rendu 60fps.
*   **Stylisation :** Tailwind CSS, Lucide React. Design système utilitaire pour un contrôle précis des micro-animations et du thème sombre (Slate palette).
*   **Data Pipeline :** Overpass API, GeoJSON. Récupération dynamique des adresses via OpenStreetMap et structuration spatiale native.

## 3. Architecture de l'Interface
L'interface est segmentée en trois zones distinctes mais interconnectées par un état global réactif.

### A. Le Moteur Cartographique
Basé sur `MapLibre GL`, il utilise un fond de carte customisé via *OpenFreeMap* (Dark Style). Les quartiers sont injectés via une `Source` GeoJSON, avec des calques (Layers) pour le remplissage, les bordures et les états de survol (hover).

### B. La Barre Supérieure (Top Bar)
Introduite dans la version 1.2, cette zone concentre les informations **morphologiques** du quartier sélectionné. 
*   **Design :** Glassmorphism (flou d'arrière-plan de 10px).
*   **Données :** Superficie (ha) et Périmètre (km).
*   **Interaction :** Apparition fluide uniquement lors de la sélection d'un quartier.

### C. La Sidebar de Données (KPI)
La sidebar est l'élément central de l'analyse métier. Elle a été épurée pour se concentrer sur les indicateurs de performance.
*   **Entête :** Identité du quartier et bouton de fermeture.
*   **Zone KPI :** Cards arrondissement et placeholders "Confort Urbain" pour l'intégration API Gold.
*   **Exploration Adresses :** Liste scrollable des adresses récupérées via Overpass API.

## 4. Conception UX & Design
Le choix de la palette `Slate` (Ardoise) permet de faire ressortir les couleurs vives des quartiers sans fatiguer l'utilisateur. Les contrastes respectent les normes d'accessibilité WCAG.

## 5. Conclusion
L'interface actuelle constitue une fondation solide, prête pour la phase de "Data Binding" finale. La séparation claire entre les informations spatiales et analytiques garantit une scalabilité maximale du dashboard.
