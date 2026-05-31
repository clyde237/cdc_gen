from fastapi import APIRouter, Depends
from models.user import User
from schemas.errors import success_response
from core.security import get_current_user
from core.file_manager import read_history

router = APIRouter(prefix="/api/history", tags=["History"])


@router.get("")
async def get_history(current_user: User = Depends(get_current_user)):
    history = await read_history(current_user.user_folder_name)
    return success_response(history)
