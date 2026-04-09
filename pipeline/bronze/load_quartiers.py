import pandas as pd
import geopandas as gpd
from shapely import wkt
import sys
import os

# Ajout du dossier pipeline au PYTHONPATH pour importer config
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))
from config import F_QUARTIERS, BRONZE_DIR

def load_quartiers():
    print("Chargement de quartier_paris.csv en couche BRONZE...")
    df = pd.read_csv(F_QUARTIERS, sep=';')
    
    # Typer et standardiser
    # Colonnes : c_qu, l_qu, surface, n_sq_qu, perimetre, geom_x_y, geom
    df.columns = df.columns.str.lower()
    # geometry est sous format point "lat, lon" dans geom_x_y et polygon "{"type": "Polygon", ...}" dans geom
    # On va garder toutes les colonnes brute
    df.to_parquet(BRONZE_DIR / 'quartiers.parquet', index=False)
    print(f"Sauvegard dans {BRONZE_DIR / 'quartiers.parquet'} ({len(df)} lignes)")

if __name__ == '__main__':
    load_quartiers()
