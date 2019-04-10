# -*- coding=utf-8 -*-
import itertools
import random
import ujson
from io import BytesIO
from itertools import groupby
from operator import itemgetter
import uuid

from PIL import Image
from sanic.exceptions import FileNotFound
from sanic.log import logger
import aiohttp

from app import db, redis
from app.constants import *
from app.route_requests import do_get
from app.utils import response_json, records_to_value_list, records_to_list
from sanic.response import file, stream


# @bp_dog.route('temp/wechat/h5/user_info')
async def temp_wechat_h5_user_info_view(request):
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
        return response_json(user_info)
    except Exception as e:
        logger.error(f'h5 get user info error:{e}')
        return response_json(None, WECHAT_AUTH_ERROR)


async def distrubute_robot_view(request):
    """
    随机分配机器人
    """
    async def get_robot_access(union_id):
        async with db.conn.acquire() as con:
            get_robots_stmt = await con.prepare('''select robot_id from "temp_robot_access" where union_id = $1 ''')
            return await get_robots_stmt.fetchval(union_id)

    async def random_distribute_robot():
        async with db.conn.acquire() as con:
            select_stmt = await con.prepare('select id from "temp_robot" where status <> 3')
            robot_ids = records_to_value_list(await select_stmt.fetch(), 'id')
            return robot_ids[random.randint(0, len(robot_ids)-1)]

    async def get_robot(robot_id):
        async with db.conn.acquire() as con:
            select_stmt = await con.prepare('select head_url, qr_code, wechat_no, name from "temp_robot" where id = $1')
            robot = await select_stmt.fetchrow(robot_id)
        return robot

    async def save_robot_access(union_id, robot_id):
        async with db.conn.acquire() as con:
            insert_robot_stmt = await con.prepare('''insert into "temp_robot_access" values (uuid_generate_v4(), $1, $2, 1)''')
            await insert_robot_stmt.fetch(union_id, robot_id)

    union_id = request.args.get('union_id')
    robot_id = await get_robot_access(union_id)
    if robot_id:
        robot = await get_robot(robot_id)
        return response_json(dict(robot))
    else:
        distribute_robot_id = await random_distribute_robot()
        await save_robot_access(union_id, distribute_robot_id)
        robot = await get_robot(distribute_robot_id)
        return response_json(dict(robot))


# @bp_dog.route('temp/users/<union_id:[a-zA-Z0-9\\_-]+>/registered')
async def isregister_view(request, union_id):
    async with db.conn.acquire() as con:
        get_user_stmt = await con.prepare(
            '''select id from "temp_user" where status <> 3 and union_id = $1 limit 1 ''')
        record = await get_user_stmt.fetchval(union_id)
    if record is not None:
        return response_json(True)
    else:
        return response_json(False)


# @bp_dog.route('temp/user/complete')
async def complete_user_view(request):
    async def get_user_by_user_id(user_id):
        async with db.conn.acquire() as con:
            get_user_stmt = await con.prepare('''select union_id from "temp_user" where status <> 3 and id = $1 limit 1 ''')
            return await get_user_stmt.fetchval(user_id)

    async def update_user(union_id, head_url, nickname, user_id):
        async with db.conn.acquire() as con:
            update_user_stmt = await con.prepare('''update "temp_user" set union_id = $1, head_url = $2, nickname = $3, update_date = now() where id = $4''')
            await update_user_stmt.fetch(union_id, head_url, nickname, user_id)

    user_id = request.json.get('user_id')
    union_id = request.json.get('union_id')
    head_url = request.json.get('head_url')
    nick_name = request.json.get('nick_name')
    old_union_id = await get_user_by_user_id(user_id)
    if old_union_id:
        return response_json(None)
    else:
        await update_user(union_id, head_url, nick_name, user_id)
        return response_json(None)


# @bp_dog.route('temp/user/<union_id:[a-zA-Z0-9\\_-]+>/groups')
async def user_groups_view(request, union_id):
    """
    获取用户群列表
    """
    user_id = await get_user_by_unoin_id(union_id)
    async with db.conn.acquire() as con:
        get_group_stmt = await con.prepare('''select id, code, name from "temp_group" where user_id = $1 and status <> 3''')
        data = records_to_list(await get_group_stmt.fetch(user_id))
    return response_json(data)


# @bp_dog.route('temp/group/robot_name', methods=['POST'])
async def modify_group_robot_nickname_view(request):
    """
    修改用户群内昵称
    """
    async def update_robot_nickname(group_code, robot_code, remark_name):
        data = {'group_id': group_code,
                'robot_id': robot_code,
                'nickname': remark_name}
        url = 'https://gbotdev.gemii.cc/gbot/modify_group_robot_nickname'
        async with aiohttp.ClientSession() as session:
            return await session.post(url, json=data)

    group_code = request.json.get('group_code')
    remark_name = request.json.get('remark_name')
    async with db.conn.acquire() as con:
        select_stmt = await con.prepare('''select "temp_group".id, "temp_group".code, "temp_robot".code as robot_code 
        from "temp_group" left join "temp_robot_group_map" 
        on "temp_group".id = "temp_robot_group_map".group_id left join "temp_robot" on "temp_robot".id = 
        "temp_robot_group_map".robot_id 
        where "temp_group".code=$1 and "temp_group".status<>3 and "temp_robot_group_map".status<>3 
        and "temp_robot".status<>3 ''')
        group_info = await select_stmt.fetchrow(group_code)
    resp = await update_robot_nickname(group_code, group_info['robot_code'], remark_name)
    resp_json = await resp.json()
    print(resp_json)
    if int(resp_json['code']) == 100:
        async with db.conn.acquire() as con:
            update_stmt = await con.prepare('''
                    update "temp_robot_group_map" set nickname = $1, update_date = now() where group_id = $2''')
            await update_stmt.fetch(remark_name, group_info['id'])
        return response_json(None, code=SERVICE_SUCCESS_CODE, msg='修改成功')
    else:
        return response_json(None, code=UNAUTHENTICATE_EXPIRED_CODE, msg='修改失败')


async def get_labels_view(request):
    """
    获取标签
    """
    async with db.conn.acquire() as con:
        get_ad_label_stmt = await con.prepare('''select id as lable_id, name from "temp_ad_label" order by id asc''')
        resp_data = records_to_list(await get_ad_label_stmt.fetch())
    return response_json(resp_data)


async def get_ads_view(request):
    """
    获取广告内容
    """
    async def get_ads_by_label_ids(label_ids):
        async with db.conn.acquire() as con:
            get_ad_stmt = await con.prepare('''select "temp_ad".id::varchar, title, description, image_url, landing_url, label_id, "temp_ad_label".name as label_name
                from "temp_ad" join "temp_ad_label" on "temp_ad".label_id = "temp_ad_label".id where label_id = any($1) 
                order by label_id asc''')
            return records_to_list(await get_ad_stmt.fetch(label_ids))

    group_name = request.json.get('group_name')
    label_ids = request.json.get('label_ids')
    dates = request.json.get('date')
    data_count = len(dates)
    region = request.json.get('region')
    ad_data = await get_ads_by_label_ids(label_ids)
    logger.info(f'get ad count:{len(ad_data)}')
    label_id_ad_dict = list()
    for label_id, items in groupby(ad_data, key=itemgetter('label_id')):
        list_items = list(items)
        random.shuffle(list_items)
        label_id_ad_dict.append(list_items)

    random.shuffle(label_id_ad_dict)
    zip_datas = itertools.zip_longest(*label_id_ad_dict)
    ads_data = []
    choice_length = 0
    for index, data in enumerate(zip_datas):
        list_data = list(data)
        len_data = len(list_data)
        if choice_length + len_data >= data_count:
            fill_data = len(ads_data)
            ads_data.extend(list_data[0:data_count-fill_data])
            break
        ads_data.extend(list_data)
        choice_length += len_data
    resp_dict = {
        'launch': {
            'group_name': group_name,
            'dates': dates,
            'region': region
        },
        'ads': ads_data
    }
    resp_id = str(uuid.uuid4())
    redis_key = 'tempad:' + resp_id
    await redis.conn.set(redis_key, ujson.dumps(resp_dict), ex=60*60*10)
    return response_json(resp_id)


async def get_ad_data(request):
    id = request.args.get('id')
    redis_key = 'tempad:' + id
    ad_data = await redis.conn.get(redis_key)
    return response_json(ujson.loads(ad_data))


async def get_group_name(request):
    """获取群名"""
    group_id = request.args.get('group_id')
    async with db.conn.acquire() as con:
        get_group_stmt = await con.prepare('''select name from "temp_group" where id = $1 ''')
        group_name = await get_group_stmt.fetchval(group_id)
    return response_json(group_name)


async def get_group_robot_name(request):
    """获取机器人群内昵称"""
    group_id = request.args.get('group_id')
    async with db.conn.acquire() as con:
        get_robot_name_stmt = await con.prepare('''select nickname from "temp_robot_group_map" where group_id = $1 ''')
        robot_remark_name = await get_robot_name_stmt.fetchval(group_id)
    return response_json(robot_remark_name)


async def get_user_by_unoin_id(union_id):
    """获取用户信息"""
    async with db.conn.acquire() as con:
        select_stmt = await con.prepare(
            '''select id from "temp_user" where union_id = $1 and status <> 3''')
        return await select_stmt.fetchval(union_id)


# ========= 前端静态路径 ======== #

async def static_group_qrcode_view(request):
    file_path = os.path.join(BASIC_PATH, 'static/gdogH5/qrcodeGroup.html')
    return await file(file_path)


async def static_robot_qrcode_view(request):
    file_path = os.path.join(BASIC_PATH, 'static/gdogH5/qrcodeDog.html')
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
