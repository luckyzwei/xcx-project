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

var buySuccess = function (_wepy$page) {
  _inherits(buySuccess, _wepy$page);

  function buySuccess() {
    var _ref;

    var _temp, _this, _ret;

    _classCallCheck(this, buySuccess);

    for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    return _ret = (_temp = (_this = _possibleConstructorReturn(this, (_ref = buySuccess.__proto__ || Object.getPrototypeOf(buySuccess)).call.apply(_ref, [this].concat(args))), _this), _this.data = {
      address: '',
      code: '',
      coverPhoto: '',
      goodName: ''
    }, _temp), _possibleConstructorReturn(_this, _ret);
  }

  _createClass(buySuccess, [{
    key: 'onLoad',
    value: function onLoad() {
      var _this2 = this;

      var url = _api2.default.getGoodInfo;
      var goodId = options.scene;
      _wxRequest2.default.fetch(_api2.default.getGoodInfo + '?goodId=' + goodId, null, null, 'GET').then(function (res) {
        _this2.address = res.data.resultContent.productWarehouse.bondedWarehouseName;
        _this2.code = res.data.resultContent.productDescription.find(function (item) {
          return item.type == 6;
        }).code;
        _this2.coverPhoto = res.data.resultContent.coverPhoto;
        _this2.goodName = res.data.resultContent.name;
        _this2.$apply();
      });
    }
  }]);

  return buySuccess;
}(_wepy2.default.page);


Page(require('./../../../npm/wepy/lib/wepy.js').default.$createPage(buySuccess , 'pages/buyer/success/index'));

//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImluZGV4LmpzIl0sIm5hbWVzIjpbImJ1eVN1Y2Nlc3MiLCJkYXRhIiwiYWRkcmVzcyIsImNvZGUiLCJjb3ZlclBob3RvIiwiZ29vZE5hbWUiLCJ1cmwiLCJBUEkiLCJnZXRHb29kSW5mbyIsImdvb2RJZCIsIm9wdGlvbnMiLCJzY2VuZSIsInd4UmVxdWVzdCIsImZldGNoIiwidGhlbiIsInJlcyIsInJlc3VsdENvbnRlbnQiLCJwcm9kdWN0V2FyZWhvdXNlIiwiYm9uZGVkV2FyZWhvdXNlTmFtZSIsInByb2R1Y3REZXNjcmlwdGlvbiIsImZpbmQiLCJpdGVtIiwidHlwZSIsIm5hbWUiLCIkYXBwbHkiLCJ3ZXB5IiwicGFnZSJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7O0FBQ0E7Ozs7QUFDQTs7OztBQUNBOzs7O0FBQ0E7Ozs7QUFDQTs7OztBQUNBOzs7Ozs7Ozs7Ozs7SUFDcUJBLFU7Ozs7Ozs7Ozs7Ozs7OzhMQUNuQkMsSSxHQUFPO0FBQ0xDLGVBQVMsRUFESjtBQUVMQyxZQUFNLEVBRkQ7QUFHTEMsa0JBQVksRUFIUDtBQUlMQyxnQkFBVTtBQUpMLEs7Ozs7OzZCQU1FO0FBQUE7O0FBQ1AsVUFBSUMsTUFBTUMsY0FBSUMsV0FBZDtBQUNBLFVBQUlDLFNBQVNDLFFBQVFDLEtBQXJCO0FBQ0FDLDBCQUNHQyxLQURILENBQ1NOLGNBQUlDLFdBQUosR0FBa0IsVUFBbEIsR0FBK0JDLE1BRHhDLEVBQ2dELElBRGhELEVBQ3NELElBRHRELEVBQzRELEtBRDVELEVBRUdLLElBRkgsQ0FFUSxlQUFPO0FBQ1gsZUFBS1osT0FBTCxHQUNFYSxJQUFJZCxJQUFKLENBQVNlLGFBQVQsQ0FBdUJDLGdCQUF2QixDQUF3Q0MsbUJBRDFDO0FBRUEsZUFBS2YsSUFBTCxHQUFZWSxJQUFJZCxJQUFKLENBQVNlLGFBQVQsQ0FBdUJHLGtCQUF2QixDQUEwQ0MsSUFBMUMsQ0FDVjtBQUFBLGlCQUFRQyxLQUFLQyxJQUFMLElBQWEsQ0FBckI7QUFBQSxTQURVLEVBRVZuQixJQUZGO0FBR0EsZUFBS0MsVUFBTCxHQUFrQlcsSUFBSWQsSUFBSixDQUFTZSxhQUFULENBQXVCWixVQUF6QztBQUNBLGVBQUtDLFFBQUwsR0FBZ0JVLElBQUlkLElBQUosQ0FBU2UsYUFBVCxDQUF1Qk8sSUFBdkM7QUFDQSxlQUFLQyxNQUFMO0FBQ0QsT0FYSDtBQVlEOzs7O0VBdEJxQ0MsZUFBS0MsSTs7a0JBQXhCMUIsVSIsImZpbGUiOiJpbmRleC5qcyIsInNvdXJjZXNDb250ZW50IjpbIlxuaW1wb3J0IHdlcHkgZnJvbSAnd2VweSc7XG5pbXBvcnQgU0VMTCBmcm9tICcuLi8uLi8uLi91dGlscy9zZWxsRmV0Y2guanMnO1xuaW1wb3J0IEF1dGhQcm92aWRlciBmcm9tICcuLi8uLi8uLi91dGlscy9BdXRoUHJvdmlkZXIuanMnO1xuaW1wb3J0IHV0aWxzIGZyb20gJy4uLy4uLy4uL3V0aWxzL3V0aWwuanMnO1xuaW1wb3J0IEFQSSBmcm9tICcuLi8uLi8uLi91dGlscy9hcGkuanMnO1xuaW1wb3J0IHd4UmVxdWVzdCBmcm9tICcuLi8uLi8uLi91dGlscy93eFJlcXVlc3QuanMnO1xuZXhwb3J0IGRlZmF1bHQgY2xhc3MgYnV5U3VjY2VzcyBleHRlbmRzIHdlcHkucGFnZSB7XG4gIGRhdGEgPSB7XG4gICAgYWRkcmVzczogJycsXG4gICAgY29kZTogJycsXG4gICAgY292ZXJQaG90bzogJycsXG4gICAgZ29vZE5hbWU6ICcnXG4gIH07XG4gIG9uTG9hZCgpIHtcbiAgICBsZXQgdXJsID0gQVBJLmdldEdvb2RJbmZvO1xuICAgIGxldCBnb29kSWQgPSBvcHRpb25zLnNjZW5lO1xuICAgIHd4UmVxdWVzdFxuICAgICAgLmZldGNoKEFQSS5nZXRHb29kSW5mbyArICc/Z29vZElkPScgKyBnb29kSWQsIG51bGwsIG51bGwsICdHRVQnKVxuICAgICAgLnRoZW4ocmVzID0+IHtcbiAgICAgICAgdGhpcy5hZGRyZXNzID1cbiAgICAgICAgICByZXMuZGF0YS5yZXN1bHRDb250ZW50LnByb2R1Y3RXYXJlaG91c2UuYm9uZGVkV2FyZWhvdXNlTmFtZTtcbiAgICAgICAgdGhpcy5jb2RlID0gcmVzLmRhdGEucmVzdWx0Q29udGVudC5wcm9kdWN0RGVzY3JpcHRpb24uZmluZChcbiAgICAgICAgICBpdGVtID0+IGl0ZW0udHlwZSA9PSA2XG4gICAgICAgICkuY29kZTtcbiAgICAgICAgdGhpcy5jb3ZlclBob3RvID0gcmVzLmRhdGEucmVzdWx0Q29udGVudC5jb3ZlclBob3RvO1xuICAgICAgICB0aGlzLmdvb2ROYW1lID0gcmVzLmRhdGEucmVzdWx0Q29udGVudC5uYW1lO1xuICAgICAgICB0aGlzLiRhcHBseSgpO1xuICAgICAgfSk7XG4gIH1cbn1cbiJdfQ==