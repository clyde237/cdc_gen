from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
import uuid

from db import get_db
from models.user import User
from models.projet import Projet
from models.admin_event import AdminEvent
from schemas.project import ProjectCreate, ProjectUpdate, ProjectOut
from schemas.errors import success_response
from core.security import get_current_user
from core.file_manager import save_project_data, read_project_data, delete_project_data, append_history

router = APIRouter(prefix="/api/projects", tags=["Projects"])


@router.get("")
async def list_projects(
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    result = await db.execute(
        select(Projet).where(Projet.user_id == current_user.id).order_by(Projet.last_modif.desc())
    )
    projects = result.scalars().all()
    return success_response([ProjectOut.model_validate(p).model_dump() for p in projects])


@router.post("")
async def create_project(
    body: ProjectCreate,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    project_id = str(uuid.uuid4())

    # Créer le fichier ProjetData.json vide
    data_file_path = await save_project_data(current_user.user_folder_name, project_id, {})

    projet = Projet(
        id=uuid.UUID(project_id),
        user_id=current_user.id,
        name=body.name,
        projet_type=body.projet_type,
        template=body.template,
        main_ai_api=body.main_ai_api,
        data_file=data_file_path,
    )
    db.add(projet)
    db.add(AdminEvent(event_type="project_create", user_id=current_user.id))
    await db.commit()
    await db.refresh(projet)

    await append_history(current_user.user_folder_name, "Projet", f"Création du projet {body.name}", f"#{project_id}")

    return success_response(ProjectOut.model_validate(projet).model_dump(), message="Projet créé")


@router.get("/{project_id}")
async def get_project(
    project_id: str,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    result = await db.execute(
        select(Projet).where(Projet.id == project_id, Projet.user_id == current_user.id)
    )
    projet = result.scalar_one_or_none()
    if not projet:
        raise HTTPException(status_code=404, detail="Projet introuvable")
    return success_response(ProjectOut.model_validate(projet).model_dump())


@router.put("/{project_id}")
async def update_project(
    project_id: str,
    body: ProjectUpdate,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    result = await db.execute(
        select(Projet).where(Projet.id == project_id, Projet.user_id == current_user.id)
    )
    projet = result.scalar_one_or_none()
    if not projet:
        raise HTTPException(status_code=404, detail="Projet introuvable")

    for field, value in body.model_dump(exclude_unset=True).items():
        setattr(projet, field, value)

    await db.commit()
    await db.refresh(projet)
    return success_response(ProjectOut.model_validate(projet).model_dump(), message="Projet mis à jour")


@router.delete("/{project_id}")
async def delete_project(
    project_id: str,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    result = await db.execute(
        select(Projet).where(Projet.id == project_id, Projet.user_id == current_user.id)
    )
    projet = result.scalar_one_or_none()
    if not projet:
        raise HTTPException(status_code=404, detail="Projet introuvable")

    await delete_project_data(current_user.user_folder_name, project_id)
    await db.delete(projet)
    await db.commit()
    return success_response(message="Projet supprimé")
