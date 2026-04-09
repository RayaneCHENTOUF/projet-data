import pandas as pd
import sys
import os

sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))
from config import F_DANS_MA_RUE, BRONZE_DIR

def load_dans_ma_rue():
    print("Chargement de dans-ma-rue.csv en couche BRONZE (Chunked)...")
    
    chunksize = 100_000
    df_list = []
    
    # Optionnel: lire uniquement les colonnes ncessaires en string si volume pose problme. 
    # Sinon on lit tout.
    for i, chunk in enumerate(pd.read_csv(F_DANS_MA_RUE, sep=';', chunksize=chunksize, low_memory=False)):
        df_list.append(chunk)
        print(f" Chunk {i+1} trait", end='\r')
        
    df = pd.concat(df_list, ignore_index=True)
    print(f"\nTotal lignes vcues : {len(df)}")
    
    # Conversion date
    # Mettre toutes les dates au format datetime pour uniformiser
    if 'DATE_DECLARATION' in df.columns:
        df['DATE_DECLARATION'] = pd.to_datetime(df['DATE_DECLARATION'], errors='coerce')
        
    df.to_parquet(BRONZE_DIR / 'dans_ma_rue.parquet', index=False)
    print(f"Sauvegard dans {BRONZE_DIR / 'dans_ma_rue.parquet'}")

if __name__ == '__main__':
    load_dans_ma_rue()
