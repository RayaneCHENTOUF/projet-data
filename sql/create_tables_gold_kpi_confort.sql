-- Gold KPI tables for comfort and mapbox-ready groupings
-- PostgreSQL

BEGIN;

-- 1) KPI confort urbain at quartier level
-- One row per Paris quartier.
CREATE TABLE IF NOT EXISTS fact_kpi_confort_quartier (
    code_quartier INTEGER NOT NULL,
    code_insee_quartier VARCHAR(10) NOT NULL,
    code_postal_arr VARCHAR(5),
    nom_quartier TEXT NOT NULL,
    arrondissement VARCHAR(2) NOT NULL,
    surface_m2 NUMERIC(18,2),
    lat_q NUMERIC(10,7),
    lon_q NUMERIC(10,7),
    s1_proprete NUMERIC(6,3),
    s2_incivilites NUMERIC(6,3),
    s3_amenagement NUMERIC(6,3),
    s4_accessibilite NUMERIC(6,3),
    s5_transport NUMERIC(6,3),
    kpi_confort_urbain NUMERIC(6,3),
    source_file TEXT,
    loaded_at TIMESTAMP DEFAULT NOW(),
    PRIMARY KEY (code_quartier)
);

-- 2) KPI confort urbain aggregated by arrondissement
-- Useful for arrondissement-level mapbox choropleths or labels.
CREATE TABLE IF NOT EXISTS fact_kpi_confort_arrondissement (
    arrondissement VARCHAR(2) NOT NULL,
    nb_quartiers INTEGER NOT NULL,
    surface_m2_totale NUMERIC(18,2),
    s1_proprete_moyen NUMERIC(6,3),
    s2_incivilites_moyen NUMERIC(6,3),
    s3_amenagement_moyen NUMERIC(6,3),
    s4_accessibilite_moyen NUMERIC(6,3),
    s5_transport_moyen NUMERIC(6,3),
    kpi_confort_urbain_moyen NUMERIC(6,3),
    source_file TEXT,
    loaded_at TIMESTAMP DEFAULT NOW(),
    PRIMARY KEY (arrondissement)
);

-- 3) KPI surete at IRIS level
-- This table is mapbox-ready because it keeps the IRIS code and coordinates.
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

-- 4) KPI surete aggregated by arrondissement
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

-- 5) KPI price per square meter at arrondissement level
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

COMMIT;

-- --------------------------------------------------
-- Example COPY commands
-- --------------------------------------------------
-- Adapt the file paths to your environment.

-- Comfort KPI by quartier
-- COPY fact_kpi_confort_quartier (
--     code_quartier, code_insee_quartier, code_postal_arr, nom_quartier,
--     arrondissement, surface_m2, lat_q, lon_q,
--     s1_proprete, s2_incivilites, s3_amenagement, s4_accessibilite, s5_transport,
--     kpi_confort_urbain
-- )
-- FROM '/absolute/path/data/gold/gold_kpi_confort_urbain.csv'
-- WITH (FORMAT csv, HEADER true, DELIMITER ';');

-- Surete KPI by IRIS
-- COPY fact_kpi_surete_iris (
--     annee, code_iris, nom_iris, arrondissement, lat, lon,
--     score_risque_delinq_100, score_surete_delinq_100,
--     nb_cameras, camera_risk_100, dist_commissariat_km,
--     commissariat_risk_100, score_risque_final_100, score_surete_final_100
-- )
-- FROM '/absolute/path/data/gold/kpi_score_surete_iris.csv'
-- WITH (FORMAT csv, HEADER true);

-- Surete KPI aggregated by arrondissement
-- COPY fact_kpi_surete_arrondissement (
--     annee, arrondissement, score_surete_zone_moyen_100,
--     score_risque_zone_moyen_100, nb_iris
-- )
-- FROM '/absolute/path/data/gold/kpi_score_surete_arrondissement_agrege_depuis_iris.csv'
-- WITH (FORMAT csv, HEADER true);
