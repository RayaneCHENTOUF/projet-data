-- KPI Rayan - Creation des tables SQL
-- Version PostgreSQL

BEGIN;

-- 1) KPI prix au m2 (arrondissement)
CREATE TABLE IF NOT EXISTS fact_kpi_prix_m2_arrondissement (
    annee INTEGER NOT NULL,
    arrondissement VARCHAR(2) NOT NULL,
    prix_m2_median NUMERIC(14,2),
    prix_m2_moyen NUMERIC(14,2),
    nb_ventes INTEGER,
    source_file TEXT,
    loaded_at TIMESTAMP DEFAULT NOW(),
    PRIMARY KEY (annee, arrondissement)
);

-- 2) KPI surete agrege (arrondissement)
CREATE TABLE IF NOT EXISTS fact_kpi_surete_arrondissement (
    annee INTEGER NOT NULL,
    arrondissement VARCHAR(2) NOT NULL,
    score_surete_zone_moyen_100 NUMERIC(6,3),
    score_risque_zone_moyen_100 NUMERIC(6,3),
    nb_iris INTEGER,
    source_file TEXT,
    loaded_at TIMESTAMP DEFAULT NOW(),
    PRIMARY KEY (annee, arrondissement)
);

-- 3) KPI surete detail IRIS (optionnel mais utile pour la carto)
CREATE TABLE IF NOT EXISTS fact_kpi_surete_iris (
    annee INTEGER NOT NULL,
    code_iris VARCHAR(9) NOT NULL,
    nom_iris TEXT,
    arrondissement VARCHAR(2),
    lat NUMERIC(10,7),
    lon NUMERIC(10,7),
    score_risque_delinq_100 NUMERIC(6,3),
    score_surete_delinq_100 NUMERIC(6,3),
    nb_cameras INTEGER,
    camera_risk_100 NUMERIC(6,3),
    dist_commissariat_km NUMERIC(8,4),
    commissariat_risk_100 NUMERIC(6,3),
    score_risque_final_100 NUMERIC(6,3),
    score_surete_final_100 NUMERIC(6,3),
    source_file TEXT,
    loaded_at TIMESTAMP DEFAULT NOW(),
    PRIMARY KEY (annee, code_iris)
);

COMMIT;

-- ----------------------------
-- Exemple de chargement CSV
-- ----------------------------
-- Adapter les chemins selon votre environnement SQL.

-- KPI prix m2
-- COPY fact_kpi_prix_m2_arrondissement (annee, arrondissement, prix_m2_median, prix_m2_moyen, nb_ventes)
-- FROM '/absolute/path/output/kpi_prix_m2_arrondissement.csv'
-- WITH (FORMAT csv, HEADER true);

-- KPI surete agrege
-- COPY fact_kpi_surete_arrondissement (annee, arrondissement, score_surete_zone_moyen_100, score_risque_zone_moyen_100, nb_iris)
-- FROM '/absolute/path/output/kpi_score_surete_arrondissement_agrege_depuis_iris.csv'
-- WITH (FORMAT csv, HEADER true);

-- KPI surete IRIS
-- COPY fact_kpi_surete_iris (annee, code_iris, nom_iris, arrondissement, lat, lon, score_risque_delinq_100, score_surete_delinq_100, nb_cameras, camera_risk_100, dist_commissariat_km, commissariat_risk_100, score_risque_final_100, score_surete_final_100)
-- FROM '/absolute/path/output/kpi_score_surete_iris.csv'
-- WITH (FORMAT csv, HEADER true);
