from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, update
from typing import Literal

from db import get_db
from models.admin import Admin
from models.user import User
from models.bundle import Bundle
from schemas.user import UserOut
from schemas.errors import success_response
from core.security import get_current_admin

router = APIRouter(prefix="/api/admin/users", tags=["Admin - Users"])


@router.get("")
async def list_users(
    current_admin: Admin = Depends(get_current_admin),
    db: AsyncSession = Depends(get_db)
):
    result = await db.execute(select(User).order_by(User.created_at.desc()))
    users = result.scalars().all()
    return success_response([UserOut.model_validate(u).model_dump() for u in users])


@router.get("/{user_id}")
async def get_user(
    user_id: str,
    current_admin: Admin = Depends(get_current_admin),
    db: AsyncSession = Depends(get_db)
):
    result = await db.execute(select(User).where(User.id == user_id))
    user = result.scalar_one_or_none()
    if not user:
        raise HTTPException(status_code=404, detail="Utilisateur introuvable")
    return success_response(UserOut.model_validate(user).model_dump())


@router.put("/{user_id}/suspend")
async def suspend_user(
    user_id: str,
    current_admin: Admin = Depends(get_current_admin),
    db: AsyncSession = Depends(get_db)
):
    await db.execute(update(User).where(User.id == user_id).values(is_active=False))
    await db.commit()
    return success_response(message="Compte suspendu")


@router.put("/{user_id}/activate")
async def activate_user(
    user_id: str,
    current_admin: Admin = Depends(get_current_admin),
    db: AsyncSession = Depends(get_db)
):
    await db.execute(update(User).where(User.id == user_id).values(is_active=True))
    await db.commit()
    return success_response(message="Compte réactivé")


@router.put("/{user_id}/bundle")
async def change_user_bundle(
    user_id: str,
    bundle_type: Literal["free", "starter", "pro", "business"],
    current_admin: Admin = Depends(get_current_admin),
    db: AsyncSession = Depends(get_db)
):
    # Désactiver l'ancien bundle
    await db.execute(update(Bundle).where(Bundle.user_id == user_id, Bundle.is_active == True).values(is_active=False))
    # Créer le nouveau
    new_bundle = Bundle(user_id=user_id, bundle_type=bundle_type, is_active=True)
    db.add(new_bundle)
    await db.commit()
    return success_response(message=f"Bundle changé vers {bundle_type}")
