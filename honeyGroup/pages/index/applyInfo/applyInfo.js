// pages/index/applyInfo/applyInfo.js
const app = getApp()
const util = require("../../../utils/util.js")
const API = require('../../../utils/api.js')
Page({

    /**
     * 页面的初始数据
     */
    data: {
        number: [1, 2, '三个及以上'],
        index: 3,
        userName: '', //用户名
        phone: '',
        city: '',
        enterNumber: false, //宝宝数量输入提示
        enterBirth: true,
        birthDay: '', //第一个宝宝生日
        exchangeTip: [
            { name: '育儿', checked: false },
            { name: '辅食喂养', checked: false },
            { name: '早养', checked: false },
            { name: '亲子出行', checked: false },
            { name: '母婴相关商品', checked: false }
        ],
        exchangeList: [
            { name: '社群', checked: false },
            { name: '微信推文', checked: false },
            { name: '直播', checked: false },
            { name: '母婴店', checked: false },
            { name: '商品购买', checked: false }
        ],
        showCheckGroup: true, //是否显示问卷
        firstCheckBox: null,
        secondCheckBox: null, //多选内容
        babyBirth: [],
        inviterId: null,
        userId: 0,
        inputFocus: false
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function(options) {
        console.log(options)
        let self = this
        if (options.hasOwnProperty('inviterId')) {
            self.setData({
                inviterId: options.inviterId
            })
        }
        util.waitShow()
        if (options.route == 'edit') {
            self.setData({
                showCheckGroup: false
            })
        } else if (options.route == 'index') {
            util.waitHide()
            self.setData({
                showCheckGroup: true
            })
        }
        //查询用户资料
        if (!self.data.showCheckGroup) {
            app.fetchToken(API.searchUser, 'GET', '', (err, res) => {
              util.waitHide()              
                if (res.resultCode == '100') {
                    console.log(res.resultContent)
                    self.setData({
                        enterNumber: false,
                        userName: res.resultContent.name,
                        phone: res.resultContent.phoneNumber,
                        city: res.resultContent.city,
                        userId: res.resultContent.id
                    })
                    //宝宝生日
                        console.log(res.resultContent.babyinfo)
                        let babyBirths = [{ 'birthday': res.resultContent.babyinfo[0].birthday }]
                        self.setData({
                            index: 0,
                            enterBirth: false,
                            birthDay: res.resultContent.babyinfo[0].birthday,
                            babyBirth: babyBirths
                        })
                }else{
                    console.log(res)
                    util.showModal('加载失败', '网络不好，稍后再试试咯~')
                }
            })
        }
    },

    nameInput: function(e) {
        this.setData({
            userName: e.detail.value
        })
    },
    phoneInput: function(e) {
        this.setData({
            phone: e.detail.value
        })
    },
    cityInput: function(e) {
        this.setData({
            city: e.detail.value
        })
    },
    //表单提交
    joinLadybro: function() {
        let self = this
        var phoneNum = self.data.phone;
        // var sMobile = /^1[3|4|5|6|7|8|9][0-9]\d{8}$/;
        let userinfos = wx.getStorageSync('userinfo')
        let unionId = wx.getStorageSync('unionid')
        let openid = wx.getStorageSync('openid')
        let userInfoReq = {}
        if (self.data.inviterId == 0 || self.data.inviterId == null) {
            userInfoReq = {
                "appId": "wxf9b221762a5531b7",
                "babies": self.data.babyBirth,
                "channel": self.data.firstCheckBox,
                "cityName": self.data.city,
                "content": self.data.secondCheckBox,
                "iconPath": userinfos.avatarUrl,
                "name": self.data.userName,
                "nickName": userinfos.nickName,
                "openId": openid,
                "phoneNumber": self.data.phone,
                "sourceType": "1",
                "unionId": unionId
            }
        } else {
            userInfoReq = {
                "appId": "wxf9b221762a5531b7",
                "babies": self.data.babyBirth,
                "channel": self.data.firstCheckBox,
                "cityName": self.data.city,
                "content": self.data.secondCheckBox,
                "iconPath": userinfos.avatarUrl,
                "sourceUserId": self.data.inviterId,
                "name": self.data.userName,
                "nickName": userinfos.nickName,
                "openId": openid,
                "phoneNumber": self.data.phone,
                "sourceType": "1",
                "unionId": unionId
            }
        }

        if (self.data.enterNumber || self.data.enterBirth || self.data.userName.length == 0 ||
            self.data.city.length == 0 || self.data.phone.length == 0) {
            console.log('请完整输入信息')
            util.showModal('提交失败', '请完整输入信息')
        }  else {
            if (self.data.showCheckGroup) {
                console.log('showCheckGroup')
                if (self.data.firstCheckBox == null || self.data.secondCheckBox == null || self.data.firstCheckBox.length == 0 || self.data.secondCheckBox.length == 0) {
                   console.log('nowan')
                    util.showModal('提交失败', '请完整输入信息')
                } else {
                    //新增用户
                    app.fetchToken(API.addUser, 'POST', userInfoReq, (err, res) => {
                        if (res.resultCode == '100') {
                          app.globalData.addUser='yse';
                          console.log('applyglobalData.addUser:'+app.globalData.addUser)
                            wx.redirectTo({
                                url: '/pages/index/index'
                            })
                        } else {
                            util.showModal('申请失败', '网络不好，再试试咯~')
                        }
                    })
                }
            } else {
                console.log(userInfoReq)
                //更新用户
                app.fetchToken(API.updateUser + self.data.userId, 'PUT', userInfoReq, (err, res) => {
                    if (res.resultCode == '100') {
                          app.globalData.addUser='yse';
                        wx.redirectTo({
                            url: '/pages/index/index'
                        })
                    } else {
                        util.showModal('申请失败', '网络不好，稍后再试试咯~')
                    }
                })
            }
            console.log('submiting')
        } 
    },
    bindNumberChange: function(e) {
        console.log('picker发送选择改变，携带值为', e.detail.value)
        this.setData({
            index: e.detail.value,
            enterNumber: false
        })
        console.log(this.data.babyBirth)
    },
    bindDateChange: function(e) {
        console.log(e)
        console.log('picker携带值为', e.detail.value)
        let babyBirths = [{ 'birthday': e.detail.value }]
        let self = this
        if (self.data.babyBirth.length == 0) {
            self.setData({
                birthDay: e.detail.value,
                enterBirth: false,
                babyBirth: babyBirths
            })
        } else {
            self.data.babyBirth[0]['birthday'] = e.detail.value
            self.setData({
                birthDay: e.detail.value
            })
        }
        console.log(self.data.babyBirth)

    },
    checkboxChange: function(e) {
        console.log('checkbox：', e.detail.value)
        this.setData({
            firstCheckBox: e.detail.value
        })
    },
    checkboxSecond: function(e) {
        console.log('checkbox：', e.detail.value)
        this.setData({
            secondCheckBox: e.detail.value
        })
    },
    inputFocus: function(e) {
        this.setData({
            inputFocus: true
        })
    },
    /**
     * 用户点击右上角分享
     */
    onShareAppMessage(options) {
        let unionId = wx.getStorageSync('unionid')
        var titles = '加入闺蜜团和千万妈妈一起分享育儿经验';
        var paths = '/pages/index/index?unionId=' + unionId;
        var urls = '/images/share.png'
        return app.shareIndex(titles, paths, urls)
    }
})