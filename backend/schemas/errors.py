from enum import IntEnum


class ApiErrors(IntEnum):
    UNAUTHORIZED    = 401
    FORBIDDEN       = 403
    BUNDLE_EXPIRED  = 4031
    BUNDLE_LIMIT    = 4032
    ADMIN_FORBIDDEN = 4033
    NOT_FOUND       = 404
    STORAGE_ERROR   = 500
    AI_ERROR        = 502
    DB_ERROR        = 503


def error_response(code: ApiErrors, message: str) -> dict:
    return {
        "success": False,
        "error": {
            "code": int(code),
            "type": code.name,
            "message": message,
        }
    }


def success_response(data=None, message: str = "OK") -> dict:
    return {
        "success": True,
        "data": data,
        "message": message,
    }
