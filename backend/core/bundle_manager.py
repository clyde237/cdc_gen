"""
Bundle Manager — lit les configs JSON des bundles et vérifie les droits utilisateur.
"""
import json
import os
from pathlib import Path
from dotenv import load_dotenv

load_dotenv()

DATA_ROOT = Path(os.getenv("DATA_ROOT_PATH", "../data"))
BUNDLES_DIR = DATA_ROOT / "bundles"

BUNDLE_FILES = {
    "free":     "FreeBundleConf.json",
    "starter":  "StarterBundleConf.json",
    "pro":      "ProBundleConf.json",
    "business": "BusinessBundleConf.json",
}


def get_bundle_config(bundle_type: str) -> dict:
    """Charge et retourne la config JSON d'un bundle."""
    filename = BUNDLE_FILES.get(bundle_type)
    if not filename:
        raise ValueError(f"Bundle type inconnu : {bundle_type}")
    path = BUNDLES_DIR / filename
    with open(path, "r", encoding="utf-8") as f:
        return json.load(f)


def can_export_without_watermark(bundle_type: str, exports_done_this_month: int) -> bool:
    """Vérifie si l'utilisateur peut exporter sans watermark."""
    config = get_bundle_config(bundle_type)
    limit = config.get("nbExpNoWatermark", 0)
    if limit == "unlimited":
        return True
    return exports_done_this_month < limit


def can_duplicate_project(bundle_type: str) -> bool:
    config = get_bundle_config(bundle_type)
    return config.get("duplicateProject", False)


def can_use_custom_template(bundle_type: str) -> bool:
    config = get_bundle_config(bundle_type)
    return config.get("customTemplate", False)


def get_max_templates(bundle_type: str) -> int | str:
    """Retourne le nb de templates accordés ('full' ou un entier)."""
    config = get_bundle_config(bundle_type)
    return config.get("nbTemplatesAccorded", 0)


def has_access_to_ai_apis(bundle_type: str) -> bool:
    config = get_bundle_config(bundle_type)
    return config.get("accessAIsAPIs", False)
