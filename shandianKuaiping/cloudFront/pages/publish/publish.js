import {
  getAccessToken
} from "../../utils/AuthProvider";
import {
  uploadFile,
  addArticle,
  mergePictures
} from "../../utils/api.js"
const app = getApp();

Page({

  /**
   * 页面的初始数据
   */
  data: {
    toast:'',
    
    showShadow:false,
    
    navigationHeight:'64px',
    imageList: [{ 'url': '', 'selected': false }, { 'url': '', 'selected': false }, { 'url': '', 'selected': false }, { 'url': '', 'selected': false }, { 'url': '', 'selected': false }, { 'url': '', 'selected': false }, { 'url': '', 'selected': false }, { 'url': '', 'selected': false }, { 'url': '', 'selected': false }],
    imageCount:0,
    changeEnable:true,//是否可以继续添加或删除
    title:'',
    content:'',
    stopPublish:false,
    anony: false, //匿名
  },

  onReady: function (options) {
    app.globalData.G_SDK.loaded('pages/publish/publish')
  },

  onLoad: function (options) {
    app.globalData.G_SDK.loading('pages/publish/publish')
    let title = wx.getStorageSync('title')

    let content = wx.getStorageSync('content')
    this.setData({
      
      title:title,
      content: content
    })

    
    var list = wx.getStorageSync('imagelist')
 
 
    this.setData({
      imageList: list ? list : this.data.imageList,
      imageCount: wx.getStorageSync('imagecount') ? wx.getStorageSync('imagecount') : 0,
      
    })
  },

  anonyAction: function () {
    this.setData({
      anony: !this.data.anony
    })
    if (this.data.anony) {
      wx.showToast({
        title: '已开启匿名',
        icon:'none'
      })
    }
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

    wx.getStorage({
      key: 'mergeImage',
      success: function(res) {
        let url = 'imageList[' + (that.data.imageCount) + '].url'
        that.setData({ [url]: wx.getStorageSync('mergeImage'), imageCount: that.data.imageCount + 1 },()=>{
          wx.removeStorageSync('mergeImage')
        })
      },
    })
  },

  backAction: function () {
    this.setData({ showAlert: false, showShadow: false })
    if (this.data.title.length != 0) wx.setStorageSync('title', this.data.title)
    else {
      wx.setStorageSync('title', "")
    }
    if (this.data.content.length != 0) wx.setStorageSync('content', this.data.content)
    else {
      wx.setStorageSync('content', "")
    }
    if (this.data.imageCount != 0) {
      wx.setStorageSync('imagelist', this.data.imageList)
      wx.setStorageSync('imagecount', this.data.imageCount)
    }
    else {
      wx.setStorageSync('imagelist', [{ 'url': '', 'selected': false }, { 'url': '', 'selected': false }, { 'url': '', 'selected': false }, { 'url': '', 'selected': false }, { 'url': '', 'selected': false }, { 'url': '', 'selected': false }, { 'url': '', 'selected': false }, { 'url': '', 'selected': false }, { 'url': '', 'selected': false }])
      wx.setStorageSync('imagecount', 0)
    }

    wx.navigateBack({
      delta: 1,
    })
  },

  publishAction:function() {
    if(this.data.title.length == 0) {
      wx.showToast({
        title: '先写个标题吧~',
        icon:'none'
      })
      
      return
    }
    if(this.data.content.length == 0 && this.data.imageCount == 0) {
      
      wx.showToast({
        title: '别急，总得写点什么~',
        icon:'none'
      })
        return
      
    }

    var pictureList = []
    for(var i = 0; i < this.data.imageCount; i++) {
      
      pictureList.push(this.data.imageList[i].url)
    }
    let addArticleParams = {
      query:{
        'title': this.data.title,
        'contentUrl': this.data.content,
        'pictureUrls': pictureList,
        'anonymityFlag':this.data.anony ? 1 : 0
      }
    }
    addArticle(addArticleParams).then(res => {

      wx.showToast({
        title: '发好帖子了呦~',
      })
      this.setData({ stopPublish: true, title: '', content: '', imageCount: 0, imageList: [{ 'url': '', 'selected': false }, { 'url': '', 'selected': false }, { 'url': '', 'selected': false }, { 'url': '', 'selected': false }, { 'url': '', 'selected': false }, { 'url': '', 'selected': false }, { 'url': '', 'selected': false }, { 'url': '', 'selected': false }, { 'url': '', 'selected': false }] })

      
     
      setTimeout(()=>{
        wx.navigateBack({
          delta: 1,
        })
      },1000)
      
    })
  },

  titleInputAction:function(e) {
    this.setData({title:e.detail.value})
  },

  contentInputAction:function(e) {
    this.setData({ content: e.detail.value })
  },

  deleteAction:function(e) {
    let index = e.currentTarget.dataset.index
    let info = e.currentTarget.dataset.item
    let list = this.data.imageList;
    for(let i = index; i < 9; i++) {
      list[i] = list[i + 1]
    }
    list[8] = { 'url': '', 'selected': false };
    this.setData({ imageList: list, imageCount:this.data.imageCount - 1 })
  },

  shadowAction:function(e) {
    let index = e.currentTarget.dataset.index
    let selected = 'imageList[' + index + '].selected'
    this.setData({ [selected]: false,changeEnable:true })
  },

  stickAction:function(e) {
    let index = e.currentTarget.dataset.index
    let info = e.currentTarget.dataset.item
    let list = this.data.imageList;
    for(let i = index; i > 0; i--) {
      list[i] = list[i - 1];
    }
    list[0] = info
    list[0].selected = false;
    this.setData({ imageList: list })
  },

  showAction: function (e) {
    var list = this.data.imageList
    let index = e.currentTarget.dataset.index
    for(var i = 0; i < list.length; i++) {
      if(i == index) {
        list[i].selected = true;
      }else {
        list[i].selected = false;
      }
    }
    this.setData({imageList:list})
    
    // let selected = 'imageList[' + index + '].selected'
    // this.setData({ [selected]: true })
  },

  chooseAction:function(){
    this.setData({ showShadow: true })
  },

  jointAction:function(){

    wx.chooseImage({
      count: 9,

      success: function (res) {
        
        var list = []
        var length = res.tempFilePaths.length
        var count = 0
        var tempList = []
        for (let i = 0; i < res.tempFilePaths.length; i++) {
          
          let params = {
            query: res.tempFilePaths[i]
          }
          
          uploadFile(params).then(res => {
            count++
            let result = JSON.parse(res)
            list.push({"url":result.resultContent.url,"index":i})
            
            if(count == length){
              
              for(let j = 0; j < list.length; j++) {
                tempList[list[j].index] = list[j].url
              }
              
              let mergePicturesParams = {
                query: {
                  pictureUrls: tempList
                }
              }
              
              if(tempList.length == 1) {
                wx.getImageInfo({
                  src: tempList[0],
                  success(res){
                    
                    wx.navigateTo({
                      url: '../imageManager/imageManager?url=' + tempList[0] + '&width=' + res.width + '&height=' + res.height
                    })
                  }
                })
              }else {
                mergePictures(mergePicturesParams).then(res => {
                  wx.hideToast()
                  if(res.resultCode == 103) {
                    wx.showToast({
                      title: '图片尺寸不一致',
                      icon:'none'
                    })
                  }else {
                    let result = res.resultContent
                    wx.navigateTo({
                      url: '../imageManager/imageManager?url=' + result.mergePictureUrl + '&width=' + result.mergeWidth + '&height=' + result.mergeHeight


                    })
                  }

                  
                  

                })
              }

              

              
            }
          })
        }


        
      }
      })

   
  },

  addImageAction:function(){
    

    var that = this
    this.setData({changeEnable:false})
    wx.chooseImage({
      count:9-that.data.imageCount,
      success: function (res) {
        
        let length = that.data.imageCount;
        
        for(let i = 0; i < res.tempFilePaths.length; i++) {
          
          if(length + i >= 9) return;

          let params = {
            query: res.tempFilePaths[i]
          }
          uploadFile(params).then(res => {
            let result = JSON.parse(res)
            let url = 'imageList[' + (i + length) + '].url'
            that.setData({ [url]: result.resultContent.url,imageCount: that.data.imageCount + 1 })
            //不一定最后一个index是最后请求结束
            that.setData({ changeEnable: true })
            console.log(that.data.imageList)
            console.log(that.data.imageCount)

          })
        }
        
      },
      fail:function(res) {
        that.setData({ changeEnable: true })

      },
      complete:function(res) {
        that.setData({ changeEnable: true })
      }
    })
  },

  moveAction:function(){

  },



  touchShadow:function(){
    this.setData({ showShadow: false})
  },


  cancelAction: function () {
    this.setData({ showAlert: false, showShadow: false, title: '', content: '', imageList: [{ 'url': '', 'selected': false }, { 'url': '', 'selected': false }, { 'url': '', 'selected': false }, { 'url': '', 'selected': false }, { 'url': '', 'selected': false }, { 'url': '', 'selected': false }, { 'url': '', 'selected': false }, { 'url': '', 'selected': false }, { 'url': '', 'selected': false }],imageCount:0})
    wx.setStorageSync('title', "")
    wx.setStorageSync('content', "")
    wx.setStorageSync('imagelist', [{ 'url': '', 'selected': false }, { 'url': '', 'selected': false }, { 'url': '', 'selected': false }, { 'url': '', 'selected': false }, { 'url': '', 'selected': false }, { 'url': '', 'selected': false }, { 'url': '', 'selected': false }, { 'url': '', 'selected': false }, { 'url': '', 'selected': false }])
    wx.setStorageSync('imagecount', 0)
    
  },

  onUnload:function(){
    this.setData({ showAlert: false, showShadow: false })
    if (this.data.title.length != 0) wx.setStorageSync('title', this.data.title)
    else {
      wx.setStorageSync('title', "")
    }
    if (this.data.content.length != 0) wx.setStorageSync('content', this.data.content)
    else {
      wx.setStorageSync('content', "")
    }
    if (this.data.imageCount != 0) {
      wx.setStorageSync('imagelist', this.data.imageList)
      wx.setStorageSync('imagecount', this.data.imageCount)
    }
    else {
      wx.setStorageSync('imagelist', [{ 'url': '', 'selected': false }, { 'url': '', 'selected': false }, { 'url': '', 'selected': false }, { 'url': '', 'selected': false }, { 'url': '', 'selected': false }, { 'url': '', 'selected': false }, { 'url': '', 'selected': false }, { 'url': '', 'selected': false }, { 'url': '', 'selected': false }])
      wx.setStorageSync('imagecount', 0)
    }
  },

  saveAction: function () {
   
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
  
  }
})