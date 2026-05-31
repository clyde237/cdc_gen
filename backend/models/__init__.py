# Importer tous les modèles ici pour qu'Alembic les détecte lors des migrations
from models.user import User
from models.bundle import Bundle
from models.projet import Projet
from models.session import Session
from models.admin import Admin
from models.admin_event import AdminEvent

__all__ = ["User", "Bundle", "Projet", "Session", "Admin", "AdminEvent"]
