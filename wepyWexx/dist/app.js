'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});


var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _wepy = require('./npm/wepy/lib/wepy.js');

var _wepy2 = _interopRequireDefault(_wepy);

require('./npm/wepy-async-function/index.js');

var _api = require('./utils/api.js');

var _api2 = _interopRequireDefault(_api);

var _wxRequest = require('./utils/wxRequest.js');

var _wxRequest2 = _interopRequireDefault(_wxRequest);

var _util = require('./utils/util.js');

var _util2 = _interopRequireDefault(_util);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var _default = function (_wepy$app) {
  _inherits(_default, _wepy$app);

  function _default() {
    _classCallCheck(this, _default);

    var _this2 = _possibleConstructorReturn(this, (_default.__proto__ || Object.getPrototypeOf(_default)).call(this));

    _this2.config = {
      pages: ['pages/sell/home/index', 'pages/sell/secKill/index', 'pages/sell/apply/index', 'pages/sell/withdraw/index', 'pages/sell/record/index', 'pages/sell/poster/index', 'pages/buyer/secKill/index', 'pages/buyer/success/index', 'pages/sell/webView/index'],
      window: {
        backgroundTextStyle: 'light',
        navigationBarBackgroundColor: '#FF3939',
        navigationBarTitleText: '好物来',
        navigationBarTextStyle: '#FFF'
      }
    };
    _this2.globalData = {
      userInfo: null
    };

    _this2.use('requestfix');
    _this2.use('promisify');
    return _this2;
  }

  _createClass(_default, [{
    key: 'onLaunch',
    value: function onLaunch() {
      // this.testAsync();
      console.log(_api2.default);
    }
    // 全局获取用户信息

  }, {
    key: 'getUserInfo',
    value: function getUserInfo(res, type, callback) {
      var _this = this;
      console.log('---获取用户信息---');
      console.log(res.detail);
      console.log('----------');
      if (res.detail.errMsg == 'getUserInfo:fail auth deny') {
        _wepy2.default.showModal({
          title: '用户授权',
          content: '本小程序需用户授权，请重新点击按钮授权。',
          mask: true,
          confirmColor: '#F45C43',
          success: function success(res) {}
        });
      } else if (res.detail.errMsg == 'getUserInfo:ok') {
        var userInfo = res.detail.userInfo;
        _this.globalData.userInfo = userInfo;
        _wepy2.default.setStorageSync('userinfo', userInfo);
        _this.wxLogin(res.detail.encryptedData, res.detail.iv, type);
        callback({
          hasUserInfo: true,
          userInfo: userInfo
        });
      }
    }
    //授权登录，拿token

  }, {
    key: 'wxLogin',
    value: function wxLogin(encryptedData, iv, type) {
      console.log(33333);
      _wepy2.default.setStorageSync('userType', type); //user登录方式，sell，buy

      wx.login({
        success: function success(res) {
          console.log(44444);
          if (res.code) {
            var params = {
              appid: _api2.default.APP_ID,
              code: res.code,
              encryptedData: encryptedData,
              iv: iv
            };
            if (type === 'sell') {
              _wxRequest2.default.fetch(_api2.default.authLogin + '?_iscreateUser=false', null, params, 'POST').then(function (res) {
                'use strict';
                // console.log()

                if (res.data.resultCode === '100') {
                  console.log(res.data.resultContent);
                  _wepy2.default.setStorageSync('unionid', res.data.resultContent.unionId);
                  _wepy2.default.setStorageSync('openid', res.data.resultContent.openId);
                  _util2.default.pageGo('/pages/sell/apply/index', 1);
                  // AuthProvider.onLogin(type, res => {
                  //     console.log(res, '获取token')
                  // })
                } else {
                  console.log('error');
                }
              });
            } else if (type === 'buy') {
              _wxRequest2.default.fetch(_api2.default.authLogin, null, params, 'POST').then(function (res) {
                'use strict';
                // console.log()

                if (res.data.resultCode === '100') {
                  console.log(res.data.resultContent);
                  _wepy2.default.setStorageSync('unionid', res.data.resultContent.unionId);
                  _wepy2.default.setStorageSync('openid', res.data.resultContent.openId);
                  AuthProvider.onLogin(type, null, function (res) {
                    console.log(res, '获取token');
                  });
                } else {
                  console.log('error');
                }
              });
            }
          }
        },
        fail: function fail(req) {}
      });
    }
    // 获取全局属性 用户信息，登录状态

  }, {
    key: 'getGlobalDatas',
    value: function getGlobalDatas(canIUse, callback) {
      var _this = this;
      var userinfos = _wepy2.default.getStorageSync('userinfo');
      if (userinfos.hasOwnProperty('nickName')) {
        console.log(userinfos, '获取全局属性 用户信息，登录状态');
        callback({
          userInfo: userinfos,
          hasUserInfo: true
        });
      } else {
        console.log('globalData userInfo');
        if (_this.globalData.userInfo) {
          callback({
            userInfo: app.globalData.userInfo,
            hasUserInfo: true
          });
        } else if (canIUse) {
          // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
          // 所以此处加入 callback 以防止这种情况
          _this.userInfoReadyCallback = function (res) {
            callback({
              userInfo: res.userInfo,
              hasUserInfo: true
            });
          };
        } else if (!canIUse) {
          console.log('low version');
          _wepy2.default.showModal({
            // 向用户提示升级至最新版微信。
            title: '提示',
            confirmColor: '#F45C43',
            content: '微信版本过低，请升级至最新版。',
            mask: true
          });
        } else {
          // 在没有 open-type=getUserInfo 版本的兼容处理
          wx.getUserInfo({
            success: function (_success) {
              function success(_x) {
                return _success.apply(this, arguments);
              }

              success.toString = function () {
                return _success.toString();
              };

              return success;
            }(function (res) {
              _this.globalData.userInfo = res.userInfo;
              callback({
                userInfo: res.userInfo,
                hasUserInfo: true
              });
              console.log(success);
            })
          });
        }
      }
    }
  }]);

  return _default;
}(_wepy2.default.app);


App(require('./npm/wepy/lib/wepy.js').default.$createApp(_default, {"noPromiseAPI":["createSelectorQuery"]}));
require('./_wepylogs.js')

//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImFwcC5qcyJdLCJuYW1lcyI6WyJjb25maWciLCJwYWdlcyIsIndpbmRvdyIsImJhY2tncm91bmRUZXh0U3R5bGUiLCJuYXZpZ2F0aW9uQmFyQmFja2dyb3VuZENvbG9yIiwibmF2aWdhdGlvbkJhclRpdGxlVGV4dCIsIm5hdmlnYXRpb25CYXJUZXh0U3R5bGUiLCJnbG9iYWxEYXRhIiwidXNlckluZm8iLCJ1c2UiLCJjb25zb2xlIiwibG9nIiwiQVBJIiwicmVzIiwidHlwZSIsImNhbGxiYWNrIiwiX3RoaXMiLCJkZXRhaWwiLCJlcnJNc2ciLCJ3ZXB5Iiwic2hvd01vZGFsIiwidGl0bGUiLCJjb250ZW50IiwibWFzayIsImNvbmZpcm1Db2xvciIsInN1Y2Nlc3MiLCJzZXRTdG9yYWdlU3luYyIsInd4TG9naW4iLCJlbmNyeXB0ZWREYXRhIiwiaXYiLCJoYXNVc2VySW5mbyIsInd4IiwibG9naW4iLCJjb2RlIiwicGFyYW1zIiwiYXBwaWQiLCJBUFBfSUQiLCJ3eFJlcXVlc3QiLCJmZXRjaCIsImF1dGhMb2dpbiIsInRoZW4iLCJkYXRhIiwicmVzdWx0Q29kZSIsInJlc3VsdENvbnRlbnQiLCJ1bmlvbklkIiwib3BlbklkIiwidXRpbCIsInBhZ2VHbyIsIkF1dGhQcm92aWRlciIsIm9uTG9naW4iLCJmYWlsIiwicmVxIiwiY2FuSVVzZSIsInVzZXJpbmZvcyIsImdldFN0b3JhZ2VTeW5jIiwiaGFzT3duUHJvcGVydHkiLCJhcHAiLCJ1c2VySW5mb1JlYWR5Q2FsbGJhY2siLCJnZXRVc2VySW5mbyJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7O0FBQ0E7Ozs7QUFDQTs7QUFFQTs7OztBQUNBOzs7O0FBQ0E7Ozs7Ozs7Ozs7Ozs7OztBQTJCRSxzQkFBYztBQUFBOztBQUFBOztBQUFBLFdBeEJkQSxNQXdCYyxHQXhCTDtBQUNQQyxhQUFPLENBQ0wsdUJBREssRUFFTCwwQkFGSyxFQUdMLHdCQUhLLEVBSUwsMkJBSkssRUFLTCx5QkFMSyxFQU1MLHlCQU5LLEVBT0ws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LFNBQVQ7QUFJRCxPQU5ELE1BTU87QUFDTHBCLGdCQUFRQyxHQUFSLENBQVkscUJBQVo7QUFDQSxZQUFJSyxNQUFNVCxVQUFOLENBQWlCQyxRQUFyQixFQUErQjtBQUM3Qk8sbUJBQVM7QUFDUFAsc0JBQVVnRCxJQUFJakQsVUFBSixDQUFlQyxRQURsQjtBQUVQc0IseUJBQWE7QUFGTixXQUFUO0FBSUQsU0FMRCxNQUtPLElBQUlzQixPQUFKLEVBQWE7QUFDbEI7QUFDQTtBQUNBcEMsZ0JBQU15QyxxQkFBTixHQUE4QixlQUFPO0FBQ25DMUMscUJBQVM7QUFDUFAsd0JBQVVLLElBQUlMLFFBRFA7QUFFUHNCLDJCQUFhO0FBRk4sYUFBVDtBQUlELFdBTEQ7QUFNRCxTQVRNLE1BU0EsSUFBSSxDQUFDc0IsT0FBTCxFQUFjO0FBQ25CMUMsa0JBQVFDLEdBQVIsQ0FBWSxhQUFaO0FBQ0FRLHlCQUFLQyxTQUFMLENBQWU7QUFDYjtBQUNBQyxtQkFBTyxJQUZNO0FBR2JHLDBCQUFjLFNBSEQ7QUFJYkYscUJBQVMsaUJBSkk7QUFLYkMsa0JBQU07QUFMTyxXQUFmO0FBT0QsU0FUTSxNQVNBO0FBQ0w7QUFDQVEsYUFBRzJCLFdBQUgsQ0FBZTtBQUNiakM7QUFBQTtBQUFBO0FBQUE7O0FBQUE7QUFBQTtBQUFBOztBQUFBO0FBQUEsY0FBUyxlQUFPO0FBQ2RULG9CQUFNVCxVQUFOLENBQWlCQyxRQUFqQixHQUE0QkssSUFBSUwsUUFBaEM7QUFDQU8sdUJBQVM7QUFDUFAsMEJBQVVLLElBQUlMLFFBRFA7QUFFUHNCLDZCQUFhO0FBRk4sZUFBVDtBQUlBcEIsc0JBQVFDLEdBQVIsQ0FBWWMsT0FBWjtBQUNELGFBUEQ7QUFEYSxXQUFmO0FBVUQ7QUFDRjtBQUNGOzs7O0VBM0swQk4sZUFBS3FDLEciLCJmaWxlIjoiYXBwLmpzIiwic291cmNlc0NvbnRlbnQiOlsiXG5pbXBvcnQgd2VweSBmcm9tICd3ZXB5JztcbmltcG9ydCAnd2VweS1hc3luYy1mdW5jdGlvbic7XG5cbmltcG9ydCBBUEkgZnJvbSAnLi91dGlscy9hcGkuanMnO1xuaW1wb3J0IHd4UmVxdWVzdCBmcm9tICcuL3V0aWxzL3d4UmVxdWVzdC5qcyc7XG5pbXBvcnQgdXRpbCBmcm9tICcuL3V0aWxzL3V0aWwuanMnO1xuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBleHRlbmRzIHdlcHkuYXBwIHtcbiAgY29uZmlnID0ge1xuICAgIHBhZ2VzOiBbXG4gICAgICAncGFnZXMvc2VsbC9ob21lL2luZGV4JyxcbiAgICAgICdwYWdlcy9zZWxsL3NlY0tpbGwvaW5kZXgnLFxuICAgICAgJ3BhZ2VzL3NlbGwvYXBwbHkvaW5kZXgnLFxuICAgICAgJ3BhZ2VzL3NlbGwvd2l0aGRyYXcvaW5kZXgnLFxuICAgICAgJ3BhZ2VzL3NlbGwvcmVjb3JkL2luZGV4JyxcbiAgICAgICdwYWdlcy9zZWxsL3Bvc3Rlci9pbmRleCcsXG4gICAgICAncGFnZXMvYnV5ZXIvc2VjS2lsbC9pbmRleCcsXG4gICAgICAncGFnZXMvYnV5ZXIvc3VjY2Vzcy9pbmRleCcsXG4gICAgICAncGFnZXMvc2VsbC93ZWJWaWV3L2luZGV4J1xuICAgIF0sXG4gICAgd2luZG93OiB7XG4gICAgICBiYWNrZ3JvdW5kVGV4dFN0eWxlOiAnbGlnaHQnLFxuICAgICAgbmF2aWdhdGlvbkJhckJhY2tncm91bmRDb2xvcjogJyNGRjM5MzknLFxuICAgICAgbmF2aWdhdGlvbkJhclRpdGxlVGV4dDogJ+WlveeJqeadpScsXG4gICAgICBuYXZpZ2F0aW9uQmFyVGV4dFN0eWxlOiAnI0ZGRidcbiAgICB9XG4gIH07XG5cbiAgZ2xvYmFsRGF0YSA9IHtcbiAgICB1c2VySW5mbzogbnVsbFxuICB9O1xuXG4gIGNvbnN0cnVjdG9yKCkge1xuICAgIHN1cGVyKCk7XG4gICAgdGhpcy51c2UoJ3JlcXVlc3RmaXgnKTtcbiAgICB0aGlzLnVzZSgncHJvbWlzaWZ5Jyk7XG4gIH1cblxuICBvbkxhdW5jaCgpIHtcbiAgICAvLyB0aGlzLnRlc3RBc3luYygpO1xuICAgIGNvbnNvbGUubG9nKEFQSSk7XG4gIH1cbiAgLy8g5YWo5bGA6I635Y+W55So5oi35L+h5oGvXG4gIGdldFVzZXJJbmZvKHJlcywgdHlwZSwgY2FsbGJhY2spIHtcbiAgICBsZXQgX3RoaXMgPSB0aGlzO1xuICAgIGNvbnNvbGUubG9nKCctLS3ojrflj5bnlKjmiLfkv6Hmga8tLS0nKTtcbiAgICBjb25zb2xlLmxvZyhyZXMuZGV0YWlsKTtcbiAgICBjb25zb2xlLmxvZygnLS0tLS0tLS0tLScpO1xuICAgIGlmIChyZXMuZGV0YWlsLmVyck1zZyA9PSAnZ2V0VXNlckluZm86ZmFpbCBhdXRoIGRlbnknKSB7XG4gICAgICB3ZXB5LnNob3dNb2RhbCh7XG4gICAgICAgIHRpdGxlOiAn55So5oi35o6I5p2DJyxcbiAgICAgICAgY29udGVudDogJ+acrOWwj+eoi+W6j+mcgOeUqOaIt+aOiOadg++8jOivt+mHjeaWsOeCueWHu+aMiemSruaOiOadg+OAgicsXG4gICAgICAgIG1hc2s6IHRydWUsXG4gICAgICAgIGNvbmZpcm1Db2xvcjogJyNGNDVDNDMnLFxuICAgICAgICBzdWNjZXNzOiBmdW5jdGlvbihyZXMpIHt9XG4gICAgICB9KTtcbiAgICB9IGVsc2UgaWYgKHJlcy5kZXRhaWwuZXJyTXNnID09ICdnZXRVc2VySW5mbzpvaycpIHtcbiAgICAgIGxldCB1c2VySW5mbyA9IHJlcy5kZXRhaWwudXNlckluZm87XG4gICAgICBfdGhpcy5nbG9iYWxEYXRhLnVzZXJJbmZvID0gdXNlckluZm87XG4gICAgICB3ZXB5LnNldFN0b3JhZ2VTeW5jKCd1c2VyaW5mbycsIHVzZXJJbmZvKTtcbiAgICAgIF90aGlzLnd4TG9naW4ocmVzLmRldGFpbC5lbmNyeXB0ZWREYXRhLCByZXMuZGV0YWlsLml2LCB0eXBlKTtcbiAgICAgIGNhbGxiYWNrKHtcbiAgICAgICAgaGFzVXNlckluZm86IHRydWUsXG4gICAgICAgIHVzZXJJbmZvOiB1c2VySW5mb1xuICAgICAgfSk7XG4gICAgfVxuICB9XG4gIC8v5o6I5p2D55m75b2V77yM5ou/dG9rZW5cbiAgd3hMb2dpbihlbmNyeXB0ZWREYXRhLCBpdiwgdHlwZSkge1xuICAgIGNvbnNvbGUubG9nKDMzMzMzKTtcbiAgICB3ZXB5LnNldFN0b3JhZ2VTeW5jKCd1c2VyVHlwZScsIHR5cGUpOyAvL3VzZXLnmbvlvZXmlrnlvI/vvIxzZWxs77yMYnV5XG5cbiAgICB3eC5sb2dpbih7XG4gICAgICBzdWNjZXNzOiBmdW5jdGlvbihyZXMpIHtcbiAgICAgICAgY29uc29sZS5sb2coNDQ0NDQpO1xuICAgICAgICBpZiAocmVzLmNvZGUpIHtcbiAgICAgICAgICBsZXQgcGFyYW1zID0ge1xuICAgICAgICAgICAgYXBwaWQ6IEFQSS5BUFBfSUQsXG4gICAgICAgICAgICBjb2RlOiByZXMuY29kZSxcbiAgICAgICAgICAgIGVuY3J5cHRlZERhdGE6IGVuY3J5cHRlZERhdGEsXG4gICAgICAgICAgICBpdjogaXZcbiAgICAgICAgICB9O1xuICAgICAgICAgIGlmICh0eXBlID09PSAnc2VsbCcpIHtcbiAgICAgICAgICAgIHd4UmVxdWVzdFxuICAgICAgICAgICAgICAuZmV0Y2goXG4gICAgICAgICAgICAgICAgQVBJLmF1dGhMb2dpbiArICc/X2lzY3JlYXRlVXNlcj1mYWxzZScsXG4gICAgICAgICAgICAgICAgbnVsbCxcbiAgICAgICAgICAgICAgICBwYXJhbXMsXG4gICAgICAgICAgICAgICAgJ1BPU1QnXG4gICAgICAgICAgICAgIClcbiAgICAgICAgICAgICAgLnRoZW4ocmVzID0+IHtcbiAgICAgICAgICAgICAgICAndXNlIHN0cmljdCc7XG4gICAgICAgICAgICAgICAgLy8gY29uc29sZS5sb2coKVxuICAgICAgICAgICAgICAgIGlmIChyZXMuZGF0YS5yZXN1bHRDb2RlID09PSAnMTAwJykge1xuICAgICAgICAgICAgICAgICAgY29uc29sZS5sb2cocmVzLmRhdGEucmVzdWx0Q29udGVudCk7XG4gICAgICAgICAgICAgICAgICB3ZXB5LnNldFN0b3JhZ2VTeW5jKFxuICAgICAgICAgICAgICAgICAgICAndW5pb25pZCcsXG4gICAgICAgICAgICAgICAgICAgIHJlcy5kYXRhLnJlc3VsdENvbnRlbnQudW5pb25JZFxuICAgICAgICAgICAgICAgICAgKTtcbiAgICAgICAgICAgICAgICAgIHdlcHkuc2V0U3RvcmFnZVN5bmMoJ29wZW5pZCcsIHJlcy5kYXRhLnJlc3VsdENvbnRlbnQub3BlbklkKTtcbiAgICAgICAgICAgICAgICAgIHV0aWwucGFnZUdvKCcvcGFnZXMvc2VsbC9hcHBseS9pbmRleCcsIDEpO1xuICAgICAgICAgICAgICAgICAgLy8gQXV0aFByb3ZpZGVyLm9uTG9naW4odHlwZSwgcmVzID0+IHtcbiAgICAgICAgICAgICAgICAgIC8vICAgICBjb25zb2xlLmxvZyhyZXMsICfojrflj5Z0b2tlbicpXG4gICAgICAgICAgICAgICAgICAvLyB9KVxuICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICBjb25zb2xlLmxvZygnZXJyb3InKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgIH0pO1xuICAgICAgICAgIH0gZWxzZSBpZiAodHlwZSA9PT0gJ2J1eScpIHtcbiAgICAgICAgICAgIHd4UmVxdWVzdC5mZXRjaChBUEkuYXV0aExvZ2luLCBudWxsLCBwYXJhbXMsICdQT1NUJykudGhlbihyZXMgPT4ge1xuICAgICAgICAgICAgICAndXNlIHN0cmljdCc7XG4gICAgICAgICAgICAgIC8vIGNvbnNvbGUubG9nKClcbiAgICAgICAgICAgICAgaWYgKHJlcy5kYXRhLnJlc3VsdENvZGUgPT09ICcxMDAnKSB7XG4gICAgICAgICAgICAgICAgY29uc29sZS5sb2cocmVzLmRhdGEucmVzdWx0Q29udGVudCk7XG4gICAgICAgICAgICAgICAgd2VweS5zZXRTdG9yYWdlU3luYygndW5pb25pZCcsIHJlcy5kYXRhLnJlc3VsdENvbnRlbnQudW5pb25JZCk7XG4gICAgICAgICAgICAgICAgd2VweS5zZXRTdG9yYWdlU3luYygnb3BlbmlkJywgcmVzLmRhdGEucmVzdWx0Q29udGVudC5vcGVuSWQpO1xuICAgICAgICAgICAgICAgIEF1dGhQcm92aWRlci5vbkxvZ2luKHR5cGUsIG51bGwsIHJlcyA9PiB7XG4gICAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhyZXMsICfojrflj5Z0b2tlbicpO1xuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKCdlcnJvcicpO1xuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgIH0sXG4gICAgICBmYWlsOiBmdW5jdGlvbihyZXEpIHt9XG4gICAgfSk7XG4gIH1cbiAgLy8g6I635Y+W5YWo5bGA5bGe5oCnIOeUqOaIt+S/oeaBr++8jOeZu+W9leeKtuaAgVxuICBnZXRHbG9iYWxEYXRhcyhjYW5JVXNlLCBjYWxsYmFjaykge1xuICAgIGxldCBfdGhpcyA9IHRoaXM7XG4gICAgbGV0IHVzZXJpbmZvcyA9IHdlcHkuZ2V0U3RvcmFnZVN5bmMoJ3VzZXJpbmZvJyk7XG4gICAgaWYgKHVzZXJpbmZvcy5oYXNPd25Qcm9wZXJ0eSgnbmlja05hbWUnKSkge1xuICAgICAgY29uc29sZS5sb2codXNlcmluZm9zLCAn6I635Y+W5YWo5bGA5bGe5oCnIOeUqOaIt+S/oeaBr++8jOeZu+W9leeKtuaAgScpO1xuICAgICAgY2FsbGJhY2soe1xuICAgICAgICB1c2VySW5mbzogdXNlcmluZm9zLFxuICAgICAgICBoYXNVc2VySW5mbzogdHJ1ZVxuICAgICAgfSk7XG4gICAgfSBlbHNlIHtcbiAgICAgIGNvbnNvbGUubG9nKCdnbG9iYWxEYXRhIHVzZXJJbmZvJyk7XG4gICAgICBpZiAoX3RoaXMuZ2xvYmFsRGF0YS51c2VySW5mbykge1xuICAgICAgICBjYWxsYmFjayh7XG4gICAgICAgICAgdXNlckluZm86IGFwcC5nbG9iYWxEYXRhLnVzZXJJbmZvLFxuICAgICAgICAgIGhhc1VzZXJJbmZvOiB0cnVlXG4gICAgICAgIH0pO1xuICAgICAgfSBlbHNlIGlmIChjYW5JVXNlKSB7XG4gICAgICAgIC8vIOeUseS6jiBnZXRVc2VySW5mbyDmmK/nvZHnu5zor7fmsYLvvIzlj6/og73kvJrlnKggUGFnZS5vbkxvYWQg5LmL5ZCO5omN6L+U5ZueXG4gICAgICAgIC8vIOaJgOS7peatpOWkhOWKoOWFpSBjYWxsYmFjayDku6XpmLLmraLov5nnp43mg4XlhrVcbiAgICAgICAgX3RoaXMudXNlckluZm9SZWFkeUNhbGxiYWNrID0gcmVzID0+IHtcbiAgICAgICAgICBjYWxsYmFjayh7XG4gICAgICAgICAgICB1c2VySW5mbzogcmVzLnVzZXJJbmZvLFxuICAgICAgICAgICAgaGFzVXNlckluZm86IHRydWVcbiAgICAgICAgICB9KTtcbiAgICAgICAgfTtcbiAgICAgIH0gZWxzZSBpZiAoIWNhbklVc2UpIHtcbiAgICAgICAgY29uc29sZS5sb2coJ2xvdyB2ZXJzaW9uJyk7XG4gICAgICAgIHdlcHkuc2hvd01vZGFsKHtcbiAgICAgICAgICAvLyDlkJHnlKjmiLfmj5DnpLrljYfnuqfoh7PmnIDmlrDniYjlvq7kv6HjgIJcbiAgICAgICAgICB0aXRsZTogJ+aPkOekuicsXG4gICAgICAgICAgY29uZmlybUNvbG9yOiAnI0Y0NUM0MycsXG4gICAgICAgICAgY29udGVudDogJ+W+ruS/oeeJiOacrOi/h+S9ju+8jOivt+WNh+e6p+iHs+acgOaWsOeJiOOAgicsXG4gICAgICAgICAgbWFzazogdHJ1ZVxuICAgICAgICB9KTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIC8vIOWcqOayoeaciSBvcGVuLXR5cGU9Z2V0VXNlckluZm8g54mI5pys55qE5YW85a655aSE55CGXG4gICAgICAgIHd4LmdldFVzZXJJbmZvKHtcbiAgICAgICAgICBzdWNjZXNzOiByZXMgPT4ge1xuICAgICAgICAgICAgX3RoaXMuZ2xvYmFsRGF0YS51c2VySW5mbyA9IHJlcy51c2VySW5mbztcbiAgICAgICAgICAgIGNhbGxiYWNrKHtcbiAgICAgICAgICAgICAgdXNlckluZm86IHJlcy51c2VySW5mbyxcbiAgICAgICAgICAgICAgaGFzVXNlckluZm86IHRydWVcbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgY29uc29sZS5sb2coc3VjY2Vzcyk7XG4gICAgICAgICAgfVxuICAgICAgICB9KTtcbiAgICAgIH1cbiAgICB9XG4gIH1cbn1cbiJdfQ==