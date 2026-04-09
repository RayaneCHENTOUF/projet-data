import sys
import os

sys.path.append(os.path.abspath(os.path.dirname(__file__)))

from silver.build_quartiers import build_quartiers
from silver.build_proprete import build_proprete
from silver.build_incivilites import build_incivilites
from silver.build_amenagement import build_amenagement
from silver.build_loyers import build_loyers
from silver.build_mobilite import build_mobilite

def run_silver():
    print("=== Dbut Pipeline Silver ===")
    build_quartiers()
    build_proprete()
    build_incivilites()
    build_amenagement()
    build_loyers()
    build_mobilite()
    print("=== Fin Pipeline Silver ===")

if __name__ == '__main__':
    run_silver()
