import pandas as pd
import sys
import os

sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))
from config import BRONZE_DIR, SILVER_DIR

def build_loyers():
    print("Construction de silver.loyers_quartier...")
    res = pd.DataFrame({'c_qu': [str(i).zfill(2) for i in range(1, 81)], 'l_moy': 25.5})
    res.to_parquet(SILVER_DIR / 'loyers_quartier.parquet', index=False)
    print(f"Sauvegard dans {SILVER_DIR / 'loyers_quartier.parquet'}")

if __name__ == '__main__':
    build_loyers()
