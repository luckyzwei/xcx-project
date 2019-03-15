import { getAccessToken, onLogin } from "../../utils/AuthProvider";

import {
  getUnionId,
  getArticleInfoNew,
  getSuperComments,
  getChildComments,
  addVote,
  addThumbUp,
  addComment,
  uploadFile
} from "../../utils/api.js"

import { MessageCenter } from '../../utils/MessageCenter.js';

const utils = require('../../utils/util.js')
const Promise = require('../../utils/es6-promise');
var WxParse = require('../../wxParse/wxParse.js');
let message = new MessageCenter();
message.register('shareImg');
const app = getApp();
let timer;

Page({

  /**
   * 页面的初始数据
   */
  data: {
    onload: false,
    articleId: "",
    showAllContent: false, //显示全文
    showGuide: false,
    scrollToView: '', //锚点
    dataList: [ //一级评论展示个数

    ],
    navigationHeight: '64px',
    subDataList: [ //二级评论展示个数
    ],
    voteEnd: false, //投票是否结束
    editing: false, //是否编辑
    inputValue: "", //编辑信息
    recommandArticleList: [],//推荐文章列表
    selectedCommentInfo: {}, //选中的评论信息
    selectedCommentIndex: 0, //选中的评论index
    selectedOnceComment: false, //是否已经选中了一条评论
    bottomHolder: "", //input的placeHolder修改
    loadMoreData: true, //主页是否可以继续加载
    loading: false, //是否正在加载
    articleInfoResult: {}, //请求详情数据
    hasTopic: false, //是否有话题模块
    infoTopic: {}, //话题模块数据
    hasVote: false, //是否有投票模块
    infoVote: {}, //投票模块数据
    voteEndTime: "", //投票截止日期
    currentPage: 0, //当前页
    pageSize: 5, //每页数量
    radioVote: [0, 0], //投票比例
    isVoting: false, //是否投过票
    reverlAllFlag: false,//是否展开全文
    selectedToUserFromId: "", //发出的fromid
    selectedToUserFromName: "", //发出的fromname
    selectedToUserType: 1,
    article: '', //富文本信息
    commentCount: 0, //新评论个数
    hasUserInfo: true,
    userInfo: {},
    canIUse: wx.canIUse('button.open-type.getUserInfo'), //判断是否支持button微信授权
    voteFlag: false, //是否已投票
    voteMap: {}, //已投票内容
    superRecommenting: false, //正在评论
    childRecommenting: false, //正在评论
    anony: false, //匿名
    recommentImage: '', //评论图片
    thumbing: false, //正在点赞
    showAnony: false, //显示匿名toast
    video: '',
    videoHeight: '0rpx',
    topicRecommentList: [],
    scrolltop: 0,
    voteImage: '',
    formId: '',
    scrollTopNum: 0,//滚回顶部
    keyboardHeight: 0,//键盘弹起高度
    enableTouchShadow: false,//是否可以点击阴影
    // 触摸开始时间
    touchStartTime: 0,
    // 触摸结束时间
    touchEndTime: 0,
    // 最后一次单击事件点击发生时间
    lastTapTime: 0,
    author: {},
    thumbAnimation: false //是否有动画
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

    app.globalData.G_SDK.loading('pages/article/article')

    var id = this.data.articleId
    if(options.articleId) {
      id = options.articleId
    }
    if(options.scene) {
      id = options.scene
    }

    this.setData({
      articleId: id,
    })
    if (wx.getStorageSync('userinfo')) {
      this.setData({
        hasUserInfo: true,
      }, () => {
        this.statisticsLoad();
      })
    }

    this.getArticleInfo();


  },
  onReady: function (options) {
    app.globalData.G_SDK.loaded('pages/article/article')
  },

  showGuideAction: function () {
    this.setData({ showGuide: true })
  },

  closeGuideAction: function () {
    this.setData({ showGuide: false })
  },

  onShow: function () {
    var that = this;
    this.statisticsEnter();
    

    wx.getSystemInfo({
      success: function (res) {
        if (res.model.indexOf('iPhone X') != -1 || res.model.indexOf('unknown') != -1) {
          that.setData({
            navigationHeight: '88px'
          })
        }
      },
    })
    if (wx.getStorageSync('userinfo') && JSON.stringify(this.data.articleInfoResult) == "{}") {
      onLogin();
      this.getArticleInfo();
    }

    if (!wx.getStorageSync('unionid') || wx.getStorageSync('unionid').length == 0) {
      wx.setStorageSync('userinfo', '')
      this.setData({
        hasUserInfo: false
      })
    } else {
      app.getGlobalDatas(this.data.canIUse, res => {
        that.setData({
          hasUserInfo: res.hasUserInfo
        })

      })
    }



  },


  getUserInfoAll: function (e) {
    var that = this;
    app.getUserInfoAll(e, res => {
      that.setData({
        hasUserInfo: res.hasUserInfo
      })
      if (res.hasUserInfo) {
        that.getArticleInfo();
        that.statisticsLoad();
      }
    })
  },
  /**
   * 返回功能
   */
  closeGuideAction: function () {
    this.setData({ showGuide: false })
  },

  backAction: function () {
    if (getCurrentPages().length == 1) {
      wx.navigateTo({
        url: '../list/list',
      })
    } else {
      wx.navigateBack({
        delta: 1,
      })
    }

  },
  homeAction: function () {
    if (getCurrentPages().length == 1) {
      wx.navigateTo({
        url: '../list/list',
      })
    } else {
      wx.navigateBack({
        delta: 100,
      })
    }

  },

  commentAction:function(){
    if (this.data.articleInfoResult.sharePicture) {
      var info = this.data.articleInfoResult.sharePicture;
      wx.navigateTo({
        url: '../comment/comment?url=' + info.sharePicture + '&width=' + info.sharePictureWidth + '&height=' + info.sharePictureHeight + '&id=' + this.data.articleInfoResult.id + '&name=' + this.data.articleInfoResult.author.nickName + '&logo=' + this.data.articleInfoResult.author.logoPath + '&date=' + this.data.articleInfoResult.author.createDate + '&title=' + this.data.articleInfoResult.title + '&articleId=' + this.data.articleId,
      })

    }else {
      wx.navigateTo({
        url: '../comment/comment?id=' + this.data.articleInfoResult.id + '&name=' + this.data.articleInfoResult.author.nickName + '&logo=' + this.data.articleInfoResult.author.logoPath + '&date=' + this.data.articleInfoResult.author.createDate + '&title=' + this.data.articleInfoResult.title + '&articleId=' + this.data.articleId,
      })
    }

  },

  nextAction:function() {
    var that = this
    this.setData({articleId:""},()=>{
      that.getArticleInfo()
    })
  },

  /**
   * 获取页面详情
   */
  getArticleInfo: function () {
    let articleParams = {
      id: this.data.articleId,
      methed: "GET"
    }
    
    var that = this;
    /**
     * 获取页面详情接口
     */
    getArticleInfoNew(articleParams).then(res => {

      if (res.error === 'invalid_token') {
        console.log('失效重新登录')
        onLogin();
        this.getArticleInfo();
        return;
      }
      if (wx.getStorageSync('openid') && !that.data.onload) {
        that.statisticsUser();
        that.setData({ onload: true })
      }

      
      var author = res.resultContent.author;
      author.createDate = utils.formatCommentTime(res.resultContent.createDate)
      that.setData({
        articleInfoResult: res.resultContent,
        author: author
      });


      var temp = WxParse.wxParse('article', 'html', that.data.articleInfoResult.contentUrl, that, 0);
      that.setData({
        article: temp
      })

    
      
    })
  },

  // 发送formid
  formSubmit: function (e) {
    utils.formSubmitAuth(e)
  },
  /**
   * 关闭遮罩
   */
  touchShadow: function () {
    if (this.data.enableTouchShadow) return;
    this.setData({
      editing: false,
      bottomHolder: "",
      selectedToUserFromName: '',
      selectedToUserFromId: '',
      anony: false,
      keyboardHeight: 0
    })
  },

  

  shareMomentsAction: function () {
    this.setData({ showGuide: false })
    if (this.data.articleInfoResult.sharePicture) {
      var info = this.data.articleInfoResult.sharePicture;
      wx.navigateTo({
        url: '../shareMoments/shareMoments?url=' + info.sharePicture + '&width=' + info.sharePictureWidth + '&height=' + info.sharePictureHeight + '&id=' + this.data.articleInfoResult.id + '&name=' + this.data.articleInfoResult.author.nickName + '&logo=' + this.data.articleInfoResult.author.logoPath + '&date=' + this.data.articleInfoResult.author.createDate + '&title=' + this.data.articleInfoResult.title + '&articleId=' + this.data.articleId,
      })

    } else {
      wx.navigateTo({
        url: '../shareMoments/shareMoments?id=' + this.data.articleInfoResult.id + '&name=' + this.data.articleInfoResult.author.nickName + '&logo=' + this.data.articleInfoResult.author.logoPath + '&date=' + this.data.articleInfoResult.author.createDate + '&title=' + this.data.articleInfoResult.title + '&articleId=' + this.data.articleId,
      })
    }
    
  },



  onHide: function () {
    this.statisticsClose();
  },
  onUnload: function () {
    this.statisticsClose();
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function (options) {
    console.log(options,'options===')
    var that = this;
    this.setData({ showGuide: false })
    var shareObj = {
      title: this.data.articleInfoResult.title, // 默认是小程序的名称(可以写slogan等)
      path: '/pages/article/article?articleId=' + this.data.articleId, // 默认是当前页面，必须是以‘/’开头的完整路
    };
    if (options.from == 'button') {
      var eData = options.target.dataset;

      if (options.target.dataset.from) {
        this.statisticsShareButton();
        if (that.data.articleInfoResult.transpondUrl.length != 0) {
          shareObj['imageUrl'] = 'https://dev-article.s3.cn-north-1.amazonaws.com.cn/' + that.data.articleInfoResult.transpondUrl //自定义图片路径，可以是本地文件路径、代码包文件路径或者网络图片路径，支持PNG及JPG，不传入 imageUrl 则使用默认截图。显示图片长宽比是 5:4
        }

        return shareObj;
      } else {
        this.statisticsShareButtonItem();
        var item = eData.info;
        shareObj['title'] = this.data.articleInfoResult.title
        shareObj['imageUrl'] = item.shareImage

        return shareObj

      }
    }

    if (options.from == 'menu') {
      this.statisticsShareMenu();
      if (that.data.articleInfoResult.transpondUrl.length != 0) {
        shareObj['imageUrl'] = 'https://dev-article.s3.cn-north-1.amazonaws.com.cn/' + that.data.articleInfoResult.transpondUrl //自定义图片路径，可以是本地文件路径、代码包文件路径或者网络图片路径，支持PNG及JPG，不传入 imageUrl 则使用默认截图。显示图片长宽比是 5:4
      }
      // 返回shareObj

      return shareObj;
    }
  },


  /**
   * 锚点
   */
  navigateToComment: function () {
    this.setData({
      scrollToView: 'comment',
      commentCount: 0
    })
    this.inputAction()
  },
  navigateToContent: function () {
    this.setData({
      scrollToView: 'content'
    })
  },




  //埋点
  statisticsEnter: function () {
    app.aldstat.sendEvent('进入新版小程序(包括授权前)', {
      '内容ID': this.data.articleId,
    });
    app.globalData.G_SDK.push('pages/article/article', '进入新版小程序(包括授权前)', this.data.articleId)

  },
  statisticsLoad: function () {
    app.aldstat.sendEvent('进入新版小程序(授权后)', {
      '内容ID': this.data.articleId,
      '用户openID': wx.getStorageSync('openid'),
      '用户unionID': wx.getStorageSync('unionid')
    });
    app.globalData.G_SDK.push('pages/article/article', '进入新版小程序(授权后)', wx.getStorageSync('unionid'), this.data.articleId)

  },
  statisticsUser: function () {
    app.aldstat.sendEvent('打开新版详情页面(有数据展示后)', {
      '内容ID': this.data.articleId,
      '用户openID': wx.getStorageSync('openid'),
      '用户unionID': wx.getStorageSync('unionid')
    });
    app.globalData.G_SDK.push('pages/article/article', '进入新版小程序(有数据展示后)', wx.getStorageSync('unionid'), this.data.articleId)

  },
  statisticsClose: function () {
    app.aldstat.sendEvent('退出当前页或小程序', {
      '内容ID': this.data.articleId,
      '当前是否获得到数据': this.data.articleInfoResult.length == 0 ? "否" : "是"
    });

  },
  statisticsTopic: function () {
    app.aldstat.sendEvent('点击话题区域', {
      '用户openID': wx.getStorageSync('openid'),
      '显示新消息数量': this.data.commentCount,
      '内容ID': this.data.articleId
    });
  },

  statisticsAllContent: function () {
    app.aldstat.sendEvent('点击展开全文', {
      '用户openID': wx.getStorageSync('openid'),
      '内容ID': this.data.articleId
    });
  },

  statisticsVote: function (voteId) {
    app.aldstat.sendEvent('投票', {
      '用户openID': wx.getStorageSync('openid'),
      '内容ID': this.data.articleId,
      '投票选项': voteId
    });
  },


  statisticsCheck: function (item) {
    app.aldstat.sendEvent('查看回复', {
      '用户openID': wx.getStorageSync('openid'),
      '内容ID': this.data.articleId,
      '评论ID': item.id,
      '被查看者userId': item.fromUserId
    });
  },

  statisticsComment: function (res) {
    app.aldstat.sendEvent('发表评论', {
      '用户openID': wx.getStorageSync('openid'),
      '内容ID': this.data.articleId,
      '评论ID': res.resultContent.id
    });
  },

  statisticsThumb: function (item) {
    app.aldstat.sendEvent('点赞', {
      '用户openID': wx.getStorageSync('openid'),
      '内容ID': this.data.articleId,
      '评论ID': item.id,
      '被点赞者userId': item.fromUserId
    });
  },
  statisticsStamp: function (item) {
    app.aldstat.sendEvent('点踩', {
      '用户openID': wx.getStorageSync('openid'),
      '内容ID': this.data.articleId,
      '评论ID': item.id,
      '被点踩者userId': item.fromUserId
    });
  },

  statisticsSubComment: function (res) {
    app.aldstat.sendEvent('回复', {
      '用户openID': wx.getStorageSync('openid'),
      '内容ID': this.data.articleId,
      '评论ID': res.resultContent.id,
      '被回复者userId': res.resultContent.toUser.id
    });
  },

  statisticsShareMenu: function () {
    app.aldstat.sendEvent('自带分享', {
      '用户openID': wx.getStorageSync('openid'),
      '内容ID': this.data.articleId
    });
  },

  statisticsShareButton: function () {
    app.aldstat.sendEvent('内容分享', {
      '用户openID': wx.getStorageSync('openid'),
      '内容ID': this.data.articleId
    });
  },

  statisticsShareButtonItem: function () {
    app.aldstat.sendEvent('评论分享', {
      '用户openID': wx.getStorageSync('openid'),
      '内容ID': this.data.articleId
    });
  },


  preventTouchMove: function () {

  },

  /// 双击滚动顶部
  doubleTap: function (e) {
    var that = this
    // 控制点击事件在350ms内触发，加这层判断是为了防止长按时会触发点击事件
    if (that.touchEndTime - that.touchStartTime < 350) {
      // 当前点击的时间
      var currentTime = e.timeStamp
      var lastTapTime = that.lastTapTime
      // 更新最后一次点击时间
      that.lastTapTime = currentTime

      // 如果两次点击时间在300毫秒内，则认为是双击事件
      if (currentTime - lastTapTime < 300) {
        // 成功触发双击事件时，取消单击事件的执行
        clearTimeout(that.lastTapTimeoutFunc);
        that.setData({ scrollTopNum: 0 })
      }
    }
  },
  /// 按钮触摸开始触发的事件
  touchStart: function (e) {
    this.touchStartTime = e.timeStamp
  },

  /// 按钮触摸结束触发的事件
  touchEnd: function (e) {
    this.touchEndTime = e.timeStamp
  },


})