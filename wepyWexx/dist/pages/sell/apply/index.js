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

var Apply = function (_wepy$page) {
  _inherits(Apply, _wepy$page);

  function Apply() {
    var _ref;

    var _temp, _this, _ret;

    _classCallCheck(this, Apply);

    for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    return _ret = (_temp = (_this = _possibleConstructorReturn(this, (_ref = Apply.__proto__ || Object.getPrototypeOf(Apply)).call.apply(_ref, [this].concat(args))), _this), _this.config = {
      navigationBarTitleText: '店铺认证'
    }, _this.data = {
      name: null,
      phone: null,
      store: null,
      popErrorMsg: null, //错误提示信息
      stop: true //阻止机制
    }, _this.methods = {
      //输入姓名
      changeName: function changeName(e) {
        'use strict';

        _this.name = e.detail.value;
        _this.$apply();
      },
      //  输入手机号码
      changePhone: function changePhone(e) {
        _this.phone = e.detail.value;
        _this.$apply();
      },
      // 输入店铺名称
      changeStore: function changeStore(e) {
        'use strict';

        _this.store = e.detail.value;
        _this.$apply();
      },
      //提交申请
      submitApply: function submitApply() {
        var myreg = /^[1][3,4,5,7,8][0-9]{9}$/;
        'use strict';
        if (!_this.name || !_this.phone || !_this.store) {
          _util2.default.ErrorTips(_this, '请填写完整数据！');
        } else if (!myreg.test(_this.phone)) {
          _util2.default.ErrorTips(_this, '请确认手机号码!');
        } else {
          _AuthProvider2.default.onLogin('sell', _this.phone, function (res) {
            console.log(res);
            if (res.resultCode === '100') {
              _util2.default.pageGo(1, null, 1);
            }
            console.log(res, '卖家登录操作');
            if (res.code === 404) {
              var data = {
                phone: _this.phone,
                shopName: _this.store,
                username: _this.name
              };
              _sellFetch2.default.apply(data, function (res) {
                console.log(res, '申请入驻');
                if (res.data.resultCode === '100') {
                  _util2.default.ErrorTips(_this, '申请成功，待审核');
                  _util2.default.pageGo(1, null, 1);
                }
              });
            }
          });
        }
      }
    }, _temp), _possibleConstructorReturn(_this, _ret);
  }

  _createClass(Apply, [{
    key: 'onShow',
    value: function onShow() {
      this.name = null;
      this.phone = null;
      this.store = null;
      this.popErrorMsg = null;
      this.stop = true;
    }
  }]);

  return Apply;
}(_wepy2.default.page);


Page(require('./../../../npm/wepy/lib/wepy.js').default.$createPage(Apply , 'pages/sell/apply/index'));

//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImluZGV4LmpzIl0sIm5hbWVzIjpbIkFwcGx5IiwiY29uZmlnIiwibmF2aWdhdGlvbkJhclRpdGxlVGV4dCIsImRhdGEiLCJuYW1lIiwicGhvbmUiLCJzdG9yZSIsInBvcEVycm9yTXNnIiwic3RvcCIsIm1ldGhvZHMiLCJjaGFuZ2VOYW1lIiwiZSIsImRldGFpbCIsInZhbHVlIiwiJGFwcGx5IiwiY2hhbmdlUGhvbmUiLCJjaGFuZ2VTdG9yZSIsInN1Ym1pdEFwcGx5IiwibXlyZWciLCJ1dGlscyIsIkVycm9yVGlwcyIsInRlc3QiLCJBdXRoUHJvdmlkZXIiLCJvbkxvZ2luIiwiY29uc29sZSIsImxvZyIsInJlcyIsInJlc3VsdENvZGUiLCJwYWdlR28iLCJjb2RlIiwic2hvcE5hbWUiLCJ1c2VybmFtZSIsIlNFTEwiLCJhcHBseSIsIndlcHkiLCJwYWdlIl0sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7QUFDQTs7OztBQUNBOzs7O0FBQ0E7Ozs7QUFDQTs7Ozs7Ozs7Ozs7O0lBQ3FCQSxLOzs7Ozs7Ozs7Ozs7OztvTEFDbkJDLE0sR0FBUztBQUNQQyw4QkFBd0I7QUFEakIsSyxRQUdUQyxJLEdBQU87QUFDTEMsWUFBTSxJQUREO0FBRUxDLGFBQU8sSUFGRjtBQUdMQyxhQUFPLElBSEY7QUFJTEMsbUJBQWEsSUFKUixFQUljO0FBQ25CQyxZQUFNLElBTEQsQ0FLTTtBQUxOLEssUUFjUEMsTyxHQUFVO0FBQ1I7QUFDQUMsa0JBQVksdUJBQUs7QUFDZjs7QUFDQSxjQUFLTixJQUFMLEdBQVlPLEVBQUVDLE1BQUYsQ0FBU0MsS0FBckI7QUFDQSxjQUFLQyxNQUFMO0FBQ0QsT0FOTztBQU9SO0FBQ0FDLG1CQUFhLHdCQUFLO0FBQ2hCLGNBQUtWLEtBQUwsR0FBYU0sRUFBRUMsTUFBRixDQUFTQyxLQUF0QjtBQUNBLGNBQUtDLE1BQUw7QUFDRCxPQVhPO0FBWVI7QUFDQUUsbUJBQWEsd0JBQUs7QUFDaEI7O0FBQ0EsY0FBS1YsS0FBTCxHQUFhSyxFQUFFQyxNQUFGLENBQVNDLEtBQXRCO0FBQ0EsY0FBS0MsTUFBTDtBQUNELE9BakJPO0FBa0JSO0FBQ0FHLG1CQUFhLHVCQUFNO0FBQ2pCLFlBQUlDLFFBQVEsMEJBQVo7QUFDQyxvQkFBRDtBQUNBLFlBQUksQ0FBQyxNQUFLZCxJQUFOLElBQWMsQ0FBQyxNQUFLQyxLQUFwQixJQUE2QixDQUFDLE1BQUtDLEtBQXZDLEVBQThDO0FBQzVDYSx5QkFBTUMsU0FBTixRQUFzQixVQUF0QjtBQUNELFNBRkQsTUFFTyxJQUFJLENBQUNGLE1BQU1HLElBQU4sQ0FBVyxNQUFLaEIsS0FBaEIsQ0FBTCxFQUE2QjtBQUNsQ2MseUJBQU1DLFNBQU4sUUFBc0IsVUFBdEI7QUFDRCxTQUZNLE1BRUE7QUFDTEUsaUNBQWFDLE9BQWIsQ0FBcUIsTUFBckIsRUFBNkIsTUFBS2xCLEtBQWxDLEVBQXlDLGVBQU87QUFDOUNtQixvQkFBUUMsR0FBUixDQUFZQyxHQUFaO0FBQ0EsZ0JBQUlBLElBQUlDLFVBQUosS0FBbUIsS0FBdkIsRUFBOEI7QUFDNUJSLDZCQUFNUyxNQUFOLENBQWEsQ0FBYixFQUFnQixJQUFoQixFQUFzQixDQUF0QjtBQUNEO0FBQ0RKLG9CQUFRQyxHQUFSLENBQVlDLEdBQVosRUFBaUIsUUFBakI7QUFDQSxnQkFBSUEsSUFBSUcsSUFBSixLQUFhLEdBQWpCLEVBQXNCO0FBQ3BCLGtCQUFJMUIsT0FBTztBQUNURSx1QkFBTyxNQUFLQSxLQURIO0FBRVR5QiwwQkFBVSxNQUFLeEIsS0FGTjtBQUdUeUIsMEJBQVUsTUFBSzNCO0FBSE4sZUFBWDtBQUtBNEIsa0NBQUtDLEtBQUwsQ0FBVzlCLElBQVgsRUFBaUIsZUFBTztBQUN0QnFCLHdCQUFRQyxHQUFSLENBQVlDLEdBQVosRUFBaUIsTUFBakI7QUFDQSxvQkFBSUEsSUFBSXZCLElBQUosQ0FBU3dCLFVBQVQsS0FBd0IsS0FBNUIsRUFBbUM7QUFDakNSLGlDQUFNQyxTQUFOLFFBQXNCLFVBQXRCO0FBQ0FELGlDQUFNUyxNQUFOLENBQWEsQ0FBYixFQUFnQixJQUFoQixFQUFzQixDQUF0QjtBQUNEO0FBQ0YsZUFORDtBQU9EO0FBQ0YsV0FwQkQ7QUFxQkQ7QUFDRjtBQWpETyxLOzs7Ozs2QkFQRDtBQUNQLFdBQUt4QixJQUFMLEdBQVksSUFBWjtBQUNBLFdBQUtDLEtBQUwsR0FBYSxJQUFiO0FBQ0EsV0FBS0MsS0FBTCxHQUFhLElBQWI7QUFDQSxXQUFLQyxXQUFMLEdBQW1CLElBQW5CO0FBQ0EsV0FBS0MsSUFBTCxHQUFZLElBQVo7QUFDRDs7OztFQWpCZ0MwQixlQUFLQyxJOztrQkFBbkJuQyxLIiwiZmlsZSI6ImluZGV4LmpzIiwic291cmNlc0NvbnRlbnQiOlsiXG5pbXBvcnQgd2VweSBmcm9tICd3ZXB5JztcbmltcG9ydCBTRUxMIGZyb20gJy4uLy4uLy4uL3V0aWxzL3NlbGxGZXRjaC5qcyc7XG5pbXBvcnQgQXV0aFByb3ZpZGVyIGZyb20gJy4uLy4uLy4uL3V0aWxzL0F1dGhQcm92aWRlci5qcyc7XG5pbXBvcnQgdXRpbHMgZnJvbSAnLi4vLi4vLi4vdXRpbHMvdXRpbC5qcyc7XG5leHBvcnQgZGVmYXVsdCBjbGFzcyBBcHBseSBleHRlbmRzIHdlcHkucGFnZSB7XG4gIGNvbmZpZyA9IHtcbiAgICBuYXZpZ2F0aW9uQmFyVGl0bGVUZXh0OiAn5bqX6ZO66K6k6K+BJ1xuICB9O1xuICBkYXRhID0ge1xuICAgIG5hbWU6IG51bGwsXG4gICAgcGhvbmU6IG51bGwsXG4gICAgc3RvcmU6IG51bGwsXG4gICAgcG9wRXJyb3JNc2c6IG51bGwsIC8v6ZSZ6K+v5o+Q56S65L+h5oGvXG4gICAgc3RvcDogdHJ1ZSAvL+mYu+atouacuuWItlxuICB9O1xuICBvblNob3coKSB7XG4gICAgdGhpcy5uYW1lID0gbnVsbDtcbiAgICB0aGlzLnBob25lID0gbnVsbDtcbiAgICB0aGlzLnN0b3JlID0gbnVsbDtcbiAgICB0aGlzLnBvcEVycm9yTXNnID0gbnVsbDtcbiAgICB0aGlzLnN0b3AgPSB0cnVlO1xuICB9XG4gIG1ldGhvZHMgPSB7XG4gICAgLy/ovpPlhaXlp5PlkI1cbiAgICBjaGFuZ2VOYW1lOiBlID0+IHtcbiAgICAgICd1c2Ugc3RyaWN0JztcbiAgICAgIHRoaXMubmFtZSA9IGUuZGV0YWlsLnZhbHVlO1xuICAgICAgdGhpcy4kYXBwbHkoKTtcbiAgICB9LFxuICAgIC8vICDovpPlhaXmiYvmnLrlj7fnoIFcbiAgICBjaGFuZ2VQaG9uZTogZSA9PiB7XG4gICAgICB0aGlzLnBob25lID0gZS5kZXRhaWwudmFsdWU7XG4gICAgICB0aGlzLiRhcHBseSgpO1xuICAgIH0sXG4gICAgLy8g6L6T5YWl5bqX6ZO65ZCN56ewXG4gICAgY2hhbmdlU3RvcmU6IGUgPT4ge1xuICAgICAgJ3VzZSBzdHJpY3QnO1xuICAgICAgdGhpcy5zdG9yZSA9IGUuZGV0YWlsLnZhbHVlO1xuICAgICAgdGhpcy4kYXBwbHkoKTtcbiAgICB9LFxuICAgIC8v5o+Q5Lqk55Sz6K+3XG4gICAgc3VibWl0QXBwbHk6ICgpID0+IHtcbiAgICAgIGxldCBteXJlZyA9IC9eWzFdWzMsNCw1LDcsOF1bMC05XXs5fSQvO1xuICAgICAgKCd1c2Ugc3RyaWN0Jyk7XG4gICAgICBpZiAoIXRoaXMubmFtZSB8fCAhdGhpcy5waG9uZSB8fCAhdGhpcy5zdG9yZSkge1xuICAgICAgICB1dGlscy5FcnJvclRpcHModGhpcywgJ+ivt+Whq+WGmeWujOaVtOaVsOaNru+8gScpO1xuICAgICAgfSBlbHNlIGlmICghbXlyZWcudGVzdCh0aGlzLnBob25lKSkge1xuICAgICAgICB1dGlscy5FcnJvclRpcHModGhpcywgJ+ivt+ehruiupOaJi+acuuWPt+eggSEnKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIEF1dGhQcm92aWRlci5vbkxvZ2luKCdzZWxsJywgdGhpcy5waG9uZSwgcmVzID0+IHtcbiAgICAgICAgICBjb25zb2xlLmxvZyhyZXMpO1xuICAgICAgICAgIGlmIChyZXMucmVzdWx0Q29kZSA9PT0gJzEwMCcpIHtcbiAgICAgICAgICAgIHV0aWxzLnBhZ2VHbygxLCBudWxsLCAxKTtcbiAgICAgICAgICB9XG4gICAgICAgICAgY29uc29sZS5sb2cocmVzLCAn5Y2W5a6255m75b2V5pON5L2cJyk7XG4gICAgICAgICAgaWYgKHJlcy5jb2RlID09PSA0MDQpIHtcbiAgICAgICAgICAgIGxldCBkYXRhID0ge1xuICAgICAgICAgICAgICBwaG9uZTogdGhpcy5waG9uZSxcbiAgICAgICAgICAgICAgc2hvcE5hbWU6IHRoaXMuc3RvcmUsXG4gICAgICAgICAgICAgIHVzZXJuYW1lOiB0aGlzLm5hbWVcbiAgICAgICAgICAgIH07XG4gICAgICAgICAgICBTRUxMLmFwcGx5KGRhdGEsIHJlcyA9PiB7XG4gICAgICAgICAgICAgIGNvbnNvbGUubG9nKHJlcywgJ+eUs+ivt+WFpempuycpO1xuICAgICAgICAgICAgICBpZiAocmVzLmRhdGEucmVzdWx0Q29kZSA9PT0gJzEwMCcpIHtcbiAgICAgICAgICAgICAgICB1dGlscy5FcnJvclRpcHModGhpcywgJ+eUs+ivt+aIkOWKn++8jOW+heWuoeaguCcpO1xuICAgICAgICAgICAgICAgIHV0aWxzLnBhZ2VHbygxLCBudWxsLCAxKTtcbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgfVxuICAgICAgICB9KTtcbiAgICAgIH1cbiAgICB9XG4gIH07XG59XG4iXX0=