let wxUploadFile = require('./uploadFile');
let AuthProvider = require('./AuthProvider');
let wxRequest = require('./wxRequest');
const API = require('./config');
import {uploadFile} from './api';


// 页面跳转数据字典
// 1:navigate  保留当前页面，跳转到应用内的某个页面，使用wx.navigateBack可以返回到原页面  可加参数
// 2:redirectTo 关闭当前页面，跳转到应用内的某个页面。 可加参数
// 3:reLaunch 关闭所有页面，打开到应用内的某个页面。 可加参数
// 4:switchTab 跳转到 tabBar 页面，并关闭其他所有非 tabBar 页面  不可加参数
// 5:navigateBack 关闭当前页面，返回上一页面或多级页面。可通过 getCurrentPages()) 获取当前的页面栈，决定需要返回几层
/**
 * 页面跳转函数
 * @param path 跳转路径 部分可携带参数
 * @param type 跳转类型
 * @param num 是否为返回上级
 */
function pageGo(path, type, num) {
    if (num) {
        wx.navigateBack({
            delta: path
        })
    } else {
        switch (type) {
            case 1:
                wx.navigateTo({
                    url: path
                });
                break;
            case 2:
                wx.redirectTo({
                    url: path
                });
                break;
            case 3:
                wx.reLaunch({
                    url: path
                });
                break;
            case 4:
                wx.switchTab({
                    url: path
                });
                break;
            default:
                break
        }
    }
}

/**
 * 分享集成函数
 * @param title 分享的标题
 * @param path 分享的页面路径
 * @param imageUrl 分享出去要显示的图片
 * @param callback 分享后的回调
 * @returns {{title: *, path: *, imageUrl: *, success: success, complete: complete}}
 */
function openShare(title, path, imageUrl, callback) {
  if (imageUrl){
    return {
      title: title,
      path: path,
      imageUrl: imageUrl
    }
  }
    
}

/**
 *  错误全局提示
 * @param that
 * @param str
 * @constructor
 */
function ErrorTips(that, str) {
    that.setData({
        stop: true,
        popErrorMsg: str
    });
    hideErrorTips(that);
}

function hideErrorTips(that) {
    let fadeOutTimeout = setTimeout(() => {
        that.setData({
            popErrorMsg: null,
        });
        clearTimeout(fadeOutTimeout);
    }, 5000);
}

/**
 * 全局复制函数
 * @param str 需要复制的文字
 */
function copyText(str) {
    wx.setClipboardData({
        data: str,
        success: res => {
            console.log(res);
            successShowText('复制微信号成功')
        }
    })
}

/**
 * 上传图片得到url地址
 * @param imgUrl
 * @param callback
 */
function downloadImg(imgUrl, callback) {
    let params={
        query:imgUrl,
    };
    uploadFile(params).then(result => {
        console.log(result);
        let resData = JSON.parse(result);
        callback(resData.resultContent);
    })
}

function getOpenId(code, appid) {
    let url = API.getSmallPro + `?code=${code}&appId=${appid}`;
    wxRequest.fetch(url, null, null, 'GET').then(res => {
        "use strict";
        console.log(res);
        if (res.data.resultCode === '100') {
            wx.setStorageSync('openid', res.data.resultContent.openId);
        }
    })
}

/**
 * 发送formid 鉴权
 * @param e
 */
function formSubmitAuth(e) {
    let params = {
        "appId": API.APP_ID,
        "formId": e.detail.formId,
        "openId": wx.getStorageSync('openid')
    };
    AuthProvider.getAccessToken().then(token => {
        wx.request({
          url: API.BASE_URLs + "/article-api/authsec/article/saveFormId",
            data: params,
            method: 'PUT',
            header: {
                'Content-Type': 'application/json;charset=UTF-8',
                "Authorization": 'bearer ' + token //base64加密liz-youli-wx:secret
            },
            success: function (e) {
                console.log('发送成功')
            }
        })
    })

}

/**
 * 发送formid 非鉴权
 * @param e
 */
function formSubmitNuth(e) {
    let params = {
        "appId": API.APP_ID,
        "formId": e.detail.formId,
        "openId": wx.getStorageSync('openid')
    };
    wx.request({
        url: API.templateNew,
        data: params,
        method: 'POST',
        header: {
            'Content-Type': 'application/json;charset=UTF-8',
        },
        success: function (e) {
            console.log('发送成功')
        }
    })
}

/**
 * 时间格式化
 */
let DateFuc = {
    getDate: function (time) {
        if (!time) return '';
        let date = getDate(parseInt(time));
        let year = date.getFullYear()
        let month = date.getMonth() + 1
        let day = date.getDate()
        let hour = date.getHours()
        let minute = date.getMinutes()
        let second = date.getSeconds()
        return [year, month, day].map(formatNumber).join('-') + ' ' + [hour, minute].map(formatNumber).join(':')
    }
}
/**
 * 补零
 */
function formatNumber (n) {
    n = n.toString()
    return n[1] ? n : '0' + n
}

/**
 * 验证手机号码
 * @param str
 * @returns {boolean}
 */
function verifyPhone(str) {
    let myreg = /^[1,2][3,4,5,6,7,8,9][0-9]{9}$/;
    return myreg.test(str);
}

/**
 * 验证邮箱
 * @param str
 * @returns {boolean}
 */
function formatMoney(str) {
    let isNum = /^(([1-9][0-9]*)|(([0]\.\d{1,2}|[1-9][0-9]*\.\d{1,2})))$/;
    if (isNum.test(str)) {
        return true;
    } else {
        return false;
    }
}

// 初始化时间
function newDate() {
    let date = new Date();
    let year = date.getFullYear()
    let month = date.getMonth() + 1
    let day = date.getDate()
    return [year, month, day].map(formatNumber).join('-')
}

function newTime() {
    let date = new Date();
    let hour = date.getHours()
    let minute = date.getMinutes()
    let second = date.getSeconds()
    return [hour, minute, second].map(formatNumber).join(':')
}

function formatTime(e) {

  let date = new Date(e);
  let year = date.getFullYear()
  let month = date.getMonth() + 1
  let day = date.getDate()
  let hour = date.getHours()
  return "投票截止" + year + "年" + month + "月" + day + "日" + hour + "点"
}

function formatCommentTime(e) {
  let date = new Date(e);
  let year = date.getFullYear()
  let month = date.getMonth() + 1
  let day = date.getDate()
  let hour = date.getHours()
  let minute = date.getMinutes()
  return year + "-" + formatNumber(month) + "-" + formatNumber(day) + " " + formatNumber(hour) + ":" + formatNumber(minute)
}
function formatCommentDate(e) {
  let date = new Date(e);
  let year = date.getFullYear()
  let month = date.getMonth() + 1
  let day = date.getDate()
  return year + "-" + formatNumber(month) + "-" + formatNumber(day)
}

module.exports = {
    pageGo: pageGo,
    openShare: openShare,
    errorTips: ErrorTips,
    copyText: copyText,
    downloadImg: downloadImg,
    getOpenId: getOpenId,
    formSubmitAuth: formSubmitAuth,
    formSubmitNuth: formSubmitNuth,
    formatDate: DateFuc.getDate,
    formatNumber: formatNumber,
    verifyPhone: verifyPhone,
    formatMoney: formatMoney,
    newDate: newDate,
    newTime: newTime,
    formatTime: formatTime,
    formatCommentTime:formatCommentTime,
  formatCommentDate: formatCommentDate
}