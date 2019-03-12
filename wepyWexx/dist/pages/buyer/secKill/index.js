'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});


var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _wepy = require('./../../../npm/wepy/lib/wepy.js');

var _wepy2 = _interopRequireDefault(_wepy);

var _sellFetch = require('./../../../utils/sellFetch.js');

var _sellFetch2 = _interopRequireDefault(_sellFetch);

var _AuthProvider = require('./../../../utils/AuthProvider.js');

var _AuthProvider2 = _interopRequireDefault(_AuthProvider);

var _util = require('./../../../utils/util.js');

var _util2 = _interopRequireDefault(_util);

var _api = require('./../../../utils/api.js');

var _api2 = _interopRequireDefault(_api);

var _wxRequest = require('./../../../utils/wxRequest.js');

var _wxRequest2 = _interopRequireDefault(_wxRequest);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var buySecKill = function (_wepy$page) {
  _inherits(buySecKill, _wepy$page);

  function buySecKill() {
    var _ref;

    var _temp, _this, _ret;

    _classCallCheck(this, buySecKill);

    for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    return _ret = (_temp = (_this = _possibleConstructorReturn(this, (_ref = buySecKill.__proto__ || Object.getPrototypeOf(buySecKill)).call.apply(_ref, [this].concat(args))), _this), _this.data = {
      userInfo: null,
      canIUse: wx.canIUse('button.open-type.getUserInfo'), //判断是否支持button微信授权
      goodData: {},
      status: 1,
      productDescription: {},
      timeLeft: '00:00:00',
      timeLeftBuy: '00:00:00',
      secKillFlag: false,
      repertory: true,
      expiredFlag: false,
      effectiveDate: 0,
      expiredDate: 0,
      hasUserInfo: false,
      goodId: '',
      paymentFlag: false,
      stop: true, //阻止机制
      popErrorMsg: '',
      phoneNum: '',
      phoneCode: '',
      phoneText: '获取验证码',
      phoneCodeState: false,
      phoneNumState: false,
      phoneBtnState: false,
      phoneMS: false
    }, _this.methods = {
      formSubmit: function formSubmit(e) {
        var params = {
          appId: _api2.default.APP_ID,
          formId: e.detail.formId,
          openId: wx.getStorageSync('openid')
        };
        _AuthProvider2.default.getAccessToken().then(function (token) {
          wx.request({
            url: _api2.default.templateNews,
            data: params,
            method: 'POST',
            header: {
              'Content-Type': 'application/json;charset=UTF-8',
              Authorization: 'bearer ' + token //base64加密liz-youli-wx:secret
            },
            success: function success(e) {
              console.log('发送成功');
            }
          });
        });
      },
      closePhoneModule: function closePhoneModule() {
        _this.phoneMS = false;
      },
      // 订阅商品
      bookGood: function bookGood() {
        var self = _this;
        var goodId = _this.goodId;
        var goodData = _this.goodData;
        var params = {
          goodId: goodData.id ? goodData.id : goodId,
          openId: wx.getStorageSync('openid'),
          type: 1
        };
        _AuthProvider2.default.getAccessToken().then(function (token) {
          return _wxRequest2.default.fetch(_api2.default.bookGood, { type: 'bearer', value: token }, params, 'POST');
        }).then(function (res) {
          console.log(res, '订阅提醒');
          if (res.data.resultCode == '100') {
            _util2.default.ErrorTips(self, '预约成功');
          }
        });
      },
      submitPurchase: function submitPurchase() {
        if (!_this.hasUserInfo || !wx.getStorageSync('phoneNum')) {
          _this.phoneMS = true;
        } else {
          _this.phoneMS = false;
          _this.subMain();
        }
      },
      changePhone: function changePhone(e) {
        var myreg = /^[1][3,4,5,7,8][0-9]{9}$/;
        if (myreg.test(e.detail.value)) {
          _this.phoneCodeState = true;
          _this.phoneNumState = true;
          _this.phoneNum = e.detail.value;
          if (_this.data.phoneCode.length === 6) {
            _this.phoneBtnState = true;
          } else {
            _this.phoneBtnState = false;
          }
        } else {
          _this.phoneCodeState = false;
          _this.phoneNumState = false;
          _this.phoneBtnState = false;
          _this.phoneNum = e.detail.value;
        }
      },
      //输入验证码：
      changeCode: function changeCode(e) {
        if (e.detail.value.length === 6 && _this.phoneNumState) {
          _this.phoneBtnState = true;
          _this.phoneCode = e.detail.value;
        } else {
          _this.phoneBtnState = false;
          _this.phoneCode = e.detail.value;
        }
      },
      //获取phonecode
      getPhoneCode: function getPhoneCode() {
        if (_this.phoneCodeState) {
          _this.phoneCodeState = false;
          _util2.default.count_down(_this, 60000);
          _wxRequest2.default.fetch(_api2.default.getPhoneCode + _this.phoneNum, null, null, 'GET').then(function (res) {
            'use strict';

            if (res.data.resultCode === '100') {
              // util.ErrorTips(this,'发送成功')
            } else {
              _util2.default.ErrorTips(_this, '发送失败');
            }
          }).catch(function (req) {
            'use strict';

            _this.phoneCodeState = true;
            _util2.default.ErrorTips(_this, '发送失败');
            _this.$apply();
          });
        }
      },
      bindPhone: function bindPhone() {
        var dataParams = {
          code: _this.phoneCode,
          phone: _this.phoneNum,
          templateCode: 'SHOP_OWNER_VCODE_MSG'
        };
        _wxRequest2.default.fetch(_api2.default.codeYAN, null, dataParams, 'POST').then(function (res) {
          if (res.data.resultCode === '100') {
            _this.phoneMS = false;
            _this.$apply();
            wx.setStorageSync('phoneNum', _this.data.phoneNum);
          } else {
            _util2.default.ErrorTips(_this, '验证码输入有误');
          }
        });
      },
      getUserInfo: function getUserInfo(e) {
        _this.$parent.getUserInfo(e, 'buy', function (res) {
          console.log(res);
          _this.hasUserInfo = res.hasUserInfo;
          _this.userInfo = res.userInfo;
          _this.phoneMS = true;
          _this.$apply();
        });
      }
    }, _temp), _possibleConstructorReturn(_this, _ret);
  }

  _createClass(buySecKill, [{
    key: 'onLoad',
    value: function onLoad(options) {
      var _this2 = this;

      var unionid = wx.getStorageSync('unionid');
      if (unionid) {
        _AuthProvider2.default.onLogin('buy', null, function (res) {
          console.log('买家鉴权');
        });
      }
      this.$parent.getGlobalDatas(this.canIUse, function (res) {
        'use strict';

        _this2.hasUserInfo = res.hasUserInfo;
        _this2.userInfo = res.userInfo;
        _this2.$apply();
      });
      this.goodId = options.scene;
      this.requestGoodInfo();
    }
    // 获取商品详情

  }, {
    key: 'requestGoodInfo',
    value: function requestGoodInfo() {
      var _this3 = this;

      var url = _api2.default.getGoodInfo;
      var goodId = this.goodId;
      _wxRequest2.default.fetch(_api2.default.getGoodInfo + '?goodId=' + goodId, null, null, 'GET').then(function (res) {
        console.log(res);
        _this3.goodData = res.data.resultContent;
        _this3.productDescription = res.data.resultContent.productDescription.find(function (item) {
          return item.type == 2;
        });
        _this3.percent = 12 + 88 * (res.data.resultContent.totalSaledQuantity / res.data.resultContent.totalQuantity) + '%';
        _this3.effectiveDate = res.data.resultContent.effectiveDate;
        _this3.expiredDate = res.data.resultContent.expiredDat;
        _this3.status = res.data.resultContent.status;
        _this3.repertory = !(res.data.resultContent.totalSaledQuantity == res.data.resultContent.totalQuantity);
        _this3.$apply();
        _this3.countdown();
        _this3.countdownBuy();
        _this3.requestSkuInfo(res.data.resultContent.id);
      });
    }
    //获取商品sku信息

  }, {
    key: 'requestSkuInfo',
    value: function requestSkuInfo(goodId) {
      var _this4 = this;

      var url = _api2.default.getSkuInfo + goodId + '/sku';
      _wxRequest2.default.fetch(url, null, null, 'GET').then(function (res) {
        console.log(res, '获取商品sku信息');
        _this4.skuId = res.data.resultContent[0].id;
        _this4.$apply();
      });
    }
    // 预计抢购倒计时

  }, {
    key: 'countdown',
    value: function countdown() {
      var current = new Date().getTime();
      // console.log(current)
      var goodData = this.goodData;
      var effectiveDate = this.effectiveDate;
      console.log('--------');
      console.log(current);
      console.log(effectiveDate);
      if (current < effectiveDate) {
        this.timeLeft = _util2.default.formatTime(Math.floor((effectiveDate - current) / 1000));
        this.$apply();
        setTimeout(this.countdown, 500);
      } else {
        console.log('###########');
        this.secKillFlag = true;
        this.$apply();
      }
    }
    // 抢购倒计时时间

  }, {
    key: 'countdownBuy',
    value: function countdownBuy() {
      var current = new Date().getTime();
      var _data = this.data,
          goodData = _data.goodData,
          expiredDate = _data.expiredDate;

      if (current < expiredDate) {
        this.timeLeftBuy = _util2.default.formatTime(Math.floor((expiredDate - current) / 1000));
        this.$apply();
        setTimeout(this.countdownBuy, 500);
      } else {
        this.expiredFlag = true;
        this.$apply();
      }
    }
  }, {
    key: 'subMain',
    value: function subMain() {
      'use strict';

      var self = this;
      if (this.paymentFlag) return;
      this.paymentFlag = true;
      var params = {
        phone: wx.getStorageSync('phoneNum'),
        proPayment: {
          appid: _api2.default.APP_ID,
          body: '小程序 商品秒杀',
          openId: wx.getStorageSync('openid')
        },
        quantity: 1,
        skuId: this.skuId
      };
      _AuthProvider2.default.getAccessToken().then(function (token) {
        return _wxRequest2.default.fetch(_api2.default.submitOrder, { type: 'bearer', value: token }, params, 'POST');
      }).then(function (res) {
        console.log(res, '提交商品购买');
        if (res.data.resultCode == '100') {
          if (res.data.resultContent) {
            // 在线支付
            wx.requestPayment({
              timeStamp: res.data.resultContent.timeStamp,
              nonceStr: res.data.resultContent.nonceStr,
              package: res.data.resultContent.package,
              signType: res.data.resultContent.signType,
              paySign: res.data.resultContent.sign,
              success: function success(res) {
                // 支付成功
                _util2.default.pageGo('/pages/buyer/success/index?scene=' + self.goodId, 2);
              },
              fail: function fail(res) {
                _util2.default.ErrorTips(self, '秒杀失败');
              },
              complete: function complete() {
                self.paymentFlag = false;
                self.$apply();
              }
            });
          } else {
            // 到店支付
            self.paymentFlag = false;
            self.$apply();
            _util2.default.pageGo('/pages/buyer/success/index?scene=' + self.data.goodId, 2);
          }
        } else {
          _util2.default.ErrorTips(self, '秒杀失败');
          self.paymentFlag = false;
          self.$apply();
        }
      });
    }
  }]);

  return buySecKill;
}(_wepy2.default.page);


Page(require('./../../../npm/wepy/lib/wepy.js').default.$createPage(buySecKill , 'pages/buyer/secKill/index'));

//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImluZGV4LmpzIl0sIm5hbWVzIjpbImJ1eVNlY0tpbGwiLCJkYXRhIiwidXNlckluZm8iLCJjYW5JVXNlIiwid3giLCJnb29kRGF0YSIsInN0YXR1cyIsInByb2R1Y3REZXNjcmlwdGlvbiIsInRpbWVMZWZ0IiwidGltZUxlZnRCdXkiLCJzZWNLaWxsRmxhZyIsInJlcGVydG9yeSIsImV4cGlyZWRGbGFnIiwiZWZmZWN0aXZlRGF0ZSIsImV4cGlyZWREYXRlIiwiaGFzVXNlckluZm8iLCJnb29kSWQiLCJwYXltZW50RmxhZyIsInN0b3AiLCJwb3BFcnJvck1zZyIsInBob25lTnVtIiwicGhvbmVDb2RlIiwicGhvbmVUZXh0IiwicGhvbmVDb2RlU3RhdGUiLCJwaG9uZU51bVN0YXRlIiwicGhvbmVCdG5TdGF0ZSIsInBob25lTVMiLCJtZXRob2RzIiwiZm9ybVN1Ym1pdCIsInBhcmFtcyIsImFwcElkIiwiQVBJIiwiQVBQX0lEIiwiZm9ybUlkIiwiZSIsImRldGFpbCIsIm9wZW5JZCIsImdldFN0b3JhZ2VTeW5jIiwiQXV0aFByb3ZpZGVyIiwiZ2V0QWNjZXNzVG9rZW4iLCJ0aGVuIiwicmVxdWVzdCIsInVybCIsInRlbXBsYXRlTmV3cyIsIm1ldGhvZCIsImhlYWRlciIsIkF1dGhvcml6YXRpb24iLCJ0b2tlbiIsInN1Y2Nlc3MiLCJjb25zb2xlIiwibG9nIiwiY2xvc2VQaG9uZU1vZHVsZSIsImJvb2tHb29kIiwic2VsZiIsImlkIiwidHlwZSIsInd4UmVxdWVzdCIsImZldGNoIiwidmFsdWUiLCJyZXMiLCJyZXN1bHRDb2RlIiwidXRpbHMiLCJFcnJvclRpcHMiLCJzdWJtaXRQdXJjaGFzZSIsInN1Yk1haW4iLCJjaGFuZ2VQaG9uZSIsIm15cmVnIiwidGVzdCIsImxlbmd0aCIsImNoYW5nZUNvZGUiLCJnZXRQaG9uZUNvZGUiLCJjb3VudF9kb3duIiwiY2F0Y2giLCIkYXBwbHkiLCJiaW5kUGhvbmUiLCJkYXRhUGFyYW1zIiwiY29kZSIsInBob25lIiwidGVtcGxhdGVDb2RlIiwiY29kZVlBTiIsInNldFN0b3JhZ2VTeW5jIiwiZ2V0VXNlckluZm8iLCIkcGFyZW50Iiwib3B0aW9ucyIsInVuaW9uaWQiLCJvbkxvZ2luIiwiZ2V0R2xvYmFsRGF0YXMiLCJzY2VuZSIsInJlcXVlc3RHb29kSW5mbyIsImdldEdvb2RJbmZvIiwicmVzdWx0Q29udGVudCIsImZpbmQiLCJpdGVtIiwicGVyY2VudCIsInRvdGFsU2FsZWRRdWFudGl0eSIsInRvdGFsUXVhbnRpdHkiLCJleHBpcmVkRGF0IiwiY291bnRkb3duIiwiY291bnRkb3duQnV5IiwicmVxdWVzdFNrdUluZm8iLCJnZXRTa3VJbmZvIiwic2t1SWQiLCJjdXJyZW50IiwiRGF0ZSIsImdldFRpbWUiLCJmb3JtYXRUaW1lIiwiTWF0aCIsImZsb29yIiwic2V0VGltZW91dCIsInByb1BheW1lbnQiLCJhcHBpZCIsImJvZHkiLCJxdWFudGl0eSIsInN1Ym1pdE9yZGVyIiwicmVxdWVzdFBheW1lbnQiLCJ0aW1lU3RhbXAiLCJub25jZVN0ciIsInBhY2thZ2UiLCJzaWduVHlwZSIsInBheVNpZ24iLCJzaWduIiwicGFnZUdvIiwiZmFpbCIsImNvbXBsZXRlIiwid2VweSIsInBhZ2UiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7OztBQUNBOzs7O0FBQ0E7Ozs7QUFDQTs7OztBQUNBOzs7O0FBQ0E7Ozs7QUFDQTs7Ozs7Ozs7Ozs7O0lBQ3FCQSxVOzs7Ozs7Ozs7Ozs7Ozs4TEFDbkJDLEksR0FBTztBQUNMQyxnQkFBVSxJQURMO0FBRUxDLGVBQVNDLEdBQUdELE9BQUgsQ0FBVyw4QkFBWCxDQUZKLEVBRWdEO0FBQ3JERSxnQkFBVSxFQUhMO0FBSUxDLGNBQVEsQ0FKSDtBQUtMQywwQkFBb0IsRUFMZjtBQU1MQyxnQkFBVSxVQU5MO0FBT0xDLG1CQUFhLFVBUFI7QUFRTEMsbUJBQWEsS0FSUjtBQVNMQyxpQkFBVyxJQVROO0FBVUxDLG1CQUFhLEtBVlI7QUFXTEMscUJBQWUsQ0FYVjtBQVlMQyxtQkFBYSxDQVpSO0FBYUxDLG1CQUFhLEtBYlI7QUFjTEMsY0FBUSxFQWRIO0FBZUxDLG1CQUFhLEtBZlI7QUFnQkxDLFlBQU0sSUFoQkQsRUFnQk87QUFDWkMsbUJBQWEsRUFqQlI7QUFrQkxDLGdCQUFVLEVBbEJMO0FBbUJMQyxpQkFBVyxFQW5CTjtBQW9CTEMsaUJBQVcsT0FwQk47QUFxQkxDLHNCQUFnQixLQXJCWDtBQXNCTEMscUJBQWUsS0F0QlY7QUF1QkxDLHFCQUFlLEtBdkJWO0FBd0JMQyxlQUFTO0FBeEJKLEssUUF3TFBDLE8sR0FBVTtBQUNSQyxrQkFBWSx1QkFBSztBQUNmLFlBQUlDLFNBQVM7QUFDWEMsaUJBQU9DLGNBQUlDLE1BREE7QUFFWEMsa0JBQVFDLEVBQUVDLE1BQUYsQ0FBU0YsTUFGTjtBQUdYRyxrQkFBUWhDLEdBQUdpQyxjQUFILENBQWtCLFFBQWxCO0FBSEcsU0FBYjtBQUtBQywrQkFBYUMsY0FBYixHQUE4QkMsSUFBOUIsQ0FBbUMsaUJBQVM7QUFDMUNwQyxhQUFHcUMsT0FBSCxDQUFXO0FBQ1RDLGlCQUFLWCxjQUFJWSxZQURBO0FBRVQxQyxrQkFBTTRCLE1BRkc7QUFHVGUsb0JBQVEsTUFIQztBQUlUQyxvQkFBUTtBQUNOLDhCQUFnQixnQ0FEVjtBQUVOQyw2QkFBZSxZQUFZQyxLQUZyQixDQUUyQjtBQUYzQixhQUpDO0FBUVRDLHFCQUFTLGlCQUFTZCxDQUFULEVBQVk7QUFDbkJlLHNCQUFRQyxHQUFSLENBQVksTUFBWjtBQUNEO0FBVlEsV0FBWDtBQVlELFNBYkQ7QUFjRCxPQXJCTztBQXNCUkMsd0JBQWtCLDRCQUFNO0FBQ3RCLGNBQUt6QixPQUFMLEdBQWUsS0FBZjtBQUNELE9BeEJPO0FBeUJSO0FBQ0EwQixnQkFBVSxvQkFBTTtBQUNkLFlBQUlDLFlBQUo7QUFDQSxZQUFJckMsU0FBUyxNQUFLQSxNQUFsQjtBQUNBLFlBQUlYLFdBQVcsTUFBS0EsUUFBcEI7QUFDQSxZQUFJd0IsU0FBUztBQUNYYixrQkFBUVgsU0FBU2lELEVBQVQsR0FBY2pELFNBQVNpRCxFQUF2QixHQUE0QnRDLE1BRHpCO0FBRVhvQixrQkFBUWhDLEdBQUdpQyxjQUFILENBQWtCLFFBQWxCLENBRkc7QUFHWGtCLGdCQUFNO0FBSEssU0FBYjtBQUtBakIsK0JBQWFDLGNBQWIsR0FDR0MsSUFESCxDQUNRLGlCQUFTO0FBQ2IsaUJBQU9nQixvQkFBVUMsS0FBVixDQUNMMUIsY0FBSXFCLFFBREMsRUFFTCxFQUFFRyxNQUFNLFFBQVIsRUFBa0JHLE9BQU9YLEtBQXpCLEVBRkssRUFHTGxCLE1BSEssRUFJTCxNQUpLLENBQVA7QUFNRCxTQVJILEVBU0dXLElBVEgsQ0FTUSxlQUFPO0FBQ1hTLGtCQUFRQyxHQUFSLENBQVlTLEdBQVosRUFBaUIsTUFBakI7QUFDQSxjQUFJQSxJQUFJMUQsSUFBSixDQUFTMkQsVUFBVCxJQUF1QixLQUEzQixFQUFrQztBQUNoQ0MsMkJBQU1DLFNBQU4sQ0FBZ0JULElBQWhCLEVBQXNCLE1BQXRCO0FBQ0Q7QUFDRixTQWRIO0FBZUQsT0FsRE87QUFtRFJVLHNCQUFnQiwwQkFBTTtBQUNwQixZQUFJLENBQUMsTUFBS2hELFdBQU4sSUFBcUIsQ0FBQ1gsR0FBR2lDLGNBQUgsQ0FBa0IsVUFBbEIsQ0FBMUIsRUFBeUQ7QUFDdkQsZ0JBQUtYLE9BQUwsR0FBZSxJQUFmO0FBQ0QsU0FGRCxNQUVPO0FBQ0wsZ0JBQUtBLE9BQUwsR0FBZSxLQUFmO0FBQ0EsZ0JBQUtzQyxPQUFMO0FBQ0Q7QUFDRixPQTFETztBQTJEUkMsbUJBQWEsd0JBQUs7QUFDaEIsWUFBSUMsUUFBUSwwQkFBWjtBQUNBLFlBQUlBLE1BQU1DLElBQU4sQ0FBV2pDLEVBQUVDLE1BQUYsQ0FBU3VCLEtBQXBCLENBQUosRUFBZ0M7QUFDOUIsZ0JBQUtuQyxjQUFMLEdBQXNCLElBQXRCO0FBQ0EsZ0JBQUtDLGFBQUwsR0FBcUIsSUFBckI7QUFDQSxnQkFBS0osUUFBTCxHQUFnQmMsRUFBRUMsTUFBRixDQUFTdUIsS0FBekI7QUFDQSxjQUFJLE1BQUt6RCxJQUFMLENBQVVvQixTQUFWLENBQW9CK0MsTUFBcEIsS0FBK0IsQ0FBbkMsRUFBc0M7QUFDcEMsa0JBQUszQyxhQUFMLEdBQXFCLElBQXJCO0FBQ0QsV0FGRCxNQUVPO0FBQ0wsa0JBQUtBLGFBQUwsR0FBcUIsS0FBckI7QUFDRDtBQUNGLFNBVEQsTUFTTztBQUNMLGdCQUFLRixjQUFMLEdBQXNCLEtBQXRCO0FBQ0EsZ0JBQUtDLGFBQUwsR0FBcUIsS0FBckI7QUFDQSxnQkFBS0MsYUFBTCxHQUFxQixLQUFyQjtBQUNBLGdCQUFLTCxRQUFMLEdBQWdCYyxFQUFFQyxNQUFGLENBQVN1QixLQUF6QjtBQUNEO0FBQ0YsT0E1RU87QUE2RVI7QUFDQVcsa0JBQVksdUJBQUs7QUFDZixZQUFJbkMsRUFBRUMsTUFBRixDQUFTdUIsS0FBVCxDQUFlVSxNQUFmLEtBQTBCLENBQTFCLElBQStCLE1BQUs1QyxhQUF4QyxFQUF1RDtBQUNyRCxnQkFBS0MsYUFBTCxHQUFxQixJQUFyQjtBQUNBLGdCQUFLSixTQUFMLEdBQWlCYSxFQUFFQyxNQUFGLENBQVN1QixLQUExQjtBQUNELFNBSEQsTUFHTztBQUNMLGdCQUFLakMsYUFBTCxHQUFxQixLQUFyQjtBQUNBLGdCQUFLSixTQUFMLEdBQWlCYSxFQUFFQyxNQUFGLENBQVN1QixLQUExQjtBQUNEO0FBQ0YsT0F0Rk87QUF1RlI7QUFDQVksb0JBQWMsd0JBQU07QUFDbEIsWUFBSSxNQUFLL0MsY0FBVCxFQUF5QjtBQUN2QixnQkFBS0EsY0FBTCxHQUFzQixLQUF0QjtBQUNBc0MseUJBQU1VLFVBQU4sUUFBdUIsS0FBdkI7QUFDQWYsOEJBQ0dDLEtBREgsQ0FDUzFCLGNBQUl1QyxZQUFKLEdBQW1CLE1BQUtsRCxRQURqQyxFQUMyQyxJQUQzQyxFQUNpRCxJQURqRCxFQUN1RCxLQUR2RCxFQUVHb0IsSUFGSCxDQUVRLGVBQU87QUFDWDs7QUFDQSxnQkFBSW1CLElBQUkxRCxJQUFKLENBQVMyRCxVQUFULEtBQXdCLEtBQTVCLEVBQW1DO0FBQ2pDO0FBQ0QsYUFGRCxNQUVPO0FBQ0xDLDZCQUFNQyxTQUFOLFFBQXNCLE1BQXRCO0FBQ0Q7QUFDRixXQVRILEVBVUdVLEtBVkgsQ0FVUyxlQUFPO0FBQ1o7O0FBQ0Esa0JBQUtqRCxjQUFMLEdBQXNCLElBQXRCO0FBQ0FzQywyQkFBTUMsU0FBTixRQUFzQixNQUF0QjtBQUNBLGtCQUFLVyxNQUFMO0FBQ0QsV0FmSDtBQWdCRDtBQUNGLE9BN0dPO0FBOEdSQyxpQkFBVyxxQkFBTTtBQUNmLFlBQUlDLGFBQWE7QUFDZkMsZ0JBQU0sTUFBS3ZELFNBREk7QUFFZndELGlCQUFPLE1BQUt6RCxRQUZHO0FBR2YwRCx3QkFBYztBQUhDLFNBQWpCO0FBS0F0Qiw0QkFBVUMsS0FBVixDQUFnQjFCLGNBQUlnRCxPQUFwQixFQUE2QixJQUE3QixFQUFtQ0osVUFBbkMsRUFBK0MsTUFBL0MsRUFBdURuQyxJQUF2RCxDQUE0RCxlQUFPO0FBQ2pFLGNBQUltQixJQUFJMUQsSUFBSixDQUFTMkQsVUFBVCxLQUF3QixLQUE1QixFQUFtQztBQUNqQyxrQkFBS2xDLE9BQUwsR0FBZSxLQUFmO0FBQ0Esa0JBQUsrQyxNQUFMO0FBQ0FyRSxlQUFHNEUsY0FBSCxDQUFrQixVQUFsQixFQUE4QixNQUFLL0UsSUFBTCxDQUFVbUIsUUFBeEM7QUFDRCxXQUpELE1BSU87QUFDTHlDLDJCQUFNQyxTQUFOLFFBQXNCLFNBQXRCO0FBQ0Q7QUFDRixTQVJEO0FBU0QsT0E3SE87QUE4SFJtQixtQkFBYSx3QkFBSztBQUNoQixjQUFLQyxPQUFMLENBQWFELFdBQWIsQ0FBeUIvQyxDQUF6QixFQUE0QixLQUE1QixFQUFtQyxlQUFPO0FBQ3hDZSxrQkFBUUMsR0FBUixDQUFZUyxHQUFaO0FBQ0EsZ0JBQUs1QyxXQUFMLEdBQW1CNEMsSUFBSTVDLFdBQXZCO0FBQ0EsZ0JBQUtiLFFBQUwsR0FBZ0J5RCxJQUFJekQsUUFBcEI7QUFDQSxnQkFBS3dCLE9BQUwsR0FBZSxJQUFmO0FBQ0EsZ0JBQUsrQyxNQUFMO0FBQ0QsU0FORDtBQU9EO0FBdElPLEs7Ozs7OzJCQTlKSFUsTyxFQUFTO0FBQUE7O0FBQ2QsVUFBSUMsVUFBVWhGLEdBQUdpQyxjQUFILENBQWtCLFNBQWxCLENBQWQ7QUFDQSxVQUFJK0MsT0FBSixFQUFhO0FBQ1g5QywrQkFBYStDLE9BQWIsQ0FBcUIsS0FBckIsRUFBNEIsSUFBNUIsRUFBa0MsZUFBTztBQUN2Q3BDLGtCQUFRQyxHQUFSLENBQVksTUFBWjtBQUNELFNBRkQ7QUFHRDtBQUNELFdBQUtnQyxPQUFMLENBQWFJLGNBQWIsQ0FBNEIsS0FBS25GLE9BQWpDLEVBQTBDLGVBQU87QUFDL0M7O0FBQ0EsZUFBS1ksV0FBTCxHQUFtQjRDLElBQUk1QyxXQUF2QjtBQUNBLGVBQUtiLFFBQUwsR0FBZ0J5RCxJQUFJekQsUUFBcEI7QUFDQSxlQUFLdUUsTUFBTDtBQUNELE9BTEQ7QUFNQSxXQUFLekQsTUFBTCxHQUFjbUUsUUFBUUksS0FBdEI7QUFDQSxXQUFLQyxlQUFMO0FBQ0Q7QUFDRDs7OztzQ0FDa0I7QUFBQTs7QUFDaEIsVUFBSTlDLE1BQU1YLGNBQUkwRCxXQUFkO0FBQ0EsVUFBSXpFLFNBQVMsS0FBS0EsTUFBbEI7QUFDQXdDLDBCQUNHQyxLQURILENBQ1MxQixjQUFJMEQsV0FBSixHQUFrQixVQUFsQixHQUErQnpFLE1BRHhDLEVBQ2dELElBRGhELEVBQ3NELElBRHRELEVBQzRELEtBRDVELEVBRUd3QixJQUZILENBRVEsZUFBTztBQUNYUyxnQkFBUUMsR0FBUixDQUFZUyxHQUFaO0FBQ0EsZUFBS3RELFFBQUwsR0FBZ0JzRCxJQUFJMUQsSUFBSixDQUFTeUYsYUFBekI7QUFDQSxlQUFLbkYsa0JBQUwsR0FBMEJvRCxJQUFJMUQsSUFBSixDQUFTeUYsYUFBVCxDQUF1Qm5GLGtCQUF2QixDQUEwQ29GLElBQTFDLENBQ3hCO0FBQUEsaUJBQVFDLEtBQUtyQyxJQUFMLElBQWEsQ0FBckI7QUFBQSxTQUR3QixDQUExQjtBQUdBLGVBQUtzQyxPQUFMLEdBQ0UsS0FDQSxNQUNHbEMsSUFBSTFELElBQUosQ0FBU3lGLGFBQVQsQ0FBdUJJLGtCQUF2QixHQUNDbkMsSUFBSTFELElBQUosQ0FBU3lGLGFBQVQsQ0FBdUJLLGFBRjNCLENBREEsR0FJQSxHQUxGO0FBTUEsZUFBS2xGLGFBQUwsR0FBcUI4QyxJQUFJMUQsSUFBSixDQUFTeUYsYUFBVCxDQUF1QjdFLGFBQTVDO0FBQ0EsZUFBS0MsV0FBTCxHQUFtQjZDLElBQUkxRCxJQUFKLENBQVN5RixhQUFULENBQXVCTSxVQUExQztBQUNBLGVBQUsxRixNQUFMLEdBQWNxRCxJQUFJMUQsSUFBSixDQUFTeUYsYUFBVCxDQUF1QnBGLE1BQXJDO0FBQ0EsZUFBS0ssU0FBTCxHQUFpQixFQUNmZ0QsSUFBSTFELElBQUosQ0FBU3lGLGFBQVQsQ0FBdUJJLGtCQUF2QixJQUNBbkMsSUFBSTFELElBQUosQ0FBU3lGLGFBQVQsQ0FBdUJLLGFBRlIsQ0FBakI7QUFJQSxlQUFLdEIsTUFBTDtBQUNBLGVBQUt3QixTQUFMO0FBQ0EsZUFBS0MsWUFBTDtBQUNBLGVBQUtDLGNBQUwsQ0FBb0J4QyxJQUFJMUQsSUFBSixDQUFTeUYsYUFBVCxDQUF1QnBDLEVBQTNDO0FBQ0QsT0F6Qkg7QUEwQkQ7QUFDRDs7OzttQ0FDZXRDLE0sRUFBUTtBQUFBOztBQUNyQixVQUFJMEIsTUFBTVgsY0FBSXFFLFVBQUosR0FBaUJwRixNQUFqQixHQUEwQixNQUFwQztBQUNBd0MsMEJBQVVDLEtBQVYsQ0FBZ0JmLEdBQWhCLEVBQXFCLElBQXJCLEVBQTJCLElBQTNCLEVBQWlDLEtBQWpDLEVBQXdDRixJQUF4QyxDQUE2QyxlQUFPO0FBQ2xEUyxnQkFBUUMsR0FBUixDQUFZUyxHQUFaLEVBQWlCLFdBQWpCO0FBQ0EsZUFBSzBDLEtBQUwsR0FBYTFDLElBQUkxRCxJQUFKLENBQVN5RixhQUFULENBQXVCLENBQXZCLEVBQTBCcEMsRUFBdkM7QUFDQSxlQUFLbUIsTUFBTDtBQUNELE9BSkQ7QUFLRDtBQUNEOzs7O2dDQUNZO0FBQ1YsVUFBSTZCLFVBQVUsSUFBSUMsSUFBSixHQUFXQyxPQUFYLEVBQWQ7QUFDQTtBQUNBLFVBQUluRyxXQUFXLEtBQUtBLFFBQXBCO0FBQ0EsVUFBSVEsZ0JBQWdCLEtBQUtBLGFBQXpCO0FBQ0FvQyxjQUFRQyxHQUFSLENBQVksVUFBWjtBQUNBRCxjQUFRQyxHQUFSLENBQVlvRCxPQUFaO0FBQ0FyRCxjQUFRQyxHQUFSLENBQVlyQyxhQUFaO0FBQ0EsVUFBSXlGLFVBQVV6RixhQUFkLEVBQTZCO0FBQzNCLGFBQUtMLFFBQUwsR0FBZ0JxRCxlQUFNNEMsVUFBTixDQUNkQyxLQUFLQyxLQUFMLENBQVcsQ0FBQzlGLGdCQUFnQnlGLE9BQWpCLElBQTRCLElBQXZDLENBRGMsQ0FBaEI7QUFHQSxhQUFLN0IsTUFBTDtBQUNBbUMsbUJBQVcsS0FBS1gsU0FBaEIsRUFBMkIsR0FBM0I7QUFDRCxPQU5ELE1BTU87QUFDTGhELGdCQUFRQyxHQUFSLENBQVksYUFBWjtBQUNBLGFBQUt4QyxXQUFMLEdBQW1CLElBQW5CO0FBQ0EsYUFBSytELE1BQUw7QUFDRDtBQUNGO0FBQ0Q7Ozs7bUNBQ2U7QUFDYixVQUFJNkIsVUFBVSxJQUFJQyxJQUFKLEdBQVdDLE9BQVgsRUFBZDtBQURhLGtCQUVtQixLQUFLdkcsSUFGeEI7QUFBQSxVQUVQSSxRQUZPLFNBRVBBLFFBRk87QUFBQSxVQUVHUyxXQUZILFNBRUdBLFdBRkg7O0FBR2IsVUFBSXdGLFVBQVV4RixXQUFkLEVBQTJCO0FBQ3pCLGFBQUtMLFdBQUwsR0FBbUJvRCxlQUFNNEMsVUFBTixDQUNqQkMsS0FBS0MsS0FBTCxDQUFXLENBQUM3RixjQUFjd0YsT0FBZixJQUEwQixJQUFyQyxDQURpQixDQUFuQjtBQUdBLGFBQUs3QixNQUFMO0FBQ0FtQyxtQkFBVyxLQUFLVixZQUFoQixFQUE4QixHQUE5QjtBQUNELE9BTkQsTUFNTztBQUNMLGFBQUt0RixXQUFMLEdBQW1CLElBQW5CO0FBQ0EsYUFBSzZELE1BQUw7QUFDRDtBQUNGOzs7OEJBQ1M7QUFDUjs7QUFDQSxVQUFJcEIsT0FBTyxJQUFYO0FBQ0EsVUFBSSxLQUFLcEMsV0FBVCxFQUFzQjtBQUN0QixXQUFLQSxXQUFMLEdBQW1CLElBQW5CO0FBQ0EsVUFBSVksU0FBUztBQUNYZ0QsZUFBT3pFLEdBQUdpQyxjQUFILENBQWtCLFVBQWxCLENBREk7QUFFWHdFLG9CQUFZO0FBQ1ZDLGlCQUFPL0UsY0FBSUMsTUFERDtBQUVWK0UsZ0JBQU0sVUFGSTtBQUdWM0Usa0JBQVFoQyxHQUFHaUMsY0FBSCxDQUFrQixRQUFsQjtBQUhFLFNBRkQ7QUFPWDJFLGtCQUFVLENBUEM7QUFRWFgsZUFBTyxLQUFLQTtBQVJELE9BQWI7QUFVQS9ELDZCQUFhQyxjQUFiLEdBQ0dDLElBREgsQ0FDUSxpQkFBUztBQUNiLGVBQU9nQixvQkFBVUMsS0FBVixDQUNMMUIsY0FBSWtGLFdBREMsRUFFTCxFQUFFMUQsTUFBTSxRQUFSLEVBQWtCRyxPQUFPWCxLQUF6QixFQUZLLEVBR0xsQixNQUhLLEVBSUwsTUFKSyxDQUFQO0FBTUQsT0FSSCxFQVNHVyxJQVRILENBU1EsZUFBTztBQUNYUyxnQkFBUUMsR0FBUixDQUFZUyxHQUFaLEVBQWlCLFFBQWpCO0FBQ0EsWUFBSUEsSUFBSTFELElBQUosQ0FBUzJELFVBQVQsSUFBdUIsS0FBM0IsRUFBa0M7QUFDaEMsY0FBSUQsSUFBSTFELElBQUosQ0FBU3lGLGFBQWIsRUFBNEI7QUFDMUI7QUFDQXRGLGVBQUc4RyxjQUFILENBQWtCO0FBQ2hCQyx5QkFBV3hELElBQUkxRCxJQUFKLENBQVN5RixhQUFULENBQXVCeUIsU0FEbEI7QUFFaEJDLHdCQUFVekQsSUFBSTFELElBQUosQ0FBU3lGLGFBQVQsQ0FBdUIwQixRQUZqQjtBQUdoQkMsdUJBQVMxRCxJQUFJMUQsSUFBSixDQUFTeUYsYUFBVCxDQUF1QjJCLE9BSGhCO0FBSWhCQyx3QkFBVTNELElBQUkxRCxJQUFKLENBQVN5RixhQUFULENBQXVCNEIsUUFKakI7QUFLaEJDLHVCQUFTNUQsSUFBSTFELElBQUosQ0FBU3lGLGFBQVQsQ0FBdUI4QixJQUxoQjtBQU1oQnhFLHVCQUFTLGlCQUFTVyxHQUFULEVBQWM7QUFDckI7QUFDQUUsK0JBQU00RCxNQUFOLENBQ0Usc0NBQXNDcEUsS0FBS3JDLE1BRDdDLEVBRUUsQ0FGRjtBQUlELGVBWmU7QUFhaEIwRyxvQkFBTSxjQUFTL0QsR0FBVCxFQUFjO0FBQ2xCRSwrQkFBTUMsU0FBTixDQUFnQlQsSUFBaEIsRUFBc0IsTUFBdEI7QUFDRCxlQWZlO0FBZ0JoQnNFLHdCQUFVLG9CQUFXO0FBQ25CdEUscUJBQUtwQyxXQUFMLEdBQW1CLEtBQW5CO0FBQ0FvQyxxQkFBS29CLE1BQUw7QUFDRDtBQW5CZSxhQUFsQjtBQXFCRCxXQXZCRCxNQXVCTztBQUNMO0FBQ0FwQixpQkFBS3BDLFdBQUwsR0FBbUIsS0FBbkI7QUFDQW9DLGlCQUFLb0IsTUFBTDtBQUNBWiwyQkFBTTRELE1BQU4sQ0FDRSxzQ0FBc0NwRSxLQUFLcEQsSUFBTCxDQUFVZSxNQURsRCxFQUVFLENBRkY7QUFJRDtBQUNGLFNBakNELE1BaUNPO0FBQ0w2Qyx5QkFBTUMsU0FBTixDQUFnQlQsSUFBaEIsRUFBc0IsTUFBdEI7QUFDQUEsZUFBS3BDLFdBQUwsR0FBbUIsS0FBbkI7QUFDQW9DLGVBQUtvQixNQUFMO0FBQ0Q7QUFDRixPQWpESDtBQWtERDs7OztFQXhMcUNtRCxlQUFLQyxJOztrQkFBeEI3SCxVIiwiZmlsZSI6ImluZGV4LmpzIiwic291cmNlc0NvbnRlbnQiOlsiXG5pbXBvcnQgd2VweSBmcm9tICd3ZXB5JztcbmltcG9ydCBTRUxMIGZyb20gJy4uLy4uLy4uL3V0aWxzL3NlbGxGZXRjaC5qcyc7XG5pbXBvcnQgQXV0aFByb3ZpZGVyIGZyb20gJy4uLy4uLy4uL3V0aWxzL0F1dGhQcm92aWRlci5qcyc7XG5pbXBvcnQgdXRpbHMgZnJvbSAnLi4vLi4vLi4vdXRpbHMvdXRpbC5qcyc7XG5pbXBvcnQgQVBJIGZyb20gJy4uLy4uLy4uL3V0aWxzL2FwaS5qcyc7XG5pbXBvcnQgd3hSZXF1ZXN0IGZyb20gJy4uLy4uLy4uL3V0aWxzL3d4UmVxdWVzdC5qcyc7XG5leHBvcnQgZGVmYXVsdCBjbGFzcyBidXlTZWNLaWxsIGV4dGVuZHMgd2VweS5wYWdlIHtcbiAgZGF0YSA9IHtcbiAgICB1c2VySW5mbzogbnVsbCxcbiAgICBjYW5JVXNlOiB3eC5jYW5JVXNlKCdidXR0b24ub3Blbi10eXBlLmdldFVzZXJJbmZvJyksIC8v5Yik5pat5piv5ZCm5pSv5oyBYnV0dG9u5b6u5L+h5o6I5p2DXG4gICAgZ29vZERhdGE6IHt9LFxuICAgIHN0YXR1czogMSxcbiAgICBwcm9kdWN0RGVzY3JpcHRpb246IHt9LFxuICAgIHRpbWVMZWZ0OiAnMDA6MDA6MDAnLFxuICAgIHRpbWVMZWZ0QnV5OiAnMDA6MDA6MDAnLFxuICAgIHNlY0tpbGxGbGFnOiBmYWxzZSxcbiAgICByZXBlcnRvcnk6IHRydWUsXG4gICAgZXhwaXJlZEZsYWc6IGZhbHNlLFxuICAgIGVmZmVjdGl2ZURhdGU6IDAsXG4gICAgZXhwaXJlZERhdGU6IDAsXG4gICAgaGFzVXNlckluZm86IGZhbHNlLFxuICAgIGdvb2RJZDogJycsXG4gICAgcGF5bWVudEZsYWc6IGZhbHNlLFxuICAgIHN0b3A6IHRydWUsIC8v6Zi75q2i5py65Yi2XG4gICAgcG9wRXJyb3JNc2c6ICcnLFxuICAgIHBob25lTnVtOiAnJyxcbiAgICBwaG9uZUNvZGU6ICcnLFxuICAgIHBob25lVGV4dDogJ+iOt+WPlumqjOivgeeggScsXG4gICAgcGhvbmVDb2RlU3RhdGU6IGZhbHNlLFxuICAgIHBob25lTnVtU3RhdGU6IGZhbHNlLFxuICAgIHBob25lQnRuU3RhdGU6IGZhbHNlLFxuICAgIHBob25lTVM6IGZhbHNlXG4gIH07XG4gIG9uTG9hZChvcHRpb25zKSB7XG4gICAgbGV0IHVuaW9uaWQgPSB3eC5nZXRTdG9yYWdlU3luYygndW5pb25pZCcpO1xuICAgIGlmICh1bmlvbmlkKSB7XG4gICAgICBBdXRoUHJvdmlkZXIub25Mb2dpbignYnV5JywgbnVsbCwgcmVzID0+IHtcbiAgICAgICAgY29uc29sZS5sb2coJ+S5sOWutumJtOadgycpO1xuICAgICAgfSk7XG4gICAgfVxuICAgIHRoaXMuJHBhcmVudC5nZXRHbG9iYWxEYXRhcyh0aGlzLmNhbklVc2UsIHJlcyA9PiB7XG4gICAgICAndXNlIHN0cmljdCc7XG4gICAgICB0aGlzLmhhc1VzZXJJbmZvID0gcmVzLmhhc1VzZXJJbmZvO1xuICAgICAgdGhpcy51c2VySW5mbyA9IHJlcy51c2VySW5mbztcbiAgICAgIHRoaXMuJGFwcGx5KCk7XG4gICAgfSk7XG4gICAgdGhpcy5nb29kSWQgPSBvcHRpb25zLnNjZW5lO1xuICAgIHRoaXMucmVxdWVzdEdvb2RJbmZvKCk7XG4gIH1cbiAgLy8g6I635Y+W5ZWG5ZOB6K+m5oOFXG4gIHJlcXVlc3RHb29kSW5mbygpIHtcbiAgICBsZXQgdXJsID0gQVBJLmdldEdvb2RJbmZvO1xuICAgIGxldCBnb29kSWQgPSB0aGlzLmdvb2RJZDtcbiAgICB3eFJlcXVlc3RcbiAgICAgIC5mZXRjaChBUEkuZ2V0R29vZEluZm8gKyAnP2dvb2RJZD0nICsgZ29vZElkLCBudWxsLCBudWxsLCAnR0VUJylcbiAgICAgIC50aGVuKHJlcyA9PiB7XG4gICAgICAgIGNvbnNvbGUubG9nKHJlcyk7XG4gICAgICAgIHRoaXMuZ29vZERhdGEgPSByZXMuZGF0YS5yZXN1bHRDb250ZW50O1xuICAgICAgICB0aGlzLnByb2R1Y3REZXNjcmlwdGlvbiA9IHJlcy5kYXRhLnJlc3VsdENvbnRlbnQucHJvZHVjdERlc2NyaXB0aW9uLmZpbmQoXG4gICAgICAgICAgaXRlbSA9PiBpdGVtLnR5cGUgPT0gMlxuICAgICAgICApO1xuICAgICAgICB0aGlzLnBlcmNlbnQgPVxuICAgICAgICAgIDEyICtcbiAgICAgICAgICA4OCAqXG4gICAgICAgICAgICAocmVzLmRhdGEucmVzdWx0Q29udGVudC50b3RhbFNhbGVkUXVhbnRpdHkgL1xuICAgICAgICAgICAgICByZXMuZGF0YS5yZXN1bHRDb250ZW50LnRvdGFsUXVhbnRpdHkpICtcbiAgICAgICAgICAnJSc7XG4gICAgICAgIHRoaXMuZWZmZWN0aXZlRGF0ZSA9IHJlcy5kYXRhLnJlc3VsdENvbnRlbnQuZWZmZWN0aXZlRGF0ZTtcbiAgICAgICAgdGhpcy5leHBpcmVkRGF0ZSA9IHJlcy5kYXRhLnJlc3VsdENvbnRlbnQuZXhwaXJlZERhdDtcbiAgICAgICAgdGhpcy5zdGF0dXMgPSByZXMuZGF0YS5yZXN1bHRDb250ZW50LnN0YXR1cztcbiAgICAgICAgdGhpcy5yZXBlcnRvcnkgPSAhKFxuICAgICAgICAgIHJlcy5kYXRhLnJlc3VsdENvbnRlbnQudG90YWxTYWxlZFF1YW50aXR5ID09XG4gICAgICAgICAgcmVzLmRhdGEucmVzdWx0Q29udGVudC50b3RhbFF1YW50aXR5XG4gICAgICAgICk7XG4gICAgICAgIHRoaXMuJGFwcGx5KCk7XG4gICAgICAgIHRoaXMuY291bnRkb3duKCk7XG4gICAgICAgIHRoaXMuY291bnRkb3duQnV5KCk7XG4gICAgICAgIHRoaXMucmVxdWVzdFNrdUluZm8ocmVzLmRhdGEucmVzdWx0Q29udGVudC5pZCk7XG4gICAgICB9KTtcbiAgfVxuICAvL+iOt+WPluWVhuWTgXNrdeS/oeaBr1xuICByZXF1ZXN0U2t1SW5mbyhnb29kSWQpIHtcbiAgICBsZXQgdXJsID0gQVBJLmdldFNrdUluZm8gKyBnb29kSWQgKyAnL3NrdSc7XG4gICAgd3hSZXF1ZXN0LmZldGNoKHVybCwgbnVsbCwgbnVsbCwgJ0dFVCcpLnRoZW4ocmVzID0+IHtcbiAgICAgIGNvbnNvbGUubG9nKHJlcywgJ+iOt+WPluWVhuWTgXNrdeS/oeaBrycpO1xuICAgICAgdGhpcy5za3VJZCA9IHJlcy5kYXRhLnJlc3VsdENvbnRlbnRbMF0uaWQ7XG4gICAgICB0aGlzLiRhcHBseSgpO1xuICAgIH0pO1xuICB9XG4gIC8vIOmihOiuoeaKoui0reWAkuiuoeaXtlxuICBjb3VudGRvd24oKSB7XG4gICAgbGV0IGN1cnJlbnQgPSBuZXcgRGF0ZSgpLmdldFRpbWUoKTtcbiAgICAvLyBjb25zb2xlLmxvZyhjdXJyZW50KVxuICAgIGxldCBnb29kRGF0YSA9IHRoaXMuZ29vZERhdGE7XG4gICAgbGV0IGVmZmVjdGl2ZURhdGUgPSB0aGlzLmVmZmVjdGl2ZURhdGU7XG4gICAgY29uc29sZS5sb2coJy0tLS0tLS0tJyk7XG4gICAgY29uc29sZS5sb2coY3VycmVudCk7XG4gICAgY29uc29sZS5sb2coZWZmZWN0aXZlRGF0ZSk7XG4gICAgaWYgKGN1cnJlbnQgPCBlZmZlY3RpdmVEYXRlKSB7XG4gICAgICB0aGlzLnRpbWVMZWZ0ID0gdXRpbHMuZm9ybWF0VGltZShcbiAgICAgICAgTWF0aC5mbG9vcigoZWZmZWN0aXZlRGF0ZSAtIGN1cnJlbnQpIC8gMTAwMClcbiAgICAgICk7XG4gICAgICB0aGlzLiRhcHBseSgpO1xuICAgICAgc2V0VGltZW91dCh0aGlzLmNvdW50ZG93biwgNTAwKTtcbiAgICB9IGVsc2Uge1xuICAgICAgY29uc29sZS5sb2coJyMjIyMjIyMjIyMjJyk7XG4gICAgICB0aGlzLnNlY0tpbGxGbGFnID0gdHJ1ZTtcbiAgICAgIHRoaXMuJGFwcGx5KCk7XG4gICAgfVxuICB9XG4gIC8vIOaKoui0reWAkuiuoeaXtuaXtumXtFxuICBjb3VudGRvd25CdXkoKSB7XG4gICAgbGV0IGN1cnJlbnQgPSBuZXcgRGF0ZSgpLmdldFRpbWUoKTtcbiAgICBsZXQgeyBnb29kRGF0YSwgZXhwaXJlZERhdGUgfSA9IHRoaXMuZGF0YTtcbiAgICBpZiAoY3VycmVudCA8IGV4cGlyZWREYXRlKSB7XG4gICAgICB0aGlzLnRpbWVMZWZ0QnV5ID0gdXRpbHMuZm9ybWF0VGltZShcbiAgICAgICAgTWF0aC5mbG9vcigoZXhwaXJlZERhdGUgLSBjdXJyZW50KSAvIDEwMDApXG4gICAgICApO1xuICAgICAgdGhpcy4kYXBwbHkoKTtcbiAgICAgIHNldFRpbWVvdXQodGhpcy5jb3VudGRvd25CdXksIDUwMCk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHRoaXMuZXhwaXJlZEZsYWcgPSB0cnVlO1xuICAgICAgdGhpcy4kYXBwbHkoKTtcbiAgICB9XG4gIH1cbiAgc3ViTWFpbigpIHtcbiAgICAndXNlIHN0cmljdCc7XG4gICAgbGV0IHNlbGYgPSB0aGlzO1xuICAgIGlmICh0aGlzLnBheW1lbnRGbGFnKSByZXR1cm47XG4gICAgdGhpcy5wYXltZW50RmxhZyA9IHRydWU7XG4gICAgbGV0IHBhcmFtcyA9IHtcbiAgICAgIHBob25lOiB3eC5nZXRTdG9yYWdlU3luYygncGhvbmVOdW0nKSxcbiAgICAgIHByb1BheW1lbnQ6IHtcbiAgICAgICAgYXBwaWQ6IEFQSS5BUFBfSUQsXG4gICAgICAgIGJvZHk6ICflsI/nqIvluo8g5ZWG5ZOB56eS5p2AJyxcbiAgICAgICAgb3BlbklkOiB3eC5nZXRTdG9yYWdlU3luYygnb3BlbmlkJylcbiAgICAgIH0sXG4gICAgICBxdWFudGl0eTogMSxcbiAgICAgIHNrdUlkOiB0aGlzLnNrdUlkXG4gICAgfTtcbiAgICBBdXRoUHJvdmlkZXIuZ2V0QWNjZXNzVG9rZW4oKVxuICAgICAgLnRoZW4odG9rZW4gPT4ge1xuICAgICAgICByZXR1cm4gd3hSZXF1ZXN0LmZldGNoKFxuICAgICAgICAgIEFQSS5zdWJtaXRPcmRlcixcbiAgICAgICAgICB7IHR5cGU6ICdiZWFyZXInLCB2YWx1ZTogdG9rZW4gfSxcbiAgICAgICAgICBwYXJhbXMsXG4gICAgICAgICAgJ1BPU1QnXG4gICAgICAgICk7XG4gICAgICB9KVxuICAgICAgLnRoZW4ocmVzID0+IHtcbiAgICAgICAgY29uc29sZS5sb2cocmVzLCAn5o+Q5Lqk5ZWG5ZOB6LSt5LmwJyk7XG4gICAgICAgIGlmIChyZXMuZGF0YS5yZXN1bHRDb2RlID09ICcxMDAnKSB7XG4gICAgICAgICAgaWYgKHJlcy5kYXRhLnJlc3VsdENvbnRlbnQpIHtcbiAgICAgICAgICAgIC8vIOWcqOe6v+aUr+S7mFxuICAgICAgICAgICAgd3gucmVxdWVzdFBheW1lbnQoe1xuICAgICAgICAgICAgICB0aW1lU3RhbXA6IHJlcy5kYXRhLnJlc3VsdENvbnRlbnQudGltZVN0YW1wLFxuICAgICAgICAgICAgICBub25jZVN0cjogcmVzLmRhdGEucmVzdWx0Q29udGVudC5ub25jZVN0cixcbiAgICAgICAgICAgICAgcGFja2FnZTogcmVzLmRhdGEucmVzdWx0Q29udGVudC5wYWNrYWdlLFxuICAgICAgICAgICAgICBzaWduVHlwZTogcmVzLmRhdGEucmVzdWx0Q29udGVudC5zaWduVHlwZSxcbiAgICAgICAgICAgICAgcGF5U2lnbjogcmVzLmRhdGEucmVzdWx0Q29udGVudC5zaWduLFxuICAgICAgICAgICAgICBzdWNjZXNzOiBmdW5jdGlvbihyZXMpIHtcbiAgICAgICAgICAgICAgICAvLyDmlK/ku5jmiJDlip9cbiAgICAgICAgICAgICAgICB1dGlscy5wYWdlR28oXG4gICAgICAgICAgICAgICAgICAnL3BhZ2VzL2J1eWVyL3N1Y2Nlc3MvaW5kZXg/c2NlbmU9JyArIHNlbGYuZ29vZElkLFxuICAgICAgICAgICAgICAgICAgMlxuICAgICAgICAgICAgICAgICk7XG4gICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgIGZhaWw6IGZ1bmN0aW9uKHJlcykge1xuICAgICAgICAgICAgICAgIHV0aWxzLkVycm9yVGlwcyhzZWxmLCAn56eS5p2A5aSx6LSlJyk7XG4gICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgIGNvbXBsZXRlOiBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgICAgICBzZWxmLnBheW1lbnRGbGFnID0gZmFsc2U7XG4gICAgICAgICAgICAgICAgc2VsZi4kYXBwbHkoKTtcbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIC8vIOWIsOW6l+aUr+S7mFxuICAgICAgICAgICAgc2VsZi5wYXltZW50RmxhZyA9IGZhbHNlO1xuICAgICAgICAgICAgc2VsZi4kYXBwbHkoKTtcbiAgICAgICAgICAgIHV0aWxzLnBhZ2VHbyhcbiAgICAgICAgICAgICAgJy9wYWdlcy9idXllci9zdWNjZXNzL2luZGV4P3NjZW5lPScgKyBzZWxmLmRhdGEuZ29vZElkLFxuICAgICAgICAgICAgICAyXG4gICAgICAgICAgICApO1xuICAgICAgICAgIH1cbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICB1dGlscy5FcnJvclRpcHMoc2VsZiwgJ+enkuadgOWksei0pScpO1xuICAgICAgICAgIHNlbGYucGF5bWVudEZsYWcgPSBmYWxzZTtcbiAgICAgICAgICBzZWxmLiRhcHBseSgpO1xuICAgICAgICB9XG4gICAgICB9KTtcbiAgfVxuICBtZXRob2RzID0ge1xuICAgIGZvcm1TdWJtaXQ6IGUgPT4ge1xuICAgICAgbGV0IHBhcmFtcyA9IHtcbiAgICAgICAgYXBwSWQ6IEFQSS5BUFBfSUQsXG4gICAgICAgIGZvcm1JZDogZS5kZXRhaWwuZm9ybUlkLFxuICAgICAgICBvcGVuSWQ6IHd4LmdldFN0b3JhZ2VTeW5jKCdvcGVuaWQnKVxuICAgICAgfTtcbiAgICAgIEF1dGhQcm92aWRlci5nZXRBY2Nlc3NUb2tlbigpLnRoZW4odG9rZW4gPT4ge1xuICAgICAgICB3eC5yZXF1ZXN0KHtcbiAgICAgICAgICB1cmw6IEFQSS50ZW1wbGF0ZU5ld3MsXG4gICAgICAgICAgZGF0YTogcGFyYW1zLFxuICAgICAgICAgIG1ldGhvZDogJ1BPU1QnLFxuICAgICAgICAgIGhlYWRlcjoge1xuICAgICAgICAgICAgJ0NvbnRlbnQtVHlwZSc6ICdhcHBsaWNhdGlvbi9qc29uO2NoYXJzZXQ9VVRGLTgnLFxuICAgICAgICAgICAgQXV0aG9yaXphdGlvbjogJ2JlYXJlciAnICsgdG9rZW4gLy9iYXNlNjTliqDlr4ZsaXoteW91bGktd3g6c2VjcmV0XG4gICAgICAgICAgfSxcbiAgICAgICAgICBzdWNjZXNzOiBmdW5jdGlvbihlKSB7XG4gICAgICAgICAgICBjb25zb2xlLmxvZygn5Y+R6YCB5oiQ5YqfJyk7XG4gICAgICAgICAgfVxuICAgICAgICB9KTtcbiAgICAgIH0pO1xuICAgIH0sXG4gICAgY2xvc2VQaG9uZU1vZHVsZTogKCkgPT4ge1xuICAgICAgdGhpcy5waG9uZU1TID0gZmFsc2U7XG4gICAgfSxcbiAgICAvLyDorqLpmIXllYblk4FcbiAgICBib29rR29vZDogKCkgPT4ge1xuICAgICAgbGV0IHNlbGYgPSB0aGlzO1xuICAgICAgbGV0IGdvb2RJZCA9IHRoaXMuZ29vZElkO1xuICAgICAgbGV0IGdvb2REYXRhID0gdGhpcy5nb29kRGF0YTtcbiAgICAgIGxldCBwYXJhbXMgPSB7XG4gICAgICAgIGdvb2RJZDogZ29vZERhdGEuaWQgPyBnb29kRGF0YS5pZCA6IGdvb2RJZCxcbiAgICAgICAgb3BlbklkOiB3eC5nZXRTdG9yYWdlU3luYygnb3BlbmlkJyksXG4gICAgICAgIHR5cGU6IDFcbiAgICAgIH07XG4gICAgICBBdXRoUHJvdmlkZXIuZ2V0QWNjZXNzVG9rZW4oKVxuICAgICAgICAudGhlbih0b2tlbiA9PiB7XG4gICAgICAgICAgcmV0dXJuIHd4UmVxdWVzdC5mZXRjaChcbiAgICAgICAgICAgIEFQSS5ib29rR29vZCxcbiAgICAgICAgICAgIHsgdHlwZTogJ2JlYXJlcicsIHZhbHVlOiB0b2tlbiB9LFxuICAgICAgICAgICAgcGFyYW1zLFxuICAgICAgICAgICAgJ1BPU1QnXG4gICAgICAgICAgKTtcbiAgICAgICAgfSlcbiAgICAgICAgLnRoZW4ocmVzID0+IHtcbiAgICAgICAgICBjb25zb2xlLmxvZyhyZXMsICforqLpmIXmj5DphpInKTtcbiAgICAgICAgICBpZiAocmVzLmRhdGEucmVzdWx0Q29kZSA9PSAnMTAwJykge1xuICAgICAgICAgICAgdXRpbHMuRXJyb3JUaXBzKHNlbGYsICfpooTnuqbmiJDlip8nKTtcbiAgICAgICAgICB9XG4gICAgICAgIH0pO1xuICAgIH0sXG4gICAgc3VibWl0UHVyY2hhc2U6ICgpID0+IHtcbiAgICAgIGlmICghdGhpcy5oYXNVc2VySW5mbyB8fCAhd3guZ2V0U3RvcmFnZVN5bmMoJ3Bob25lTnVtJykpIHtcbiAgICAgICAgdGhpcy5waG9uZU1TID0gdHJ1ZTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHRoaXMucGhvbmVNUyA9IGZhbHNlO1xuICAgICAgICB0aGlzLnN1Yk1haW4oKTtcbiAgICAgIH1cbiAgICB9LFxuICAgIGNoYW5nZVBob25lOiBlID0+IHtcbiAgICAgIGxldCBteXJlZyA9IC9eWzFdWzMsNCw1LDcsOF1bMC05XXs5fSQvO1xuICAgICAgaWYgKG15cmVnLnRlc3QoZS5kZXRhaWwudmFsdWUpKSB7XG4gICAgICAgIHRoaXMucGhvbmVDb2RlU3RhdGUgPSB0cnVlO1xuICAgICAgICB0aGlzLnBob25lTnVtU3RhdGUgPSB0cnVlO1xuICAgICAgICB0aGlzLnBob25lTnVtID0gZS5kZXRhaWwudmFsdWU7XG4gICAgICAgIGlmICh0aGlzLmRhdGEucGhvbmVDb2RlLmxlbmd0aCA9PT0gNikge1xuICAgICAgICAgIHRoaXMucGhvbmVCdG5TdGF0ZSA9IHRydWU7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgdGhpcy5waG9uZUJ0blN0YXRlID0gZmFsc2U7XG4gICAgICAgIH1cbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHRoaXMucGhvbmVDb2RlU3RhdGUgPSBmYWxzZTtcbiAgICAgICAgdGhpcy5waG9uZU51bVN0YXRlID0gZmFsc2U7XG4gICAgICAgIHRoaXMucGhvbmVCdG5TdGF0ZSA9IGZhbHNlO1xuICAgICAgICB0aGlzLnBob25lTnVtID0gZS5kZXRhaWwudmFsdWU7XG4gICAgICB9XG4gICAgfSxcbiAgICAvL+i+k+WFpemqjOivgeegge+8mlxuICAgIGNoYW5nZUNvZGU6IGUgPT4ge1xuICAgICAgaWYgKGUuZGV0YWlsLnZhbHVlLmxlbmd0aCA9PT0gNiAmJiB0aGlzLnBob25lTnVtU3RhdGUpIHtcbiAgICAgICAgdGhpcy5waG9uZUJ0blN0YXRlID0gdHJ1ZTtcbiAgICAgICAgdGhpcy5waG9uZUNvZGUgPSBlLmRldGFpbC52YWx1ZTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHRoaXMucGhvbmVCdG5TdGF0ZSA9IGZhbHNlO1xuICAgICAgICB0aGlzLnBob25lQ29kZSA9IGUuZGV0YWlsLnZhbHVlO1xuICAgICAgfVxuICAgIH0sXG4gICAgLy/ojrflj5ZwaG9uZWNvZGVcbiAgICBnZXRQaG9uZUNvZGU6ICgpID0+IHtcbiAgICAgIGlmICh0aGlzLnBob25lQ29kZVN0YXRlKSB7XG4gICAgICAgIHRoaXMucGhvbmVDb2RlU3RhdGUgPSBmYWxzZTtcbiAgICAgICAgdXRpbHMuY291bnRfZG93bih0aGlzLCA2MDAwMCk7XG4gICAgICAgIHd4UmVxdWVzdFxuICAgICAgICAgIC5mZXRjaChBUEkuZ2V0UGhvbmVDb2RlICsgdGhpcy5waG9uZU51bSwgbnVsbCwgbnVsbCwgJ0dFVCcpXG4gICAgICAgICAgLnRoZW4ocmVzID0+IHtcbiAgICAgICAgICAgICd1c2Ugc3RyaWN0JztcbiAgICAgICAgICAgIGlmIChyZXMuZGF0YS5yZXN1bHRDb2RlID09PSAnMTAwJykge1xuICAgICAgICAgICAgICAvLyB1dGlsLkVycm9yVGlwcyh0aGlzLCflj5HpgIHmiJDlip8nKVxuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgdXRpbHMuRXJyb3JUaXBzKHRoaXMsICflj5HpgIHlpLHotKUnKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9KVxuICAgICAgICAgIC5jYXRjaChyZXEgPT4ge1xuICAgICAgICAgICAgJ3VzZSBzdHJpY3QnO1xuICAgICAgICAgICAgdGhpcy5waG9uZUNvZGVTdGF0ZSA9IHRydWU7XG4gICAgICAgICAgICB1dGlscy5FcnJvclRpcHModGhpcywgJ+WPkemAgeWksei0pScpO1xuICAgICAgICAgICAgdGhpcy4kYXBwbHkoKTtcbiAgICAgICAgICB9KTtcbiAgICAgIH1cbiAgICB9LFxuICAgIGJpbmRQaG9uZTogKCkgPT4ge1xuICAgICAgbGV0IGRhdGFQYXJhbXMgPSB7XG4gICAgICAgIGNvZGU6IHRoaXMucGhvbmVDb2RlLFxuICAgICAgICBwaG9uZTogdGhpcy5waG9uZU51bSxcbiAgICAgICAgdGVtcGxhdGVDb2RlOiAnU0hPUF9PV05FUl9WQ09ERV9NU0cnXG4gICAgICB9O1xuICAgICAgd3hSZXF1ZXN0LmZldGNoKEFQSS5jb2RlWUFOLCBudWxsLCBkYXRhUGFyYW1zLCAnUE9TVCcpLnRoZW4ocmVzID0+IHtcbiAgICAgICAgaWYgKHJlcy5kYXRhLnJlc3VsdENvZGUgPT09ICcxMDAnKSB7XG4gICAgICAgICAgdGhpcy5waG9uZU1TID0gZmFsc2U7XG4gICAgICAgICAgdGhpcy4kYXBwbHkoKTtcbiAgICAgICAgICB3eC5zZXRTdG9yYWdlU3luYygncGhvbmVOdW0nLCB0aGlzLmRhdGEucGhvbmVOdW0pO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIHV0aWxzLkVycm9yVGlwcyh0aGlzLCAn6aqM6K+B56CB6L6T5YWl5pyJ6K+vJyk7XG4gICAgICAgIH1cbiAgICAgIH0pO1xuICAgIH0sXG4gICAgZ2V0VXNlckluZm86IGUgPT4ge1xuICAgICAgdGhpcy4kcGFyZW50LmdldFVzZXJJbmZvKGUsICdidXknLCByZXMgPT4ge1xuICAgICAgICBjb25zb2xlLmxvZyhyZXMpO1xuICAgICAgICB0aGlzLmhhc1VzZXJJbmZvID0gcmVzLmhhc1VzZXJJbmZvO1xuICAgICAgICB0aGlzLnVzZXJJbmZvID0gcmVzLnVzZXJJbmZvO1xuICAgICAgICB0aGlzLnBob25lTVMgPSB0cnVlO1xuICAgICAgICB0aGlzLiRhcHBseSgpO1xuICAgICAgfSk7XG4gICAgfVxuICB9O1xufVxuIl19