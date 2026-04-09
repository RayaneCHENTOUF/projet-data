import pandas as pd
import geopandas as gpd
from shapely.geometry import Point
import shapely.wkt as wkt
import sys
import os
import ast

sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))
from config import BRONZE_DIR, SILVER_DIR

def build_mobilite():
    print("Construction de silver.gares_par_quartier (Filtrage Paris uniq.)...")
    
    if not (os.path.exists(SILVER_DIR / 'quartiers.parquet') and os.path.exists(BRONZE_DIR / 'gares_idf.parquet')):
        print("Donnes manquantes pour build_mobilite.py")
        return
        
    df_qu = pd.read_parquet(SILVER_DIR / 'quartiers.parquet')
    df_gares = pd.read_parquet(BRONZE_DIR / 'gares_idf.parquet')
    
    # 1. Prparer les quartiers en GeoDataFrame
    # Recuperer les geomtries de df_qu (df bruts de load_quartiers ont 'geom')
    df_qu_raw = pd.read_parquet(BRONZE_DIR / 'quartiers.parquet')
    import json
    def parse_geom(g):
        try:
            d = json.loads(g)
            from shapely.geometry import shape
            return shape(d)
        except:
            return None
            
    df_qu_raw['geometry'] = df_qu_raw['geometry'].apply(parse_geom)
    gdf_qu = gpd.GeoDataFrame(df_qu_raw[['c_qu', 'geometry']], geometry='geometry', crs="EPSG:4326")
    
    # 2. Prparer les gares en GeoDataFrame (filtrer principal=1)
    if 'principal' in df_gares.columns:
        df_gares = df_gares[df_gares['principal'] == 1]
    
    gdf_gares = gpd.GeoDataFrame(
        df_gares, 
        geometry=gpd.points_from_xy(df_gares.lon, df_gares.lat),
        crs="EPSG:4326"
    )
    
    # 3. Spatial Join: ne garde QUE les gares DANS Paris (intersection avec les polygones des quartiers)
    print("Filtrage spatial : conservation uniquement des gares intra-muros (Paris)...")
    gdf_joined = gpd.sjoin(gdf_gares, gdf_qu, how="inner", predicate="intersects")
    print(f"Gares conserves (dans Paris) : {len(gdf_joined)} / {len(df_gares)}")
    
    # 4. Calcul de l'indice i_mob par quartier
    # Poids selon le mode
    weights = {'RER': 3.0, 'METRO': 2.5, 'TRAIN': 2.0, 'TRAMWAY': 1.5, 'VAL': 1.0, 'CABLE': 1.0}
    gdf_joined['w'] = gdf_joined['mode'].map(weights).fillna(1.0)
    
    res = gdf_joined.groupby('c_qu')['w'].sum().reset_index()
    res.rename(columns={'w': 'i_mob'}, inplace=True)
    
    # Tous les quartiers doivent tre prsents, mme ceux 0 gares
    res = df_qu[['c_qu']].merge(res, on='c_qu', how='left').fillna({'i_mob': 0.0})
    
    res.to_parquet(SILVER_DIR / 'gares_par_quartier.parquet', index=False)
    print(f"Sauvegard dans {SILVER_DIR / 'gares_par_quartier.parquet'}")

if __name__ == '__main__':
    build_mobilite()
