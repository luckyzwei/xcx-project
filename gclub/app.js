//app.js
import { get_unionId } from './utils/config'
const API = require('./utils/api.js');
App({
  onShow: function (options){
    console.log(options, 'show')
    if (options && options.scene == 1044) {//带shareTicket的小程序消息卡片
      self.globalData.shareTicket = options.shareTicket;//存储shareTicket
    }
  },
  onLaunch: function (options) {
    let self =this
    self.setHeaderHeight();//获取自定义高度
  },
  globalData: {
    userInfo: null,
    shareTicket:'',
    openGid: ''
  },
  setHeaderHeight:function(){
    const vm = this
    // let totalTopHeightSet = {
    //   'iPhone': 64,
    //   'iPhone X': 88,
    //   'android': 68
    // }
    wx.getSystemInfo({
      success: function (res) {
        // console.log(res, 'res')
        let totalTopHeight = 68
        if (res.model.indexOf('iPhone X') !== -1 || res.model.indexOf('unknown') != -1) {
          totalTopHeight = 88
        } else if (res.model.indexOf('iPhone') !== -1) {
          totalTopHeight = 64
        }

        vm.globalData.statusBarHeight = res.statusBarHeight
        vm.globalData.titleBarHeight = totalTopHeight - res.statusBarHeight
      },
      failure() {
        vm.globalData.statusBarHeight = 0
        vm.globalData.titleBarHeight = 0
      }
    })
  },
  // 全局获取用户信息
  getUserInfoAll: function (res, callback) {
    let _this = this;
    console.log(res,'---获取用户信息---');
    if (res.detail.errMsg == 'getUserInfo:fail auth deny') {
      wx.showModal({
        title: '用户授权',
        content: '本小程序需用户授权，请重新点击按钮授权。',
        mask: true,
        confirmColor: '#2ABE76',
        success: function (res) {
        }
      })
    } else if (res.detail.errMsg == 'getUserInfo:ok') {
      let userInfo = res.detail.userInfo;
      _this.globalData.userInfo = userInfo;
      wx.setStorageSync('user_info', userInfo); //存储用户信息
      _this.wxLogin(res.detail.encryptedData, res.detail.iv);
      callback({
        userInfo: userInfo,
        hasUserInfo: true,
      });
    }
  },
  //获取ShareTiket
  getShareTiket:function(){
    let that = this
    if(that.globalData.shareTicket){
      wx.getShareInfo({
        shareTicket: that.globalData.shareTicket,
        success: function (res) {
          console.log(res, 'getShareInfo')
          if(res.code)
            wx.login({
              success:function(res){
                let params = {
                  app_id: API.APP_ID,
                  code:res.code,
                  encrypted_data: res.encryptedData,
                  iv: res.iv
                };
                //获取openGid
                // get_unionId(params).then(res => {
                //   "use strict";
                //   if (res.code === 1200) {
                //     that.globalData.openGid = res.data.openGId
                //     typeof cb == 'function' && cb(that.globalData)
                //   } else {
                //     console.log("获取unionid报错")
                //   }
                // })
              },
              fail:function(err){
                console.log('getShareTiket---err' + JSON.stringify(err))
              }
            })

        }
      })
    } else {
      console.log('不存在shareTicket')
    }
   
  },
  //微信授权登录，拿token
  wxLogin: function (encryptedData, iv) {
    wx.login({
      success: function (res) {
        console.log(res, 'wx_login_success')
        if (res.code) {
          let params = {
            app_id: API.APP_ID,
            code: res.code,
            encrypted_data: encryptedData,
            iv: iv,
            type: 20
          };
          // console.log(params, 'params')
          get_unionId(params).then(res => {
            "use strict";
            if (res.code === 1200) {
              //存储unionid等
              let unionId = res.data.unionid;
              wx.setStorageSync('union_id', unionId)
            } else {
              console.log("获取unionid报错")
            }
          })
        }
      },
      fail: function (req) {
        console.log(req, 'fail')
      }
    })
  },
})