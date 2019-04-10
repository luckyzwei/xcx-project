'''
机器人方法调用
'''
import os

from functools import wraps

from config import settings
from app.base import csa
from app.constants import WECHAT_APP_CODE_2_SESSION_URL

basic_path = os.path.abspath(os.path.dirname(__file__))

ROBOT_HOST = settings['ROBOT_HOST']


def _request(func):
    @wraps(func)
    async def wrapper(*args, **kwargs):
        response = await func(*args, **kwargs)
        return await response.json()
        # # try:
        # #     json_data = await response.json()
        # # finally:
        # - 不使用async with时，此处需再考虑是否需要如下操作，根据文档描述如下:
        #     It is not required to call release on the response object.
        #     When the client fully receives the payload,
        #     the underlying connection automatically returns back to pool.
        #     If the payload is not fully read, the connection is closed
        # - 通过看代码，使用async with时的 __aexit__ 方法中调用了release()方法
        # - clientResponse实现的__del__方法中调用了self._connection.release()，
        #   而release()方法做的主要工作也是调用self._connection.release(), 因此可以不用调用release()方法

        # # response.release()
    return wrapper


# ========== 通用请求方法 ============ #

async def do_get(url):
    '''通用get,返回格式非json'''
    return await csa.session.get(url)


# =========== 机器人服务请求 ========== #


@_request
async def group_message_request(data):
    '''群消息发送'''
    url = ROBOT_HOST + '/gbot/send_group_message'
    return await csa.session.post(url, json=data)


@_request
async def private_message_request(data):
    '''私聊消息发送'''
    url = ROBOT_HOST + '/gbot/send_private_message'
    return await csa.session.post(url, json=data)


@_request
async def group_mem_info(data):
    '''获取群成员信息'''
    url = ROBOT_HOST + '/gbot/users?user_ids=' + data
    return await csa.session.get(url)


@_request
async def update_robot_nickname(data):
    """修改机器人昵称"""
    url = ROBOT_HOST + '/gbot/modify_group_robot_nickname'
    return await csa.session.post(url, json=data)


@_request
async def activate_group(data):
    """开通群"""
    url = ROBOT_HOST + '/gbot/bind_group'
    return await csa.session.post(url, json=data)


@_request
async def sync_group_members(data):
    """发起同步群成员"""
    url = ROBOT_HOST + '/gbot/sync_group_members'
    return await csa.session.post(url, json=data)


@_request
async def get_group_info(group_code):
    url = ROBOT_HOST + '/gbot/group/{group_id}'
    url = url.format(group_id=group_code)
    return await csa.session.get(url)


@_request
async def cancel_group(data):
    '''注销群'''
    url = ROBOT_HOST + '/gbot/unbind_group'
    return await csa.session.post(url, json=data)


@_request
async def get_robot_quota(data):
    '''获取机器人开通的群列表'''
    url = ROBOT_HOST + '/gbot/robot/{robot_id}/groups'
    url = url.format(robot_id=data)
    return await csa.session.get(url)


@_request
async def get_robot_info(data):
    '''获取机器人基本信息'''
    url = ROBOT_HOST + '/gbot/robot/{robot_id}'
    url = url.format(robot_id=data)
    return await csa.session.get(url)


@_request
async def robot_invite_user(data):
    '''获取机器人基本信息'''
    url = ROBOT_HOST + '/gbot/robot_invite_user'
    return await csa.session.post(url, json=data)

# ========== 外部对接服务 ========== #


async def code2session(app_id, app_secret, code):
    """微信小程序通过code换取session_key"""
    url = WECHAT_APP_CODE_2_SESSION_URL.format(app_id=app_id, app_secret=app_secret, code=code)
    return await csa.session.get(url)


async def send_resp_customer_msg(url, data):
    return await csa.session.post(url, data=data, headers={'content-type': 'application/json;charset=utf-8'})
