const ORIGIN_NAME='https://cloud.gemii.cc/lizcloud/api' //生产环境
// const ORIGIN_NAME = 'http://dev.gemii.cc:58080/lizcloud/api' //开发模式
// const ORIGIN_NAME = 'http://test.gemii.cc:58080/lizcloud/api' //测试模式

const IMGFILE='https://cloud.gemii.cc/lizcloud'//根据id拿服务器图片生产模式
// const IMGFILE='http://dev.gemii.cc:58080/lizcloud'//根据id拿服务器图片开发模式
// const IMGFILE='http://test.gemii.cc:58080/lizcloud'//根据id拿服务器图片测试模式

const USER_LOGIN = ORIGIN_NAME + '/basis-api/noauth/' //授权绑定，用户登录1
const TOKRN = ORIGIN_NAME + '/uaa/oauth/token?' //获取token
const LADYBRO=ORIGIN_NAME+'/microsys-api/authsec/api/'//闺蜜团
const GOODS = ORIGIN_NAME +'/microsys-api/authsec/microsys'//积分商城
const DETAIL=ORIGIN_NAME +'/microsys-api/authsec/microsys/'

const api = {
    SECRET: "Basic bGl6LXlvdWxpLXd4OnNlY3JldA==", //base64加密liz-youli-wx:secret
    APP_ID: 'wxf9b221762a5531b7', //APPID
    authLogin: USER_LOGIN + 'wdwd/loadUserAuthorizeWechat', //获取unionID
    postUserInfo: USER_LOGIN + 'wdwd/loadUserAuthorizeWechat', //提交用户标识
    getToken: TOKRN + 'grant_type=password&password=&username=', //获取token
    refreshToken: TOKRN + 'grant_type=refresh_token&refresh_token=', //刷新token
    uploadImg:ORIGIN_NAME+'/gridfs-api/noauth/media',//上传图片
    signIn:ORIGIN_NAME+'/microsys-api/authsec/mgTask/checkIn',//签到
    updateUser:LADYBRO+'update/user?userId=',//更新用户
    searchUser:LADYBRO+'search/user',//查询用户
    TaskLists:LADYBRO+'mgTask/info',//任务列表
    userTask:LADYBRO+'mgUserTasks?_currentPage=',//查询用户任务
    formId:LADYBRO+'collection/formId?formId=',//采集form
    addUser:LADYBRO+'add/user',//添加用户
    liziTask:ORIGIN_NAME+'/microsys-api/authsec/mgTask/',//根据taskId查询栗子任务
    getTask:ORIGIN_NAME+'/microsys-api/authsec/user/mgTask?_taskId=',//领取任务
    submitTask:ORIGIN_NAME+'/microsys-api/authsec/user/mgTask',//提交任务
    account: ORIGIN_NAME +'/tenantadmin-api/authsec/account/accountslip/advance?_page=',//我的栗子
    imgFileId:IMGFILE+'/fs/noauth/media/',//根据id拿服务器图片
    accountAmount:ORIGIN_NAME+'/microsys-api/authsec/account/loadOrCreateAccount',//查询账户总额
    ifSign:LADYBRO+'checkIn/status',//签到状态
    goodsList:ORIGIN_NAME+'/microsys-api/authsec/microsys/mgGoods/list?_currentPage=',//商品列表
    exChange:GOODS+'/mgGoods/redeem',//兑换商品
    accountDetail:DETAIL+'goodsRedeemRecord/',//账本商品详情
    questionTask:LADYBRO+'user/mgTask/questionnaire/',//问卷任务
    goodsDetail:DETAIL+'/mgGoods/'//商品详情
}


module.exports = api;