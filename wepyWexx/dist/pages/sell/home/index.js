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

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var Home = function (_wepy$page) {
  _inherits(Home, _wepy$page);

  function Home() {
    var _ref;

    var _temp, _this, _ret;

    _classCallCheck(this, Home);

    for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    return _ret = (_temp = (_this = _possibleConstructorReturn(this, (_ref = Home.__proto__ || Object.getPrototypeOf(Home)).call.apply(_ref, [this].concat(args))), _this), _this.config = {
      navigationBarTitleText: '好物来'
    }, _this.data = {
      hasUserInfo: false, //用户授权状态
      userInfo: null,
      canIUse: wx.canIUse('button.open-type.getUserInfo'), //判断是否支持button微信授权
      ruleState: false, //规则显示状态
      popErrorMsg: null,
      useStatus: false,
      firstOnce: true,
      num: 10
    }, _this.methods = {
      showRule: function showRule() {
        _this.ruleState = true;
      },
      hideRule: function hideRule() {
        _this.ruleState = false;
      },
      getUserInfo: function getUserInfo(e) {
        var _this2 = this;

        this.$parent.getUserInfo(e, 'sell', function (res) {
          'use strict';

          _this2.hasUserInfo = res.hasUserInfo;
          _this2.userInfo = res.userInfo;
          _this2.$apply();
        });
      },
      pageGoSecKill: function pageGoSecKill() {
        'use strict';

        if (_wepy2.default.getStorageSync('phoneNum')) {
          if (this.useStatus) {
            _util2.default.pageGo('/pages/sell/secKill/index', 1);
          } else {
            _util2.default.ErrorTips(this, '请耐心等待');
          }
        } else {
          _util2.default.pageGo('/pages/sell/apply/index', 1);
        }
      },
      pageGoCash: function pageGoCash() {
        'use strict';

        if (this.useStatus) {
          _util2.default.pageGo('/pages/sell/withdraw/index', 1);
        } else {
          _util2.default.ErrorTips(this, '请耐心等待');
        }
      }
    }, _temp), _possibleConstructorReturn(_this, _ret);
  }

  _createClass(Home, [{
    key: 'onLoad',
    value: function onLoad() {
      var _this3 = this;

      this.$parent.getGlobalDatas(this.canIUse, function (res) {
        console.log('获取用户信息');
        _this3.hasUserInfo = res.hasUserInfo;
        _this3.userInfo = res.userInfo;
        _this3.$apply();
      });
    }
  }, {
    key: 'onShow',
    value: function onShow() {
      var _this4 = this;

      if (_wepy2.default.getStorageSync('phoneNum') && this.firstOnce) {
        _sellFetch2.default.queryShopOwnerWhiteList(_wepy2.default.getStorageSync('phoneNum'), function (res) {
          'use strict';

          console.log(res);
          if (res.data.resultCode === '100') {
            _this4.firstOnce = false;
            _this4.$apply();
            if (res.data.resultContent) {
              if (res.data.resultContent.status == 0) {
                _util2.default.ErrorTips(_this4, '您已申请试用，审核中');
                _this4.useStatus = false;
                _this4.$apply();
              } else if (res.data.resultContent.status == 1) {
                _this4.getToken(function (res) {
                  console.log(res);
                });
                _this4.useStatus = true;
                _this4.$apply();
              }
            }
          }
        });
      }
    }
  }, {
    key: 'getToken',
    value: function getToken(callback) {
      _AuthProvider2.default.onLogin('sell', null, function (res) {
        callback(res);
      });
    }
  }]);

  return Home;
}(_wepy2.default.page);


Page(require('./../../../npm/wepy/lib/wepy.js').default.$createPage(Home , 'pages/sell/home/index'));

//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImluZGV4LmpzIl0sIm5hbWVzIjpbIkhvbWUiLCJjb25maWciLCJuYXZpZ2F0aW9uQmFyVGl0bGVUZXh0IiwiZGF0YSIsImhhc1VzZXJJbmZvIiwidXNlckluZm8iLCJjYW5JVXNlIiwid3giLCJydWxlU3RhdGUiLCJwb3BFcnJvck1zZyIsInVzZVN0YXR1cyIsImZpcnN0T25jZSIsIm51bSIsIm1ldGhvZHMiLCJzaG93UnVsZSIsImhpZGVSdWxlIiwiZ2V0VXNlckluZm8iLCJlIiwiJHBhcmVudCIsInJlcyIsIiRhcHBseSIsInBhZ2VHb1NlY0tpbGwiLCJ3ZXB5IiwiZ2V0U3RvcmFnZVN5bmMiLCJ1dGlscyIsInBhZ2VHbyIsIkVycm9yVGlwcyIsInBhZ2VHb0Nhc2giLCJnZXRHbG9iYWxEYXRhcyIsImNvbnNvbGUiLCJsb2ciLCJTRUxMIiwicXVlcnlTaG9wT3duZXJXaGl0ZUxpc3QiLCJyZXN1bHRDb2RlIiwicmVzdWx0Q29udGVudCIsInN0YXR1cyIsImdldFRva2VuIiwiY2FsbGJhY2siLCJBdXRoUHJvdmlkZXIiLCJvbkxvZ2luIiwicGFnZSJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7O0FBQ0E7Ozs7QUFDQTs7OztBQUNBOzs7O0FBQ0E7Ozs7Ozs7Ozs7OztJQUNxQkEsSTs7Ozs7Ozs7Ozs7Ozs7a0xBQ25CQyxNLEdBQVM7QUFDUEMsOEJBQXdCO0FBRGpCLEssUUFHVEMsSSxHQUFPO0FBQ0xDLG1CQUFhLEtBRFIsRUFDZTtBQUNwQkMsZ0JBQVUsSUFGTDtBQUdMQyxlQUFTQyxHQUFHRCxPQUFILENBQVcsOEJBQVgsQ0FISixFQUdnRDtBQUNyREUsaUJBQVcsS0FKTixFQUlhO0FBQ2xCQyxtQkFBYSxJQUxSO0FBTUxDLGlCQUFXLEtBTk47QUFPTEMsaUJBQVcsSUFQTjtBQVFMQyxXQUFLO0FBUkEsSyxRQWdEUEMsTyxHQUFVO0FBQ1JDLGdCQUFVLG9CQUFNO0FBQ2QsY0FBS04sU0FBTCxHQUFpQixJQUFqQjtBQUNELE9BSE87QUFJUk8sZ0JBQVUsb0JB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eSBmcm9tICd3ZXB5JztcbmltcG9ydCBTRUxMIGZyb20gJy4uLy4uLy4uL3V0aWxzL3NlbGxGZXRjaC5qcyc7XG5pbXBvcnQgQXV0aFByb3ZpZGVyIGZyb20gJy4uLy4uLy4uL3V0aWxzL0F1dGhQcm92aWRlci5qcyc7XG5pbXBvcnQgdXRpbHMgZnJvbSAnLi4vLi4vLi4vdXRpbHMvdXRpbC5qcyc7XG5leHBvcnQgZGVmYXVsdCBjbGFzcyBIb21lIGV4dGVuZHMgd2VweS5wYWdlIHtcbiAgY29uZmlnID0ge1xuICAgIG5hdmlnYXRpb25CYXJUaXRsZVRleHQ6ICflpb3nianmnaUnXG4gIH07XG4gIGRhdGEgPSB7XG4gICAgaGFzVXNlckluZm86IGZhbHNlLCAvL+eUqOaIt+aOiOadg+eKtuaAgVxuICAgIHVzZXJJbmZvOiBudWxsLFxuICAgIGNhbklVc2U6IHd4LmNhbklVc2UoJ2J1dHRvbi5vcGVuLXR5cGUuZ2V0VXNlckluZm8nKSwgLy/liKTmlq3mmK/lkKbmlK/mjIFidXR0b27lvq7kv6HmjojmnYNcbiAgICBydWxlU3RhdGU6IGZhbHNlLCAvL+inhOWImeaYvuekuueKtuaAgVxuICAgIHBvcEVycm9yTXNnOiBudWxsLFxuICAgIHVzZVN0YXR1czogZmFsc2UsXG4gICAgZmlyc3RPbmNlOiB0cnVlLFxuICAgIG51bTogMTBcbiAgfTtcbiAgb25Mb2FkKCkge1xuICAgIHRoaXMuJHBhcmVudC5nZXRHbG9iYWxEYXRhcyh0aGlzLmNhbklVc2UsIHJlcyA9PiB7XG4gICAgICBjb25zb2xlLmxvZygn6I635Y+W55So5oi35L+h5oGvJyk7XG4gICAgICB0aGlzLmhhc1VzZXJJbmZvID0gcmVzLmhhc1VzZXJJbmZvO1xuICAgICAgdGhpcy51c2VySW5mbyA9IHJlcy51c2VySW5mbztcbiAgICAgIHRoaXMuJGFwcGx5KCk7XG4gICAgfSk7XG4gIH1cbiAgb25TaG93KCkge1xuICAgIGlmICh3ZXB5LmdldFN0b3JhZ2VTeW5jKCdwaG9uZU51bScpICYmIHRoaXMuZmlyc3RPbmNlKSB7XG4gICAgICBTRUxMLnF1ZXJ5U2hvcE93bmVyV2hpdGVMaXN0KHdlcHkuZ2V0U3RvcmFnZVN5bmMoJ3Bob25lTnVtJyksIHJlcyA9PiB7XG4gICAgICAgICd1c2Ugc3RyaWN0JztcbiAgICAgICAgY29uc29sZS5sb2cocmVzKTtcbiAgICAgICAgaWYgKHJlcy5kYXRhLnJlc3VsdENvZGUgPT09ICcxMDAnKSB7XG4gICAgICAgICAgdGhpcy5maXJzdE9uY2UgPSBmYWxzZTtcbiAgICAgICAgICB0aGlzLiRhcHBseSgpO1xuICAgICAgICAgIGlmIChyZXMuZGF0YS5yZXN1bHRDb250ZW50KSB7XG4gICAgICAgICAgICBpZiAocmVzLmRhdGEucmVzdWx0Q29udGVudC5zdGF0dXMgPT0gMCkge1xuICAgICAgICAgICAgICB1dGlscy5FcnJvclRpcHModGhpcywgJ+aCqOW3sueUs+ivt+ivleeUqO+8jOWuoeaguOS4rScpO1xuICAgICAgICAgICAgICB0aGlzLnVzZVN0YXR1cyA9IGZhbHNlO1xuICAgICAgICAgICAgICB0aGlzLiRhcHBseSgpO1xuICAgICAgICAgICAgfSBlbHNlIGlmIChyZXMuZGF0YS5yZXN1bHRDb250ZW50LnN0YXR1cyA9PSAxKSB7XG4gICAgICAgICAgICAgIHRoaXMuZ2V0VG9rZW4ocmVzID0+IHtcbiAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhyZXMpO1xuICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgdGhpcy51c2VTdGF0dXMgPSB0cnVlO1xuICAgICAgICAgICAgICB0aGlzLiRhcHBseSgpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgfSk7XG4gICAgfVxuICB9XG4gIGdldFRva2VuKGNhbGxiYWNrKSB7XG4gICAgQXV0aFByb3ZpZGVyLm9uTG9naW4oJ3NlbGwnLCBudWxsLCByZXMgPT4ge1xuICAgICAgY2FsbGJhY2socmVzKTtcbiAgICB9KTtcbiAgfVxuICBtZXRob2RzID0ge1xuICAgIHNob3dSdWxlOiAoKSA9PiB7XG4gICAgICB0aGlzLnJ1bGVTdGF0ZSA9IHRydWU7XG4gICAgfSxcbiAgICBoaWRlUnVsZTogKCkgPT4ge1xuICAgICAgdGhpcy5ydWxlU3RhdGUgPSBmYWxzZTtcbiAgICB9LFxuICAgIGdldFVzZXJJbmZvOiBmdW5jdGlvbihlKSB7XG4gICAgICB0aGlzLiRwYXJlbnQuZ2V0VXNlckluZm8oZSwgJ3NlbGwnLCByZXMgPT4ge1xuICAgICAgICAndXNlIHN0cmljdCc7XG4gICAgICAgIHRoaXMuaGFzVXNlckluZm8gPSByZXMuaGFzVXNlckluZm87XG4gICAgICAgIHRoaXMudXNlckluZm8gPSByZXMudXNlckluZm87XG4gICAgICAgIHRoaXMuJGFwcGx5KCk7XG4gICAgICB9KTtcbiAgICB9LFxuICAgIHBhZ2VHb1NlY0tpbGwoKSB7XG4gICAgICAndXNlIHN0cmljdCc7XG4gICAgICBpZiAod2VweS5nZXRTdG9yYWdlU3luYygncGhvbmVOdW0nKSkge1xuICAgICAgICBpZiAodGhpcy51c2VTdGF0dXMpIHtcbiAgICAgICAgICB1dGlscy5wYWdlR28oJy9wYWdlcy9zZWxsL3NlY0tpbGwvaW5kZXgnLCAxKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICB1dGlscy5FcnJvclRpcHModGhpcywgJ+ivt+iAkOW/g+etieW+hScpO1xuICAgICAgICB9XG4gICAgICB9IGVsc2Uge1xuICAgICAgICB1dGlscy5wYWdlR28oJy9wYWdlcy9zZWxsL2FwcGx5L2luZGV4JywgMSk7XG4gICAgICB9XG4gICAgfSxcbiAgICBwYWdlR29DYXNoKCkge1xuICAgICAgJ3VzZSBzdHJpY3QnO1xuICAgICAgaWYgKHRoaXMudXNlU3RhdHVzKSB7XG4gICAgICAgIHV0aWxzLnBhZ2VHbygnL3BhZ2VzL3NlbGwvd2l0aGRyYXcvaW5kZXgnLCAxKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHV0aWxzLkVycm9yVGlwcyh0aGlzLCAn6K+36ICQ5b+D562J5b6FJyk7XG4gICAgICB9XG4gICAgfVxuICB9O1xufVxuIl19