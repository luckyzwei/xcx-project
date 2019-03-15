import {
  getQRcode
} from "../../utils/api.js"

let screenHeight = 1334
let screenWidth = 750
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
    url:'',
    width:0,
    height:0,
    canvasHeight:900,
    author:{
      "name":"",
      "logo":"",
      "date":""
    },
    title:"",
    id:"",
    qrCode:'',
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(options)
    
    var that = this
    if(!options.url || !options.width || !options.height) {
      this.setData({
        author: { "name": options.name, "logo": options.logo, "date": options.date }, title: options.title, id: options.id, canvasHeight: 900 * screenHeight / 667,
      }, () => {
        let getQRcodeParams = {
          scene: that.data.id
        }

        getQRcode(getQRcodeParams).then(res => {

          that.setData({ qrCode: res.resultContent }, () => {
            that.canvasAction(that);
          })


        })


      })
    }else {
      this.setData({
        url: options.url, 
        width: screenWidth - 40, 
        height: options.height * (screenWidth - 40) / options.width,
        canvasHeight: options.height * (screenWidth - 40) * 1334 / (options.width * screenHeight)+900 * screenHeight / 667,
        author:{"name":options.name,"logo":options.logo,"date":options.date},
        title:options.title,id:options.id},
        ()=>{

        let getQRcodeParams = {
          scene:that.data.id
        }
        
        getQRcode(getQRcodeParams).then(res => {

          that.setData({qrCode:res.resultContent},()=>{
            that.canvasAction(that);
          })
          

        })

        
      })
    }
    
  },

  canvasAction:function(that){
    
    
    let canvas = "canvas"
    var context = wx.createCanvasContext(canvas, that)

    context.save();
    context.setFillStyle('#FED93B')
    context.fillRect(0, 0, screenWidth, (that.data.canvasHeight) * screenHeight / 1334)
    context.restore();

    context.save();
    context.setFillStyle('white')
    context.fillRect(20 * screenWidth / 750, 50 * screenHeight / 1334, 710 * screenWidth / 750, (that.data.canvasHeight - 144 * screenHeight / 667) * screenHeight / 1334)
    context.restore();

    wx.downloadFile({
      url: that.data.author.logo,
      success: (res) => {
        

        let userLogo = res.tempFilePath

        context.save();
        var d = 2 * 30;
        var cx = 20 + 30;
        var cy = 54 + 30;
        context.arc(cx, cy, 30, 0, 2 * Math.PI);
        context.clip();
        context.drawImage(userLogo, 20 * screenWidth / 375, 54 * screenHeight / 667, d, d);
        context.restore();

        context.save();
        context.setFillStyle('#000000');
        context.setFontSize(18);
        context.setTextAlign('left');
        context.fillText(that.data.author.name.substr(0, 14), 96 * screenWidth / 375, 76 * screenHeight / 667);
        context.restore();

        context.save();
        context.setFillStyle('#b2b2b2');
        context.setFontSize(16);
        context.setTextAlign('left');
        context.fillText(that.data.author.date, 96 * screenWidth / 375, 108 * screenHeight / 667);
        context.restore();

        context.save();
        context.setFillStyle('#000000');
        context.setFontSize(22);
        context.setTextAlign('left');
        context.fillText(that.data.title.substr(0, 15), 20 * screenWidth / 375, 160 * screenHeight / 667);
        context.restore();

        context.save();
        context.setFillStyle('#000000');
        context.setFontSize(22);
        context.setTextAlign('left');
        context.fillText(that.data.title.substr(15, 15), 20 * screenWidth / 375, 190 * screenHeight / 667);
        context.restore();

        if(that.data.url.length != 0) {
          wx.downloadFile({
            url: that.data.url,
            success: (res) => {
              
              context.drawImage(res.tempFilePath, 20 * screenWidth / 375, 220 * screenHeight / 667, that.data.width, that.data.height);

              wx.downloadFile({
                url: that.data.qrCode,
                success: (res) => {

                  context.drawImage(res.tempFilePath, (screenWidth - 200 * screenWidth / 750) / 2, 250 * screenHeight / 667 + that.data.height, 200 * screenWidth / 750, 200 * screenWidth / 750);

                  context.save();
                  context.setFillStyle('#000000');
                  context.setFontSize(17);
                  context.setTextAlign('left');
                  context.fillText("长按识别二维码查看", 230 * screenWidth / 750, 280 * screenHeight / 667 + that.data.height + 200 * screenWidth / 750);
                  context.restore();

                  context.drawImage('../../images/icon/pic_slogan.png', 215 * screenWidth / 750, 75 * screenHeight / 1334 + (that.data.canvasHeight - 144) * screenHeight / 1334 , 302 * screenWidth / 750, 34 * screenWidth / 750);

                  context.draw(false, () => {

                  })
                }
              })

              
            }
          })
        }else {
          wx.downloadFile({
            url: that.data.qrCode,
            success: (res) => {

              context.drawImage(res.tempFilePath, (screenWidth - 200 * screenWidth / 750) / 2, 250 * screenHeight / 667, 200 * screenWidth / 750, 200 * screenWidth / 750);

              context.save();
              context.setFillStyle('#000000');
              context.setFontSize(17);
              context.setTextAlign('left');
              context.fillText("长按识别二维码查看", 230 * screenWidth / 750, 280 * screenHeight / 667 + that.data.height + 200 * screenWidth / 750);
              context.restore();

              context.drawImage('../../images/icon/pic_slogan.png', 215 * screenWidth / 750, 75 * screenHeight / 1334 + (that.data.canvasHeight - 144) * screenHeight / 1334, 302 * screenWidth / 750, 34 * screenWidth / 750);

              context.draw(false, () => {

              })
            }
          })

        }

        


        
      }
    })

  },

  saveAction:function(){
    wx.canvasToTempFilePath({
      x: 0,
      y: 0,
      height: (this.data.canvasHeight) * screenHeight / 1334,
      canvasId: 'canvas',
      success: function (res) {
        wx.saveImageToPhotosAlbum({
          filePath: res.tempFilePath,
          success:function(res) {
            wx.showToast({
              title: '图片已存入相册',
            })
          }
        })
        
      }
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
    
  },
  backAction: function () {
    wx.navigateBack({
      delta: 1,
    })
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
  
  }
})