import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
STARTER_DIR = ROOT / "starter"

for path in (ROOT, STARTER_DIR):
    path_str = str(path)
    if path_str not in sys.path:
        sys.path.insert(0, path_str)
