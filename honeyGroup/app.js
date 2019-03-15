//app.js
const util = require("utils/util.js")
const API = require('/utils/api.js')

App({
    onLaunch: function() {
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
        userInfo: null,
        submitFormId: 0,
        inviterId: 0,
        addUser: 'not'
    },
    shareIndex: function(titles, paths, urls) {
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
    //无须token的请求方式
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
     getToken(url) {
        util.waitShow();
        let that = this
        console.log('→项目开始获取token开始/n', url);
        wx.request({
            url: url,
            method: 'POST',
            data: {},
            header: {
                'Content-Type': 'application/json;charset=UTF-8',
                "Authorization": "Basic bGl6LWxpbWEtd3g6c2VjcmV0" //base64加密liz-youli-wx:secret
            },
            success(res) {
                util.waitHide();
                console.log(res, '→数据')
                util.delayed30s(res.data.access_token, res.data.refresh_token, res.data.expires_in);
                console.log('→项目开始获取token结束', url);
            },
            fail(e) {
                console.log(e, '→获取token失败');
            }
        });
    },
    // postToken请求方式
    getAccessToken(callback) {
        let that = this
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
                wx.request({
                    url: API.refreshToken + refresh_token,
                    method: 'POST',
                    header: {
                        'Content-Type': 'application/json;charset=UTF-8',
                        "Authorization": "Basic bGl6LXJlZHBhY2thZ2Utd3g6c2VjcmV0" //base64加密liz-youli-wx:secret
                    },
                    success: function(res) {
                        util.waitHide();
                        if (res.data.error == 'invalid_grant' || res.data.error == 'invalid_token') {
                            console.log('→refresh_token失效')
                            var unionid = wx.getStorageSync('unionid', unionid); //unionid  
                            // that.getToken(API.getToken + 'unionid_' + unionid + '_type_2');
                            //重新拿token
                                let url=API.getToken + 'unionid_' + unionid + '_type_2'
                                util.waitShow();
                                let that = this
                                console.log('→项目开始获取token开始/n', url);
                                wx.request({
                                    url: url,
                                    method: 'POST',
                                    data: {},
                                    header: {
                                        'Content-Type': 'application/json;charset=UTF-8',
                                        "Authorization": "Basic bGl6LWxpbWEtd3g6c2VjcmV0" //base64加密liz-youli-wx:secret
                                    },
                                    success(res) {
                                        util.waitHide();
                                        console.log(res, '→数据')
                                        util.delayed30s(res.data.access_token, res.data.refresh_token, res.data.expires_in);
                                        callback(res.data.access_token);
                                        console.log('→项目开始获取token结束', url);
                                    },
                                    fail(e) {
                                        console.log(e, '→获取token失败');
                                    }
                                });

                        } else {
                            console.log('→刷新token成功')
                            util.delayed30s(res.data.access_token, res.data.refresh_token, res.data.expires_in);
                            callback(wx.getStorageSync('access_token'));
                        }
                    },
                    fail: function(e) {
                        util.waitHide();
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
    fetchToken(url, method, data, callback, hideLoading) {
        // util.waitShow();
        wx.showNavigationBarLoading()
        if (hideLoading == '1') {
            console.log('hideLoading:' + hideLoading)
            // util.waitHide();
            wx.hideNavigationBarLoading()
        }
        let self = this
        self.getAccessToken((res) => {
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
                    // util.waitHide();
                    wx.hideNavigationBarLoading()
                    console.log('→返回数据', res.data);
                    if (res.data.error == 'invalid_token') {
                        console.log('invalid_token')
                        var unionid = wx.getStorageSync('unionid', unionid); //unionid  
                        self.getToken(API.getToken + 'unionid_' + unionid + '_type_2');
                        callback(null, res.data);
                    } else {
                        callback(null, res.data);
                    }
                    console.log('→请求结束', url, data);
                },
                fail(e) {
                    console.log(e)
                    // util.waitHide();
                    wx.hideNavigationBarLoading()
                    util.showModal('加载失败', '网络不好，稍后再试试咯~')
                    callback(e);
                }
            });
        })
    }
})