import ujson
import uuid
import math

from app import db, redis
from aio_pika import IncomingMessage
from sanic.log import logger

from config import settings
from app.constants import CACHE_ROBOT_LASTED_OPERATE, CACHE_BIND_USER_ROBOT_GROUP_MAP, CACHE_GROUP_WELCOME_MSG_RECORD, \
    CACHE_TEMP_ROBOT_AMOUNT_USED, CACHE_TEMP_USER_ROBOT_DISTRIBUTE, PULL_GROUP_TEXT, GROUP_COUNT_EXCEED_LIMIT, \
    GROUP_HAVEN_BEEN_BIND, BIND_GROUP_SUCCESS, ROBOT_KICKED, TYPE, GroupCancelReason, MINI_PROGRAM_CONTENT, \
    DEFAULT_WELCOME_MSG, DEFAULT_AD_MONITOR_MSG
from app.utils import send_text_msg, send_mini_program_msg, until_tomorrow_expire_time, data_md5, send_image_msg
from app.route_requests import robot_invite_user, activate_group, cancel_group, sync_group_members


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
GROUP_INFO_COMMAND = 'group_info'                           # 群信息更新回调


async def on_message_common(message: IncomingMessage):
    with message.process():
        json_data = message.body.decode('utf-8')
        data = ujson.loads(json_data)
        logger.info(f'Receiver #: {json_data}')
        command = data.get('command')
        body = data.get('body')
        if command == ROBOT_ADD_FRIEND_COMMAND:
            await robot_add_friend_callback(body)
        if command == ROBOT_JOIN_GROUP_COMMAND:
            await robot_join_group_callback(body)
        if command == OPEN_GROUP_SUCCESS_COMMAND:
            await bind_group_success_callback(body)
        if command == ROBOT_JOIN_FAILED_COMMAND:
            await join_group_failed_callback(body)
        if command == ROBOT_KICKED_COMMAND:
            await robot_kicked_callback(body)
        if command == ROBOT_BLOCKED_COMMAND:
            await robot_blocked(body)
        if command == USER_JOIN_GROUP_COMMAND:
            await user_join_group_callback(body)
        if command == UNBIND_GROUP_SUCCESS_COMMAND:
            await unbind_group_callback(body)
        if command == GROUP_INFO_COMMAND:
            await  group_info_callback(body)


async def on_ad_message(message: IncomingMessage):
    with message.process():
        data = ujson.loads(message.body.decode('utf-8'))
        command = data.get('command')
        body = data.get('body')
        logger.debug(f'Receiver #: {data}')
        if command == 'message_class_result':
            await ad_message_monitor_send(body)


async def ad_message_monitor_send(data):
    async with db.conn.acquire() as con:
        st = await con.prepare('''
            select "group".code, "group".user_id::varchar, "group".id::varchar,robot.code as robot_code, "group".name, 
            "group".ad_monitor_msg, "group".ad_monitor_msg_switch
            from "group" join robot_group_map  on "group".id = robot_group_map.group_id join "robot" on 
            robot.id = robot_group_map.robot_id where "group".code=$1 and "group".status<>3 
            and "robot_group_map".status <> 3 and "robot".status<>3''')
        group = await st.fetchrow(data['group_code'])
    if not group:
        logger.error(f'not found group: {data["group_code"]}')
    elif group and group['ad_monitor_msg_switch'] == 1:     # 1表示开关打开
        await send_text_msg(robot_code=group['robot_code'], member_code=data['user_code'],
                            content=group['ad_monitor_msg'], group_code=data['group_code'])
    else:
        logger.info(f'group: {data["group_code"]} switch: {group["ad_monitor_msg_switch"]}!!')


async def is_key_exists(key):
    """缓存是否存在指定的key"""
    return await redis.conn.exists(key)


async def robot_add_friend_callback(data):
    """
    1. 获取机器人最后一次操作记录  0. 拉群 1. 入群
    2.  根据最后一次操作类型做相应处理
    参数示例：
    {
        "robot_id": "20181111222222",
        "user_id": "20181111222222",
        "nickname": "用户",
        "avatar": "http://xxx/xxx.png",
        "add_time": "1970-01-01T00:00:00"
    }
    """
    async def bind_user_code(user, code):
        async with db.conn.acquire() as con:
            update_st = await con.prepare('update "user" set code = $1 where id = $2 ')
            await update_st.fetchrow(code, user)

    async def save_robot_add_friend(robot_id, user_id):
        async with db.conn.acquire() as con:
            insert_robot_friend_stmt = await con.prepare(
                'insert into "robot_add_friend" (id, robot_id, user_id, status) values (uuid_generate_v4(), $1, $2, 1)')
            await insert_robot_friend_stmt.fetch(robot_id, user_id)

    robot_code = data.get('robot_id')
    user_code = data.get('user_id')
    nickname = data.get('nickname')
    nickname_md5 = data_md5(nickname)

    robot_info = await get_robot_by_code(robot_code)
    if robot_info is None:
        return
    robot_id = str(robot_info['id'])

    last_operate_key = CACHE_ROBOT_LASTED_OPERATE.format(robot_code=robot_code, nickname_md5=nickname_md5)
    user_operation_record = await redis.conn.get(last_operate_key)
    if user_operation_record is None:
        logger.warning(f'robot: {robot_code} add friend but user: {nickname}, nickname_md5: {nickname_md5} is not found')
        return
    user_operation_record = ujson.loads(user_operation_record)
    user_id = user_operation_record['user_id']
    operation_type = int(user_operation_record['type'])
    await bind_user_code(user_id, user_code)
    await save_robot_add_friend(robot_id, user_id)
    logger.info(f'user: {user_code}, robot: {robot_code} last operation is :{operation_type}')

    if operation_type == TYPE.ROBOT_ENTER_GROUP:
        await send_text_msg(robot_code, user_code, PULL_GROUP_TEXT)
        guide_picture = settings['EXTERNAL_HOST'] + '/static/image/guide.png'
        await send_image_msg(robot_code, user_code, guide_picture)
        await robot_distribute_and_update_count(robot_id, user_id, user_code)
        async with await redis.conn.pipeline() as pipe:
            await pipe.decr(CACHE_TEMP_ROBOT_AMOUNT_USED.format(robot_id=robot_id), 1)
            await pipe.expire(CACHE_TEMP_ROBOT_AMOUNT_USED.format(robot_id=robot_id), until_tomorrow_expire_time())
            await pipe.delete(CACHE_TEMP_USER_ROBOT_DISTRIBUTE.format(user_id=user_id))
            await pipe.execute()

    elif operation_type == TYPE.PULL_USER_GROUP:
        redis_key = CACHE_BIND_USER_ROBOT_GROUP_MAP.format(user_id=user_id, robot_code=robot_code)
        group_code = await redis.conn.get(redis_key)
        if group_code is not None:
            invite_data = {"group_id": group_code, "robot_id": robot_code, "user_id": user_code}
            resp = await robot_invite_user(invite_data)
            logger.info(f'robot invite user join group data:{invite_data} and response:{resp}')
    await redis.conn.delete(last_operate_key)


async def get_user_by_code(user_code):
    """获取用户信息"""
    async with db.conn.acquire() as con:
        select_stmt = await con.prepare('select * from "user" where code = $1 and status <> 3')
        return await select_stmt.fetchrow(user_code)


async def get_robot_by_code(code):
    """通过机器人code查询机器人信息"""
    async with db.conn.acquire() as con:
        st = await con.prepare('select * from "robot" where code = $1 and status <> 3')
        return await st.fetchrow(code)


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

    async def user_distribute_robot(user_code):
        async with db.conn.acquire() as con:
            select_stmt = await con.prepare(
                'select robot_id from robot_distribute where user_code = $1 and status <> 3')
            return await select_stmt.fetchval(user_code)

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

    robot_info = await get_robot_by_code(robot_code)
    distribute_robot_id = await user_distribute_robot(user_code)
    if robot_info is None or robot_info['id'] != distribute_robot_id:
        logger.info(f'bind group failed! robot:{robot_code} not exit or not distribute robot:{distribute_robot_id}')
        return
    if await checkout_user_has_group(user_id):
        await send_text_msg(robot_code, user_code, GROUP_COUNT_EXCEED_LIMIT)
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
            select "group".code, "group".user_id::varchar, "group".id::varchar, robot.code as robot_code, "group".name 
            from "group" join robot_group_map on "group".id = robot_group_map.group_id join "robot" on 
            robot.id = robot_group_map.robot_id where "group".code = $1 and "group".status <> 3 
            and "robot_group_map".status <> 3 and "robot".status <> 3''')
        val = await select_stmt.fetchrow(group_code)
    if val is not None:
        await send_text_msg(robot_code, user_code, GROUP_HAVEN_BEEN_BIND.format(group_name=group_name))
        return True
    return False


async def checkout_user_has_group(user_id):
    """判断用户是否导过群"""
    async with db.conn.acquire() as con:
        get_user_stmt = await con.prepare('''select count(1) from "group" where user_id = $1 and status <> 3''')
        count = await get_user_stmt.fetchval(user_id)
    if count >= 1:
        return True
    return False


async def robot_distribute_and_update_count(robot_id, user_id, user_code):
    async with db.conn.acquire() as con:
        async with con.transaction():
            insert_robot_friend_stmt = await con.prepare('''
                insert into "robot_distribute" (id, robot_id, user_id, user_code, distribute_count, used_count, status) 
                values (uuid_generate_v4(), $1, $2, $3, $4, 0, 1 )''')
            await insert_robot_friend_stmt.fetch(robot_id, user_id, user_code, settings['ROBOT_DISTRIBUTE_COUNT'])

            update_stmt = await con.prepare('''
                update "robot" set count_distribute = count_distribute + 1, update_date = now() where id = $1 ''')
            await update_stmt.fetch(robot_id)


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
    async def add_group_record(group_code, group_name, user_id, robot_id):
        async with db.conn.acquire() as con:
            async with con.transaction():
                it = await con.prepare('''
                    insert into "group" (id, code, user_id, name, welcome_msg, ad_monitor_msg, status) 
                    values (uuid_generate_v4(), $1, $2, $3, $4, $5, 1) returning id::varchar''')
                group_id = await it.fetchval(group_code, user_id, group_name, DEFAULT_WELCOME_MSG,
                                             DEFAULT_AD_MONITOR_MSG)
                insert_map_stmt = await con.prepare('''
                    insert into "robot_group_map" (id, robot_id, group_id, status) values (uuid_generate_v4(), $1, $2, 1)''')
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
    if await checkout_user_has_group(user_id):
        await cancel_group({"group_id": group_code, "robot_id": robot_code})
        logger.info(f'bind group failed ,user:{user_code} has more than one group')
        return
    if await check_group_activated(group_code, robot_code, user_code, group_name):
        return
    await add_group_record(group_code, group_name, user_id, robot_id)
    await sync_group_members({"group_id": group_code})
    await send_text_msg(robot_code, user_code, BIND_GROUP_SUCCESS)
    mini_program_cover = settings['EXTERNAL_HOST'] + '/static/image/mini_program_cover.png'
    params = {"robot_code": robot_code, "member_code": user_code, "content": MINI_PROGRAM_CONTENT,
              "title": '领取群永久二维码，设置入群欢迎语', "href": mini_program_cover, "desc": ""}
    await send_mini_program_msg(**params)


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
            select "group".code as group_code, "group".name as group_name, "user".code as user_code, "robot".code as 
            robot_code from "group" join "user" on "group".user_id = "user".id join "robot_group_map" on 
            "robot_group_map".group_id = "group".id join "robot" on "robot".id = "robot_group_map".robot_id where
            "group".code = $1 and "group".status <> 3 limit 1''')
        group = await get_group_stmt.fetchrow(group_code)

    if group is not None and robot_code == group['robot_code']:
        content = ROBOT_KICKED.format(group_name=group['group_name'])
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


async def user_join_group_callback(data):
    """
    群成员入群回调
    只是添加机器人拉入的
    :param data: {
        "group_id": "20181111222222",
        "user_id": "20181111222222",
        "invite_user_id": "20181111222222",
        "nickname": "群成员",
        "avatar": "http://xxx/xxx.png",
        "user_wxid": "wxid_xxxxxxxx",
        "join_type": 0,
        "join_time": "1970-01-01 00:00:00.000"
    }
    """
    async def get_group_info(group_code):
        async with db.conn.acquire() as con:
            select_stmt = await con.prepare('''
                select "group".id::varchar as group_id, "group".user_id, "group".welcome_msg, "group".welcome_msg_switch, 
                robot.code as robot_code, robot.id as robot_id from "group" join robot_group_map map
                on "group".id = map.group_id join "robot" on map.robot_id = "robot".id 
                where "group".code = $1 and "group".status <> 3 ''')
            group = await select_stmt.fetchrow(group_code)
        return group

    async def save_user_join_group(invite_user_id, user_id, group_id, robot_id):
        async with db.conn.acquire() as con:
            insert_stmt = await con.prepare('''
                insert into "user_into_group" (id, invite_user_id, user_id, group_id, robot_id, status) 
                values (uuid_generate_v4(), $1, $2, $3, $4, 1)''')
            await insert_stmt.fetchrow(invite_user_id, user_id, group_id, robot_id)

    group_code = data.get('group_id')
    user_code = data.get('user_id')
    invite_user_code = data.get('invite_user_id')

    group_info = await get_group_info(group_code)
    if group_info is None:
        logger.info(f'group:{group_code} is not exit')
        return
    if group_info['welcome_msg'] is not None and group_info['welcome_msg_switch'] == 1:
        welcome_key = CACHE_GROUP_WELCOME_MSG_RECORD.format(group_id=group_info['group_id'])
        if not await redis.conn.exists(welcome_key):
            await send_text_msg(group_info['robot_code'], [data['user_id']], group_info['welcome_msg'], group_code)
            await redis.conn.setex(welcome_key, 300, str(uuid.uuid4()))

    user_info = await get_user_by_code(user_code)
    if user_info and group_info['robot_code'] == invite_user_code:
        await save_user_join_group(group_info['user_id'], user_info['id'], group_info['group_id'], group_info['robot_id'])
        await redis.conn.delete(CACHE_BIND_USER_ROBOT_GROUP_MAP.format(robot_code=group_info['robot_code'],
                                                                       user_id=user_info['id']))


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
            get_group_stmt = await con.prepare('select id from "group" where code = $1 and status <> 3')
            group_id = await get_group_stmt.fetchval(group_code)
            if group_id is None:
                return
            update_group = await con.prepare('''
                update "group" set status = 3, cancel_reason = $1, update_date = now() where code = $2 and status <> 3''')
            await update_group.fetchrow(cancel_reason, group_code)
            update_robot_map = await con.prepare('''
                update robot_group_map set status = 3, update_date = now() where group_id = $1''')
            await update_robot_map.fetchrow(group_id)


async def group_info_callback(data):
    """群信息更新回调"""
    async with db.conn.acquire() as con:
        update_st = await con.prepare('''
            update "group" set name = $1, mem_count = $2, owner_user_code = $3 where code = $4 and status <> 3''')
        await update_st.fetchrow(data['name'], data['mem_count'], data['admin_user_id'], data['id'])

