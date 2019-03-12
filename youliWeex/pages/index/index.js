//index.js
//获取应用实例
const app = getApp()
const util = require('../../utils/util.js')
const API = require('../../utils/api.js')
let wxRequest = require('../../utils/wxRequest.js')
let AuthProvider = require('../../utils/AuthProvider.js')
Page({
    data: {
        motto: 'Hello World',
        userInfo: {},
        hasUserInfo: false,
        encryptedData: '',
        iv: '',
        canIUse: wx.canIUse('button.open-type.getUserInfo'),
        userMessage: {
            imageUrl: '/images/pic_me_profile_defult@2x.png',
            userName: '账号'
        },
        orderStarts: {
            unpaidCount: 0,//未支付
            undeliverCount: 0,//未发货
            unconfirmedCount: 0,//未确认
        },//数量
    },
    onLoad: function () {
        //调用应用实例的方法获取全局数据
        util.globalDatas(app, this);
        if (this.data.hasUserInfo) {
            this.setData({
                'userMessage.imageUrl': this.data.userInfo.avatarUrl,
                'userMessage.userName': this.data.userInfo.nickName
            })
        }
    },
    getUserInfo: function (e) {
        let self = this
        console.log(e)
        if (e.detail.errMsg == 'getUserInfo:fail auth deny') {
            wx.showModal({
                title: '用户授权',
                content: '本小程序需用户授权，请重新点击按钮授权。',
                mask: true,
                confirmColor: '#F45C43',
                success: function (res) { }
            })
        } else if (e.detail.errMsg == 'getUserInfo:ok') {
            app.globalData.userInfo = e.detail.userInfo
            let userinfo = e.detail.userInfo
            self.setData({
                userInfo: userinfo,
                "userMessage.userName": userinfo.nickName,
                "userMessage.imageUrl": userinfo.avatarUrl,
                hasUserInfo: true,
                encryptedData: e.detail.encryptedData,
                iv: e.detail.iv
            })
            wx.setStorageSync('userinfo', userinfo)
            util.login(app, self.data.encryptedData, self.data.iv)
        }
    },
    adrMessage: function () {
        if (wx.chooseAddress) {
            wx.chooseAddress({
                success: res => {
                    console.log(JSON.stringify(res))
                },
                fail: err => {
                    console.log(JSON.stringify(err))
                    wx.navigateTo({
                        url: `/pages/adr/index`
                    })
                }
            })
        } else {
            console.log('当前微信版本不支持chooseAddress');
        }
    },
    changeOrderStuts: function (e) {
        var invalue = e.currentTarget.dataset.invalue;
        if (invalue == "168") {
            wx.navigateTo({
                url: `/pages/refund/refund`
            })
        } else {
            wx.navigateTo({
                url: `/pages/order/index?invalue=${invalue}`
            })
        }

    },
    onShow: function () {
        if (this.data.hasUserInfo) {
            AuthProvider.getAccessToken().then(token => {
                return wxRequest.fetch(API.getOrderStatusNum, { type: 'bearer', value: token }, null, "GET")
            }).then(res => {
                //处理数据，展示出来。
                if (res.data.resultCode == 100) {
                    if (res.data.resultContent.unpaidCount) {
                        this.setData({
                            'orderStarts.unpaidCount': res.data.resultContent.unpaidCount,
                        })
                    }
                    if (res.data.resultContent.undeliverCount) {
                        this.setData({
                            'orderStarts.undeliverCount': res.data.resultContent.undeliverCount,
                        })
                    }
                    if (res.data.resultContent.unconfirmedCount) {
                        this.setData({
                            'orderStarts.unconfirmedCount': res.data.resultContent.unconfirmedCount
                        })
                    }
                }
            })
        }
    }
})
