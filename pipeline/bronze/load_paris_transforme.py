import pandas as pd
import sys
import os

sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))
from config import F_PARIS_TRANSFORME, BRONZE_DIR

def load_paris_transforme():
    print("Chargement de parissetransforme.csv en couche BRONZE...")
    df = pd.read_csv(F_PARIS_TRANSFORME, sep=';')
    
    df.to_parquet(BRONZE_DIR / 'paris_transforme.parquet', index=False)
    print(f"Sauvegard dans {BRONZE_DIR / 'paris_transforme.parquet'} ({len(df)} lignes)")

if __name__ == '__main__':
    load_paris_transforme()
