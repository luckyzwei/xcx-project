//app.js
const util = require("utils/util.js")
const API = require('/utils/api.js')

App({
    onLaunch: function () {
        util.getUnioid(this);
        // 获取用户信息
        wx.getSetting({
            success: res => {
                if (res.authSetting['scope.userInfo']) {
                    // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
                    wx.getUserInfo({
                        success: res => {
                            // 可以将 res 发送给后台解码出 unionId
                            this.globalData.userInfo = res.userInfo

                            // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
                            // 所以此处加入 callback 以防止这种情况
                            if (this.userInfoReadyCallback) {
                                this.userInfoReadyCallback(res)
                            }
                        }
                    })
                }
            }
        })
    },
    globalData: {
        userInfo: null
    },
    shareIndex: function (titles, paths, urls) {
        let self = this;
        return {
            title: titles,
            path: paths,
            imageUrl: urls, //若不写，则随机截图当前页面,图片宽高有影响，尤其高度
            mask: true,
            success(res) {
                console.log(res)
                wx.showToast({
                    title: '分享成功',
                    icon: 'success',
                    duration: 3000
                })
            }
        }
    },
    getToken(url) {
        util.waitShow();
        let that = this
        console.log('→项目开始获取token开始/n');
        wx.request({
            url: url,
            method: 'POST',
            data: {},
            header: {
                'Content-Type': 'application/json;charset=UTF-8',
                "Authorization": "Basic bGl6LXJlZHBhY2thZ2Utd3g6c2VjcmV0" //base64加密liz-youli-wx:secret
            },
            success(res) {
                util.waitHide();
                console.log(res, '→数据')
                util.delayed30s(res.data.access_token, res.data.refresh_token, res.data.expires_in);
                console.log('→项目开始获取token结束');
            },
            fail(e) {
                util.waitHide();
                console.log(e, '→获取token失败');
            }
        });
    },
    //请求方式
    requestGet(url, method, data, callback) {
        util.waitShow();
        console.log('→开始请求', url);
        wx.request({
            url: url,
            method: method,
            data: data,
            header: {
                'Content-Type': 'application/json',
            },
            success(res) {
                util.waitHide();
                callback(null, res.data);
                console.log('→返回数据', res.data);
                console.log('→请求结束', url);
            },
            fail(e) {
                util.waitHide();
                callback(e);
            }
        });

    },

    // 获取token
    getAccessToken(callback) {
        let that = this;
        console.log('→获取token')
        var date = new Date();
        var dt = date.getTime();
        var dd = 0;
        var expires_in = wx.getStorageSync('expires_in');
        if (dt >= expires_in || isNaN(expires_in)) {
            if (wx.getStorageSync('access_token') != 'wait') {
                wx.setStorageSync('access_token', 'wait')
                console.log('→token过期,刷新token')
                var refresh_token = wx.getStorageSync('refresh_token');
                console.log(refresh_token);
                wx.request({
                    url: API.refreshToken + refresh_token,
                    method: 'POST',
                    header: {
                        'Content-Type': 'application/json;charset=UTF-8',
                        "Authorization": "Basic bGl6LXJlZHBhY2thZ2Utd3g6c2VjcmV0" //base64加密liz-youli-wx:secret
                    },
                    success: function (res) {
                        util.waitHide();
                        if (res.data.error == 'invalid_grant') {
                            console.log('→refresh_token失效')
                            var unionid = wx.getStorageSync('unionid', unionid); //unionid  
                            that.getToken(API.getToken + 'unionid_' + unionid + '_type_2');
                        } else {
                            console.log('→刷新token成功')
                            util.delayed30s(res.data.access_token, res.data.refresh_token, res.data.expires_in);
                            callback(wx.getStorageSync('access_token'));
                        }
                    },
                    fail: function (e) {
                        util.waitHide();
                        wx.removeStorageSync('expires_in');
                        console.log('→刷新token失败')
                    }
                })
            } else {
                setTimeout(() => {
                    callback(wx.getStorageSync('access_token'));
                }, 2000)
            }
        } else {
            console.log('→token未过期');
            callback(wx.getStorageSync('access_token'));
        }

    },

    // postToken请求方式
    fetchToken(url, method, data, callback) {
        util.waitShow();
        this.getAccessToken((res) => {
            console.log(res, "→获取token成功")
            wx.request({
                url: url,
                method: method,
                data: data,
                header: {
                    'Content-Type': 'application/json;charset=UTF-8',
                    "Authorization": "bearer " + res
                },
                success(res) {
                    util.waitHide();
                    console.log('→返回数据', res.data);
                    callback(null, res.data);
                    console.log('→请求结束', url, data);
                },
                fail(e) {
                    util.waitHide();
                    callback(e);
                }
            });
        })
    },
})