const API = require('/api.js')
const app = getApp()


const formatTime = date => {
    const year = date.getFullYear()
    const month = date.getMonth() + 1
    const day = date.getDate()
    const hour = date.getHours()
    const minute = date.getMinutes()
    const second = date.getSeconds()

    // return [year, month, day].map(formatNumber).join('/') + ' ' + [hour, minute, second].map(formatNumber).join(':')
    return [year, month, day].map(formatNumber).join('/')

}

var delayed30s = function(access_token, refresh_token, expires_in) {
    var date = new Date();
    var dt = date.getTime() + (expires_in - 30) * 1000;
    wx.setStorageSync('access_token', access_token);
    wx.setStorageSync('refresh_token', refresh_token);
    wx.setStorageSync('expires_in', dt);

}

const formatNumber = n => {
    n = n.toString()
    return n[1] ? n : '0' + n
}
// 等待提示
var waitShow = function() {
    wx.showLoading({
        title: '加载中',
        icon: 'loading',
        mask: true
    })
}
// 失败提示
var failShow = function() {
    wx.showToast({
        title: '加载失败',
        icon: '/images/wrong.png',
        duration: 2000
    })
}
var waitHide = function() {
    wx.hideLoading()
}
var showModal = function(title, content) {
    wx.showModal({
        title: title,
        content: content,
        mask: true,
        confirmColor: '#FF6666',
        confirmText: '知道了',
        showCancel: false
    })
}
var modalCallback=function(title,content,confirmText,data){
    wx.showModal({
        title: title,
        content: content,
        mask: true,
        confirmColor: '#FF6666',
        confirmText: confirmText,
        showCancel: false,
        success:(res)=>{
          if (res.confirm) {
            wx.setClipboardData({
              data: data,
              success: res=>{
                 // console.log(res)
                 successShowText('复制成功')
              }
            })
          }
        }
      })
}
var login = function(encryptedData, iv, self) {
    waitShow()
    wx.login({
        success: function(res) {
            console.log(res)
            if (res.code) {
                wx.request({
                    url: API.authLogin,
                    data: { appid: API.APP_ID, code: res.code, encryptedData: encryptedData, iv: iv },
                    method: 'post',
                    header: {},
                    success: function(res) {
                        waitHide();                      
                        if(res.data.resultCode!=='100'){
                            console.log(res.data.resultCode)
                            showModal('加载失败','网络不好，您稍后再试试吧~')
                        }
                        console.log(res)
                        let openid = res.data.resultContent ? res.data.resultContent.openId : '';
                        let unionid = res.data.resultContent ? res.data.resultContent.unionId : '';
                        console.log("get unionID" + unionid)
                        if (openid && unionid) {
                            wx.setStorageSync('openid', openid); //存储openid  
                            wx.setStorageSync('unionid', unionid); //unionid  
                            self.indexGetToken(API.getToken + 'unionid_' + unionid + '_type_2');
                        }
                    },
                    fail: function(e) {
                        // fail
                        console.log(e)
                        console.log('!res.fail')

                    }
                })
            }
        },
        fail: function(res) {
            console.log("login failed")
        },
        complete: function(res) {
            // complete
        }
    })
}

// 成功提示
var successShowText = function(text) {
    wx.showToast({
        title: text,
        icon: 'success',
        duration: 3000
    })
}
// 采集formID
var getFormId=function(id,app){
    console.log(id)
        let openId = wx.getStorageSync('openid')
        let apiUrl=API.formId + id+'&openId='+openId
        if (app.globalData.submitFormId !== 1) {
            console.log('submitFormId')
            app.fetchToken(apiUrl, 'GET', '', (err, res) => {
                if (res.resultCode == '444')
                    app.globalData.submitFormId = 1
            })
        }
}
//调用应用实例的方法获取全局数据
var globalDatas = function(app, that) {
    that.setData({
        hasUserInfo: false
    })
    let userinfos = wx.getStorageSync('userinfo')
    if (userinfos.hasOwnProperty('nickName')) {
        console.log(userinfos)
        that.setData({
            userInfo: userinfos,
            hasUserInfo: true
        })
    } else {
        console.log('globalData userInfo')
        if (app.globalData.userInfo) {
            that.setData({
                userInfo: app.globalData.userInfo,
                hasUserInfo: true
            })
        } else if (that.data.canIUse) {
            // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
            // 所以此处加入 callback 以防止这种情况
            app.userInfoReadyCallback = res => {
                that.setData({
                    userInfo: res.userInfo,
                    hasUserInfo: true
                })
            }
        } else if (!that.data.canIUse) {
            console.log("low version")
            wx.showModal({ // 向用户提示升级至最新版微信。
                title: '提示',
                confirmColor: '#F45C43',
                content: '微信版本过低，请升级至最新版。',
                mask: true
            })
        } else {
            // 在没有 open-type=getUserInfo 版本的兼容处理
            wx.getUserInfo({
                success: res => {
                    app.globalData.userInfo = res.userInfo
                    that.setData({
                        userInfo: res.userInfo,
                        hasUserInfo: true
                    })
                    console.log(success)
                }
            })
        }
    }
}
/** 
 *字符串转json 
 */
var jsonToString = function(data) {
    return JSON.stringify(data);
}
module.exports = {
    formatTime: formatTime,
    waitShow: waitShow,
    waitHide: waitHide,
    delayed30s: delayed30s,
    login: login,
    globalDatas: globalDatas,
    failShow: failShow,
    showModal: showModal,
    successShowText: successShowText,
    jsonToString: jsonToString,
    getFormId:getFormId,
    modalCallback:modalCallback
}