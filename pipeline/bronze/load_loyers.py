import pandas as pd
import sys
import os

sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))
from config import F_LOYERS, BRONZE_DIR

def load_loyers():
    print("Chargement de logement-encadrement-des-loyers.csv en couche BRONZE...")
    df = pd.read_csv(F_LOYERS, sep=';', low_memory=False)
    
    # Filtre "soft" comme prvu : annee = 2024 ou 2025 (selon les donnes dispo, on va prendre l'annee max par defaut)
    if 'Annee_ref' in df.columns:
        annee_max = df['Annee_ref'].max()
        df = df[df['Annee_ref'] == annee_max]
        
    df.to_parquet(BRONZE_DIR / 'loyers.parquet', index=False)
    print(f"Sauvegard dans {BRONZE_DIR / 'loyers.parquet'} ({len(df)} lignes)")

if __name__ == '__main__':
    load_loyers()
