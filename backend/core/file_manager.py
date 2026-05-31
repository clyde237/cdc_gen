"""
File Manager — gère les dossiers utilisateurs et les fichiers JSON (History, ProjetData).
"""
import json
import aiofiles
import asyncio
from pathlib import Path
from datetime import datetime
from dotenv import load_dotenv
import os

load_dotenv()

DATA_ROOT = Path(os.getenv("DATA_ROOT_PATH", "../data"))


def get_user_folder(user_folder_name: str) -> Path:
    return DATA_ROOT / "users" / user_folder_name


def get_history_path(user_folder_name: str) -> Path:
    return get_user_folder(user_folder_name) / "History.json"


def get_projects_folder(user_folder_name: str) -> Path:
    return get_user_folder(user_folder_name) / "ProjetsFolder"


def create_user_folder(user_folder_name: str) -> None:
    """Crée le dossier utilisateur à l'inscription."""
    folder = get_user_folder(user_folder_name)
    folder.mkdir(parents=True, exist_ok=True)
    (folder / "ProjetsFolder").mkdir(exist_ok=True)
    # Initialise un History.json vide
    history_path = get_history_path(user_folder_name)
    if not history_path.exists():
        history_path.write_text(json.dumps([], indent=2), encoding="utf-8")


async def append_history(user_folder_name: str, title: str, action: str, reference: str) -> None:
    """Ajoute une entrée dans le History.json de l'utilisateur (thread-safe)."""
    path = get_history_path(user_folder_name)
    lock = asyncio.Lock()

    async with lock:
        async with aiofiles.open(path, "r", encoding="utf-8") as f:
            content = await f.read()
        history: list = json.loads(content)

        history.append({
            "date": datetime.utcnow().strftime("%d/%m/%Y %H:%M:%S"),
            "title": title,
            "action": action,
            "reference": reference,
        })

        async with aiofiles.open(path, "w", encoding="utf-8") as f:
            await f.write(json.dumps(history, indent=2, ensure_ascii=False))


async def read_history(user_folder_name: str) -> list:
    path = get_history_path(user_folder_name)
    async with aiofiles.open(path, "r", encoding="utf-8") as f:
        return json.loads(await f.read())


async def save_project_data(user_folder_name: str, project_id: str, data: dict) -> str:
    """Sauvegarde le ProjetData.json et retourne le chemin relatif."""
    folder = get_projects_folder(user_folder_name)
    folder.mkdir(parents=True, exist_ok=True)
    path = folder / f"{project_id}.json"
    async with aiofiles.open(path, "w", encoding="utf-8") as f:
        await f.write(json.dumps(data, indent=2, ensure_ascii=False))
    return str(path.relative_to(DATA_ROOT))


async def read_project_data(user_folder_name: str, project_id: str) -> dict:
    path = get_projects_folder(user_folder_name) / f"{project_id}.json"
    async with aiofiles.open(path, "r", encoding="utf-8") as f:
        return json.loads(await f.read())


async def delete_project_data(user_folder_name: str, project_id: str) -> None:
    path = get_projects_folder(user_folder_name) / f"{project_id}.json"
    if path.exists():
        path.unlink()
