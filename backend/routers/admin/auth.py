from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select

from db import get_db
from models.admin import Admin
from schemas.admin import AdminLogin, AdminOut, AdminTokenOut
from schemas.errors import success_response
from core.security import verify_password, create_admin_token, get_current_admin

router = APIRouter(prefix="/api/admin/auth", tags=["Admin Auth"])


@router.post("/login")
async def admin_login(body: AdminLogin, db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(Admin).where(Admin.email == body.email))
    admin = result.scalar_one_or_none()

    if not admin or not verify_password(body.password, admin.password):
        raise HTTPException(status_code=403, detail="Identifiants admin incorrects")

    token = create_admin_token(str(admin.id))
    return success_response(
        AdminTokenOut(access_token=token, admin=AdminOut.model_validate(admin)).model_dump(),
        message="Connexion admin réussie"
    )


@router.post("/logout")
async def admin_logout(current_admin: Admin = Depends(get_current_admin)):
    return success_response(message="Déconnexion admin réussie")
