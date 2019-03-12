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

var _wecropper = require('./../../../components/wecropper.js');

var _wecropper2 = _interopRequireDefault(_wecropper);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var device = wx.getSystemInfoSync();
console.log(device);
var width = device.windowWidth;
var height = device.windowHeight - 50;

var SecKill = function (_wepy$page) {
  _inherits(SecKill, _wepy$page);

  function SecKill() {
    var _ref;

    var _temp, _this2, _ret;

    _classCallCheck(this, SecKill);

    for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    return _ret = (_temp = (_this2 = _possibleConstructorReturn(this, (_ref = SecKill.__proto__ || Object.getPrototypeOf(SecKill)).call.apply(_ref, [this].concat(args))), _this2), _this2.config = {
      navigationBarTitleText: '发起秒杀'
    }, _this2.$repeat = {}, _this2.$props = { "wecroppers": { "xmlns:v-bind": "", "v-bind:imgUrl.sync": "imgUrl", "v-bind:cropperopt.sync": "cropperOpt", "v-bind:showstatus.sync": "showStatus", "v-bind:fromdata.sync": "fromData" } }, _this2.$events = {}, _this2.components = {
      wecroppers: _wecropper2.default
    }, _this2.data = {
      showStatus: false,
      cropperOpt: {
        id: 'cropper',
        width: width,
        height: height,
        scale: 2.5,
        zoom: 8,
        cut: {
          x: (width - 300) / 2,
          y: (height - 300) / 2,
          width: 300,
          height: 300
        }
      },
      popErrorMsg: null, //错误提示
      stop: true, //阻止机制
      killStatus: false, //秒杀时间选择
      startH: null,
      endH: null,
      startM: null,
      endM: null,
      valueInit: null, //选择后value数组
      killDate: '', //秒杀时间显示
      imgUrl: null, //初始图片地址
      fromData: {
        mediaItem: {
          mediaId: null, //图片id
          path: null //图片path
        }, //图片信息
        name: null, //商品标题
        costPrice: null, //秒杀价
        marketPrice: null, //市场价
        totalQuantity: null,
        effectiveDate: null, //开始时间
        expiredDate: null, //结束时间
        address: null, //地址
        description: null, //商品描述
        storeName: null, //门店名称
        paymentType: 3, //支付方式 支付方式，0--线下支付/门店支付 3--微信支付 4--支付宝支付 ,
        takingType: '1' //取货方式，1--到店取货 2--快递 3--无需取货
      }
    }, _this2.methods = {
      changeName: function changeName(e) {
        'use strict';

        _this2.fromData.name = e.detail.value;
        _this2.$apply();
      }, //填写姓名
      changeKillPrice: function changeKillPrice(e) {
        'use strict';

        _this2.fromData.costPrice = e.detail.value;
        _this2.$apply();
      }, //填写秒杀价
      changeOldPrice: function changeOldPrice(e) {
        'use strict';

        _this2.fromData.marketPrice = e.detail.value;
        _this2.$apply();
      }, //填写原价
      changeNum: function changeNum(e) {
        'use strict';

        _this2.fromData.totalQuantity = e.detail.value || null;
        _this2.$apply();
      }, //填写库存
      bindChange: function bindChange(e) {
        console.log(e.detail.value);
        _this2.valueInit = e.detail.value;
        _this2.$apply();
      }, //选择时间
      confirmDateModule: function confirmDateModule() {
        var valueInit = _this2.valueInit;
        var startH = _this2.startH;
        var startM = _this2.startM;
        var endH = _this2.endH;
        var endM = _this2.endM;
        console.log(valueInit);
        if (!valueInit) {
          _util2.default.ErrorTips(_this2, '请选择秒杀时间');
          return;
        }
        var killDate = startH[valueInit[0]] + ':' + startM[valueInit[1]];
        var killEndDate = endH[valueInit[2]] + ':' + endM[valueInit[3]];
        if (startH[valueInit[0]] > endH[valueInit[2]]) {
          _util2.default.ErrorTips(_this2, '结束时间必须大于开始时间');
          return;
        } else if (startH[valueInit[0]] === endH[valueInit[2]] && startM[valueInit[1]] >= endM[valueInit[3]]) {
          _util2.default.ErrorTips(_this2, '结束时间必须大于开始时间');
          return;
        } else {
          _this2.killDate = killDate + ' 到 ' + killEndDate;
          _this2.fromData.effectiveDate = _this2.updateTime(killDate);
          _this2.fromData.expiredDate = _this2.updateTime(killEndDate);
          _this2.killStatus = false;
          _this2.$apply();
        }
      }, //确定时间
      closeDateModule: function closeDateModule() {
        _this2.killStatus = false;
        _this2.$apply();
      }, //关闭时间
      showDateModule: function showDateModule() {
        'use strict';

        _this2.killStatus = true;
        _this2.valueInit = null;
        _this2.killDate = null;
        _this2.$apply();
        var dateNew = new Date();
        var newH = dateNew.getHours();
        var startH = [];
        var startM = [];
        console.log(newH, '当前时间');
        for (var i = newH; i < 24; i++) {
          startH.push(_util2.default.formatZero(i));
        }
        for (var _i = 0; _i < 60; _i++) {
          startM.push(_util2.default.formatZero(_i));
        }
        _this2.startH = startH;
        _this2.endH = startH;
        _this2.startM = startM;
        _this2.endM = startM;
        _this2.$apply();
      }, //打开时间
      radioChange: function radioChange(e) {
        _this2.fromData.paymentType = e.detail.value;
        _this2.$apply();
      }, //选择支付方式
      changeStoreName: function changeStoreName(e) {
        _this2.fromData.storeName = e.detail.value;
        _this2.$apply();
      }, //名店名称
      changeAdr: function changeAdr() {
        if (wx.chooseAddress) {
          var _this = this;
          wx.chooseAddress({
            success: function success(res) {
              console.log(JSON.stringify(res));
              var adr = res.provinceName + res.cityName + res.countyName + res.detailInfo;
              _this.fromData.address = adr;
              _this.$apply();
            },
            fail: function fail(req) {
              'use strict';

              wx.showModal({
                // 向用户提示需要权限才能继续
                title: '提示',
                content: '您未正确选择地址，将无法使用收货地址，请重新授权或选择地址',
                mask: true,
                confirmColor: '#F45C43',
                success: function success(res) {
                  if (res.confirm) {
                    console.log('用户点击确定');
                    wx.openSetting({
                      //打开授权开关界面，让用户手动授权
                      success: function success(res) {
                        console.log(res);
                        if (res.authSetting['scope.address']) {
                          wx.chooseAddress({
                            success: function success(res) {
                              console.log(JSON.stringify(res));
                              var adr = res.provinceName + res.cityName + res.countyName + res.detailInfo;
                              _this.fromData.address = adr;
                              _this.$apply();
                            }
                          });
                        } else {
                          console.log('reject authrize');
                        }
                      }
                    });
                  } else if (res.cancel) {
                    wx.hideModal();
                  }
                }
              });
            }
          });
        } else {
          console.log('当前微信版本不支持chooseAddress');
        }
      }, //选择地址
      changeDesc: function changeDesc(e) {
        'use strict';

        _this2.fromData.descriptio = e.detail.value;
        _this2.$apply();
      }, //填写描述
      submitKill: function submitKill() {
        var stop = _this2.stop;
        var fromData = _this2.fromData;
        var imgUrl = _this2.imgUrl;
        console.log(fromData, '发起秒杀参数');
        if (!imgUrl || !fromData.address || !fromData.storeName || !Number(fromData.costPrice) || !fromData.paymentType || !fromData.name) {
          _util2.default.ErrorTips(_this2, '请完成商品属性的填写');
          return;
        } else if (Number(fromData.marketPrice) && Number(fromData.marketPrice) <= Number(fromData.costPrice)) {
          _util2.default.ErrorTips(_this2, '原价不得低于秒杀价');
          return;
        } else {
          if (stop) {
            _this2.stop = true;
            if (fromData.totalQuantity === 'null' || fromData.totalQuantity === '0' || !fromData.totalQuantity || fromData.totalQuantity === '0.0' || fromData.totalQuantity === '0.00') {
              fromData.totalQuantity = 1;
            }
            _sellFetch2.default.createProduct(fromData, function (res) {
              'use strict';

              console.log(res.data);
              if (res.data.resultCode === '100') {
                _util2.default.pageGo('/pages/sell/webView/index?updateState=1&scene=' + res.data.resultContent, 1);
              } else {
                _util2.default.ErrorTips(_this2, res.data.detailDescription);
              }
            });
          }
        }
      }, //提交秒杀参数
      formSubmit: function formSubmit(e) {
        _util2.default.formSubmit(e);
      },
      selectImg: function selectImg(e) {
        _this2.$invoke('wecroppers', 'uploadTap');
      }
    }, _temp), _possibleConstructorReturn(_this2, _ret);
  }

  _createClass(SecKill, [{
    key: 'onLoad',
    value: function onLoad(options) {
      var _this3 = this;

      this.stop = true;
      if (options.id) {
        this.id = options.id;
        this.$apply();
      }
      _sellFetch2.default.getShopMessage(function (res) {
        'use strict';

        console.log(res);
        if (res.data.resultCode === '100' && res.data.resultContent.length) {
          _this3.fromData.storeName = res.data.resultContent[0].name;
          _this3.fromData.address = res.data.resultContent[0].detailAddr;
          _this3.$apply();
        }
      });
    }
  }, {
    key: 'updateTime',
    value: function updateTime(str) {
      var date = new Date();
      var Y = date.getFullYear();
      var M = date.getMonth() + 1;
      var D = date.getDate();
      var timer = Y + '/' + M + '/' + D + ' ' + str;
      var timers = new Date(timer).getTime();
      return timers;
    }
  }]);

  return SecKill;
}(_wepy2.default.page);


Page(require('./../../../npm/wepy/lib/wepy.js').default.$createPage(SecKill , 'pages/sell/secKill/index'));

//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImluZGV4LmpzIl0sIm5hbWVzIjpbImRldmljZSIsInd4IiwiZ2V0U3lzdGVtSW5mb1N5bmMiLCJjb25zb2xlIiwibG9nIiwid2lkdGgiLCJ3aW5kb3dXaWR0aCIsImhlaWdodCIsIndpbmRvd0hlaWdodCIsIlNlY0tpbGwiLCJjb25maWciLCJuYXZpZ2F0aW9uQmFyVGl0bGVUZXh0IiwiJHJlcGVhdCIsIiRwcm9wcyIsIiRldmVudHMiLCJjb21wb25lbnRzIiwid2Vjcm9wcGVycyIsImRhdGEiLCJzaG93U3RhdHVzIiwiY3JvcHBlck9wdCIsImlkIiwic2NhbGUiLCJ6b29tIiwiY3V0IiwieCIsInkiLCJwb3BFcnJvck1zZyIsInN0b3AiLCJraWxsU3RhdHVzIiwic3RhcnRIIiwiZW5kSCIsInN0YXJ0TSIsImVuZE0iLCJ2YWx1ZUluaXQiLCJraWxsRGF0ZSIsImltZ1VybCIsImZyb21EYXRhIiwibWVkaWFJdGVtIiwibWVkaWFJZCIsInBhdGgiLCJuYW1lIiwiY29zdFByaWNlIiwibWFya2V0UHJpY2UiLCJ0b3RhbFF1YW50aXR5IiwiZWZmZWN0aXZlRGF0ZSIsImV4cGlyZWREYXRlIiwiYWRkcmVzcyIsImRlc2NyaXB0aW9uIiwic3RvcmVOYW1lIiwicGF5bWVudFR5cGUiLCJ0YWtpbmdUeXBlIiwibWV0aG9kcyIsImNoYW5nZU5hbWUiLCJlIiwiZGV0YWlsIiwidmFsdWUiLCIkYXBwbHkiLCJjaGFuZ2VLaWxsUHJpY2UiLCJjaGFuZ2VPbGRQcmljZSIsImNoYW5nZU51bSIsImJpbmRDaGFuZ2UiLCJjb25maXJtRGF0ZU1vZHVsZSIsInV0aWxzIiwiRXJyb3JUaXBzIiwia2lsbEVuZERhdGUiLCJ1cGRhdGVUaW1lIiwiY2xvc2VEYXRlTW9kdWxlIiwic2hvd0RhdGVNb2R1bGUiLCJkYXRlTmV3IiwiRGF0ZSIsIm5ld0giLCJnZXRIb3VycyIsImkiLCJwdXNoIiwiZm9ybWF0WmVybyIsInJhZGlvQ2hhbmdlIiwiY2hhbmdlU3RvcmVOYW1lIiwiY2hhbmdlQWRyIiwiY2hvb3NlQWRkcmVzcyIsIl90aGlzIiwic3VjY2VzcyIsIkpTT04iLCJzdHJpbmdpZnkiLCJyZXMiLCJhZHIiLCJwcm92aW5jZU5hbWUiLCJjaXR5TmFtZSIsImNvdW50eU5hbWUiLCJkZXRhaWxJbmZvIiwiZmFpbCIsInNob3dNb2RhbCIsInRpdGxlIiwiY29udGVudCIsIm1hc2siLCJjb25maXJtQ29sb3IiLCJjb25maXJtIiwib3BlblNldHRpbmciLCJhdXRoU2V0dGluZyIsImNhbmNlbCIsImhpZGVNb2RhbCIsImNoYW5nZURlc2MiLCJkZXNjcmlwdGlvIiwic3VibWl0S2lsbCIsIk51bWJlciIsIlNFTEwiLCJjcmVhdGVQcm9kdWN0IiwicmVzdWx0Q29kZSIsInBhZ2VHbyIsInJlc3VsdENvbnRlbnQiLCJkZXRhaWxEZXNjcmlwdGlvbiIsImZvcm1TdWJtaXQiLCJzZWxlY3RJbWciLCIkaW52b2tlIiwib3B0aW9ucyIsImdldFNob3BNZXNzYWdlIiwibGVuZ3RoIiwiZGV0YWlsQWRkciIsInN0ciIsImRhdGUiLCJZIiwiZ2V0RnVsbFllYXIiLCJNIiwiZ2V0TW9udGgiLCJEIiwiZ2V0RGF0ZSIsInRpbWVyIiwidGltZXJzIiwiZ2V0VGltZSIsIndlcHkiLCJwYWdlIl0sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7QUFDQTs7OztBQUNBOzs7O0FBQ0E7Ozs7QUFDQTs7OztBQU9BOzs7Ozs7Ozs7Ozs7QUFMQSxJQUFNQSxTQUFTQyxHQUFHQyxpQkFBSCxFQUFmO0FBQ0FDLFFBQVFDLEdBQVIsQ0FBWUosTUFBWjtBQUNBLElBQU1LLFFBQVFMLE9BQU9NLFdBQXJCO0FBQ0EsSUFBTUMsU0FBU1AsT0FBT1EsWUFBUCxHQUFzQixFQUFyQzs7SUFJcUJDLE87Ozs7Ozs7Ozs7Ozs7OzJMQUNuQkMsTSxHQUFTO0FBQ1BDLDhCQUF3QjtBQURqQixLLFNBR1ZDLE8sR0FBVSxFLFNBQ1hDLE0sR0FBUyxFQUFDLGNBQWEsRUFBQyxnQkFBZSxFQUFoQixFQUFtQixzQkFBcUIsUUFBeEMsRUFBaUQsMEJBQXlC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QUosQ0FBUzJGLGFBQVQsQ0FBdUIsQ0FBdkIsRUFBMEJwRSxJQUFwRDtBQUNBLGlCQUFLSixRQUFMLENBQWNVLE9BQWQsR0FBd0JxQyxJQUFJbEUsSUFBSixDQUFTMkYsYUFBVCxDQUF1QixDQUF2QixFQUEwQlEsVUFBbEQ7QUFDQSxpQkFBSzVELE1BQUw7QUFDRDtBQUNGLE9BUkQ7QUFTRDs7OytCQWlOVTZELEcsRUFBSztBQUNkLFVBQUlDLE9BQU8sSUFBSWpELElBQUosRUFBWDtBQUNBLFVBQUlrRCxJQUFJRCxLQUFLRSxXQUFMLEVBQVI7QUFDQSxVQUFJQyxJQUFJSCxLQUFLSSxRQUFMLEtBQWtCLENBQTFCO0FBQ0EsVUFBSUMsSUFBSUwsS0FBS00sT0FBTCxFQUFSO0FBQ0EsVUFBSUMsUUFBUU4sSUFBSSxHQUFKLEdBQVVFLENBQVYsR0FBYyxHQUFkLEdBQW9CRSxDQUFwQixHQUF3QixHQUF4QixHQUE4Qk4sR0FBMUM7QUFDQSxVQUFJUyxTQUFTLElBQUl6RCxJQUFKLENBQVN3RCxLQUFULEVBQWdCRSxPQUFoQixFQUFiO0FBQ0EsYUFBT0QsTUFBUDtBQUNEOzs7O0VBN1JrQ0UsZUFBS0MsSTs7a0JBQXJCeEgsTyIsImZpbGUiOiJpbmRleC5qcyIsInNvdXJjZXNDb250ZW50IjpbIlxuaW1wb3J0IHdlcHkgZnJvbSAnd2VweSc7XG5pbXBvcnQgU0VMTCBmcm9tICcuLi8uLi8uLi91dGlscy9zZWxsRmV0Y2guanMnO1xuaW1wb3J0IEF1dGhQcm92aWRlciBmcm9tICcuLi8uLi8uLi91dGlscy9BdXRoUHJvdmlkZXIuanMnO1xuaW1wb3J0IHV0aWxzIGZyb20gJy4uLy4uLy4uL3V0aWxzL3V0aWwuanMnO1xuXG5jb25zdCBkZXZpY2UgPSB3eC5nZXRTeXN0ZW1JbmZvU3luYygpO1xuY29uc29sZS5sb2coZGV2aWNlKTtcbmNvbnN0IHdpZHRoID0gZGV2aWNlLndpbmRvd1dpZHRoO1xuY29uc3QgaGVpZ2h0ID0gZGV2aWNlLndpbmRvd0hlaWdodCAtIDUwO1xuXG5pbXBvcnQgd2Vjcm9wcGVycyBmcm9tICcuLy4uLy4uLy4uL2NvbXBvbmVudHMvd2Vjcm9wcGVyJztcblxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgU2VjS2lsbCBleHRlbmRzIHdlcHkucGFnZSB7XG4gIGNvbmZpZyA9IHtcbiAgICBuYXZpZ2F0aW9uQmFyVGl0bGVUZXh0OiAn5Y+R6LW356eS5p2AJ1xuICB9O1xuICRyZXBlYXQgPSB7fTtcclxuJHByb3BzID0ge1wid2Vjcm9wcGVyc1wiOntcInhtbG5zOnYtYmluZFwiOlwiXCIsXCJ2LWJpbmQ6aW1nVXJsLnN5bmNcIjpcImltZ1VybFwiLFwidi1iaW5kOmNyb3BwZXJvcHQuc3luY1wiOlwiY3JvcHBlck9wdFwiLFwidi1iaW5kOnNob3dzdGF0dXMuc3luY1wiOlwic2hvd1N0YXR1c1wiLFwidi1iaW5kOmZyb21kYXRhLnN5bmNcIjpcImZyb21EYXRhXCJ9fTtcclxuJGV2ZW50cyA9IHt9O1xyXG4gY29tcG9uZW50cyA9IHtcbiAgICB3ZWNyb3BwZXJzOiB3ZWNyb3BwZXJzXG4gIH07XG4gIGRhdGEgPSB7XG4gICAgc2hvd1N0YXR1czogZmFsc2UsXG4gICAgY3JvcHBlck9wdDoge1xuICAgICAgaWQ6ICdjcm9wcGVyJyxcbiAgICAgIHdpZHRoLFxuICAgICAgaGVpZ2h0LFxuICAgICAgc2NhbGU6IDIuNSxcbiAgICAgIHpvb206IDgsXG4gICAgICBjdXQ6IHtcbiAgICAgICAgeDogKHdpZHRoIC0gMzAwKSAvIDIsXG4gICAgICAgIHk6IChoZWlnaHQgLSAzMDApIC8gMixcbiAgICAgICAgd2lkdGg6IDMwMCxcbiAgICAgICAgaGVpZ2h0OiAzMDBcbiAgICAgIH1cbiAgICB9LFxuICAgIHBvcEVycm9yTXNnOiBudWxsLCAvL+mUmeivr+aPkOekulxuICAgIHN0b3A6IHRydWUsIC8v6Zi75q2i5py65Yi2XG4gICAga2lsbFN0YXR1czogZmFsc2UsIC8v56eS5p2A5pe26Ze06YCJ5oupXG4gICAgc3RhcnRIOiBudWxsLFxuICAgIGVuZEg6IG51bGwsXG4gICAgc3RhcnRNOiBudWxsLFxuICAgIGVuZE06IG51bGwsXG4gICAgdmFsdWVJbml0OiBudWxsLCAvL+mAieaLqeWQjnZhbHVl5pWw57uEXG4gICAga2lsbERhdGU6ICcnLCAvL+enkuadgOaXtumXtOaYvuekulxuICAgIGltZ1VybDogbnVsbCwgLy/liJ3lp4vlm77niYflnLDlnYBcbiAgICBmcm9tRGF0YToge1xuICAgICAgbWVkaWFJdGVtOiB7XG4gICAgICAgIG1lZGlhSWQ6IG51bGwsIC8v5Zu+54mHaWRcbiAgICAgICAgcGF0aDogbnVsbCAvL+WbvueJh3BhdGhcbiAgICAgIH0sIC8v5Zu+54mH5L+h5oGvXG4gICAgICBuYW1lOiBudWxsLCAvL+WVhuWTgeagh+mimFxuICAgICAgY29zdFByaWNlOiBudWxsLCAvL+enkuadgOS7t1xuICAgICAgbWFya2V0UHJpY2U6IG51bGwsIC8v5biC5Zy65Lu3XG4gICAgICB0b3RhbFF1YW50aXR5OiBudWxsLFxuICAgICAgZWZmZWN0aXZlRGF0ZTogbnVsbCwgLy/lvIDlp4vml7bpl7RcbiAgICAgIGV4cGlyZWREYXRlOiBudWxsLCAvL+e7k+adn+aXtumXtFxuICAgICAgYWRkcmVzczogbnVsbCwgLy/lnLDlnYBcbiAgICAgIGRlc2NyaXB0aW9uOiBudWxsLCAvL+WVhuWTgeaPj+i/sFxuICAgICAgc3RvcmVOYW1lOiBudWxsLCAvL+mXqOW6l+WQjeensFxuICAgICAgcGF5bWVudFR5cGU6IDMsIC8v5pSv5LuY5pa55byPIOaUr+S7mOaWueW8j++8jDAtLee6v+S4i+aUr+S7mC/pl6jlupfmlK/ku5ggMy0t5b6u5L+h5pSv5LuYIDQtLeaUr+S7mOWuneaUr+S7mCAsXG4gICAgICB0YWtpbmdUeXBlOiAnMScgLy/lj5botKfmlrnlvI/vvIwxLS3liLDlupflj5botKcgMi0t5b+r6YCSIDMtLeaXoOmcgOWPlui0p1xuICAgIH1cbiAgfTtcbiAgb25Mb2FkKG9wdGlvbnMpIHtcbiAgICB0aGlzLnN0b3AgPSB0cnVlO1xuICAgIGlmIChvcHRpb25zLmlkKSB7XG4gICAgICB0aGlzLmlkID0gb3B0aW9ucy5pZDtcbiAgICAgIHRoaXMuJGFwcGx5KCk7XG4gICAgfVxuICAgIFNFTEwuZ2V0U2hvcE1lc3NhZ2UocmVzID0+IHtcbiAgICAgICd1c2Ugc3RyaWN0JztcbiAgICAgIGNvbnNvbGUubG9nKHJlcyk7XG4gICAgICBpZiAocmVzLmRhdGEucmVzdWx0Q29kZSA9PT0gJzEwMCcgJiYgcmVzLmRhdGEucmVzdWx0Q29udGVudC5sZW5ndGgpIHtcbiAgICAgICAgdGhpcy5mcm9tRGF0YS5zdG9yZU5hbWUgPSByZXMuZGF0YS5yZXN1bHRDb250ZW50WzBdLm5hbWU7XG4gICAgICAgIHRoaXMuZnJvbURhdGEuYWRkcmVzcyA9IHJlcy5kYXRhLnJlc3VsdENvbnRlbnRbMF0uZGV0YWlsQWRkcjtcbiAgICAgICAgdGhpcy4kYXBwbHkoKTtcbiAgICAgIH1cbiAgICB9KTtcbiAgfVxuICBtZXRob2RzID0ge1xuICAgIGNoYW5nZU5hbWU6IGUgPT4ge1xuICAgICAgJ3VzZSBzdHJpY3QnO1xuICAgICAgdGhpcy5mcm9tRGF0YS5uYW1lID0gZS5kZXRhaWwudmFsdWU7XG4gICAgICB0aGlzLiRhcHBseSgpO1xuICAgIH0sIC8v5aGr5YaZ5aeT5ZCNXG4gICAgY2hhbmdlS2lsbFByaWNlOiBlID0+IHtcbiAgICAgICd1c2Ugc3RyaWN0JztcbiAgICAgIHRoaXMuZnJvbURhdGEuY29zdFByaWNlID0gZS5kZXRhaWwudmFsdWU7XG4gICAgICB0aGlzLiRhcHBseSgpO1xuICAgIH0sIC8v5aGr5YaZ56eS5p2A5Lu3XG4gICAgY2hhbmdlT2xkUHJpY2U6IGUgPT4ge1xuICAgICAgJ3VzZSBzdHJpY3QnO1xuICAgICAgdGhpcy5mcm9tRGF0YS5tYXJrZXRQcmljZSA9IGUuZGV0YWlsLnZhbHVlO1xuICAgICAgdGhpcy4kYXBwbHkoKTtcbiAgICB9LCAvL+Whq+WGmeWOn+S7t1xuICAgIGNoYW5nZU51bTogZSA9PiB7XG4gICAgICAndXNlIHN0cmljdCc7XG4gICAgICB0aGlzLmZyb21EYXRhLnRvdGFsUXVhbnRpdHkgPSBlLmRldGFpbC52YWx1ZSB8fCBudWxsO1xuICAgICAgdGhpcy4kYXBwbHkoKTtcbiAgICB9LCAvL+Whq+WGmeW6k+WtmFxuICAgIGJpbmRDaGFuZ2U6IGUgPT4ge1xuICAgICAgY29uc29sZS5sb2coZS5kZXRhaWwudmFsdWUpO1xuICAgICAgdGhpcy52YWx1ZUluaXQgPSBlLmRldGFpbC52YWx1ZTtcbiAgICAgIHRoaXMuJGFwcGx5KCk7XG4gICAgfSwgLy/pgInmi6nml7bpl7RcbiAgICBjb25maXJtRGF0ZU1vZHVsZTogKCkgPT4ge1xuICAgICAgbGV0IHZhbHVlSW5pdCA9IHRoaXMudmFsdWVJbml0O1xuICAgICAgbGV0IHN0YXJ0SCA9IHRoaXMuc3RhcnRIO1xuICAgICAgbGV0IHN0YXJ0TSA9IHRoaXMuc3RhcnRNO1xuICAgICAgbGV0IGVuZEggPSB0aGlzLmVuZEg7XG4gICAgICBsZXQgZW5kTSA9IHRoaXMuZW5kTTtcbiAgICAgIGNvbnNvbGUubG9nKHZhbHVlSW5pdCk7XG4gICAgICBpZiAoIXZhbHVlSW5pdCkge1xuICAgICAgICB1dGlscy5FcnJvclRpcHModGhpcywgJ+ivt+mAieaLqeenkuadgOaXtumXtCcpO1xuICAgICAgICByZXR1cm47XG4gICAgICB9XG4gICAgICBsZXQga2lsbERhdGUgPSBgJHtzdGFydEhbdmFsdWVJbml0WzBdXX06JHtzdGFydE1bdmFsdWVJbml0WzFdXX1gO1xuICAgICAgbGV0IGtpbGxFbmREYXRlID0gYCR7ZW5kSFt2YWx1ZUluaXRbMl1dfToke2VuZE1bdmFsdWVJbml0WzNdXX1gO1xuICAgICAgaWYgKHN0YXJ0SFt2YWx1ZUluaXRbMF1dID4gZW5kSFt2YWx1ZUluaXRbMl1dKSB7XG4gICAgICAgIHV0aWxzLkVycm9yVGlwcyh0aGlzLCAn57uT5p2f5pe26Ze05b+F6aG75aSn5LqO5byA5aeL5pe26Ze0Jyk7XG4gICAgICAgIHJldHVybjtcbiAgICAgIH0gZWxzZSBpZiAoXG4gICAgICAgIHN0YXJ0SFt2YWx1ZUluaXRbMF1dID09PSBlbmRIW3ZhbHVlSW5pdFsyXV0gJiZcbiAgICAgICAgc3RhcnRNW3ZhbHVlSW5pdFsxXV0gPj0gZW5kTVt2YWx1ZUluaXRbM11dXG4gICAgICApIHtcbiAgICAgICAgdXRpbHMuRXJyb3JUaXBzKHRoaXMsICfnu5PmnZ/ml7bpl7Tlv4XpobvlpKfkuo7lvIDlp4vml7bpl7QnKTtcbiAgICAgICAgcmV0dXJuO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgdGhpcy5raWxsRGF0ZSA9IGtpbGxEYXRlICsgJyDliLAgJyArIGtpbGxFbmREYXRlO1xuICAgICAgICB0aGlzLmZyb21EYXRhLmVmZmVjdGl2ZURhdGUgPSB0aGlzLnVwZGF0ZVRpbWUoa2lsbERhdGUpO1xuICAgICAgICB0aGlzLmZyb21EYXRhLmV4cGlyZWREYXRlID0gdGhpcy51cGRhdGVUaW1lKGtpbGxFbmREYXRlKTtcbiAgICAgICAgdGhpcy5raWxsU3RhdHVzID0gZmFsc2U7XG4gICAgICAgIHRoaXMuJGFwcGx5KCk7XG4gICAgICB9XG4gICAgfSwgLy/noa7lrprml7bpl7RcbiAgICBjbG9zZURhdGVNb2R1bGU6ICgpID0+IHtcbiAgICAgIHRoaXMua2lsbFN0YXR1cyA9IGZhbHNlO1xuICAgICAgdGhpcy4kYXBwbHkoKTtcbiAgICB9LCAvL+WFs+mXreaXtumXtFxuICAgIHNob3dEYXRlTW9kdWxlOiAoKSA9PiB7XG4gICAgICAndXNlIHN0cmljdCc7XG4gICAgICB0aGlzLmtpbGxTdGF0dXMgPSB0cnVlO1xuICAgICAgdGhpcy52YWx1ZUluaXQgPSBudWxsO1xuICAgICAgdGhpcy5raWxsRGF0ZSA9IG51bGw7XG4gICAgICB0aGlzLiRhcHBseSgpO1xuICAgICAgbGV0IGRhdGVOZXcgPSBuZXcgRGF0ZSgpO1xuICAgICAgbGV0IG5ld0ggPSBkYXRlTmV3LmdldEhvdXJzKCk7XG4gICAgICBsZXQgc3RhcnRIID0gW107XG4gICAgICBsZXQgc3RhcnRNID0gW107XG4gICAgICBjb25zb2xlLmxvZyhuZXdILCAn5b2T5YmN5pe26Ze0Jyk7XG4gICAgICBmb3IgKGxldCBpID0gbmV3SDsgaSA8IDI0OyBpKyspIHtcbiAgICAgICAgc3RhcnRILnB1c2godXRpbHMuZm9ybWF0WmVybyhpKSk7XG4gICAgICB9XG4gICAgICBmb3IgKGxldCBpID0gMDsgaSA8IDYwOyBpKyspIHtcbiAgICAgICAgc3RhcnRNLnB1c2godXRpbHMuZm9ybWF0WmVybyhpKSk7XG4gICAgICB9XG4gICAgICB0aGlzLnN0YXJ0SCA9IHN0YXJ0SDtcbiAgICAgIHRoaXMuZW5kSCA9IHN0YXJ0SDtcbiAgICAgIHRoaXMuc3RhcnRNID0gc3RhcnRNO1xuICAgICAgdGhpcy5lbmRNID0gc3RhcnRNO1xuICAgICAgdGhpcy4kYXBwbHkoKTtcbiAgICB9LCAvL+aJk+W8gOaXtumXtFxuICAgIHJhZGlvQ2hhbmdlOiBlID0+IHtcbiAgICAgIHRoaXMuZnJvbURhdGEucGF5bWVudFR5cGUgPSBlLmRldGFpbC52YWx1ZTtcbiAgICAgIHRoaXMuJGFwcGx5KCk7XG4gICAgfSwgLy/pgInmi6nmlK/ku5jmlrnlvI9cbiAgICBjaGFuZ2VTdG9yZU5hbWU6IGUgPT4ge1xuICAgICAgdGhpcy5mcm9tRGF0YS5zdG9yZU5hbWUgPSBlLmRldGFpbC52YWx1ZTtcbiAgICAgIHRoaXMuJGFwcGx5KCk7XG4gICAgfSwgLy/lkI3lupflkI3np7BcbiAgICBjaGFuZ2VBZHI6IGZ1bmN0aW9uKCkge1xuICAgICAgaWYgKHd4LmNob29zZUFkZHJlc3MpIHtcbiAgICAgICAgbGV0IF90aGlzID0gdGhpcztcbiAgICAgICAgd3guY2hvb3NlQWRkcmVzcyh7XG4gICAgICAgICAgc3VjY2VzczogcmVzID0+IHtcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKEpTT04uc3RyaW5naWZ5KHJlcykpO1xuICAgICAgICAgICAgbGV0IGFkciA9XG4gICAgICAgICAgICAgIHJlcy5wcm92aW5jZU5hbWUgKyByZXMuY2l0eU5hbWUgKyByZXMuY291bnR5TmFtZSArIHJlcy5kZXRhaWxJbmZvO1xuICAgICAgICAgICAgX3RoaXMuZnJvbURhdGEuYWRkcmVzcyA9IGFkcjtcbiAgICAgICAgICAgIF90aGlzLiRhcHBseSgpO1xuICAgICAgICAgIH0sXG4gICAgICAgICAgZmFpbDogcmVxID0+IHtcbiAgICAgICAgICAgICd1c2Ugc3RyaWN0JztcbiAgICAgICAgICAgIHd4LnNob3dNb2RhbCh7XG4gICAgICAgICAgICAgIC8vIOWQkeeUqOaIt+aPkOekuumcgOimgeadg+mZkOaJjeiDvee7p+e7rVxuICAgICAgICAgICAgICB0aXRsZTogJ+aPkOekuicsXG4gICAgICAgICAgICAgIGNvbnRlbnQ6XG4gICAgICAgICAgICAgICAgJ+aCqOacquato+ehrumAieaLqeWcsOWdgO+8jOWwhuaXoOazleS9v+eUqOaUtui0p+WcsOWdgO+8jOivt+mHjeaWsOaOiOadg+aIlumAieaLqeWcsOWdgCcsXG4gICAgICAgICAgICAgIG1hc2s6IHRydWUsXG4gICAgICAgICAgICAgIGNvbmZpcm1Db2xvcjogJyNGNDVDNDMnLFxuICAgICAgICAgICAgICBzdWNjZXNzOiBmdW5jdGlvbihyZXMpIHtcbiAgICAgICAgICAgICAgICBpZiAocmVzLmNvbmZpcm0pIHtcbiAgICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKCfnlKjmiLfngrnlh7vnoa7lrponKTtcbiAgICAgICAgICAgICAgICAgIHd4Lm9wZW5TZXR0aW5nKHtcbiAgICAgICAgICAgICAgICAgICAgLy/miZPlvIDmjojmnYPlvIDlhbPnlYzpnaLvvIzorqnnlKjmiLfmiYvliqjmjojmnYNcbiAgICAgICAgICAgICAgICAgICAgc3VjY2VzczogcmVzID0+IHtcbiAgICAgICAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhyZXMpO1xuICAgICAgICAgICAgICAgICAgICAgIGlmIChyZXMuYXV0aFNldHRpbmdbJ3Njb3BlLmFkZHJlc3MnXSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgd3guY2hvb3NlQWRkcmVzcyh7XG4gICAgICAgICAgICAgICAgICAgICAgICAgIHN1Y2Nlc3M6IHJlcyA9PiB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgY29uc29sZS5sb2coSlNPTi5zdHJpbmdpZnkocmVzKSk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgbGV0IGFkciA9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXMucHJvdmluY2VOYW1lICtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJlcy5jaXR5TmFtZSArXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXMuY291bnR5TmFtZSArXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXMuZGV0YWlsSW5mbztcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBfdGhpcy5mcm9tRGF0YS5hZGRyZXNzID0gYWRyO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIF90aGlzLiRhcHBseSgpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAgICAgY29uc29sZS5sb2coJ3JlamVjdCBhdXRocml6ZScpO1xuICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgfSBlbHNlIGlmIChyZXMuY2FuY2VsKSB7XG4gICAgICAgICAgICAgICAgICB3eC5oaWRlTW9kYWwoKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgIH1cbiAgICAgICAgfSk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBjb25zb2xlLmxvZygn5b2T5YmN5b6u5L+h54mI5pys5LiN5pSv5oyBY2hvb3NlQWRkcmVzcycpO1xuICAgICAgfVxuICAgIH0sIC8v6YCJ5oup5Zyw5Z2AXG4gICAgY2hhbmdlRGVzYzogZSA9PiB7XG4gICAgICAndXNlIHN0cmljdCc7XG4gICAgICB0aGlzLmZyb21EYXRhLmRlc2NyaXB0aW8gPSBlLmRldGFpbC52YWx1ZTtcbiAgICAgIHRoaXMuJGFwcGx5KCk7XG4gICAgfSwgLy/loavlhpnmj4/ov7BcbiAgICBzdWJtaXRLaWxsOiAoKSA9PiB7XG4gICAgICBsZXQgc3RvcCA9IHRoaXMuc3RvcDtcbiAgICAgIGxldCBmcm9tRGF0YSA9IHRoaXMuZnJvbURhdGE7XG4gICAgICBsZXQgaW1nVXJsID0gdGhpcy5pbWdVcmw7XG4gICAgICBjb25zb2xlLmxvZyhmcm9tRGF0YSwgJ+WPkei1t+enkuadgOWPguaVsCcpO1xuICAgICAgaWYgKFxuICAgICAgICAhaW1nVXJsIHx8XG4gICAgICAgICFmcm9tRGF0YS5hZGRyZXNzIHx8XG4gICAgICAgICFmcm9tRGF0YS5zdG9yZU5hbWUgfHxcbiAgICAgICAgIU51bWJlcihmcm9tRGF0YS5jb3N0UHJpY2UpIHx8XG4gICAgICAgICFmcm9tRGF0YS5wYXltZW50VHlwZSB8fFxuICAgICAgICAhZnJvbURhdGEubmFtZVxuICAgICAgKSB7XG4gICAgICAgIHV0aWxzLkVycm9yVGlwcyh0aGlzLCAn6K+35a6M5oiQ5ZWG5ZOB5bGe5oCn55qE5aGr5YaZJyk7XG4gICAgICAgIHJldHVybjtcbiAgICAgIH0gZWxzZSBpZiAoXG4gICAgICAgIE51bWJlcihmcm9tRGF0YS5tYXJrZXRQcmljZSkgJiZcbiAgICAgICAgTnVtYmVyKGZyb21EYXRhLm1hcmtldFByaWNlKSA8PSBOdW1iZXIoZnJvbURhdGEuY29zdFByaWNlKVxuICAgICAgKSB7XG4gICAgICAgIHV0aWxzLkVycm9yVGlwcyh0aGlzLCAn5Y6f5Lu35LiN5b6X5L2O5LqO56eS5p2A5Lu3Jyk7XG4gICAgICAgIHJldHVybjtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGlmIChzdG9wKSB7XG4gICAgICAgICAgdGhpcy5zdG9wID0gdHJ1ZTtcbiAgICAgICAgICBpZiAoXG4gICAgICAgICAgICBmcm9tRGF0YS50b3RhbFF1YW50aXR5ID09PSAnbnVsbCcgfHxcbiAgICAgICAgICAgIGZyb21EYXRhLnRvdGFsUXVhbnRpdHkgPT09ICcwJyB8fFxuICAgICAgICAgICAgIWZyb21EYXRhLnRvdGFsUXVhbnRpdHkgfHxcbiAgICAgICAgICAgIGZyb21EYXRhLnRvdGFsUXVhbnRpdHkgPT09ICcwLjAnIHx8XG4gICAgICAgICAgICBmcm9tRGF0YS50b3RhbFF1YW50aXR5ID09PSAnMC4wMCdcbiAgICAgICAgICApIHtcbiAgICAgICAgICAgIGZyb21EYXRhLnRvdGFsUXVhbnRpdHkgPSAxO1xuICAgICAgICAgIH1cbiAgICAgICAgICBTRUxMLmNyZWF0ZVByb2R1Y3QoZnJvbURhdGEsIHJlcyA9PiB7XG4gICAgICAgICAgICAndXNlIHN0cmljdCc7XG4gICAgICAgICAgICBjb25zb2xlLmxvZyhyZXMuZGF0YSk7XG4gICAgICAgICAgICBpZiAocmVzLmRhdGEucmVzdWx0Q29kZSA9PT0gJzEwMCcpIHtcbiAgICAgICAgICAgICAgdXRpbHMucGFnZUdvKFxuICAgICAgICAgICAgICAgICcvcGFnZXMvc2VsbC93ZWJWaWV3L2luZGV4P3VwZGF0ZVN0YXRlPTEmc2NlbmU9JyArXG4gICAgICAgICAgICAgICAgICByZXMuZGF0YS5yZXN1bHRDb250ZW50LFxuICAgICAgICAgICAgICAgIDFcbiAgICAgICAgICAgICAgKTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgIHV0aWxzLkVycm9yVGlwcyh0aGlzLCByZXMuZGF0YS5kZXRhaWxEZXNjcmlwdGlvbik7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfSk7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9LCAvL+aPkOS6pOenkuadgOWPguaVsFxuICAgIGZvcm1TdWJtaXQ6IGUgPT4ge1xuICAgICAgdXRpbHMuZm9ybVN1Ym1pdChlKTtcbiAgICB9LFxuICAgIHNlbGVjdEltZzogZSA9PiB7XG4gICAgICB0aGlzLiRpbnZva2UoJ3dlY3JvcHBlcnMnLCAndXBsb2FkVGFwJyk7XG4gICAgfVxuICB9O1xuICB1cGRhdGVUaW1lKHN0cikge1xuICAgIGxldCBkYXRlID0gbmV3IERhdGUoKTtcbiAgICBsZXQgWSA9IGRhdGUuZ2V0RnVsbFllYXIoKTtcbiAgICBsZXQgTSA9IGRhdGUuZ2V0TW9udGgoKSArIDE7XG4gICAgbGV0IEQgPSBkYXRlLmdldERhdGUoKTtcbiAgICBsZXQgdGltZXIgPSBZICsgJy8nICsgTSArICcvJyArIEQgKyAnICcgKyBzdHI7XG4gICAgbGV0IHRpbWVycyA9IG5ldyBEYXRlKHRpbWVyKS5nZXRUaW1lKCk7XG4gICAgcmV0dXJuIHRpbWVycztcbiAgfVxufVxuIl19