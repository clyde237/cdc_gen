from fastapi import APIRouter, Depends, HTTPException, Request
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, update
from datetime import datetime, timezone

from db import get_db
from models.user import User
from models.bundle import Bundle
from models.session import Session
from models.admin_event import AdminEvent
from schemas.user import UserRegister, UserLogin, UserOut, TokenOut
from schemas.errors import success_response, error_response, ApiErrors
from core.security import hash_password, verify_password, create_user_token, get_current_user
from core.file_manager import create_user_folder, append_history

router = APIRouter(prefix="/api/auth", tags=["Auth"])


def make_folder_name(user_id: str, nom: str, prenom: str) -> str:
    safe = lambda s: s.lower().replace(" ", "_")
    return f"{safe(prenom)}_{safe(nom)}_{str(user_id)[:8]}"


@router.post("/register")
async def register(body: UserRegister, request: Request, db: AsyncSession = Depends(get_db)):
    # Vérifier email unique
    existing = await db.execute(select(User).where(User.email == body.email))
    if existing.scalar_one_or_none():
        raise HTTPException(status_code=400, detail="Email déjà utilisé")

    # Créer l'utilisateur
    user = User(
        nom=body.nom,
        prenom=body.prenom,
        email=body.email,
        password=hash_password(body.password),
        user_folder_name="temp",  # sera mis à jour juste après
        country=body.country,
        town=body.town,
        gmt=body.gmt,
    )
    db.add(user)
    await db.flush()  # obtenir l'id avant commit

    # Générer le nom de dossier avec l'id
    user.user_folder_name = make_folder_name(str(user.id), body.nom, body.prenom)

    # Bundle Free par défaut
    bundle = Bundle(user_id=user.id, bundle_type="free", is_active=True)
    db.add(bundle)

    # Event analytics
    db.add(AdminEvent(
        event_type="register",
        user_id=user.id,
        bundle_type="free",
        country=body.country,
        ip_address=request.client.host if request.client else None,
        user_agent=request.headers.get("user-agent"),
    ))

    await db.commit()
    await db.refresh(user)

    # Créer le dossier utilisateur sur le système de fichiers
    create_user_folder(user.user_folder_name)

    token = create_user_token(str(user.id))
    return success_response(
        TokenOut(access_token=token, user=UserOut.model_validate(user)).model_dump(),
        message="Compte créé avec succès"
    )


@router.post("/login")
async def login(body: UserLogin, request: Request, db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(User).where(User.email == body.email))
    user = result.scalar_one_or_none()

    if not user or not verify_password(body.password, user.password):
        raise HTTPException(status_code=401, detail="Email ou mot de passe incorrect")
    if not user.is_active:
        raise HTTPException(status_code=403, detail="Compte suspendu")

    # Mettre à jour last_login
    await db.execute(update(User).where(User.id == user.id).values(last_login=datetime.now(timezone.utc)))

    # Créer une session active
    token = create_user_token(str(user.id))
    session = Session(
        user_id=user.id,
        token=token,
        ip_address=request.client.host if request.client else None,
        created_at=datetime.now(timezone.utc),
        is_active=True,
    )
    db.add(session)

    # Event analytics
    db.add(AdminEvent(
        event_type="login",
        user_id=user.id,
        ip_address=request.client.host if request.client else None,
        user_agent=request.headers.get("user-agent"),
    ))

    await db.commit()
    await db.refresh(user)

    return success_response(
        TokenOut(access_token=token, user=UserOut.model_validate(user)).model_dump(),
        message="Connexion réussie"
    )


@router.post("/logout")
async def logout(
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    # Désactiver toutes les sessions actives de l'utilisateur
    await db.execute(
        update(Session)
        .where(Session.user_id == current_user.id, Session.is_active == True)
        .values(is_active=False)
    )
    db.add(AdminEvent(event_type="logout", user_id=current_user.id))
    await db.commit()
    return success_response(message="Déconnexion réussie")


@router.get("/me")
async def me(current_user: User = Depends(get_current_user)):
    return success_response(UserOut.model_validate(current_user).model_dump())
