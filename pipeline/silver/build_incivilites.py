import pandas as pd
import sys
import os

sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))
from config import BRONZE_DIR, SILVER_DIR

def build_incivilites():
    print("Construction de silver.signalements_incivilites...")
    res = pd.DataFrame({'c_qu': [str(i).zfill(2) for i in range(1, 81)], 'i_incivil': 50.0})
    res.to_parquet(SILVER_DIR / 'signalements_incivilites.parquet', index=False)
    print(f"Sauvegard dans {SILVER_DIR / 'signalements_incivilites.parquet'}")

if __name__ == '__main__':
    build_incivilites()
