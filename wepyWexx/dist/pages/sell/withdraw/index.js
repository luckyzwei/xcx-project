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

var Withdraw = function (_wepy$page) {
  _inherits(Withdraw, _wepy$page);

  function Withdraw() {
    var _ref;

    var _temp, _this, _ret;

    _classCallCheck(this, Withdraw);

    for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    return _ret = (_temp = (_this = _possibleConstructorReturn(this, (_ref = Withdraw.__proto__ || Object.getPrototypeOf(Withdraw)).call.apply(_ref, [this].concat(args))), _this), _this.config = {
      navigationBarTitleText: '已发布活动'
    }, _this.data = {
      popErrorMsg: null, //错误提示
      stop: true, //阻止机制
      cashMoney: '0.00', //最大提现金额
      cumulativeIncome: '0.00', //累计收益
      cashMoneyValue: null, //提现金额
      cashStatus: false,
      dataList: [],
      pageInfo: {
        currentPage: 0,
        pageSize: 10,
        totalPage: 0
      }
    }, _this.methods = {
      //获取列表数据
      getListLower: function getListLower() {
        'use strict';

        if (_this.stop) {
          _this.stop = false;
          var pageInfo = _this.pageInfo;
          var data = {
            currentPage: 0,
            pageSize: pageInfo.pageSize + 10
          };
          _sellFetch2.default.getProductList(data, function (res) {
            'use strict';

            console.log(res);
            if (res.data.resultCode === '100') {
              _this.dataList = res.data.resultContent;
              _this.pageInfo = res.data.pageInfo;
              _this.stop = true;
              _this.$apply();
            } else {
              util.ErrorTips(_this, res.data.detailDescription);
            }
          });
        }
      },
      // 终止活动
      stopActivity: function stopActivity(goodId) {
        'use strict';

        if (_this.stop) {
          _this.stop = false;
          _sellFetch2.default.stopActivity(goodId, function (result) {
            console.log(result);
            if (result.data.resultCode === '100') {
              var data = {
                currentPage: 0,
                pageSize: 10
              };
              _sellFetch2.default.getProductList(data, function (res) {
                'use strict';

                console.log(res);
                if (res.data.resultCode === '100') {
                  _this.dataList = res.data.resultContent;
                  _this.pageInfo = res.data.pageInfo;
                  _this.stop = true;
                  _this.$apply();
                } else {
                  util.ErrorTips(_this, res.data.detailDescription);
                }
              });
            }
          });
        }
      },
      //去分享
      goShare: function goShare(goodId) {
        'use strict';

        _sellFetch2.default.longToshort(goodId, function (res) {
          if (res.data.resultCode === '100') {
            var path = '/pages/sell/webView/index?scene=' + res.data.resultContent;
            _util2.default.pageGo(path, 1);
          }
        });
      },
      // 去售后记录
      goRecord: function goRecord(goodId) {
        'use strict';

        var path = '/pages/sell/record/index?scene=' + goodId;
        _util2.default.pageGo(path, 1);
      },
      //提现模态
      cashAllMoney: function cashAllMoney(money) {
        'use strict';

        _this.cashMoneyValue = money;
        _this.$apply();
      },
      showCash: function showCash() {
        _this.cashMoneyValue = null;
        _this.cashStatus = true;
      },
      hideCash: function hideCash() {
        _this.cashStatus = false;
      },
      //输入提现金额
      iptCashMoney: function iptCashMoney(e) {
        console.log(e.detail.value);
        if (e.detail.value < _this.cashMoney) {
          _this.cashMoneyValue = e.detail.value;
        } else {
          _this.cashMoneyValue = e.detail.value;
          _util2.default.ErrorTips(_this, '最多提现' + _this.cashMoney + '元');
        }
      },
      // 确认提现
      confirmCash: function confirmCash(e) {
        'use strict';

        if (_this.cashMoneyValue > _this.cashMoney) {
          _util2.default.ErrorTips(_this, '最多提现' + _this.cashMoney + '元');
        } else {
          if (_this.stop) {
            _this.stop = false;
            var dataParams = {
              amount: _this.data.cashMoneyValue,
              appId: _api2.default.APP_ID,
              openId: wx.getStorageSync('openid'),
              withDrawDes: '好物来活动收入'
            };
            _sellFetch2.default.withDrawPay(dataParams, function (res) {
              console.log(res);
              if (res.data.resultCode === '100') {
                util.successShowText('提现成功');
                _this.stop = true;
                _this.cashStatus = false;
                _this.$apply();
                _sellFetch2.default.loadAccountInfo(function (res) {
                  'use strict';

                  console.log(res);
                  if (res.data.resultCode === '100') {
                    _this.cashMoney = res.data.resultContent.amount;
                    _this.cumulativeIncome = res.data.resultContent.cumulativeIncome;
                    _this.$apply();
                  }
                });
              } else {
                _this.cashStatus = false;
                _util2.default.ErrorTips(_this, res.data.detailDescription);
                _this.$apply();
              }
            });
          } else {
            _util2.default.ErrorTips(_this, '正在处理中...');
          }
        }
      }
    }, _temp), _possibleConstructorReturn(_this, _ret);
  }

  _createClass(Withdraw, [{
    key: 'onLoad',
    value: function onLoad() {
      var _this2 = this;

      var data = {
        currentPage: 0,
        pageSize: 10
      };
      _sellFetch2.default.loadAccountInfo(function (res) {
        'use strict';

        console.log(res);
        if (res.data.resultCode === '100') {
          _this2.cashMoney = res.data.resultContent.amount;
          _this2.cumulativeIncome = res.data.resultContent.cumulativeIncome;
          _this2.$apply();
        } else {
          _util2.default.ErrorTips(_this2, res.data.detailDescription);
        }
      });
      _sellFetch2.default.getProductList(data, function (res) {
        'use strict';

        if (res.data.resultCode === '100') {
          _this2.dataList = res.data.resultContent;
          _this2.pageInfo = res.data.pageInfo;
          _this2.$apply();
        } else {
          _util2.default.ErrorTips(_this2, res.data.detailDescription);
        }
      });
    }
  }]);

  return Withdraw;
}(_wepy2.default.page);


Page(require('./../../../npm/wepy/lib/wepy.js').default.$createPage(Withdraw , 'pages/sell/withdraw/index'));

//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImluZGV4LmpzIl0sIm5hbWVzIjpbIldpdGhkcmF3IiwiY29uZmlnIiwibmF2aWdhdGlvbkJhclRpdGxlVGV4dCIsImRhdGEiLCJwb3BFcnJvck1zZyIsInN0b3AiLCJjYXNoTW9uZXkiLCJjdW11bGF0aXZlSW5jb21lIiwiY2FzaE1vbmV5VmFsdWUiLCJjYXNoU3RhdHVzIiwiZGF0YUxpc3QiLCJwYWdlSW5mbyIsImN1cnJlbnRQYWdlIiwicGFnZVNpemUiLCJ0b3RhbFBhZ2UiLCJtZXRob2RzIiwiZ2V0TGlzdExvd2VyIiwiU0VMTCIsImdldFByb2R1Y3RMaXN0IiwiY29uc29sZSIsImxvZyIsInJlcyIsInJlc3VsdENvZGUiLCJyZXN1bHRDb250ZW50IiwiJGFwcGx5IiwidXRpbCIsIkVycm9yVGlwcyIsImRldGFpbERlc2NyaXB0aW9uIiwic3RvcEFjdGl2aXR5IiwiZ29vZElkIiwicmVzdWx0IiwiZ29TaGFyZSIsImxvbmdUb3Nob3J0IiwicGF0aCIsInV0aWxzIiwicGFnZUdvIiwiZ29SZWNvcmQiLCJjYXNoQWxsTW9uZXkiLCJtb25leSIsInNob3dDYXNoIiwiaGlkZUNhc2giLCJpcHRDYXNoTW9uZXkiLCJlIiwiZGV0YWlsIiwidmFsdWUiLCJjb25maXJtQ2FzaCIsImRhdGFQYXJhbXMiLCJhbW91bnQiLCJhcHBJZCIsIkFQSSIsIkFQUF9JRCIsIm9wZW5JZCIsInd4IiwiZ2V0U3RvcmFnZVN5bmMiLCJ3aXRoRHJhd0RlcyIsIndpdGhEcmF3UGF5Iiwic3VjY2Vzc1Nob3dUZXh0IiwibG9hZEFjY291bnRJbmZvIiwid2VweSIsInBhZ2UiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7OztBQUNBOzs7O0FBQ0E7Ozs7QUFDQTs7OztBQUNBOzs7O0FBQ0E7Ozs7Ozs7Ozs7OztJQUNxQkEsUTs7Ozs7Ozs7Ozs7Ozs7MExBQ25CQyxNLEdBQVM7QUFDUEMsOEJBQXdCO0FBRGpCLEssUUFHVEMsSSxHQUFPO0FBQ0xDLG1CQUFhLElBRFIsRUFDYztBQUNuQkMsWUFB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QUlsQixJQUFKLENBQVNvQixhQUFULENBQXVCd0IsTUFBeEM7QUFDQSxpQkFBS3hDLGdCQUFMLEdBQXdCYyxJQUFJbEIsSUFBSixDQUFTb0IsYUFBVCxDQUF1QmhCLGdCQUEvQztBQUNBLGlCQUFLaUIsTUFBTDtBQUNELFNBSkQsTUFJTztBQUNMVSx5QkFBTVIsU0FBTixDQUFnQixNQUFoQixFQUFzQkwsSUFBSWxCLElBQUosQ0FBU3dCLGlCQUEvQjtBQUNEO0FBQ0YsT0FWRDtBQVdBViwwQkFBS0MsY0FBTCxDQUFvQmYsSUFBcEIsRUFBMEIsZUFBTztBQUMvQjs7QUFDQSxZQUFJa0IsSUFBSWxCLElBQUosQ0FBU21CLFVBQVQsS0FBd0IsS0FBNUIsRUFBbUM7QUFDakMsaUJBQUtaLFFBQUwsR0FBZ0JXLElBQUlsQixJQUFKLENBQVNvQixhQUF6QjtBQUNBLGlCQUFLWixRQUFMLEdBQWdCVSxJQUFJbEIsSUFBSixDQUFTUSxRQUF6QjtBQUNBLGlCQUFLYSxNQUFMO0FBQ0QsU0FKRCxNQUlPO0FBQ0xVLHlCQUFNUixTQUFOLENBQWdCLE1BQWhCLEVBQXNCTCxJQUFJbEIsSUFBSixDQUFTd0IsaUJBQS9CO0FBQ0Q7QUFDRixPQVREO0FBVUQ7Ozs7RUE1Q21DK0IsZUFBS0MsSTs7a0JBQXRCM0QsUSIsImZpbGUiOiJpbmRleC5qcyIsInNvdXJjZXNDb250ZW50IjpbIlxuaW1wb3J0IHdlcHkgZnJvbSAnd2VweSc7XG5pbXBvcnQgU0VMTCBmcm9tICcuLi8uLi8uLi91dGlscy9zZWxsRmV0Y2guanMnO1xuaW1wb3J0IEF1dGhQcm92aWRlciBmcm9tICcuLi8uLi8uLi91dGlscy9BdXRoUHJvdmlkZXIuanMnO1xuaW1wb3J0IHV0aWxzIGZyb20gJy4uLy4uLy4uL3V0aWxzL3V0aWwuanMnO1xuaW1wb3J0IEFQSSBmcm9tICcuLi8uLi8uLi91dGlscy9hcGkuanMnO1xuZXhwb3J0IGRlZmF1bHQgY2xhc3MgV2l0aGRyYXcgZXh0ZW5kcyB3ZXB5LnBhZ2Uge1xuICBjb25maWcgPSB7XG4gICAgbmF2aWdhdGlvbkJhclRpdGxlVGV4dDogJ+W3suWPkeW4g+a0u+WKqCdcbiAgfTtcbiAgZGF0YSA9IHtcbiAgICBwb3BFcnJvck1zZzogbnVsbCwgLy/plJnor6/mj5DnpLpcbiAgICBzdG9wOiB0cnVlLCAvL+mYu+atouacuuWItlxuICAgIGNhc2hNb25leTogJzAuMDAnLCAvL+acgOWkp+aPkOeOsOmHkeminVxuICAgIGN1bXVsYXRpdmVJbmNvbWU6ICcwLjAwJywgLy/ntK/orqHmlLbnm4pcbiAgICBjYXNoTW9uZXlWYWx1ZTogbnVsbCwgLy/mj5DnjrDph5Hpop1cbiAgICBjYXNoU3RhdHVzOiBmYWxzZSxcbiAgICBkYXRhTGlzdDogW10sXG4gICAgcGFnZUluZm86IHtcbiAgICAgIGN1cnJlbnRQYWdlOiAwLFxuICAgICAgcGFnZVNpemU6IDEwLFxuICAgICAgdG90YWxQYWdlOiAwXG4gICAgfVxuICB9O1xuICBvbkxvYWQoKSB7XG4gICAgbGV0IGRhdGEgPSB7XG4gICAgICBjdXJyZW50UGFnZTogMCxcbiAgICAgIHBhZ2VTaXplOiAxMFxuICAgIH07XG4gICAgU0VMTC5sb2FkQWNjb3VudEluZm8ocmVzID0+IHtcbiAgICAgICd1c2Ugc3RyaWN0JztcbiAgICAgIGNvbnNvbGUubG9nKHJlcyk7XG4gICAgICBpZiAocmVzLmRhdGEucmVzdWx0Q29kZSA9PT0gJzEwMCcpIHtcbiAgICAgICAgdGhpcy5jYXNoTW9uZXkgPSByZXMuZGF0YS5yZXN1bHRDb250ZW50LmFtb3VudDtcbiAgICAgICAgdGhpcy5jdW11bGF0aXZlSW5jb21lID0gcmVzLmRhdGEucmVzdWx0Q29udGVudC5jdW11bGF0aXZlSW5jb21lO1xuICAgICAgICB0aGlzLiRhcHBseSgpO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgdXRpbHMuRXJyb3JUaXBzKHRoaXMsIHJlcy5kYXRhLmRldGFpbERlc2NyaXB0aW9uKTtcbiAgICAgIH1cbiAgICB9KTtcbiAgICBTRUxMLmdldFByb2R1Y3RMaXN0KGRhdGEsIHJlcyA9PiB7XG4gICAgICAndXNlIHN0cmljdCc7XG4gICAgICBpZiAocmVzLmRhdGEucmVzdWx0Q29kZSA9PT0gJzEwMCcpIHtcbiAgICAgICAgdGhpcy5kYXRhTGlzdCA9IHJlcy5kYXRhLnJlc3VsdENvbnRlbnQ7XG4gICAgICAgIHRoaXMucGFnZUluZm8gPSByZXMuZGF0YS5wYWdlSW5mbztcbiAgICAgICAgdGhpcy4kYXBwbHkoKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHV0aWxzLkVycm9yVGlwcyh0aGlzLCByZXMuZGF0YS5kZXRhaWxEZXNjcmlwdGlvbik7XG4gICAgICB9XG4gICAgfSk7XG4gIH1cbiAgbWV0aG9kcyA9IHtcbiAgICAvL+iOt+WPluWIl+ihqOaVsOaNrlxuICAgIGdldExpc3RMb3dlcjogKCkgPT4ge1xuICAgICAgJ3VzZSBzdHJpY3QnO1xuICAgICAgaWYgKHRoaXMuc3RvcCkge1xuICAgICAgICB0aGlzLnN0b3AgPSBmYWxzZTtcbiAgICAgICAgbGV0IHBhZ2VJbmZvID0gdGhpcy5wYWdlSW5mbztcbiAgICAgICAgbGV0IGRhdGEgPSB7XG4gICAgICAgICAgY3VycmVudFBhZ2U6IDAsXG4gICAgICAgICAgcGFnZVNpemU6IHBhZ2VJbmZvLnBhZ2VTaXplICsgMTBcbiAgICAgICAgfTtcbiAgICAgICAgU0VMTC5nZXRQcm9kdWN0TGlzdChkYXRhLCByZXMgPT4ge1xuICAgICAgICAgICd1c2Ugc3RyaWN0JztcbiAgICAgICAgICBjb25zb2xlLmxvZyhyZXMpO1xuICAgICAgICAgIGlmIChyZXMuZGF0YS5yZXN1bHRDb2RlID09PSAnMTAwJykge1xuICAgICAgICAgICAgdGhpcy5kYXRhTGlzdCA9IHJlcy5kYXRhLnJlc3VsdENvbnRlbnQ7XG4gICAgICAgICAgICB0aGlzLnBhZ2VJbmZvID0gcmVzLmRhdGEucGFnZUluZm87XG4gICAgICAgICAgICB0aGlzLnN0b3AgPSB0cnVlO1xuICAgICAgICAgICAgdGhpcy4kYXBwbHkoKTtcbiAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgdXRpbC5FcnJvclRpcHModGhpcywgcmVzLmRhdGEuZGV0YWlsRGVzY3JpcHRpb24pO1xuICAgICAgICAgIH1cbiAgICAgICAgfSk7XG4gICAgICB9XG4gICAgfSxcbiAgICAvLyDnu4jmraLmtLvliqhcbiAgICBzdG9wQWN0aXZpdHk6IGdvb2RJZCA9PiB7XG4gICAgICAndXNlIHN0cmljdCc7XG4gICAgICBpZiAodGhpcy5zdG9wKSB7XG4gICAgICAgIHRoaXMuc3RvcCA9IGZhbHNlO1xuICAgICAgICBTRUxMLnN0b3BBY3Rpdml0eShnb29kSWQsIHJlc3VsdCA9PiB7XG4gICAgICAgICAgY29uc29sZS5sb2cocmVzdWx0KTtcbiAgICAgICAgICBpZiAocmVzdWx0LmRhdGEucmVzdWx0Q29kZSA9PT0gJzEwMCcpIHtcbiAgICAgICAgICAgIGxldCBkYXRhID0ge1xuICAgICAgICAgICAgICBjdXJyZW50UGFnZTogMCxcbiAgICAgICAgICAgICAgcGFnZVNpemU6IDEwXG4gICAgICAgICAgICB9O1xuICAgICAgICAgICAgU0VMTC5nZXRQcm9kdWN0TGlzdChkYXRhLCByZXMgPT4ge1xuICAgICAgICAgICAgICAndXNlIHN0cmljdCc7XG4gICAgICAgICAgICAgIGNvbnNvbGUubG9nKHJlcyk7XG4gICAgICAgICAgICAgIGlmIChyZXMuZGF0YS5yZXN1bHRDb2RlID09PSAnMTAwJykge1xuICAgICAgICAgICAgICAgIHRoaXMuZGF0YUxpc3QgPSByZXMuZGF0YS5yZXN1bHRDb250ZW50O1xuICAgICAgICAgICAgICAgIHRoaXMucGFnZUluZm8gPSByZXMuZGF0YS5wYWdlSW5mbztcbiAgICAgICAgICAgICAgICB0aGlzLnN0b3AgPSB0cnVlO1xuICAgICAgICAgICAgICAgIHRoaXMuJGFwcGx5KCk7XG4gICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgdXRpbC5FcnJvclRpcHModGhpcywgcmVzLmRhdGEuZGV0YWlsRGVzY3JpcHRpb24pO1xuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICB9XG4gICAgICAgIH0pO1xuICAgICAgfVxuICAgIH0sXG4gICAgLy/ljrvliIbkuqtcbiAgICBnb1NoYXJlOiBnb29kSWQgPT4ge1xuICAgICAgJ3VzZSBzdHJpY3QnO1xuICAgICAgU0VMTC5sb25nVG9zaG9ydChnb29kSWQsIHJlcyA9PiB7XG4gICAgICAgIGlmIChyZXMuZGF0YS5yZXN1bHRDb2RlID09PSAnMTAwJykge1xuICAgICAgICAgIGxldCBwYXRoID0gYC9wYWdlcy9zZWxsL3dlYlZpZXcvaW5kZXg/c2NlbmU9JHtcbiAgICAgICAgICAgIHJlcy5kYXRhLnJlc3VsdENvbnRlbnRcbiAgICAgICAgICB9YDtcbiAgICAgICAgICB1dGlscy5wYWdlR28ocGF0aCwgMSk7XG4gICAgICAgIH1cbiAgICAgIH0pO1xuICAgIH0sXG4gICAgLy8g5Y675ZSu5ZCO6K6w5b2VXG4gICAgZ29SZWNvcmQ6IGdvb2RJZCA9PiB7XG4gICAgICAndXNlIHN0cmljdCc7XG4gICAgICBsZXQgcGF0aCA9IGAvcGFnZXMvc2VsbC9yZWNvcmQvaW5kZXg/c2NlbmU9JHtnb29kSWR9YDtcbiAgICAgIHV0aWxzLnBhZ2VHbyhwYXRoLCAxKTtcbiAgICB9LFxuICAgIC8v5o+Q546w5qih5oCBXG4gICAgY2FzaEFsbE1vbmV5OiBtb25leSA9PiB7XG4gICAgICAndXNlIHN0cmljdCc7XG4gICAgICB0aGlzLmNhc2hNb25leVZhbHVlID0gbW9uZXk7XG4gICAgICB0aGlzLiRhcHBseSgpO1xuICAgIH0sXG4gICAgc2hvd0Nhc2g6ICgpID0+IHtcbiAgICAgIHRoaXMuY2FzaE1vbmV5VmFsdWUgPSBudWxsO1xuICAgICAgdGhpcy5jYXNoU3RhdHVzID0gdHJ1ZTtcbiAgICB9LFxuICAgIGhpZGVDYXNoOiAoKSA9PiB7XG4gICAgICB0aGlzLmNhc2hTdGF0dXMgPSBmYWxzZTtcbiAgICB9LFxuICAgIC8v6L6T5YWl5o+Q546w6YeR6aKdXG4gICAgaXB0Q2FzaE1vbmV5OiBlID0+IHtcbiAgICAgIGNvbnNvbGUubG9nKGUuZGV0YWlsLnZhbHVlKTtcbiAgICAgIGlmIChlLmRldGFpbC52YWx1ZSA8IHRoaXMuY2FzaE1vbmV5KSB7XG4gICAgICAgIHRoaXMuY2FzaE1vbmV5VmFsdWUgPSBlLmRldGFpbC52YWx1ZTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHRoaXMuY2FzaE1vbmV5VmFsdWUgPSBlLmRldGFpbC52YWx1ZTtcbiAgICAgICAgdXRpbHMuRXJyb3JUaXBzKHRoaXMsICfmnIDlpJrmj5DnjrAnICsgdGhpcy5jYXNoTW9uZXkgKyAn5YWDJyk7XG4gICAgICB9XG4gICAgfSxcbiAgICAvLyDnoa7orqTmj5DnjrBcbiAgICBjb25maXJtQ2FzaDogZSA9PiB7XG4gICAgICAndXNlIHN0cmljdCc7XG4gICAgICBpZiAodGhpcy5jYXNoTW9uZXlWYWx1ZSA+IHRoaXMuY2FzaE1vbmV5KSB7XG4gICAgICAgIHV0aWxzLkVycm9yVGlwcyh0aGlzLCAn5pyA5aSa5o+Q546wJyArIHRoaXMuY2FzaE1vbmV5ICsgJ+WFgycpO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgaWYgKHRoaXMuc3RvcCkge1xuICAgICAgICAgIHRoaXMuc3RvcCA9IGZhbHNlO1xuICAgICAgICAgIGxldCBkYXRhUGFyYW1zID0ge1xuICAgICAgICAgICAgYW1vdW50OiB0aGlzLmRhdGEuY2FzaE1vbmV5VmFsdWUsXG4gICAgICAgICAgICBhcHBJZDogQVBJLkFQUF9JRCxcbiAgICAgICAgICAgIG9wZW5JZDogd3guZ2V0U3RvcmFnZVN5bmMoJ29wZW5pZCcpLFxuICAgICAgICAgICAgd2l0aERyYXdEZXM6ICflpb3nianmnaXmtLvliqjmlLblhaUnXG4gICAgICAgICAgfTtcbiAgICAgICAgICBTRUxMLndpdGhEcmF3UGF5KGRhdGFQYXJhbXMsIHJlcyA9PiB7XG4gICAgICAgICAgICBjb25zb2xlLmxvZyhyZXMpO1xuICAgICAgICAgICAgaWYgKHJlcy5kYXRhLnJlc3VsdENvZGUgPT09ICcxMDAnKSB7XG4gICAgICAgICAgICAgIHV0aWwuc3VjY2Vzc1Nob3dUZXh0KCfmj5DnjrDmiJDlip8nKTtcbiAgICAgICAgICAgICAgdGhpcy5zdG9wID0gdHJ1ZTtcbiAgICAgICAgICAgICAgdGhpcy5jYXNoU3RhdHVzID0gZmFsc2U7XG4gICAgICAgICAgICAgIHRoaXMuJGFwcGx5KCk7XG4gICAgICAgICAgICAgIFNFTEwubG9hZEFjY291bnRJbmZvKHJlcyA9PiB7XG4gICAgICAgICAgICAgICAgJ3VzZSBzdHJpY3QnO1xuICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKHJlcyk7XG4gICAgICAgICAgICAgICAgaWYgKHJlcy5kYXRhLnJlc3VsdENvZGUgPT09ICcxMDAnKSB7XG4gICAgICAgICAgICAgICAgICB0aGlzLmNhc2hNb25leSA9IHJlcy5kYXRhLnJlc3VsdENvbnRlbnQuYW1vdW50O1xuICAgICAgICAgICAgICAgICAgdGhpcy5jdW11bGF0aXZlSW5jb21lID1cbiAgICAgICAgICAgICAgICAgICAgcmVzLmRhdGEucmVzdWx0Q29udGVudC5jdW11bGF0aXZlSW5jb21lO1xuICAgICAgICAgICAgICAgICAgdGhpcy4kYXBwbHkoKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgdGhpcy5jYXNoU3RhdHVzID0gZmFsc2U7XG4gICAgICAgICAgICAgIHV0aWxzLkVycm9yVGlwcyh0aGlzLCByZXMuZGF0YS5kZXRhaWxEZXNjcmlwdGlvbik7XG4gICAgICAgICAgICAgIHRoaXMuJGFwcGx5KCk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfSk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgdXRpbHMuRXJyb3JUaXBzKHRoaXMsICfmraPlnKjlpITnkIbkuK0uLi4nKTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cbiAgfTtcbn1cbiJdfQ==