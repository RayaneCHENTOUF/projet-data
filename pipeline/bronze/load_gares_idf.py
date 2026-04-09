import pandas as pd
import sys
import os

sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))
from config import F_GARES, BRONZE_DIR

def load_gares_idf():
    print("Chargement de emplacement-des-gares-idf.csv en couche BRONZE...")
    df = pd.read_csv(F_GARES, sep=';')
    
    # Parser `Geo Point`
    if 'Geo Point' in df.columns:
        df[['lat', 'lon']] = df['Geo Point'].str.split(',', expand=True).astype(float)
        
    df.to_parquet(BRONZE_DIR / 'gares_idf.parquet', index=False)
    print(f"Sauvegard dans {BRONZE_DIR / 'gares_idf.parquet'} ({len(df)} lignes)")

if __name__ == '__main__':
    load_gares_idf()
