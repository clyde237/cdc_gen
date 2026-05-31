from sqlalchemy import String, DateTime, ForeignKey, func
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import Mapped, mapped_column, relationship
from db import Base
import uuid


class Projet(Base):
    __tablename__ = "projets"

    id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    user_id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), ForeignKey("users.id"), index=True)
    name: Mapped[str] = mapped_column(String(255), nullable=False)
    projet_type: Mapped[str | None] = mapped_column(String(100), nullable=True)
    template: Mapped[str | None] = mapped_column(String(100), nullable=True)
    main_ai_api: Mapped[str | None] = mapped_column(String(100), nullable=True)
    created_at: Mapped[DateTime] = mapped_column(DateTime(timezone=True), server_default=func.now())
    last_modif: Mapped[DateTime] = mapped_column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now())
    data_file: Mapped[str | None] = mapped_column(String(255), nullable=True)  # chemin vers ProjetData.json

    # Relation
    user: Mapped["User"] = relationship("User", back_populates="projets")
