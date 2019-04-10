import asyncio
import unittest

from app.base import SanicPostgresql, SanicRedis
from app import create_app
from config import settings

loop = asyncio.get_event_loop()


def _run(coro):
    """Run the given coroutine."""
    return loop.run_until_complete(coro)


class APITestCase(unittest.TestCase):
    @classmethod
    def setUpClass(cls):
        sanic_db = SanicPostgresql()
        sanic_redis = SanicRedis()
        cls.db = _run(sanic_db.init_app(loop, settings['DATABASES']))
        cls.redis = sanic_redis.init_app(loop, settings['REDIS'])
        _run(cls.delete_test_data())
        _run(cls.create_test_user_robot())

    @classmethod
    def tearDownClass(cls):
        _run(cls.delete_test_data())
        _run(cls.db.close())
        cls.redis.connection_pool.disconnect()

    def setUp(self):
        self.union_id = 'oVzypxEajF-shPHskESZWBEN31R0'
        self.app = create_app(settings)
        self.client = self.app.test_client

    def get_api_headers(self, union_id):
        request, response = self.client.post('/auth', json={'union_id': union_id})
        data = response.json
        self.assertEqual(response.status, 200)
        self.assertEqual(data['code'], 1200)
        return {
            'Authorization': f'Bearer {data["access_token"]}',
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        }

    @classmethod
    async def create_test_user_robot(cls):
        async with cls.db.acquire() as con:
            await con.fetch(
                '''insert into "user" (id, union_id, head_url, nickname, phone) 
                   values ('d2b79fc3-6f8a-403c-9ce0-8c4fbf14dc71', 'oVzypxEajF-shPHskESZWBEN31R0', 
                   'http://thirdwx.qlogo.cn/mmopen/vi_32/ynuMumfGvPhXG4LhHIy5ALMLekgricCcTZBHQiavpgw01YzEv1bl5Lcy0lib5micpdbw38GIOic0O0Kfbl2CormpOicQ/132', 
                   '🍏珂飞', '13162952287')''')
            await con.fetch(
                '''insert into "robot" (id, code, name, count_threshold, count_distribute, head_url, qr_code, wechat_no) 
                   values ('8e752987-d966-4954-be63-54cb62f487ae', '6F0755CC6AAA2ADB508D203DB4BD8944', '小松鼠佳佳', 6, 0, 
                          'http://wx.qlogo.cn/mmhead/ver_1/Xka5eeTHicWBm4BhWdTGc0ibIAQaqBDEE4srKupxKwEs2ajmDbl8CnJiaFfvv7tQMK3udDxiccia0IB860WO4GO0wy7mVlWX07cmgld78CTbqib8o/132', 
                          'http://kfpt.oss-cn-hangzhou.aliyuncs.com/pc/ipadwx_lh_person_qrcode/20190220/b034f21883f4a7ea4e67e3e101186f36.jpg', 'iylsuifs65')''')
            await con.fetch(
                '''insert into "robot" (id, code, name, count_threshold, count_distribute, head_url, qr_code, wechat_no) 
                   values ('7143ce88-9957-4629-a85c-e160e61880f6', '5765D2ACBF9143C687AC36057063FC58', '小松鼠勃勃', 6, 0, 
                          'http://wx.qlogo.cn/mmhead/ver_1/lFI0MfpcyaBmUo3Euy3cWBEB9iaVkJqUgFjnDoblr7jEiabR5xjjDC1P7UFG5GAVvAX49DIaT7fWn1y9O3sib4WjIJsR4YdmoDcm1kCmyPlwqk/132', 
                          'http://kfpt.oss-cn-hangzhou.aliyuncs.com/pc/ipadwx_lh_person_qrcode/20190219/f52d8d492eab369754ca696296b91a98.jpg', 'ugdgqdlu89')''')

    @classmethod
    async def delete_test_data(cls):
        async with cls.db.acquire() as con:
            await con.fetch('''delete from "robot" where id='8e752987-d966-4954-be63-54cb62f487ae' 
                               or id='7143ce88-9957-4629-a85c-e160e61880f6' ''')
            await con.fetch('''delete from "robot_add_friend" where robot_id='8e752987-d966-4954-be63-54cb62f487ae'
                               or robot_id='7143ce88-9957-4629-a85c-e160e61880f6' ''')
            await con.fetch('''delete from "robot_distribute" where robot_id='8e752987-d966-4954-be63-54cb62f487ae' 
                               or robot_id='7143ce88-9957-4629-a85c-e160e61880f6' ''')
            await con.fetch('''delete from "user" where id='d2b79fc3-6f8a-403c-9ce0-8c4fbf14dc71' ''')
            await con.fetch('''delete from "group" where id='e0d50019-e7a5-483e-95e1-3115bc762fee' ''')
            await con.fetch('''delete from "robot_group_map" where group_id='e0d50019-e7a5-483e-95e1-3115bc762fee' ''')

    async def update_robot_distribute_max(self):
        async with self.db.acquire() as con:
            self.r1 = await con.fetchval('select count_distribute from "robot" where id=$1', '8e752987-d966-4954-be63-54cb62f487ae')
            self.r2 = await con.fetchval('select count_distribute from "robot" where id=$1', '7143ce88-9957-4629-a85c-e160e61880f6')
            await con.fetch('update "robot" set count_distribute=6 where id=$1', '8e752987-d966-4954-be63-54cb62f487ae')
            await con.fetch('update "robot" set count_distribute=6 where id=$1', '7143ce88-9957-4629-a85c-e160e61880f6')

    async def update_robot_distribute_normal(self):
        async with self.db.acquire() as con:
            await con.fetch('update "robot" set count_distribute=$1 where id=$2', self.r1, '8e752987-d966-4954-be63-54cb62f487ae')
            await con.fetch('update "robot" set count_distribute=$1 where id=$2', self.r2, '7143ce88-9957-4629-a85c-e160e61880f6')

    async def add_test_4_init_data(self):
        async with self.db.acquire() as con:
            await con.fetch(
                '''insert into "robot_add_friend" (id, robot_id, user_id) 
                   values ('4e76b20e-5192-4faf-976d-2c528971f73e', '8e752987-d966-4954-be63-54cb62f487ae', 'd2b79fc3-6f8a-403c-9ce0-8c4fbf14dc71')''')
            await con.fetch('update "user" set code=$1 where id=$2', '087F9B6D448CAC7F9E18F14A9E87E491', 'd2b79fc3-6f8a-403c-9ce0-8c4fbf14dc71')

    async def add_test_4_teardown_data(self):
        async with self.db.acquire() as con:
            await con.fetch('update "user" set code=null where id=$1', 'd2b79fc3-6f8a-403c-9ce0-8c4fbf14dc71')
            await con.fetch('delete from "robot_add_friend" where id=$1', '4e76b20e-5192-4faf-976d-2c528971f73e')

    async def add_test_5_init_data(self):
        async with self.db.acquire() as con:
            await con.fetch(
                '''insert into "group" (id, code, user_id, user_code, owner_user_code, name, mem_count) 
                   values ('e0d50019-e7a5-483e-95e1-3115bc762fee', '7B799198FFE83AF35F1A6C34D9FAEB13', 
                           'd2b79fc3-6f8a-403c-9ce0-8c4fbf14dc71', '087F9B6D448CAC7F9E18F14A9E87E491', 
                           '99C033393A412DFE5B17BE908E55EAB9', '单元测试群', 51)''')
            await con.fetch(
                '''insert into "robot_group_map" (id, robot_id, group_id)
                   values (uuid_generate_v4(), '8e752987-d966-4954-be63-54cb62f487ae', 'e0d50019-e7a5-483e-95e1-3115bc762fee')''')

    def test_1_auth_token(self):
        request, response = self.client.post('/auth', json={'union_id': self.union_id})
        data = response.json
        self.assertEqual(response.status, 200)
        self.assertEqual(data['code'], 1200)

    def test_2_robot_not_enough_distribute(self):
        _run(self.update_robot_distribute_max())
        auth_headers = self.get_api_headers(self.union_id)
        request, response = self.client.get('/robot/distribution', headers=auth_headers)
        data = response.json
        print(data)
        self.assertEqual(response.status, 200)
        self.assertEqual(data['code'], 1600)
        _run(self.update_robot_distribute_normal())

    def test_3_robot_distribute(self):
        auth_headers = self.get_api_headers(self.union_id)
        request, response = self.client.get('/robot/distribution', headers=auth_headers)
        data = response.json
        print(data)
        self.assertEqual(response.status, 200)
        self.assertEqual(data['code'], 1200)

    def test_4_user_has_robots_friend_distribute(self):
        _run(self.add_test_4_init_data())
        auth_headers = self.get_api_headers(self.union_id)
        request, response = self.client.get('/robot/distribution', headers=auth_headers)
        data = response.json
        print(data)
        self.assertEqual(response.status, 200)
        self.assertEqual(data['code'], 1200)
        _run(self.add_test_4_teardown_data())

    def test_5_show_group_forever_qrcode(self):
        _run(self.add_test_5_init_data())
        auth_headers = self.get_api_headers(self.union_id)
        request, response = self.client.get('/group/7B799198FFE83AF35F1A6C34D9FAEB13/qrcode', headers=auth_headers)
        data = response.json
        print(data)
        self.assertEqual(response.status, 200)
        self.assertEqual(data['code'], 1200)

    def test_6_group_robot_show(self):
        auth_headers = self.get_api_headers(self.union_id)
        request, response = self.client.get('/group/7B799198FFE83AF35F1A6C34D9FAEB13/robot_qrcode', headers=auth_headers)
        data = response.json
        print(data)
        self.assertEqual(response.status, 200)
        self.assertEqual(data['code'], 1200)

    def test_7_group_welcome_msg(self):
        auth_headers = self.get_api_headers(self.union_id)
        request, response = self.client.get('/groups/welcome_msg', headers=auth_headers)
        data = response.json
        print(data)
        self.assertEqual(response.status, 200)
        self.assertEqual(data['code'], 1200)

    def test_8_update_welcome_msg(self):
        auth_headers = self.get_api_headers(self.union_id)
        request, response = self.client.put('/group/fee08d47-b600-4a2f-9402-b174ae2511cc/welcome_msg',
                                            headers=auth_headers, json={"switch": 1, "msg": "欢迎👏入群"})
        data = response.json
        print(data)
        self.assertEqual(response.status, 200)
        self.assertEqual(data['code'], 1200)

    def test_9_user_status(self):
        request, response = self.client.get('/user/status?union_id=oVzypxEajF-shPHskESZWBEN31R0')
        data = response.json
        print(data)
        self.assertEqual(response.status, 200)
        self.assertEqual(data['code'], 1200)
