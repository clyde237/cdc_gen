from pydantic import BaseModel, EmailStr
from datetime import datetime
from uuid import UUID


class UserRegister(BaseModel):
    nom: str
    prenom: str
    email: EmailStr
    password: str
    country: str | None = None
    town: str | None = None
    gmt: int = 0


class UserLogin(BaseModel):
    email: EmailStr
    password: str


class UserOut(BaseModel):
    id: UUID
    nom: str
    prenom: str
    email: str
    user_folder_name: str
    country: str | None
    town: str | None
    gmt: int
    created_at: datetime
    last_login: datetime | None
    is_active: bool

    model_config = {"from_attributes": True}


class TokenOut(BaseModel):
    access_token: str
    token_type: str = "bearer"
    user: UserOut
