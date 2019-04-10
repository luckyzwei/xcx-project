
function wechat_login() {
    var code = getQueryString('code')
    if(code===null){
        //静默授权
        //snsapi_base（不弹出授权页面，直接跳转，只能获取用户openid）
        //snsapi_userinfo（弹出授权页面，可通过openid拿到昵称、性别、所在地。并且， 即使在未关注的情况下，只要用户授权，也能获取其信息 ）
        location.href = `https://open.weixin.qq.com/connect/oauth2/authorize?appid=${APP_ID}&redirect_uri=${escape(location.href)}&response_type=code&scope=snsapi_userinfo&connect_redirect=1#wechat_redirect`
    }else {
        //根据code获取用户微信信息 url = `${API_PATH}/wechat/h5/user_info?app_id=${appid}&code=${code}`
        return $.ajax({
            url:API.wechat+'app_id='+APP_ID+'&code='+code,
            type:'get',
            success:function (res) {
                if (res.code === 1200) {
                    let resData= res.data
                    saveCookie('unionId_d',resData.unionid)
                    saveCookie('openId_d',resData.openid)
                    saveCookie('headUrl_d',resData.headimgurl)
                    saveCookie('nickName_d',resData.nickname)
                    return resData
                }
            }
        })
    }


}

function setWxShareConent() {
    var currentUrl=location.href.split('#')[0]
    var url = encodeURIComponent(currentUrl);
    $.ajax({
        type:'GET',
        url:'/wechat/h5/js/ticket?app_id='+APP_ID+'&url=' + url,
        success:function (data) {
            wx.config({
                debug: false, // 开启调试模式,调用的所有api的返回值会在客户端alert出来，若要查看传入的参数，可以在pc端打开，参数信息会通过log打出，仅在pc端时才会打印。
                appId: data.appid, // 必填，公众号的唯一标识
                timestamp: data.timestamp, // 必填，生成签名的时间戳
                nonceStr: data.nonceStr, // 必填，生成签名的随机串
                signature: data.signature,// 必填，签名，见附录1
                jsApiList: [
                    'onMenuShareAppMessage',
                    'onMenuShareTimeline',
                ] // 必填，需要使用的JS接口列表，所有JS接口列表见附录2
            })
        }
    });

    wx.ready(function () {
        /*发送给朋友*/
        wx.onMenuShareAppMessage({
            title: '栗子小助手', // 分享标题
            desc: '永久入群神器，广告监测', // 分享描述
            link: location.href, // 分享链接
            imgUrl: API_PATH+'/images/mini_program_cover.png', // 分享图标
            type: '', // 分享类型,music、video或link，不填默认为link
            dataUrl: '', // 如果type是music或video，则要提供数据链接，默认为空
            success: function () {
                //分享成功
            },
            cancel: function () {
                // 用户取消分享后执行的回调函数
            }
        })

        /*分享到朋友圈*/
        wx.onMenuShareTimeline({
            title: '栗子小助手', // 分享标题
            link: location.href, // 分享链接
            imgUrl: API_PATH+'/images/mini_program_cover.png', // 分享图标
            success: function () {
               //分享成功
            },
            cancel: function () {
                // 用户取消分享后执行的回调函数

            }
        })
    })
}
