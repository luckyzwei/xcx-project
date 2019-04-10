import ujson
import uuid
import math

from app import db, redis
from aio_pika import IncomingMessage
from sanic.log import logger
import aiohttp

from app.constants import *
from app.utils import send_text_msg
from app.route_requests import activate_group, cancel_group, sync_group_members


PRIVATE_MSG_COMMAND = 'private_message'                     # 私聊消息回调
ROBOT_ADD_FRIEND_COMMAND = 'robot_added'                    # 机器人加（被加）好友回调
ROBOT_KICKED_COMMAND = 'robot_kicked'                       # 机器人被踢回调
ROBOT_JOIN_GROUP_COMMAND = 'wait_for_bind'                  # 待开通群回调（原机器人入群回调
OPEN_GROUP_SUCCESS_COMMAND = 'bind_group_success'           # 机器人开通群成功回调
ROBOT_BLOCKED_COMMAND = 'abnormal_robot'                    # 机器人封号回调
ROBOT_REPLACE_SUCCESS_COMMAND = 'abnormal_robot_replaced'   # 机器人替换成功回调
ROBOT_JOIN_FAILED_COMMAND = 'robot_join_failed'             # 机器人入群失败回调
USER_JOIN_GROUP_COMMAND = 'join_group'                      # 群用户入群回调
UNBIND_GROUP_SUCCESS_COMMAND = 'unbind_group_success'       # 机器人解绑群成功回调
GROUP_MEMBERS_COMMAND = 'group_members'                     # 群成员信息回调


ADD_FRIEND_WORD = '将我拉入你的微信群中，我会按照你的要求，在群里投放内容。投放收益我将和你进行分成。'
COMPLETE_LINK = '{host}/demo/home?userId={user_id}'
OPEN_GROUP_SUCCESS_WORD = '【{group_name}】入群成功！\n点击以下链接，选择投放设置，即可设置群内投放内容啦\n{home_url}'


async def temp_ad_on_message_commom(message: IncomingMessage):
    with message.process():
        data = ujson.loads(message.body.decode('utf-8'))
        logger.info(f'Receiver #: {data}')
        command = data.get('command')
        body = data.get('body')
        if command == ROBOT_ADD_FRIEND_COMMAND:
            logger.info(f'Receiver #: {message.body.decode("utf-8")}')
            await robot_add_friend_callback(body)
        if command == ROBOT_JOIN_GROUP_COMMAND:
            logger.info(f'Receiver #: {message.body.decode("utf-8")}')
            await robot_join_group_callback(body)
        if command == OPEN_GROUP_SUCCESS_COMMAND:
            logger.info(f'Receiver #: {message.body.decode("utf-8")}')
            await bind_group_success_callback(body)
        if command == ROBOT_JOIN_FAILED_COMMAND:
            await join_group_failed_callback(body)
        if command == ROBOT_KICKED_COMMAND:
            await robot_kicked_callback(body)
        if command == ROBOT_BLOCKED_COMMAND:
            await robot_blocked(body)
        if command == UNBIND_GROUP_SUCCESS_COMMAND:
            await unbind_group_callback(body)


async def is_key_exists(key):
    """缓存是否存在指定的key"""
    return await redis.conn.exists(key)


async def long_to_short(long_url):
    param = {'url': long_url}
    url = 'https://gpetprd.gemii.cc/long_to_short'
    async with aiohttp.ClientSession() as session:
        resp = await session.post(url, json=param)
    resp_json = await resp.json()
    code = resp_json.get('code')
    if code != 1200:
        return long_url
    else:
        return resp_json.get('data')


async def robot_add_friend_callback(data):
    """
    机器人加好友
    1. 判断用户是否存在
    2. 创建用户
    3. 发送首页链接
    """
    async def user_exists(user_code):
        async with db.conn.acquire() as con:
            get_user_stmt = await con.prepare('''select id from "temp_user" where code = $1 ''')
            return await get_user_stmt.fetchval(user_code)

    async def save_user(user_code, head_url, nickname):
        async with db.conn.acquire() as con:
            save_user_stmt = await con.prepare('''insert into "temp_user" values (uuid_generate_v4(), $1, null, $2, $3, null, 1) returning id::varchar''')
            return await save_user_stmt.fetchval(user_code, head_url, nickname)

    async def save_robot_friend(user_id, robot_id):
        async with db.conn.acquire() as con:
            insert_robot_friend_stmt = await con.prepare('''insert into "temp_robot_add_friend" (id, robot_id, user_id, status) values (uuid_generate_v4(), $1, $2, 1)''')
            await insert_robot_friend_stmt.fetch(robot_id, user_id)

    async def get_robot_id(robot_code):
        async with db.conn.acquire() as con:
            get_robot_stmt = await con.prepare('''select id from "temp_robot" where code = $1 and status <> 3''')
            return await get_robot_stmt.fetchval(robot_code)

    robot_code = data.get('robot_id')
    user_code = data.get('user_id')
    nickname = data.get('nickname')
    head_url = data.get('avatar')
    robot_id = await get_robot_id(robot_code)
    user_id = await user_exists(user_code)
    if not user_id:
        user_id = await save_user(user_code, head_url, nickname)
    await save_robot_friend(user_id, robot_id)
    content = ADD_FRIEND_WORD
    await send_text_msg(robot_code, user_code, content)


async def get_robot_by_code(code):
    """通过机器人code查询机器人信息"""
    async with db.conn.acquire() as con:
        st = await con.prepare(
            'select * from "temp_robot" where code = $1 and status <> 3')
        return await st.fetchrow(code)


async def get_user_by_code(user_code):
    """获取用户信息"""
    async with db.conn.acquire() as con:
        select_stmt = await con.prepare(
            '''select * from "temp_user" where code = $1 and status <> 3''''')
        return await select_stmt.fetchrow(user_code)


async def robot_join_group_callback(data):
    """
    待开通群回调
    :param data:
    :return:

    data:{
        "robot_id": "20181111222222",
        "group_id": "20181111222222",
        "user_id": "20181111222222",
        "name": "群名称"
    }
    """
    async def request_bind_group(group_code, robot_code):
        activate_result = await activate_group({"group_id": group_code, "robot_id": robot_code})
        logger.info(f'request to activate group:group_code:{group_code}, robot_code:{robot_code}'
                    f'and result is:{activate_result}')
        if activate_result and int(activate_result['code']) != 100:
            logger.error(f'request to activate group:{group_code} failed')

    robot_code = data.get('robot_id')
    group_code = data.get('group_id')
    user_code = data.get('user_id')
    group_name = data.get('name')

    user_info = await get_user_by_code(user_code)
    if user_info is None:
        logger.info(f'user:{user_code} is not exist')
        return
    user_id = str(user_info['id'])
    lock_value = await acquire_lock_group(group_code, release_time=30)
    logger.info(f'set lock to group:{group_code} and set group lock result:{lock_value}')
    if not lock_value:
        return

    if await check_group_activated(group_code, robot_code, user_code, group_name):
        return
    await request_bind_group(group_code, robot_code)


async def acquire_lock_group(lock_name, release_time=30):
    """
    获取锁
    :param lock_name: 锁名称
    :param release_time: 尝试获取锁时间
    :return: 获取锁失败返回False
    """
    identifier = str(uuid.uuid4())
    lock_name = 'lock:' + lock_name
    lock_timeout = int(math.ceil(release_time))
    if await redis.conn.set(lock_name, identifier, nx=True, ex=lock_timeout):
        return True
    return False


async def check_group_activated(group_code, robot_code, user_code, group_name):
    """根据群code查询该群是否被激活"""
    async with db.conn.acquire() as con:
        select_stmt = await con.prepare('''
            select "temp_group".code, "temp_group".user_id::varchar, "temp_group".id::varchar, "temp_robot".code as robot_code, "temp_group".name 
            from "temp_group" join "temp_robot_group_map"  on "temp_group".id = "temp_robot_group_map".group_id join "temp_robot" on 
            "temp_robot".id = "temp_robot_group_map".robot_id where "temp_group".code = $1 and "temp_group".status <> 3 
            and "temp_robot_group_map".status <>3 and "temp_robot".status<>3''')
        val = await select_stmt.fetchrow(group_code)
    if val is not None:
        await send_text_msg(robot_code, user_code, GROUP_HAVEN_BEEN_BIND.format(group_name=group_name))
        return True
    return False


async def checkout_user_has_group(user_id):
    """判断用户是否导过群"""
    async with db.conn.acquire() as con:
        get_user_stmt = await con.prepare('''select count(1) from  "group" where user_id = $1 and status <> 3''')
        count = await get_user_stmt.fetchval(user_id)
    if count >= 1:
        return True
    return False


async def bind_group_success_callback(data):
    """
    开通群成功回调
    :param data:{
        "robot_id": "20181111222222",
        "group_id": "20181111222222",
        "user_id": "20181111222222",
        "name": "群名称",
        "bind_time": "1970-01-01 00:00:00.000"
    }
    """
    async def add_group_record(group_code, group_name, user_id, robot_id, user_code):
        async with db.conn.acquire() as con:
            async with con.transaction():
                it = await con.prepare('''insert into "temp_group" (id, code, user_id, user_code, name,
                 status) values (uuid_generate_v4(), $1, $2, $3, $4, 1) returning id::varchar''')
                group_id = await it.fetchval(group_code, user_id, user_code, group_name)

                insert_map_stmt = await con.prepare('''
                insert into "temp_robot_group_map" (id, robot_id, group_id, status) values (uuid_generate_v4(), $1, $2, 1) 
                ''')
                await insert_map_stmt.fetch(robot_id, group_id)

    group_code = data.get('group_id')
    robot_code = data.get('robot_id')
    user_code = data.get('user_id')
    group_name = data.get('name', '未命名')

    user_info = await get_user_by_code(user_code)
    if user_info is None:
        await cancel_group({"group_id": group_code, "robot_id": robot_code})
        logger.debug(f'user:{user_code} is not exist')
        return
    user_id = str(user_info['id'])
    robot_info = await get_robot_by_code(robot_code)
    robot_id = str(robot_info['id'])

    bing_group_key = 'bind_group:' + group_code
    if not await acquire_lock_group(bing_group_key, release_time=30):
        return
    if await check_group_activated(group_code, robot_code, user_code, group_name):
        return
    await add_group_record(group_code, group_name, user_id, robot_id, user_code)
    await sync_group_members({"group_id": group_code})
    home_url = await long_to_short(COMPLETE_LINK.format(host=settings['EXTERNAL_HOST'], user_id=user_id))
    content = OPEN_GROUP_SUCCESS_WORD.format(group_name=group_name, home_url=home_url)
    await send_text_msg(robot_code, user_code, content)


async def robot_kicked_callback(data):
    """
    机器人被踢回调
    :param data: {
        "robot_id": "20181111222222",
        "group_id": "20181111222222",
        "user_id": "20181111222222",
        "kick_time": "1970-01-01T00:00:00"
    }
    """
    robot_code = data.get('robot_id')
    group_code = data.get('group_id')
    logger.info(f'robot kicked, robot_code:{robot_code}, group_code:{group_code}')

    async with db.conn.acquire() as con:
        get_group_stmt = await con.prepare('''
        select "temp_group".code as group_code, "temp_group".name as group_name, "temp_user".code as user_code, 
        "temp_robot".code as robot_code from "temp_group" join "temp_user" on "temp_group".user_id = "temp_user".id join
        "temp_robot_group_map" on "temp_robot_group_map".group_id = "temp_group".id join "temp_robot" on 
        "temp_robot".id = "temp_robot_group_map".robot_id where "temp_group".code = $1 and "temp_group".status <> 3 
        limit 1''')
        group = await get_group_stmt.fetchrow(group_code)

    if group is not None and robot_code == group['robot_code']:
        content = '{group_name}把我赶出了家门，主人请把小助手重新拉进群哦。'.format(group_name=group['group_name'])
        await send_text_msg(robot_code, group['user_code'], content)
        params = {'robot_id': group['robot_code'],
                  'group_id': group['group_code'],
                  'reason': str(GroupCancelReason.ROBOT_KICKED)}
        response = await cancel_group(params)
        logger.info(f'currency_delete_group,params:{params} response:{response}')


async def join_group_failed_callback(data):
    """
    机器人去群失败回调
    :param data:

    """
    logger.info(f'robot join group failed with params:{data}')


async def robot_blocked(data):
    """
    机器人被封回调
    :param data:{
        "robot_id": "20181111222222",
        "wxid": "tanxi1983",
        "bind_group_count": "10",
        "nickname": "用户",
        "avatar": "http://xxx.xxx.xx/xx.png",
        "reason": "伺候太多人",
        "abnormal_time": "1970-01-01 00:00:00.000"
    }
    """
    logger.info(f'robot blocked with params:{data}')


async def unbind_group_callback(data):
    """
    解绑群成功回调
    :param data:{
        "robot_id": "20181111222222",
        "group_id": "20181111222222",
        "reason": "",
        "unbind_time": "1970-01-01 00:00:00.000"
    }
    """
    group_code = data.get('group_id')
    cancel_reason = int(data.get('reason'))
    async with db.conn.acquire() as con:
        async with con.transaction():
            get_group_stmt = await con.prepare('''select id from "temp_group" where code = $1 and status <> 3''')
            group_id = await get_group_stmt.fetchval(group_code)
            if group_id is None:
                return
            update_group = await con.prepare('''update "temp_group" set status = 3, cancel_reason = $1, update_date = now() 
                where code = $2 and status <> 3''')
            await update_group.fetchrow(cancel_reason, group_code)
            update_robot_map = await con.prepare('''update temp_robot_group_map set status = 3, update_date = now() 
                    where group_id = $1''')
            await update_robot_map.fetchrow(group_id)


async def member_info_callback(data):
    """群成员信息回调"""
    group_members = data
    mem_count = len(group_members)
    for member in group_members:
        if member['is_admin']:
            async with db.conn.acquire() as con:
                update_group = await con.prepare('''
                update "temp_group" set owner_user_code = $1, mem_count = $2 where code = $3 and status <>3''')
                await update_group.fetchrow(member['user_id'], mem_count, member['group_id'])
            break

