'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});


var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _wepy = require('./../../../npm/wepy/lib/wepy.js');

var _wepy2 = _interopRequireDefault(_wepy);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var WebView = function (_wepy$page) {
  _inherits(WebView, _wepy$page);

  function WebView() {
    _classCallCheck(this, WebView);

    return _possibleConstructorReturn(this, (WebView.__proto__ || Object.getPrototypeOf(WebView)).apply(this, arguments));
  }

  _createClass(WebView, [{
    key: 'onLoad',
    value: function onLoad(options) {
      var urls = 'https://wx.gemii.cc/gemii/poster/index.html?id=' + options.scene + '&urlType=pro';
      if (options.scene) {
        this.url = urls;
        this.$apply();
      }
    }
  }]);

  return WebView;
}(_wepy2.default.page);


Page(require('./../../../npm/wepy/lib/wepy.js').default.$createPage(WebView , 'pages/sell/webView/index'));

//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImluZGV4LmpzIl0sIm5hbWVzIjpbIldlYlZpZXciLCJvcHRpb25zIiwidXJscyIsInNjZW5lIiwidXJsIiwiJGFwcGx5Iiwid2VweSIsInBhZ2UiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7OztBQUNBOzs7Ozs7Ozs7Ozs7SUFDcUJBLE87Ozs7Ozs7Ozs7OzJCQUNaQyxPLEVBQVM7QUFDZCxVQUFJQyxPQUNGLG9EQUNBRCxRQUFRRSxLQURSLEdBRUEsY0FIRjtBQUlBLFVBQUlGLFFBQVFFLEtBQVosRUFBbUI7QUFDakIsYUFBS0MsR0FBTCxHQUFXRixJQUFYO0FBQ0EsYUFBS0csTUFBTDtBQUNEO0FBQ0Y7Ozs7RUFWa0NDLGVBQUtDLEk7O2tCQUFyQlAsTyIsImZpbGUiOiJpbmRleC5qcyIsInNvdXJjZXNDb250ZW50IjpbIlxuaW1wb3J0IHdlcHkgZnJvbSAnd2VweSc7XG5leHBvcnQgZGVmYXVsdCBjbGFzcyBXZWJWaWV3IGV4dGVuZHMgd2VweS5wYWdlIHtcbiAgb25Mb2FkKG9wdGlvbnMpIHtcbiAgICBsZXQgdXJscyA9XG4gICAgICAnaHR0cHM6Ly93eC5nZW1paS5jYy9nZW1paS9wb3N0ZXIvaW5kZXguaHRtbD9pZD0nICtcbiAgICAgIG9wdGlvbnMuc2NlbmUgK1xuICAgICAgJyZ1cmxUeXBlPXBybyc7XG4gICAgaWYgKG9wdGlvbnMuc2NlbmUpIHtcbiAgICAgIHRoaXMudXJsID0gdXJscztcbiAgICAgIHRoaXMuJGFwcGx5KCk7XG4gICAgfVxuICB9XG59XG4iXX0=