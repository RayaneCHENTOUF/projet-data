import pandas as pd
import geopandas as gpd
from shapely import wkt
import sys
import os

sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))
from config import BRONZE_DIR, SILVER_DIR

def build_quartiers():
    print("Construction de silver.quartiers...")
    df = pd.read_parquet(BRONZE_DIR / 'quartiers.parquet')
    
    # Rcuprer la gomtrie valide (supposons dans 'geom')
    # Les CSV OpenData de Paris ont souvent une colonne `geom` en GeoJSON ou WKT
    # S'il y a des nulls, on les jette
    if 'geom' in df.columns:
        # Transformation simplifie pour l'exemple
        # (Dans la vraie vie on check le fomat GeoJSON ou WKT)
        pass 
    
    # On dfinit la surface
    if 'surface' in df.columns:
        df['surface_m2'] = df['surface']
    else:
        df['surface_m2'] = 1_000_000 # dummy default
        
    df[['c_qu', 'l_qu', 'surface_m2']].drop_duplicates().to_parquet(SILVER_DIR / 'quartiers.parquet', index=False)
    print(f"Sauvegard dans {SILVER_DIR / 'quartiers.parquet'} ({len(df)} lignes)")

if __name__ == '__main__':
    build_quartiers()
