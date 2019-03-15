// pages/myThumb/myThumb.js
import { getMyComment } from "../../utils/api.js"
const utils = require('../../utils/util.js')

Page({

  /**
   * 页面的初始数据
   */
  data: {
    navigationHeight: '64px',
    dataList: [],
    page: 0,
    loadMoreData: true, //主页是否可以继续加载
    loading: false, //是否正在加载
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getArticleInfo();
  },
  getArticleInfo: function () {
    var that = this
    this.setData({ loading: true })
    let myCommentParams = {
      page: this.data.page,
      size: 10
    }
    getMyComment(myCommentParams).then(res => {
      if (that.data.page == res.pageInfo.totalPage - 1)
        that.setData({ loadMoreData: false })

      res.resultContent.map(function (item, index) {

        let list = that.data.dataList
        let info = {
          "id": item.articleId,
          "userlogo": item.user.logoPath,
          "username": item.user.nickName,
          "createDate": utils.formatCommentDate(item.createDate),
          "content": item.content,
          "title": item.replyContent,
          "picture": item.pictureUrl ? true : false
        }
        list.push(info)
        that.setData({ dataList: list, loading: false })
      })
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

  refreshFooter: function () {
    if (this.data.loading) return;
    this.setData({
      page: this.data.page + 1
    })
    if (!this.data.loadMoreData) return;
    this.getArticleInfo();


  },
  backAction: function () {
    wx.navigateBack({
      delta: 1,
    })
  },

  
  clickAction: function (e) {
    
    wx.switchTab({
      url: '../article/article?articleId=' + e.currentTarget.dataset.item.id,
    })
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})