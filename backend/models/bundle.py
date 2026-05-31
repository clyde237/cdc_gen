from sqlalchemy import String, Boolean, DateTime, ForeignKey, func
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import Mapped, mapped_column, relationship
from db import Base
import uuid


class Bundle(Base):
    __tablename__ = "bundles"

    id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    user_id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), ForeignKey("users.id"), index=True)
    bundle_type: Mapped[str] = mapped_column(String(50), nullable=False, index=True)  # free | starter | pro | business
    subscribed_date: Mapped[DateTime] = mapped_column(DateTime(timezone=True), server_default=func.now())
    expiration_date: Mapped[DateTime | None] = mapped_column(DateTime(timezone=True), nullable=True)
    is_active: Mapped[bool] = mapped_column(Boolean, default=True)

    # Relation
    user: Mapped["User"] = relationship("User", back_populates="bundles")
