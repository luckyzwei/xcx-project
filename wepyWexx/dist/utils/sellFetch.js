'use strict';

var _api = require('./api.js');

var _api2 = _interopRequireDefault(_api);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var wxRequest = require('./wxRequest.js');
var AuthProvider = require('./AuthProvider.js');
var util = require('./util.js');
/**
 * 创建商品
 * @param data
 * @param callback
 */
function createProduct(data, callback) {
    AuthProvider.getAccessToken().then(function (token) {
        "use strict";

        return wxRequest.fetch(_api2.default.createProduct, { type: 'bearer', value: token }, data, "POST");
    }).then(function (res) {
        "use strict";

        callback(res);
    }).catch(function (req) {
        "use strict";

        console.log("Error：" + req);
    });
}

/**
 * 获取列表
 * @param pageInfo
 */
function getProductList(pageInfo, callback) {
    AuthProvider.getAccessToken().then(function (token) {
        "use strict";

        return wxRequest.fetch(_api2.default.getProductList, { type: 'bearer', value: token }, pageInfo, "POST");
    }).then(function (res) {
        "use strict";

        callback(res);
    }).catch(function (req) {
        "use strict";

        console.log("Error：" + req);
    });
}

/**
 * 终止活动
 * @param id
 * @param callback
 */
function stopActivity(id, callback) {
    AuthProvider.getAccessToken().then(function (token) {
        "use strict";

        return wxRequest.fetch(_api2.default.stopActivity + id, { type: 'bearer', value: token }, null, "PUT");
    }).then(function (res) {
        "use strict";

        callback(res);
    }).catch(function (req) {
        "use strict";

        console.log("Error：" + req);
    });
}

/**
 * 获取商品信息
 * @param id
 * @param callback
 */
function getGoodDetail(id, callback) {
    AuthProvider.getAccessToken().then(function (token) {
        "use strict";

        return wxRequest.fetch(_api2.default.getGoodDetail + id, { type: 'bearer', value: token }, null, "GET");
    }).then(function (res) {
        "use strict";

        callback(res);
    }).catch(function (req) {
        "use strict";

        console.log("Error：" + req);
    });
}

/**
 * 获取销售记录
 * @param data
 * @param callback
 */
function getOrdersList(data, callback) {
    AuthProvider.getAccessToken().then(function (token) {
        "use strict";

        var url = _api2.default.getOrdersList + ('?_currentPage=' + data.currentPage + '&_pageSize=' + data.pageSize);
        return wxRequest.fetch(url, { type: 'bearer', value: token }, { skuId: data.id }, "POST");
    }).then(function (res) {
        "use strict";

        callback(res);
    }).catch(function (req) {
        "use strict";

        console.log("Error：" + req);
    });
}

/**
 * 申请入驻
 * @param data
 * @param callback
 */
function apply(data, callback) {
    wxRequest.fetch(_api2.default.apply, null, data, "POST").then(function (res) {
        "use strict";

        callback(res);
    }).catch(function (req) {
        "use strict";

        console.log("Error：" + req);
    });
}

/**
 * 判断申请入驻状态
 * @param phone
 * @param callback
 */
function queryShopOwnerWhiteList(phone, callback) {
    wxRequest.fetch(_api2.default.queryShopOwnerWhiteList + phone, null, null, "GET").then(function (res) {
        "use strict";

        callback(res);
    }).catch(function (req) {
        "use strict";

        console.log("Error：" + req);
    });
}

/**
 * 获取店铺地址，名称
 * @param callback
 */
function getShopMessage(callback) {
    AuthProvider.getAccessToken().then(function (token) {
        "use strict";

        return wxRequest.fetch(_api2.default.getShopMessage, { type: 'bearer', value: token }, null, "GET");
    }).then(function (res) {
        "use strict";

        callback(res);
    }).catch(function (req) {
        "use strict";

        console.log("Error：" + req);
    });
}

/**
 * 提现
 * @param data
 * @param callback
 */
function withDrawPay(data, callback) {
    AuthProvider.getAccessToken().then(function (token) {
        "use strict";

        return wxRequest.fetch(_api2.default.withDrawPay, { type: 'bearer', value: token }, data, "POST");
    }).then(function (res) {
        "use strict";

        callback(res);
    }).catch(function (req) {
        "use strict";

        console.log("Error：" + req);
    });
}

/**
 * 资金流水
 * @param callback
 */
function loadAccountInfo(callback) {
    AuthProvider.getAccessToken().then(function (token) {
        "use strict";

        return wxRequest.fetch(_api2.default.loadAccountInfo, { type: 'bearer', value: token }, null, "GET");
    }).then(function (res) {
        "use strict";

        callback(res);
    }).catch(function (req) {
        "use strict";

        console.log("Error：" + req);
    });
}
/**
 *长短转换
 * @param str
 * @param callback
 */
function longToshort(str, callback) {
    wxRequest.fetch(_api2.default.longToshort + str, null, null, "GET").then(function (res) {
        "use strict";

        callback(res);
    }).catch(function (req) {
        "use strict";

        console.log("Error：" + req);
    });
}

/**
 * 长短转换
 * @param str
 * @param callback
 */
function shortTolong(str, callback) {
    wxRequest.fetch(_api2.default.shortTolong + str, null, null, "GET").then(function (res) {
        "use strict";

        callback(res);
    }).catch(function (req) {
        "use strict";

        console.log("Error：" + req);
    });
}
module.exports = {
    createProduct: createProduct,
    getProductList: getProductList,
    stopActivity: stopActivity,
    getGoodDetail: getGoodDetail,
    getOrdersList: getOrdersList,
    apply: apply,
    queryShopOwnerWhiteList: queryShopOwnerWhiteList,
    getShopMessage: getShopMessage,
    withDrawPay: withDrawPay,
    loadAccountInfo: loadAccountInfo,
    longToshort: longToshort,
    shortTolong: shortTolong
};
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInNlbGxGZXRjaC5qcyJdLCJuYW1lcyI6WyJ3eFJlcXVlc3QiLCJyZXF1aXJlIiwiQXV0aFByb3ZpZGVyIiwidXRpbCIsImNyZWF0ZVByb2R1Y3QiLCJkYXRhIiwiY2FsbGJhY2siLCJnZXRBY2Nlc3NUb2tlbiIsInRoZW4iLCJmZXRjaCIsIkFQSSIsInR5cGUiLCJ2YWx1ZSIsInRva2VuIiwicmVzIiwiY2F0Y2giLCJjb25zb2xlIiwibG9nIiwicmVxIiwiZ2V0UHJvZHVjdExpc3QiLCJwYWdlSW5mbyIsInN0b3BBY3Rpdml0eSIsImlkIiwiZ2V0R29vZERldGFpbCIsImdldE9yZGVyc0xpc3QiLCJ1cmwiLCJjdXJyZW50UGFnZSIsInBhZ2VTaXplIiwic2t1SWQiLCJhcHBseSIsInF1ZXJ5U2hvcE93bmVyV2hpdGVMaXN0IiwicGhvbmUiLCJnZXRTaG9wTWVzc2FnZSIsIndpdGhEcmF3UGF5IiwibG9hZEFjY291bnRJbmZvIiwibG9uZ1Rvc2hvcnQiLCJzdHIiLCJzaG9ydFRvbG9uZyIsIm1vZHVsZSIsImV4cG9ydHMiXSwibWFwcGluZ3MiOiI7O0FBQUE7Ozs7OztBQUNBLElBQUlBLFlBQVlDLFFBQVEsYUFBUixDQUFoQjtBQUNBLElBQUlDLGVBQWVELFFBQVEsZ0JBQVIsQ0FBbkI7QUFDQSxJQUFJRSxPQUFPRixRQUFRLFFBQVIsQ0FBWDtBQUNBOzs7OztBQUtBLFNBQVNHLGFBQVQsQ0FBdUJDLElBQXZCLEVBQTZCQyxRQUE3QixFQUF1QztBQUNuQ0osaUJBQWFLLGNBQWIsR0FBOEJDLElBQTlCLENBQW1DLGlCQUFTO0FBQ3hDOztBQUNBLGVBQU9SLFVBQVVTLEtBQVYsQ0FBZ0JDLGNBQUlOLGFBQXBCLEVBQW1DLEVBQUVPLE1BQU0sUUFBUixFQUFrQkMsT0FBT0MsS0FBekIsRUFBbkMsRUFBcUVSLElBQXJFLEVBQTJFLE1BQTNFLENBQVA7QUFDSCxLQUhELEVBR0dHLElBSEgsQ0FHUSxlQUFPO0FBQ1g7O0FBQ0FGLGlCQUFTUSxHQUFUO0FBQ0gsS0FO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QUFFRDs7Ozs7QUFLQSxTQUFTbUIsV0FBVCxDQUFxQkQsR0FBckIsRUFBMEI5QixRQUExQixFQUFvQztBQUNoQ04sY0FBVVMsS0FBVixDQUFnQkMsY0FBSTJCLFdBQUosR0FBa0JELEdBQWxDLEVBQXVDLElBQXZDLEVBQTZDLElBQTdDLEVBQW1ELEtBQW5ELEVBQTBENUIsSUFBMUQsQ0FBK0QsZUFBTztBQUNsRTs7QUFDQUYsaUJBQVNRLEdBQVQ7QUFDSCxLQUhELEVBR0dDLEtBSEgsQ0FHUyxlQUFPO0FBQ1o7O0FBQ0FDLGdCQUFRQyxHQUFSLENBQVksV0FBV0MsR0FBdkI7QUFDSCxLQU5EO0FBT0g7QUFDRG9CLE9BQU9DLE9BQVAsR0FBaUI7QUFDYm5DLG1CQUFlQSxhQURGO0FBRWJlLG9CQUFnQkEsY0FGSDtBQUdiRSxrQkFBY0EsWUFIRDtBQUliRSxtQkFBZUEsYUFKRjtBQUtiQyxtQkFBZUEsYUFMRjtBQU1iSyxXQUFPQSxLQU5NO0FBT2JDLDZCQUF5QkEsdUJBUFo7QUFRYkUsb0JBQWdCQSxjQVJIO0FBU2JDLGlCQUFhQSxXQVRBO0FBVWJDLHFCQUFpQkEsZUFWSjtBQVdiQyxpQkFBYUEsV0FYQTtBQVliRSxpQkFBYUE7QUFaQSxDQUFqQiIsImZpbGUiOiJzZWxsRmV0Y2guanMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgQVBJIGZyb20gJy4vYXBpJztcbmxldCB3eFJlcXVlc3QgPSByZXF1aXJlKCcuL3d4UmVxdWVzdCcpO1xubGV0IEF1dGhQcm92aWRlciA9IHJlcXVpcmUoJy4vQXV0aFByb3ZpZGVyJyk7XG5sZXQgdXRpbCA9IHJlcXVpcmUoJy4vdXRpbCcpO1xuLyoqXG4gKiDliJvlu7rllYblk4FcbiAqIEBwYXJhbSBkYXRhXG4gKiBAcGFyYW0gY2FsbGJhY2tcbiAqL1xuZnVuY3Rpb24gY3JlYXRlUHJvZHVjdChkYXRhLCBjYWxsYmFjaykge1xuICAgIEF1dGhQcm92aWRlci5nZXRBY2Nlc3NUb2tlbigpLnRoZW4odG9rZW4gPT4ge1xuICAgICAgICBcInVzZSBzdHJpY3RcIjtcbiAgICAgICAgcmV0dXJuIHd4UmVxdWVzdC5mZXRjaChBUEkuY3JlYXRlUHJvZHVjdCwgeyB0eXBlOiAnYmVhcmVyJywgdmFsdWU6IHRva2VuIH0sIGRhdGEsIFwiUE9TVFwiKVxuICAgIH0pLnRoZW4ocmVzID0+IHtcbiAgICAgICAgXCJ1c2Ugc3RyaWN0XCI7XG4gICAgICAgIGNhbGxiYWNrKHJlcyk7XG4gICAgfSkuY2F0Y2gocmVxID0+IHtcbiAgICAgICAgXCJ1c2Ugc3RyaWN0XCI7XG4gICAgICAgIGNvbnNvbGUubG9nKFwiRXJyb3LvvJpcIiArIHJlcSlcbiAgICB9KVxufVxuXG4vKipcbiAqIOiOt+WPluWIl+ihqFxuICogQHBhcmFtIHBhZ2VJbmZvXG4gKi9cbmZ1bmN0aW9uIGdldFByb2R1Y3RMaXN0KHBhZ2VJbmZvLCBjYWxsYmFjaykge1xuICAgIEF1dGhQcm92aWRlci5nZXRBY2Nlc3NUb2tlbigpLnRoZW4odG9rZW4gPT4ge1xuICAgICAgICBcInVzZSBzdHJpY3RcIjtcbiAgICAgICAgcmV0dXJuIHd4UmVxdWVzdC5mZXRjaChBUEkuZ2V0UHJvZHVjdExpc3QsIHsgdHlwZTogJ2JlYXJlcicsIHZhbHVlOiB0b2tlbiB9LCBwYWdlSW5mbywgXCJQT1NUXCIpXG4gICAgfSkudGhlbihyZXMgPT4ge1xuICAgICAgICBcInVzZSBzdHJpY3RcIjtcbiAgICAgICAgY2FsbGJhY2socmVzKVxuICAgIH0pLmNhdGNoKHJlcSA9PiB7XG4gICAgICAgIFwidXNlIHN0cmljdFwiO1xuICAgICAgICBjb25zb2xlLmxvZyhcIkVycm9y77yaXCIgKyByZXEpXG4gICAgfSlcbn1cblxuLyoqXG4gKiDnu4jmraLmtLvliqhcbiAqIEBwYXJhbSBpZFxuICogQHBhcmFtIGNhbGxiYWNrXG4gKi9cbmZ1bmN0aW9uIHN0b3BBY3Rpdml0eShpZCwgY2FsbGJhY2spIHtcbiAgICBBdXRoUHJvdmlkZXIuZ2V0QWNjZXNzVG9rZW4oKS50aGVuKHRva2VuID0+IHtcbiAgICAgICAgXCJ1c2Ugc3RyaWN0XCI7XG4gICAgICAgIHJldHVybiB3eFJlcXVlc3QuZmV0Y2goQVBJLnN0b3BBY3Rpdml0eSArIGlkLCB7IHR5cGU6ICdiZWFyZXInLCB2YWx1ZTogdG9rZW4gfSwgbnVsbCwgXCJQVVRcIilcbiAgICB9KS50aGVuKHJlcyA9PiB7XG4gICAgICAgIFwidXNlIHN0cmljdFwiO1xuICAgICAgICBjYWxsYmFjayhyZXMpXG4gICAgfSkuY2F0Y2gocmVxID0+IHtcbiAgICAgICAgXCJ1c2Ugc3RyaWN0XCI7XG4gICAgICAgIGNvbnNvbGUubG9nKFwiRXJyb3LvvJpcIiArIHJlcSlcbiAgICB9KVxufVxuXG4vKipcbiAqIOiOt+WPluWVhuWTgeS/oeaBr1xuICogQHBhcmFtIGlkXG4gKiBAcGFyYW0gY2FsbGJhY2tcbiAqL1xuZnVuY3Rpb24gZ2V0R29vZERldGFpbChpZCwgY2FsbGJhY2spIHtcbiAgICBBdXRoUHJvdmlkZXIuZ2V0QWNjZXNzVG9rZW4oKS50aGVuKHRva2VuID0+IHtcbiAgICAgICAgXCJ1c2Ugc3RyaWN0XCI7XG4gICAgICAgIHJldHVybiB3eFJlcXVlc3QuZmV0Y2goQVBJLmdldEdvb2REZXRhaWwgKyBpZCwgeyB0eXBlOiAnYmVhcmVyJywgdmFsdWU6IHRva2VuIH0sIG51bGwsIFwiR0VUXCIpXG4gICAgfSkudGhlbihyZXMgPT4ge1xuICAgICAgICBcInVzZSBzdHJpY3RcIjtcbiAgICAgICAgY2FsbGJhY2socmVzKVxuICAgIH0pLmNhdGNoKHJlcSA9PiB7XG4gICAgICAgIFwidXNlIHN0cmljdFwiO1xuICAgICAgICBjb25zb2xlLmxvZyhcIkVycm9y77yaXCIgKyByZXEpXG4gICAgfSlcbn1cblxuLyoqXG4gKiDojrflj5bplIDllK7orrDlvZVcbiAqIEBwYXJhbSBkYXRhXG4gKiBAcGFyYW0gY2FsbGJhY2tcbiAqL1xuZnVuY3Rpb24gZ2V0T3JkZXJzTGlzdChkYXRhLCBjYWxsYmFjaykge1xuICAgIEF1dGhQcm92aWRlci5nZXRBY2Nlc3NUb2tlbigpLnRoZW4odG9rZW4gPT4ge1xuICAgICAgICBcInVzZSBzdHJpY3RcIjtcbiAgICAgICAgbGV0IHVybCA9IEFQSS5nZXRPcmRlcnNMaXN0ICsgYD9fY3VycmVudFBhZ2U9JHtkYXRhLmN1cnJlbnRQYWdlfSZfcGFnZVNpemU9JHtkYXRhLnBhZ2VTaXplfWA7XG4gICAgICAgIHJldHVybiB3eFJlcXVlc3QuZmV0Y2godXJsLCB7IHR5cGU6ICdiZWFyZXInLCB2YWx1ZTogdG9rZW4gfSwgeyBza3VJZDogZGF0YS5pZCB9LCBcIlBPU1RcIilcbiAgICB9KS50aGVuKHJlcyA9PiB7XG4gICAgICAgIFwidXNlIHN0cmljdFwiO1xuICAgICAgICBjYWxsYmFjayhyZXMpXG4gICAgfSkuY2F0Y2gocmVxID0+IHtcbiAgICAgICAgXCJ1c2Ugc3RyaWN0XCI7XG4gICAgICAgIGNvbnNvbGUubG9nKFwiRXJyb3LvvJpcIiArIHJlcSlcbiAgICB9KVxufVxuXG4vKipcbiAqIOeUs+ivt+WFpempu1xuICogQHBhcmFtIGRhdGFcbiAqIEBwYXJhbSBjYWxsYmFja1xuICovXG5mdW5jdGlvbiBhcHBseShkYXRhLCBjYWxsYmFjaykge1xuICAgIHd4UmVxdWVzdC5mZXRjaChBUEkuYXBwbHksIG51bGwsIGRhdGEsIFwiUE9TVFwiKS50aGVuKHJlcyA9PiB7XG4gICAgICAgIFwidXNlIHN0cmljdFwiO1xuICAgICAgICBjYWxsYmFjayhyZXMpXG4gICAgfSkuY2F0Y2gocmVxID0+IHtcbiAgICAgICAgXCJ1c2Ugc3RyaWN0XCI7XG4gICAgICAgIGNvbnNvbGUubG9nKFwiRXJyb3LvvJpcIiArIHJlcSlcbiAgICB9KVxuXG59XG5cbi8qKlxuICog5Yik5pat55Sz6K+35YWl6am754q25oCBXG4gKiBAcGFyYW0gcGhvbmVcbiAqIEBwYXJhbSBjYWxsYmFja1xuICovXG5mdW5jdGlvbiBxdWVyeVNob3BPd25lcldoaXRlTGlzdChwaG9uZSwgY2FsbGJhY2spIHtcbiAgICB3eFJlcXVlc3QuZmV0Y2goQVBJLnF1ZXJ5U2hvcE93bmVyV2hpdGVMaXN0ICsgcGhvbmUsIG51bGwsIG51bGwsIFwiR0VUXCIpLnRoZW4ocmVzID0+IHtcbiAgICAgICAgXCJ1c2Ugc3RyaWN0XCI7XG4gICAgICAgIGNhbGxiYWNrKHJlcylcbiAgICB9KS5jYXRjaChyZXEgPT4ge1xuICAgICAgICBcInVzZSBzdHJpY3RcIjtcbiAgICAgICAgY29uc29sZS5sb2coXCJFcnJvcu+8mlwiICsgcmVxKVxuICAgIH0pXG59XG5cbi8qKlxuICog6I635Y+W5bqX6ZO65Zyw5Z2A77yM5ZCN56ewXG4gKiBAcGFyYW0gY2FsbGJhY2tcbiAqL1xuZnVuY3Rpb24gZ2V0U2hvcE1lc3NhZ2UoY2FsbGJhY2spIHtcbiAgICBBdXRoUHJvdmlkZXIuZ2V0QWNjZXNzVG9rZW4oKS50aGVuKHRva2VuID0+IHtcbiAgICAgICAgXCJ1c2Ugc3RyaWN0XCI7XG4gICAgICAgIHJldHVybiB3eFJlcXVlc3QuZmV0Y2goQVBJLmdldFNob3BNZXNzYWdlLCB7IHR5cGU6ICdiZWFyZXInLCB2YWx1ZTogdG9rZW4gfSwgbnVsbCwgXCJHRVRcIilcbiAgICB9KS50aGVuKHJlcyA9PiB7XG4gICAgICAgIFwidXNlIHN0cmljdFwiO1xuICAgICAgICBjYWxsYmFjayhyZXMpXG4gICAgfSkuY2F0Y2gocmVxID0+IHtcbiAgICAgICAgXCJ1c2Ugc3RyaWN0XCI7XG4gICAgICAgIGNvbnNvbGUubG9nKFwiRXJyb3LvvJpcIiArIHJlcSlcbiAgICB9KVxufVxuXG4vKipcbiAqIOaPkOeOsFxuICogQHBhcmFtIGRhdGFcbiAqIEBwYXJhbSBjYWxsYmFja1xuICovXG5mdW5jdGlvbiB3aXRoRHJhd1BheShkYXRhLCBjYWxsYmFjaykge1xuICAgIEF1dGhQcm92aWRlci5nZXRBY2Nlc3NUb2tlbigpLnRoZW4odG9rZW4gPT4ge1xuICAgICAgICBcInVzZSBzdHJpY3RcIjtcbiAgICAgICAgcmV0dXJuIHd4UmVxdWVzdC5mZXRjaChBUEkud2l0aERyYXdQYXksIHsgdHlwZTogJ2JlYXJlcicsIHZhbHVlOiB0b2tlbiB9LCBkYXRhLCBcIlBPU1RcIilcbiAgICB9KS50aGVuKHJlcyA9PiB7XG4gICAgICAgIFwidXNlIHN0cmljdFwiO1xuICAgICAgICBjYWxsYmFjayhyZXMpXG4gICAgfSkuY2F0Y2gocmVxID0+IHtcbiAgICAgICAgXCJ1c2Ugc3RyaWN0XCI7XG4gICAgICAgIGNvbnNvbGUubG9nKFwiRXJyb3LvvJpcIiArIHJlcSlcbiAgICB9KVxufVxuXG4vKipcbiAqIOi1hOmHkea1geawtFxuICogQHBhcmFtIGNhbGxiYWNrXG4gKi9cbmZ1bmN0aW9uIGxvYWRBY2NvdW50SW5mbyhjYWxsYmFjaykge1xuICAgIEF1dGhQcm92aWRlci5nZXRBY2Nlc3NUb2tlbigpLnRoZW4odG9rZW4gPT4ge1xuICAgICAgICBcInVzZSBzdHJpY3RcIjtcbiAgICAgICAgcmV0dXJuIHd4UmVxdWVzdC5mZXRjaChBUEkubG9hZEFjY291bnRJbmZvLCB7IHR5cGU6ICdiZWFyZXInLCB2YWx1ZTogdG9rZW4gfSwgbnVsbCwgXCJHRVRcIilcbiAgICB9KS50aGVuKHJlcyA9PiB7XG4gICAgICAgIFwidXNlIHN0cmljdFwiO1xuICAgICAgICBjYWxsYmFjayhyZXMpXG4gICAgfSkuY2F0Y2gocmVxID0+IHtcbiAgICAgICAgXCJ1c2Ugc3RyaWN0XCI7XG4gICAgICAgIGNvbnNvbGUubG9nKFwiRXJyb3LvvJpcIiArIHJlcSlcbiAgICB9KVxufVxuLyoqXG4gKumVv+efrei9rOaNolxuICogQHBhcmFtIHN0clxuICogQHBhcmFtIGNhbGxiYWNrXG4gKi9cbmZ1bmN0aW9uIGxvbmdUb3Nob3J0KHN0ciwgY2FsbGJhY2spIHtcbiAgICB3eFJlcXVlc3QuZmV0Y2goQVBJLmxvbmdUb3Nob3J0ICsgc3RyLCBudWxsLCBudWxsLCBcIkdFVFwiKS50aGVuKHJlcyA9PiB7XG4gICAgICAgIFwidXNlIHN0cmljdFwiO1xuICAgICAgICBjYWxsYmFjayhyZXMpXG4gICAgfSkuY2F0Y2gocmVxID0+IHtcbiAgICAgICAgXCJ1c2Ugc3RyaWN0XCI7XG4gICAgICAgIGNvbnNvbGUubG9nKFwiRXJyb3LvvJpcIiArIHJlcSlcbiAgICB9KVxufVxuXG4vKipcbiAqIOmVv+efrei9rOaNolxuICogQHBhcmFtIHN0clxuICogQHBhcmFtIGNhbGxiYWNrXG4gKi9cbmZ1bmN0aW9uIHNob3J0VG9sb25nKHN0ciwgY2FsbGJhY2spIHtcbiAgICB3eFJlcXVlc3QuZmV0Y2goQVBJLnNob3J0VG9sb25nICsgc3RyLCBudWxsLCBudWxsLCBcIkdFVFwiKS50aGVuKHJlcyA9PiB7XG4gICAgICAgIFwidXNlIHN0cmljdFwiO1xuICAgICAgICBjYWxsYmFjayhyZXMpXG4gICAgfSkuY2F0Y2gocmVxID0+IHtcbiAgICAgICAgXCJ1c2Ugc3RyaWN0XCI7XG4gICAgICAgIGNvbnNvbGUubG9nKFwiRXJyb3LvvJpcIiArIHJlcSlcbiAgICB9KVxufVxubW9kdWxlLmV4cG9ydHMgPSB7XG4gICAgY3JlYXRlUHJvZHVjdDogY3JlYXRlUHJvZHVjdCxcbiAgICBnZXRQcm9kdWN0TGlzdDogZ2V0UHJvZHVjdExpc3QsXG4gICAgc3RvcEFjdGl2aXR5OiBzdG9wQWN0aXZpdHksXG4gICAgZ2V0R29vZERldGFpbDogZ2V0R29vZERldGFpbCxcbiAgICBnZXRPcmRlcnNMaXN0OiBnZXRPcmRlcnNMaXN0LFxuICAgIGFwcGx5OiBhcHBseSxcbiAgICBxdWVyeVNob3BPd25lcldoaXRlTGlzdDogcXVlcnlTaG9wT3duZXJXaGl0ZUxpc3QsXG4gICAgZ2V0U2hvcE1lc3NhZ2U6IGdldFNob3BNZXNzYWdlLFxuICAgIHdpdGhEcmF3UGF5OiB3aXRoRHJhd1BheSxcbiAgICBsb2FkQWNjb3VudEluZm86IGxvYWRBY2NvdW50SW5mbyxcbiAgICBsb25nVG9zaG9ydDogbG9uZ1Rvc2hvcnQsXG4gICAgc2hvcnRUb2xvbmc6IHNob3J0VG9sb25nXG59Il19