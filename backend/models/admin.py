from sqlalchemy import String, DateTime, func
from sqlalchemy.dialects.postgresql import UUID, BYTEA
from sqlalchemy.orm import Mapped, mapped_column
from db import Base
import uuid


class Admin(Base):
    __tablename__ = "admins"

    id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    email: Mapped[str] = mapped_column(String(255), unique=True, nullable=False)
    password: Mapped[bytes] = mapped_column(BYTEA, nullable=False)
    role: Mapped[str] = mapped_column(String(50), default="admin")  # admin | superadmin
    created_at: Mapped[DateTime] = mapped_column(DateTime(timezone=True), server_default=func.now())
