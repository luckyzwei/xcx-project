'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = undefined;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _wepy = require('./../npm/wepy/lib/wepy.js');

var _wepy2 = _interopRequireDefault(_wepy);

var _util = require('./../utils/util.js');

var _util2 = _interopRequireDefault(_util);

var _weCropper = require('./../npm/we-cropper/dist/we-cropper.js');

var _weCropper2 = _interopRequireDefault(_weCropper);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var wecropper = {};

var wecroppers = function (_wepy$component) {
  _inherits(wecroppers, _wepy$component);

  function wecroppers() {
    var _ref;

    var _temp, _this2, _ret;

    _classCallCheck(this, wecroppers);

    for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    return _ret = (_temp = (_this2 = _possibleConstructorReturn(this, (_ref = wecroppers.__proto__ || Object.getPrototypeOf(wecroppers)).call.apply(_ref, [this].concat(args))), _this2), _this2.props = {
      cropperopt: {
        type: Object,
        default: {},
        twoWay: true
      },
      showstatus: {
        type: Boolean,
        default: false
      },
      fromdata: {
        type: Object,
        default: {},
        twoWay: true
      },
      imgUrl: {
        type: String,
        default: '',
        twoWay: true
      }
    }, _this2.methods = {
      touchStart: function touchStart(e) {
        wecropper.touchStart(e);
      },
      touchMove: function touchMove(e) {
        wecropper.touchMove(e);
      },
      touchEnd: function touchEnd(e) {
        wecropper.touchEnd(e);
      },
      getCropperImage: function getCropperImage() {
        var _this = _this2;
        wecropper.getCropperImage(function (src) {
          if (src) {
            console.log(src, 'tupianlianjie');
            _util2.default.downloadImg(src, function (res) {
              console.log(res);
              _this.imgUrl = res.url;
              _this.showstatus = false;
              _this.fromdata.mediaItem.path = res.url;
              _this.fromdata.mediaItem.mediaId = res.id;
              _this.$apply();
            });
            // wx.previewImage({
            //   current: '', // 当前显示图片的http链接
            //   urls: [src] // 需要预览的图片http链接列表
            // });
          } else {
            console.log('获取图片地址失败，请稍后重试');
          }
        });
      },
      uploadTap: function uploadTap(e) {
        var self = _this2;
        console.log(self);
        wx.chooseImage({
          count: 1, // 默认9
          sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有
          sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
          success: function success(res) {
            var src = res.tempFilePaths[0];
            //  获取裁剪图片资源后，给data添加src属性及其值
            self.showstatus = true;
            self.$apply();
            console.log(src);
            console.log(wecropper);
            wecropper.pushOrign(src);
          }
        });
      }
    }, _temp), _possibleConstructorReturn(_this2, _ret);
  }

  _createClass(wecroppers, [{
    key: 'onLoad',
    value: function onLoad() {
      var cropperopt = this.cropperopt;
      wecropper = new _weCropper2.default(cropperopt).on('ready', function (ctx) {
        console.log('wecropper is ready for work!');
      }).on('beforeImageLoad', function (ctx) {
        console.log('before picture loaded, i can do something');
        console.log('current canvas context:', ctx);
        wx.showToast({
          title: '上传中',
          icon: 'loading',
          duration: 20000
        });
      }).on('imageLoad', function (ctx) {
        console.log('picture loaded');
        console.log('current canvas context:', ctx);
        wx.hideToast();
      }).on('beforeDraw', function (ctx, instance) {
        console.log('before canvas draw,i can do something');
        console.log('current canvas context:', ctx);
      }).updateCanvas();
    }
  }]);

  return wecroppers;
}(_wepy2.default.component);

exports.default = wecroppers;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlY3JvcHBlci5qcyJdLCJuYW1lcyI6WyJ3ZWNyb3BwZXIiLCJ3ZWNyb3BwZXJzIiwicHJvcHMiLCJjcm9wcGVyb3B0IiwidHlwZSIsIk9iamVjdCIsImRlZmF1bHQiLCJ0d29XYXkiLCJzaG93c3RhdHVzIiwiQm9vbGVhbiIsImZyb21kYXRhIiwiaW1nVXJsIiwiU3RyaW5nIiwibWV0aG9kcyIsInRvdWNoU3RhcnQiLCJlIiwidG91Y2hNb3ZlIiwidG91Y2hFbmQiLCJnZXRDcm9wcGVySW1hZ2UiLCJfdGhpcyIsInNyYyIsImNvbnNvbGUiLCJsb2ciLCJ1dGlscyIsImRvd25sb2FkSW1nIiwicmVzIiwidXJsIiwibWVkaWFJdGVtIiwicGF0aCIsIm1lZGlhSWQiLCJpZCIsIiRhcHBseSIsInVwbG9hZFRhcCIsInNlbGYiLCJ3eCIsImNob29zZUltYWdlIiwiY291bnQiLCJzaXplVHlwZSIsInNvdXJjZVR5cGUiLCJzdWNjZXNzIiwidGVtcEZpbGVQYXRocyIsInB1c2hPcmlnbiIsIldlQ3JvcHBlciIsIm9uIiwiY3R4Iiwic2hvd1RvYXN0IiwidGl0bGUiLCJpY29uIiwiZHVyYXRpb24iLCJoaWRlVG9hc3QiLCJpbnN0YW5jZSIsInVwZGF0ZUNhbnZhcyIsIndlcHkiLCJjb21wb25lbnQiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7OztBQUNBOzs7O0FBQ0E7Ozs7QUFDQTs7Ozs7Ozs7Ozs7O0FBQ0EsSUFBSUEsWUFBWSxFQUFoQjs7SUFDcUJDLFU7Ozs7Ozs7Ozs7Ozs7O2lNQUNuQkMsSyxHQUFRO0FBQ05DLGtCQUFZO0FBQ1ZDLGNBQU1DLE1BREk7QUFFVkMsaUJBQVMsRUFGQztBQUdWQyxnQkFBUTtBQUhFLE9BRE47QUFNTkMsa0JBQVk7QUFDVkosY0FBTUssT0FESTtBQUVWSCxpQkFBUztBQUZDLE9BTk47QUFVTkksZ0JBQVU7QUFDUk4sY0FBTUMsTUFERTtBQUVSQyxpQkFBUyxFQUZEO0FBR1JDLGdCQUFRO0FBSEEsT0FWSjtBQWVOSSxjQUFRO0FBQ05Q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QUF4QnBELFUiLCJmaWxlIjoid2Vjcm9wcGVyLmpzIiwic291cmNlc0NvbnRlbnQiOlsiXG5pbXBvcnQgd2VweSBmcm9tICd3ZXB5JztcbmltcG9ydCB1dGlscyBmcm9tICcuLi91dGlscy91dGlsLmpzJztcbmltcG9ydCBXZUNyb3BwZXIgZnJvbSAnd2UtY3JvcHBlcic7XG5sZXQgd2Vjcm9wcGVyID0ge307XG5leHBvcnQgZGVmYXVsdCBjbGFzcyB3ZWNyb3BwZXJzIGV4dGVuZHMgd2VweS5jb21wb25lbnQge1xuICBwcm9wcyA9IHtcbiAgICBjcm9wcGVyb3B0OiB7XG4gICAgICB0eXBlOiBPYmplY3QsXG4gICAgICBkZWZhdWx0OiB7fSxcbiAgICAgIHR3b1dheTogdHJ1ZVxuICAgIH0sXG4gICAgc2hvd3N0YXR1czoge1xuICAgICAgdHlwZTogQm9vbGVhbixcbiAgICAgIGRlZmF1bHQ6IGZhbHNlXG4gICAgfSxcbiAgICBmcm9tZGF0YToge1xuICAgICAgdHlwZTogT2JqZWN0LFxuICAgICAgZGVmYXVsdDoge30sXG4gICAgICB0d29XYXk6IHRydWVcbiAgICB9LFxuICAgIGltZ1VybDoge1xuICAgICAgdHlwZTogU3RyaW5nLFxuICAgICAgZGVmYXVsdDogJycsXG4gICAgICB0d29XYXk6IHRydWVcbiAgICB9XG4gIH07XG4gIG9uTG9hZCgpIHtcbiAgICBjb25zdCBjcm9wcGVyb3B0ID0gdGhpcy5jcm9wcGVyb3B0O1xuICAgIHdlY3JvcHBlciA9IG5ldyBXZUNyb3BwZXIoY3JvcHBlcm9wdClcbiAgICAgIC5vbigncmVhZHknLCBjdHggPT4ge1xuICAgICAgICBjb25zb2xlLmxvZyhgd2Vjcm9wcGVyIGlzIHJlYWR5IGZvciB3b3JrIWApO1xuICAgICAgfSlcbiAgICAgIC5vbignYmVmb3JlSW1hZ2VMb2FkJywgY3R4ID0+IHtcbiAgICAgICAgY29uc29sZS5sb2coYGJlZm9yZSBwaWN0dXJlIGxvYWRlZCwgaSBjYW4gZG8gc29tZXRoaW5nYCk7XG4gICAgICAgIGNvbnNvbGUubG9nKGBjdXJyZW50IGNhbnZhcyBjb250ZXh0OmAsIGN0eCk7XG4gICAgICAgIHd4LnNob3dUb2FzdCh7XG4gICAgICAgICAgdGl0bGU6ICfkuIrkvKDkuK0nLFxuICAgICAgICAgIGljb246ICdsb2FkaW5nJyxcbiAgICAgICAgICBkdXJhdGlvbjogMjAwMDBcbiAgICAgICAgfSk7XG4gICAgICB9KVxuICAgICAgLm9uKCdpbWFnZUxvYWQnLCBjdHggPT4ge1xuICAgICAgICBjb25zb2xlLmxvZyhgcGljdHVyZSBsb2FkZWRgKTtcbiAgICAgICAgY29uc29sZS5sb2coYGN1cnJlbnQgY2FudmFzIGNvbnRleHQ6YCwgY3R4KTtcbiAgICAgICAgd3guaGlkZVRvYXN0KCk7XG4gICAgICB9KVxuICAgICAgLm9uKCdiZWZvcmVEcmF3JywgKGN0eCwgaW5zdGFuY2UpID0+IHtcbiAgICAgICAgY29uc29sZS5sb2coYGJlZm9yZSBjYW52YXMgZHJhdyxpIGNhbiBkbyBzb21ldGhpbmdgKTtcbiAgICAgICAgY29uc29sZS5sb2coYGN1cnJlbnQgY2FudmFzIGNvbnRleHQ6YCwgY3R4KTtcbiAgICAgIH0pXG4gICAgICAudXBkYXRlQ2FudmFzKCk7XG4gIH1cbiAgbWV0aG9kcyA9IHtcbiAgICB0b3VjaFN0YXJ0OiBlID0+IHtcbiAgICAgIHdlY3JvcHBlci50b3VjaFN0YXJ0KGUpO1xuICAgIH0sXG4gICAgdG91Y2hNb3ZlOiBlID0+IHtcbiAgICAgIHdlY3JvcHBlci50b3VjaE1vdmUoZSk7XG4gICAgfSxcbiAgICB0b3VjaEVuZDogZSA9PiB7XG4gICAgICB3ZWNyb3BwZXIudG91Y2hFbmQoZSk7XG4gICAgfSxcbiAgICBnZXRDcm9wcGVySW1hZ2U6ICgpID0+IHtcbiAgICAgIGxldCBfdGhpcyA9IHRoaXM7XG4gICAgICB3ZWNyb3BwZXIuZ2V0Q3JvcHBlckltYWdlKHNyYyA9PiB7XG4gICAgICAgIGlmIChzcmMpIHtcbiAgICAgICAgICBjb25zb2xlLmxvZyhzcmMsICd0dXBpYW5saWFuamllJyk7XG4gICAgICAgICAgdXRpbHMuZG93bmxvYWRJbWcoc3JjLCByZXMgPT4ge1xuICAgICAgICAgICAgY29uc29sZS5sb2cocmVzKTtcbiAgICAgICAgICAgIF90aGlzLmltZ1VybCA9IHJlcy51cmw7XG4gICAgICAgICAgICBfdGhpcy5zaG93c3RhdHVzID0gZmFsc2U7XG4gICAgICAgICAgICBfdGhpcy5mcm9tZGF0YS5tZWRpYUl0ZW0ucGF0aCA9IHJlcy51cmw7XG4gICAgICAgICAgICBfdGhpcy5mcm9tZGF0YS5tZWRpYUl0ZW0ubWVkaWFJZCA9IHJlcy5pZDtcbiAgICAgICAgICAgIF90aGlzLiRhcHBseSgpO1xuICAgICAgICAgIH0pO1xuICAgICAgICAgIC8vIHd4LnByZXZpZXdJbWFnZSh7XG4gICAgICAgICAgLy8gICBjdXJyZW50OiAnJywgLy8g5b2T5YmN5pi+56S65Zu+54mH55qEaHR0cOmTvuaOpVxuICAgICAgICAgIC8vICAgdXJsczogW3NyY10gLy8g6ZyA6KaB6aKE6KeI55qE5Zu+54mHaHR0cOmTvuaOpeWIl+ihqFxuICAgICAgICAgIC8vIH0pO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIGNvbnNvbGUubG9nKCfojrflj5blm77niYflnLDlnYDlpLHotKXvvIzor7fnqI3lkI7ph43or5UnKTtcbiAgICAgICAgfVxuICAgICAgfSk7XG4gICAgfSxcbiAgICB1cGxvYWRUYXA6IGUgPT4ge1xuICAgICAgY29uc3Qgc2VsZiA9IHRoaXM7XG4gICAgICBjb25zb2xlLmxvZyhzZWxmKTtcbiAgICAgIHd4LmNob29zZUltYWdlKHtcbiAgICAgICAgY291bnQ6IDEsIC8vIOm7mOiupDlcbiAgICAgICAgc2l6ZVR5cGU6IFsnb3JpZ2luYWwnLCAnY29tcHJlc3NlZCddLCAvLyDlj6/ku6XmjIflrprmmK/ljp/lm77ov5jmmK/ljovnvKnlm77vvIzpu5jorqTkuozogIXpg73mnIlcbiAgICAgICAgc291cmNlVHlwZTogWydhbGJ1bScsICdjYW1lcmEnXSwgLy8g5Y+v5Lul5oyH5a6a5p2l5rqQ5piv55u45YaM6L+Y5piv55u45py677yM6buY6K6k5LqM6ICF6YO95pyJXG4gICAgICAgIHN1Y2Nlc3MocmVzKSB7XG4gICAgICAgICAgY29uc3Qgc3JjID0gcmVzLnRlbXBGaWxlUGF0aHNbMF07XG4gICAgICAgICAgLy8gIOiOt+WPluijgeWJquWbvueJh+i1hOa6kOWQju+8jOe7mWRhdGHmt7vliqBzcmPlsZ7mgKflj4rlhbblgLxcbiAgICAgICAgICBzZWxmLnNob3dzdGF0dXMgPSB0cnVlO1xuICAgICAgICAgIHNlbGYuJGFwcGx5KCk7XG4gICAgICAgICAgY29uc29sZS5sb2coc3JjKTtcbiAgICAgICAgICBjb25zb2xlLmxvZyh3ZWNyb3BwZXIpO1xuICAgICAgICAgIHdlY3JvcHBlci5wdXNoT3JpZ24oc3JjKTtcbiAgICAgICAgfVxuICAgICAgfSk7XG4gICAgfVxuICB9O1xufVxuIl19