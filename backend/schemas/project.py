from pydantic import BaseModel
from datetime import datetime
from uuid import UUID


class ProjectCreate(BaseModel):
    name: str
    projet_type: str
    template: str
    main_ai_api: str = "mistral"


class ProjectUpdate(BaseModel):
    name: str | None = None
    projet_type: str | None = None
    template: str | None = None
    main_ai_api: str | None = None


class ProjectOut(BaseModel):
    id: UUID
    user_id: UUID
    name: str
    projet_type: str | None
    template: str | None
    main_ai_api: str | None
    created_at: datetime
    last_modif: datetime
    data_file: str | None

    model_config = {"from_attributes": True}
