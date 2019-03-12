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

var Recoed = function (_wepy$page) {
  _inherits(Recoed, _wepy$page);

  function Recoed() {
    var _ref;

    var _temp, _this, _ret;

    _classCallCheck(this, Recoed);

    for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    return _ret = (_temp = (_this = _possibleConstructorReturn(this, (_ref = Recoed.__proto__ || Object.getPrototypeOf(Recoed)).call.apply(_ref, [this].concat(args))), _this), _this.config = {
      navigationBarTitleText: '销售记录'
    }, _this.data = {
      popErrorMsg: null, //错误提示
      stop: true, //阻止机制
      id: null, //商品id
      dataList: {
        orderRecords: [],
        skuName: '',
        skuPic: null
      },
      pageInfo: {
        currentPage: 0,
        pageSize: 10
      }
    }, _temp), _possibleConstructorReturn(_this, _ret);
  }

  _createClass(Recoed, [{
    key: 'onLoad',
    value: function onLoad(options) {
      var _this2 = this;

      _sellFetch2.default.shortTolong(options.scene, function (result) {
        'use strict';

        if (result.data.resultCode === '100') {
          var data = {
            id: result.data.resultContent,
            currentPage: 0,
            pageSize: 10
          };
          _sellFetch2.default.getOrdersList(data, function (res) {
            'use strict';

            console.log(res);
            if (res.data.resultCode === '100') {
              _this2.id = result.data.resultContent;
              _this2.pageInfo = res.data.pageInfo;
              _this2.dataList = _this2.formatList(res.data.resultContent);
              _this2.$apply();
            } else {
              _util2.default.ErrorTips(_this2, res.data.detailDescription);
            }
          });
        }
      });
    }
  }, {
    key: 'formatList',
    value: function formatList(arr) {
      var _this3 = this;

      arr.orderRecords.map(function (item) {
        'use strict';

        item.payType = _this3.formatPayType(item.payType);
        item.createTime = _this3.formatKillDate(item.createTime);
      });
      return arr;
    }
  }, {
    key: 'formatPayType',
    value: function formatPayType(str) {
      switch (str) {
        case 8:
          return '到店支付';
          break;
        case 3:
          return '在线支付';
          break;
      }
    }
  }, {
    key: 'formatKillDate',
    value: function formatKillDate(str) {
      return str.replace('T', ' ');
    }
  }]);

  return Recoed;
}(_wepy2.default.page);


Page(require('./../../../npm/wepy/lib/wepy.js').default.$createPage(Recoed , 'pages/sell/record/index'));

//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImluZGV4LmpzIl0sIm5hbWVzIjpbIlJlY29lZCIsImNvbmZpZyIsIm5hdmlnYXRpb25CYXJUaXRsZVRleHQiLCJkYXRhIiwicG9wRXJyb3JNc2ciLCJzdG9wIiwiaWQiLCJkYXRhTGlzdCIsIm9yZGVyUmVjb3JkcyIsInNrdU5hbWUiLCJza3VQaWMiLCJwYWdlSW5mbyIsImN1cnJlbnRQYWdlIiwicGFnZVNpemUiLCJvcHRpb25zIiwiU0VMTCIsInNob3J0VG9sb25nIiwic2NlbmUiLCJyZXN1bHQiLCJyZXN1bHRDb2RlIiwicmVzdWx0Q29udGVudCIsImdldE9yZGVyc0xpc3QiLCJjb25zb2xlIiwibG9nIiwicmVzIiwiZm9ybWF0TGlzdCIsIiRhcHBseSIsInV0aWxzIiwiRXJyb3JUaXBzIiwiZGV0YWlsRGVzY3JpcHRpb24iLCJhcnIiLCJtYXAiLCJpdGVtIiwicGF5VHlwZSIsImZvcm1hdFBheVR5cGUiLCJjcmVhdGVUaW1lIiwiZm9ybWF0S2lsbERhdGUiLCJzdHIiLCJyZXBsYWNlIiwid2VweSIsInBhZ2UiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7OztBQUNBOzs7O0FBQ0E7Ozs7QUFDQTs7OztBQUNBOzs7O0FBQ0E7Ozs7Ozs7Ozs7OztJQUNxQkEsTTs7Ozs7Ozs7Ozs7Ozs7c0xBQ25CQyxNLEdBQVM7QUFDUEMsOEJBQXdCO0FBRGpCLEssUUFHVEMsSSxHQUFPO0FBQ0xDLG1CQUFhLElBRFIsRUFDYztBQUNuQkMsWUFBTSxJQUZELEVBRU87QUFDWkMsVUFBSSxJQUhDLEVBR0s7QUFDVkMsZ0JBQVU7QUFDUkMsc0JBQWMsRUFETjtBQUVSQyxpQkFBUyxFQUZEO0FBR1JDLGdCQUFRO0FBSEEsT0FKTDtBQVNMQyxnQkFBVTtBQUNSQyxxQkFBYSxDQURMO0FBRVJDLGtCQUFVO0FBRkY7QUFUTCxLOzs7OzsyQkFjQUMsTyxFQUFTO0FBQUE7O0FBQ2RDLDBCQUFLQyxXQUFMLENBQWlCRixRQUFRRyxLQUF6QixFQUFnQyxrQkFBVTtBQUN4Qzs7QUFDQSxZQUFJQyxPQUFPZixJQUFQLENBQVlnQixVQUFaLEtBQTJCLEtBQS9CLEVBQXNDO0FBQ3BDLGNBQUloQixPQUFPO0FBQ1RHLGdCQUFJWSxPQUFPZixJQUFQLENBQVlpQixhQURQO0FBRVRSLHlCQUFhLENBRko7QUFHVEMsc0JBQVU7QUFIRCxXQUFYO0FBS0FFLDhCQUFLTSxhQUFMLENBQW1CbEIsSUFBbkIsRUFBeUIsZUFBTztBQUM5Qjs7QUFDQW1CLG9CQUFRQyxHQUFSLENBQVlDLEdBQVo7QUFDQSxnQkFBSUEsSUFBSXJCLElBQUosQ0FBU2dCLFVBQVQsS0FBd0IsS0FBNUIsRUFBbUM7QUFDakMscUJBQUtiLEVBQUwsR0FBVVksT0FBT2YsSUFBUCxDQUFZaUIsYUFBdEI7QUFDQSxxQkFBS1QsUUFBTCxHQUFnQmEsSUFBSXJCLElBQUosQ0FBU1EsUUFBekI7QUFDQSxxQkFBS0osUUFBTCxHQUFnQixPQUFLa0IsVUFBTCxDQUFnQkQsSUFBSXJCLElBQUosQ0FBU2lCLGFBQXpCLENBQWhCO0FBQ0EscUJBQUtNLE1BQUw7QUFDRCxhQUxELE1BS087QUFDTEMsNkJBQU1DLFNBQU4sQ0FBZ0IsTUFBaEIsRUFBc0JKLElBQUlyQixJQUFKLENBQVMwQixpQkFBL0I7QUFDRDtBQUNGLFdBWEQ7QUFZRDtBQUNGLE9BckJEO0FBc0JEOzs7K0JBQ1VDLEcsRUFBSztBQUFBOztBQUNkQSxVQUFJdEIsWUFBSixDQUFpQnVCLEdBQWpCLENBQXFCLGdCQUFRO0FBQzNCOztBQUNBQyxhQUFLQyxPQUFMLEdBQWUsT0FBS0MsYUFBTCxDQUFtQkYsS0FBS0MsT0FBeEIsQ0FBZjtBQUNBRCxhQUFLRyxVQUFMLEdBQWtCLE9BQUtDLGNBQUwsQ0FBb0JKLEtBQUtHLFVBQXpCLENBQWxCO0FBQ0QsT0FKRDtBQUtBLGFBQU9MLEdBQVA7QUFDRDs7O2tDQUNhTyxHLEVBQUs7QUFDakIsY0FBUUEsR0FBUjtBQUNFLGFBQUssQ0FBTDtBQUNFLGlCQUFPLE1BQVA7QUFDQTtBQUNGLGFBQUssQ0FBTDtBQUNFLGlCQUFPLE1BQVA7QUFDQTtBQU5KO0FBUUQ7OzttQ0FDY0EsRyxFQUFLO0FBQ2xCLGFBQU9BLElBQUlDLE9BQUosQ0FBWSxHQUFaLEVBQWlCLEdBQWpCLENBQVA7QUFDRDs7OztFQTlEaUNDLGVBQUtDLEk7O2tCQUFwQnhDLE0iLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VzQ29udGVudCI6WyJcbmltcG9ydCB3ZXB5IGZyb20gJ3dlcHknO1xuaW1wb3J0IFNFTEwgZnJvbSAnLi4vLi4vLi4vdXRpbHMvc2VsbEZldGNoLmpzJztcbmltcG9ydCBBdXRoUHJvdmlkZXIgZnJvbSAnLi4vLi4vLi4vdXRpbHMvQXV0aFByb3ZpZGVyLmpzJztcbmltcG9ydCB1dGlscyBmcm9tICcuLi8uLi8uLi91dGlscy91dGlsLmpzJztcbmltcG9ydCBBUEkgZnJvbSAnLi4vLi4vLi4vdXRpbHMvYXBpLmpzJztcbmV4cG9ydCBkZWZhdWx0IGNsYXNzIFJlY29lZCBleHRlbmRzIHdlcHkucGFnZSB7XG4gIGNvbmZpZyA9IHtcbiAgICBuYXZpZ2F0aW9uQmFyVGl0bGVUZXh0OiAn6ZSA5ZSu6K6w5b2VJ1xuICB9O1xuICBkYXRhID0ge1xuICAgIHBvcEVycm9yTXNnOiBudWxsLCAvL+mUmeivr+aPkOekulxuICAgIHN0b3A6IHRydWUsIC8v6Zi75q2i5py65Yi2XG4gICAgaWQ6IG51bGwsIC8v5ZWG5ZOBaWRcbiAgICBkYXRhTGlzdDoge1xuICAgICAgb3JkZXJSZWNvcmRzOiBbXSxcbiAgICAgIHNrdU5hbWU6ICcnLFxuICAgICAgc2t1UGljOiBudWxsXG4gICAgfSxcbiAgICBwYWdlSW5mbzoge1xuICAgICAgY3VycmVudFBhZ2U6IDAsXG4gICAgICBwYWdlU2l6ZTogMTBcbiAgICB9XG4gIH07XG4gIG9uTG9hZChvcHRpb25zKSB7XG4gICAgU0VMTC5zaG9ydFRvbG9uZyhvcHRpb25zLnNjZW5lLCByZXN1bHQgPT4ge1xuICAgICAgJ3VzZSBzdHJpY3QnO1xuICAgICAgaWYgKHJlc3VsdC5kYXRhLnJlc3VsdENvZGUgPT09ICcxMDAnKSB7XG4gICAgICAgIGxldCBkYXRhID0ge1xuICAgICAgICAgIGlkOiByZXN1bHQuZGF0YS5yZXN1bHRDb250ZW50LFxuICAgICAgICAgIGN1cnJlbnRQYWdlOiAwLFxuICAgICAgICAgIHBhZ2VTaXplOiAxMFxuICAgICAgICB9O1xuICAgICAgICBTRUxMLmdldE9yZGVyc0xpc3QoZGF0YSwgcmVzID0+IHtcbiAgICAgICAgICAndXNlIHN0cmljdCc7XG4gICAgICAgICAgY29uc29sZS5sb2cocmVzKTtcbiAgICAgICAgICBpZiAocmVzLmRhdGEucmVzdWx0Q29kZSA9PT0gJzEwMCcpIHtcbiAgICAgICAgICAgIHRoaXMuaWQgPSByZXN1bHQuZGF0YS5yZXN1bHRDb250ZW50O1xuICAgICAgICAgICAgdGhpcy5wYWdlSW5mbyA9IHJlcy5kYXRhLnBhZ2VJbmZvO1xuICAgICAgICAgICAgdGhpcy5kYXRhTGlzdCA9IHRoaXMuZm9ybWF0TGlzdChyZXMuZGF0YS5yZXN1bHRDb250ZW50KTtcbiAgICAgICAgICAgIHRoaXMuJGFwcGx5KCk7XG4gICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHV0aWxzLkVycm9yVGlwcyh0aGlzLCByZXMuZGF0YS5kZXRhaWxEZXNjcmlwdGlvbik7XG4gICAgICAgICAgfVxuICAgICAgICB9KTtcbiAgICAgIH1cbiAgICB9KTtcbiAgfVxuICBmb3JtYXRMaXN0KGFycikge1xuICAgIGFyci5vcmRlclJlY29yZHMubWFwKGl0ZW0gPT4ge1xuICAgICAgJ3VzZSBzdHJpY3QnO1xuICAgICAgaXRlbS5wYXlUeXBlID0gdGhpcy5mb3JtYXRQYXlUeXBlKGl0ZW0ucGF5VHlwZSk7XG4gICAgICBpdGVtLmNyZWF0ZVRpbWUgPSB0aGlzLmZvcm1hdEtpbGxEYXRlKGl0ZW0uY3JlYXRlVGltZSk7XG4gICAgfSk7XG4gICAgcmV0dXJuIGFycjtcbiAgfVxuICBmb3JtYXRQYXlUeXBlKHN0cikge1xuICAgIHN3aXRjaCAoc3RyKSB7XG4gICAgICBjYXNlIDg6XG4gICAgICAgIHJldHVybiAn5Yiw5bqX5pSv5LuYJztcbiAgICAgICAgYnJlYWs7XG4gICAgICBjYXNlIDM6XG4gICAgICAgIHJldHVybiAn5Zyo57q/5pSv5LuYJztcbiAgICAgICAgYnJlYWs7XG4gICAgfVxuICB9XG4gIGZvcm1hdEtpbGxEYXRlKHN0cikge1xuICAgIHJldHVybiBzdHIucmVwbGFjZSgnVCcsICcgJyk7XG4gIH1cbn1cbiJdfQ==