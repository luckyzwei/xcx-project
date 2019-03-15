const utils = require('../../utils/util.js')

import {
  uploadFile
} from "../../utils/api.js"

let screenHeight = 667
let screenWidth = 375
let navigationHeight = 64
wx.getSystemInfo({
  success: function (res) { 
    screenHeight = res.screenHeight;
    screenWidth = res.screenWidth;
    navigationHeight = res.statusBarHeight == 44 ? 88 : 64

     },
})

Page({

  /**
   * 页面的初始数据
   */
  data: {
    navigationHeight: '64px',
    canvasImage:"",
    enableChange:true,
    url:'',
    width:375,
    height:667
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    
    this.setData({ url: options.url, width: screenWidth * 0.9, height: options.height / options.width * screenWidth * 0.9},()=>{
var that = this
      var context = wx.createCanvasContext("canvas", this)
      wx.getImageInfo({
        src: that.data.url,
        success(res) {
          context.drawImage(res.path, 0, 0, that.data.width, that.data.height);
          context.draw()

          // console.log(screenHeight, navigationHeight, options.width, screenWidth)
          // console.log(options)
          // console.log(screenWidth + '   ' + screenHeight)
          // console.log(that.data.width + '   ' + that.data.height)
        }
      })
      
    })

    
  },

  onPageScroll:function(e) {
    if(this.data.enableChange) return false;
    if(e.scrollTop <= 0) {
      wx.pageScrollTo({
        scrollTop: 0,
      })
    }
    
    if (e.scrollTop > this.data.height + navigationHeight - screenHeight + '100rpx') {
      wx.pageScrollTo({
        scrollTop: this.data.height + navigationHeight - screenHeight + '100rpx',
        duration:0
      })
    }
    
  },

  submitAction:function(e) {
    wx.canvasToTempFilePath({
      canvasId: 'canvas',
      quality:1.0,
      success(res) {
        let params = {
          query: res.tempFilePath
        }
        
        uploadFile(params).then(res => {
          console.log(res)
          let result = JSON.parse(res)
          
          wx.setStorage({
            key: 'mergeImage',
            data: result.resultContent.url,
            success(res) {
              wx.navigateBack({
                delta:1
              })
            }
          })
          
        })
      }
    }, this)
  },
  

  changeAction:function(){
    wx.getSystemInfo({
      success: function(res) {console.log(res)},
    })
    this.setData({enableChange:!this.data.enableChange})
  },

  startAction:function(e) {
    if (this.data.enableChange) return

    var that = this
    var r = 30;
    wx.canvasGetImageData({
      canvasId: 'canvas',
      x: e.changedTouches[0].x - r / 2,
      y: e.changedTouches[0].y - r / 2,
      width: 2 * r,
      height: 2 * r,
      success: (res) => {
        var data = res.data
        var w = res.width;
        var h = res.height;
        //马赛克的程度，数字越大越模糊
        var num = 5;
        //等分画布
        var stepW = w / num;
        var stepH = h / num;
        //这里是循环画布的像素点
        for (var i = 0; i < stepH; i++) {
          for (var j = 0; j < stepW; j++) {
            if (((i * num) ^ 2 + (j * num) ^ 2))

              //获取一个小方格的随机颜色，这是小方格的随机位置获取的
              var obj = { "width": res.width, "height": res.height, "data": res.data }
            if (!obj) continue;
            var color = that.getXY(obj, j * num + Math.floor(Math.random() * num), i * num + Math.floor(Math.random() * num));
            //这里是循环小方格的像素点，
            for (var k = 0; k < num; k++) {
              for (var l = 0; l < num; l++) {
                //设置小方格的颜色
                that.setXY(obj, j * num + l, i * num + k, color);
              }
            }
          }
        }
        wx.canvasPutImageData({
          canvasId: 'canvas',
          data: data,
          x: e.changedTouches[0].x - r / 2,
          y: e.changedTouches[0].y - r / 2,
          width: 2 * r,
          height: 2 * r,
          success: (res) => {
            
          }
        })
      }
    })
  },


  moveAction:function(e) {
    if (this.data.enableChange) return

    var that = this
    var r = 30;
    wx.canvasGetImageData({
      canvasId: 'canvas',
      x: e.changedTouches[0].x - r / 2,
      y: e.changedTouches[0].y - r / 2,
      width: 2 * r,
      height: 2 * r,
      success: (res) => {
        var data = res.data
        var w = res.width;
        var h = res.height;
        //马赛克的程度，数字越大越模糊
        var num = 5;
        //等分画布
        var stepW = w / num;
        var stepH = h / num;
        //这里是循环画布的像素点
        for (var i = 0; i < stepH; i++) {
          for (var j = 0; j < stepW; j++) {
            if (((i * num) ^ 2 + (j * num) ^ 2))

              //获取一个小方格的随机颜色，这是小方格的随机位置获取的
              var obj = { "width": res.width, "height": res.height, "data": res.data }
              if(!obj) continue;
            var color = that.getXY(obj, j * num + Math.floor(Math.random() * num), i * num + Math.floor(Math.random() * num));
            //这里是循环小方格的像素点，
            for (var k = 0; k < num; k++) {
              for (var l = 0; l < num; l++) {
                //设置小方格的颜色
                that.setXY(obj, j * num + l, i * num + k, color);
              }
            }
          }
        }
        wx.canvasPutImageData({
          canvasId: 'canvas',
          data: data,
          x: e.changedTouches[0].x - r / 2,
          y: e.changedTouches[0].y - r / 2,
          width: 2 * r,
          height: 2 * r,
          success: (res) => {
            console.log(res)

          }
        })
      }
    })
  },


  getXY:function(obj, x, y){
    
    var w = obj.width;
    var h = obj.height;
    var d = obj.data;
    var color = [];
    color[0] = obj.data[4 * (y * w + x)];
    color[1] = obj.data[4 * (y * w + x) + 1];
    color[2] = obj.data[4 * (y * w + x) + 2];
    color[3] = obj.data[4 * (y * w + x) + 3];
    return color;
  },
        
  setXY:function(obj, x, y, color) {
    var w = obj.width;
    var h = obj.height;
    var d = obj.data;
    obj.data[4 * (y * w + x)] = color[0];
    obj.data[4 * (y * w + x) + 1] = color[1];
    obj.data[4 * (y * w + x) + 2] = color[2];
    obj.data[4 * (y * w + x) + 3] = color[3];
  },

  backAction: function () {
    
    wx.navigateBack({
      delta: 1,
    })
  },

  
  onShow: function () {
    var that = this;
    wx.getSystemInfo({
      success: function (res) {
        if (res.model.indexOf('iPhone X') != -1 || res.model.indexOf('unknown') != -1) {
          that.setData({
            navigationHeight: '88px'
          })
        }
      },
    })
  }
})