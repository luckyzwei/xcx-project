// pages/myHistory/myHistory.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    navigationHeight: '64px',
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
  
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