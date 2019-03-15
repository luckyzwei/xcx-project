// pages/myArticle/myArticle.js
import { getMyArticle, deleteArticle } from "../../utils/api.js"
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
  getArticleInfo:function(){
    var that = this
    this.setData({ loading: true })
    let myArticleParams = {
      page: this.data.page,
      size: 10
    }
    getMyArticle(myArticleParams).then(res => {
    
      if (that.data.page == res.pageInfo.totalPage - 1)
        that.setData({ loadMoreData: false })
      
      res.resultContent.map(function (item, index) {
        let list = that.data.dataList
        let info = {
          "title": item.title,
          "browseNum": item.browseNum,
          "commentNum": item.commentNum,
          "id": item.id,
          "userlogo": item.author.logoPath,
          "username": item.author.nickName,
          "createDate": utils.formatCommentDate(item.createDate),
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

  reportAction:function(e){
    var that = this;
    wx.showActionSheet({
      itemList: ["删除帖子"],
      success(res) {
        that.deleteArticle(e)
      }
    })
  },

  deleteArticle:function(e){
    var that = this
    this.setData({ loading: true })
    let delArticleParams = {
      query: {
        id: e.currentTarget.dataset.item.id,
        status: 3
        }
    }
    deleteArticle(delArticleParams).then(res => {
      that.setData({ dataList: [], loadMoreData: true, page: 0 }, () => {
        that.getArticleInfo()
      })
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

  clickAction:function(e) {
    wx.navigateTo({
      url: '../main/main?articleId=' + e.currentTarget.dataset.item.id,
    })
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
  
  }
})