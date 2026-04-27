# Urban Data Explorer - Projet Data

## Objectif

Ce projet construit des indicateurs immobiliers et urbains sur Paris avec une architecture Bronze -> Silver -> Gold.

- Bronze: donnees brutes source
- Silver: donnees nettoyees et preparees
- Gold: KPI finaux prets pour SQL, API et dataviz

## Structure du projet

- `data/bronze`: sources brutes par domaine
- `data/silver`: tables intermediaires nettoyees
- `data/gold`: KPI finaux
- `pipeline/silver`: notebooks de preparation et calcul KPI
- `pipeline/gold`: scripts de controle/validation Gold
- `sql`: scripts de creation des tables fact
- `docs`: documentation KPI, audit, standards

## KPI Gold disponibles

### KPI obligatoires

1. `kpi_prix_m2_arrondissement.csv`
2. `kpi_evolution_achat_prix_m2.csv`
3. `kpi_repartition_logements_sociaux.csv`
4. `kpi_comparaison_achat_location.csv`

### KPI additionnels

1. `kpi_score_surete_iris.csv`
2. `kpi_score_surete_arrondissement_agrege_depuis_iris.csv`
3. `gold_kpi_confort_urbain.csv`
4. `kpi_evolution_location_loyer.csv`

## Pipelines principaux

- `pipeline/silver/pipeline_prix_m2.ipynb`
- `pipeline/silver/pipeline_surete.ipynb`
- `pipeline/silver/kpi_confort_urbain.ipynb`
- `pipeline/silver/pipeline_comparaison_achat_location.ipynb`

## SQL

- Script consolide recommande: `sql/create_tables_gold_all.sql`
- Scripts historiques conserves: `sql/create_tables_kpi_rayan.sql`, `sql/create_tables_gold_kpi_confort.sql`

## Regles de coherence (Phase 2)

- Convention de nommage et schemas: voir `docs/project_standards.md`
- Audit initial: voir `docs/audit_phase1_projet.md`
- Controle Gold automatique: `pipeline/gold/validate_gold_schema.py`

## Procedure rapide de controle

1. Recalculer les notebooks KPI
2. Verifier les sorties dans `data/gold`
3. Lancer la validation Gold

```bash
python pipeline/gold/validate_gold_schema.py
```

## Note

La phase 2 standardise la structure et la documentation sans changer les formules metier des notebooks.
