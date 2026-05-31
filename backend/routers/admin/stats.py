"""
Admin Stats — endpoints analytics pour le backoffice.
À compléter en Phase 4 avec les vraies agrégations SQL.
"""
from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, func, and_
from datetime import datetime, timezone, timedelta

from db import get_db
from models.admin import Admin
from models.user import User
from models.bundle import Bundle
from models.session import Session
from models.admin_event import AdminEvent
from schemas.errors import success_response
from core.security import get_current_admin

router = APIRouter(prefix="/api/admin", tags=["Admin - Stats"])


@router.get("/live/connected")
async def live_connected(
    current_admin: Admin = Depends(get_current_admin),
    db: AsyncSession = Depends(get_db)
):
    """Utilisateurs avec une session active."""
    result = await db.execute(
        select(func.count()).select_from(Session).where(Session.is_active == True)
    )
    count = result.scalar()
    return success_response({"connected": count})


@router.get("/stats/users")
async def stats_users(
    current_admin: Admin = Depends(get_current_admin),
    db: AsyncSession = Depends(get_db)
):
    total = (await db.execute(select(func.count()).select_from(User))).scalar()
    active = (await db.execute(select(func.count()).select_from(User).where(User.is_active == True))).scalar()
    return success_response({"total": total, "active": active})


@router.get("/stats/registrations")
async def stats_registrations(
    current_admin: Admin = Depends(get_current_admin),
    db: AsyncSession = Depends(get_db)
):
    """Inscriptions des 30 derniers jours."""
    since = datetime.now(timezone.utc) - timedelta(days=30)
    result = await db.execute(
        select(func.count()).select_from(AdminEvent)
        .where(and_(AdminEvent.event_type == "register", AdminEvent.created_at >= since))
    )
    return success_response({"registrations_last_30_days": result.scalar()})


@router.get("/stats/bundles")
async def stats_bundles(
    current_admin: Admin = Depends(get_current_admin),
    db: AsyncSession = Depends(get_db)
):
    """Répartition des bundles actifs."""
    result = await db.execute(
        select(Bundle.bundle_type, func.count().label("count"))
        .where(Bundle.is_active == True)
        .group_by(Bundle.bundle_type)
    )
    rows = result.all()
    return success_response({row.bundle_type: row.count for row in rows})


@router.get("/stats/countries")
async def stats_countries(
    current_admin: Admin = Depends(get_current_admin),
    db: AsyncSession = Depends(get_db)
):
    result = await db.execute(
        select(User.country, func.count().label("count"))
        .where(User.country != None)
        .group_by(User.country)
        .order_by(func.count().desc())
    )
    rows = result.all()
    return success_response([{"country": r.country, "count": r.count} for r in rows])
