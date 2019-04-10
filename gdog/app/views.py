# -*- coding=utf-8 -*-
import json
import math
import uuid
import time
import hashlib
import random
import base64
import ujson
from io import BytesIO

from Crypto.Cipher import AES
from PIL import Image
from sanic.exceptions import FileNotFound
from sanic.log import logger
from sanic_jwt import protected
from sanic_jwt.decorators import inject_user

from app import db, redis, inner_mq
from app.constants import *
from config import settings
from app.route_requests import robot_invite_user, code2session, do_get, send_resp_customer_msg
from app.utils import response_json, records_to_list, until_tomorrow_expire_time, data_md5, send_text_msg, send_image_msg
from sanic.response import text, file, stream


@protected()
@inject_user()
async def robot_distribution_view(request, user):
    ''' 机器人分配逻辑
    1. 用户信息未补全的分配情况 -> 随机分配一个有额度的机器人
    2. 用户信息已补全，没有分配记录的分配情况 -> 优先查询添加的机器人好友分配，其次随机分配
    3. 用户信息补全，且有分配记录的情况 -> 分配已经分配过的机器人给用户
    '''
    async def check_user_info_compelect(user_id):
        async with db.conn.acquire() as con:
            st = await con.prepare('select code from "user" where id = $1')
            return await st.fetchval(user_id)

    async def user_robots_distribute(user_id):
        robot_id = await priority_select_distribute_robot(user_id)
        if robot_id: return False, robot_id
        async with db.conn.acquire() as con:
            st = await con.prepare('''
                select "robot_add_friend".robot_id, ("robot".count_threshold - "robot".count_distribute) as amount   
                from "robot_add_friend" join "robot" on "robot_add_friend".robot_id = "robot".id 
                where "robot_add_friend".user_id = $1 and "robot_add_friend".status <> 3 and "robot".status <> 3 
                and "robot".count_threshold - "robot".count_distribute > 0''')
            robot_ids = await st.fetch(user_id)
        robot_id = await check_robots_amount_select_one(robot_ids)
        if not robot_ids and not robot_id:
            robot_id = await random_robots_distribute(user_id)
            return False, robot_id
        return True, robot_id

    async def check_robots_amount_select_one(robots):
        random.shuffle(robots)
        for robot in robots:
            temp_used_amount = await redis.conn.get(CACHE_TEMP_ROBOT_AMOUNT_USED.format(robot_id=robot['robot_id']))
            amount = robot['amount'] - int(temp_used_amount) if temp_used_amount else robot['amount']
            if amount > 0:
                return robot['robot_id']
        return False

    async def create_robot_distribute(user_id, robot_id, count=settings['ROBOT_DISTRIBUTE_COUNT']):
        async with db.conn.acquire() as con:
            st = await con.prepare('select code from "user" where id = $1')
            user_code = await st.fetchval(user_id)
            it = await con.prepare('''
                insert into "robot_distribute" (id, robot_id, user_id, user_code, distribute_count) 
                values (uuid_generate_v4(), $1, $2, $3, $4)''')
            await it.fetch(robot_id, user_id, user_code, count)
            ut = await con.prepare('update "robot" set count_distribute=count_distribute + 1 where id = $1')
            await ut.fetch(robot_id)

    async def get_robot_code_by_id(id):
        async with db.conn.acquire() as con:
            st = await con.prepare('select code from "robot" where id = $1')
            return await st.fetchval(id)

    async def priority_select_distribute_robot(user_id):
        robot_id = await redis.conn.get(CACHE_TEMP_USER_ROBOT_DISTRIBUTE.format(user_id=user_id))
        if robot_id:
            robot_code = await get_robot_code_by_id(robot_id)
            nickname = await get_user_by_id(user_id)
            nickname_md5 = data_md5(nickname)
            value = {'type': TYPE.ROBOT_ENTER_GROUP, 'user_id': user_id}
            await redis.conn.set(CACHE_ROBOT_LASTED_OPERATE.format(robot_code=robot_code, nickname_md5=nickname_md5), ujson.dumps(value))
            logger.info(f'robot:{robot_code} enter group nickname:{nickname}, nickname_md5:{nickname_md5}')
        return robot_id

    async def random_robots_distribute(user_id):
        robot_id = await priority_select_distribute_robot(user_id)
        if robot_id: return robot_id
        async with db.conn.acquire() as con:
            robots = await con.fetch('''
                select id as robot_id, (count_threshold - count_distribute) as amount from "robot" 
                where status <> 3 and count_threshold - count_distribute > 0''')
        robot_id = await check_robots_amount_select_one(records_to_list(robots))
        if robot_id:
            await cache_user_robot_distribute(user_id, robot_id)
        return robot_id

    async def distribute_robot_info(robot_id):
        async with db.conn.acquire() as con:
            st = await con.prepare('select name, head_url, qr_code as qrcode, wechat_no from "robot" where id = $1')
            return dict(await st.fetchrow(robot_id))

    async def check_user_robot_distribute(user_id):
        async with db.conn.acquire() as con:
            st = await con.prepare('''
                select "robot_distribute".robot_id from "robot_distribute" 
                join "robot" on "robot_distribute".robot_id = "robot".id 
                where "robot_distribute".user_id = $1 and "robot_distribute".status <> 3
                order by "robot_distribute".create_date desc limit 1''')
            return await st.fetchval(user_id)

    async def get_user_by_id(id):
        async with db.conn.acquire() as con:
            st = await con.prepare('select nickname from "user" where id = $1')
            return await st.fetchval(id)

    async def cache_user_robot_distribute(user_id, robot_id):
        nickname = await get_user_by_id(user_id)
        nickname_md5 = data_md5(nickname)
        value = {'type': TYPE.ROBOT_ENTER_GROUP, 'user_id': user_id}
        robot_code = await get_robot_code_by_id(robot_id)
        logger.info(f'robot:{robot_code} enter group nickname:{nickname}, nickname_md5:{nickname_md5}')
        async with await redis.conn.pipeline() as pipe:
            await pipe.set(f'temp_distribute:{user_id}', robot_id, ex=until_tomorrow_expire_time())
            await pipe.incr(CACHE_TEMP_ROBOT_AMOUNT_USED.format(robot_id=robot_id), 1)
            await pipe.expire(CACHE_TEMP_ROBOT_AMOUNT_USED.format(robot_id=robot_id), until_tomorrow_expire_time())
            await redis.conn.set(CACHE_ROBOT_LASTED_OPERATE.format(robot_code=robot_code, nickname_md5=nickname_md5), ujson.dumps(value))
            await pipe.execute()

    async def send_pull_group_msg(robot_id, user_id):
        async with db.conn.acquire() as con:
            robot_code = await con.fetchval('select code from "robot" where id = $1', robot_id)
            user_code = await con.fetchval('select code from "user" where id = $1', user_id)
        await send_text_msg(robot_code, user_code, PULL_GROUP_TEXT)
        guide_picture = settings['EXTERNAL_HOST'] + '/static/image/guide.png'
        await send_image_msg(robot_code, user_code, guide_picture)

    user_id = user['user_id']
    if await check_user_info_compelect(user_id):
        robot_id = await check_user_robot_distribute(user_id)
        if robot_id:
            logger.info(f'user: {user_id} all info compelete, enter H5 robot distribute!!')
            robot_info = await distribute_robot_info(robot_id)
            return response_json(robot_info)
        is_add_friend, robot_id = await user_robots_distribute(user_id)
        if not robot_id:
            logger.info(f'user: {user_id} get robot not enough')
            return response_json(None, code=ROBOT_NOT_ENOUGH_CODE)
        if is_add_friend:
            logger.info(f'user: {user_id} distribute friend robot: {robot_id}')
            await create_robot_distribute(user_id, robot_id)
            await send_pull_group_msg(robot_id, user_id)
    else:
        robot_id = await random_robots_distribute(user_id)
        if not robot_id:
            return response_json(None, code=ROBOT_NOT_ENOUGH_CODE)
    logger.info(f'user: {user_id} distribute robot: {robot_id}')
    robot_info = await distribute_robot_info(robot_id)
    return response_json(robot_info)


@protected()
@inject_user()
async def group_forever_qrcode_view(request, user, group_code):
    '''群永久二维码查询'''
    async with db.conn.acquire() as con:
        st = await con.prepare('select code, name from "group" where code = $1 and user_id = $2 and status <> 3')
        group = await st.fetchrow(group_code, user['user_id'])
    if not group:
        return response_json(None, code=PARAMS_ERROR_CODE)
    group_info = dict(group)
    return response_json({'name': group_info['name'], 'qrcode': FOREVER_QRCODE.format(code=group_info['code'])})


@protected()
@inject_user()
async def group_robot_show_view(request, user, group_code):
    '''群指定机器人二维码查询
       1. 用户已加好友，直接发送群邀请
       2. 用户未加好友且机器人当日加好友未达到60人上限时，展示机器人页面
    '''
    async def group_robot_search(group_code):
        async with db.conn.acquire() as con:
            st = await con.prepare('''
                select "robot".id as robot_id, "robot".code as robot_code, "group".code as group_code, "group".name, 
                "robot".qr_code as qrcode from "group" join "robot_group_map" on "group".id = "robot_group_map".group_id 
                join "robot" on "robot_group_map".robot_id = "robot".id where "group".code = $1 and "group".status <> 3 
                and "robot_group_map".status <> 3 and "robot".status <> 3''')
            return await st.fetchrow(group_code)

    async def whether_robot_added_friend(robot_id, max_count=60):
        async with db.conn.acquire() as con:
            st = await con.prepare(
                'select count(1) from "robot_add_friend" where robot_id = $1 and create_date::date = current_date')
            add_counts = await st.fetchval(robot_id)
        if add_counts <= max_count:
            return True
        return False

    async def check_robot_user_relationship(robot_id, user_id):
        async with db.conn.acquire() as con:
            st = await con.prepare(
                'select id from "robot_add_friend" where robot_id = $1 and user_id = $2')
            return await st.fetchrow(robot_id, user_id)

    async def get_user_by_id(id):
        async with db.conn.acquire() as con:
            st = await con.prepare('select code, nickname from "user" where id = $1')
            return await st.fetchrow(id)

    async def acquire_lock_group(lock_name, release_time=30):
        identifier = str(uuid.uuid4())
        lock_name = 'lock:invite_group:' + lock_name
        lock_timeout = int(math.ceil(release_time))
        if await redis.conn.set(lock_name, identifier, nx=True, ex=lock_timeout):
            return True
        return False

    # 未找到对应的机器人信息，跳群已失效错误页
    user_id = user['user_id']
    data = await group_robot_search(group_code)
    if not data:
        logger.info(f'group: {group_code} user: {user_id} not match')
        return response_json(None, code=PARAMS_ERROR_CODE)
    resp_data = {'name': data['name'], 'qrcode': data['qrcode']}
    # 检查用户和机器人好友关系，若为好友则直接发送群消息
    user_info = await get_user_by_id(user_id)
    user_code =  user_info['code']
    robot_code = data['robot_code']
    if await check_robot_user_relationship(data['robot_id'], user_id):
        if await acquire_lock_group(':'.join([group_code, user_code]), release_time=6 * 3600):
            data = {'user_id': user_code, 'group_id': group_code, 'robot_id': robot_code}
            resp = await robot_invite_user(data)
            logger.info(f'invite into group: {data}, response: {resp}')
        else:
            logger.info(f'user: {user_code} has benn invited to group: {group_code}')
        return response_json(resp_data)
    # 当日加好友超60人，提示加好友上限错误页
    if not await whether_robot_added_friend(robot_id=data['robot_id']):
        logger.info(f'robot {data["robot_id"]} reach add friend limited: 60')
        return response_json(None, code=RESOURCE_NOT_FOUND_CODE)
    # 缓存群+机器人+用户关联关系, 记录用户最后一次操作是入群操作
    await redis.conn.set(CACHE_BIND_USER_ROBOT_GROUP_MAP.format(
        robot_code=robot_code, user_id=user_id), group_code, ex=DISTRIBUTE_EXPIRE_TIME)
    nickname_md5 = data_md5(user_info['nickname'])
    value = {'type': TYPE.PULL_USER_GROUP, 'user_id': user_id}
    await redis.conn.set(CACHE_ROBOT_LASTED_OPERATE.format(robot_code=robot_code, nickname_md5=nickname_md5), ujson.dumps(value))
    logger.info(f'pull user:{user_info["nickname"]} join group: {group_code}, robot_code: {robot_code}, nickname_md5:{nickname_md5} ')
    return response_json(resp_data)


async def get_user_status_view(request):
    """查询用户的状态"""
    async def user_group(user_id):
        async with db.conn.acquire() as con:
            get_user_stmt = await con.prepare('''select code from  "group" where user_id = $1 and status <> 3''')
            return await get_user_stmt.fetchval(user_id)

    union_id = request.raw_args.get('union_id')
    user_status = {"received": 1, "unreceived": 0}  # 1 表示已领取，0表示未领取
    data = {"status": user_status['unreceived'], 'group_code': '', 'head_url': '', 'robot_name': ''}
    if not union_id: return response_json(data)
    async with db.conn.acquire() as con:
        user_stmt = await con.prepare('select id from "user" where union_id = $1')
        user_id = await user_stmt.fetchval(union_id)
        if not user_id: return response_json(data)
        select_stmt = await con.prepare('''
            select robot.name as robot_name, robot.head_url from "robot" 
            join "robot_distribute" rd on robot.id = rd.robot_id where rd.user_id = $1 and rd.status <> 3 ''')
        result = await select_stmt.fetchrow(user_id)
        if result is not None:
            group_code = await user_group(user_id)
            data = {'status': user_status['received'], 'group_code': group_code,
                    'head_url': result['head_url'], 'robot_name': result['robot_name']}
        else:
            data = {"status": user_status['unreceived'], 'group_code': '', 'head_url': '', 'robot_name': ''}
    return response_json(data)


@protected()
@inject_user()
async def update_group_welcome_msg_view(request, user, group_id):
    """设置群欢迎语"""
    switch = request.json.get('switch')
    welcome_msg = request.json.get('msg', DEFAULT_WELCOME_MSG)
    async with db.conn.acquire() as con:
        update_stmt = await con.prepare('''
            update "group" set welcome_msg = $1, welcome_msg_switch = $2, update_date = now() where id = $3 ''')
        await update_stmt.fetch(welcome_msg, switch, group_id)
    return response_json(None)


@protected()
@inject_user()
async def group_welcome_msg_view(request, user):
    """查询用户群欢迎语"""
    user_id = user.get('user_id')
    async with db.conn.acquire() as con:
        select_stmt = await con.prepare('''
            select id::varchar, name, welcome_msg_switch as switch, welcome_msg as msg 
            from "group" where user_id = $1 and status <> 3''')
        group_welcome = records_to_list(await select_stmt.fetch(user_id))
    if not group_welcome:
        return response_json(group_welcome, code=RESOURCE_NOT_FOUND_CODE)
    return response_json(group_welcome)


async def wechat_app_user_info_view(request):
    """
    小程序获取用户信息
    1. 通过code换取session_key
    2. 通过session_key解析加密
    """

    async def get_session_key_by_code(app_id, app_secret, code):
        resp_json = await code2session(app_id, app_secret, code)
        return ujson.loads(await resp_json.content.read()).get('session_key')

    async def decode_user_info(session_key, encrypted_data, iv):
        session_key = base64.b64decode(session_key)
        encrypted_data = base64.b64decode(encrypted_data)
        iv = base64.b64decode(iv)
        cipher = AES.new(session_key, AES.MODE_CBC, iv)
        return ujson.loads(unpad(cipher.decrypt(encrypted_data)))

    def unpad(s):
        return s[:-ord(s[len(s)-1:])]

    async def data_operation(user_info):
        user_info['unionid'] = user_info.pop("unionId")
        user_info['headimgurl'] = user_info.pop("avatarUrl")
        user_info['nickname'] = user_info.pop("nickName")
        return user_info

    try:
        session_key = await get_session_key_by_code(request.json.get('app_id'), WECHAT_APP_SECRET, request.json.get('code'))
        user_info = await decode_user_info(session_key, request.json.get('encrypted_data'), request.json.get('iv'))
        user_info = await data_operation(user_info)  # 数据转换, 解决小程序与公众号获取到信息不一致的问题
        await create_or_update_user_info(user_info)
        return response_json(user_info)
    except Exception as e:
        logger.error(f'app get user info error:{e}')
        return response_json(None, WECHAT_AUTH_ERROR)


async def wechat_h5_user_info_view(request):
    """
    H5授权获取用户信息
    1. 通过code请求网页授权获取access_token以及open_id
    2. 根据access_token，open_id获取用户信息
    """

    async def get_access_token(app_id, code):
        url = WECHAT_H5_GET_ACCESS_TOKEN_URL.format(app_id=app_id, secret=WECHAT_H5_APP_SECRET, code=code)
        resp_json = await do_get(url)
        resp_json = ujson.loads(await resp_json.content.read())
        if 'errmsg' in resp_json:
            logger.error(f'get access_token error: {resp_json}')
            raise Exception
        return resp_json

    async def get_user_from_wechat(access_token, open_id):
        get_user_info_url = WECHAT_H5_GET_USER_INFO_URL.format(access_token=access_token, open_id=open_id)
        resp_json = await do_get(get_user_info_url)
        resp_json = ujson.loads(await resp_json.content.read())
        if 'errmsg' in resp_json:
            logger.info(f'get user info error: {resp_json}')
            raise Exception
        return resp_json

    try:
        oauth_dict = await get_access_token(request.args.get("app_id"), request.args.get("code"))
        user_info = await get_user_from_wechat(oauth_dict.get('access_token'), oauth_dict.get('openid'))
        await create_or_update_user_info(user_info)
        return response_json(user_info)
    except Exception as e:
        logger.error(f'h5 get user info error:{e}')
        return response_json(None, WECHAT_AUTH_ERROR)


async def create_or_update_user_info(user_info):
    """
    授权时创建或者更新用户信息
    """
    async def user_exists(union_id):
        async with db.conn.acquire() as con:
            get_user_stmt = await con.prepare('select id from "user" where union_id = $1')
            return await get_user_stmt.fetchval(union_id)

    async def save_user(union_id, head_url, nickname):
        async with db.conn.acquire() as con:
            insert_user_stmt = await con.prepare(
                'insert into "user" (id, union_id, head_url, nickname) values (uuid_generate_v4(), $1, $2, $3)')
            await insert_user_stmt.fetch(union_id, head_url, nickname)

    async def update_user(user_id, union_id, head_url, nickname):
        async with db.conn.acquire() as con:
            # 此处暂时不更新update_date
            update_user_stmt = await con.prepare(
                'update "user" set union_id = $1, head_url = $2, nickname = $3 where id = $4')
            await update_user_stmt.fetch(union_id, head_url, nickname, user_id)

    union_id = user_info.get('unionid')
    head_url = user_info.get('headimgurl')
    nickname = user_info.get('nickname')
    logger.debug(f'wechat auth params: {user_info}')
    user_id = await user_exists(union_id)
    if user_id:
        await update_user(user_id, union_id, head_url, nickname)
    else:
        await save_user(union_id, head_url, nickname)


async def wechat_h5_js_ticket_view(request):
    """
    获取微信分享ticket，主要用于页面分享
    """
    async def generate_ticket(app_id):
        wechat_h5_access_token = await get_h5_access_token(app_id)
        ticket_resp_json = await do_get(WECHAT_H5_TICKET_URL.format(access_token=wechat_h5_access_token))
        ticket_json = ujson.loads(await ticket_resp_json.content.read())
        js_ticket = ticket_json['ticket']
        await redis.conn.set(CACHE_JS_API_TICKET.format(app_id=app_id), js_ticket, ex=ticket_json['expires_in'] - 200)
        return js_ticket

    async def get_h5_access_token(app_id):
        redis_key = CACHE_WECHAT_H5_ACCESS_TOKEN.format(app_id=app_id)
        if await redis.conn.exists(redis_key):
            return await redis.conn.get(redis_key)
        else:
            # 获取access_token
            token_resp_json = await do_get(WECHAT_H5_GET_TOKEN_URL.format(app_id=app_id, secret=WECHAT_H5_APP_SECRET))
            access_token_json = ujson.loads(await token_resp_json.content.read())
            if 'errmsg' in access_token_json:
                logger.info(f'get h5 token error: {access_token_json}')
                raise Exception
            wechat_h5_access_token = access_token_json['access_token']
            await redis.conn.set(redis_key, wechat_h5_access_token, ex=access_token_json['expires_in'] - 200)
            return wechat_h5_access_token

    app_id = request.args.get("app_id")
    url = request.args.get("url")
    redis_key = CACHE_JS_API_TICKET.format(app_id=app_id)
    # 根据app_id获取ticket
    if await redis.conn.exists(redis_key):
        ticket = await redis.conn.get(redis_key)
    else:
        ticket = await generate_ticket(app_id)
    # 签名用的随机字符串
    noncestr = str(uuid.uuid4())
    # 签名时间戳，精确到s
    timestamp = str(int(round(time.time())))
    signature = WECHAT_H5_TICKET_SIGNATURE.format(ticket=ticket, noncestr=noncestr, timestamp=timestamp, url=url)
    hash_sha1 = hashlib.sha1()
    hash_sha1.update(signature.encode('utf-8'))
    signature = hash_sha1.hexdigest()
    resp_dict = {'app_id': app_id, 'timestamp': timestamp, 'noncestr': noncestr, 'signature': signature}
    return response_json(resp_dict)


async def wechat_customer_msg_verify_view(request):
    """
    微信验证服务器地址
    """
    echostr = request.args.get("echostr")
    return text(echostr)


async def wechat_customer_msg_callback_view(request):
    """
    接受微信客服消息回调
    """
    async def resp_customer_msg(customer_msg_dict):
        app_access_token = await get_access_token()
        url = settings['EXTERNAL_HOST'] + '/robot-qrcode'
        mini_program_cover = settings['EXTERNAL_HOST'] + '/static/image/mini_program_cover.png'
        title = '点击获取【看门狗】二维码'
        desc = '长按识别看门狗二维码，领取看门狗'
        msg_params = {
            'touser': customer_msg_dict['FromUserName'],
            'msgtype': 'link',
            'link': {
                'title': title,
                'description': desc,
                'url': url,
                'thumb_url': mini_program_cover
            }
        }
        json_data = json.dumps(msg_params, ensure_ascii=False)
        url = WECHAT_H5_RESP_CUSTOMER_MSG_URL.format(access_token=app_access_token)
        await send_resp_customer_msg(url, json_data)

    async def get_access_token():
        redis_key = CACHE_WECHAT_APP_ACCESS_TOKEN.format(app_id=WECHAT_APP_ID)
        if await redis.conn.exists(redis_key):
            return await redis.conn.get(redis_key)
        else:
            url = WECHAT_APP_GET_ACCESS_TOKEN_URL.format(app_id=WECHAT_APP_ID, app_secret=WECHAT_APP_SECRET)
            access_token_resp_json = await do_get(url)
            access_token_resp_json = ujson.loads(await access_token_resp_json.content.read())
            if 'errmsg' in access_token_resp_json:
                logger.info(f'get app access_token error: {access_token_resp_json}')
                raise Exception
            app_access_token = access_token_resp_json.get('access_token')
            expires_in = access_token_resp_json.get('expires_in')
            await redis.conn.set(redis_key, app_access_token, ex=expires_in - 200)
            return app_access_token

    try:
        customer_msg_dict = request.json
        logger.info(f'receive wechat customer msg callback, {customer_msg_dict}')
        if customer_msg_dict['MsgType'] in WECHAT_CUSTOMER_MSG_CALLBACK_TYPE:
            await resp_customer_msg(customer_msg_dict)
        return text('success')
    except Exception as e:
        logger.error(f'resp customer msg, get access token error:{e}')
        return text('success')


@protected()
@inject_user()
async def update_group_ad_monitor_msg_view(request, user, group_id):
    """设置群广告监测"""
    async def ad_monitor_switch_to_bi(group_id):
        async with db.conn.acquire() as con:
            st = await con.prepare('select code, ad_monitor_msg_switch from "group" where id = $1')
            return await st.fetchrow(group_id)

    switch = request.json.get('switch')
    group_ad_monitor_msg = request.json.get('msg', DEFAULT_AD_MONITOR_MSG)
    group = await ad_monitor_switch_to_bi(group_id)
    async with db.conn.acquire() as con:
        update_stmt = await con.prepare(
            'update "group" set ad_monitor_msg = $1, ad_monitor_msg_switch = $2, update_date = now() where id = $3 ')
        await update_stmt.fetch(group_ad_monitor_msg, switch, group_id)
    # 查询修改的开关与库中开关的值，判断是否传送BI
    if switch != group['ad_monitor_msg_switch']:
        data = {'command': 'ad_msg_monitor_switch', 'body': {'group_code': group['code'], 'switch': switch}}
        logger.info(f'group: {group_id}, change switch: {switch}')
        await inner_mq.send('queue.dog.ad.switch', data)
    return response_json(None)


@protected()
@inject_user()
async def group_ad_monitor_msg_view(request, user):
    """查询群广告监测"""
    user_id = user.get('user_id')
    async with db.conn.acquire() as con:
        select_stmt = await con.prepare(
            '''select id::varchar, name, ad_monitor_msg_switch as switch, ad_monitor_msg as msg from "group" 
               where user_id = $1 and status <> 3''')
        group_ad_monitor_msg = records_to_list(await select_stmt.fetch(user_id))
    if not group_ad_monitor_msg:
        return response_json(group_ad_monitor_msg, code=RESOURCE_NOT_FOUND_CODE)
    is_new_user = False
    if not await redis.conn.sismember(CACHE_GROUP_AD_OLD_USER, user_id):
        is_new_user = True
        await redis.conn.sadd(CACHE_GROUP_AD_OLD_USER, user_id)
    return response_json({"is_new_user": is_new_user, "groups_ad": group_ad_monitor_msg})


@protected()
@inject_user()
async def get_feedback_view(request, user):
    """建议反馈"""
    return response_json(settings['CUSTOMER_WECHAT'])


# ========= 前端静态路径 ======== #

async def static_group_qrcode_view(request):
    file_path = os.path.join(BASIC_PATH, 'static/gdogH5/qrcodeGroup.html')
    return await file(file_path)


async def static_robot_qrcode_view(request):
    file_path = os.path.join(BASIC_PATH, 'static/gdogH5/qrcodeDog.html')
    return await file(file_path)


async def static_error_page_one_view(request):
    file_path = os.path.join(BASIC_PATH, 'static/gdogH5/error1.html')
    return await file(file_path)


async def static_error_page_two_view(request):
    file_path = os.path.join(BASIC_PATH, 'static/gdogH5/error2.html')
    return await file(file_path)


async def static_images_show_view(request, path):
    '''路由本地静态图片'''
    async def streaming_fn(response):
        await response.write(image_bytes.getvalue())

    async def get_local_image(image_name):
        static_image = os.path.join(BASIC_PATH, 'static/images/{}').format(image_name)
        if not os.path.isfile(static_image):
            raise FileNotFound('File not found', path=static_image, relative_url=None)
        image = Image.open(static_image)
        image = image.convert('RGBA')
        return image

    async def write_image_to_bytes(image):
        output_buffer = BytesIO()
        bg_image = image.convert('RGB')
        bg_image.save(output_buffer, format='JPEG')
        return output_buffer

    local_image = await get_local_image(path)
    image_bytes = await write_image_to_bytes(local_image)
    return stream(streaming_fn, content_type='image/jpeg')


# ========= 前端临时静态路径 ======== #
async def static_route(request, str):
    file_path = os.path.join(BASIC_PATH, 'static/demo/build/index.html')
    try:
        return await file(file_path)
    except Exception:
        raise FileNotFound('File not found', path=file_path, relative_url=None)


async def temp_static_images_show_view(request, path):
    '''路由本地静态图片'''
    async def streaming_fn(response):
        await response.write(image_bytes.getvalue())

    async def get_local_image(image_name):
        static_image = os.path.join(BASIC_PATH, 'static/temp_image/{}').format(image_name)
        if not os.path.isfile(static_image):
            raise FileNotFound('File not found', path=static_image, relative_url=None)
        image = Image.open(static_image)
        image = image.convert('RGBA')
        return image

    async def write_image_to_bytes(image):
        output_buffer = BytesIO()
        bg_image = image.convert('RGB')
        bg_image.save(output_buffer, format='JPEG')
        return output_buffer

    local_image = await get_local_image(path)
    image_bytes = await write_image_to_bytes(local_image)
    return stream(streaming_fn, content_type='image/jpeg')
