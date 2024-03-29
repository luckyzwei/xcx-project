let wxUploadFile = require('./uploadFile');
let AuthProvider = require('./AuthProvider');
let wxRequest = require('./wxRequest');
let API = require('./api');

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
    return {
        title: title,
        path: path,
        imageUrl: imageUrl,
        success: function (res) {
            wx.showToast({
                title: '分享成功',
                icon: 'success',
                duration: 3000
            })
        },
        complete: function (req) {
           console.log(11)
            callback(req)
        }
    }
}
/** 
 * 砍价信息提示
*/
function bargainTips(that,str){
  that.setData({
    stop: true,
    popErrorMsg: str
  });
  hideErrorTips(that);
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
    }, 2000);
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

function successShowText(str) {
    wx.showToast({
        title: str,
        icon: 'success',
        duration: 3000
    })
}

function formatZero(str) {
    return str < 10 ? '0' + str : str;
}

function formatTimes(time) {
    var hours = Math.floor(time/1000/60/60);
    console.log(hours)
    return formatZero(hours)
}
function formatTime(time, type) {
    var leave1 = time % (24 * 3600);
    var leaves= Math.floor(time / (24 * 3600));
    var hours = Math.floor(leave1 / 3600)+ leaves*24;
    //计算相差分钟数
    var leave2 = leave1 % 3600;       //计算小时数后剩余的秒数
    var minutes = Math.floor(leave2 / 60);
    //计算相差秒数
    var leave3 = leave2 % 60;
    return formatZero(hours) + ":" + formatZero(minutes) + ":" + formatZero(leave3)
}

/**
 * 上传图片得到url地址
 * @param imgUrl
 * @param callback
 */
function downloadImg(imgUrl, callback) {
    AuthProvider.getAccessToken().then(token => {
        return wxUploadFile.uploadFile(API.uploadImg, imgUrl, token);
    }).then(result => {
        let resData = JSON.parse(result.data);
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
 * 发送formid
 * @param e
 */
function formSubmit(e) {
    let params = {
        "appId": API.APP_ID,
        "formId": e.detail.formId,
        "openId": wx.getStorageSync('openid')
    };
    AuthProvider.getAccessToken().then(token => {
        wx.request({
            url: API.templateNews,
            data: params,
            method: 'POST',
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

function formSubmits(e) {
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
 * 倒计时
 * @param that
 * @param total_micro_second
 */
var count_down = function (that, total_micro_second) {
    if (total_micro_second <= 0) {
        that.setData({
            phoneText: '重新获取',
            phoneCodeState: true
        });
        // timeout则跳出递归
        return;
    }
    // 渲染倒计时时钟
    that.setData({
        phoneText: formatZero(date_format(total_micro_second)) + 's后重试',
        phoneCodeState: false
    });
    setTimeout(function () {
        // 放在最后--
        total_micro_second -= 10;
        count_down(that, total_micro_second);
    }, 10)
}

// 时间格式化输出，如03:25:19 86。每10ms都会调用一次
var date_format = function (micro_second) {
    // 秒数
    var second = Math.floor(micro_second / 1000);
    // 小时位
    var hr = Math.floor(second / 3600);
    // 分钟位
    var min = Math.floor((second - hr * 3600) / 60);
    // 秒位
    var sec = (second - hr * 3600 - min * 60); // equal to => var sec = second % 60;
    // 毫秒位，保留2位
    var micro_sec = Math.floor((micro_second % 1000) / 10);
    return sec;
}
/**
 * 时间格式化
 */
var DateFuc = {
    getDate: function (time) {
        if (!time) return '';
        var date = getDate(parseInt(time));
        var year = date.getFullYear()
        var month = date.getMonth() + 1
        var day = date.getDate()
        var hour = date.getHours()
        var minute = date.getMinutes()
        var second = date.getSeconds()
        return [year, month, day].map(formatNumber).join('-') + ' ' + [hour, minute].map(formatNumber).join(':')
    }
}
/**
 * 补零
 */
var formatNumber = function (n) {
    n = n.toString()
    return n[1] ? n : '0' + n
}

/**
 * 验证手机号码
 * @param str
 * @returns {boolean}
 */
function verifyPhone(str) {
    let myreg = /^[1][3,4,5,6,7,8,9][0-9]{9}$/;
    return myreg.test(str);
}

// 初始化时间
function newDate() {
    let date = new Date();
    var year = date.getFullYear()
    var month = date.getMonth() + 1
    var day = date.getDate()
    return [year, month, day].map(formatNumber).join('-')
}
function newTime() {
    let date = new Date();
    var hour = date.getHours()
    var minute = date.getMinutes()
    var second = date.getSeconds()
    return [hour, minute].map(formatNumber).join(':')
}
module.exports = {
    pageGo: pageGo,
    openShare: openShare,
    ErrorTips: ErrorTips,
    copyText: copyText,
    formatZero: formatZero,
    downloadImg: downloadImg,
    successShowText: successShowText,
    getOpenId: getOpenId,
    formatTime: formatTime,
    formSubmit: formSubmit,
    formSubmits: formSubmits,
    count_down: count_down,
    formatDate: DateFuc.getDate,
    verifyPhone: verifyPhone,
    newDate: newDate,
    newTime: newTime,
    bargainTips: bargainTips,
    formatTimes:formatTimes
};
