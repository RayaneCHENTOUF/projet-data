import pandas as pd
import sys
import os

sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))
from config import BRONZE_DIR, SILVER_DIR

def build_amenagement():
    print("Construction de silver.projets_amenagement...")
    res = pd.DataFrame({'c_qu': [str(i).zfill(2) for i in range(1, 81)], 'i_am': 20.0})
    res.to_parquet(SILVER_DIR / 'projets_amenagement.parquet', index=False)
    print(f"Sauvegard dans {SILVER_DIR / 'projets_amenagement.parquet'}")

if __name__ == '__main__':
    build_amenagement()
