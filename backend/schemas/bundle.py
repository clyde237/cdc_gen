from pydantic import BaseModel
from datetime import datetime
from uuid import UUID
from typing import Literal


class BundleOut(BaseModel):
    id: UUID
    user_id: UUID
    bundle_type: Literal["free", "starter", "pro", "business"]
    subscribed_date: datetime
    expiration_date: datetime | None
    is_active: bool

    model_config = {"from_attributes": True}


class BundleSubscribe(BaseModel):
    bundle_type: Literal["free", "starter", "pro", "business"]
