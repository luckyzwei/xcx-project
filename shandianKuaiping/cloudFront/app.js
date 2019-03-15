//app.js
const util = require("utils/util.js")
const wxRequest = require('utils/wxRequest');
const ald = require('./utils/ald-stat.js')
const API = require('/utils/config.js');
const dd = require('./utils/md-app.js')



import {getUnionId} from '/utils/api';
import {onLogin,getAccessToken} from '/utils/AuthProvider';

App({
    onLaunch: function () {
      console.log(dd);
        // 获取用户信息
        wx.getSetting({
            success(res){
                "use strict";
                if(res.authSetting["scope.userInfo"]){

                }
            }
        });

        if (!wx.getStorageSync('unionid')) {
            // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
            console.log('获取用户头像');
            // wx.getUserInfo({
            //     success: res => {
            //         // 可以将 res 发送给后台解码出 unionId
            //         // console.log(res.userInfo);
            //         this.globalData.userInfo = res.userInfo

            //         // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
            //         // 所以此处加入 callback 以防止这种情况
            //         if (this.userInfoReadyCallback) {
            //             this.userInfoReadyCallback(res)
            //         }
            //     }
            // })
        }
    },
    
    globalData: {
        userInfo: null,
       G_SDK:dd
    },
    // 全局获取用户信息
    getUserInfoAll: function (res, callback) {
        let _this = this;
        console.log('---获取用户信息---');
        console.log(res);
        console.log('----------');
        if (res.detail.errMsg == 'getUserInfo:fail auth deny') {
            wx.showModal({
                title: '用户授权',
                content: '本小程序需用户授权，请重新点击按钮授权。',
                mask: true,
                confirmColor: '#F45C43',
                success: function (res) {
                }
            })
        } else if (res.detail.errMsg == 'getUserInfo:ok') {
            let userInfo = res.detail.userInfo;
            _this.globalData.userInfo = userInfo;
            wx.setStorageSync('userinfo', userInfo);
            
            _this.wxLogin(res.detail.encryptedData, res.detail.iv)
            callback({
                userInfo: userInfo,
                hasUserInfo: true,
            });
        }
    },
    wxLogin: function (encryptedData, iv) {
        wx.login({
            success: function (result) {
                // body...
              console.log('wx_login_success')
                if (result.code) {
                    let params ={
                        query:{
                            appid: API.APP_ID,
                            code: result.code,
                            encryptedData: encryptedData,
                            iv: iv,
                            type:12
                        },
                        method:'POST'
                    } ;
                    getUnionId(params).then(res => {
                        "use strict";
                        // console.log()
                        if (res.resultCode === '100') {
                            let openid = res.resultContent.openId;
                            let unionid = res.resultContent.unionId;
                            wx.setStorageSync('openid', openid);
                            wx.setStorageSync('unionid', unionid);
                            wx.setStorageSync('tips', true)
                            onLogin();
                        } else {
                            console.log("鉴权接口报错，恒恒")
                        }
                    })
                }
            }
        })
    },
    getGlobalDatas: function (canIUse, callback) {
     
        let _this = this;
        let userinfos = wx.getStorageSync('userinfo');
        if (userinfos.hasOwnProperty('nickName')) {
            callback({
                userInfo: userinfos,
                hasUserInfo: true
            });
        } else {
            if (_this.globalData.userInfo) {
                callback({
                    userInfo: _this.globalData.userInfo,
                    hasUserInfo: true
                });
                return;
            } else if (canIUse) {
                _this.userInfoReadyCallback = res => {
                    "use strict";
                    callback({
                        userInfo: res.userInfo,
                        hasUserInfo: true
                    });
                    return;
                }
            } else if (!canIUse) {
                wx.showModal({ // 向用户提示升级至最新版微信。
                    title: '提示',
                    confirmColor: '#F45C43',
                    content: '微信版本过低，请升级至最新版。',
                    mask: true
                })
                return;
            } else {
              
                // 在没有 open-type=getUserInfo 版本的兼容处理
                wx.getUserInfo({
                    success: res => {
                        _this.globalData.userInfo = res.userInfo;
                        callback({
                            userInfo: res.userInfo,
                            hasUserInfo: true
                        });
                        return;
                    }
                })
            }
            callback({
                userInfo: null,
                hasUserInfo: false
            })
        }
    }
})