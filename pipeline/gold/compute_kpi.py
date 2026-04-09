import pandas as pd
import numpy as np
import sys
import os

sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))
from config import SILVER_DIR, GOLD_DIR

def compute_kpi():
    print("Calcul du KPI Confort Urbain (Couche GOLD)...")
    
    # Charger la base quartiers
    if not os.path.exists(SILVER_DIR / 'quartiers.parquet'):
        print("Fichier silver.quartiers introuvable. Avez-vous run_silver ?")
        return
        
    df = pd.read_parquet(SILVER_DIR / 'quartiers.parquet')
    df['c_qu'] = df['c_qu'].astype(str)
    
    # 1. Charger et joindre Propret (S1)
    if os.path.exists(SILVER_DIR / 'signalements_proprete.parquet'):
        dp = pd.read_parquet(SILVER_DIR / 'signalements_proprete.parquet')
        dp['c_qu'] = dp['c_qu'].astype(str)
        df = df.merge(dp, on='c_qu', how='left').fillna({'n_prop': 0})
    else:
        df['n_prop'] = 0
        
    # 2. Charger et joindre Incivilits (S2)
    if os.path.exists(SILVER_DIR / 'signalements_incivilites.parquet'):
        di = pd.read_parquet(SILVER_DIR / 'signalements_incivilites.parquet')
        di['c_qu'] = di['c_qu'].astype(str)
        df = df.merge(di, on='c_qu', how='left').fillna({'i_incivil': 0})
    else:
        df['i_incivil'] = 0
        
    # 3. Charger et joindre Amnagement (S3)
    if os.path.exists(SILVER_DIR / 'projets_amenagement.parquet'):
        da = pd.read_parquet(SILVER_DIR / 'projets_amenagement.parquet')
        da['c_qu'] = da['c_qu'].astype(str)
        df = df.merge(da, on='c_qu', how='left').fillna({'i_am': 0})
    else:
        df['i_am'] = 0
        
    # 4. Charger et joindre Loyers (S4)
    if os.path.exists(SILVER_DIR / 'loyers_quartier.parquet'):
        dl = pd.read_parquet(SILVER_DIR / 'loyers_quartier.parquet')
        dl['c_qu'] = dl['c_qu'].astype(str)
        df = df.merge(dl, on='c_qu', how='left')
    else:
        df['l_moy'] = 1000 # fallback
    L_med = df['l_moy'].median() if not df['l_moy'].isna().all() else 1
        
    # 5. Charger et joindre Mobilit (S5)
    if os.path.exists(SILVER_DIR / 'gares_par_quartier.parquet'):
        dm = pd.read_parquet(SILVER_DIR / 'gares_par_quartier.parquet')
        dm['c_qu'] = dm['c_qu'].astype(str)
        df = df.merge(dm, on='c_qu', how='left').fillna({'i_mob': 0})
    else:
        df['i_mob'] = 0
    # 6. Joindre les coordonnes GPS depuis la couche BRONZE
    from config import BRONZE_DIR
    if os.path.exists(BRONZE_DIR / 'quartiers.parquet'):
        dq = pd.read_parquet(BRONZE_DIR / 'quartiers.parquet')
        dq['c_qu'] = dq['c_qu'].astype(str)
        if 'geometry x y' in dq.columns:
            dq = dq[['c_qu', 'geometry x y']].rename(columns={'geometry x y': 'coordonnees_gps'})
            df = df.merge(dq, on='c_qu', how='left')
            
    # Prcaution surface
    df['surface_m2'] = df['surface_m2'].replace(0, np.nan).fillna(1_000_000)

    # --- CALCUL DES SCORES [0-10] ---
    
    # S1 Propret
    df['d_prop'] = df['n_prop'] / df['surface_m2']
    df['S1'] = 10 * (1 - df['d_prop'].rank(pct=True))
    
    # S2 Incivilits
    df['d_incivil'] = df['i_incivil'] / df['surface_m2']
    df['S2'] = 10 * (1 - df['d_incivil'].rank(pct=True))
    
    # S3 Amnagement
    df['d_am'] = df['i_am'] / df['surface_m2']
    df['S3'] = 10 * df['d_am'].rank(pct=True)
    
    # S4 Logement (plus proche de la mdiane = meilleur score)
    df['delta'] = abs(df['l_moy'] - L_med) / L_med
    max_delta = df['delta'].max() if df['delta'].max() > 0 else 1
    df['S4'] = 10 * (1 - (df['delta'] / max_delta))
    
    # S5 Mobilit
    df['d_mob'] = df['i_mob'] / df['surface_m2']
    df['S5'] = 10 * df['d_mob'].rank(pct=True)
    
    # Poids pour le KPI Final
    w_S1, w_S2, w_S3, w_S4, w_S5 = 0.30, 0.25, 0.15, 0.15, 0.15
    
    df['KPI'] = (
        (df['S1'] ** w_S1) *
        (df['S2'] ** w_S2) *
        (df['S3'] ** w_S3) *
        (df['S4'] ** w_S4) *
        (df['S5'] ** w_S5)
    )
    
    # Nettoyage des colonnes temporaires
    cols_to_drop = ['d_prop', 'd_incivil', 'd_am', 'delta', 'd_mob']
    df.drop(columns=[c for c in cols_to_drop if c in df.columns], inplace=True)
    
    df.to_parquet(GOLD_DIR / 'kpi_quartiers.parquet', index=False)
    print(f"Sauvegard dans {GOLD_DIR / 'kpi_quartiers.parquet'} ({len(df)} lignes)")
    print("\nAperu des top 5 quartiers par KPI :")
    print(df.sort_values(by='KPI', ascending=False)[['c_qu', 'l_qu', 'KPI']].head(5))

if __name__ == '__main__':
    compute_kpi()
