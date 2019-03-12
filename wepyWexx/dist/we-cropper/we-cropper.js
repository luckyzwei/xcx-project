'use strict';

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

/**
 * we-cropper v1.0.1
 * (c) 2018 Xerath
 * fei.su@gemill.cc
 */
(function (global, factory) {
  (typeof exports === 'undefined' ? 'undefined' : _typeof(exports)) === 'object' && typeof module !== 'undefined' ? module.exports = factory() : typeof define === 'function' && define.amd ? define(factory) : global.WeCropper = factory();
})(undefined, function () {
  'use strict';

  var device = void 0;
  var TOUCH_STATE = ['touchstarted', 'touchmoved', 'touchended'];

  function isFunction(obj) {
    return typeof obj === 'function';
  }

  function firstLetterUpper(str) {
    return str.charAt(0).toUpperCase() + str.slice(1);
  }

  function setTouchState(instance) {
    var arg = [],
        len = arguments.length - 1;
    while (len-- > 0) {
      arg[len] = arguments[len + 1];
    }TOUCH_STATE.forEach(function (key, i) {
      if (arg[i] !== undefined) {
        instance[key] = arg[i];
      }
    });
  }

  function validator(instance, o) {
    Object.defineProperties(instance, o);
  }

  function getDevice() {
    if (!device) {
      device = wx.getSystemInfoSync();
    }
    return device;
  }

  var tmp = {};

  var DEFAULT = {
    id: {
      default: 'cropper',
      get: function get() {
        return tmp.id;
      },
      set: function set(value) {
        if (typeof value !== 'string') {
          console.error("id：" + value + " is invalid");
        }
        tmp.id = value;
      }
    },
    width: {
      default: 750,
      get: function get() {
        return tmp.width;
      },
      set: function set(value) {
        if (typeof value !== 'number') {
          console.error("width：" + value + " is invalid");
        }
        tmp.width = value;
      }
    },
    height: {
      default: 750,
      get: function get() {
        return tmp.height;
      },
      set: function set(value) {
        if (typeof value !== 'number') {
          console.error("height：" + value + " is invalid");
        }
        tmp.height = value;
      }
    },
    scale: {
      default: 2.5,
      get: function get() {
        return tmp.scale;
      },
      set: function set(value) {
        if (typeof value !== 'number') {
          console.error("scale：" + value + " is invalid");
        }
        tmp.scale = value;
      }
    },
    zoom: {
      default: 5,
      get: function get() {
        return tmp.zoom;
      },
      set: function set(value) {
        if (typeof value !== 'number') {
          console.error("zoom：" + value + " is invalid");
        } else if (value < 0 || value > 10) {
          console.error("zoom should be ranged in 0 ~ 10");
        }
        tmp.zoom = value;
      }
    },
    src: {
      default: 'cropper',
      get: function get() {
        return tmp.src;
      },
      set: function set(value) {
        if (typeof value !== 'string') {
          console.error("id：" + value + " is invalid");
        }
        tmp.src = value;
      }
    },
    cut: {
      default: {},
      get: function get() {
        return tmp.cut;
      },
      set: function set(value) {
        if ((typeof value === 'undefined' ? 'undefined' : _typeof(value)) !== 'object') {
          console.error("id：" + value + " is invalid");
        }
        tmp.cut = value;
      }
    },
    onReady: {
      default: null,
      get: function get() {
        return tmp.ready;
      },
      set: function set(value) {
        tmp.ready = value;
      }
    },
    onBeforeImageLoad: {
      default: null,
      get: function get() {
        return tmp.beforeImageLoad;
      },
      set: function set(value) {
        tmp.beforeImageLoad = value;
      }
    },
    onImageLoad: {
      default: null,
      get: function get() {
        return tmp.imageLoad;
      },
      set: function set(value) {
        tmp.imageLoad = value;
      }
    },
    onBeforeDraw: {
      default: null,
      get: function get() {
        return tmp.beforeDraw;
      },
      set: function set(value) {
        tmp.beforeDraw = value;
      }
    }
  };

  function prepare() {
    var self = this;
    var ref = getDevice();
    var windowWidth = ref.windowWidth;

    self.attachPage = function () {
      var pages = getCurrentPages();
      //  获取到当前page上下文
      var pageContext = pages[pages.length - 1];
      //  把this依附在Page上下文的wecropper属性上，便于在page钩子函数中访问
      pageContext.wecropper = self;
    };

    self.createCtx = function () {
      var id = self.id;
      if (id) {
        self.ctx = wx.createCanvasContext(id);
      } else {
        console.error("constructor: create canvas context failed, 'id' must be valuable");
      }
    };

    self.deviceRadio = windowWidth / 750;
  }

  function observer() {
    var self = this;

    var EVENT_TYPE = ['ready', 'beforeImageLoad', 'beforeDraw', 'imageLoad'];

    self.on = function (event, fn) {
      if (EVENT_TYPE.indexOf(event) > -1) {
        if (typeof fn === 'function') {
          event === 'ready' ? fn(self) : self["on" + firstLetterUpper(event)] = fn;
        }
      } else {
        console.error("event: " + event + " is invalid");
      }
      return self;
    };
  }

  var commonjsGlobal = typeof window !== 'undefined' ? window : typeof global !== 'undefined' ? global : typeof self !== 'undefined' ? self : {};

  function createCommonjsModule(fn, module) {
    return module = { exports: {} }, fn(module, module.exports), module.exports;
  }

  var base64 = createCommonjsModule(function (module, exports) {
    /*! http://mths.be/base64 v0.1.0 by @mathias | MIT license */
    (function (root) {

      // Detect free variables `exports`.
      var freeExports = 'object' == 'object' && exports;

      // Detect free variable `module`.
      var freeModule = 'object' == 'object' && module && module.exports == freeExports && module;

      // Detect free variable `global`, from Node.js or Browserified code, and use
      // it as `root`.
      var freeGlobal = (typeof commonjsGlobal === 'undefined' ? 'undefined' : _typeof(commonjsGlobal)) == 'object' && commonjsGlobal;
      if (freeGlobal.global === freeGlobal || freeGlobal.window === freeGlobal) {
        root = freeGlobal;
      }

      /*--------------------------------------------------------------------------*/

      var InvalidCharacterError = function InvalidCharacterError(message) {
        this.message = message;
      };
      InvalidCharacterError.prototype = new Error();
      InvalidCharacterError.prototype.name = 'InvalidCharacterError';

      var error = function error(message) {
        // Note: the error messages used throughout this file match those used by
        // the native `atob`/`btoa` implementation in Chromium.
        throw new InvalidCharacterError(message);
      };

      var TABLE = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/';
      // http://whatwg.org/html/common-microsyntaxes.html#space-character
      var REGEX_SPACE_CHARACTERS = /[\t\n\f\r ]/g;

      // `decode` is designed to be fully compatible with `atob` as described in the
      // HTML Standard. http://whatwg.org/html/webappapis.html#dom-windowbase64-atob
      // The optimized base64-decoding algorithm used is based on @atk’s excellent
      // implementation. https://gist.github.com/atk/1020396
      var decode = function decode(input) {
        input = String(input).replace(REGEX_SPACE_CHARACTERS, '');
        var length = input.length;
        if (length % 4 == 0) {
          input = input.replace(/==?$/, '');
          length = input.length;
        }
        if (length % 4 == 1 ||
        // http://whatwg.org/C#alphanumeric-ascii-characters
        /[^+a-zA-Z0-9/]/.test(input)) {
          error('Invalid character: the string to be decoded is not correctly encoded.');
        }
        var bitCounter = 0;
        var bitStorage;
        var buffer;
        var output = '';
        var position = -1;
        while (++position < length) {
          buffer = TABLE.indexOf(input.charAt(position));
          bitStorage = bitCounter % 4 ? bitStorage * 64 + buffer : buffer;
          // Unless this is the first of a group of 4 characters…
          if (bitCounter++ % 4) {
            // …convert the first 8 bits to a single ASCII character.
            output += String.fromCharCode(0xFF & bitStorage >> (-2 * bitCounter & 6));
          }
        }
        return output;
      };

      // `encode` is designed to be fully compatible with `btoa` as described in the
      // HTML Standard: http://whatwg.org/html/webappapis.html#dom-windowbase64-btoa
      var encode = function encode(input) {
        input = String(input);
        if (/[^\0-\xFF]/.test(input)) {
          // Note: no need to special-case astral symbols here, as surrogates are
          // matched, and the input is supposed to only contain ASCII anyway.
          error('The string to be encoded contains characters outside of the ' + 'Latin1 range.');
        }
        var padding = input.length % 3;
        var output = '';
        var position = -1;
        var a;
        var b;
        var c;
        var buffer;
        // Make sure any padding is handled outside of the loop.
        var length = input.length - padding;

        while (++position < length) {
          // Read three bytes, i.e. 24 bits.
          a = input.charCodeAt(position) << 16;
          b = input.charCodeAt(++position) << 8;
          c = input.charCodeAt(++position);
          buffer = a + b + c;
          // Turn the 24 bits into four chunks of 6 bits each, and append the
          // matching character for each of them to the output.
          output += TABLE.charAt(buffer >> 18 & 0x3F) + TABLE.charAt(buffer >> 12 & 0x3F) + TABLE.charAt(buffer >> 6 & 0x3F) + TABLE.charAt(buffer & 0x3F);
        }

        if (padding == 2) {
          a = input.charCodeAt(position) << 8;
          b = input.charCodeAt(++position);
          buffer = a + b;
          output += TABLE.charAt(buffer >> 10) + TABLE.charAt(buffer >> 4 & 0x3F) + TABLE.charAt(buffer << 2 & 0x3F) + '=';
        } else if (padding == 1) {
          buffer = input.charCodeAt(position);
          output += TABLE.charAt(buffer >> 2) + TABLE.charAt(buffer << 4 & 0x3F) + '==';
        }

        return output;
      };

      var base64 = {
        'encode': encode,
        'decode': decode,
        'version': '0.1.0'
      };

      // Some AMD build optimizers, like r.js, check for specific condition patterns
      // like the following:
      if (typeof undefined == 'function' && _typeof(undefined.amd) == 'object' && undefined.amd) {
        undefined(function () {
          return base64;
        });
      } else if (freeExports && !freeExports.nodeType) {
        if (freeModule) {
          // in Node.js or RingoJS v0.8.0+
          freeModule.exports = base64;
        } else {
          // in Narwhal or RingoJS v0.7.0-
          for (var key in base64) {
            base64.hasOwnProperty(key) && (freeExports[key] = base64[key]);
          }
        }
      } else {
        // in Rhino or a web browser
        root.base64 = base64;
      }
    })(commonjsGlobal);
  });

  function makeURI(strData, type) {
    return 'data:' + type + ';base64,' + strData;
  }

  function fixType(type) {
    type = type.toLowerCase().replace(/jpg/i, 'jpeg');
    var r = type.match(/png|jpeg|bmp|gif/)[0];
    return 'image/' + r;
  }

  function encodeData(data) {
    var str = '';
    if (typeof data === 'string') {
      str = data;
    } else {
      for (var i = 0; i < data.length; i++) {
        str += String.fromCharCode(data[i]);
      }
    }
    return base64.encode(str);
  }

  /**
   * 获取图像区域隐含的像素数据
   * @param canvasId canvas标识
   * @param x 将要被提取的图像数据矩形区域的左上角 x 坐标
   * @param y 将要被提取的图像数据矩形区域的左上角 y 坐标
   * @param width 将要被提取的图像数据矩形区域的宽度
   * @param height 将要被提取的图像数据矩形区域的高度
   * @param done 完成回调
   */
  function getImageData(canvasId, x, y, width, height, done) {
    wx.canvasGetImageData({
      canvasId: canvasId,
      x: x,
      y: y,
      width: width,
      height: height,
      success: function success(res) {
        done(res);
      },
      fail: function fail(res) {
        done(null);
        console.error('canvasGetImageData error: ' + res);
      }
    });
  }

  /**
   * 生成bmp格式图片
   * 按照规则生成图片响应头和响应体
   * @param oData 用来描述 canvas 区域隐含的像素数据 { data, width, height } = oData
   * @returns {*} base64字符串
   */
  function genBitmapImage(oData) {
    //
    // BITMAPFILEHEADER: http://msdn.microsoft.com/en-us/library/windows/desktop/dd183374(v=vs.85).aspx
    // BITMAPINFOHEADER: http://msdn.microsoft.com/en-us/library/dd183376.aspx
    //
    var biWidth = oData.width;
    var biHeight = oData.height;
    var biSizeImage = biWidth * biHeight * 3;
    var bfSize = biSizeImage + 54; // total header size = 54 bytes

    //
    //  typedef struct tagBITMAPFILEHEADER {
    //  	WORD bfType;
    //  	DWORD bfSize;
    //  	WORD bfReserved1;
    //  	WORD bfReserved2;
    //  	DWORD bfOffBits;
    //  } BITMAPFILEHEADER;
    //
    var BITMAPFILEHEADER = [
    // WORD bfType -- The file type signature; must be "BM"
    0x42, 0x4D,
    // DWORD bfSize -- The size, in bytes, of the bitmap file
    bfSize & 0xff, bfSize >> 8 & 0xff, bfSize >> 16 & 0xff, bfSize >> 24 & 0xff,
    // WORD bfReserved1 -- Reserved; must be zero
    0, 0,
    // WORD bfReserved2 -- Reserved; must be zero
    0, 0,
    // DWORD bfOffBits -- The offset, in bytes, from the beginning of the BITMAPFILEHEADER structure to the bitmap bits.
    54, 0, 0, 0];

    //
    //  typedef struct tagBITMAPINFOHEADER {
    //  	DWORD biSize;
    //  	LONG  biWidth;
    //  	LONG  biHeight;
    //  	WORD  biPlanes;
    //  	WORD  biBitCount;
    //  	DWORD biCompression;
    //  	DWORD biSizeImage;
    //  	LONG  biXPelsPerMeter;
    //  	LONG  biYPelsPerMeter;
    //  	DWORD biClrUsed;
    //  	DWORD biClrImportant;
    //  } BITMAPINFOHEADER, *PBITMAPINFOHEADER;
    //
    var BITMAPINFOHEADER = [
    // DWORD biSize -- The number of bytes required by the structure
    40, 0, 0, 0,
    // LONG biWidth -- The width of the bitmap, in pixels
    biWidth & 0xff, biWidth >> 8 & 0xff, biWidth >> 16 & 0xff, biWidth >> 24 & 0xff,
    // LONG biHeight -- The height of the bitmap, in pixels
    biHeight & 0xff, biHeight >> 8 & 0xff, biHeight >> 16 & 0xff, biHeight >> 24 & 0xff,
    // WORD biPlanes -- The number of planes for the target device. This value must be set to 1
    1, 0,
    // WORD biBitCount -- The number of bits-per-pixel, 24 bits-per-pixel -- the bitmap
    // has a maximum of 2^24 colors (16777216, Truecolor)
    24, 0,
    // DWORD biCompression -- The type of compression, BI_RGB (code 0) -- uncompressed
    0, 0, 0, 0,
    // DWORD biSizeImage -- The size, in bytes, of the image. This may be set to zero for BI_RGB bitmaps
    biSizeImage & 0xff, biSizeImage >> 8 & 0xff, biSizeImage >> 16 & 0xff, biSizeImage >> 24 & 0xff,
    // LONG biXPelsPerMeter, unused
    0, 0, 0, 0,
    // LONG biYPelsPerMeter, unused
    0, 0, 0, 0,
    // DWORD biClrUsed, the number of color indexes of palette, unused
    0, 0, 0, 0,
    // DWORD biClrImportant, unused
    0, 0, 0, 0];

    var iPadding = (4 - biWidth * 3 % 4) % 4;

    var aImgData = oData.data;

    var strPixelData = '';
    var biWidth4 = biWidth << 2;
    var y = biHeight;
    var fromCharCode = String.fromCharCode;

    do {
      var iOffsetY = biWidth4 * (y - 1);
      var strPixelRow = '';
      for (var x = 0; x < biWidth; x++) {
        var iOffsetX = x << 2;
        strPixelRow += fromCharCode(aImgData[iOffsetY + iOffsetX + 2]) + fromCharCode(aImgData[iOffsetY + iOffsetX + 1]) + fromCharCode(aImgData[iOffsetY + iOffsetX]);
      }

      for (var c = 0; c < iPadding; c++) {
        strPixelRow += String.fromCharCode(0);
      }

      strPixelData += strPixelRow;
    } while (--y);

    var strEncoded = encodeData(BITMAPFILEHEADER.concat(BITMAPINFOHEADER)) + encodeData(strPixelData);

    return strEncoded;
  }

  /**
   * 转换为图片base64
   * @param canvasId canvas标识
   * @param x 将要被提取的图像数据矩形区域的左上角 x 坐标
   * @param y 将要被提取的图像数据矩形区域的左上角 y 坐标
   * @param width 将要被提取的图像数据矩形区域的宽度
   * @param height 将要被提取的图像数据矩形区域的高度
   * @param type 转换图片类型
   * @param done 完成回调
   */
  function convertToImage(canvasId, x, y, width, height, type, done) {
    if (done === void 0) done = function done() {};

    if (type === undefined) {
      type = 'png';
    }
    type = fixType(type);
    if (/bmp/.test(type)) {
      getImageData(canvasId, x, y, width, height, function (data) {
        var strData = genBitmapImage(data);
        isFunction(done) && done(makeURI(strData, 'image/' + type));
      });
    } else {
      console.error('暂不支持生成\'' + type + '\'类型的base64图片');
    }
  }

  var CanvasToBase64 = {
    convertToImage: convertToImage,
    // convertToPNG: function (width, height, done) {
    //   return convertToImage(width, height, 'png', done)
    // },
    // convertToJPEG: function (width, height, done) {
    //   return convertToImage(width, height, 'jpeg', done)
    // },
    // convertToGIF: function (width, height, done) {
    //   return convertToImage(width, height, 'gif', done)
    // },
    convertToBMP: function convertToBMP(ref, done) {
      if (ref === void 0) ref = {};
      var canvasId = ref.canvasId;
      var x = ref.x;
      var y = ref.y;
      var width = ref.width;
      var height = ref.height;
      if (done === void 0) done = function done() {};

      return convertToImage(canvasId, x, y, width, height, 'bmp', done);
    }
  };

  function methods() {
    var self = this;

    var id = self.id;
    var deviceRadio = self.deviceRadio;
    var boundWidth = self.width; // 裁剪框默认宽度，即整个画布宽度
    var boundHeight = self.height; // 裁剪框默认高度，即整个画布高度
    var ref = self.cut;
    var x = ref.x;if (x === void 0) x = 0;
    var y = ref.y;if (y === void 0) y = 0;
    var width = ref.width;if (width === void 0) width = boundWidth;
    var height = ref.height;if (height === void 0) height = boundHeight;

    self.updateCanvas = function () {
      if (self.croperTarget) {
        //  画布绘制图片
        self.ctx.drawImage(self.croperTarget, self.imgLeft, self.imgTop, self.scaleWidth, self.scaleHeight);
      }
      isFunction(self.onBeforeDraw) && self.onBeforeDraw(self.ctx, self);

      self.setBoundStyle(); //	设置边界样式
      self.ctx.draw();
      return self;
    };

    self.pushOrign = function (src) {
      self.src = src;

      isFunction(self.onBeforeImageLoad) && self.onBeforeImageLoad(self.ctx, self);

      wx.getImageInfo({
        src: src,
        success: function success(res) {
          var innerAspectRadio = res.width / res.height;

          self.croperTarget = res.path;

          if (innerAspectRadio < width / height) {
            self.rectX = x;
            self.baseWidth = width;
            self.baseHeight = width / innerAspectRadio;
            self.rectY = y - Math.abs((height - self.baseHeight) / 2);
          } else {
            self.rectY = y;
            self.baseWidth = height * innerAspectRadio;
            self.baseHeight = height;
            self.rectX = x - Math.abs((width - self.baseWidth) / 2);
          }

          self.imgLeft = self.rectX;
          self.imgTop = self.rectY;
          self.scaleWidth = self.baseWidth;
          self.scaleHeight = self.baseHeight;

          self.updateCanvas();

          isFunction(self.onImageLoad) && self.onImageLoad(self.ctx, self);
        }
      });

      self.update();
      return self;
    };

    self.getCropperBase64 = function (done) {
      if (done === void 0) done = function done() {};

      CanvasToBase64.convertToBMP({
        canvasId: id,
        x: x,
        y: y,
        width: width,
        height: height
      }, done);
    };

    self.getCropperImage = function () {
      var args = [],
          len = arguments.length;
      while (len--) {
        args[len] = arguments[len];
      }var ARG_TYPE = toString.call(args[0]);
      var fn = args[args.length - 1];

      switch (ARG_TYPE) {
        case '[object Object]':
          var ref = args[0];
          var quality = ref.quality;if (quality === void 0) quality = 10;

          if (typeof quality !== 'number') {
            console.error("quality：" + quality + " is invalid");
          } else if (quality < 0 || quality > 10) {
            console.error("quality should be ranged in 0 ~ 10");
          }
          wx.canvasToTempFilePath({
            canvasId: id,
            x: x,
            y: y,
            width: width,
            height: height,
            destWidth: width * quality / (deviceRadio * 10),
            destHeight: height * quality / (deviceRadio * 10),
            success: function success(res) {
              isFunction(fn) && fn.call(self, res.tempFilePath);
            },
            fail: function fail(res) {
              isFunction(fn) && fn.call(self, null);
            }
          });break;
        case '[object Function]':
          wx.canvasToTempFilePath({
            canvasId: id,
            x: x,
            y: y,
            width: width,
            height: height,
            destWidth: width / deviceRadio,
            destHeight: height / deviceRadio,
            success: function success(res) {
              isFunction(fn) && fn.call(self, res.tempFilePath);
            },
            fail: function fail(res) {
              isFunction(fn) && fn.call(self, null);
            }
          });break;
      }

      return self;
    };
  }

  /**
   * 获取最新缩放值
   * @param oldScale 上一次触摸结束后的缩放值
   * @param oldDistance 上一次触摸结束后的双指距离
   * @param zoom 缩放系数
   * @param touch0 第一指touch对象
   * @param touch1 第二指touch对象
   * @returns {*}
   */
  var getNewScale = function getNewScale(oldScale, oldDistance, zoom, touch0, touch1) {
    var xMove, yMove, newDistance;
    // 计算二指最新距离
    xMove = Math.round(touch1.x - touch0.x);
    yMove = Math.round(touch1.y - touch0.y);
    newDistance = Math.round(Math.sqrt(xMove * xMove + yMove * yMove));

    return oldScale + 0.001 * zoom * (newDistance - oldDistance);
  };

  function update() {
    var self = this;

    if (!self.src) {
      return;
    }

    self.__oneTouchStart = function (touch) {
      self.touchX0 = Math.round(touch.x);
      self.touchY0 = Math.round(touch.y);
    };

    self.__oneTouchMove = function (touch) {
      var xMove, yMove;
      // 计算单指移动的距离
      if (self.touchended) {
        return self.updateCanvas();
      }
      xMove = Math.round(touch.x - self.touchX0);
      yMove = Math.round(touch.y - self.touchY0);

      var imgLeft = Math.round(self.rectX + xMove);
      var imgTop = Math.round(self.rectY + yMove);

      self.outsideBound(imgLeft, imgTop);

      self.updateCanvas();
    };

    self.__twoTouchStart = function (touch0, touch1) {
      var xMove, yMove, oldDistance;

      self.touchX1 = Math.round(self.rectX + self.scaleWidth / 2);
      self.touchY1 = Math.round(self.rectY + self.scaleHeight / 2);

      // 计算两指距离
      xMove = Math.round(touch1.x - touch0.x);
      yMove = Math.round(touch1.y - touch0.y);
      oldDistance = Math.round(Math.sqrt(xMove * xMove + yMove * yMove));

      self.oldDistance = oldDistance;
    };

    self.__twoTouchMove = function (touch0, touch1) {
      var oldScale = self.oldScale;
      var oldDistance = self.oldDistance;
      var scale = self.scale;
      var zoom = self.zoom;

      self.newScale = getNewScale(oldScale, oldDistance, zoom, touch0, touch1);

      //  设定缩放范围
      self.newScale <= 1 && (self.newScale = 1);
      self.newScale >= scale && (self.newScale = scale);

      self.scaleWidth = Math.round(self.newScale * self.baseWidth);
      self.scaleHeight = Math.round(self.newScale * self.baseHeight);
      var imgLeft = Math.round(self.touchX1 - self.scaleWidth / 2);
      var imgTop = Math.round(self.touchY1 - self.scaleHeight / 2);

      self.outsideBound(imgLeft, imgTop);

      self.updateCanvas();
    };

    self.__xtouchEnd = function () {
      self.oldScale = self.newScale;
      self.rectX = self.imgLeft;
      self.rectY = self.imgTop;
    };
  }

  var handle = {
    //  图片手势初始监测
    touchStart: function touchStart(e) {
      var self = this;
      var ref = e.touches;
      var touch0 = ref[0];
      var touch1 = ref[1];

      setTouchState(self, true, null, null);

      // 计算第一个触摸点的位置，并参照改点进行缩放
      self.__oneTouchStart(touch0);

      // 两指手势触发
      if (e.touches.length >= 2) {
        self.__twoTouchStart(touch0, touch1);
      }
    },

    //  图片手势动态缩放
    touchMove: function touchMove(e) {
      var self = this;
      var ref = e.touches;
      var touch0 = ref[0];
      var touch1 = ref[1];

      setTouchState(self, null, true);

      // 单指手势时触发
      if (e.touches.length === 1) {
        self.__oneTouchMove(touch0);
      }
      // 两指手势触发
      if (e.touches.length >= 2) {
        self.__twoTouchMove(touch0, touch1);
      }
    },

    touchEnd: function touchEnd(e) {
      var self = this;

      setTouchState(self, false, false, true);
      self.__xtouchEnd();
    }
  };

  function cut() {
    var self = this;
    var boundWidth = self.width; // 裁剪框默认宽度，即整个画布宽度
    var boundHeight = self.height;
    // 裁剪框默认高度，即整个画布高度
    var ref = self.cut;
    var x = ref.x;if (x === void 0) x = 0;
    var y = ref.y;if (y === void 0) y = 0;
    var width = ref.width;if (width === void 0) width = boundWidth;
    var height = ref.height;if (height === void 0) height = boundHeight;

    /**
    * 设置边界
    * @param imgLeft 图片左上角横坐标值
    * @param imgTop 图片左上角纵坐标值
    */
    self.outsideBound = function (imgLeft, imgTop) {
      self.imgLeft = imgLeft >= x ? x : self.scaleWidth + imgLeft - x <= width ? x + width - self.scaleWidth : imgLeft;

      self.imgTop = imgTop >= y ? y : self.scaleHeight + imgTop - y <= height ? y + height - self.scaleHeight : imgTop;
    };

    /**
    * 设置边界样式
    * @param color	边界颜色
    */
    self.setBoundStyle = function (ref) {
      if (ref === void 0) ref = {};
      var color = ref.color;if (color === void 0) color = '#04b00f';
      var mask = ref.mask;if (mask === void 0) mask = 'rgba(0, 0, 0, 0.3)';
      var lineWidth = ref.lineWidth;if (lineWidth === void 0) lineWidth = 1;

      var boundOption = [{
        start: { x: x - lineWidth, y: y + 10 - lineWidth },
        step1: { x: x - lineWidth, y: y - lineWidth },
        step2: { x: x + 10 - lineWidth, y: y - lineWidth }
      }, {
        start: { x: x - lineWidth, y: y + height - 10 + lineWidth },
        step1: { x: x - lineWidth, y: y + height + lineWidth },
        step2: { x: x + 10 - lineWidth, y: y + height + lineWidth }
      }, {
        start: { x: x + width - 10 + lineWidth, y: y - lineWidth },
        step1: { x: x + width + lineWidth, y: y - lineWidth },
        step2: { x: x + width + lineWidth, y: y + 10 - lineWidth }
      }, {
        start: { x: x + width + lineWidth, y: y + height - 10 + lineWidth },
        step1: { x: x + width + lineWidth, y: y + height + lineWidth },
        step2: { x: x + width - 10 + lineWidth, y: y + height + lineWidth }
      }];

      // 绘制半透明层
      self.ctx.beginPath();
      self.ctx.setFillStyle(mask);
      self.ctx.fillRect(0, 0, x, boundHeight);
      self.ctx.fillRect(x, 0, width, y);
      self.ctx.fillRect(x, y + height, width, boundHeight - y - height);
      self.ctx.fillRect(x + width, 0, boundWidth - x - width, boundHeight);
      self.ctx.fill();

      boundOption.forEach(function (op) {
        self.ctx.beginPath();
        self.ctx.setStrokeStyle(color);
        self.ctx.setLineWidth(lineWidth);
        self.ctx.moveTo(op.start.x, op.start.y);
        self.ctx.lineTo(op.step1.x, op.step1.y);
        self.ctx.lineTo(op.step2.x, op.step2.y);
        self.ctx.stroke();
      });
    };
  }

  var version = "1.2.0";

  var weCropper = function weCropper(params) {
    var self = this;
    var _default = {};

    validator(self, DEFAULT);

    Object.keys(DEFAULT).forEach(function (key) {
      _default[key] = DEFAULT[key].default;
    });
    Object.assign(self, _default, params);

    self.prepare();
    self.attachPage();
    self.createCtx();
    self.observer();
    self.cutt();
    self.methods();
    self.init();
    self.update();

    return self;
  };

  weCropper.prototype.init = function init() {
    var self = this;
    var src = self.src;

    self.version = version;

    typeof self.onReady === 'function' && self.onReady(self.ctx, self);

    if (src) {
      self.pushOrign(src);
    }
    setTouchState(self, false, false, false);

    self.oldScale = 1;
    self.newScale = 1;

    return self;
  };

  Object.assign(weCropper.prototype, handle);

  weCropper.prototype.prepare = prepare;
  weCropper.prototype.observer = observer;
  weCropper.prototype.methods = methods;
  weCropper.prototype.cutt = cut;
  weCropper.prototype.update = update;

  return weCropper;
});
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlLWNyb3BwZXIuanMiXSwibmFtZXMiOlsiZ2xvYmFsIiwiZmFjdG9yeSIsImV4cG9ydHMiLCJtb2R1bGUiLCJkZWZpbmUiLCJhbWQiLCJXZUNyb3BwZXIiLCJkZXZpY2UiLCJUT1VDSF9TVEFURSIsImlzRnVuY3Rpb24iLCJvYmoiLCJmaXJzdExldHRlclVwcGVyIiwic3RyIiwiY2hhckF0IiwidG9VcHBlckNhc2UiLCJzbGljZSIsInNldFRvdWNoU3RhdGUiLCJpbnN0YW5jZSIsImFyZyIsImxlbiIsImFyZ3VtZW50cyIsImxlbmd0aCIsImZvckVhY2giLCJrZXkiLCJpIiwidW5kZWZpbmVkIiwidmFsaWRhdG9yIiwibyIsIk9iamVjdCIsImRlZmluZVByb3BlcnRpZXMiLCJnZXREZXZpY2UiLCJ3eCIsImdldFN5c3RlbUluZm9TeW5jIiwidG1wIiwiREVGQVVMVCIsImlkIiwiZGVmYXVsdCIsImdldCIsInNldCIsInZhbHVlIiwiY29uc29sZSIsImVycm9yIiwid2lkdGgiLCJoZWlnaHQiLCJzY2FsZSIsInpvb20iLCJzcmMiLCJjdXQiLCJvblJlYWR5IiwicmVhZHkiLCJvbkJlZm9yZUltYWdlTG9hZCIsImJlZm9yZUltYWdlTG9hZCIsIm9uSW1hZ2VMb2FkIiwiaW1hZ2VMb2FkIiwib25CZWZvcmVEcmF3IiwiYmVmb3JlRHJhdyIsInByZXBhcmUiLCJzZWxmIiwicmVmIiwid2luZG93V2lkdGgiLCJhdHRhY2hQYWdlIiwicGFnZXMiLCJnZXRDdXJyZW50UGFnZXMiLCJwYWdlQ29udGV4dCIsIndlY3JvcHBlciIsImNyZWF0ZUN0eCIsImN0eCIsImNyZWF0ZUNhbnZhc0NvbnRleHQiLCJkZXZpY2VSYWRpbyIsIm9ic2VydmVyIiwiRVZFTlRfVFlQRSIsIm9uIiwiZXZlbnQiLCJmbiIsImluZGV4T2YiLCJjb21tb25qc0dsb2JhbCIsIndpbmRvdyIsImNyZWF0ZUNvbW1vbmpzTW9kdWxlIiwiYmFzZTY0Iiwicm9vdCIsImZyZWVFeHBvcnRzIiwiZnJlZU1vZHVsZSIsImZyZWVHbG9iYWwiLCJJbnZhbGlkQ2hhcmFjdGVyRXJyb3IiLCJtZXNzYWdlIiwicHJvdG90eXBlIiwiRXJyb3IiLCJuYW1lIiwiVEFCTEUiLCJSRUdFWF9TUEFDRV9DSEFSQUNURVJTIiwiZGVjb2RlIiwiaW5wdXQiLCJTdHJpbmciLCJyZXBsYWNlIiwidGVzdCIsImJpdENvdW50ZXIiLCJiaXRTdG9yYWdlIiwiYnVmZmVyIiwib3V0cHV0IiwicG9zaXRpb24iLCJmcm9tQ2hhckNvZGUiLCJlbmNvZGUiLCJwYWRkaW5nIiwiYSIsImIiLCJjIiwiY2hhckNvZGVBdCIsIm5vZGVUeXBlIiwiaGFzT3duUHJvcGVydHkiLCJtYWtlVVJJIiwic3RyRGF0YSIsInR5cGUiLCJmaXhUeXBlIiwidG9Mb3dlckNhc2UiLCJyIiwibWF0Y2giLCJlbmNvZGVEYXRhIiwiZGF0YSIsImdldEltYWdlRGF0YSIsImNhbnZhc0lkIiwieCIsInkiLCJkb25lIiwiY2FudmFzR2V0SW1hZ2VEYXRhIiwic3VjY2VzcyIsInJlcyIsImZhaWwiLCJnZW5CaXRtYXBJbWFnZSIsIm9EYXRhIiwiYmlXaWR0aCIsImJpSGVpZ2h0IiwiYmlTaXplSW1hZ2UiLCJiZlNpemUiLCJCSVRNQVBGSUxFSEVBREVSIiwiQklUTUFQSU5GT0hFQURFUiIsImlQYWRkaW5nIiwiYUltZ0RhdGEiLCJzdHJQaXhlbERhdGEiLCJiaVdpZHRoNCIsImlPZmZzZXRZIiwic3RyUGl4ZWxSb3ciLCJpT2Zmc2V0WCIsInN0ckVuY29kZWQiLCJjb25jYXQiLCJjb252ZXJ0VG9JbWFnZSIsIkNhbnZhc1RvQmFzZTY0IiwiY29udmVydFRvQk1QIiwibWV0aG9kcyIsImJvdW5kV2lkdGgiLCJib3VuZEhlaWdodCIsInVwZGF0ZUNhbnZhcyIsImNyb3BlclRhcmdldCIsImRyYXdJbWFnZSIsImltZ0xlZnQiLCJpbWdUb3AiLCJzY2FsZVdpZHRoIiwic2NhbGVIZWlnaHQiLCJzZXRCb3VuZFN0eWxlIiwiZHJhdyIsInB1c2hPcmlnbiIsImdldEltYWdlSW5mbyIsImlubmVyQXNwZWN0UmFkaW8iLCJwYXRoIiwicmVjdFgiLCJiYXNlV2lkdGgiLCJiYXNlSGVpZ2h0IiwicmVjdFkiLCJNYXRoIiwiYWJzIiwidXBkYXRlIiwiZ2V0Q3JvcHBlckJhc2U2NCIsImdldENyb3BwZXJJbWFnZSIsImFyZ3MiLCJBUkdfVFlQRSIsInRvU3RyaW5nIiwiY2FsbCIsInF1YWxpdHkiLCJjYW52YXNUb1RlbXBGaWxlUGF0aCIsImRlc3RXaWR0aCIsImRlc3RIZWlnaHQiLCJ0ZW1wRmlsZVBhdGgiLCJnZXROZXdTY2FsZSIsIm9sZFNjYWxlIiwib2xkRGlzdGFuY2UiLCJ0b3VjaDAiLCJ0b3VjaDEiLCJ4TW92ZSIsInlNb3ZlIiwibmV3RGlzdGFuY2UiLCJyb3VuZCIsInNxcnQiLCJfX29uZVRvdWNoU3RhcnQiLCJ0b3VjaCIsInRvdWNoWDAiLCJ0b3VjaFkwIiwiX19vbmVUb3VjaE1vdmUiLCJ0b3VjaGVuZGVkIiwib3V0c2lkZUJvdW5kIiwiX190d29Ub3VjaFN0YXJ0IiwidG91Y2hYMSIsInRvdWNoWTEiLCJfX3R3b1RvdWNoTW92ZSIsIm5ld1NjYWxlIiwiX194dG91Y2hFbmQiLCJoYW5kbGUiLCJ0b3VjaFN0YXJ0IiwiZSIsInRvdWNoZXMiLCJ0b3VjaE1vdmUiLCJ0b3VjaEVuZCIsImNvbG9yIiwibWFzayIsImxpbmVXaWR0aCIsImJvdW5kT3B0aW9uIiwic3RhcnQiLCJzdGVwMSIsInN0ZXAyIiwiYmVnaW5QYXRoIiwic2V0RmlsbFN0eWxlIiwiZmlsbFJlY3QiLCJmaWxsIiwib3AiLCJzZXRTdHJva2VTdHlsZSIsInNldExpbmVXaWR0aCIsIm1vdmVUbyIsImxpbmVUbyIsInN0cm9rZSIsInZlcnNpb24iLCJ3ZUNyb3BwZXIiLCJwYXJhbXMiLCJfZGVmYXVsdCIsImtleXMiLCJhc3NpZ24iLCJjdXR0IiwiaW5pdCJdLCJtYXBwaW5ncyI6Ijs7OztBQUFBOzs7OztBQUtDLFdBQVVBLE1BQVYsRUFBa0JDLE9BQWxCLEVBQTJCO0FBQzNCLFVBQU9DLE9BQVAseUNB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Zjs7QUFFQVcsU0FBSzBLLE9BQUwsR0FBZUEsT0FBZjs7QUFFQSxXQUFPMUssS0FBS1QsT0FBWixLQUF3QixVQUF4QixJQUFzQ1MsS0FBS1QsT0FBTCxDQUFhUyxLQUFLUyxHQUFsQixFQUF1QlQsSUFBdkIsQ0FBdEM7O0FBRUEsUUFBSVgsR0FBSixFQUFTO0FBQ1BXLFdBQUtzRyxTQUFMLENBQWVqSCxHQUFmO0FBQ0Q7QUFDRDlCLGtCQUFjeUMsSUFBZCxFQUFvQixLQUFwQixFQUEyQixLQUEzQixFQUFrQyxLQUFsQzs7QUFFQUEsU0FBSzZILFFBQUwsR0FBZ0IsQ0FBaEI7QUFDQTdILFNBQUtpSixRQUFMLEdBQWdCLENBQWhCOztBQUVBLFdBQU9qSixJQUFQO0FBQ0QsR0FqQkQ7O0FBbUJBN0IsU0FBTzRNLE1BQVAsQ0FBY0osVUFBVS9JLFNBQXhCLEVBQW1DdUgsTUFBbkM7O0FBRUF3QixZQUFVL0ksU0FBVixDQUFvQjdCLE9BQXBCLEdBQThCQSxPQUE5QjtBQUNBNEssWUFBVS9JLFNBQVYsQ0FBb0JoQixRQUFwQixHQUErQkEsUUFBL0I7QUFDQStKLFlBQVUvSSxTQUFWLENBQW9COEQsT0FBcEIsR0FBOEJBLE9BQTlCO0FBQ0FpRixZQUFVL0ksU0FBVixDQUFvQm9KLElBQXBCLEdBQTJCMUwsR0FBM0I7QUFDQXFMLFlBQVUvSSxTQUFWLENBQW9Cb0YsTUFBcEIsR0FBNkJBLE1BQTdCOztBQUVBLFNBQU8yRCxTQUFQO0FBRUMsQ0FyK0JBLENBQUQiLCJmaWxlIjoid2UtY3JvcHBlci5qcyIsInNvdXJjZXNDb250ZW50IjpbIi8qKlxuICogd2UtY3JvcHBlciB2MS4wLjFcbiAqIChjKSAyMDE4IFhlcmF0aFxuICogZmVpLnN1QGdlbWlsbC5jY1xuICovXG4oZnVuY3Rpb24gKGdsb2JhbCwgZmFjdG9yeSkge1xuXHR0eXBlb2YgZXhwb3J0cyA9PT0gJ29iamVjdCcgJiYgdHlwZW9mIG1vZHVsZSAhPT0gJ3VuZGVmaW5lZCcgPyBtb2R1bGUuZXhwb3J0cyA9IGZhY3RvcnkoKSA6XG5cdHR5cGVvZiBkZWZpbmUgPT09ICdmdW5jdGlvbicgJiYgZGVmaW5lLmFtZCA/IGRlZmluZShmYWN0b3J5KSA6XG5cdChnbG9iYWwuV2VDcm9wcGVyID0gZmFjdG9yeSgpKTtcbn0odGhpcywgKGZ1bmN0aW9uICgpIHsgJ3VzZSBzdHJpY3QnO1xuXG52YXIgZGV2aWNlID0gdm9pZCAwO1xudmFyIFRPVUNIX1NUQVRFID0gWyd0b3VjaHN0YXJ0ZWQnLCAndG91Y2htb3ZlZCcsICd0b3VjaGVuZGVkJ107XG5cbmZ1bmN0aW9uIGlzRnVuY3Rpb24gKG9iaikge1xuICByZXR1cm4gdHlwZW9mIG9iaiA9PT0gJ2Z1bmN0aW9uJ1xufVxuXG5mdW5jdGlvbiBmaXJzdExldHRlclVwcGVyIChzdHIpIHtcbiAgcmV0dXJuIHN0ci5jaGFyQXQoMCkudG9VcHBlckNhc2UoKSArIHN0ci5zbGljZSgxKVxufVxuXG5mdW5jdGlvbiBzZXRUb3VjaFN0YXRlIChpbnN0YW5jZSkge1xuICB2YXIgYXJnID0gW10sIGxlbiA9IGFyZ3VtZW50cy5sZW5ndGggLSAxO1xuICB3aGlsZSAoIGxlbi0tID4gMCApIGFyZ1sgbGVuIF0gPSBhcmd1bWVudHNbIGxlbiArIDEgXTtcblxuICBUT1VDSF9TVEFURS5mb3JFYWNoKGZ1bmN0aW9uIChrZXksIGkpIHtcbiAgICBpZiAoYXJnW2ldICE9PSB1bmRlZmluZWQpIHtcbiAgICAgIGluc3RhbmNlW2tleV0gPSBhcmdbaV07XG4gICAgfVxuICB9KTtcbn1cblxuZnVuY3Rpb24gdmFsaWRhdG9yIChpbnN0YW5jZSwgbykge1xuICBPYmplY3QuZGVmaW5lUHJvcGVydGllcyhpbnN0YW5jZSwgbyk7XG59XG5cbmZ1bmN0aW9uXHRnZXREZXZpY2UgKCkge1xuICBpZiAoIWRldmljZSkge1xuICAgIGRldmljZSA9IHd4LmdldFN5c3RlbUluZm9TeW5jKCk7XG4gIH1cbiAgcmV0dXJuIGRldmljZVxufVxuXG52YXIgdG1wID0ge307XG5cbnZhciBERUZBVUxUID0ge1xuICBpZDoge1xuICAgIGRlZmF1bHQ6ICdjcm9wcGVyJyxcbiAgICBnZXQ6IGZ1bmN0aW9uIGdldCAoKSB7XG4gICAgICByZXR1cm4gdG1wLmlkXG4gICAgfSxcbiAgICBzZXQ6IGZ1bmN0aW9uIHNldCAodmFsdWUpIHtcbiAgICAgIGlmICh0eXBlb2YgKHZhbHVlKSAhPT0gJ3N0cmluZycpIHtcbiAgICAgICAgY29uc29sZS5lcnJvcigoXCJpZO+8mlwiICsgdmFsdWUgKyBcIiBpcyBpbnZhbGlkXCIpKTtcbiAgICAgIH1cbiAgICAgIHRtcC5pZCA9IHZhbHVlO1xuICAgIH1cbiAgfSxcbiAgd2lkdGg6IHtcbiAgICBkZWZhdWx0OiA3NTAsXG4gICAgZ2V0OiBmdW5jdGlvbiBnZXQgKCkge1xuICAgICAgcmV0dXJuIHRtcC53aWR0aFxuICAgIH0sXG4gICAgc2V0OiBmdW5jdGlvbiBzZXQgKHZhbHVlKSB7XG4gICAgICBpZiAodHlwZW9mICh2YWx1ZSkgIT09ICdudW1iZXInKSB7XG4gICAgICAgIGNvbnNvbGUuZXJyb3IoKFwid2lkdGjvvJpcIiArIHZhbHVlICsgXCIgaXMgaW52YWxpZFwiKSk7XG4gICAgICB9XG4gICAgICB0bXAud2lkdGggPSB2YWx1ZTtcbiAgICB9XG4gIH0sXG4gIGhlaWdodDoge1xuICAgIGRlZmF1bHQ6IDc1MCxcbiAgICBnZXQ6IGZ1bmN0aW9uIGdldCAoKSB7XG4gICAgICByZXR1cm4gdG1wLmhlaWdodFxuICAgIH0sXG4gICAgc2V0OiBmdW5jdGlvbiBzZXQgKHZhbHVlKSB7XG4gICAgICBpZiAodHlwZW9mICh2YWx1ZSkgIT09ICdudW1iZXInKSB7XG4gICAgICAgIGNvbnNvbGUuZXJyb3IoKFwiaGVpZ2h077yaXCIgKyB2YWx1ZSArIFwiIGlzIGludmFsaWRcIikpO1xuICAgICAgfVxuICAgICAgdG1wLmhlaWdodCA9IHZhbHVlO1xuICAgIH1cbiAgfSxcbiAgc2NhbGU6IHtcbiAgICBkZWZhdWx0OiAyLjUsXG4gICAgZ2V0OiBmdW5jdGlvbiBnZXQgKCkge1xuICAgICAgcmV0dXJuIHRtcC5zY2FsZVxuICAgIH0sXG4gICAgc2V0OiBmdW5jdGlvbiBzZXQgKHZhbHVlKSB7XG4gICAgICBpZiAodHlwZW9mICh2YWx1ZSkgIT09ICdudW1iZXInKSB7XG4gICAgICAgIGNvbnNvbGUuZXJyb3IoKFwic2NhbGXvvJpcIiArIHZhbHVlICsgXCIgaXMgaW52YWxpZFwiKSk7XG4gICAgICB9XG4gICAgICB0bXAuc2NhbGUgPSB2YWx1ZTtcbiAgICB9XG4gIH0sXG4gIHpvb206IHtcbiAgICBkZWZhdWx0OiA1LFxuICAgIGdldDogZnVuY3Rpb24gZ2V0ICgpIHtcbiAgICAgIHJldHVybiB0bXAuem9vbVxuICAgIH0sXG4gICAgc2V0OiBmdW5jdGlvbiBzZXQgKHZhbHVlKSB7XG4gICAgICBpZiAodHlwZW9mICh2YWx1ZSkgIT09ICdudW1iZXInKSB7XG4gICAgICAgIGNvbnNvbGUuZXJyb3IoKFwiem9vbe+8mlwiICsgdmFsdWUgKyBcIiBpcyBpbnZhbGlkXCIpKTtcbiAgICAgIH0gZWxzZSBpZiAodmFsdWUgPCAwIHx8IHZhbHVlID4gMTApIHtcbiAgICAgICAgY29uc29sZS5lcnJvcihcInpvb20gc2hvdWxkIGJlIHJhbmdlZCBpbiAwIH4gMTBcIik7XG4gICAgICB9XG4gICAgICB0bXAuem9vbSA9IHZhbHVlO1xuICAgIH1cbiAgfSxcbiAgc3JjOiB7XG4gICAgZGVmYXVsdDogJ2Nyb3BwZXInLFxuICAgIGdldDogZnVuY3Rpb24gZ2V0ICgpIHtcbiAgICAgIHJldHVybiB0bXAuc3JjXG4gICAgfSxcbiAgICBzZXQ6IGZ1bmN0aW9uIHNldCAodmFsdWUpIHtcbiAgICAgIGlmICh0eXBlb2YgKHZhbHVlKSAhPT0gJ3N0cmluZycpIHtcbiAgICAgICAgY29uc29sZS5lcnJvcigoXCJpZO+8mlwiICsgdmFsdWUgKyBcIiBpcyBpbnZhbGlkXCIpKTtcbiAgICAgIH1cbiAgICAgIHRtcC5zcmMgPSB2YWx1ZTtcbiAgICB9XG4gIH0sXG4gIGN1dDoge1xuICAgIGRlZmF1bHQ6IHt9LFxuICAgIGdldDogZnVuY3Rpb24gZ2V0ICgpIHtcbiAgICAgIHJldHVybiB0bXAuY3V0XG4gICAgfSxcbiAgICBzZXQ6IGZ1bmN0aW9uIHNldCAodmFsdWUpIHtcbiAgICAgIGlmICh0eXBlb2YgKHZhbHVlKSAhPT0gJ29iamVjdCcpIHtcbiAgICAgICAgY29uc29sZS5lcnJvcigoXCJpZO+8mlwiICsgdmFsdWUgKyBcIiBpcyBpbnZhbGlkXCIpKTtcbiAgICAgIH1cbiAgICAgIHRtcC5jdXQgPSB2YWx1ZTtcbiAgICB9XG4gIH0sXG4gIG9uUmVhZHk6IHtcbiAgICBkZWZhdWx0OiBudWxsLFxuICAgIGdldDogZnVuY3Rpb24gZ2V0ICgpIHtcbiAgICAgIHJldHVybiB0bXAucmVhZHlcbiAgICB9LFxuICAgIHNldDogZnVuY3Rpb24gc2V0ICh2YWx1ZSkge1xuICAgICAgdG1wLnJlYWR5ID0gdmFsdWU7XG4gICAgfVxuICB9LFxuICBvbkJlZm9yZUltYWdlTG9hZDoge1xuICAgIGRlZmF1bHQ6IG51bGwsXG4gICAgZ2V0OiBmdW5jdGlvbiBnZXQgKCkge1xuICAgICAgcmV0dXJuIHRtcC5iZWZvcmVJbWFnZUxvYWRcbiAgICB9LFxuICAgIHNldDogZnVuY3Rpb24gc2V0ICh2YWx1ZSkge1xuICAgICAgdG1wLmJlZm9yZUltYWdlTG9hZCA9IHZhbHVlO1xuICAgIH1cbiAgfSxcbiAgb25JbWFnZUxvYWQ6IHtcbiAgICBkZWZhdWx0OiBudWxsLFxuICAgIGdldDogZnVuY3Rpb24gZ2V0ICgpIHtcbiAgICAgIHJldHVybiB0bXAuaW1hZ2VMb2FkXG4gICAgfSxcbiAgICBzZXQ6IGZ1bmN0aW9uIHNldCAodmFsdWUpIHtcbiAgICAgIHRtcC5pbWFnZUxvYWQgPSB2YWx1ZTtcbiAgICB9XG4gIH0sXG4gIG9uQmVmb3JlRHJhdzoge1xuICAgIGRlZmF1bHQ6IG51bGwsXG4gICAgZ2V0OiBmdW5jdGlvbiBnZXQgKCkge1xuICAgICAgcmV0dXJuIHRtcC5iZWZvcmVEcmF3XG4gICAgfSxcbiAgICBzZXQ6IGZ1bmN0aW9uIHNldCAodmFsdWUpIHtcbiAgICAgIHRtcC5iZWZvcmVEcmF3ID0gdmFsdWU7XG4gICAgfVxuICB9XG59O1xuXG5mdW5jdGlvbiBwcmVwYXJlICgpIHtcbiAgdmFyIHNlbGYgPSB0aGlzO1xuICB2YXIgcmVmID0gZ2V0RGV2aWNlKCk7XG4gIHZhciB3aW5kb3dXaWR0aCA9IHJlZi53aW5kb3dXaWR0aDtcblxuICBzZWxmLmF0dGFjaFBhZ2UgPSBmdW5jdGlvbiAoKSB7XG4gICAgdmFyIHBhZ2VzID0gZ2V0Q3VycmVudFBhZ2VzKCk7XG4gICAgLy8gIOiOt+WPluWIsOW9k+WJjXBhZ2XkuIrkuIvmlodcbiAgICB2YXIgcGFnZUNvbnRleHQgPSBwYWdlc1twYWdlcy5sZW5ndGggLSAxXTtcbiAgICAvLyAg5oqKdGhpc+S+nemZhOWcqFBhZ2XkuIrkuIvmlofnmoR3ZWNyb3BwZXLlsZ7mgKfkuIrvvIzkvr/kuo7lnKhwYWdl6ZKp5a2Q5Ye95pWw5Lit6K6/6ZeuXG4gICAgcGFnZUNvbnRleHQud2Vjcm9wcGVyID0gc2VsZjtcbiAgfTtcblxuICBzZWxmLmNyZWF0ZUN0eCA9IGZ1bmN0aW9uICgpIHtcbiAgICB2YXIgaWQgPSBzZWxmLmlkO1xuICAgIGlmIChpZCkge1xuICAgICAgc2VsZi5jdHggPSB3eC5jcmVhdGVDYW52YXNDb250ZXh0KGlkKTtcbiAgICB9IGVsc2Uge1xuICAgICAgY29uc29sZS5lcnJvcihcImNvbnN0cnVjdG9yOiBjcmVhdGUgY2FudmFzIGNvbnRleHQgZmFpbGVkLCAnaWQnIG11c3QgYmUgdmFsdWFibGVcIik7XG4gICAgfVxuICB9O1xuXG4gIHNlbGYuZGV2aWNlUmFkaW8gPSB3aW5kb3dXaWR0aCAvIDc1MDtcbn1cblxuZnVuY3Rpb24gb2JzZXJ2ZXIgKCkge1xuICB2YXIgc2VsZiA9IHRoaXM7XG5cbiAgdmFyIEVWRU5UX1RZUEUgPSBbJ3JlYWR5JywgJ2JlZm9yZUltYWdlTG9hZCcsICdiZWZvcmVEcmF3JywgJ2ltYWdlTG9hZCddO1xuXG4gIHNlbGYub24gPSBmdW5jdGlvbiAoZXZlbnQsIGZuKSB7XG4gICAgaWYgKEVWRU5UX1RZUEUuaW5kZXhPZihldmVudCkgPiAtMSkge1xuICAgICAgaWYgKHR5cGVvZiAoZm4pID09PSAnZnVuY3Rpb24nKSB7XG4gICAgICAgIGV2ZW50ID09PSAncmVhZHknXG4gICAgICAgICAgPyBmbihzZWxmKVxuICAgICAgICAgIDogc2VsZlsoXCJvblwiICsgKGZpcnN0TGV0dGVyVXBwZXIoZXZlbnQpKSldID0gZm47XG4gICAgICB9XG4gICAgfSBlbHNlIHtcbiAgICAgIGNvbnNvbGUuZXJyb3IoKFwiZXZlbnQ6IFwiICsgZXZlbnQgKyBcIiBpcyBpbnZhbGlkXCIpKTtcbiAgICB9XG4gICAgcmV0dXJuIHNlbGZcbiAgfTtcbn1cblxudmFyIGNvbW1vbmpzR2xvYmFsID0gdHlwZW9mIHdpbmRvdyAhPT0gJ3VuZGVmaW5lZCcgPyB3aW5kb3cgOiB0eXBlb2YgZ2xvYmFsICE9PSAndW5kZWZpbmVkJyA/IGdsb2JhbCA6IHR5cGVvZiBzZWxmICE9PSAndW5kZWZpbmVkJyA/IHNlbGYgOiB7fTtcblxuXG5cblxuXG5mdW5jdGlvbiBjcmVhdGVDb21tb25qc01vZHVsZShmbiwgbW9kdWxlKSB7XG5cdHJldHVybiBtb2R1bGUgPSB7IGV4cG9ydHM6IHt9IH0sIGZuKG1vZHVsZSwgbW9kdWxlLmV4cG9ydHMpLCBtb2R1bGUuZXhwb3J0cztcbn1cblxudmFyIGJhc2U2NCA9IGNyZWF0ZUNvbW1vbmpzTW9kdWxlKGZ1bmN0aW9uIChtb2R1bGUsIGV4cG9ydHMpIHtcbi8qISBodHRwOi8vbXRocy5iZS9iYXNlNjQgdjAuMS4wIGJ5IEBtYXRoaWFzIHwgTUlUIGxpY2Vuc2UgKi9cbihmdW5jdGlvbihyb290KSB7XG5cblx0Ly8gRGV0ZWN0IGZyZWUgdmFyaWFibGVzIGBleHBvcnRzYC5cblx0dmFyIGZyZWVFeHBvcnRzID0gJ29iamVjdCcgPT0gJ29iamVjdCcgJiYgZXhwb3J0cztcblxuXHQvLyBEZXRlY3QgZnJlZSB2YXJpYWJsZSBgbW9kdWxlYC5cblx0dmFyIGZyZWVNb2R1bGUgPSAnb2JqZWN0JyA9PSAnb2JqZWN0JyAmJiBtb2R1bGUgJiZcblx0XHRtb2R1bGUuZXhwb3J0cyA9PSBmcmVlRXhwb3J0cyAmJiBtb2R1bGU7XG5cblx0Ly8gRGV0ZWN0IGZyZWUgdmFyaWFibGUgYGdsb2JhbGAsIGZyb20gTm9kZS5qcyBvciBCcm93c2VyaWZpZWQgY29kZSwgYW5kIHVzZVxuXHQvLyBpdCBhcyBgcm9vdGAuXG5cdHZhciBmcmVlR2xvYmFsID0gdHlwZW9mIGNvbW1vbmpzR2xvYmFsID09ICdvYmplY3QnICYmIGNvbW1vbmpzR2xvYmFsO1xuXHRpZiAoZnJlZUdsb2JhbC5nbG9iYWwgPT09IGZyZWVHbG9iYWwgfHwgZnJlZUdsb2JhbC53aW5kb3cgPT09IGZyZWVHbG9iYWwpIHtcblx0XHRyb290ID0gZnJlZUdsb2JhbDtcblx0fVxuXG5cdC8qLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0qL1xuXG5cdHZhciBJbnZhbGlkQ2hhcmFjdGVyRXJyb3IgPSBmdW5jdGlvbihtZXNzYWdlKSB7XG5cdFx0dGhpcy5tZXNzYWdlID0gbWVzc2FnZTtcblx0fTtcblx0SW52YWxpZENoYXJhY3RlckVycm9yLnByb3RvdHlwZSA9IG5ldyBFcnJvcjtcblx0SW52YWxpZENoYXJhY3RlckVycm9yLnByb3RvdHlwZS5uYW1lID0gJ0ludmFsaWRDaGFyYWN0ZXJFcnJvcic7XG5cblx0dmFyIGVycm9yID0gZnVuY3Rpb24obWVzc2FnZSkge1xuXHRcdC8vIE5vdGU6IHRoZSBlcnJvciBtZXNzYWdlcyB1c2VkIHRocm91Z2hvdXQgdGhpcyBmaWxlIG1hdGNoIHRob3NlIHVzZWQgYnlcblx0XHQvLyB0aGUgbmF0aXZlIGBhdG9iYC9gYnRvYWAgaW1wbGVtZW50YXRpb24gaW4gQ2hyb21pdW0uXG5cdFx0dGhyb3cgbmV3IEludmFsaWRDaGFyYWN0ZXJFcnJvcihtZXNzYWdlKTtcblx0fTtcblxuXHR2YXIgVEFCTEUgPSAnQUJDREVGR0hJSktMTU5PUFFSU1RVVldYWVphYmNkZWZnaGlqa2xtbm9wcXJzdHV2d3h5ejAxMjM0NTY3ODkrLyc7XG5cdC8vIGh0dHA6Ly93aGF0d2cub3JnL2h0bWwvY29tbW9uLW1pY3Jvc3ludGF4ZXMuaHRtbCNzcGFjZS1jaGFyYWN0ZXJcblx0dmFyIFJFR0VYX1NQQUNFX0NIQVJBQ1RFUlMgPSAvW1xcdFxcblxcZlxcciBdL2c7XG5cblx0Ly8gYGRlY29kZWAgaXMgZGVzaWduZWQgdG8gYmUgZnVsbHkgY29tcGF0aWJsZSB3aXRoIGBhdG9iYCBhcyBkZXNjcmliZWQgaW4gdGhlXG5cdC8vIEhUTUwgU3RhbmRhcmQuIGh0dHA6Ly93aGF0d2cub3JnL2h0bWwvd2ViYXBwYXBpcy5odG1sI2RvbS13aW5kb3diYXNlNjQtYXRvYlxuXHQvLyBUaGUgb3B0aW1pemVkIGJhc2U2NC1kZWNvZGluZyBhbGdvcml0aG0gdXNlZCBpcyBiYXNlZCBvbiBAYXRr4oCZcyBleGNlbGxlbnRcblx0Ly8gaW1wbGVtZW50YXRpb24uIGh0dHBzOi8vZ2lzdC5naXRodWIuY29tL2F0ay8xMDIwMzk2XG5cdHZhciBkZWNvZGUgPSBmdW5jdGlvbihpbnB1dCkge1xuXHRcdGlucHV0ID0gU3RyaW5nKGlucHV0KVxuXHRcdFx0LnJlcGxhY2UoUkVHRVhfU1BBQ0VfQ0hBUkFDVEVSUywgJycpO1xuXHRcdHZhciBsZW5ndGggPSBpbnB1dC5sZW5ndGg7XG5cdFx0aWYgKGxlbmd0aCAlIDQgPT0gMCkge1xuXHRcdFx0aW5wdXQgPSBpbnB1dC5yZXBsYWNlKC89PT8kLywgJycpO1xuXHRcdFx0bGVuZ3RoID0gaW5wdXQubGVuZ3RoO1xuXHRcdH1cblx0XHRpZiAoXG5cdFx0XHRsZW5ndGggJSA0ID09IDEgfHxcblx0XHRcdC8vIGh0dHA6Ly93aGF0d2cub3JnL0MjYWxwaGFudW1lcmljLWFzY2lpLWNoYXJhY3RlcnNcblx0XHRcdC9bXithLXpBLVowLTkvXS8udGVzdChpbnB1dClcblx0XHQpIHtcblx0XHRcdGVycm9yKFxuXHRcdFx0XHQnSW52YWxpZCBjaGFyYWN0ZXI6IHRoZSBzdHJpbmcgdG8gYmUgZGVjb2RlZCBpcyBub3QgY29ycmVjdGx5IGVuY29kZWQuJ1xuXHRcdFx0KTtcblx0XHR9XG5cdFx0dmFyIGJpdENvdW50ZXIgPSAwO1xuXHRcdHZhciBiaXRTdG9yYWdlO1xuXHRcdHZhciBidWZmZXI7XG5cdFx0dmFyIG91dHB1dCA9ICcnO1xuXHRcdHZhciBwb3NpdGlvbiA9IC0xO1xuXHRcdHdoaWxlICgrK3Bvc2l0aW9uIDwgbGVuZ3RoKSB7XG5cdFx0XHRidWZmZXIgPSBUQUJMRS5pbmRleE9mKGlucHV0LmNoYXJBdChwb3NpdGlvbikpO1xuXHRcdFx0Yml0U3RvcmFnZSA9IGJpdENvdW50ZXIgJSA0ID8gYml0U3RvcmFnZSAqIDY0ICsgYnVmZmVyIDogYnVmZmVyO1xuXHRcdFx0Ly8gVW5sZXNzIHRoaXMgaXMgdGhlIGZpcnN0IG9mIGEgZ3JvdXAgb2YgNCBjaGFyYWN0ZXJz4oCmXG5cdFx0XHRpZiAoYml0Q291bnRlcisrICUgNCkge1xuXHRcdFx0XHQvLyDigKZjb252ZXJ0IHRoZSBmaXJzdCA4IGJpdHMgdG8gYSBzaW5nbGUgQVNDSUkgY2hhcmFjdGVyLlxuXHRcdFx0XHRvdXRwdXQgKz0gU3RyaW5nLmZyb21DaGFyQ29kZShcblx0XHRcdFx0XHQweEZGICYgYml0U3RvcmFnZSA+PiAoLTIgKiBiaXRDb3VudGVyICYgNilcblx0XHRcdFx0KTtcblx0XHRcdH1cblx0XHR9XG5cdFx0cmV0dXJuIG91dHB1dDtcblx0fTtcblxuXHQvLyBgZW5jb2RlYCBpcyBkZXNpZ25lZCB0byBiZSBmdWxseSBjb21wYXRpYmxlIHdpdGggYGJ0b2FgIGFzIGRlc2NyaWJlZCBpbiB0aGVcblx0Ly8gSFRNTCBTdGFuZGFyZDogaHR0cDovL3doYXR3Zy5vcmcvaHRtbC93ZWJhcHBhcGlzLmh0bWwjZG9tLXdpbmRvd2Jhc2U2NC1idG9hXG5cdHZhciBlbmNvZGUgPSBmdW5jdGlvbihpbnB1dCkge1xuXHRcdGlucHV0ID0gU3RyaW5nKGlucHV0KTtcblx0XHRpZiAoL1teXFwwLVxceEZGXS8udGVzdChpbnB1dCkpIHtcblx0XHRcdC8vIE5vdGU6IG5vIG5lZWQgdG8gc3BlY2lhbC1jYXNlIGFzdHJhbCBzeW1ib2xzIGhlcmUsIGFzIHN1cnJvZ2F0ZXMgYXJlXG5cdFx0XHQvLyBtYXRjaGVkLCBhbmQgdGhlIGlucHV0IGlzIHN1cHBvc2VkIHRvIG9ubHkgY29udGFpbiBBU0NJSSBhbnl3YXkuXG5cdFx0XHRlcnJvcihcblx0XHRcdFx0J1RoZSBzdHJpbmcgdG8gYmUgZW5jb2RlZCBjb250YWlucyBjaGFyYWN0ZXJzIG91dHNpZGUgb2YgdGhlICcgK1xuXHRcdFx0XHQnTGF0aW4xIHJhbmdlLidcblx0XHRcdCk7XG5cdFx0fVxuXHRcdHZhciBwYWRkaW5nID0gaW5wdXQubGVuZ3RoICUgMztcblx0XHR2YXIgb3V0cHV0ID0gJyc7XG5cdFx0dmFyIHBvc2l0aW9uID0gLTE7XG5cdFx0dmFyIGE7XG5cdFx0dmFyIGI7XG5cdFx0dmFyIGM7XG5cdFx0dmFyIGJ1ZmZlcjtcblx0XHQvLyBNYWtlIHN1cmUgYW55IHBhZGRpbmcgaXMgaGFuZGxlZCBvdXRzaWRlIG9mIHRoZSBsb29wLlxuXHRcdHZhciBsZW5ndGggPSBpbnB1dC5sZW5ndGggLSBwYWRkaW5nO1xuXG5cdFx0d2hpbGUgKCsrcG9zaXRpb24gPCBsZW5ndGgpIHtcblx0XHRcdC8vIFJlYWQgdGhyZWUgYnl0ZXMsIGkuZS4gMjQgYml0cy5cblx0XHRcdGEgPSBpbnB1dC5jaGFyQ29kZUF0KHBvc2l0aW9uKSA8PCAxNjtcblx0XHRcdGIgPSBpbnB1dC5jaGFyQ29kZUF0KCsrcG9zaXRpb24pIDw8IDg7XG5cdFx0XHRjID0gaW5wdXQuY2hhckNvZGVBdCgrK3Bvc2l0aW9uKTtcblx0XHRcdGJ1ZmZlciA9IGEgKyBiICsgYztcblx0XHRcdC8vIFR1cm4gdGhlIDI0IGJpdHMgaW50byBmb3VyIGNodW5rcyBvZiA2IGJpdHMgZWFjaCwgYW5kIGFwcGVuZCB0aGVcblx0XHRcdC8vIG1hdGNoaW5nIGNoYXJhY3RlciBmb3IgZWFjaCBvZiB0aGVtIHRvIHRoZSBvdXRwdXQuXG5cdFx0XHRvdXRwdXQgKz0gKFxuXHRcdFx0XHRUQUJMRS5jaGFyQXQoYnVmZmVyID4+IDE4ICYgMHgzRikgK1xuXHRcdFx0XHRUQUJMRS5jaGFyQXQoYnVmZmVyID4+IDEyICYgMHgzRikgK1xuXHRcdFx0XHRUQUJMRS5jaGFyQXQoYnVmZmVyID4+IDYgJiAweDNGKSArXG5cdFx0XHRcdFRBQkxFLmNoYXJBdChidWZmZXIgJiAweDNGKVxuXHRcdFx0KTtcblx0XHR9XG5cblx0XHRpZiAocGFkZGluZyA9PSAyKSB7XG5cdFx0XHRhID0gaW5wdXQuY2hhckNvZGVBdChwb3NpdGlvbikgPDwgODtcblx0XHRcdGIgPSBpbnB1dC5jaGFyQ29kZUF0KCsrcG9zaXRpb24pO1xuXHRcdFx0YnVmZmVyID0gYSArIGI7XG5cdFx0XHRvdXRwdXQgKz0gKFxuXHRcdFx0XHRUQUJMRS5jaGFyQXQoYnVmZmVyID4+IDEwKSArXG5cdFx0XHRcdFRBQkxFLmNoYXJBdCgoYnVmZmVyID4+IDQpICYgMHgzRikgK1xuXHRcdFx0XHRUQUJMRS5jaGFyQXQoKGJ1ZmZlciA8PCAyKSAmIDB4M0YpICtcblx0XHRcdFx0Jz0nXG5cdFx0XHQpO1xuXHRcdH0gZWxzZSBpZiAocGFkZGluZyA9PSAxKSB7XG5cdFx0XHRidWZmZXIgPSBpbnB1dC5jaGFyQ29kZUF0KHBvc2l0aW9uKTtcblx0XHRcdG91dHB1dCArPSAoXG5cdFx0XHRcdFRBQkxFLmNoYXJBdChidWZmZXIgPj4gMikgK1xuXHRcdFx0XHRUQUJMRS5jaGFyQXQoKGJ1ZmZlciA8PCA0KSAmIDB4M0YpICtcblx0XHRcdFx0Jz09J1xuXHRcdFx0KTtcblx0XHR9XG5cblx0XHRyZXR1cm4gb3V0cHV0O1xuXHR9O1xuXG5cdHZhciBiYXNlNjQgPSB7XG5cdFx0J2VuY29kZSc6IGVuY29kZSxcblx0XHQnZGVjb2RlJzogZGVjb2RlLFxuXHRcdCd2ZXJzaW9uJzogJzAuMS4wJ1xuXHR9O1xuXG5cdC8vIFNvbWUgQU1EIGJ1aWxkIG9wdGltaXplcnMsIGxpa2Ugci5qcywgY2hlY2sgZm9yIHNwZWNpZmljIGNvbmRpdGlvbiBwYXR0ZXJuc1xuXHQvLyBsaWtlIHRoZSBmb2xsb3dpbmc6XG5cdGlmIChcblx0XHR0eXBlb2YgdW5kZWZpbmVkID09ICdmdW5jdGlvbicgJiZcblx0XHR0eXBlb2YgdW5kZWZpbmVkLmFtZCA9PSAnb2JqZWN0JyAmJlxuXHRcdHVuZGVmaW5lZC5hbWRcblx0KSB7XG5cdFx0dW5kZWZpbmVkKGZ1bmN0aW9uKCkge1xuXHRcdFx0cmV0dXJuIGJhc2U2NDtcblx0XHR9KTtcblx0fVx0ZWxzZSBpZiAoZnJlZUV4cG9ydHMgJiYgIWZyZWVFeHBvcnRzLm5vZGVUeXBlKSB7XG5cdFx0aWYgKGZyZWVNb2R1bGUpIHsgLy8gaW4gTm9kZS5qcyBvciBSaW5nb0pTIHYwLjguMCtcblx0XHRcdGZyZWVNb2R1bGUuZXhwb3J0cyA9IGJhc2U2NDtcblx0XHR9IGVsc2UgeyAvLyBpbiBOYXJ3aGFsIG9yIFJpbmdvSlMgdjAuNy4wLVxuXHRcdFx0Zm9yICh2YXIga2V5IGluIGJhc2U2NCkge1xuXHRcdFx0XHRiYXNlNjQuaGFzT3duUHJvcGVydHkoa2V5KSAmJiAoZnJlZUV4cG9ydHNba2V5XSA9IGJhc2U2NFtrZXldKTtcblx0XHRcdH1cblx0XHR9XG5cdH0gZWxzZSB7IC8vIGluIFJoaW5vIG9yIGEgd2ViIGJyb3dzZXJcblx0XHRyb290LmJhc2U2NCA9IGJhc2U2NDtcblx0fVxuXG59KGNvbW1vbmpzR2xvYmFsKSk7XG59KTtcblxuZnVuY3Rpb24gbWFrZVVSSSAoc3RyRGF0YSwgdHlwZSkge1xuICByZXR1cm4gJ2RhdGE6JyArIHR5cGUgKyAnO2Jhc2U2NCwnICsgc3RyRGF0YVxufVxuXG5mdW5jdGlvbiBmaXhUeXBlICh0eXBlKSB7XG4gIHR5cGUgPSB0eXBlLnRvTG93ZXJDYXNlKCkucmVwbGFjZSgvanBnL2ksICdqcGVnJyk7XG4gIHZhciByID0gdHlwZS5tYXRjaCgvcG5nfGpwZWd8Ym1wfGdpZi8pWzBdO1xuICByZXR1cm4gJ2ltYWdlLycgKyByXG59XG5cbmZ1bmN0aW9uIGVuY29kZURhdGEgKGRhdGEpIHtcbiAgdmFyIHN0ciA9ICcnO1xuICBpZiAodHlwZW9mIGRhdGEgPT09ICdzdHJpbmcnKSB7XG4gICAgc3RyID0gZGF0YTtcbiAgfSBlbHNlIHtcbiAgICBmb3IgKHZhciBpID0gMDsgaSA8IGRhdGEubGVuZ3RoOyBpKyspIHtcbiAgICAgIHN0ciArPSBTdHJpbmcuZnJvbUNoYXJDb2RlKGRhdGFbaV0pO1xuICAgIH1cbiAgfVxuICByZXR1cm4gYmFzZTY0LmVuY29kZShzdHIpXG59XG5cbi8qKlxuICog6I635Y+W5Zu+5YOP5Yy65Z+f6ZqQ5ZCr55qE5YOP57Sg5pWw5o2uXG4gKiBAcGFyYW0gY2FudmFzSWQgY2FudmFz5qCH6K+GXG4gKiBAcGFyYW0geCDlsIbopoHooqvmj5Dlj5bnmoTlm77lg4/mlbDmja7nn6nlvaLljLrln5/nmoTlt6bkuIrop5IgeCDlnZDmoIdcbiAqIEBwYXJhbSB5IOWwhuimgeiiq+aPkOWPlueahOWbvuWDj+aVsOaNruefqeW9ouWMuuWfn+eahOW3puS4iuinkiB5IOWdkOagh1xuICogQHBhcmFtIHdpZHRoIOWwhuimgeiiq+aPkOWPlueahOWbvuWDj+aVsOaNruefqeW9ouWMuuWfn+eahOWuveW6plxuICogQHBhcmFtIGhlaWdodCDlsIbopoHooqvmj5Dlj5bnmoTlm77lg4/mlbDmja7nn6nlvaLljLrln5/nmoTpq5jluqZcbiAqIEBwYXJhbSBkb25lIOWujOaIkOWbnuiwg1xuICovXG5mdW5jdGlvbiBnZXRJbWFnZURhdGEgKGNhbnZhc0lkLCB4LCB5LCB3aWR0aCwgaGVpZ2h0LCBkb25lKSB7XG4gIHd4LmNhbnZhc0dldEltYWdlRGF0YSh7XG4gICAgY2FudmFzSWQ6IGNhbnZhc0lkLFxuICAgIHg6IHgsXG4gICAgeTogeSxcbiAgICB3aWR0aDogd2lkdGgsXG4gICAgaGVpZ2h0OiBoZWlnaHQsXG4gICAgc3VjY2VzczogZnVuY3Rpb24gc3VjY2VzcyAocmVzKSB7XG4gICAgICBkb25lKHJlcyk7XG4gICAgfSxcbiAgICBmYWlsOiBmdW5jdGlvbiBmYWlsIChyZXMpIHtcbiAgICAgIGRvbmUobnVsbCk7XG4gICAgICBjb25zb2xlLmVycm9yKCdjYW52YXNHZXRJbWFnZURhdGEgZXJyb3I6ICcgKyByZXMpO1xuICAgIH1cbiAgfSk7XG59XG5cbi8qKlxuICog55Sf5oiQYm1w5qC85byP5Zu+54mHXG4gKiDmjInnhafop4TliJnnlJ/miJDlm77niYflk43lupTlpLTlkozlk43lupTkvZNcbiAqIEBwYXJhbSBvRGF0YSDnlKjmnaXmj4/ov7AgY2FudmFzIOWMuuWfn+makOWQq+eahOWDj+e0oOaVsOaNriB7IGRhdGEsIHdpZHRoLCBoZWlnaHQgfSA9IG9EYXRhXG4gKiBAcmV0dXJucyB7Kn0gYmFzZTY05a2X56ym5LiyXG4gKi9cbmZ1bmN0aW9uIGdlbkJpdG1hcEltYWdlIChvRGF0YSkge1xuICAvL1xuICAvLyBCSVRNQVBGSUxFSEVBREVSOiBodHRwOi8vbXNkbi5taWNyb3NvZnQuY29tL2VuLXVzL2xpYnJhcnkvd2luZG93cy9kZXNrdG9wL2RkMTgzMzc0KHY9dnMuODUpLmFzcHhcbiAgLy8gQklUTUFQSU5GT0hFQURFUjogaHR0cDovL21zZG4ubWljcm9zb2Z0LmNvbS9lbi11cy9saWJyYXJ5L2RkMTgzMzc2LmFzcHhcbiAgLy9cbiAgdmFyIGJpV2lkdGggPSBvRGF0YS53aWR0aDtcbiAgdmFyIGJpSGVpZ2h0XHQ9IG9EYXRhLmhlaWdodDtcbiAgdmFyIGJpU2l6ZUltYWdlID0gYmlXaWR0aCAqIGJpSGVpZ2h0ICogMztcbiAgdmFyIGJmU2l6ZSA9IGJpU2l6ZUltYWdlICsgNTQ7IC8vIHRvdGFsIGhlYWRlciBzaXplID0gNTQgYnl0ZXNcblxuICAvL1xuICAvLyAgdHlwZWRlZiBzdHJ1Y3QgdGFnQklUTUFQRklMRUhFQURFUiB7XG4gIC8vICBcdFdPUkQgYmZUeXBlO1xuICAvLyAgXHREV09SRCBiZlNpemU7XG4gIC8vICBcdFdPUkQgYmZSZXNlcnZlZDE7XG4gIC8vICBcdFdPUkQgYmZSZXNlcnZlZDI7XG4gIC8vICBcdERXT1JEIGJmT2ZmQml0cztcbiAgLy8gIH0gQklUTUFQRklMRUhFQURFUjtcbiAgLy9cbiAgdmFyIEJJVE1BUEZJTEVIRUFERVIgPSBbXG4gICAgLy8gV09SRCBiZlR5cGUgLS0gVGhlIGZpbGUgdHlwZSBzaWduYXR1cmU7IG11c3QgYmUgXCJCTVwiXG4gICAgMHg0MiwgMHg0RCxcbiAgICAvLyBEV09SRCBiZlNpemUgLS0gVGhlIHNpemUsIGluIGJ5dGVzLCBvZiB0aGUgYml0bWFwIGZpbGVcbiAgICBiZlNpemUgJiAweGZmLCBiZlNpemUgPj4gOCAmIDB4ZmYsIGJmU2l6ZSA+PiAxNiAmIDB4ZmYsIGJmU2l6ZSA+PiAyNCAmIDB4ZmYsXG4gICAgLy8gV09SRCBiZlJlc2VydmVkMSAtLSBSZXNlcnZlZDsgbXVzdCBiZSB6ZXJvXG4gICAgMCwgMCxcbiAgICAvLyBXT1JEIGJmUmVzZXJ2ZWQyIC0tIFJlc2VydmVkOyBtdXN0IGJlIHplcm9cbiAgICAwLCAwLFxuICAgIC8vIERXT1JEIGJmT2ZmQml0cyAtLSBUaGUgb2Zmc2V0LCBpbiBieXRlcywgZnJvbSB0aGUgYmVnaW5uaW5nIG9mIHRoZSBCSVRNQVBGSUxFSEVBREVSIHN0cnVjdHVyZSB0byB0aGUgYml0bWFwIGJpdHMuXG4gICAgNTQsIDAsIDAsIDBcbiAgXTtcblxuICAvL1xuICAvLyAgdHlwZWRlZiBzdHJ1Y3QgdGFnQklUTUFQSU5GT0hFQURFUiB7XG4gIC8vICBcdERXT1JEIGJpU2l6ZTtcbiAgLy8gIFx0TE9ORyAgYmlXaWR0aDtcbiAgLy8gIFx0TE9ORyAgYmlIZWlnaHQ7XG4gIC8vICBcdFdPUkQgIGJpUGxhbmVzO1xuICAvLyAgXHRXT1JEICBiaUJpdENvdW50O1xuICAvLyAgXHREV09SRCBiaUNvbXByZXNzaW9uO1xuICAvLyAgXHREV09SRCBiaVNpemVJbWFnZTtcbiAgLy8gIFx0TE9ORyAgYmlYUGVsc1Blck1ldGVyO1xuICAvLyAgXHRMT05HICBiaVlQZWxzUGVyTWV0ZXI7XG4gIC8vICBcdERXT1JEIGJpQ2xyVXNlZDtcbiAgLy8gIFx0RFdPUkQgYmlDbHJJbXBvcnRhbnQ7XG4gIC8vICB9IEJJVE1BUElORk9IRUFERVIsICpQQklUTUFQSU5GT0hFQURFUjtcbiAgLy9cbiAgdmFyIEJJVE1BUElORk9IRUFERVIgPSBbXG4gICAgLy8gRFdPUkQgYmlTaXplIC0tIFRoZSBudW1iZXIgb2YgYnl0ZXMgcmVxdWlyZWQgYnkgdGhlIHN0cnVjdHVyZVxuICAgIDQwLCAwLCAwLCAwLFxuICAgIC8vIExPTkcgYmlXaWR0aCAtLSBUaGUgd2lkdGggb2YgdGhlIGJpdG1hcCwgaW4gcGl4ZWxzXG4gICAgYmlXaWR0aCAmIDB4ZmYsIGJpV2lkdGggPj4gOCAmIDB4ZmYsIGJpV2lkdGggPj4gMTYgJiAweGZmLCBiaVdpZHRoID4+IDI0ICYgMHhmZixcbiAgICAvLyBMT05HIGJpSGVpZ2h0IC0tIFRoZSBoZWlnaHQgb2YgdGhlIGJpdG1hcCwgaW4gcGl4ZWxzXG4gICAgYmlIZWlnaHQgJiAweGZmLCBiaUhlaWdodCA+PiA4ICYgMHhmZiwgYmlIZWlnaHQgPj4gMTYgJiAweGZmLCBiaUhlaWdodCA+PiAyNCAmIDB4ZmYsXG4gICAgLy8gV09SRCBiaVBsYW5lcyAtLSBUaGUgbnVtYmVyIG9mIHBsYW5lcyBmb3IgdGhlIHRhcmdldCBkZXZpY2UuIFRoaXMgdmFsdWUgbXVzdCBiZSBzZXQgdG8gMVxuICAgIDEsIDAsXG4gICAgLy8gV09SRCBiaUJpdENvdW50IC0tIFRoZSBudW1iZXIgb2YgYml0cy1wZXItcGl4ZWwsIDI0IGJpdHMtcGVyLXBpeGVsIC0tIHRoZSBiaXRtYXBcbiAgICAvLyBoYXMgYSBtYXhpbXVtIG9mIDJeMjQgY29sb3JzICgxNjc3NzIxNiwgVHJ1ZWNvbG9yKVxuICAgIDI0LCAwLFxuICAgIC8vIERXT1JEIGJpQ29tcHJlc3Npb24gLS0gVGhlIHR5cGUgb2YgY29tcHJlc3Npb24sIEJJX1JHQiAoY29kZSAwKSAtLSB1bmNvbXByZXNzZWRcbiAgICAwLCAwLCAwLCAwLFxuICAgIC8vIERXT1JEIGJpU2l6ZUltYWdlIC0tIFRoZSBzaXplLCBpbiBieXRlcywgb2YgdGhlIGltYWdlLiBUaGlzIG1heSBiZSBzZXQgdG8gemVybyBmb3IgQklfUkdCIGJpdG1hcHNcbiAgICBiaVNpemVJbWFnZSAmIDB4ZmYsIGJpU2l6ZUltYWdlID4+IDggJiAweGZmLCBiaVNpemVJbWFnZSA+PiAxNiAmIDB4ZmYsIGJpU2l6ZUltYWdlID4+IDI0ICYgMHhmZixcbiAgICAvLyBMT05HIGJpWFBlbHNQZXJNZXRlciwgdW51c2VkXG4gICAgMCwgMCwgMCwgMCxcbiAgICAvLyBMT05HIGJpWVBlbHNQZXJNZXRlciwgdW51c2VkXG4gICAgMCwgMCwgMCwgMCxcbiAgICAvLyBEV09SRCBiaUNsclVzZWQsIHRoZSBudW1iZXIgb2YgY29sb3IgaW5kZXhlcyBvZiBwYWxldHRlLCB1bnVzZWRcbiAgICAwLCAwLCAwLCAwLFxuICAgIC8vIERXT1JEIGJpQ2xySW1wb3J0YW50LCB1bnVzZWRcbiAgICAwLCAwLCAwLCAwXG4gIF07XG5cbiAgdmFyIGlQYWRkaW5nID0gKDQgLSAoKGJpV2lkdGggKiAzKSAlIDQpKSAlIDQ7XG5cbiAgdmFyIGFJbWdEYXRhID0gb0RhdGEuZGF0YTtcblxuICB2YXIgc3RyUGl4ZWxEYXRhID0gJyc7XG4gIHZhciBiaVdpZHRoNCA9IGJpV2lkdGggPDwgMjtcbiAgdmFyIHkgPSBiaUhlaWdodDtcbiAgdmFyIGZyb21DaGFyQ29kZSA9IFN0cmluZy5mcm9tQ2hhckNvZGU7XG5cbiAgZG8ge1xuICAgIHZhciBpT2Zmc2V0WSA9IGJpV2lkdGg0ICogKHkgLSAxKTtcbiAgICB2YXIgc3RyUGl4ZWxSb3cgPSAnJztcbiAgICBmb3IgKHZhciB4ID0gMDsgeCA8IGJpV2lkdGg7IHgrKykge1xuICAgICAgdmFyIGlPZmZzZXRYID0geCA8PCAyO1xuICAgICAgc3RyUGl4ZWxSb3cgKz0gZnJvbUNoYXJDb2RlKGFJbWdEYXRhW2lPZmZzZXRZICsgaU9mZnNldFggKyAyXSkgK1xuICAgICAgICBmcm9tQ2hhckNvZGUoYUltZ0RhdGFbaU9mZnNldFkgKyBpT2Zmc2V0WCArIDFdKSArXG4gICAgICAgIGZyb21DaGFyQ29kZShhSW1nRGF0YVtpT2Zmc2V0WSArIGlPZmZzZXRYXSk7XG4gICAgfVxuXG4gICAgZm9yICh2YXIgYyA9IDA7IGMgPCBpUGFkZGluZzsgYysrKSB7XG4gICAgICBzdHJQaXhlbFJvdyArPSBTdHJpbmcuZnJvbUNoYXJDb2RlKDApO1xuICAgIH1cblxuICAgIHN0clBpeGVsRGF0YSArPSBzdHJQaXhlbFJvdztcbiAgfSB3aGlsZSAoLS15KVxuXG4gIHZhciBzdHJFbmNvZGVkID0gZW5jb2RlRGF0YShCSVRNQVBGSUxFSEVBREVSLmNvbmNhdChCSVRNQVBJTkZPSEVBREVSKSkgKyBlbmNvZGVEYXRhKHN0clBpeGVsRGF0YSk7XG5cbiAgcmV0dXJuIHN0ckVuY29kZWRcbn1cblxuLyoqXG4gKiDovazmjaLkuLrlm77niYdiYXNlNjRcbiAqIEBwYXJhbSBjYW52YXNJZCBjYW52YXPmoIfor4ZcbiAqIEBwYXJhbSB4IOWwhuimgeiiq+aPkOWPlueahOWbvuWDj+aVsOaNruefqeW9ouWMuuWfn+eahOW3puS4iuinkiB4IOWdkOagh1xuICogQHBhcmFtIHkg5bCG6KaB6KKr5o+Q5Y+W55qE5Zu+5YOP5pWw5o2u55+p5b2i5Yy65Z+f55qE5bem5LiK6KeSIHkg5Z2Q5qCHXG4gKiBAcGFyYW0gd2lkdGgg5bCG6KaB6KKr5o+Q5Y+W55qE5Zu+5YOP5pWw5o2u55+p5b2i5Yy65Z+f55qE5a695bqmXG4gKiBAcGFyYW0gaGVpZ2h0IOWwhuimgeiiq+aPkOWPlueahOWbvuWDj+aVsOaNruefqeW9ouWMuuWfn+eahOmrmOW6plxuICogQHBhcmFtIHR5cGUg6L2s5o2i5Zu+54mH57G75Z6LXG4gKiBAcGFyYW0gZG9uZSDlrozmiJDlm57osINcbiAqL1xuZnVuY3Rpb24gY29udmVydFRvSW1hZ2UgKGNhbnZhc0lkLCB4LCB5LCB3aWR0aCwgaGVpZ2h0LCB0eXBlLCBkb25lKSB7XG4gIGlmICggZG9uZSA9PT0gdm9pZCAwICkgZG9uZSA9IGZ1bmN0aW9uICgpIHt9O1xuXG4gIGlmICh0eXBlID09PSB1bmRlZmluZWQpIHsgdHlwZSA9ICdwbmcnOyB9XG4gIHR5cGUgPSBmaXhUeXBlKHR5cGUpO1xuICBpZiAoL2JtcC8udGVzdCh0eXBlKSkge1xuICAgIGdldEltYWdlRGF0YShjYW52YXNJZCwgeCwgeSwgd2lkdGgsIGhlaWdodCwgZnVuY3Rpb24gKGRhdGEpIHtcbiAgICAgIHZhciBzdHJEYXRhID0gZ2VuQml0bWFwSW1hZ2UoZGF0YSk7XG4gICAgICBpc0Z1bmN0aW9uKGRvbmUpICYmIGRvbmUobWFrZVVSSShzdHJEYXRhLCAnaW1hZ2UvJyArIHR5cGUpKTtcbiAgICB9KTtcbiAgfSBlbHNlIHtcbiAgICBjb25zb2xlLmVycm9yKCfmmoLkuI3mlK/mjIHnlJ/miJBcXCcnICsgdHlwZSArICdcXCfnsbvlnovnmoRiYXNlNjTlm77niYcnKTtcbiAgfVxufVxuXG52YXIgQ2FudmFzVG9CYXNlNjQgPSB7XG4gIGNvbnZlcnRUb0ltYWdlOiBjb252ZXJ0VG9JbWFnZSxcbiAgLy8gY29udmVydFRvUE5HOiBmdW5jdGlvbiAod2lkdGgsIGhlaWdodCwgZG9uZSkge1xuICAvLyAgIHJldHVybiBjb252ZXJ0VG9JbWFnZSh3aWR0aCwgaGVpZ2h0LCAncG5nJywgZG9uZSlcbiAgLy8gfSxcbiAgLy8gY29udmVydFRvSlBFRzogZnVuY3Rpb24gKHdpZHRoLCBoZWlnaHQsIGRvbmUpIHtcbiAgLy8gICByZXR1cm4gY29udmVydFRvSW1hZ2Uod2lkdGgsIGhlaWdodCwgJ2pwZWcnLCBkb25lKVxuICAvLyB9LFxuICAvLyBjb252ZXJ0VG9HSUY6IGZ1bmN0aW9uICh3aWR0aCwgaGVpZ2h0LCBkb25lKSB7XG4gIC8vICAgcmV0dXJuIGNvbnZlcnRUb0ltYWdlKHdpZHRoLCBoZWlnaHQsICdnaWYnLCBkb25lKVxuICAvLyB9LFxuICBjb252ZXJ0VG9CTVA6IGZ1bmN0aW9uIChyZWYsIGRvbmUpIHtcbiAgICBpZiAoIHJlZiA9PT0gdm9pZCAwICkgcmVmID0ge307XG4gICAgdmFyIGNhbnZhc0lkID0gcmVmLmNhbnZhc0lkO1xuICAgIHZhciB4ID0gcmVmLng7XG4gICAgdmFyIHkgPSByZWYueTtcbiAgICB2YXIgd2lkdGggPSByZWYud2lkdGg7XG4gICAgdmFyIGhlaWdodCA9IHJlZi5oZWlnaHQ7XG4gICAgaWYgKCBkb25lID09PSB2b2lkIDAgKSBkb25lID0gZnVuY3Rpb24gKCkge307XG5cbiAgICByZXR1cm4gY29udmVydFRvSW1hZ2UoY2FudmFzSWQsIHgsIHksIHdpZHRoLCBoZWlnaHQsICdibXAnLCBkb25lKVxuICB9XG59O1xuXG5mdW5jdGlvbiBtZXRob2RzICgpIHtcbiAgdmFyIHNlbGYgPSB0aGlzO1xuXG4gIHZhciBpZCA9IHNlbGYuaWQ7XG4gIHZhciBkZXZpY2VSYWRpbyA9IHNlbGYuZGV2aWNlUmFkaW87XG4gIHZhciBib3VuZFdpZHRoID0gc2VsZi53aWR0aDsgLy8g6KOB5Ymq5qGG6buY6K6k5a695bqm77yM5Y2z5pW05Liq55S75biD5a695bqmXG4gIHZhciBib3VuZEhlaWdodCA9IHNlbGYuaGVpZ2h0OyAvLyDoo4HliarmoYbpu5jorqTpq5jluqbvvIzljbPmlbTkuKrnlLvluIPpq5jluqZcbiAgdmFyIHJlZiA9IHNlbGYuY3V0O1xuICB2YXIgeCA9IHJlZi54OyBpZiAoIHggPT09IHZvaWQgMCApIHggPSAwO1xuICB2YXIgeSA9IHJlZi55OyBpZiAoIHkgPT09IHZvaWQgMCApIHkgPSAwO1xuICB2YXIgd2lkdGggPSByZWYud2lkdGg7IGlmICggd2lkdGggPT09IHZvaWQgMCApIHdpZHRoID0gYm91bmRXaWR0aDtcbiAgdmFyIGhlaWdodCA9IHJlZi5oZWlnaHQ7IGlmICggaGVpZ2h0ID09PSB2b2lkIDAgKSBoZWlnaHQgPSBib3VuZEhlaWdodDtcblxuICBzZWxmLnVwZGF0ZUNhbnZhcyA9IGZ1bmN0aW9uICgpIHtcbiAgICBpZiAoc2VsZi5jcm9wZXJUYXJnZXQpIHtcbiAgICAgIC8vICDnlLvluIPnu5jliLblm77niYdcbiAgICAgIHNlbGYuY3R4LmRyYXdJbWFnZShzZWxmLmNyb3BlclRhcmdldCwgc2VsZi5pbWdMZWZ0LCBzZWxmLmltZ1RvcCwgc2VsZi5zY2FsZVdpZHRoLCBzZWxmLnNjYWxlSGVpZ2h0KTtcbiAgICB9XG4gICAgaXNGdW5jdGlvbihzZWxmLm9uQmVmb3JlRHJhdykgJiYgc2VsZi5vbkJlZm9yZURyYXcoc2VsZi5jdHgsIHNlbGYpO1xuXG4gICAgc2VsZi5zZXRCb3VuZFN0eWxlKCk7IC8vXHTorr7nva7ovrnnlYzmoLflvI9cbiAgICBzZWxmLmN0eC5kcmF3KCk7XG4gICAgcmV0dXJuIHNlbGZcbiAgfTtcblxuICBzZWxmLnB1c2hPcmlnbiA9IGZ1bmN0aW9uIChzcmMpIHtcbiAgICBzZWxmLnNyYyA9IHNyYztcblxuICAgIGlzRnVuY3Rpb24oc2VsZi5vbkJlZm9yZUltYWdlTG9hZCkgJiYgc2VsZi5vbkJlZm9yZUltYWdlTG9hZChzZWxmLmN0eCwgc2VsZik7XG5cbiAgICB3eC5nZXRJbWFnZUluZm8oe1xuICAgICAgc3JjOiBzcmMsXG4gICAgICBzdWNjZXNzOiBmdW5jdGlvbiBzdWNjZXNzIChyZXMpIHtcbiAgICAgICAgdmFyIGlubmVyQXNwZWN0UmFkaW8gPSByZXMud2lkdGggLyByZXMuaGVpZ2h0O1xuXG4gICAgICAgIHNlbGYuY3JvcGVyVGFyZ2V0ID0gcmVzLnBhdGg7XG4gICAgICAgIFxuICAgICAgICBpZiAoaW5uZXJBc3BlY3RSYWRpbyA8IHdpZHRoIC8gaGVpZ2h0KSB7XG4gICAgICAgICAgc2VsZi5yZWN0WCA9IHg7XG4gICAgICAgICAgc2VsZi5iYXNlV2lkdGggPSB3aWR0aDtcbiAgICAgICAgICBzZWxmLmJhc2VIZWlnaHQgPSB3aWR0aCAvIGlubmVyQXNwZWN0UmFkaW87XG4gICAgICAgICAgc2VsZi5yZWN0WSA9IHkgLSBNYXRoLmFicygoaGVpZ2h0IC0gc2VsZi5iYXNlSGVpZ2h0KSAvIDIpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIHNlbGYucmVjdFkgPSB5O1xuICAgICAgICAgIHNlbGYuYmFzZVdpZHRoID0gaGVpZ2h0ICogaW5uZXJBc3BlY3RSYWRpbztcbiAgICAgICAgICBzZWxmLmJhc2VIZWlnaHQgPSBoZWlnaHQ7XG4gICAgICAgICAgc2VsZi5yZWN0WCA9IHggLSBNYXRoLmFicygod2lkdGggLSBzZWxmLmJhc2VXaWR0aCkgLyAyKTtcbiAgICAgICAgfVxuXG4gICAgICAgIHNlbGYuaW1nTGVmdCA9IHNlbGYucmVjdFg7XG4gICAgICAgIHNlbGYuaW1nVG9wID0gc2VsZi5yZWN0WTtcbiAgICAgICAgc2VsZi5zY2FsZVdpZHRoID0gc2VsZi5iYXNlV2lkdGg7XG4gICAgICAgIHNlbGYuc2NhbGVIZWlnaHQgPSBzZWxmLmJhc2VIZWlnaHQ7XG5cbiAgICAgICAgc2VsZi51cGRhdGVDYW52YXMoKTtcblxuICAgICAgICBpc0Z1bmN0aW9uKHNlbGYub25JbWFnZUxvYWQpICYmIHNlbGYub25JbWFnZUxvYWQoc2VsZi5jdHgsIHNlbGYpO1xuICAgICAgfVxuICAgIH0pO1xuXG4gICAgc2VsZi51cGRhdGUoKTtcbiAgICByZXR1cm4gc2VsZlxuICB9O1xuXG4gIHNlbGYuZ2V0Q3JvcHBlckJhc2U2NCA9IGZ1bmN0aW9uIChkb25lKSB7XG4gICAgaWYgKCBkb25lID09PSB2b2lkIDAgKSBkb25lID0gZnVuY3Rpb24gKCkge307XG5cbiAgICBDYW52YXNUb0Jhc2U2NC5jb252ZXJ0VG9CTVAoe1xuICAgICAgY2FudmFzSWQ6IGlkLFxuICAgICAgeDogeCxcbiAgICAgIHk6IHksXG4gICAgICB3aWR0aDogd2lkdGgsXG4gICAgICBoZWlnaHQ6IGhlaWdodFxuICAgIH0sIGRvbmUpO1xuICB9O1xuXG4gIHNlbGYuZ2V0Q3JvcHBlckltYWdlID0gZnVuY3Rpb24gKCkge1xuICAgIHZhciBhcmdzID0gW10sIGxlbiA9IGFyZ3VtZW50cy5sZW5ndGg7XG4gICAgd2hpbGUgKCBsZW4tLSApIGFyZ3NbIGxlbiBdID0gYXJndW1lbnRzWyBsZW4gXTtcblxuICAgIHZhciBBUkdfVFlQRSA9IHRvU3RyaW5nLmNhbGwoYXJnc1swXSk7XG4gICAgdmFyIGZuID0gYXJnc1thcmdzLmxlbmd0aCAtIDFdO1xuXG4gICAgc3dpdGNoIChBUkdfVFlQRSkge1xuICAgICAgY2FzZSAnW29iamVjdCBPYmplY3RdJzpcbiAgICAgICAgdmFyIHJlZiA9IGFyZ3NbMF07XG4gICAgdmFyIHF1YWxpdHkgPSByZWYucXVhbGl0eTsgaWYgKCBxdWFsaXR5ID09PSB2b2lkIDAgKSBxdWFsaXR5ID0gMTA7XG5cbiAgICAgICAgaWYgKHR5cGVvZiAocXVhbGl0eSkgIT09ICdudW1iZXInKSB7XG4gICAgICAgICAgY29uc29sZS5lcnJvcigoXCJxdWFsaXR577yaXCIgKyBxdWFsaXR5ICsgXCIgaXMgaW52YWxpZFwiKSk7XG4gICAgICAgIH0gZWxzZSBpZiAocXVhbGl0eSA8IDAgfHwgcXVhbGl0eSA+IDEwKSB7XG4gICAgICAgICAgY29uc29sZS5lcnJvcihcInF1YWxpdHkgc2hvdWxkIGJlIHJhbmdlZCBpbiAwIH4gMTBcIik7XG4gICAgICAgIH1cbiAgICAgICAgd3guY2FudmFzVG9UZW1wRmlsZVBhdGgoe1xuICAgICAgICAgIGNhbnZhc0lkOiBpZCxcbiAgICAgICAgICB4OiB4LFxuICAgICAgICAgIHk6IHksXG4gICAgICAgICAgd2lkdGg6IHdpZHRoLFxuICAgICAgICAgIGhlaWdodDogaGVpZ2h0LFxuICAgICAgICAgIGRlc3RXaWR0aDogd2lkdGggKiBxdWFsaXR5IC8gKGRldmljZVJhZGlvICogMTApLFxuICAgICAgICAgIGRlc3RIZWlnaHQ6IGhlaWdodCAqIHF1YWxpdHkgLyAoZGV2aWNlUmFkaW8gKiAxMCksXG4gICAgICAgICAgc3VjY2VzczogZnVuY3Rpb24gc3VjY2VzcyAocmVzKSB7XG4gICAgICAgICAgICBpc0Z1bmN0aW9uKGZuKSAmJiBmbi5jYWxsKHNlbGYsIHJlcy50ZW1wRmlsZVBhdGgpO1xuICAgICAgICAgIH0sXG4gICAgICAgICAgZmFpbDogZnVuY3Rpb24gZmFpbCAocmVzKSB7XG4gICAgICAgICAgICBpc0Z1bmN0aW9uKGZuKSAmJiBmbi5jYWxsKHNlbGYsIG51bGwpO1xuICAgICAgICAgIH1cbiAgICAgICAgfSk7IGJyZWFrXG4gICAgICBjYXNlICdbb2JqZWN0IEZ1bmN0aW9uXSc6XG4gICAgICAgIHd4LmNhbnZhc1RvVGVtcEZpbGVQYXRoKHtcbiAgICAgICAgICBjYW52YXNJZDogaWQsXG4gICAgICAgICAgeDogeCxcbiAgICAgICAgICB5OiB5LFxuICAgICAgICAgIHdpZHRoOiB3aWR0aCxcbiAgICAgICAgICBoZWlnaHQ6IGhlaWdodCxcbiAgICAgICAgICBkZXN0V2lkdGg6IHdpZHRoIC8gZGV2aWNlUmFkaW8sXG4gICAgICAgICAgZGVzdEhlaWdodDogaGVpZ2h0IC8gZGV2aWNlUmFkaW8sXG4gICAgICAgICAgc3VjY2VzczogZnVuY3Rpb24gc3VjY2VzcyAocmVzKSB7XG4gICAgICAgICAgICBpc0Z1bmN0aW9uKGZuKSAmJiBmbi5jYWxsKHNlbGYsIHJlcy50ZW1wRmlsZVBhdGgpO1xuICAgICAgICAgIH0sXG4gICAgICAgICAgZmFpbDogZnVuY3Rpb24gZmFpbCAocmVzKSB7XG4gICAgICAgICAgICBpc0Z1bmN0aW9uKGZuKSAmJiBmbi5jYWxsKHNlbGYsIG51bGwpO1xuICAgICAgICAgIH1cbiAgICAgICAgfSk7IGJyZWFrXG4gICAgfVxuXG4gICAgcmV0dXJuIHNlbGZcbiAgfTtcbn1cblxuLyoqXG4gKiDojrflj5bmnIDmlrDnvKnmlL7lgLxcbiAqIEBwYXJhbSBvbGRTY2FsZSDkuIrkuIDmrKHop6bmkbjnu5PmnZ/lkI7nmoTnvKnmlL7lgLxcbiAqIEBwYXJhbSBvbGREaXN0YW5jZSDkuIrkuIDmrKHop6bmkbjnu5PmnZ/lkI7nmoTlj4zmjIfot53nprtcbiAqIEBwYXJhbSB6b29tIOe8qeaUvuezu+aVsFxuICogQHBhcmFtIHRvdWNoMCDnrKzkuIDmjId0b3VjaOWvueixoVxuICogQHBhcmFtIHRvdWNoMSDnrKzkuozmjId0b3VjaOWvueixoVxuICogQHJldHVybnMgeyp9XG4gKi9cbnZhciBnZXROZXdTY2FsZSA9IGZ1bmN0aW9uIChvbGRTY2FsZSwgb2xkRGlzdGFuY2UsIHpvb20sIHRvdWNoMCwgdG91Y2gxKSB7XG4gIHZhciB4TW92ZSwgeU1vdmUsIG5ld0Rpc3RhbmNlO1xuICAvLyDorqHnrpfkuozmjIfmnIDmlrDot53nprtcbiAgeE1vdmUgPSBNYXRoLnJvdW5kKHRvdWNoMS54IC0gdG91Y2gwLngpO1xuICB5TW92ZSA9IE1hdGgucm91bmQodG91Y2gxLnkgLSB0b3VjaDAueSk7XG4gIG5ld0Rpc3RhbmNlID0gTWF0aC5yb3VuZChNYXRoLnNxcnQoeE1vdmUgKiB4TW92ZSArIHlNb3ZlICogeU1vdmUpKTtcblxuICByZXR1cm4gb2xkU2NhbGUgKyAwLjAwMSAqIHpvb20gKiAobmV3RGlzdGFuY2UgLSBvbGREaXN0YW5jZSlcbn07XG5cbmZ1bmN0aW9uIHVwZGF0ZSAoKSB7XG4gIHZhciBzZWxmID0gdGhpcztcblxuICBpZiAoIXNlbGYuc3JjKSB7IHJldHVybiB9XG5cbiAgc2VsZi5fX29uZVRvdWNoU3RhcnQgPSBmdW5jdGlvbiAodG91Y2gpIHtcbiAgICBzZWxmLnRvdWNoWDAgPSBNYXRoLnJvdW5kKHRvdWNoLngpO1xuICAgIHNlbGYudG91Y2hZMCA9IE1hdGgucm91bmQodG91Y2gueSk7XG4gIH07XG5cbiAgc2VsZi5fX29uZVRvdWNoTW92ZSA9IGZ1bmN0aW9uICh0b3VjaCkge1xuICAgIHZhciB4TW92ZSwgeU1vdmU7XG4gICAgLy8g6K6h566X5Y2V5oyH56e75Yqo55qE6Led56a7XG4gICAgaWYgKHNlbGYudG91Y2hlbmRlZCkge1xuICAgICAgcmV0dXJuIHNlbGYudXBkYXRlQ2FudmFzKClcbiAgICB9XG4gICAgeE1vdmUgPSBNYXRoLnJvdW5kKHRvdWNoLnggLSBzZWxmLnRvdWNoWDApO1xuICAgIHlNb3ZlID0gTWF0aC5yb3VuZCh0b3VjaC55IC0gc2VsZi50b3VjaFkwKTtcblxuICAgIHZhciBpbWdMZWZ0ID0gTWF0aC5yb3VuZChzZWxmLnJlY3RYICsgeE1vdmUpO1xuICAgIHZhciBpbWdUb3AgPSBNYXRoLnJvdW5kKHNlbGYucmVjdFkgKyB5TW92ZSk7XG5cbiAgICBzZWxmLm91dHNpZGVCb3VuZChpbWdMZWZ0LCBpbWdUb3ApO1xuXG4gICAgc2VsZi51cGRhdGVDYW52YXMoKTtcbiAgfTtcblxuICBzZWxmLl9fdHdvVG91Y2hTdGFydCA9IGZ1bmN0aW9uICh0b3VjaDAsIHRvdWNoMSkge1xuICAgIHZhciB4TW92ZSwgeU1vdmUsIG9sZERpc3RhbmNlO1xuXG4gICAgc2VsZi50b3VjaFgxID0gTWF0aC5yb3VuZChzZWxmLnJlY3RYICsgc2VsZi5zY2FsZVdpZHRoIC8gMik7XG4gICAgc2VsZi50b3VjaFkxID0gTWF0aC5yb3VuZChzZWxmLnJlY3RZICsgc2VsZi5zY2FsZUhlaWdodCAvIDIpO1xuXG4gICAgLy8g6K6h566X5Lik5oyH6Led56a7XG4gICAgeE1vdmUgPSBNYXRoLnJvdW5kKHRvdWNoMS54IC0gdG91Y2gwLngpO1xuICAgIHlNb3ZlID0gTWF0aC5yb3VuZCh0b3VjaDEueSAtIHRvdWNoMC55KTtcbiAgICBvbGREaXN0YW5jZSA9IE1hdGgucm91bmQoTWF0aC5zcXJ0KHhNb3ZlICogeE1vdmUgKyB5TW92ZSAqIHlNb3ZlKSk7XG5cbiAgICBzZWxmLm9sZERpc3RhbmNlID0gb2xkRGlzdGFuY2U7XG4gIH07XG5cbiAgc2VsZi5fX3R3b1RvdWNoTW92ZSA9IGZ1bmN0aW9uICh0b3VjaDAsIHRvdWNoMSkge1xuICAgIHZhciBvbGRTY2FsZSA9IHNlbGYub2xkU2NhbGU7XG4gICAgdmFyIG9sZERpc3RhbmNlID0gc2VsZi5vbGREaXN0YW5jZTtcbiAgICB2YXIgc2NhbGUgPSBzZWxmLnNjYWxlO1xuICAgIHZhciB6b29tID0gc2VsZi56b29tO1xuXG4gICAgc2VsZi5uZXdTY2FsZSA9IGdldE5ld1NjYWxlKG9sZFNjYWxlLCBvbGREaXN0YW5jZSwgem9vbSwgdG91Y2gwLCB0b3VjaDEpO1xuXG4gICAgLy8gIOiuvuWumue8qeaUvuiMg+WbtFxuICAgIHNlbGYubmV3U2NhbGUgPD0gMSAmJiAoc2VsZi5uZXdTY2FsZSA9IDEpO1xuICAgIHNlbGYubmV3U2NhbGUgPj0gc2NhbGUgJiYgKHNlbGYubmV3U2NhbGUgPSBzY2FsZSk7XG5cbiAgICBzZWxmLnNjYWxlV2lkdGggPSBNYXRoLnJvdW5kKHNlbGYubmV3U2NhbGUgKiBzZWxmLmJhc2VXaWR0aCk7XG4gICAgc2VsZi5zY2FsZUhlaWdodCA9IE1hdGgucm91bmQoc2VsZi5uZXdTY2FsZSAqIHNlbGYuYmFzZUhlaWdodCk7XG4gICAgdmFyIGltZ0xlZnQgPSBNYXRoLnJvdW5kKHNlbGYudG91Y2hYMSAtIHNlbGYuc2NhbGVXaWR0aCAvIDIpO1xuICAgIHZhciBpbWdUb3AgPSBNYXRoLnJvdW5kKHNlbGYudG91Y2hZMSAtIHNlbGYuc2NhbGVIZWlnaHQgLyAyKTtcblxuICAgIHNlbGYub3V0c2lkZUJvdW5kKGltZ0xlZnQsIGltZ1RvcCk7XG5cbiAgICBzZWxmLnVwZGF0ZUNhbnZhcygpO1xuICB9O1xuXG4gIHNlbGYuX194dG91Y2hFbmQgPSBmdW5jdGlvbiAoKSB7XG4gICAgc2VsZi5vbGRTY2FsZSA9IHNlbGYubmV3U2NhbGU7XG4gICAgc2VsZi5yZWN0WCA9IHNlbGYuaW1nTGVmdDtcbiAgICBzZWxmLnJlY3RZID0gc2VsZi5pbWdUb3A7XG4gIH07XG59XG5cbnZhciBoYW5kbGUgPSB7XG4gIC8vICDlm77niYfmiYvlir/liJ3lp4vnm5HmtYtcbiAgdG91Y2hTdGFydDogZnVuY3Rpb24gdG91Y2hTdGFydCAoZSkge1xuICAgIHZhciBzZWxmID0gdGhpcztcbiAgICB2YXIgcmVmID0gZS50b3VjaGVzO1xuICAgIHZhciB0b3VjaDAgPSByZWZbMF07XG4gICAgdmFyIHRvdWNoMSA9IHJlZlsxXTtcblxuICAgIHNldFRvdWNoU3RhdGUoc2VsZiwgdHJ1ZSwgbnVsbCwgbnVsbCk7XG5cbiAgICAvLyDorqHnrpfnrKzkuIDkuKrop6bmkbjngrnnmoTkvY3nva7vvIzlubblj4LnhafmlLnngrnov5vooYznvKnmlL5cbiAgICBzZWxmLl9fb25lVG91Y2hTdGFydCh0b3VjaDApO1xuXG4gICAgLy8g5Lik5oyH5omL5Yq/6Kem5Y+RXG4gICAgaWYgKGUudG91Y2hlcy5sZW5ndGggPj0gMikge1xuICAgICAgc2VsZi5fX3R3b1RvdWNoU3RhcnQodG91Y2gwLCB0b3VjaDEpO1xuICAgIH1cbiAgfSxcblxuICAvLyAg5Zu+54mH5omL5Yq/5Yqo5oCB57yp5pS+XG4gIHRvdWNoTW92ZTogZnVuY3Rpb24gdG91Y2hNb3ZlIChlKSB7XG4gICAgdmFyIHNlbGYgPSB0aGlzO1xuICAgIHZhciByZWYgPSBlLnRvdWNoZXM7XG4gICAgdmFyIHRvdWNoMCA9IHJlZlswXTtcbiAgICB2YXIgdG91Y2gxID0gcmVmWzFdO1xuXG4gICAgc2V0VG91Y2hTdGF0ZShzZWxmLCBudWxsLCB0cnVlKTtcblxuICAgIC8vIOWNleaMh+aJi+WKv+aXtuinpuWPkVxuICAgIGlmIChlLnRvdWNoZXMubGVuZ3RoID09PSAxKSB7XG4gICAgICBzZWxmLl9fb25lVG91Y2hNb3ZlKHRvdWNoMCk7XG4gICAgfVxuICAgIC8vIOS4pOaMh+aJi+WKv+inpuWPkVxuICAgIGlmIChlLnRvdWNoZXMubGVuZ3RoID49IDIpIHtcbiAgICAgIHNlbGYuX190d29Ub3VjaE1vdmUodG91Y2gwLCB0b3VjaDEpO1xuICAgIH1cbiAgfSxcblxuICB0b3VjaEVuZDogZnVuY3Rpb24gdG91Y2hFbmQgKGUpIHtcbiAgICB2YXIgc2VsZiA9IHRoaXM7XG5cbiAgICBzZXRUb3VjaFN0YXRlKHNlbGYsIGZhbHNlLCBmYWxzZSwgdHJ1ZSk7XG4gICAgc2VsZi5fX3h0b3VjaEVuZCgpO1xuICB9XG59O1xuXG5mdW5jdGlvbiBjdXQgKCkge1xuICB2YXIgc2VsZiA9IHRoaXM7XG4gIHZhciBib3VuZFdpZHRoID0gc2VsZi53aWR0aDsgLy8g6KOB5Ymq5qGG6buY6K6k5a695bqm77yM5Y2z5pW05Liq55S75biD5a695bqmXG4gIHZhciBib3VuZEhlaWdodCA9IHNlbGYuaGVpZ2h0O1xuICAvLyDoo4HliarmoYbpu5jorqTpq5jluqbvvIzljbPmlbTkuKrnlLvluIPpq5jluqZcbiAgdmFyIHJlZiA9IHNlbGYuY3V0O1xuICB2YXIgeCA9IHJlZi54OyBpZiAoIHggPT09IHZvaWQgMCApIHggPSAwO1xuICB2YXIgeSA9IHJlZi55OyBpZiAoIHkgPT09IHZvaWQgMCApIHkgPSAwO1xuICB2YXIgd2lkdGggPSByZWYud2lkdGg7IGlmICggd2lkdGggPT09IHZvaWQgMCApIHdpZHRoID0gYm91bmRXaWR0aDtcbiAgdmFyIGhlaWdodCA9IHJlZi5oZWlnaHQ7IGlmICggaGVpZ2h0ID09PSB2b2lkIDAgKSBoZWlnaHQgPSBib3VuZEhlaWdodDtcblxuICAvKipcblx0ICog6K6+572u6L6555WMXG5cdCAqIEBwYXJhbSBpbWdMZWZ0IOWbvueJh+W3puS4iuinkuaoquWdkOagh+WAvFxuXHQgKiBAcGFyYW0gaW1nVG9wIOWbvueJh+W3puS4iuinkue6teWdkOagh+WAvFxuXHQgKi9cbiAgc2VsZi5vdXRzaWRlQm91bmQgPSBmdW5jdGlvbiAoaW1nTGVmdCwgaW1nVG9wKSB7XG4gICAgc2VsZi5pbWdMZWZ0ID0gaW1nTGVmdCA+PSB4XG4gICAgICA/IHhcbiAgICAgIDogc2VsZi5zY2FsZVdpZHRoICsgaW1nTGVmdCAtIHggPD0gd2lkdGhcbiAgICAgICAgPyB4ICsgd2lkdGggLSBzZWxmLnNjYWxlV2lkdGhcbiAgICAgICAgOlx0aW1nTGVmdDtcblxuICAgIHNlbGYuaW1nVG9wID0gaW1nVG9wID49IHlcbiAgICAgID8geVxuICAgICAgOiBzZWxmLnNjYWxlSGVpZ2h0ICsgaW1nVG9wIC0geSA8PSBoZWlnaHRcbiAgICAgICAgPyB5ICsgaGVpZ2h0IC0gc2VsZi5zY2FsZUhlaWdodFxuICAgICAgICA6IGltZ1RvcDtcbiAgfTtcblxuICAvKipcblx0ICog6K6+572u6L6555WM5qC35byPXG5cdCAqIEBwYXJhbSBjb2xvclx06L6555WM6aKc6ImyXG5cdCAqL1xuICBzZWxmLnNldEJvdW5kU3R5bGUgPSBmdW5jdGlvbiAocmVmKSB7XG4gICAgaWYgKCByZWYgPT09IHZvaWQgMCApIHJlZiA9IHt9O1xuICAgIHZhciBjb2xvciA9IHJlZi5jb2xvcjsgaWYgKCBjb2xvciA9PT0gdm9pZCAwICkgY29sb3IgPSAnIzA0YjAwZic7XG4gICAgdmFyIG1hc2sgPSByZWYubWFzazsgaWYgKCBtYXNrID09PSB2b2lkIDAgKSBtYXNrID0gJ3JnYmEoMCwgMCwgMCwgMC4zKSc7XG4gICAgdmFyIGxpbmVXaWR0aCA9IHJlZi5saW5lV2lkdGg7IGlmICggbGluZVdpZHRoID09PSB2b2lkIDAgKSBsaW5lV2lkdGggPSAxO1xuXG4gICAgdmFyIGJvdW5kT3B0aW9uID0gW1xuICAgICAge1xuICAgICAgICBzdGFydDogeyB4OiB4IC0gbGluZVdpZHRoLCB5OiB5ICsgMTAgLSBsaW5lV2lkdGggfSxcbiAgICAgICAgc3RlcDE6IHsgeDogeCAtIGxpbmVXaWR0aCwgeTogeSAtIGxpbmVXaWR0aCB9LFxuICAgICAgICBzdGVwMjogeyB4OiB4ICsgMTAgLSBsaW5lV2lkdGgsIHk6IHkgLSBsaW5lV2lkdGggfVxuICAgICAgfSxcbiAgICAgIHtcbiAgICAgICAgc3RhcnQ6IHsgeDogeCAtIGxpbmVXaWR0aCwgeTogeSArIGhlaWdodCAtIDEwICsgbGluZVdpZHRoIH0sXG4gICAgICAgIHN0ZXAxOiB7IHg6IHggLSBsaW5lV2lkdGgsIHk6IHkgKyBoZWlnaHQgKyBsaW5lV2lkdGggfSxcbiAgICAgICAgc3RlcDI6IHsgeDogeCArIDEwIC0gbGluZVdpZHRoLCB5OiB5ICsgaGVpZ2h0ICsgbGluZVdpZHRoIH1cbiAgICAgIH0sXG4gICAgICB7XG4gICAgICAgIHN0YXJ0OiB7IHg6IHggKyB3aWR0aCAtIDEwICsgbGluZVdpZHRoLCB5OiB5IC0gbGluZVdpZHRoIH0sXG4gICAgICAgIHN0ZXAxOiB7IHg6IHggKyB3aWR0aCArIGxpbmVXaWR0aCwgeTogeSAtIGxpbmVXaWR0aCB9LFxuICAgICAgICBzdGVwMjogeyB4OiB4ICsgd2lkdGggKyBsaW5lV2lkdGgsIHk6IHkgKyAxMCAtIGxpbmVXaWR0aCB9XG4gICAgICB9LFxuICAgICAge1xuICAgICAgICBzdGFydDogeyB4OiB4ICsgd2lkdGggKyBsaW5lV2lkdGgsIHk6IHkgKyBoZWlnaHQgLSAxMCArIGxpbmVXaWR0aCB9LFxuICAgICAgICBzdGVwMTogeyB4OiB4ICsgd2lkdGggKyBsaW5lV2lkdGgsIHk6IHkgKyBoZWlnaHQgKyBsaW5lV2lkdGggfSxcbiAgICAgICAgc3RlcDI6IHsgeDogeCArIHdpZHRoIC0gMTAgKyBsaW5lV2lkdGgsIHk6IHkgKyBoZWlnaHQgKyBsaW5lV2lkdGggfVxuICAgICAgfVxuICAgIF07XG5cbiAgICAvLyDnu5jliLbljYrpgI/mmI7lsYJcbiAgICBzZWxmLmN0eC5iZWdpblBhdGgoKTtcbiAgICBzZWxmLmN0eC5zZXRGaWxsU3R5bGUobWFzayk7XG4gICAgc2VsZi5jdHguZmlsbFJlY3QoMCwgMCwgeCwgYm91bmRIZWlnaHQpO1xuICAgIHNlbGYuY3R4LmZpbGxSZWN0KHgsIDAsIHdpZHRoLCB5KTtcbiAgICBzZWxmLmN0eC5maWxsUmVjdCh4LCB5ICsgaGVpZ2h0LCB3aWR0aCwgYm91bmRIZWlnaHQgLSB5IC0gaGVpZ2h0KTtcbiAgICBzZWxmLmN0eC5maWxsUmVjdCh4ICsgd2lkdGgsIDAsIGJvdW5kV2lkdGggLSB4IC0gd2lkdGgsIGJvdW5kSGVpZ2h0KTtcbiAgICBzZWxmLmN0eC5maWxsKCk7XG5cbiAgICBib3VuZE9wdGlvbi5mb3JFYWNoKGZ1bmN0aW9uIChvcCkge1xuICAgICAgc2VsZi5jdHguYmVnaW5QYXRoKCk7XG4gICAgICBzZWxmLmN0eC5zZXRTdHJva2VTdHlsZShjb2xvcik7XG4gICAgICBzZWxmLmN0eC5zZXRMaW5lV2lkdGgobGluZVdpZHRoKTtcbiAgICAgIHNlbGYuY3R4Lm1vdmVUbyhvcC5zdGFydC54LCBvcC5zdGFydC55KTtcbiAgICAgIHNlbGYuY3R4LmxpbmVUbyhvcC5zdGVwMS54LCBvcC5zdGVwMS55KTtcbiAgICAgIHNlbGYuY3R4LmxpbmVUbyhvcC5zdGVwMi54LCBvcC5zdGVwMi55KTtcbiAgICAgIHNlbGYuY3R4LnN0cm9rZSgpO1xuICAgIH0pO1xuICB9O1xufVxuXG52YXIgdmVyc2lvbiA9IFwiMS4yLjBcIjtcblxudmFyIHdlQ3JvcHBlciA9IGZ1bmN0aW9uIHdlQ3JvcHBlciAocGFyYW1zKSB7XG4gIHZhciBzZWxmID0gdGhpcztcbiAgdmFyIF9kZWZhdWx0ID0ge307XG5cbiAgdmFsaWRhdG9yKHNlbGYsIERFRkFVTFQpO1xuXG4gIE9iamVjdC5rZXlzKERFRkFVTFQpLmZvckVhY2goZnVuY3Rpb24gKGtleSkge1xuICAgIF9kZWZhdWx0W2tleV0gPSBERUZBVUxUW2tleV0uZGVmYXVsdDtcbiAgfSk7XG4gIE9iamVjdC5hc3NpZ24oc2VsZiwgX2RlZmF1bHQsIHBhcmFtcyk7XG5cbiAgc2VsZi5wcmVwYXJlKCk7XG4gIHNlbGYuYXR0YWNoUGFnZSgpO1xuICBzZWxmLmNyZWF0ZUN0eCgpO1xuICBzZWxmLm9ic2VydmVyKCk7XG4gIHNlbGYuY3V0dCgpO1xuICBzZWxmLm1ldGhvZHMoKTtcbiAgc2VsZi5pbml0KCk7XG4gIHNlbGYudXBkYXRlKCk7XG5cbiAgcmV0dXJuIHNlbGZcbn07XG5cbndlQ3JvcHBlci5wcm90b3R5cGUuaW5pdCA9IGZ1bmN0aW9uIGluaXQgKCkge1xuICB2YXIgc2VsZiA9IHRoaXM7XG4gIHZhciBzcmMgPSBzZWxmLnNyYztcblxuICBzZWxmLnZlcnNpb24gPSB2ZXJzaW9uO1xuXG4gIHR5cGVvZiBzZWxmLm9uUmVhZHkgPT09ICdmdW5jdGlvbicgJiYgc2VsZi5vblJlYWR5KHNlbGYuY3R4LCBzZWxmKTtcblxuICBpZiAoc3JjKSB7XG4gICAgc2VsZi5wdXNoT3JpZ24oc3JjKTtcbiAgfVxuICBzZXRUb3VjaFN0YXRlKHNlbGYsIGZhbHNlLCBmYWxzZSwgZmFsc2UpO1xuXG4gIHNlbGYub2xkU2NhbGUgPSAxO1xuICBzZWxmLm5ld1NjYWxlID0gMTtcblxuICByZXR1cm4gc2VsZlxufTtcblxuT2JqZWN0LmFzc2lnbih3ZUNyb3BwZXIucHJvdG90eXBlLCBoYW5kbGUpO1xuXG53ZUNyb3BwZXIucHJvdG90eXBlLnByZXBhcmUgPSBwcmVwYXJlO1xud2VDcm9wcGVyLnByb3RvdHlwZS5vYnNlcnZlciA9IG9ic2VydmVyO1xud2VDcm9wcGVyLnByb3RvdHlwZS5tZXRob2RzID0gbWV0aG9kcztcbndlQ3JvcHBlci5wcm90b3R5cGUuY3V0dCA9IGN1dDtcbndlQ3JvcHBlci5wcm90b3R5cGUudXBkYXRlID0gdXBkYXRlO1xuXG5yZXR1cm4gd2VDcm9wcGVyO1xuXG59KSkpO1xuIl19