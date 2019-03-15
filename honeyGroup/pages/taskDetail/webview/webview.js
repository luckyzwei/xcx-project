// pages/taskDetail/webview/webview.js
const app = getApp()
const util = require("../../../utils/util.js")
const API = require('../../../utils/api.js')
Page({

  /**
   * 页面的初始数据
   */
  data: {
  userTaskId:'',
  url:''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(options)
    let unionId = wx.getStorageSync('unionid')
    let webUrl='https://wx.gemii.cc/gemii/questionaire/index.html?_userTaskId='+options.userTaskId+'&unionid='+unionId
    console.log(webUrl)
    this.setData({
      userTaskId:options.userTaskId,
      url:webUrl
    })

  },
 /**
   * 用户点击右上角分享
   */
  onShareAppMessage(options) {
      let unionId = wx.getStorageSync('unionid')

      var titles = '加入闺蜜团和千万妈妈一起分享育儿经验';
      var paths = '/pages/index/index?unionId=' + unionId;
      var urls = '/images/share.png'
      return app.shareIndex(titles, paths, urls)
  }
})