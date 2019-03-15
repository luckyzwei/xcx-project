//index.js
//获取应用实例
const app = getApp()
const util = require("../../utils/util.js")
const API = require('../../utils/api.js')
Page({
    data: {
        userInfo: {},
        hasUserInfo: true,
        canIUse: wx.canIUse('button.open-type.getUserInfo'),
        swiperList: [{}, {}],
        canGet: true, //可领取
        signed: false, //签到
        signTip: false,
        inviterId: 0, //被分享人的unionID
        showSwiper: false, //loading完前隐藏白板内容
        userTaskId: null,
        noList: true, //没有任务
        loadingData: true
    },
    onLoad: function (options) {
        console.log(options)
        let self = this
        if (options.hasOwnProperty('unionId')) {
            self.setData({
                inviterId: options.unionId
            })
            app.globalData.inviterId = options.unionId
        }
        //调用应用实例的方法获取全局数据
        util.globalDatas(app, self);
        let unionId = wx.getStorageSync('unionid')
        if(!(unionId)){
            self.setData({
                hasUserInfo: false
            })
            wx.setStorageSync('userinfo',{})
        }
        // 查询是否填表
        console.log('onLoad-globalData-addUser:' + app.globalData.addUser)

    },
    onShow: function () {
        let self = this
        if (self.data.hasUserInfo) {
            // 查询任务列表
            console.log('onshow')
            self.userData();
        }
    },
    formUserCenter: function (e) {
        console.log(e.detail.formId)
        let formId = e.detail.formId
        util.getFormId(formId, app)
        wx.navigateTo({
            url: '/pages/userCenter/userCenter'
        })
    },
    formHistory: function (e) {
        console.log('formHistory:')
        console.log(e.detail.formId)
        let formId = e.detail.formId
        util.getFormId(formId, app)

        wx.navigateTo({
            url: '/pages/index/history/history'
        })
    },
    liziChange: function (e) {
        console.log(e.detail.formId)
        let formId = e.detail.formId
        util.getFormId(formId, app)

        // util.showModal('敬请期待', '该功能即将上线~')
        wx.navigateTo({
            url: '/pages/integralStore/integralStore'
        })
    },
    userData: function () {
        console.log('userData')
        let self = this
        //用户列表任务
        app.fetchToken(API.TaskLists, 'GET', '', (err, res) => {
            if (res.resultCode == '100') {
                if (!res.resultContent.isActive) {
                    console.log('用户未输入完整资料或未点立即加入激活')
                    wx.redirectTo({
                        url: '/pages/index/applyInfo/applyInfo?route=' + 'index' + '&inviterId=' + self.data.inviterId
                    })
                }
                self.setData({
                    swiperList: res.resultContent.info,
                    showSwiper: true,
                    noList: false
                })
                if (res.resultContent.info == null || res.resultContent.info.length == 0) {
                    self.setData({
                        noList: true,
                        loadingData: false
                    })
                    console.log('res.info==null+noList:' + self.data.noList)
                }
            } else {
                // util.showModal('加载失败', '网络不好，再试试咯~')
                self.setData({
                    noList: true,
                    loadingData: false,
                    showSwiper: false
                })
                // 查询用户是否填表,拿token请求数据
                console.log('查询用户是否填表,code为02529011')
                app.fetchToken(API.searchUser, 'GET', '', (err, res) => {
                    if (res.resultCode == '02529011') {
                        wx.redirectTo({
                            url: '/pages/index/applyInfo/applyInfo?route=' + 'index' + '&inviterId=' + self.data.inviterId
                        })
                    }
                })
            }
            // 查询用户是否签到
            app.fetchToken(API.ifSign, 'GET', '', (err, res) => {
                console.log('查询用户是否签到')
                if (res.resultCode == '01529019') {
                    self.setData({
                        signTip: true
                    })
                }
            })
        })
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
                userName: userinfo.nickName,
                hasUserInfo: true,
                encryptedData: e.detail.encryptedData,
                iv: e.detail.iv
            })
            wx.setStorageSync('userinfo', userinfo)
            util.login(self.data.encryptedData, self.data.iv, self)
        }
    },
    indexGetToken: function (url) {
        util.waitShow();
        let self = this
        console.log('→indexGetToken获取token开始/n', url);
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
                //用户列表任务
                self.userData()

            },
            fail(e) {
                console.log(e, '→获取token失败');
            }
        });
    },
    signIn: function (e) {
        console.log(e.detail.formId)
        let formId = e.detail.formId
        let self = this
        util.getFormId(formId, app)

        app.fetchToken(API.signIn, 'GET', '', (err, res) => {
            if (res.resultCode == '100') {
                self.setData({
                    signed: true,
                    signTip: true
                })
                wx.setNavigationBarColor({
                    frontColor: '#ffffff',
                    backgroundColor: '#8C3838'
                })
                setTimeout(function () {
                    self.setData({
                        signed: false
                    })
                    wx.setNavigationBarColor({
                        frontColor: '#ffffff',
                        backgroundColor: '#FF6666'
                    })
                }.bind(self), 2000)
            } else if (res.resultCode == '02529014') {
                self.setData({
                    signTip: true
                })
                util.showModal('签到失败', '您今天已经签过了~')
            } else {
                util.showModal('签到失败', '网络不好，稍后再试试咯~')
            }
        })
    },
    editUserInfo: function (e) {
        console.log(e.detail.formId)
        let formId = e.detail.formId
        util.getFormId(formId, app)

        console.log('inviterId:' + this.data.inviterId)
        wx.navigateTo({
            url: '../../pages/index/applyInfo/applyInfo?route=edit' + '&inviterId=' + this.data.inviterId
        })
    },
    liziRule: function (e) {
        console.log(e.detail.formId)
        let formId = e.detail.formId
        util.getFormId(formId, app)

        wx.navigateTo({
            url: '../../pages/index/rule/rule'
        })
    },
    toGetTask: function (e) {
        console.log(e)
        console.log(e.currentTarget.dataset.id)
        let currentId = e.currentTarget.dataset.id
        let active = e.currentTarget.dataset.active
        let operateGuide = e.currentTarget.dataset.operate
        let submitComment = e.currentTarget.dataset.submitcomment
        let userTaskId = e.currentTarget.dataset.userid //userTaskId提交任务
        console.log('submitTask' + submitComment)

        wx.navigateTo({
            url: '../../pages/taskDetail/taskDetail?currenId=' + currentId + "&active=" + active + "&userTaskId=" + userTaskId + '&operateGuide=' + operateGuide + '&submitComment=' + submitComment
        })
    },
    toSubmitTask: function (e) {
        console.log(e, 1212121)
        let shareTip = e.currentTarget.dataset.item
        let submitComment = e.currentTarget.dataset.submitcomment
        let userTaskId = e.currentTarget.dataset.userid;

        console.log('submitTask' + submitComment)
        console.log('userTaskId' + userTaskId)
        console.log('shareTip' + shareTip)
        wx.navigateTo({
            url: '../../pages/taskDetail/submitTask/submitTask?shareTip=' + shareTip + '&userTaskId=' + userTaskId + '&submitComment=' + submitComment
        })
    },
    swiperChange: function (e) {
        // console.log(e.detail)
        let self = this
        let itemList = e.detail.currentItemId
        let itemBox = self.data.swiperList

    },
    swiperFinish: function (e) {
        let self = this
        let itemList = e.detail.currentItemId
        let itemBox = self.data.swiperList

    },
    onShareAppMessage(options) {
        let unionId = wx.getStorageSync('unionid')

        var titles = '加入闺蜜团和千万妈妈一起分享育儿经验';
        var paths = '/pages/index/index?unionId=' + unionId;
        var urls = '/images/share.png'
        return app.shareIndex(titles, paths, urls)
    }
})