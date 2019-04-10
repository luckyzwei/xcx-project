## 看门狗项目后端接口定义

- 公共接口
  - [1. 微信授权(小程序)](#小程序微信授权)
  - [2. 微信授权(H5)](#微信授权)
  - [3. 微信获取分享ticket(H5)](#微信获取分享ticket)
  - [4. 系统内部鉴权接口](#系统内部鉴权接口)
- web接口
  - [1. 用户当前状态](#用户当前状态)
  - [2. 看门狗机器人分配(H5)](#看门狗机器人分配)
  - [3. 永久二维码展示页](#永久二维码展示页)
  - [4. 欢迎语展示列表页](#欢迎语展示列表页)
  - [5. 欢迎语设置](#欢迎语设置)
  - [6. 广告监测列表页](#广告监测列表页)
  - [7. 广告监测设置](#广告监测设置)
  - [8. 群内机器人展示页(H5)](#群内机器人展示页)
  - [9. 建议反馈查询页](#建议反馈查询页)
- 微信回调接口
  - [1. 小程序客服消息回调](#小程序客服消息回调)

- 机器人回调接口
  - 机器人加好友回调
  - 私聊消息回调
  - 待开通群回调
  - 群开通成功回调
  - 群开通失败回调
  - 机器人被踢回调
  - 机器人被封回调
  - 群成员入群回调
  - 解绑群成功回调
  - 群信息更新回调
  
#### 小程序微信授权

##### 请求地址
>POST /wechat/app/user_info

##### 请求参数
```json
{
    "app_id": "",
    "code": "",
    "encrypted_data": "",
    "iv": ""
}
```

##### 返回示例

```json
{
    "code": 1200,
    "description": "",
    "data": {
        "openid": "ocSwr1DzWi0mKa27riXAPW3s3wjw",
        "nickname": "请叫我小稳稳",
        "gender": 1,
        "city": "蚌埠",
        "province": "安徽",
        "country": "中国",
        "headimgurl": "http://thirdwx.qlogo.cn/mmopen/vi_32/Q0j4TwGTfTKONsO37xAqEuQbTYendndpfbd0KFFgDIsY4wFDSa22K8KXGiaqqL5porTLZN2MAI2bBG9pFgpcSow/132",
        "unionid": "oVzypxARc1pEsaCS9D5UxKpQPrpc",
        "watermark": {
                "appid": "",
                "timestamp": TIMESTAMP
          }
    }
}
	
```
##### 返回参数说明

|    参数    |  类型  |          说明          |
| :--------: | :----: |  :--------------------: |
|   code  | int |  正常返回1200 |
|   openid   | string |  对于微信公众号唯一标识 |
|  nickname  | string |  昵称          |
|    gender     |  int   |   性别          |
|    city    | string |  城市          |
|  province  | string |  省份          |
|  country   | string |   国家          |
| headimgurl | string |   头像          |
|  unionid   | string |  微信授权唯一标识    |

---

#### 微信授权

##### 请求地址
>GET /wechat/h5/user_info?app_id=1234&code=1234

##### 请求参数
> 无

##### 返回示例

```json
{
    "code": 1200,
    "description": "",
    "data": {
        "openid": "ocSwr1DzWi0mKa27riXAPW3s3wjw",
        "nickname": "请叫我小稳稳",
        "sex": 1,
        "language": "zh_CN",
        "city": "蚌埠",
        "province": "安徽",
        "country": "中国",
        "headimgurl": "http://thirdwx.qlogo.cn/mmopen/vi_32/Q0j4TwGTfTKONsO37xAqEuQbTYendndpfbd0KFFgDIsY4wFDSa22K8KXGiaqqL5porTLZN2MAI2bBG9pFgpcSow/132",
        "privilege": [],
        "unionid": "oVzypxARc1pEsaCS9D5UxKpQPrpc"
    }
}
	
```
##### 返回参数说明

|    参数    |  类型  |          说明          |
| :--------: | :----: |  :--------------------: |
|   code  | int |  正常返回1200 |
|   openid   | string |  对于微信公众号唯一标识 |
|  nickname  | string |  昵称          |
|    sex     |  int   |   性别          |
|  language  | string |   语言          |
|    city    | string |  城市          |
|  province  | string |  省份          |
|  country   | string |   国家          |
| headimgurl | string |   头像          |
| privilege  | string | 特权，一般为[]     |
|  unionid   | string |  微信授权唯一标识    |

---

#### 微信获取分享ticket

##### 请求地址
>GET /wechat/h5/js/ticket?app_id=1234&url=1234

##### 请求参数
> 无

##### 返回示例

```json
{
    "code": 1200,
    "description": "",
    "data": {
        "appid": "",
        "timestamp": "",
        "noncestr": "",
        "signature": ""
    }
}
```

##### 返回参数说明

|   参数    |  类型  |    说明           |
| :-------: | :----: | :----------------------: |
|   code  | int |  正常返回1200 |
|   appid   | string | 微信公众号唯一标识    |
| timestamp | string |  时间戳，用作加密用    |
| noncestr  | string |   签名随机字符串      |
| signature | string |   用sha1算法生成的加密签名 |

---

#### 系统内部鉴权接口

##### 请求地址
>POST /auth

##### 请求参数
```json
{
    "union_id": ""
}
```

##### 请求参数说明
|    参数    |  类型   | 是否必传 |    说明          |
| :--------: | :----: |  :------:| :--------------: |
|   union_id  | string |  必传   | 用户微信union_id |

##### 返回示例

- 正常返回
```json
{
    "code": 1200, 
    "description": "",
    "access_token": "xxxx",  
    "expire_time": 60 
}
```

##### 返回参数说明

|    参数         |  类型  | 说明        |
| :-----------:  | :----: |:-------:   |
|   code  | int |  正常返回1200, 鉴权失败 1401 |
|   access_token | string | 鉴权token   |
|  expire_time   | int    | token失效时间|


---

#### 用户当前状态
##### 请求地址
>GET /user/status?union_id=xxxx

##### 请求参数
> 非鉴权

> 无

##### 返回示例

```json
{
    "code": 1200,
    "description": "",
    "data": {
        "status": 1,
        "robot_name": "",
        "head_url": "",
        "group_code": ""
    }
}
```

##### 返回参数说明

|    参数         |  类型  | 说明        |
| :-----------:  | :----: |:-------:   |
|   code  | int |  正常返回1200 |
|   status | int | 0表示未领取机器人，1表示已领取   |
|   robot_name | string | 机器人昵称   |
|   head_url | string | 机器人头像   |
|   group_code | string | 群code   |

---

#### 看门狗机器人分配
##### 请求地址
>GET /robot/distribution

##### 请求参数
> 无

##### 返回示例

```json
{
    "code": 1200,
    "description": "",
    "data": {
        "head_url": "",  
        "qr_code": "",  
        "wechat_no": "",
        "name": ""
    }
}
```

##### 返回参数说明
|    参数         |  类型  | 说明        |
| :-----------:  | :----: |:-------:   |
|   code  | int |  正常返回1200, 机器人不足 1600 |
|   head_url | string |  头像  |
|  qrcode   | string    | 机器人二维码|
|  wechat_no   | string    | 机器人微信号|
|  name   | string    | 机器人微信昵称|

---

#### 永久二维码展示页
##### 请求地址
>GET /group/:group_code/qrcode

##### 请求参数
> 无

##### 返回示例

```json
{
    "code": 1200,
    "description": "",
    "data": {
        "name": "",
        "qrcode": ""
    }
}
```

##### 返回参数说明

|    参数         |  类型  | 说明        |
| :-----------:  | :----: |:-------:   |
|   code  | int |  正常返回1200, 群二维码已失效 1403 |
|   name | string |  群昵称  |
|  qrcode   | string    | 永久二维码地址 |

---

#### 欢迎语展示列表页
##### 请求地址
>GET /groups/welcome_msg

##### 请求参数
> 无

##### 返回示例

```json
{
    "code": 1200,
    "description": "",
    "data": [{
        "id": "",
        "name": "",
        "switch": "",
        "msg": ""
    }]
}
```

##### 返回参数说明

|    参数         |  类型  | 说明        |
| :-----------:  | :----: |:-------:   |
|   code  | int |  正常返回1200, 无群信息 1404 |
|   id | string |  群id  |
|  name   |  string    | 群昵称 |
|  switch   |  string    | 欢迎语开关 |
|  msg   |  string    | 欢迎语话术 |

---

#### 欢迎语设置
##### 请求地址
>PUT /group/:group_id/welcome_msg

##### 请求参数
```json
{
    "switch": 0,
    "msg": ""
}
```
##### 请求参数说明
|    参数    |  类型   | 是否必传 |    说明          |
| :--------: | :----: |  :------:| :--------------: |
|   switch  | int |  必传   | 开关 0表示关，1表示开 |
|   msg  | string |  非必传   | 回复话术 |

##### 返回示例

```json
{
    "code": 1200,
    "description": "",
    "data": null
}
```

##### 返回参数说明

|    参数         |  类型  | 说明        |
| :-----------:  | :----: |:-------:   |
|   code  | int |  正常返回1200, 无群信息 1404 |

---

#### 广告监测列表页
##### 请求地址
>GET /groups/ad_monitor

##### 请求参数
> 无

##### 返回示例

```json
{
    "code": 1200,
    "description": "",
    "data": {
        "is_new_user": true,
        "groups_ad": [{
            "id": "",
            "name": "",
            "switch": "",
            "msg": "",
        }
    ]}
}
```

##### 返回参数说明

|    参数         |  类型  | 说明        |
| :-----------:  | :----: |:-------:   |
|   code  | int |  正常返回1200, 无群信息 1404 |
|   is_new_user  | boolean | 是否首次进入该页面，True:是  False:否 |
|   id  | int | 群id |
|   name  | int |  群昵称|
|   switch  | int |  广告监测开关 |
|   msg  | int |  广告监测话术 |

---

#### 广告监测设置
##### 请求地址
>PUT /group/:group_id/ad_monitor

##### 请求参数
```json
{
    "switch": 0,
    "msg": ""
}
```
##### 请求参数说明
|    参数    |  类型   | 是否必传 |    说明          |
| :--------: | :----: |  :------:| :--------------: |
|   switch  | int |  必传   | 开关 0表示关，1表示开 |
|   msg  | string |  非必传   | 回复话术 |

##### 返回示例

```json
{
    "code": 1200,
    "description": "",
    "data": null
}
```

##### 返回参数说明

|    参数         |  类型  | 说明        |
| :-----------:  | :----: |:-------:   |
|   code  | int |  正常返回1200, 无群信息 1404 |

---

#### 群内机器人展示页
##### 请求地址
>GET /group/:group_code/robot_qrcode

##### 请求参数
> 无

##### 返回示例

```json
{
    "code": 1200,
    "description": "",
    "data": {
        "name": "",
        "qrcode": ""
    }
}
```

##### 返回示例
|    参数         |  类型  | 说明        |
| :-----------:  | :----: |:-------:   |
|   code  | int |  正常返回1200, 群二维码已失效 1403, 机器人当日额度用完 1404 |
|   name | string |  群昵称  |
|  qrcode   | string    | 机器人二维码地址 |

---

#### 建议反馈查询页
##### 请求地址
>GET /feedback

##### 请求参数
> 无

##### 返回示例

```json
{
    "code": 1200,
    "description": "",
    "data": {
        "name": "",
        "wechat_no": ""
    }
}
```

##### 返回示例
|    参数         |  类型  | 说明        |
| :-----------:  | :----: |:-------:   |
|   code  | int |  正常返回1200 |
|   name | string |  机器人昵称  |
|  wechat_no   | string | 机器人微信号|
