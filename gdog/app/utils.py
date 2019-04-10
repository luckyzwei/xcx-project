import decimal
import hashlib
import json
import datetime

from uuid import UUID

from sanic.log import logger
from sanic.response import json as resp_json
from app.route_requests import group_message_request, private_message_request
from app.constants import SERVICE_SUCCESS_CODE, MSGTYPE


BOT_MSG_SUCCESS = '100'


class UUIDEncoder(json.JSONEncoder):
    def default(self, obj):
        if isinstance(obj, UUID):
            return obj.hex
        if isinstance(obj, decimal.Decimal):
            return str(obj)
        return json.JSONEncoder.default(self, obj)


def _response(code=SERVICE_SUCCESS_CODE, msg='', data=None, page_info=None):
    rs = {
        'code': code,
        'description': msg,
        'data': None,
    }
    if data is not None:
        rs['data'] = data
    if page_info is not None:
        rs['page_info'] = page_info
    return rs


def response_json(data, code=SERVICE_SUCCESS_CODE, msg='', page_info=None, **kwargs):
    body = _response(code=code, msg=msg, data=data, page_info=page_info)
    return resp_json(body, dumps=json.dumps, cls=UUIDEncoder, **kwargs)


def dumps(data):
    return json.dumps(data, cls=UUIDEncoder)


def today():
    '''今日日期'''
    return datetime.datetime.now().strftime("%Y-%m-%d")


def yesterday():
    '''昨日天数'''
    yes_date = datetime.datetime.now().date() - datetime.timedelta(days=1)
    return yes_date.strftime("%Y-%m-%d")


def str_to_date(day):
    '''字符串转换为日期格式'''
    return datetime.datetime.strptime(day, '%Y-%m-%d')


def records_to_list(records):
    if records is None:
        return None
    result = []
    for record in records:
        result.append(dict(record))
    return result


def records_to_value_list(records, key):
    result = []
    for record in records:
        result.append(dict(record)[key])
    return result


def data_md5(data):
    if not isinstance(data, str):
        raise TypeError('support string md5!')
    secret_md5 = hashlib.md5()
    secret_md5.update(data.encode('utf-8'))
    return secret_md5.hexdigest()


def get_page_info(page_size, current_page, total_records):
    '''获取分页信息'''
    if page_size == -1:
        total_page = 1
        page_size = total_records
    else:
        if total_records % page_size == 0:
            total_page = int(total_records/page_size)
        else:
            total_page = int(total_records/page_size)+1
    page_info = {
        'current_page': current_page,   # 当前第几页
        'page_size': page_size,         # 每页数量
        'total_page': total_page,       # 总页数
        'total_records': total_records  # 总数量
    }
    return page_info


async def package_msg_data(type, **kwargs):
    data = dict(messages=[{'type': type, 'content': kwargs.pop('content'), 'title': kwargs.pop('title', ''),
                           'url': kwargs.pop('href', ''), 'desc': kwargs.pop('desc', ''), 'voice_time': '0',
                           'message_no': kwargs.pop('msg_no')}])
    if kwargs.get('group_id', None):
        user_id = kwargs.pop('user_id', [])
        if isinstance(user_id, list):
            data.update({'users': user_id, 'all': False})
        else:
            data.update({'users': [user_id], 'all': False})
        data.update(**kwargs)
        logger.debug(f'send group msg: {data}')
        resp = await group_message_request(data)
    else:
        kwargs.pop('group_id')
        data.update(**kwargs)
        logger.info(f'send private msg: {data}')
        resp = await private_message_request(data)
    if str(resp['code']) != BOT_MSG_SUCCESS:
        logger.warning(f'data: {data}, response: {resp}')
    return resp


def until_tomorrow_expire_time():
    tomorrow_date = datetime.date.today() + datetime.timedelta(days=1)
    tomorrow = datetime.datetime.combine(tomorrow_date, datetime.datetime.min.time())
    now = datetime.datetime.now()
    time_delta = tomorrow - now
    return time_delta.seconds


async def send_text_msg(robot_code, member_code, content, group_code=None, msg_no=""):
    '''发送文本消息'''
    kw = {'robot_id': robot_code, 'user_id': member_code, 'content': content, 'group_id': group_code, 'msg_no': msg_no}
    return await package_msg_data(MSGTYPE.TEXT, **kw)


async def send_image_msg(robot_code, member_code, content, group_code=None, msg_no=""):
    '''发送图片消息'''
    kw = {'robot_id': robot_code, 'user_id': member_code, 'content': content, 'group_id': group_code, 'msg_no': msg_no}
    return await package_msg_data(MSGTYPE.IMAGE, **kw)


async def send_url_link_msg(robot_code, member_code, content, title, href, desc, group_code=None, msg_no=""):
    '''发送链接消息'''
    kw = {'robot_id': robot_code, 'user_id': member_code, 'content': content,
          'group_id': group_code, 'title': title, 'href': href, 'desc': desc, 'msg_no': msg_no}
    return await package_msg_data(MSGTYPE.LINK, **kw)


async def send_mini_program_msg(robot_code, member_code, content, title, href, desc, group_code=None, msg_no=""):
    '''发送消息'''
    kw = {'robot_id': robot_code, 'user_id': member_code, 'content': content,
          'group_id': group_code, 'title': title, 'href': href, 'desc': desc, 'msg_no': msg_no}
    return await package_msg_data(MSGTYPE.MINI_PROGRAM, **kw)


async def send_user_card_msg(robot_code, member_code, content, group_code=None, msg_no=""):
    '''发送消息'''
    kw = {'robot_id': robot_code, 'user_id': member_code, 'content': content, 'group_id': group_code, 'msg_no': msg_no}
    return await package_msg_data(MSGTYPE.USER_CARD, **kw)
