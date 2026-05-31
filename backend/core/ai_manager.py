"""
AI Manager — orchestre les appels aux moteurs IA (Mistral, etc.)
À compléter en Phase 3.
"""
from dotenv import load_dotenv
import os

load_dotenv()

MISTRAL_KEY = os.getenv("MISTRAL_KEY")

AVAILABLE_AIS = ["mistral"]


async def generate_content(prompt: str, ai_api: str = "mistral") -> str:
    """
    Génère du contenu via l'IA choisie.
    TODO Phase 3 : implémenter le streaming Mistral.
    """
    if ai_api not in AVAILABLE_AIS:
        raise ValueError(f"IA non supportée : {ai_api}")

    # Placeholder — sera remplacé par l'appel réel Mistral en Phase 3
    raise NotImplementedError("AI Manager à implémenter en Phase 3")
