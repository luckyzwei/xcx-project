import { getAccessToken, onLogin} from "../../utils/AuthProvider";
import { getUnionId, getArticleList, getArticleTypeList } from "../../utils/api.js"

const utils = require('../../utils/util.js')

const app = getApp();

Page({
  data: {
    hasUserInfo: true,
    userInfo: {},
    canIUse: wx.canIUse('button.open-type.getUserInfo'),//判断是否支持button微信授权
    articleList:[],
    articleTypeList:[],
    currentType:0,
    currentPage:0,
    loadMoreData: true, //主页是否可以继续加载
    loading: false, //是否正在加载
    changeTypeEnable:false,//是否可以换分类
    searchKey:"",
    showEmpty: false,
    navigationHeight: '64px',
    scrollTopNum:0,
    requestTimes:0,
    showTips: false,
    // 触摸开始时间
    touchStartTime: 0,
    // 触摸结束时间
    touchEndTime: 0,
    // 最后一次单击事件点击发生时间
    lastTapTime: 0, 
    
  },




  onLoad: function (options) {

    app.globalData.G_SDK.loading('pages/list/list')

    this.setData({
      searchKey: options.searchKey ? options.searchKey : "",
      currentPage:0,
    }) 

    this.getArticleInfo();
    
    if (options.articleId) {
      wx.navigateTo({
        url: '../main/main?articleId=' + options.articleId
      })
    }

    const scene = decodeURIComponent(options.scene)
    console.log(scene + '      123123123123')
  },


  onReady: function (options) {
    app.globalData.G_SDK.loaded('pages/list/list')
  },

  getArticleType:function(){
    var that = this;
    let articleTypeParams = {}
    getArticleTypeList(articleTypeParams).then(res => {
      that.setData({ articleTypeList:res.resultContent})
    });
  },


  getArticleInfo:function() {

    
    this.setData({loading:true,changeTypeEnable:false})
    setTimeout(() => { this.setData({ loading: false })}, 10000)
    let articalListParams = {
      query:{
        "title":this.data.searchKey,
        "type":this.data.currentType
      },
      page:this.data.currentPage
    }
    if(this.data.searchKey == '') {
      articalListParams['size'] = 10
    }
    var requestTimes = this.data.requestTimes + 1;
    this.setData({ requestTimes: this.data.requestTimes + 1})
    
    var that = this;

    getArticleList(articalListParams).then(res => {
    
      wx.stopPullDownRefresh();
      if(this.data.requestTimes != requestTimes) return;
    
      wx.getStorage({
        key: 'tips',
        success(res) {
          that.setData({
            showTips: res.data
          })
        },
        fail(res) {
          wx.setStorageSync('tips', true)
          that.setData({
            showTips: true
          })
        }
      })
      

      if (res.error === 'invalid_token'){
        onLogin();
        this.getArticleInfo();
        return;
      }
      

      if(this.data.articleTypeList.length == 0) {
        this.getArticleType();
      }

      let articleList = this.data.currentPage == 0 ? [] : this.data.articleList;
      if(this.data.currentPage == res.pageInfo.totalPage - 1)
        this.setData({loadMoreData:false})
      for (var index in res.resultContent){
        let item = res.resultContent[index];
        let voteImage = "";
        for(var subIndex in item.article.interactionList) {
          let subItem = item.article.interactionList[subIndex]
          if(subItem.type == 2) {
            voteImage = subItem.interactionPictureUrl;
          }
        }
        var object = {
          "articleId": item.article.id,
          "title": item.article.title,
          "image": item.article.transpondUrl,
          "group_count": item.article.interactionNum,
          "logoPathList": item.article.logoPathList,
          "hasComment": item.comments && item.comments.length != 0 ? true : false,
          "userLogo": item.comment ? item.comment.fromUser.logoPath : "",
          "userName": item.comment ? item.comment.fromUser.nickName : "",
          "content": item.comment ? item.comment.content : "",
          "count": item.comment ? item.comment.thumbs ? item.comment.thumbs.thumbsCount : "0" : "0",
          "voteImage":voteImage,
          "comments":item.comments,
          "imageList": item.article.ugcPictureUrls ? item.article.ugcPictureUrls:[],
          "browseNum": item.article.browseNum,
          "commentNum":item.article.commentNum,
          "createDate": utils.formatCommentTime(item.article.createDate),
          "author":item.article.author
        };
        articleList.push(object);
      }
      
      this.setData({ 
        articleList: articleList,
        loading:false,
        changeTypeEnable:true
       })
      
      if (this.data.articleList.length == 0) {
        
        this.setData({ showEmpty: true })
        setTimeout(() => {
          this.setData({ showEmpty: false })
        }, 1500);

      }
    })
  },

  publishAction:function() {
    wx.navigateTo({
      url: '../publish/publish',
    })
    wx.setStorageSync('tips',false)
    this.setData({showTips:false})
  },

  onPullDownRefresh: function () {
    if (this.data.loading) return;

    this.getArticleInfo();
  },

  onReachBottom: function () {
   
    if (this.data.loading) return;
    this.setData({
      currentPage: this.data.currentPage + 1
    })
    if (!this.data.loadMoreData) return;
    this.getArticleInfo();

  },

  onTabItemTap(item) {
    if (this.data.loading) return;
    this.setData({ currentPage: 0, scrollTopNum: 0, requestTimes: 0, articleList: [], loadMoreData: true })
    wx.startPullDownRefresh();

  },





  changeType:function(e){
    this.setData({ 
      articleList: [],
      currentType: e.currentTarget.dataset.info.typeId,
      currentPage:0,
      scrollTopNum:0,
      loadMoreData:true
      },()=>{
        wx.startPullDownRefresh();
      })
  },


  searchAction:function() {
    wx.navigateTo({
      url: '../search/search'
    })
  },

  cancelAction: function () {
    this.setData({
      searchKey:"",
      currentPage:0,
      loadMoreData:true
    })
    this.getArticleInfo()
  },

  

  onShow: function () {

    var that = this;
    wx.getSystemInfo({
      success: function (res) {
        console.log(res.model);
        if (res.model.indexOf('iPhone X') != -1 || res.model.indexOf('unknown') != -1) {
          that.setData({
            navigationHeight: '88px'
          })
        }
      },
      fail:function(res) {
        console.log(res);
      },
      complete:function(res) {
        console.log(res);
      }
    })

    
    if(!wx.getStorageSync('userinfo') && this.data.articleList.length == 0) {
      this.getArticleInfo();
    }

    if (!wx.getStorageSync('unionid') || wx.getStorageSync('unionid').length == 0) {
      wx.setStorageSync('userinfo', '')
      this.setData({
        hasUserInfo: false
      })
    }else {
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
        /**
         * 处理
         */
        that.getArticleInfo();
        that.getArticleType();
      }
    })
  },

  clickAction:function(e){
    wx.navigateTo({
      url: '../main/main?articleId=' + e.currentTarget.dataset.info.articleId
    })
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
        wx.pageScrollTo({
          scrollTop: 0,
          duration: 0
        })
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