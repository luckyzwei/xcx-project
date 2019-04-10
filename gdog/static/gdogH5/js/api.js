
var APP_ID='wx2f7c5155a1152486';//宝妈微社区

var API_PATH =  window.location.origin.includes('localhost') ? 'https://gdogdev.lizmom.cn'
    : window.location.origin.includes('gdogdev') ? 'https://gdogdev.lizmom.cn'
        : window.location.origin.includes('gdogprd') ? 'https://gdogprd.lizmom.cn'
            : 'https://gdogprd.gemii.cc'

var API={
    distribution:API_PATH+'/robot/distribution',//看门狗机器人分配
    robot_qrcode:API_PATH+'/group/',//群内机器人展示页
    wechat:'/wechat/h5/user_info?' //微信授权
}
