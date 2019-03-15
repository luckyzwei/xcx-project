// pages/myNotification/myNotification.js
import { getThumbRemind, getCommentRemind } from "../../utils/api.js"
const utils = require('../../utils/util.js')

Page({

  /**
   * 页面的初始数据
   */
  data: {
    navigationHeight: '64px',
    articleTypeList: [{ "typeName": "评论", "typeId": 0 }, { "typeName": "赞", "typeId": 1 }],
    currentType:0, //0评论 1赞
    scrollTopNum:0,
    dataList:[],
    page:0,
    loadMoreData: true, //主页是否可以继续加载
    loading: false, //是否正在加载
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getCommentInfo();
  },

  clickAction: function (e) {
    wx.switchTab({
      url: '../article/article?articleId=' + e.currentTarget.dataset.item.id,
    })
  },

  getCommentInfo: function () {
    var that = this
    this.setData({ loading: true })
    let thumbRemindParams = {
      page: this.data.page,
      size: 10
    }
    getCommentRemind(thumbRemindParams).then(res => {
      if (that.data.page == res.pageInfo.totalPage - 1)
        that.setData({ loadMoreData: false })
      let list = that.page == 0 ? [] : that.data.dataList

      res.resultContent.map(function (item, index) {

        let info = {
          "id": item.articleId,
          "userlogo": item.user.logoPath,
          'desc':"评论了你的帖子：",
          "username": item.user.nickName,
          "createDate": utils.formatCommentDate(item.createDate),
          "content": item.replyContent,
          "title": item.content,
          "picture": item.replyPictureUrl ? true : false
        }
        list.push(info)
        
      })
      that.setData({ dataList: list, loading: false })
    })
  },

  getThumbInfo: function () {
    var that = this
    this.setData({ loading: true })
    let thumbRemindParams = {
      page: this.data.page,
      size: 10
    }
    getThumbRemind(thumbRemindParams).then(res => {
      if (that.data.page == res.pageInfo.totalPage - 1)
        that.setData({ loadMoreData: false })

      let list = that.page == 0 ? [] : that.data.dataList
      
      res.resultContent.map(function (item, index) {
        
        
        let info = {
          "id": item.comment.articleId,
          'desc':item.messageTop,
          "userlogo": item.img,
          "username": "",
          "createDate": utils.formatCommentDate(item.createDate),
          "content": '赞了这条评论',
          "title": item.comment.content,
          "picture": false
        }
       
        list.push(info)
        
      })
      that.setData({ dataList: list, loading: false })
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


  refreshFooter: function () {
    if (this.data.loading) return;
    this.setData({
      page: this.data.page + 1
    })
    if (!this.data.loadMoreData) return;
    if(this.data.currentType == 0) {
      this.getCommentInfo();
    }else {
      
      this.getThumbInfo();
    }


  },

  changeType: function (e) {
    
    var that = this;
    this.setData({
      currentType: e.currentTarget.dataset.info.typeId,
      page: 0,
      scrollTopNum: 0,
      loadMoreData: true,
      dataList:[]
    }, () => {
      if (that.data.currentType == 0) {
        that.getCommentInfo();
      } else {
        that.getThumbInfo();
      }
    })
  },
  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})