import sys
import os

sys.path.append(os.path.abspath(os.path.dirname(__file__)))

from bronze.load_quartiers import load_quartiers
from bronze.load_dans_ma_rue import load_dans_ma_rue
from bronze.load_loyers import load_loyers
from bronze.load_paris_transforme import load_paris_transforme
from bronze.load_gares_idf import load_gares_idf

def run_bronze():
    print("=== Dbut Pipeline Bronze ===")
    load_quartiers()
    load_dans_ma_rue()
    load_loyers()
    load_paris_transforme()
    load_gares_idf()
    print("=== Fin Pipeline Bronze ===")

if __name__ == '__main__':
    run_bronze()
