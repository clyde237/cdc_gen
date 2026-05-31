from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from datetime import datetime, timezone, timedelta

from db import get_db
from models.user import User
from models.bundle import Bundle
from models.admin_event import AdminEvent
from schemas.bundle import BundleOut, BundleSubscribe
from schemas.errors import success_response
from core.security import get_current_user
from core.bundle_manager import get_bundle_config

router = APIRouter(prefix="/api/bundles", tags=["Bundles"])


@router.get("")
async def list_bundles():
    """Retourne la config de tous les bundles disponibles."""
    bundles = {}
    for bt in ["free", "starter", "pro", "business"]:
        bundles[bt] = get_bundle_config(bt)
    return success_response(bundles)


@router.get("/current")
async def current_bundle(
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    result = await db.execute(
        select(Bundle)
        .where(Bundle.user_id == current_user.id, Bundle.is_active == True)
        .order_by(Bundle.subscribed_date.desc())
    )
    bundle = result.scalar_one_or_none()
    if not bundle:
        raise HTTPException(status_code=404, detail="Aucun bundle actif")
    return success_response(BundleOut.model_validate(bundle).model_dump())


@router.post("/subscribe")
async def subscribe(
    body: BundleSubscribe,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    # Désactiver l'ancien bundle actif
    result = await db.execute(
        select(Bundle).where(Bundle.user_id == current_user.id, Bundle.is_active == True)
    )
    old_bundle = result.scalar_one_or_none()
    if old_bundle:
        old_bundle.is_active = False

    # Créer le nouveau bundle (1 mois de durée)
    new_bundle = Bundle(
        user_id=current_user.id,
        bundle_type=body.bundle_type,
        subscribed_date=datetime.now(timezone.utc),
        expiration_date=datetime.now(timezone.utc) + timedelta(days=30) if body.bundle_type != "free" else None,
        is_active=True,
    )
    db.add(new_bundle)

    db.add(AdminEvent(
        event_type="subscribe",
        user_id=current_user.id,
        bundle_type=body.bundle_type,
    ))

    await db.commit()
    await db.refresh(new_bundle)
    return success_response(BundleOut.model_validate(new_bundle).model_dump(), message="Abonnement activé")
