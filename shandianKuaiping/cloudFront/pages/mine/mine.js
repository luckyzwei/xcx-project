// pages/mine/mine.js
import { getMyRecord } from "../../utils/api.js"
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    navigationHeight: '64px',
    nickName:'',
    avatarUrl:'',
    notifyCount:0,
    historyList: [],
    clickEnable:true
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    app.globalData.G_SDK.loading('pages/mine/mine')
    let info = wx.getStorageSync('userinfo')
    if (!this.data.clickEnable)return
    this.setData({
      nickName: info.nickName,
      avatarUrl: info.avatarUrl,
      clickEnable:false
    })

    
  },

  onTabItemTap(item) {
    var that = this

    if (!this.data.clickEnable) return
    this.setData({
      clickEnable: false
    })

    setTimeout(()=>{
      this.setData({
        clickEnable: true
      })
    },10000)

    let myRecordParams = {
      page: 0,
      size: 5
    }
    getMyRecord(myRecordParams).then(res => {
      this.setData({
        clickEnable: true
      })
      let list = []
      res.resultContent.article.map(function (item, index) {
        let info = {
          "title": item.title,
          "id": item.id
        }
        list.push(info)
        that.setData({ historyList: list })
      })
      that.setData({ notifyCount: res.resultContent.informNum })
      if (res.resultContent.informNum > 0) {
        wx.showTabBarRedDot({
          index: 1
        })
      } else {
        wx.hideTabBarRedDot({
          index: 1
        })
      }
    })
  },

  onReady: function (options) {
    app.globalData.G_SDK.loaded('pages/mine/mine')
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
    

    var that = this

    let myRecordParams = {
      page: 0,
      size: 5
    }


    getMyRecord(myRecordParams).then(res => {
      this.setData({
        clickEnable: true
      })
      let list = []
      res.resultContent.article.map(function (item, index) {
        let info = {
          "title": item.title,
          "id": item.id
        }
        list.push(info)
        that.setData({ historyList: list })
      })
      that.setData({ notifyCount: res.resultContent.informNum })

      if (res.resultContent.informNum > 0) {
        wx.showTabBarRedDot({
          index: 1
        })
      } else {
        wx.hideTabBarRedDot({
          index: 1
        })
      }
    })
  },

  clickArticle:function() {
    wx.navigateTo({
      url: '../myArticle/myArticle',
    })
  },

  clickThumb: function () {
    wx.navigateTo({
      url: '../myThumb/myThumb',
    })
  },

  clickNotify: function () {
    wx.navigateTo({
      url: '../myNotification/myNotification',
    })
  },

  clickHistory: function () {
    // wx.navigateTo({
    //   url: '../myHistory/myHistory',
    // })
  },

  clickOnceHistory:function(e) {
    wx.switchTab({
      url: '../article/article?articleId=' + e.currentTarget.dataset.item.id
    })
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
  
  }
})