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

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var Poster = function (_wepy$page) {
  _inherits(Poster, _wepy$page);

  function Poster() {
    var _ref;

    var _temp, _this2, _ret;

    _classCallCheck(this, Poster);

    for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    return _ret = (_temp = (_this2 = _possibleConstructorReturn(this, (_ref = Poster.__proto__ || Object.getPrototypeOf(Poster)).call.apply(_ref, [this].concat(args))), _this2), _this2.config = {
      navigationBarTitleText: '生成海报'
    }, _this2.data = {
      imgUrl: null,
      scene: null,
      dataParams: '',
      stop: true
    }, _this2.methods = {
      downloadPoster: function downloadPoster() {
        if (_this2.stop) {
          _this2.stop = false;
          'use strict';
          console.log(_this2.imgUrl);
          var _this = _this2;
          var imgUrl = _this2.imgUrl;
          wx.downloadFile({
            url: imgUrl,
            success: function success(res) {
              console.log(res);
              var tempFilePath = res.tempFilePath;
              wx.getSetting({
                success: function success(res) {
                  if (!res.authSetting['scope.writePhotosAlbum']) {
                    wx.authorize({
                      scope: 'scope.writePhotosAlbum',
                      success: function success() {
                        _this.saveImageToPhotosAlbum(tempFilePath);
                      },
                      fail: function fail() {
                        console.log('fail----');
                        wx.showModal({
                          // 向用户提示升级至最新版微信。
                          title: '授权失败',
                          confirmColor: '#F45C43',
                          content: '为成功保存图片，请重新授权。',
                          mask: true,
                          success: function success(res) {
                            if (res.confirm) {
                              wx.openSetting({
                                success: function success() {
                                  if (res.authSetting['scope.writePhotosAlbum']) {
                                    _this.saveImageToPhotosAlbum(tempFilePath);
                                  }
                                }
                              });
                            }
                          }
                        });
                      }
                    });
                  } else {
                    _this.saveImageToPhotosAlbum(tempFilePath);
                  }
                },
                fail: function fail(req) {
                  console.log(req);
                }
              });
            },
            complete: function complete() {
              _this.stop = true;
              _this.$apply();
            }
          });
        }
      },
      formSubmit: function formSubmit(e) {
        _util2.default.formSubmit(e);
      }
    }, _temp), _possibleConstructorReturn(_this2, _ret);
  }

  _createClass(Poster, [{
    key: 'onLoad',
    value: function onLoad(options) {
      var _this3 = this;

      console.log(options);
      this.imgUrl = options.dataUrl;
      this.scene = options.scene;
      _sellFetch2.default.getGoodDetail(options.scene, function (res) {
        'use strict';

        if (res.data.resultCode === '100') {
          _this3.dataParams = res.data.resultContent;
          _this3.$apply();
        }
      });
    }
  }, {
    key: 'onShareAppMessage',
    value: function onShareAppMessage() {
      return _util2.default.openShare('【秒杀价￥' + this.dataParams.showPrice + '】 ' + this.dataParams.name, '/pages/buyer/secKill/index?scene=' + this.scene, this.dataParams.coverPhoto, function (rex) {
        'use strict';

        console.log(rex);
      });
    }
  }, {
    key: 'saveImageToPhotosAlbum',
    value: function saveImageToPhotosAlbum(tempFilePath) {
      var self = this;
      wx.saveImageToPhotosAlbum({
        filePath: tempFilePath,
        success: function success(data) {
          console.log(data.errMsg);
          if (data.errMsg == 'saveImageToPhotosAlbum:ok') {
            self.showMask = false;
            _util2.default.successShowText('保存图片成功');
          }
        },
        fail: function fail(err) {
          console.log('failsaveImageToPhotosAlbum----');
          console.log(err);
        }
      });
    }
  }]);

  return Poster;
}(_wepy2.default.page);


Page(require('./../../../npm/wepy/lib/wepy.js').default.$createPage(Poster , 'pages/sell/poster/index'));

//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImluZGV4LmpzIl0sIm5hbWVzIjpbIlBvc3RlciIsImNvbmZpZyIsIm5hdmlnYXRpb25CYXJUaXRsZVRleHQiLCJkYXRhIiwiaW1nVXJsIiwic2NlbmUiLCJkYXRhUGFyYW1zIiwic3RvcCIsIm1ldGhvZHMiLCJkb3dubG9hZFBvc3RlciIsImNvbnNvbGUiLCJsb2ciLCJfdGhpcyIsInd4IiwiZG93bmxvYWRGaWxlIiwidXJsIiwic3VjY2VzcyIsInJlcyIsInRlbXBGaWxlUGF0aCIsImdldFNldHRpbmciLCJhdXRoU2V0dGluZyIsImF1dGhvcml6ZSIsInNjb3BlIiwic2F2ZUltYWdlVG9QaG90b3NBbGJ1bSIsImZhaWwiLCJzaG93TW9kYWwiLCJ0aXRsZSIsImNvbmZpcm1Db2xvciIsImNvbnRlbnQiLCJtYXNrIiwiY29uZmlybSIsIm9wZW5TZXR0aW5nIiwicmVxIiwiY29tcGxldGUiLCIkYXBwbHkiLCJmb3JtU3VibWl0IiwidXRpbHMiLCJlIiwib3B0aW9ucyIsImRhdGFVcmwiLCJTRUxMIiwiZ2V0R29vZERldGFpbCIsInJlc3VsdENvZGUiLCJyZXN1bHRDb250ZW50Iiwib3BlblNoYXJlIiwic2hvd1ByaWNlIiwibmFtZSIsImNvdmVyUGhvdG8iLCJyZXgiLCJzZWxmIiwiZmlsZVBhdGgiLCJlcnJNc2ciLCJzaG93TWFzayIsInN1Y2Nlc3NTaG93VGV4dCIsImVyciIsIndlcHkiLCJwYWdlIl0sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7QUFDQTs7OztBQUNBOzs7O0FBQ0E7Ozs7QUFDQTs7OztBQUNBOzs7Ozs7Ozs7Ozs7SUFFcUJBLE07Ozs7Ozs7Ozs7Ozs7O3lMQUNuQkMsTSxHQUFTO0FBQ1BDLDhCQUF3QjtBQURqQixLLFNBR1RDLEksR0FBTztBQUNMQyxjQUFRLElBREg7QUFFTEMsYUFBTyxJQUZGO0FBR0xDLGtCQUFZLEVBSFA7QUFJTEMsWUFBTTtBQUpELEssU0E4Q1BDLE8sR0FBVTtBQUNSQyxzQkFBZ0IsMEJBQU07QUFDcEIsWUFBSSxPQUFL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U2IsSUFBVCxFQUFlO0FBQ3RCTyxrQkFBUUMsR0FBUixDQUFZUixLQUFLZ0QsTUFBakI7QUFDQSxjQUFJaEQsS0FBS2dELE1BQUwsSUFBZSwyQkFBbkIsRUFBZ0Q7QUFDOUNGLGlCQUFLRyxRQUFMLEdBQWdCLEtBQWhCO0FBQ0FoQiwyQkFBTWlCLGVBQU4sQ0FBc0IsUUFBdEI7QUFDRDtBQUNGLFNBUnVCO0FBU3hCN0IsWUFUd0IsZ0JBU25COEIsR0FUbUIsRUFTZDtBQUNSNUMsa0JBQVFDLEdBQVIsQ0FBWSxnQ0FBWjtBQUNBRCxrQkFBUUMsR0FBUixDQUFZMkMsR0FBWjtBQUNEO0FBWnVCLE9BQTFCO0FBY0Q7Ozs7RUFqRGlDQyxlQUFLQyxJOztrQkFBcEJ4RCxNIiwiZmlsZSI6ImluZGV4LmpzIiwic291cmNlc0NvbnRlbnQiOlsiXG5pbXBvcnQgd2VweSBmcm9tICd3ZXB5JztcbmltcG9ydCBTRUxMIGZyb20gJy4uLy4uLy4uL3V0aWxzL3NlbGxGZXRjaC5qcyc7XG5pbXBvcnQgQXV0aFByb3ZpZGVyIGZyb20gJy4uLy4uLy4uL3V0aWxzL0F1dGhQcm92aWRlci5qcyc7XG5pbXBvcnQgdXRpbHMgZnJvbSAnLi4vLi4vLi4vdXRpbHMvdXRpbC5qcyc7XG5pbXBvcnQgQVBJIGZyb20gJy4uLy4uLy4uL3V0aWxzL2FwaS5qcyc7XG5cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIFBvc3RlciBleHRlbmRzIHdlcHkucGFnZSB7XG4gIGNvbmZpZyA9IHtcbiAgICBuYXZpZ2F0aW9uQmFyVGl0bGVUZXh0OiAn55Sf5oiQ5rW35oqlJ1xuICB9O1xuICBkYXRhID0ge1xuICAgIGltZ1VybDogbnVsbCxcbiAgICBzY2VuZTogbnVsbCxcbiAgICBkYXRhUGFyYW1zOiAnJyxcbiAgICBzdG9wOiB0cnVlXG4gIH07XG4gIG9uTG9hZChvcHRpb25zKSB7XG4gICAgY29uc29sZS5sb2cob3B0aW9ucyk7XG4gICAgdGhpcy5pbWdVcmwgPSBvcHRpb25zLmRhdGFVcmw7XG4gICAgdGhpcy5zY2VuZSA9IG9wdGlvbnMuc2NlbmU7XG4gICAgU0VMTC5nZXRHb29kRGV0YWlsKG9wdGlvbnMuc2NlbmUsIHJlcyA9PiB7XG4gICAgICAndXNlIHN0cmljdCc7XG4gICAgICBpZiAocmVzLmRhdGEucmVzdWx0Q29kZSA9PT0gJzEwMCcpIHtcbiAgICAgICAgdGhpcy5kYXRhUGFyYW1zID0gcmVzLmRhdGEucmVzdWx0Q29udGVudDtcbiAgICAgICAgdGhpcy4kYXBwbHkoKTtcbiAgICAgIH1cbiAgICB9KTtcbiAgfVxuICBvblNoYXJlQXBwTWVzc2FnZSgpIHtcbiAgICByZXR1cm4gdXRpbHMub3BlblNoYXJlKFxuICAgICAgJ+OAkOenkuadgOS7t++/pScgKyB0aGlzLmRhdGFQYXJhbXMuc2hvd1ByaWNlICsgJ+OAkSAnICsgdGhpcy5kYXRhUGFyYW1zLm5hbWUsXG4gICAgICAnL3BhZ2VzL2J1eWVyL3NlY0tpbGwvaW5kZXg/c2NlbmU9JyArIHRoaXMuc2NlbmUsXG4gICAgICB0aGlzLmRhdGFQYXJhbXMuY292ZXJQaG90byxcbiAgICAgIHJleCA9PiB7XG4gICAgICAgICd1c2Ugc3RyaWN0JztcbiAgICAgICAgY29uc29sZS5sb2cocmV4KTtcbiAgICAgIH1cbiAgICApO1xuICB9XG4gIHNhdmVJbWFnZVRvUGhvdG9zQWxidW0odGVtcEZpbGVQYXRoKSB7XG4gICAgbGV0IHNlbGYgPSB0aGlzO1xuICAgIHd4LnNhdmVJbWFnZVRvUGhvdG9zQWxidW0oe1xuICAgICAgZmlsZVBhdGg6IHRlbXBGaWxlUGF0aCxcbiAgICAgIHN1Y2Nlc3M6IGZ1bmN0aW9uKGRhdGEpIHtcbiAgICAgICAgY29uc29sZS5sb2coZGF0YS5lcnJNc2cpO1xuICAgICAgICBpZiAoZGF0YS5lcnJNc2cgPT0gJ3NhdmVJbWFnZVRvUGhvdG9zQWxidW06b2snKSB7XG4gICAgICAgICAgc2VsZi5zaG93TWFzayA9IGZhbHNlO1xuICAgICAgICAgIHV0aWxzLnN1Y2Nlc3NTaG93VGV4dCgn5L+d5a2Y5Zu+54mH5oiQ5YqfJyk7XG4gICAgICAgIH1cbiAgICAgIH0sXG4gICAgICBmYWlsKGVycikge1xuICAgICAgICBjb25zb2xlLmxvZygnZmFpbHNhdmVJbWFnZVRvUGhvdG9zQWxidW0tLS0tJyk7XG4gICAgICAgIGNvbnNvbGUubG9nKGVycik7XG4gICAgICB9XG4gICAgfSk7XG4gIH1cbiAgbWV0aG9kcyA9IHtcbiAgICBkb3dubG9hZFBvc3RlcjogKCkgPT4ge1xuICAgICAgaWYgKHRoaXMuc3RvcCkge1xuICAgICAgICB0aGlzLnN0b3AgPSBmYWxzZTtcbiAgICAgICAgKCd1c2Ugc3RyaWN0Jyk7XG4gICAgICAgIGNvbnNvbGUubG9nKHRoaXMuaW1nVXJsKTtcbiAgICAgICAgbGV0IF90aGlzID0gdGhpcztcbiAgICAgICAgbGV0IGltZ1VybCA9IHRoaXMuaW1nVXJsO1xuICAgICAgICB3eC5kb3dubG9hZEZpbGUoe1xuICAgICAgICAgIHVybDogaW1nVXJsLFxuICAgICAgICAgIHN1Y2Nlc3M6IHJlcyA9PiB7XG4gICAgICAgICAgICBjb25zb2xlLmxvZyhyZXMpO1xuICAgICAgICAgICAgbGV0IHRlbXBGaWxlUGF0aCA9IHJlcy50ZW1wRmlsZVBhdGg7XG4gICAgICAgICAgICB3eC5nZXRTZXR0aW5nKHtcbiAgICAgICAgICAgICAgc3VjY2VzczogcmVzID0+IHtcbiAgICAgICAgICAgICAgICBpZiAoIXJlcy5hdXRoU2V0dGluZ1snc2NvcGUud3JpdGVQaG90b3NBbGJ1bSddKSB7XG4gICAgICAgICAgICAgICAgICB3eC5hdXRob3JpemUoe1xuICAgICAgICAgICAgICAgICAgICBzY29wZTogJ3Njb3BlLndyaXRlUGhvdG9zQWxidW0nLFxuICAgICAgICAgICAgICAgICAgICBzdWNjZXNzKCkge1xuICAgICAgICAgICAgICAgICAgICAgIF90aGlzLnNhdmVJbWFnZVRvUGhvdG9zQWxidW0odGVtcEZpbGVQYXRoKTtcbiAgICAgICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICAgICAgZmFpbCgpIHtcbiAgICAgICAgICAgICAgICAgICAgICBjb25zb2xlLmxvZygnZmFpbC0tLS0nKTtcbiAgICAgICAgICAgICAgICAgICAgICB3eC5zaG93TW9kYWwoe1xuICAgICAgICAgICAgICAgICAgICAgICAgLy8g5ZCR55So5oi35o+Q56S65Y2H57qn6Iez5pyA5paw54mI5b6u5L+h44CCXG4gICAgICAgICAgICAgICAgICAgICAgICB0aXRsZTogJ+aOiOadg+Wksei0pScsXG4gICAgICAgICAgICAgICAgICAgICAgICBjb25maXJtQ29sb3I6ICcjRjQ1QzQzJyxcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbnRlbnQ6ICfkuLrmiJDlip/kv53lrZjlm77niYfvvIzor7fph43mlrDmjojmnYPjgIInLFxuICAgICAgICAgICAgICAgICAgICAgICAgbWFzazogdHJ1ZSxcbiAgICAgICAgICAgICAgICAgICAgICAgIHN1Y2Nlc3M6IGZ1bmN0aW9uKHJlcykge1xuICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAocmVzLmNvbmZpcm0pIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB3eC5vcGVuU2V0dGluZyh7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICBzdWNjZXNzKCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAocmVzLmF1dGhTZXR0aW5nWydzY29wZS53cml0ZVBob3Rvc0FsYnVtJ10pIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBfdGhpcy5zYXZlSW1hZ2VUb1Bob3Rvc0FsYnVtKHRlbXBGaWxlUGF0aCk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgX3RoaXMuc2F2ZUltYWdlVG9QaG90b3NBbGJ1bSh0ZW1wRmlsZVBhdGgpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgZmFpbDogcmVxID0+IHtcbiAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhyZXEpO1xuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICB9LFxuICAgICAgICAgIGNvbXBsZXRlOiBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgIF90aGlzLnN0b3AgPSB0cnVlO1xuICAgICAgICAgICAgX3RoaXMuJGFwcGx5KCk7XG4gICAgICAgICAgfVxuICAgICAgICB9KTtcbiAgICAgIH1cbiAgICB9LFxuICAgIGZvcm1TdWJtaXQ6IGUgPT4ge1xuICAgICAgdXRpbHMuZm9ybVN1Ym1pdChlKTtcbiAgICB9XG4gIH07XG59XG4iXX0=