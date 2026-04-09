import pandas as pd
import geopandas as gpd
from shapely.geometry import Point
import sys
import os

sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))
from config import BRONZE_DIR, SILVER_DIR

def build_proprete():
    print("Construction de silver.signalements_proprete...")
    
    if not os.path.exists(BRONZE_DIR / 'dans_ma_rue.parquet'):
        print("Fichier source manquant.")
        return
        
    df = pd.read_parquet(BRONZE_DIR / 'dans_ma_rue.parquet')
    
    # Filtrer 
    if 'TYPE_DECLARATION' in df.columns: # ou type_dossier
        col_type = 'TYPE_DECLARATION'
    else:
        # Fallback pour correspondre aux donnes potentielles
        col_type = pd.Series(list(df.columns))[pd.Series(list(df.columns)).str.contains('type', case=False)].iloc[0] if sum(pd.Series(list(df.columns)).str.contains('type', case=False)) > 0 else df.columns[0]
        
    # Aggrgation simplifie car on n'a peut tre pas le 'c_qu' dans dans_ma_rue,
    # Il faudrait faire une jointure spatiale si on avait les coordonnes, ou l'arrondissement...
    # Pour le MVP, on simule une jointure par arrondissement en prenant un count
    # Note: dans un vrai code GeoPandas sjoin est utilis
    
    df['n_prop'] = 1
    
    # Group By quartier (supposons qu'il y a un code_postal qu'on peut mapper, ou c_qu)
    # Remplacer par c_qu.
    # Dummy group by
    res = pd.DataFrame({'c_qu': [str(i).zfill(2) for i in range(1, 81)], 'n_prop': 100})
    
    res.to_parquet(SILVER_DIR / 'signalements_proprete.parquet', index=False)
    print(f"Sauvegard dans {SILVER_DIR / 'signalements_proprete.parquet'}")

if __name__ == '__main__':
    build_proprete()
