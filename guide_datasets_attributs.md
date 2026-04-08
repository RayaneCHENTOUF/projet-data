# Guide des datasets présents et de leurs attributs

1.  Transactions immobilières – DVF (Demandes de Valeurs Foncières)

Source officielle des ventes immobilières (prix, surfaces, localisation)
Contient : prix, surface, type de bien, date, coordonnées géographiques…

Télécharger les données DVF (avec géolocalisation)
https://www.data.gouv.fr/datasets/demandes-de-valeurs-foncieres-geolocalisees/

Remarque : il s’agit de la version DVF enrichie, plus facile à exploiter qu’avec le fichier brut.

2. Géographie administrative – IRIS

Découpage officiel des zones IRIS (polygones) utilisé par l’INSEE
Sert à agréger toutes les données au bon niveau géographique.

Contours des IRIS
https://www.data.gouv.fr/fr/datasets/contours-des-iris/

3. Loyers de référence – Paris
   Jeux de données officiels des loyers par quartier à Paris
   Contient : loyers de référence, loyers majorés, loyers minorés + géométrie de quartier.

Encadrement des loyers – Paris Data
https://opendata.paris.fr/explore/dataset/logement-encadrement-des-loyers/

4. Logement social – Paris

Données du parc social / logements sociaux financés à Paris
Sert à mesurer la part de logement social par zone

Logements sociaux financés à Paris
https://opendata.paris.fr/explore/dataset/logement-social-finances-a-paris/

(c’est exactement le dataset dont tu m’as parlé, donc oui il est retenu)

## Objectif

Ce document résume les datasets disponibles dans le projet, leurs colonnes principales, les attributs les plus importants pour l'analyse, et la façon de les relier.

Source utilisée : documentation_urban_data_explorer.md + entêtes réelles des fichiers CSV dans le dossier csv.

## 1) Vue d'ensemble des datasets présents

| Fichier                                                           | Dataset                             | Rôle                                                       | Statut projet |
| ----------------------------------------------------------------- | ----------------------------------- | ---------------------------------------------------------- | ------------- |
| csv/75.csv                                                        | DVF (transactions immobilières)     | Dataset coeur (prix, surface, type, date, géolocalisation) | Prioritaire   |
| csv/iris.csv                                                      | IRIS (INSEE)                        | Référentiel géographique (zones IRIS)                      | Prioritaire   |
| csv/logement-encadrement-des-loyers.csv                           | Loyers de référence Paris           | Comparer achat vs location                                 | Prioritaire   |
| csv/logements-sociaux-finances-a-paris.csv                        | Logements sociaux financés          | Contexte urbain/politique publique                         | Prioritaire   |
| csv/arrondissements.csv                                           | Limites administratives de Paris    | Jointures/cartographie d'appui                             | Support       |
| csv/donnee-data.gouv-2025-geographie2025-produit-le2026-02-03.csv | Délinquance signalée (par code géo) | Indicateur complémentaire (optionnel)                      | Optionnel     |

## 2) Attributs importants par dataset

### A. DVF - csv/75.csv

Colonnes disponibles (principales) :
id_mutation, date_mutation, nature_mutation, valeur_fonciere, adresse_numero, adresse_nom_voie, code_postal, nom_commune, type_local, surface_reelle_bati, nombre_pieces_principales, surface_terrain, longitude, latitude.

Attributs les plus importants :

| Attribut                  | Importance | Pourquoi                                       |
| ------------------------- | ---------- | ---------------------------------------------- |
| valeur_fonciere           | Critique   | Calcul du prix et du prix au m2                |
| surface_reelle_bati       | Critique   | Dénominateur du prix au m2                     |
| date_mutation             | Critique   | Analyse temporelle (evolution)                 |
| type_local                | Elevee     | Segmentation par type de bien                  |
| longitude, latitude       | Critique   | Jointure spatiale avec IRIS (point-in-polygon) |
| code_postal               | Elevee     | Contrôles territoriaux / agrégations           |
| nombre_pieces_principales | Moyenne    | Analyse typologique complémentaire             |

KPI direct :

- prix_m2 = valeur_fonciere / surface_reelle_bati

### B. IRIS - csv/iris.csv

Colonnes disponibles :
Geo Shape, DEP, INSEE_COM, NOM_COM, IRIS, CODE_IRIS, NOM_IRIS, TYP_IRIS, Geo Point, ID.

Attributs les plus importants :

| Attribut  | Importance | Pourquoi                                      |
| --------- | ---------- | --------------------------------------------- |
| CODE_IRIS | Critique   | Clé géographique cible pour agréger les KPI   |
| Geo Shape | Critique   | Polygone nécessaire pour la jointure spatiale |
| NOM_IRIS  | Elevee     | Lisibilité dans cartes/tableaux               |
| TYP_IRIS  | Moyenne    | Catégorisation urbaine                        |
| INSEE_COM | Elevee     | Contrôle de cohérence communale               |

### C. Loyers - csv/logement-encadrement-des-loyers.csv

Colonnes disponibles :
Année, Secteurs géographiques, Numéro du quartier, Nom du quartier, Nombre de pièces principales, Epoque de construction, Type de location, Loyers de référence, Loyers de référence majorés, Loyers de référence minorés, Ville, Numéro INSEE du quartier, geo_shape, geo_point_2d.

Attributs les plus importants :

| Attribut                     | Importance | Pourquoi                        |
| ---------------------------- | ---------- | ------------------------------- |
| Loyers de référence          | Critique   | Base du loyer de comparaison    |
| Loyers de référence majorés  | Elevee     | Encadrement haut                |
| Loyers de référence minorés  | Elevee     | Encadrement bas                 |
| Nombre de pièces principales | Elevee     | Comparaison loyer par typologie |
| Année                        | Critique   | Alignement temporel avec DVF    |
| geo_shape / geo_point_2d     | Critique   | Rattachement spatial aux zones  |
| Numéro INSEE du quartier     | Elevee     | Clé territoriale complémentaire |

KPI direct :

- tension_immobiliere = prix_m2 / loyer_m2
- rentabilite_locative_brute = (loyer_mensuel \* 12) / prix_bien

### D. Logements sociaux - csv/logements-sociaux-finances-a-paris.csv

Colonnes disponibles :
Identifiant livraison, Adresse du programme, Code postal, Ville, Année du financement - agrément, Bailleur social, Nombre total de logements financés, Dont nombre de logements PLA I, Dont nombre de logements PLUS, Dont nombre de logements PLUS CD, Dont nombre de logements PLS, Mode de réalisation, Commentaires, Arrondissement, Nature de programme, Coordonnée en X (L93), Coordonnée en Y (L93), geo_shape, geo_point_2d.

Attributs les plus importants :

| Attribut                                     | Importance | Pourquoi                                   |
| -------------------------------------------- | ---------- | ------------------------------------------ |
| Nombre total de logements financés           | Critique   | Mesure principale de l'effort social       |
| Arrondissement                               | Critique   | Agrégation territoriale simple             |
| Année du financement - agrément              | Elevee     | Analyse temporelle                         |
| Bailleur social                              | Moyenne    | Analyse acteur/opérateur                   |
| Coordonnée en X (L93), Coordonnée en Y (L93) | Elevee     | Géolocalisation (si conversion nécessaire) |
| geo_shape / geo_point_2d                     | Elevee     | Jointures spatiales                        |

### E. Arrondissements - csv/arrondissements.csv (support)

Colonnes utiles :
Numéro d'arrondissement, Numéro d'arrondissement INSEE, Nom de l'arrondissement, Surface, Périmètre, Geometry.

Utilité :

- cartographie de référence Paris,
- jointures administratives,
- normalisation des libellés d'arrondissement.

### F. Délinquance signalée - csv/donnee-data.gouv-2025-geographie2025-produit-le2026-02-03.csv (optionnel)

Colonnes disponibles :
CODGEO_2025, annee, indicateur, unite_de_compte, nombre, taux_pour_mille, est_diffuse, insee_pop, insee_pop_millesime, insee_log, insee_log_millesime, complement_info_nombre, complement_info_taux.

Attributs utiles (si activé plus tard) :

- CODGEO_2025,
- annee,
- indicateur,
- nombre / taux_pour_mille.

## 3) Clés de liaison recommandées

1. DVF -> IRIS : jointure spatiale

- Point : longitude, latitude (DVF)
- Polygone : Geo Shape (IRIS)
- Résultat : attribution d'un CODE_IRIS à chaque transaction.

2. KPI IRIS -> Loyers

- Priorité : jointure spatiale via geo_shape / geo_point_2d.
- Alternative : correspondance par quartier/INSEE si la géométrie n'est pas exploitable.

3. KPI IRIS -> Logements sociaux

- Option A (simple) : agrégation par Arrondissement.
- Option B (plus précise) : géolocalisation puis affectation par zone IRIS.

## 4) Attributs critiques minimum pour un pipeline fonctionnel

Pour avancer rapidement, garder au minimum ces champs :

- DVF : valeur_fonciere, surface_reelle_bati, date_mutation, type_local, longitude, latitude
- IRIS : CODE_IRIS, Geo Shape
- Loyers : Année, Loyers de référence, Nombre de pièces principales, geo_shape
- Logements sociaux : Nombre total de logements financés, Arrondissement, Année du financement - agrément

## 5) Table de sortie cible (rappel)

Table KPI recommandée : kpi_par_iris

- CODE_IRIS
- prix_m2_moyen
- prix_m2_median
- nb_transactions
- loyer_moyen
- rentabilite
- tension_immobiliere
- nb_logements_sociaux

Ce document est volontairement orienté exécution (ETL + KPI), pour servir de référence pendant le développement.

## 5. KPI attendus (brief projet)

1. **Prix median au m2 par arrondissement**
2. **Variation du prix au m2 dans le temps**
3. **Repartition du parc par type/surface**
4. **Accessibilite (prix/loyers vs revenus)**
5. **Part de logements sociaux et evolution**
6. **Score de securité ?**
7. **scorede polution**
