'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
// const ORIGIN_NAME = 'https://cloud.gemii.cc/lizcloud/api';//生产环境
var ORIGIN_NAME = 'http://dev.gemii.cc:58080/lizcloud/api'; //开发模式
// const ORIGIN_NAME = 'http://test.gemii.cc:58080/lizcloud/api' //测试模式


var USER_LOGIN = ORIGIN_NAME + '/basis-api/noauth/'; //授权绑定，用户登录1
var TOKRN = ORIGIN_NAME + '/uaa/oauth/token?'; //获取token


var api = {
    SECRET: "bGl6LXNob3Atb3duZXI6c2VjcmV0", //base64加密liz-shop-owner:secret
    APP_ID: 'wx5dcfaad36777e61d', //APPID
    authLogin: USER_LOGIN + 'wdwd/loadUserAuthorizeWechat', //获取unionid
    getToken: ORIGIN_NAME + '/basis-api/noauth/usermgmt/loginShopOwner', //卖家获取token
    getTokenC: TOKRN + 'grant_type=password&password=&username=', //买家获取token
    refreshToken: TOKRN + 'grant_type=refresh_token&refresh_token=', //刷新token

    getPhoneCode: ORIGIN_NAME + '/basis-api/noauth/usermgmt/sendPhoneCode?_templateCode=SHOP_OWNER_VCODE_MSG&_phone=', //获取手机号码code
    codeYAN: ORIGIN_NAME + '/basis-api/noauth/usermgmt/checkPhoneCode', //验证手机号码

    getSmallPro: ORIGIN_NAME + '/basis-api/noauth/oauth/login/smallpro', //获取oppenid

    uploadImg: ORIGIN_NAME + '/gridfs-api/noauth/media', //上传图片

    apply: ORIGIN_NAME + '/basis-api/noauth/usermgmt/applyShopOwnerWhiteList', //申请入驻
    queryShopOwnerWhiteList: ORIGIN_NAME + '/basis-api/noauth/usermgmt/queryShopOwnerWhiteList/', //判断是否入驻申请

    createProduct: ORIGIN_NAME + '/e-goods-api/authsec/miniprogram/product', //创建商品
    getGoodDetail: ORIGIN_NAME + '/e-goods-api/noauth/miniprogram/good/brief?goodId=', //商品详细信息
    getProductList: ORIGIN_NAME + '/e-goods-api/authsec/miniprogram/goods', //获取商品列表 post
    stopActivity: ORIGIN_NAME + '/e-goods-api/authsec/miniprogram/removeshop/', //终止活动 put
    getOrdersList: ORIGIN_NAME + '/e-order-api/authsec/miniApp/orderapi/supplier/orders', //获取订单列表

    getShopMessage: ORIGIN_NAME + '/e-goods-api/authsec/miniprogram/tenant/address', //获取地址店铺

    getGoodInfo: ORIGIN_NAME + '/e-goods-api/noauth/miniprogram/good/brief', //获取商品信息 get
    getSkuInfo: ORIGIN_NAME + '/e-goods-api/noauth/tenant/good/', //获取skuInfo
    // submitOrder: ORIGIN_NAME + '/e-purchase-api/authsec/goods/miniapp/submit/buy',//商品提交购买
    submitOrder: ORIGIN_NAME + '/e-purchase-api/authsec/goods/miniapp/submit/buyandpay', //商品提交购买
    submitPayment: ORIGIN_NAME + '/marketplaceui/authsec/payment/prePayment/program', //小程序发起预支付
    bookGood: ORIGIN_NAME + '/e-goods-api/authsec/miniprogram/notice/good', //订阅商品

    withDrawPay: ORIGIN_NAME + '/tenantadmin-api/authsec/accountthird/createWithDraw/pay', //提现
    loadAccountInfo: ORIGIN_NAME + '/tenantadmin-api/authsec/account/loadAccountInfo', //资金流水
    templateNews: ORIGIN_NAME + '/basis-api/authsec/oauth/user/formId', //小程序推送模板消息

    longToshort: ORIGIN_NAME + '/e-goods-api/noauth/support/longToshort?type=0&longId=', //长转短
    shortTolong: ORIGIN_NAME + '/e-goods-api/noauth/support/shortTolong?shortId=' //短转长


};

exports.default = api;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImFwaS5qcyJdLCJuYW1lcyI6WyJPUklHSU5fTkFNRSIsIlVTRVJfTE9HSU4iLCJUT0tSTiIsImFwaSIsIlNFQ1JFVCIsIkFQUF9JRCIsImF1dGhMb2dpbiIsImdldFRva2VuIiwiZ2V0VG9rZW5DIiwicmVmcmVzaFRva2VuIiwiZ2V0UGhvbmVDb2RlIiwiY29kZVlBTiIsImdldFNtYWxsUHJvIiwidXBsb2FkSW1nIiwiYXBwbHkiLCJxdWVyeVNob3BPd25lcldoaXRlTGlzdCIsImNyZWF0ZVByb2R1Y3QiLCJnZXRHb29kRGV0YWlsIiwiZ2V0UHJvZHVjdExpc3QiLCJzdG9wQWN0aXZpdHkiLCJnZXRPcmRlcnNMaXN0IiwiZ2V0U2hvcE1lc3NhZ2UiLCJnZXRHb29kSW5mbyIsImdldFNrdUluZm8iLCJzdWJtaXRPcmRlciIsInN1Ym1pdFBheW1lbnQiLCJib29rR29vZCIsIndpdGhEcmF3UGF5IiwibG9hZEFjY291bnRJbmZvIiwidGVtcGxhdGVOZXdzIiwibG9uZ1Rvc2hvcnQiLCJzaG9ydFRvbG9uZyJdLCJtYXBwaW5ncyI6Ijs7Ozs7QUFBQTtBQUNBLElBQU1BLGNBQWMsd0NBQXBCLEMsQ0FBOEQ7QUFDOUQ7OztBQUdBLElBQU1DLGFBQWFELGNBQWMsb0JBQWpDLEMsQ0FBc0Q7QUFDdEQsSUFBTUUsUUFBUUYsY0FBYyxtQkFBNUIsQyxDQUFnRDs7O0FBR2hELElBQU1HLE1BQU07QUFDUkMsWUFBUSw4QkFEQSxFQUNnQztBQUN4Q0MsWUFBUSxvQkFGQSxFQUVzQjtBQUM5QkMsZUFBV0wsYUFBYSw4QkFIaEIsRUFHZ0Q7QUFDeERNLGNBQVVQLGNBQWMsMkNBSmhCLEVBSTZEO0FBQ3JFUSxlQUFXTixRQUFRLHlDQUxYLEVBS3NEO0FBQzlETyxrQkFBY1AsUUFBUSx5Q0FOZCxFQU15RDs7QUFFakVRLGtCQUFjVixjQUFjLHFGQVJwQixFQVEwRztBQUNsSFcsYUFBU1gsY0FBYywyQ0FUZixFQVMyRDs7QUFFbkVZLGlCQUFhWixjQUFjLHdDQVhuQixFQVc0RDs7QUFFcEVhLGVBQVdiLGNBQWMsMEJBYmpCLEVBYTRDOztBQUVwRGMsV0FBT2QsY0FBYyxvREFmYixFQWVrRTtBQUMxRWUsNkJBQXlCZixjQUFjLHFEQWhCL0IsRUFnQnFGOztBQUU3RmdCLG1CQUFlaEIsY0FBYywwQ0FsQnJCLEVBa0JnRTtBQUN4RWlCLG1CQUFlakIsY0FBYyxvREFuQnJCLEVBbUIwRTtBQUNsRmtCLG9CQUFnQmxCLGNBQWMsd0NBcEJ0QixFQW9CK0Q7QUFDdkVtQixrQkFBY25CLGNBQWMsOENBckJwQixFQXFCbUU7QUFDM0VvQixtQkFBZXBCLGNBQWMsdURBdEJyQixFQXNCNkU7O0FBRXJGcUIsb0JBQWdCckIsY0FBYyxpREF4QnRCLEVBd0J3RTs7QUFFaEZzQixpQkFBYXRCLGNBQWMsNENBMUJuQixFQTBCZ0U7QUFDeEV1QixnQkFBWXZCLGNBQWMsa0NBM0JsQixFQTJCcUQ7QUFDN0Q7QUFDQXdCLGlCQUFheEIsY0FBYyx3REE3Qm5CLEVBNkI0RTtBQUNwRnlCLG1CQUFlekIsY0FBYyxtREE5QnJCLEVBOEJ5RTtBQUNqRjBCLGNBQVUxQixjQUFjLDhDQS9CaEIsRUErQitEOztBQUV2RTJCLGlCQUFhM0IsY0FBYywwREFqQ25CLEVBaUM4RTtBQUN0RjRCLHFCQUFpQjVCLGNBQWMsa0RBbEN2QixFQWtDMEU7QUFDbEY2QixrQkFBYzdCLGNBQWMsc0NBbkNwQixFQW1DMkQ7O0FBRW5FOEIsaUJBQWE5QixjQUFjLHdEQXJDbkIsRUFxQzRFO0FBQ3BGK0IsaUJBQWEvQixjQUFjLGtEQXRDbkIsQ0FzQ3NFOzs7QUF0Q3RFLENBQVo7O2tCQTJDZUcsRyIsImZpbGUiOiJhcGkuanMiLCJzb3VyY2VzQ29udGVudCI6WyIvLyBjb25zdCBPUklHSU5fTkFNRSA9ICdodHRwczovL2Nsb3VkLmdlbWlpLmNjL2xpemNsb3VkL2FwaSc7Ly/nlJ/kuqfnjq/looNcbmNvbnN0IE9SSUdJTl9OQU1FID0gJ2h0dHA6Ly9kZXYuZ2VtaWkuY2M6NTgwODAvbGl6Y2xvdWQvYXBpJzsgLy/lvIDlj5HmqKHlvI9cbi8vIGNvbnN0IE9SSUdJTl9OQU1FID0gJ2h0dHA6Ly90ZXN0LmdlbWlpLmNjOjU4MDgwL2xpemNsb3VkL2FwaScgLy/mtYvor5XmqKHlvI9cblxuXG5jb25zdCBVU0VSX0xPR0lOID0gT1JJR0lOX05BTUUgKyAnL2Jhc2lzLWFwaS9ub2F1dGgvJzsvL+aOiOadg+e7keWumu+8jOeUqOaIt+eZu+W9lTFcbmNvbnN0IFRPS1JOID0gT1JJR0lOX05BTUUgKyAnL3VhYS9vYXV0aC90b2tlbj8nOy8v6I635Y+WdG9rZW5cblxuXG5jb25zdCBhcGkgPSB7XG4gICAgU0VDUkVUOiBcImJHbDZMWE5vYjNBdGIzZHVaWEk2YzJWamNtVjBcIiwgLy9iYXNlNjTliqDlr4ZsaXotc2hvcC1vd25lcjpzZWNyZXRcbiAgICBBUFBfSUQ6ICd3eDVkY2ZhYWQzNjc3N2U2MWQnLCAvL0FQUElEXG4gICAgYXV0aExvZ2luOiBVU0VSX0xPR0lOICsgJ3dkd2QvbG9hZFVzZXJBdXRob3JpemVXZWNoYXQnLCAvL+iOt+WPlnVuaW9uaWRcbiAgICBnZXRUb2tlbjogT1JJR0lOX05BTUUgKyAnL2Jhc2lzLWFwaS9ub2F1dGgvdXNlcm1nbXQvbG9naW5TaG9wT3duZXInLCAvL+WNluWutuiOt+WPlnRva2VuXG4gICAgZ2V0VG9rZW5DOiBUT0tSTiArICdncmFudF90eXBlPXBhc3N3b3JkJnBhc3N3b3JkPSZ1c2VybmFtZT0nLCAvL+S5sOWutuiOt+WPlnRva2VuXG4gICAgcmVmcmVzaFRva2VuOiBUT0tSTiArICdncmFudF90eXBlPXJlZnJlc2hfdG9rZW4mcmVmcmVzaF90b2tlbj0nLCAvL+WIt+aWsHRva2VuXG5cbiAgICBnZXRQaG9uZUNvZGU6IE9SSUdJTl9OQU1FICsgJy9iYXNpcy1hcGkvbm9hdXRoL3VzZXJtZ210L3NlbmRQaG9uZUNvZGU/X3RlbXBsYXRlQ29kZT1TSE9QX09XTkVSX1ZDT0RFX01TRyZfcGhvbmU9JywvL+iOt+WPluaJi+acuuWPt+eggWNvZGVcbiAgICBjb2RlWUFOOiBPUklHSU5fTkFNRSArICcvYmFzaXMtYXBpL25vYXV0aC91c2VybWdtdC9jaGVja1Bob25lQ29kZScsLy/pqozor4HmiYvmnLrlj7fnoIFcblxuICAgIGdldFNtYWxsUHJvOiBPUklHSU5fTkFNRSArICcvYmFzaXMtYXBpL25vYXV0aC9vYXV0aC9sb2dpbi9zbWFsbHBybycsLy/ojrflj5ZvcHBlbmlkXG5cbiAgICB1cGxvYWRJbWc6IE9SSUdJTl9OQU1FICsgJy9ncmlkZnMtYXBpL25vYXV0aC9tZWRpYScsLy/kuIrkvKDlm77niYdcblxuICAgIGFwcGx5OiBPUklHSU5fTkFNRSArICcvYmFzaXMtYXBpL25vYXV0aC91c2VybWdtdC9hcHBseVNob3BPd25lcldoaXRlTGlzdCcsLy/nlLPor7flhaXpqbtcbiAgICBxdWVyeVNob3BPd25lcldoaXRlTGlzdDogT1JJR0lOX05BTUUgKyAnL2Jhc2lzLWFwaS9ub2F1dGgvdXNlcm1nbXQvcXVlcnlTaG9wT3duZXJXaGl0ZUxpc3QvJywvL+WIpOaWreaYr+WQpuWFpempu+eUs+ivt1xuXG4gICAgY3JlYXRlUHJvZHVjdDogT1JJR0lOX05BTUUgKyAnL2UtZ29vZHMtYXBpL2F1dGhzZWMvbWluaXByb2dyYW0vcHJvZHVjdCcsLy/liJvlu7rllYblk4FcbiAgICBnZXRHb29kRGV0YWlsOiBPUklHSU5fTkFNRSArICcvZS1nb29kcy1hcGkvbm9hdXRoL21pbmlwcm9ncmFtL2dvb2QvYnJpZWY/Z29vZElkPScsLy/llYblk4Hor6bnu4bkv6Hmga9cbiAgICBnZXRQcm9kdWN0TGlzdDogT1JJR0lOX05BTUUgKyAnL2UtZ29vZHMtYXBpL2F1dGhzZWMvbWluaXByb2dyYW0vZ29vZHMnLC8v6I635Y+W5ZWG5ZOB5YiX6KGoIHBvc3RcbiAgICBzdG9wQWN0aXZpdHk6IE9SSUdJTl9OQU1FICsgJy9lLWdvb2RzLWFwaS9hdXRoc2VjL21pbmlwcm9ncmFtL3JlbW92ZXNob3AvJywvL+e7iOatoua0u+WKqCBwdXRcbiAgICBnZXRPcmRlcnNMaXN0OiBPUklHSU5fTkFNRSArICcvZS1vcmRlci1hcGkvYXV0aHNlYy9taW5pQXBwL29yZGVyYXBpL3N1cHBsaWVyL29yZGVycycsLy/ojrflj5borqLljZXliJfooahcblxuICAgIGdldFNob3BNZXNzYWdlOiBPUklHSU5fTkFNRSArICcvZS1nb29kcy1hcGkvYXV0aHNlYy9taW5pcHJvZ3JhbS90ZW5hbnQvYWRkcmVzcycsLy/ojrflj5blnLDlnYDlupfpk7pcblxuICAgIGdldEdvb2RJbmZvOiBPUklHSU5fTkFNRSArICcvZS1nb29kcy1hcGkvbm9hdXRoL21pbmlwcm9ncmFtL2dvb2QvYnJpZWYnLC8v6I635Y+W5ZWG5ZOB5L+h5oGvIGdldFxuICAgIGdldFNrdUluZm86IE9SSUdJTl9OQU1FICsgJy9lLWdvb2RzLWFwaS9ub2F1dGgvdGVuYW50L2dvb2QvJywvL+iOt+WPlnNrdUluZm9cbiAgICAvLyBzdWJtaXRPcmRlcjogT1JJR0lOX05BTUUgKyAnL2UtcHVyY2hhc2UtYXBpL2F1dGhzZWMvZ29vZHMvbWluaWFwcC9zdWJtaXQvYnV5JywvL+WVhuWTgeaPkOS6pOi0reS5sFxuICAgIHN1Ym1pdE9yZGVyOiBPUklHSU5fTkFNRSArICcvZS1wdXJjaGFzZS1hcGkvYXV0aHNlYy9nb29kcy9taW5pYXBwL3N1Ym1pdC9idXlhbmRwYXknLC8v5ZWG5ZOB5o+Q5Lqk6LSt5LmwXG4gICAgc3VibWl0UGF5bWVudDogT1JJR0lOX05BTUUgKyAnL21hcmtldHBsYWNldWkvYXV0aHNlYy9wYXltZW50L3ByZVBheW1lbnQvcHJvZ3JhbScsLy/lsI/nqIvluo/lj5HotbfpooTmlK/ku5hcbiAgICBib29rR29vZDogT1JJR0lOX05BTUUgKyAnL2UtZ29vZHMtYXBpL2F1dGhzZWMvbWluaXByb2dyYW0vbm90aWNlL2dvb2QnLC8v6K6i6ZiF5ZWG5ZOBXG5cbiAgICB3aXRoRHJhd1BheTogT1JJR0lOX05BTUUgKyAnL3RlbmFudGFkbWluLWFwaS9hdXRoc2VjL2FjY291bnR0aGlyZC9jcmVhdGVXaXRoRHJhdy9wYXknLC8v5o+Q546wXG4gICAgbG9hZEFjY291bnRJbmZvOiBPUklHSU5fTkFNRSArICcvdGVuYW50YWRtaW4tYXBpL2F1dGhzZWMvYWNjb3VudC9sb2FkQWNjb3VudEluZm8nLC8v6LWE6YeR5rWB5rC0XG4gICAgdGVtcGxhdGVOZXdzOiBPUklHSU5fTkFNRSArICcvYmFzaXMtYXBpL2F1dGhzZWMvb2F1dGgvdXNlci9mb3JtSWQnLC8v5bCP56iL5bqP5o6o6YCB5qih5p2/5raI5oGvXG5cbiAgICBsb25nVG9zaG9ydDogT1JJR0lOX05BTUUgKyAnL2UtZ29vZHMtYXBpL25vYXV0aC9zdXBwb3J0L2xvbmdUb3Nob3J0P3R5cGU9MCZsb25nSWQ9JywvL+mVv+i9rOefrVxuICAgIHNob3J0VG9sb25nOiBPUklHSU5fTkFNRSArICcvZS1nb29kcy1hcGkvbm9hdXRoL3N1cHBvcnQvc2hvcnRUb2xvbmc/c2hvcnRJZD0nLC8v55+t6L2s6ZW/XG5cblxufTtcblxuZXhwb3J0IGRlZmF1bHQgYXBpOyJdfQ==