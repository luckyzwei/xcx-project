'use strict';

var _api = require('./api.js');

var _api2 = _interopRequireDefault(_api);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var wxUploadFile = require('./uploadFile.js');
var AuthProvider = require('./AuthProvider.js');
var wxRequest = require('./wxRequest.js');


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
        });
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
                break;
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
        success: function success(res) {
            wx.showToast({
                title: '分享成功',
                icon: 'success',
                duration: 3000
            });
        },
        complete: function complete(req) {
            callback(req);
        }
    };
}

/**
 *  错误全局提示
 * @param that
 * @param str
 * @constructor
 */
function ErrorTips(that, str) {
    that.stop = true;
    that.popErrorMsg = str;
    hideErrorTips(that);
}

function hideErrorTips(that) {
    var fadeOutTimeout = setTimeout(function () {
        that.popErrorMsg = null;
        that.$apply();
        clearTimeout(fadeOutTimeout);
    }, 3000);
}

/**
 * 全局复制函数
 * @param str 需要复制的文字
 */
function copyText(str) {
    wx.setClipboardData({
        data: str,
        success: function success(res) {
            console.log(res);
            successShowText('复制微信号成功');
        }
    });
}

function successShowText(str) {
    wx.showToast({
        title: str,
        icon: 'success',
        duration: 3000
    });
}

function formatZero(str) {
    return str < 10 ? '0' + str : str;
}

function formatTime(time, type) {
    var leave1 = time % (24 * 3600);
    var hours = Math.floor(leave1 / 3600);
    //计算相差分钟数  
    var leave2 = leave1 % 3600; //计算小时数后剩余的秒数  
    var minutes = Math.floor(leave2 / 60);
    //计算相差秒数  
    var leave3 = leave2 % 60;
    var seconds = leave3;
    return formatZero(hours) + ":" + formatZero(minutes) + ":" + formatZero(seconds);
}

/**
 * 上传图片得到url地址
 * @param imgUrl
 * @param callback
 */
function downloadImg(imgUrl, callback) {
    AuthProvider.getAccessToken().then(function (token) {
        return wxUploadFile.uploadFile(_api2.default.uploadImg, imgUrl, token);
    }).then(function (result) {
        var resData = JSON.parse(result.data);
        callback(resData.resultContent);
    });
}

function getOpenId(code, appid) {
    var url = _api2.default.getSmallPro + ('?code=' + code + '&appId=' + appid);
    wxRequest.fetch(url, null, null, 'GET').then(function (res) {
        "use strict";

        console.log(res);
        if (res.data.resultCode === '100') {
            wx.setStorageSync('openid', res.data.resultContent.openId);
        }
    });
}

/**
 * 发送formid
 * @param e
 */
function formSubmit(e) {
    var params = {
        "appId": _api2.default.APP_ID,
        "formId": e.detail.formId,
        "openId": wx.getStorageSync('openid')
    };
    AuthProvider.getAccessToken().then(function (token) {
        wx.request({
            url: _api2.default.templateNews,
            data: params,
            method: 'POST',
            header: {
                'Content-Type': 'application/json;charset=UTF-8',
                "Authorization": 'bearer ' + token //base64加密liz-youli-wx:secret
            },
            success: function success(e) {
                console.log('发送成功');
            }
        });
    });
}

/**
 * 倒计时
 * @param that
 * @param total_micro_second
 */
var count_down = function count_down(that, total_micro_second) {
    if (total_micro_second <= 0) {
        that.phoneText = '重新获取';
        that.phoneCodeState = true;
        that.$apply();
        // timeout则跳出递归
        return;
    }
    // 渲染倒计时时钟
    that.phoneText = formatZero(date_format(total_micro_second)) + 's后重试';
    that.phoneCodeState = false;
    that.$apply();
    setTimeout(function () {
        // 放在最后--
        total_micro_second -= 10;
        count_down(that, total_micro_second);
    }, 10);
};

// 时间格式化输出，如03:25:19 86。每10ms都会调用一次
var date_format = function date_format(micro_second) {
    // 秒数
    var second = Math.floor(micro_second / 1000);
    // 小时位
    var hr = Math.floor(second / 3600);
    // 分钟位
    var min = Math.floor((second - hr * 3600) / 60);
    // 秒位
    var sec = second - hr * 3600 - min * 60; // equal to => var sec = second % 60;
    // 毫秒位，保留2位
    var micro_sec = Math.floor(micro_second % 1000 / 10);
    return sec;
};

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
    count_down: count_down
};
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInV0aWwuanMiXSwibmFtZXMiOlsid3hVcGxvYWRGaWxlIiwicmVxdWlyZSIsIkF1dGhQcm92aWRlciIsInd4UmVxdWVzdCIsInBhZ2VHbyIsInBhdGgiLCJ0eXBlIiwibnVtIiwid3giLCJuYXZpZ2F0ZUJhY2siLCJkZWx0YSIsIm5hdmlnYXRlVG8iLCJ1cmwiLCJyZWRpcmVjdFRvIiwicmVMYXVuY2giLCJzd2l0Y2hUYWIiLCJvcGVuU2hhcmUiLCJ0aXRsZSIsImltYWdlVXJsIiwiY2FsbGJhY2siLCJzdWNjZXNzIiwicmVzIiwic2hvd1RvYXN0IiwiaWNvbiIsImR1cmF0aW9uIiwiY29tcGxldGUiLCJyZXEiLCJFcnJvclRpcHMiLCJ0aGF0Iiwic3RyIiwic3RvcCIsInBvcEVycm9yTXNnIiwiaGlkZUVycm9yVGlwcyIsImZhZGVPdXRUaW1lb3V0Iiwic2V0VGltZW91dCIsIiRhcHBseSIsImNsZWFyVGltZW91dCIsImNvcHlUZXh0Iiwic2V0Q2xpcGJvYXJkRGF0YSIsImRhdGEiLCJjb25zb2xlIiwibG9nIiwic3VjY2Vzc1Nob3dUZXh0IiwiZm9ybWF0WmVybyIsImZvcm1hdFRpbWUiLCJ0aW1lIiwibGVhdmUxIiwiaG91cnMiLCJNYXRoIiwiZmxvb3IiLCJsZWF2ZTIiLCJtaW51dGVzIiwibGVhdmUzIiwic2Vjb25kcyIsImRvd25sb2FkSW1nIiwiaW1nVXJsIiwiZ2V0QWNjZXNzVG9rZW4iLCJ0aGVuIiwidXBsb2FkRmlsZSIsIkFQSSIsInVwbG9hZEltZyIsInRva2VuIiwicmVzRGF0YSIsIkpTT04iLCJwYXJzZSIsInJlc3VsdCIsInJlc3VsdENvbnRlbnQiLCJnZXRPcGVuSWQiLCJjb2RlIiwiYXBwaWQiLCJnZXRTbWFsbFBybyIsImZldGNoIiwicmVzdWx0Q29kZSIsInNldFN0b3JhZ2VTeW5jIiwib3BlbklkIiwiZm9ybVN1Ym1pdCIsImUiLCJwYXJhbXMiLCJBUFBfSUQiLCJkZXRhaWwiLCJmb3JtSWQiLCJnZXRTdG9yYWdlU3luYyIsInJlcXVlc3QiLCJ0ZW1wbGF0ZU5ld3MiLCJtZXRob2QiLCJoZWFkZXIiLCJjb3VudF9kb3duIiwidG90YWxfbWljcm9fc2Vjb25kIiwicGhvbmVUZXh0IiwicGhvbmVDb2RlU3RhdGUiLCJkYXRlX2Zvcm1hdCIsIm1pY3JvX3NlY29uZCIsInNlY29uZCIsImhyIiwibWluIiwic2VjIiwibWljcm9fc2VjIiwibW9kdWxlIiwiZXhwb3J0cyJdLCJtYXBwaW5ncyI6Ijs7QUFHQTs7Ozs7O0FBSEEsSUFBSUEsZUFBZUMsUUFBUSxjQUFSLENBQW5CO0FBQ0EsSUFBSUMsZUFBZUQsUUFBUSxnQkFBUixDQUFuQjtBQUNBLElBQUlFLFlBQVlGLFFBQVEsYUFBUixDQUFoQjs7O0FBR0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7Ozs7OztBQU1BLFNBQVNHLE1BQVQsQ0FBZ0JDLElBQWhCLEVBQXNCQyxJQUF0QixFQUE0QkMsR0FBNUIsRUFBaUM7QUFDN0IsUUFBSUEsR0FBSixFQUFTO0FBQ0xDLFdBQUdDLFlBQUgsQ0FBZ0I7QUFDWkMsbUJBQU9MO0FBREssU0FBaEI7QUFHSCxLQUpELE1BSU87QUFDSCxnQkFBUUMsSUFBUjtBQUNJLGlCQUFLLENBQUw7QUFDSUUsbUJBQUdHLFVBQUgsQ0FBYztBQUNWQyx5QkFBS1A7QUFESyxpQkFBZDtBQUdBO0FBQ0osaUJBQUssQ0FBTDtBQUNJRyxtQkFBR0ssVUFBSCxDQUFjO0FBQ1ZELHlCQUFLUDtBQURLLGlCQUFkO0FBR0E7QUFDSixpQkFBSyxDQUFMO0FBQ0lHLG1CQUFHTSxRQUFILENBQVk7QUFDUkYseUJBQUtQO0FBREcsaUJBQVo7QUFHQTtBQUNKLGlCQUFLLENBQUw7QUFDSUcsbUJBQUdPLFNBQUgsQ0FBYTtBQUNUSCx5QkFBS1A7QUFESSxpQkFBYjtBQUdBO0FBQ0o7QUFDSTtBQXRCUjtBQXdCSDtBQUNKOztBQUVEOzs7Ozs7OztBQVFBLFNBQVNXLFNBQVQsQ0FBbUJDLEtBQW5CLEVBQTBCWixJQUExQixFQUFnQ2EsUUFBaEMsRUFBMENDLFFBQTFDLEVB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O0FBQ0Q7QUFDQVAsU0FBSzRELFNBQUwsR0FBaUI3QyxXQUFXK0MsWUFBWUgsa0JBQVosQ0FBWCxJQUE4QyxNQUEvRDtBQUNBM0QsU0FBSzZELGNBQUwsR0FBc0IsS0FBdEI7QUFDQTdELFNBQUtPLE1BQUw7QUFDQUQsZUFBVyxZQUFZO0FBQ25CO0FBQ0FxRCw4QkFBc0IsRUFBdEI7QUFDQUQsbUJBQVcxRCxJQUFYLEVBQWlCMkQsa0JBQWpCO0FBQ0gsS0FKRCxFQUlHLEVBSkg7QUFLSCxDQWpCRDs7QUFtQkE7QUFDQSxJQUFJRyxjQUFjLFNBQWRBLFdBQWMsQ0FBVUMsWUFBVixFQUF3QjtBQUN0QztBQUNBLFFBQUlDLFNBQVM1QyxLQUFLQyxLQUFMLENBQVcwQyxlQUFlLElBQTFCLENBQWI7QUFDQTtBQUNBLFFBQUlFLEtBQUs3QyxLQUFLQyxLQUFMLENBQVcyQyxTQUFTLElBQXBCLENBQVQ7QUFDQTtBQUNBLFFBQUlFLE1BQU05QyxLQUFLQyxLQUFMLENBQVcsQ0FBQzJDLFNBQVNDLEtBQUssSUFBZixJQUF1QixFQUFsQyxDQUFWO0FBQ0E7QUFDQSxRQUFJRSxNQUFPSCxTQUFTQyxLQUFLLElBQWQsR0FBcUJDLE1BQU0sRUFBdEMsQ0FSc0MsQ0FRSztBQUMzQztBQUNBLFFBQUlFLFlBQVloRCxLQUFLQyxLQUFMLENBQVkwQyxlQUFlLElBQWhCLEdBQXdCLEVBQW5DLENBQWhCO0FBQ0EsV0FBT0ksR0FBUDtBQUNILENBWkQ7O0FBY0FFLE9BQU9DLE9BQVAsR0FBaUI7QUFDYjlGLGtCQURhO0FBRWJZLHdCQUZhO0FBR2JXLHdCQUhhO0FBSWJVLHNCQUphO0FBS2JNLDBCQUxhO0FBTWJXLDRCQU5hO0FBT2JaLG9DQVBhO0FBUWJ5Qix3QkFSYTtBQVNidkIsMEJBVGE7QUFVYitCLDBCQVZhO0FBV2JXO0FBWGEsQ0FBakIiLCJmaWxlIjoidXRpbC5qcyIsInNvdXJjZXNDb250ZW50IjpbImxldCB3eFVwbG9hZEZpbGUgPSByZXF1aXJlKCcuL3VwbG9hZEZpbGUnKTtcbmxldCBBdXRoUHJvdmlkZXIgPSByZXF1aXJlKCcuL0F1dGhQcm92aWRlcicpO1xubGV0IHd4UmVxdWVzdCA9IHJlcXVpcmUoJy4vd3hSZXF1ZXN0Jyk7XG5pbXBvcnQgQVBJIGZyb20gJy4vYXBpJztcblxuLy8g6aG16Z2i6Lez6L2s5pWw5o2u5a2X5YW4XG4vLyAxOm5hdmlnYXRlICDkv53nlZnlvZPliY3pobXpnaLvvIzot7PovazliLDlupTnlKjlhoXnmoTmn5DkuKrpobXpnaLvvIzkvb/nlKh3eC5uYXZpZ2F0ZUJhY2vlj6/ku6Xov5Tlm57liLDljp/pobXpnaIgIOWPr+WKoOWPguaVsFxuLy8gMjpyZWRpcmVjdFRvIOWFs+mXreW9k+WJjemhtemdou+8jOi3s+i9rOWIsOW6lOeUqOWGheeahOafkOS4qumhtemdouOAgiDlj6/liqDlj4LmlbBcbi8vIDM6cmVMYXVuY2gg5YWz6Zet5omA5pyJ6aG16Z2i77yM5omT5byA5Yiw5bqU55So5YaF55qE5p+Q5Liq6aG16Z2i44CCIOWPr+WKoOWPguaVsFxuLy8gNDpzd2l0Y2hUYWIg6Lez6L2s5YiwIHRhYkJhciDpobXpnaLvvIzlubblhbPpl63lhbbku5bmiYDmnInpnZ4gdGFiQmFyIOmhtemdoiAg5LiN5Y+v5Yqg5Y+C5pWwXG4vLyA1Om5hdmlnYXRlQmFjayDlhbPpl63lvZPliY3pobXpnaLvvIzov5Tlm57kuIrkuIDpobXpnaLmiJblpJrnuqfpobXpnaLjgILlj6/pgJrov4cgZ2V0Q3VycmVudFBhZ2VzKCkpIOiOt+WPluW9k+WJjeeahOmhtemdouagiO+8jOWGs+WumumcgOimgei/lOWbnuWHoOWxglxuLyoqXG4gKiDpobXpnaLot7Povazlh73mlbBcbiAqIEBwYXJhbSBwYXRoIOi3s+i9rOi3r+W+hCDpg6jliIblj6/mkLrluKblj4LmlbBcbiAqIEBwYXJhbSB0eXBlIOi3s+i9rOexu+Wei1xuICogQHBhcmFtIG51bSDmmK/lkKbkuLrov5Tlm57kuIrnuqdcbiAqL1xuZnVuY3Rpb24gcGFnZUdvKHBhdGgsIHR5cGUsIG51bSkge1xuICAgIGlmIChudW0pIHtcbiAgICAgICAgd3gubmF2aWdhdGVCYWNrKHtcbiAgICAgICAgICAgIGRlbHRhOiBwYXRoXG4gICAgICAgIH0pXG4gICAgfSBlbHNlIHtcbiAgICAgICAgc3dpdGNoICh0eXBlKSB7XG4gICAgICAgICAgICBjYXNlIDE6XG4gICAgICAgICAgICAgICAgd3gubmF2aWdhdGVUbyh7XG4gICAgICAgICAgICAgICAgICAgIHVybDogcGF0aFxuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgY2FzZSAyOlxuICAgICAgICAgICAgICAgIHd4LnJlZGlyZWN0VG8oe1xuICAgICAgICAgICAgICAgICAgICB1cmw6IHBhdGhcbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgIGNhc2UgMzpcbiAgICAgICAgICAgICAgICB3eC5yZUxhdW5jaCh7XG4gICAgICAgICAgICAgICAgICAgIHVybDogcGF0aFxuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgY2FzZSA0OlxuICAgICAgICAgICAgICAgIHd4LnN3aXRjaFRhYih7XG4gICAgICAgICAgICAgICAgICAgIHVybDogcGF0aFxuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgZGVmYXVsdDpcbiAgICAgICAgICAgICAgICBicmVha1xuICAgICAgICB9XG4gICAgfVxufVxuXG4vKipcbiAqIOWIhuS6q+mbhuaIkOWHveaVsFxuICogQHBhcmFtIHRpdGxlIOWIhuS6q+eahOagh+mimFxuICogQHBhcmFtIHBhdGgg5YiG5Lqr55qE6aG16Z2i6Lev5b6EXG4gKiBAcGFyYW0gaW1hZ2VVcmwg5YiG5Lqr5Ye65Y676KaB5pi+56S655qE5Zu+54mHXG4gKiBAcGFyYW0gY2FsbGJhY2sg5YiG5Lqr5ZCO55qE5Zue6LCDXG4gKiBAcmV0dXJucyB7e3RpdGxlOiAqLCBwYXRoOiAqLCBpbWFnZVVybDogKiwgc3VjY2Vzczogc3VjY2VzcywgY29tcGxldGU6IGNvbXBsZXRlfX1cbiAqL1xuZnVuY3Rpb24gb3BlblNoYXJlKHRpdGxlLCBwYXRoLCBpbWFnZVVybCwgY2FsbGJhY2spIHtcbiAgICByZXR1cm4ge1xuICAgICAgICB0aXRsZTogdGl0bGUsXG4gICAgICAgIHBhdGg6IHBhdGgsXG4gICAgICAgIGltYWdlVXJsOiBpbWFnZVVybCxcbiAgICAgICAgc3VjY2VzczogZnVuY3Rpb24gKHJlcykge1xuICAgICAgICAgICAgd3guc2hvd1RvYXN0KHtcbiAgICAgICAgICAgICAgICB0aXRsZTogJ+WIhuS6q+aIkOWKnycsXG4gICAgICAgICAgICAgICAgaWNvbjogJ3N1Y2Nlc3MnLFxuICAgICAgICAgICAgICAgIGR1cmF0aW9uOiAzMDAwXG4gICAgICAgICAgICB9KVxuICAgICAgICB9LFxuICAgICAgICBjb21wbGV0ZTogZnVuY3Rpb24gKHJlcSkge1xuICAgICAgICAgICAgY2FsbGJhY2socmVxKVxuICAgICAgICB9XG4gICAgfVxufVxuXG4vKipcbiAqICDplJnor6/lhajlsYDmj5DnpLpcbiAqIEBwYXJhbSB0aGF0XG4gKiBAcGFyYW0gc3RyXG4gKiBAY29uc3RydWN0b3JcbiAqL1xuZnVuY3Rpb24gRXJyb3JUaXBzKHRoYXQsIHN0cikge1xuICAgIHRoYXQuc3RvcCA9IHRydWU7XG4gICAgdGhhdC5wb3BFcnJvck1zZyA9IHN0cjtcbiAgICBoaWRlRXJyb3JUaXBzKHRoYXQpO1xufVxuXG5mdW5jdGlvbiBoaWRlRXJyb3JUaXBzKHRoYXQpIHtcbiAgICBsZXQgZmFkZU91dFRpbWVvdXQgPSBzZXRUaW1lb3V0KCgpID0+IHtcbiAgICAgICAgdGhhdC5wb3BFcnJvck1zZyA9IG51bGw7XG4gICAgICAgIHRoYXQuJGFwcGx5KCk7XG4gICAgICAgIGNsZWFyVGltZW91dChmYWRlT3V0VGltZW91dCk7XG4gICAgfSwgMzAwMCk7XG59XG5cbi8qKlxuICog5YWo5bGA5aSN5Yi25Ye95pWwXG4gKiBAcGFyYW0gc3RyIOmcgOimgeWkjeWItueahOaWh+Wtl1xuICovXG5mdW5jdGlvbiBjb3B5VGV4dChzdHIpIHtcbiAgICB3eC5zZXRDbGlwYm9hcmREYXRhKHtcbiAgICAgICAgZGF0YTogc3RyLFxuICAgICAgICBzdWNjZXNzOiByZXMgPT4ge1xuICAgICAgICAgICAgY29uc29sZS5sb2cocmVzKTtcbiAgICAgICAgICAgIHN1Y2Nlc3NTaG93VGV4dCgn5aSN5Yi25b6u5L+h5Y+35oiQ5YqfJylcbiAgICAgICAgfVxuICAgIH0pXG59XG5cbmZ1bmN0aW9uIHN1Y2Nlc3NTaG93VGV4dChzdHIpIHtcbiAgICB3eC5zaG93VG9hc3Qoe1xuICAgICAgICB0aXRsZTogc3RyLFxuICAgICAgICBpY29uOiAnc3VjY2VzcycsXG4gICAgICAgIGR1cmF0aW9uOiAzMDAwXG4gICAgfSlcbn1cblxuZnVuY3Rpb24gZm9ybWF0WmVybyhzdHIpIHtcbiAgICByZXR1cm4gc3RyIDwgMTAgPyAnMCcgKyBzdHIgOiBzdHI7XG59XG5cbmZ1bmN0aW9uIGZvcm1hdFRpbWUodGltZSwgdHlwZSkge1xuICAgIHZhciBsZWF2ZTEgPSB0aW1lICUgKDI0ICogMzYwMClcbiAgICB2YXIgaG91cnMgPSBNYXRoLmZsb29yKGxlYXZlMSAvIDM2MDApXG4gICAgLy/orqHnrpfnm7jlt67liIbpkp/mlbAgIFxuICAgIHZhciBsZWF2ZTIgPSBsZWF2ZTEgJSAzNjAwICAgICAgIC8v6K6h566X5bCP5pe25pWw5ZCO5Ymp5L2Z55qE56eS5pWwICBcbiAgICB2YXIgbWludXRlcyA9IE1hdGguZmxvb3IobGVhdmUyIC8gNjApXG4gICAgLy/orqHnrpfnm7jlt67np5LmlbAgIFxuICAgIHZhciBsZWF2ZTMgPSBsZWF2ZTIgJSA2MFxuICAgIHZhciBzZWNvbmRzID0gbGVhdmUzXG4gICAgcmV0dXJuIGZvcm1hdFplcm8oaG91cnMpICsgXCI6XCIgKyBmb3JtYXRaZXJvKG1pbnV0ZXMpICsgXCI6XCIgKyBmb3JtYXRaZXJvKHNlY29uZHMpXG59XG5cbi8qKlxuICog5LiK5Lyg5Zu+54mH5b6X5YiwdXJs5Zyw5Z2AXG4gKiBAcGFyYW0gaW1nVXJsXG4gKiBAcGFyYW0gY2FsbGJhY2tcbiAqL1xuZnVuY3Rpb24gZG93bmxvYWRJbWcoaW1nVXJsLCBjYWxsYmFjaykge1xuICAgIEF1dGhQcm92aWRlci5nZXRBY2Nlc3NUb2tlbigpLnRoZW4odG9rZW4gPT4ge1xuICAgICAgICByZXR1cm4gd3hVcGxvYWRGaWxlLnVwbG9hZEZpbGUoQVBJLnVwbG9hZEltZywgaW1nVXJsLCB0b2tlbik7XG4gICAgfSkudGhlbihyZXN1bHQgPT4ge1xuICAgICAgICBsZXQgcmVzRGF0YSA9IEpTT04ucGFyc2UocmVzdWx0LmRhdGEpO1xuICAgICAgICBjYWxsYmFjayhyZXNEYXRhLnJlc3VsdENvbnRlbnQpO1xuICAgIH0pXG59XG5cbmZ1bmN0aW9uIGdldE9wZW5JZChjb2RlLCBhcHBpZCkge1xuICAgIGxldCB1cmwgPSBBUEkuZ2V0U21hbGxQcm8gKyBgP2NvZGU9JHtjb2RlfSZhcHBJZD0ke2FwcGlkfWA7XG4gICAgd3hSZXF1ZXN0LmZldGNoKHVybCwgbnVsbCwgbnVsbCwgJ0dFVCcpLnRoZW4ocmVzID0+IHtcbiAgICAgICAgXCJ1c2Ugc3RyaWN0XCI7XG4gICAgICAgIGNvbnNvbGUubG9nKHJlcyk7XG4gICAgICAgIGlmIChyZXMuZGF0YS5yZXN1bHRDb2RlID09PSAnMTAwJykge1xuICAgICAgICAgICAgd3guc2V0U3RvcmFnZVN5bmMoJ29wZW5pZCcsIHJlcy5kYXRhLnJlc3VsdENvbnRlbnQub3BlbklkKTtcbiAgICAgICAgfVxuICAgIH0pXG59XG5cbi8qKlxuICog5Y+R6YCBZm9ybWlkXG4gKiBAcGFyYW0gZVxuICovXG5mdW5jdGlvbiBmb3JtU3VibWl0KGUpIHtcbiAgICBsZXQgcGFyYW1zID0ge1xuICAgICAgICBcImFwcElkXCI6IEFQSS5BUFBfSUQsXG4gICAgICAgIFwiZm9ybUlkXCI6IGUuZGV0YWlsLmZvcm1JZCxcbiAgICAgICAgXCJvcGVuSWRcIjogd3guZ2V0U3RvcmFnZVN5bmMoJ29wZW5pZCcpXG4gICAgfVxuICAgIEF1dGhQcm92aWRlci5nZXRBY2Nlc3NUb2tlbigpLnRoZW4odG9rZW4gPT4ge1xuICAgICAgICB3eC5yZXF1ZXN0KHtcbiAgICAgICAgICAgIHVybDogQVBJLnRlbXBsYXRlTmV3cyxcbiAgICAgICAgICAgIGRhdGE6IHBhcmFtcyxcbiAgICAgICAgICAgIG1ldGhvZDogJ1BPU1QnLFxuICAgICAgICAgICAgaGVhZGVyOiB7XG4gICAgICAgICAgICAgICAgJ0NvbnRlbnQtVHlwZSc6ICdhcHBsaWNhdGlvbi9qc29uO2NoYXJzZXQ9VVRGLTgnLFxuICAgICAgICAgICAgICAgIFwiQXV0aG9yaXphdGlvblwiOiAnYmVhcmVyICcgKyB0b2tlbiAvL2Jhc2U2NOWKoOWvhmxpei15b3VsaS13eDpzZWNyZXRcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBzdWNjZXNzOiBmdW5jdGlvbiAoZSkge1xuICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKCflj5HpgIHmiJDlip8nKVxuICAgICAgICAgICAgfVxuICAgICAgICB9KVxuICAgIH0pXG5cbn1cblxuLyoqXG4gKiDlgJLorqHml7ZcbiAqIEBwYXJhbSB0aGF0XG4gKiBAcGFyYW0gdG90YWxfbWljcm9fc2Vjb25kXG4gKi9cbnZhciBjb3VudF9kb3duID0gZnVuY3Rpb24gKHRoYXQsIHRvdGFsX21pY3JvX3NlY29uZCkge1xuICAgIGlmICh0b3RhbF9taWNyb19zZWNvbmQgPD0gMCkge1xuICAgICAgICB0aGF0LnBob25lVGV4dCA9ICfph43mlrDojrflj5YnO1xuICAgICAgICB0aGF0LnBob25lQ29kZVN0YXRlID0gdHJ1ZTtcbiAgICAgICAgdGhhdC4kYXBwbHkoKTtcbiAgICAgICAgLy8gdGltZW91dOWImei3s+WHuumAkuW9klxuICAgICAgICByZXR1cm47XG4gICAgfVxuICAgIC8vIOa4suafk+WAkuiuoeaXtuaXtumSn1xuICAgIHRoYXQucGhvbmVUZXh0ID0gZm9ybWF0WmVybyhkYXRlX2Zvcm1hdCh0b3RhbF9taWNyb19zZWNvbmQpKSArICdz5ZCO6YeN6K+VJztcbiAgICB0aGF0LnBob25lQ29kZVN0YXRlID0gZmFsc2U7XG4gICAgdGhhdC4kYXBwbHkoKTtcbiAgICBzZXRUaW1lb3V0KGZ1bmN0aW9uICgpIHtcbiAgICAgICAgLy8g5pS+5Zyo5pyA5ZCOLS1cbiAgICAgICAgdG90YWxfbWljcm9fc2Vjb25kIC09IDEwO1xuICAgICAgICBjb3VudF9kb3duKHRoYXQsIHRvdGFsX21pY3JvX3NlY29uZCk7XG4gICAgfSwgMTApXG59XG5cbi8vIOaXtumXtOagvOW8j+WMlui+k+WHuu+8jOWmgjAzOjI1OjE5IDg244CC5q+PMTBtc+mDveS8muiwg+eUqOS4gOasoVxudmFyIGRhdGVfZm9ybWF0ID0gZnVuY3Rpb24gKG1pY3JvX3NlY29uZCkge1xuICAgIC8vIOenkuaVsFxuICAgIHZhciBzZWNvbmQgPSBNYXRoLmZsb29yKG1pY3JvX3NlY29uZCAvIDEwMDApO1xuICAgIC8vIOWwj+aXtuS9jVxuICAgIHZhciBociA9IE1hdGguZmxvb3Ioc2Vjb25kIC8gMzYwMCk7XG4gICAgLy8g5YiG6ZKf5L2NXG4gICAgdmFyIG1pbiA9IE1hdGguZmxvb3IoKHNlY29uZCAtIGhyICogMzYwMCkgLyA2MCk7XG4gICAgLy8g56eS5L2NXG4gICAgdmFyIHNlYyA9IChzZWNvbmQgLSBociAqIDM2MDAgLSBtaW4gKiA2MCk7IC8vIGVxdWFsIHRvID0+IHZhciBzZWMgPSBzZWNvbmQgJSA2MDtcbiAgICAvLyDmr6vnp5LkvY3vvIzkv53nlZky5L2NXG4gICAgdmFyIG1pY3JvX3NlYyA9IE1hdGguZmxvb3IoKG1pY3JvX3NlY29uZCAlIDEwMDApIC8gMTApO1xuICAgIHJldHVybiBzZWM7XG59XG5cbm1vZHVsZS5leHBvcnRzID0ge1xuICAgIHBhZ2VHbyxcbiAgICBvcGVuU2hhcmUsXG4gICAgRXJyb3JUaXBzLFxuICAgIGNvcHlUZXh0LFxuICAgIGZvcm1hdFplcm8sXG4gICAgZG93bmxvYWRJbWcsXG4gICAgc3VjY2Vzc1Nob3dUZXh0LFxuICAgIGdldE9wZW5JZCxcbiAgICBmb3JtYXRUaW1lLFxuICAgIGZvcm1TdWJtaXQsXG4gICAgY291bnRfZG93blxufTtcbiJdfQ==