# Urban Data Explorer - Documentation des indicateurs et de l'architecture

---

## 2. Architecture des datasets

### 2.1 Rôle de chaque fichier

| Fichier                                                             | Rôle                                                                                                                     |
| ------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------ |
| `csv/arrondissements.csv`                                           | Référence géographique principale pour les 20 arrondissements de Paris. de base de jointure.                             |
| `csv/iris.csv`                                                      | Découpage plus fin en IRIS. Sert à la lecture détaillée et au zoom local.                                                |
| `csv/75.csv`                                                        | Transactions immobilières. Sert à calculer le prix au m², les volumes de ventes et les statistiques de marché.           |
| `csv/logements-sociaux-finances-a-paris.csv`                        | Programmes de logement social financés à Paris. Sert à mesurer l'effort public et sa répartition spatiale et temporelle. |
| `csv/logement-encadrement-des-loyers.csv`                           | Loyers de référence par quartier. Sert à mesurer la tension locative.                                                    |
| `csv/donnee-data.gouv-2025-geographie2025-produit-le2026-02-03.csv` | Grand fichier territorial utilisé pour construire un indicateur de cadre de vie ou de sécurité, traité en chunks.        |

### 2.2 Logique de structuration

Le modèle recommandé est le suivant:

- **Dimension géographique**: arrondissements, IRIS, quartiers.
- **Faits immobilier**: transactions, loyers, logement social, indicateurs territoriaux.
- **Agrégation Gold**: une table consolidée par `arrondissement_num` et `annee` pour le dashboard.

---

## 3. Colonnes gardées et justification

### 3.1 `arrondissements.csv`

Colonnes gardées:

- `Numéro d’arrondissement` devenu `arrondissement_num`
- `Numéro d’arrondissement INSEE` devenu `arrondissement_code_insee`
- `Nom officiel de l’arrondissement` devenu `arrondissement_label`
- `Surface`
- `Périmètre`
- `Geometry X Y`
- `Geometry`

Pourquoi les garder:

- `arrondissement_num` et `arrondissement_code_insee` servent aux jointures avec les autres tables.
- `arrondissement_label` sert à l'affichage dans le dashboard.
- `Surface` et `Périmètre` permettent des comparaisons territoriales.
- `Geometry` est indispensable pour la carte choroplèthe.
- `Geometry X Y` sert de point de repère ou de centroid simplifié.

Colonnes non gardées:

- l'identifiant séquentiel et `N_SQ_CO` ne sont pas nécessaires pour l'usage métier.

### 3.2 `iris.csv`

Colonnes gardées:

- `INSEE_COM` devenu `arrondissement_code_insee`
- `CODE_IRIS` devenu `code_iris`
- `NOM_IRIS` devenu `iris_label`
- `TYP_IRIS` devenu `iris_type`
- `Geo Point`
- `Geo Shape`

Pourquoi les garder:

- `code_iris` est la clé fine de l'échelon IRIS.
- `arrondissement_code_insee` permet de rattacher chaque IRIS à son arrondissement.
- `iris_label` sert au survol et aux menus de sélection.
- `iris_type` permet de distinguer les catégories IRIS.
- `Geo Point` et `Geo Shape` servent à la représentation cartographique.

Colonnes non gardées:

- `DEP`, `IRIS`, `ID`, `NOM_COM` sont redondantes ou inutiles une fois les clés normalisées.

### 3.3 `75.csv` - transactions immobilières

Colonnes gardées:

- `id_mutation`
- `date_mutation`
- `annee`
- `arrondissement_num`
- `code_commune`
- `nom_commune`
- `type_local`
- `surface_reelle_bati`
- `nombre_pieces_principales`
- `valeur_fonciere`
- `prix_m2`
- `longitude`
- `latitude`

Pourquoi les garder:

- `id_mutation` permet d'identifier une transaction unique.
- `date_mutation` et `annee` servent à l'analyse temporelle.
- `arrondissement_num` permet l'agrégation géographique.
- `type_local` permet de distinguer appartement, local, dépendance, etc.
- `surface_reelle_bati` et `valeur_fonciere` servent au calcul des prix.
- `prix_m2` est la métrique centrale du marché de l'achat.
- `nombre_pieces_principales` enrichit l'analyse typologique.
- `longitude` et `latitude` permettent la représentation en points.

Colonnes non gardées:

- les colonnes de lots et de parcelle sont très détaillées mais peu utiles pour le dashboard final.
- les colonnes `ancien_*` sont surtout historiques et non nécessaires pour l'analyse principale.

### 3.4 `logements-sociaux-finances-a-paris.csv`

Colonnes gardées:

- `Identifiant livraison` devenu `identifiant_livraison`
- `Année du financement - agrément` devenu `annee_financement_agrement`
- `Arrondissement` devenu `arrondissement_num`
- `Bailleur social` devenu `bailleur_social`
- `Nature de programme` devenu `programme_type`
- `Nombre total de logements financés` devenu `nombre_total_de_logements_finances`
- `Dont nombre de logements PLA I` devenu `dont_nombre_de_logements_pla_i`
- `Dont nombre de logements PLUS` devenu `dont_nombre_de_logements_plus`
- `Dont nombre de logements PLUS CD` devenu `dont_nombre_de_logements_plus_cd`
- `Dont nombre de logements PLS` devenu `dont_nombre_de_logements_pls`
- `geo_point_2d`
- `geo_shape`

Pourquoi les garder:

- `identifiant_livraison` évite les doublons.
- `annee_financement_agrement` permet le suivi temporel.
- `arrondissement_num` permet l'agrégation géographique.
- `bailleur_social` et `programme_type` donnent de la lecture métier.
- les colonnes de typologie sociale servent à la ventilation PLAI / PLUS / PLS.
- `geo_point_2d` et `geo_shape` servent à l'affichage cartographique.

### 3.5 `logement-encadrement-des-loyers.csv`

Colonnes gardées:

- `Année` devenu `annee`
- `Numéro INSEE du quartier` devenu `numero_insee_du_quartier`
- `Nom du quartier` devenu `quartier`
- `Nombre de pièces principales`
- `Epoque de construction`
- `Type de location`
- `Loyers de référence`
- `Loyers de référence majorés`
- `Loyers de référence minorés`
- `ecart_majore_reference`
- `ecart_reference_minore`
- `geo_point_2d`
- `geo_shape`

Pourquoi les garder:

- `annee` permet le suivi temporel.
- `numero_insee_du_quartier` et `quartier` permettent l'identification locale.
- `Nombre de pièces principales`, `Epoque de construction` et `Type de location` servent aux comparaisons fines.
- les loyers de référence et leurs écarts sont le cœur de l'indicateur de tension locative.
- `geo_point_2d` et `geo_shape` servent à la carte.

### 3.6 `donnee-data.gouv-2025-geographie2025-produit-le2026-02-03.csv`

Colonnes gardées dans le flux de calcul:

- `CODGEO_2025`
- `annee`
- `indicateur`
- `unite_de_compte`
- `nombre`
- `taux_pour_mille`
- `est_diffuse`

Pourquoi les garder:

- `CODGEO_2025` sert au rattachement géographique.
- `annee` permet le suivi temporel.
- `indicateur` permet de sélectionner les familles d'événements pertinentes.
- `nombre` et `taux_pour_mille` sont les valeurs de mesure.
- le traitement en chunks est nécessaire à cause du volume du fichier.

---

## 4. Comment la fusion est faite

La fusion suit une logique progressive:

### 4.1 Nettoyage source par source

Chaque fichier est d'abord:

- chargé avec le bon séparateur,
- normalisé au niveau des noms de colonnes,
- typé correctement,
- filtré sur Paris quand c'est nécessaire,
- dédoublonné,
- enrichi avec des colonnes calculées.

### 4.2 Clés de jointure

Les clés principales utilisées sont:

- `arrondissement_num`,
- `arrondissement_code_insee`,
- `annee`.

Pour les couches fines:

- `code_iris` pour l'IRIS,
- `numero_insee_du_quartier` pour les loyers,
- la géométrie ou les coordonnées pour les points.

---

## 5. Les 4 indicateurs obligatoires

### 5.1 Prix médian au m²

**Ce que ça représente**

Le prix médian au m² mesure le niveau de prix du marché de l'achat dans un arrondissement. La médiane est préférable à la moyenne car elle est moins sensible aux très grosses ventes ou aux valeurs extrêmes.

**Source**

- `csv/75.csv`

**Formule**

Pour chaque transaction valide:

$$
prix_m2 = {valeur_fonciere}/{surface_reelle_bati}
$$

Puis agrégation:

$$
prix_median_m2(arrondissement, annee) = median(prix_m2)
$$

### 5.2 Loyer de référence médian et tension locative

**Ce que ça représente**

Cet indicateur mesure le niveau de loyer de référence et l'écart avec le loyer majoré. Il donne une lecture simple de la tension locative. Le fichier source est d'abord au niveau quartier, puis il peut être affiché tel quel ou agrégé vers l'arrondissement si on ajoute une table de correspondance géographique.

**Source**

- `csv/logement-encadrement-des-loyers.csv`

**Formules**

Écart entre majoré et référence:

$$
ecart_loyer_reference_majoration = loyer_reference_majoration - loyer_reference
$$

Écart entre référence et minoré:

$$
ecart_reference_minore = loyer_de_reference - loyer_de_reference_minores
$$

Puis agrégation:

$$
loyer_reference_median(quartier, annee) = median(loyer_de_reference)
$$

Et si besoin:

$$
loyer\_reference\_median(arrondissement, annee) = median(loyer\_reference\_median(quartier, annee))
$$

### 5.3 Logements sociaux financés

**Ce que ça représente**

Cet indicateur mesure l'effort public de production de logement social dans le temps et par arrondissement.

**Source**

- `csv/logements-sociaux-finances-a-paris.csv`

**Formules**

Nombre total de logements financés:

$$
logements_finances(arrondissement, annee) = \sum nombre_total_de_logements_finances
$$

Nombre de programmes:

$$
nb_programmes_sociaux(arrondissement, annee) = count(identifiant_livraison)
$$

Ventilations:

$$
logements\_plai = \sum dont\_nombre\_de\_logements\_pla\_i
$$

$$
logements\_plus = \sum dont\_nombre\_de\_logements\_plus
$$

$$
logements\_pls = \sum dont\_nombre\_de\_logements\_pls
$$

Part PLAI:

$$
part\_logements\_plai = \frac{logements\_plai}{logements\_finances}
$$

**Affichage conseillé**

- carte de points ou cluster,
- série temporelle,
- histogramme par arrondissement.

### 5.4 Sécurité / cadre de vie

**Ce que ça représente**

Cet indicateur apporte une lecture territoriale complémentaire au logement: il peut refléter le niveau d'incidents, d'infractions ou de violences par arrondissement.

**Source**

- `csv/donnee-data.gouv-2025-geographie2025-produit-le2026-02-03.csv`

**Formules**

Agrégation des indicateurs sélectionnés:

$$
incidents_securite(arrondissement, annee) = sum nombre
$$

$$
taux\_securite\_moyen(arrondissement, annee) = mean(taux\_pour\_mille)
$$

**Affichage conseillé**

- carte par arrondissement,
- évolution annuelle,
- comparaison par type d'indicateur.

---

## 6. Lecture de la table consolidée

La table `mandatory_indicators` contient les colonnes suivantes:

- `arrondissement_num`
- `arrondissement_label`
- `annee`
- `prix_median_m2`
- `nb_transactions`
- `loyer_reference_median`
- `loyer_majorer_median`
- `ecart_loyer_reference_majoration`
- `logements_finances`
- `part_logements_plai`
- `incidents_securite`
- `taux_securite_moyen`

Elle sert de base directe pour le dashboard.

---

## 7. Gestion des valeurs manquantes

Les `NaN` restants ont plusieurs causes:

- données absentes dans la source d'origine,
- surfaces non renseignées dans certaines transactions,
- absence de correspondance entre toutes les sources pour toutes les années,
- jointures externes qui conservent des lignes même si une source n'a pas de valeur.

Les principaux choix de nettoyage ont été:

- convertir les chaînes en numériques avec `errors="coerce"`,
- calculer les métriques seulement si les champs nécessaires existent,
- filtrer les prix au m² aberrants,
- garder les jointures externes pour ne pas perdre d'information géographique ou temporelle.

---

## 8. Résultat attendu

À la fin du pipeline, on obtient:

- des tables propres par source,
- une table Gold consolidée par arrondissement et année,
- les 4 indicateurs obligatoires,
- une base exploitable par une API,
- une base exploitable par une carte et un dashboard.

---

## 9. Formules résumées

$$
prix\_m2 = \frac{valeur\_fonciere}{surface\_reelle\_bati}
$$

$$
prix\_median\_m2 = median(prix\_m2)
$$

$$
ecart\_majore\_reference = loyer\_reference\_majores - loyer\_reference
$$

$$
ecart\_reference\_minore = loyer\_reference - loyer\_reference\_minores
$$

$$
logements\_finances = \sum nombre\_total\_de\_logements\_finances
$$

$$
part\_logements\_plai = \frac{logements\_plai}{logements\_finances}
$$

$$
incidents\_securite = \sum nombre
$$

$$
taux\_securite\_moyen = mean(taux\_pour\_mille)
$$

INDICATEURS :

prix médian au m² par arrondissement et par année,
nombre de logements sociaux financés par arrondissement et par année
repartition du parc
mesures accesibilité

loyer de référence médian avec l’écart entre loyer de référence et loyer majoré,
indicateur de sécurité ou cadre de vie par arrondissement.
indicateur de consommation energetique par arrondissement ,
indicateur de polution par arondissement
