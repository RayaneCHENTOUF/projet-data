import os
import pathlib

# Chemin du projet
PROJECT_ROOT = pathlib.Path(__file__).parent.absolute()

# Chemins des donnes
DATA_DIR = PROJECT_ROOT.parent if PROJECT_ROOT.name == 'pipeline' else PROJECT_ROOT
RAW_DATA_DIR = DATA_DIR

# Dossiers pour la pipeline
BRONZE_DIR = DATA_DIR / 'data' / 'bronze'
SILVER_DIR = DATA_DIR / 'data' / 'silver'
GOLD_DIR = DATA_DIR / 'data' / 'gold'

# Fichiers sources (CSV)
F_QUARTIERS = RAW_DATA_DIR / 'quartier_paris.csv'
F_DANS_MA_RUE = RAW_DATA_DIR / 'dans-ma-rue.csv'
F_LOYERS = RAW_DATA_DIR / 'logement-encadrement-des-loyers.csv'
F_PARIS_TRANSFORME = RAW_DATA_DIR / 'parissetransforme.csv'
F_GARES = RAW_DATA_DIR / 'emplacement-des-gares-idf.csv'

# Cration des dossiers de destination s'ils n'existent pas
os.makedirs(BRONZE_DIR, exist_ok=True)
os.makedirs(SILVER_DIR, exist_ok=True)
os.makedirs(GOLD_DIR, exist_ok=True)
