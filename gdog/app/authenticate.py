# -*- coding=utf-8 -*-
import time

from sanic_jwt import Responses
from sanic_jwt import Authentication
from sanic_jwt.exceptions import SanicJWTException

from app.constants import SERVICE_SUCCESS_CODE, UNAUTHENTICATE_CODE, UNAUTHENTICATE_EXPIRED_CODE
from app.utils import response_json


def response(code=SERVICE_SUCCESS_CODE):
    return {'code': code, 'msg': ''}


class AuthInfoIncomplete(SanicJWTException):
    status_code = 406

    def __init__(self, message="Authentication Info Incomplete.", **kwargs):
        super().__init__(message, **kwargs)


class CustomAuthentication(Authentication):

    async def authenticate(self, request, *args, **kwargs):
        union_id = request.json.get("union_id", None)
        if not union_id:
            raise AuthInfoIncomplete("Miss Union_id")
        # 根据union_id查询获取对应的user_id并返回
        SQL = '''select id::varchar from "user" where union_id = $1'''
        async with request.app.db.acquire() as con:
            select_stmt = await con.prepare(SQL)
            id = await select_stmt.fetchval(union_id)
        if not id:
            raise AuthInfoIncomplete('User not found')
        return {"user_id": id}

    async def retrieve_user(self, request, payload, *args, **kwargs):
        if payload:
            user_id = payload.get("user_id", None)
            return {"user_id": user_id}
        else:   # 未拿到对应的user_id，是否返回401鉴权失败
            return None


class CustomerResponses(Responses):
    @staticmethod
    def extend_authenticate(request,
                            user=None,
                            access_token=None,
                            refresh_token=None):
        return {'code': SERVICE_SUCCESS_CODE, 'msg': '', 'expire_time': 30*60}

    @staticmethod
    def extend_retrieve_user(request, user=None, payload=None):
        return response()

    @staticmethod
    def exception_response(request, exception):
        exception_message = str(exception)
        status = exception.status_code
        if status == 200:
            code = SERVICE_SUCCESS_CODE
        elif status == 406:
            code = UNAUTHENTICATE_EXPIRED_CODE
        else:
            code = UNAUTHENTICATE_CODE
        return response_json(None, msg=f'{exception_message}', code=code, status=200)

