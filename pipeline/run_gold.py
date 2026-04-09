import sys
import os

sys.path.append(os.path.abspath(os.path.dirname(__file__)))

from gold.compute_kpi import compute_kpi

def run_gold():
    print("=== Dbut Pipeline Gold ===")
    compute_kpi()
    print("=== Fin Pipeline Gold ===")

if __name__ == '__main__':
    run_gold()
