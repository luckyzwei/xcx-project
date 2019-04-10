import os
from config import settings

# ========= 接口相关 ========== #
BASIC_PATH = os.path.abspath(os.path.dirname(__name__))  # 当前路径地址

SERVICE_SUCCESS_CODE = 1200  # 正常
UNAUTHENTICATE_EXPIRED_CODE = 1406  # 服务器无法根据客户端请求的内容特性完成请求
UNAUTHENTICATE_CODE = 1401  # 鉴权失败
PARAMS_ERROR_CODE = 1403  # 请求参数错误
RESOURCE_NOT_FOUND_CODE = 1404  # 请求资源不存在

# 机器人相关
ROBOT_NOT_ENOUGH_CODE = 1600  # 机器人数量不足

# 用户相关
WECHAT_AUTH_ERROR = 2501  # 微信授权失败

# ========= REDIS相关 =========== #
CACHE_JS_API_TICKET = 'WECHAT:H5:JSAPI_TICKET_{app_id}'  # 用户分享ticket
CACHE_WECHAT_H5_ACCESS_TOKEN = 'WECHAT:H5:ACCESSTOKEN_{app_id}'  # H5公众号access_token缓存
CACHE_WECHAT_APP_ACCESS_TOKEN = 'WECAHT:APP:ACCESS_TOKEN_{app_id}'  # 小程序access_token缓存
CACHE_TEMP_ROBOT_AMOUNT_USED = 'used_amount:{robot_id}'
CACHE_TEMP_USER_ROBOT_DISTRIBUTE = 'temp_distribute:{user_id}'
CACHE_ROBOT_LASTED_OPERATE = 'lasted_operate:{robot_code}:{nickname_md5}'
CACHE_BIND_USER_ROBOT_GROUP_MAP = 'enter_group:{robot_code}:{user_id}'
CACHE_GROUP_WELCOME_MSG_RECORD = 'group_welcome:{group_id}'        # 触发群欢迎语
CACHE_GROUP_AD_OLD_USER = 'group_ad_old_user'

DISTRIBUTE_EXPIRE_TIME = 24 * 60 * 60

# ========== url路径相关 ========= #

WECHAT_APP_CODE_2_SESSION_URL = 'https://api.weixin.qq.com/sns/jscode2session?appid={app_id}&secret={app_secret}&js_code={code}&grant_type=authorization_code'  # 看门狗小程序code2session
WECHAT_APP_ID = 'wxf6153567687b6c60'  # 看门狗小程序app_id
WECHAT_APP_SECRET = 'dd1c1f6aa6d4f0f76b18d56b577ca44a'  # 看门狗小程序app_secret
WECHAT_APP_GET_ACCESS_TOKEN_URL = 'https://api.weixin.qq.com/cgi-bin/token?grant_type=client_credential&appid={app_id}&secret={app_secret}'  # 看门小程序获取access_token
WECHAT_H5_GET_ACCESS_TOKEN_URL = 'https://api.weixin.qq.com/sns/oauth2/access_token?appid={app_id}&secret={secret}&code={code}&grant_type=authorization_code'  # 看门狗H5公众号网页授权token
WECHAT_H5_APP_ID = 'wx2f7c5155a1152486'  # H5公众号app_id
WECHAT_H5_APP_SECRET = '2a58c63f0effb94e75fc06f4332d6228'  # 看门狗H5公众号secret
WECHAT_H5_GET_USER_INFO_URL = 'https://api.weixin.qq.com/sns/userinfo?access_token={access_token}&openid={open_id}&lang=zh_CN'  # 看门狗H5公众号获取用户信息
WECHAT_H5_TICKET_SIGNATURE = 'jsapi_ticket={ticket}&noncestr={noncestr}&timestamp={timestamp}&url={url}'
WECHAT_H5_GET_TOKEN_URL = 'https://api.weixin.qq.com/cgi-bin/token?grant_type=client_credential&appid={app_id}&secret={secret}'  # 看门狗H5公众号获取token
WECHAT_H5_TICKET_URL = 'https://api.weixin.qq.com/cgi-bin/ticket/getticket?access_token={access_token}&type=jsapi'
WECHAT_H5_RESP_CUSTOMER_MSG_URL = 'https://api.weixin.qq.com/cgi-bin/message/custom/send?access_token={access_token}'  # 小程序回复客服消息
WECHAT_CUSTOMER_MSG_CALLBACK_TYPE = ['text', 'image', 'miniprogrampage']

FOREVER_QRCODE = ''.join([settings['EXTERNAL_HOST'], '/group-robot-qrcode?group_code={code}'])    # 永久二维码链接地址

# ========= 推送话术 =========== #
DEFAULT_WELCOME_MSG = "欢迎入群～～本群禁止发广告，不然我会汪汪叫哦"
PULL_GROUP_TEXT = '主人，将我拉入你的微信群中，我就可以为该群服务啦'
GROUP_COUNT_EXCEED_LIMIT = '看门狗暂时只支持替主人看护1个群，多群看护功能正在完善，敬请期待~'
GROUP_HAVEN_BEEN_BIND = '【{group_name}】群内已经有了其他群友的看门狗哦，请主人拉我进其他微信群吧'
BIND_GROUP_SUCCESS = '入群成功!\n 点击下方小程序，就可以设置并使用看门狗的各种功能了！'
ROBOT_KICKED = '【{group_name}】群把我赶出了家门，主人请把看门狗重新拉进群哦汪'
DEFAULT_AD_MONITOR_MSG = "群里不允许发广告，请马上撤回"
MINI_PROGRAM_CONTENT =  '''<?xml version='1.0'?><msg><appmsg appid='' sdkver='0'><title>永久入群神器，广告拦截卫士</title><des /><username /><action>view</action><type>33</type><showtype>0</showtype><content /><url>https://mp.weixin.qq.com/mp/waerrpage?appid=wxf6153567687b6c60&amp;type=upgrade&amp;upgradetype=3#wechat_redirect</url><lowurl /><dataurl /><lowdataurl /><contentattr>0</contentattr><streamvideo><streamvideourl /><streamvideototaltime>0</streamvideototaltime><streamvideotitle /><streamvideowording /><streamvideoweburl /><streamvideothumburl /><streamvideoaduxinfo /><streamvideopublishid /></streamvideo><canvasPageItem><canvasPageXml><![CDATA[]]></canvasPageXml></canvasPageItem><appattach><attachid /><cdnthumburl>305b0201000454305202010002040795a8e102033d11fd0204bbe2e26502045c7e2431042d6175706170706d73675f376661613637653333343162343862305f313535313737303637323833325f343839310204010400030201000400</cdnthumburl><cdnthumbmd5>d182272e548be678004830976c7f457f</cdnthumbmd5><cdnthumblength>21891</cdnthumblength><cdnthumbheight>480</cdnthumbheight><cdnthumbwidth>600</cdnthumbwidth><cdnthumbaeskey>fa2536bcccb519b5019b6a03a72ac3e7</cdnthumbaeskey><aeskey>fa2536bcccb519b5019b6a03a72ac3e7</aeskey><encryver>1</encryver><fileext /><islargefilemsg>0</islargefilemsg></appattach><extinfo /><androidsource>0</androidsource><sourceusername>gh_56486942dc7e@app</sourceusername><sourcedisplayname>栗子增长大师</sourcedisplayname><commenturl /><thumburl /><mediatagname /><messageaction><![CDATA[]]></messageaction><messageext><![CDATA[]]></messageext><emoticongift><packageflag>0</packageflag><packageid /></emoticongift><emoticonshared><packageflag>0</packageflag><packageid /></emoticonshared><designershared><designeruin>0</designeruin><designername>null</designername><designerrediretcturl>null</designerrediretcturl></designershared><emotionpageshared><tid>0</tid><title>null</title><desc>null</desc><iconUrl>null</iconUrl><secondUrl>null</secondUrl><pageType>0</pageType></emotionpageshared><webviewshared><shareUrlOriginal /><shareUrlOpen /><jsAppId /><publisherId>wxapp_wxf6153567687b6c60pages/index/index.html</publisherId></webviewshared><template_id /><md5>d182272e548be678004830976c7f457f</md5><weappinfo><pagepath><![CDATA[pages/index/index.html]]></pagepath><username>gh_56486942dc7e@app</username><appid>wxf6153567687b6c60</appid><type>2</type><weappiconurl><![CDATA[http://wx.qlogo.cn/mmhead/Q3auHgzwzM4VqjNZEtbeGGvNMI0vU03FnsDkj9m0UlV8dfR45MzDZg/96]]></weappiconurl><shareId><![CDATA[1_wxf6153567687b6c60_127248609_1551770673_0]]></shareId><pkginfo><type>2</type><md5>e12a514c517abaa6cd7eacae8f55e010</md5></pkginfo><appservicetype>0</appservicetype></weappinfo><statextstr /><websearch><rec_category>0</rec_category><channelId>0</channelId></websearch></appmsg><fromusername>wxid_l551vaxob1pq12</fromusername><scene>0</scene><appinfo><version>1</version><appname></appname></appinfo><commenturl></commenturl></msg>'''

# ========== 类型相关 ========= #

class MSGTYPE:
    '''消息类型'''
    TEXT = 3
    IMAGE = 8
    LINK = 6
    MINI_PROGRAM = 11
    USER_CARD = 12


class TYPE:
    '''机器人操作类型'''
    ROBOT_ENTER_GROUP = 0
    PULL_USER_GROUP = 1
    CHOICES = (
        (ROBOT_ENTER_GROUP, '机器人入群'),
        (PULL_USER_GROUP, '拉用户入群'),
    )


class GroupCancelReason:
    """群注销原因"""
    ROBOT_KICKED = 1  # 机器人退群
    SYSTEM_ACTIVE = 2  # 系统主动注销
    ROBOT_BLOCKED = 3  # 机器人封号
