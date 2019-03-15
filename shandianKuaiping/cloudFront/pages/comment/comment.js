import {
  getAccessToken
} from "../../utils/AuthProvider";
import {
  getUnionId,
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
    pageSize: 10, //每页数量
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
    thumbAnimation: false, //是否有动画
    totalCount:0
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

    app.globalData.G_SDK.loading('pages/main/main')
    
    if(options.url){
      var info = {
        'sharePicture': options.url,
        'sharePictureWidth': options.width,
        'sharePictureHeight': options.height,
      }
      var author = {
        'nickName': options.name,
        'logoPath': options.logo,
        'createDate': options.date
      }
      var articleInfoResult = {
        'articleId': options.id,
        'sharePicture': info,
        'author': author,
        'title': options.title
      }

      this.setData({
        articleId: options.id ? options.id : this.data.articleId,
        articleInfoResult: articleInfoResult
      })
    }else {
      var author = {
        'nickName': options.name,
        'logoPath': options.logo,
        'createDate': options.date
      }
      var articleInfoResult = {
        'id': options.id,
        'author': author,
        'title': options.title
      }

      this.setData({
        articleId: options.id ? options.id : this.data.articleId,
        articleInfoResult: articleInfoResult
      })
    }

    if (options.id) {
      this.setData({
        hasUserInfo: true,
      }, () => {
        this.statisticsLoad();
      })
    }

    this.getSuperComments();


  },
  onReady: function (options) {
    app.globalData.G_SDK.loaded('pages/main/main')
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

    if (!wx.getStorageSync('userinfo') && this.data.articleInfoResult.length == 0) {
      this.getSuperComments();
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
        that.getSuperComments();
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


  /**
   * 获取一级评论
   */

  getSuperComments() {
    let superCommentsParams = {
      articleId: this.data.articleId,
      currentPage: this.data.currentPage,
      pageSize: this.data.pageSize
    }
    this.setData({
      loading: true
    })
    getSuperComments(superCommentsParams).then(res => {


      this.setData({
        commentCount: Math.floor(Math.random() * res.pageInfo.totalRecords),
        totalCount:res.pageInfo.totalRecords
      })
      this.parseSuperComments(res);

    })
  },

  changeImage: function (e) { },

  /**
   * 解析一级评论
   */
  parseSuperComments(res, newComment) {
    if (this.data.currentPage == 0 || newComment) {
      this.setData({
        dataList: []
      })
    }
    let dataList = this.data.dataList;
    var that = this;
    res.resultContent.map(function (item, index) {

      var object = {
        "fromUserLogoPath": item.fromUser.logoPath,
        "fromUserName": item.fromUser.nickName,
        "fromUserId": item.fromUser.id,
        "createDate": utils.formatCommentTime(item.createDate),
        "content": item.content,
        "shareCount": 0,
        "childCommentNum": item.childCommentNum,
        "thumbUpNum": item.thumbs.thumbsCount,
        "thumbUpFlag": item.thumbs.thumbsFlag,
        "thumbDownNum": item.thumbs.unlikeCount,
        "thumbDownFlag": item.thumbs.unlikeFlag,
        "id": item.id,
        "type": item.type,
        "pictureUrl": item.pictureUrl,
        "shareImage": '',
        "index": index + that.data.currentPage * 5,
        "childComments": item.childComments,
        "thumbAnimation": false
      };
      dataList.push(object);
    });


    var loadMoreData = true;
    if (res.pageInfo.totalPage == 0 || res.pageInfo.totalPage == 1) {
      loadMoreData = false;
    } else {
      if (res.pageInfo.totalRecords <= this.data.dataList.length) {
        loadMoreData = false;
      }
    }

    this.setData({
      dataList,
      loadMoreData: loadMoreData,
      loading: false
    });

  


  },



  /**
   * 解析二级评论
   */
  parseChildComments(res) {
    let subDataList = [];

    res.resultContent.map(function (item, index) {
      var object = {
        "fromUserLogoPath": item.fromUser.logoPath,
        "fromUserName": item.fromUser.nickName,
        "fromUserId": item.fromUser.id,
        "toUserName": item.toUser.nickName,
        "toUserId": item.toUser.id,
        "createDate": utils.formatCommentTime(item.createDate),
        "content": item.content,
        "shareCount": 0,
        "childCommentNum": item.childCommentNum,
        "thumbUpNum": item.thumbs.thumbsCount,
        "thumbUpFlag": item.thumbs.thumbsFlag,
        "thumbDownNum": item.thumbs.unlikeCount,
        "thumbDownFlag": item.thumbs.unlikeFlag,
        "id": item.id,
        "type": item.type,
        "pictureUrl": item.pictureUrl,
        "thumbAnimation": false
      };
      subDataList.push(object);
    });

    this.setData({
      subDataList: subDataList
    });
  },
  /**
   * 滚动评论
   */
  rollScroll: function (e) {

    if (e.detail.scrollTop * 2 >= e.detail.scrollHeight - 6) {
      clearInterval(timer)
      var that = this;
      setTimeout(() => {
        timer = setInterval(() => {
          that.setData({ scrolltop: that.data.scrolltop + 2 })
        }, 100);
        var list = []
        list.push(that.data.topicRecommentList[3])
        list.push(that.data.topicRecommentList[4])
        list.push(that.data.topicRecommentList[5])
        list.push(that.data.topicRecommentList[0])
        list.push(that.data.topicRecommentList[1])
        list.push(that.data.topicRecommentList[2])
        that.setData({
          scrolltop: 0,
          topicRecommentList: list
        })

      }, 5000)
    }
  },

  /**
   * 输入信息值改变
   *  */
  textInput: function (e) {
    this.setData({
      inputValue: e.detail.value
    })
  },
  /**
   * 获取焦点
   */
  inputAction: function (e) {

    this.setData({
      editing: true,
      enableTouchShadow: true
    })


    if (this.data.selectedToUserFromName == '' && this.data.selectedOnceComment) {
      this.setData({
        selectedToUserFromName: this.data.selectedCommentInfo.fromUserName,
        selectedToUserType: this.data.selectedCommentInfo.type
      })
    }

  },
  //键盘弹起
  focusAction: function (e) {
    // if(e.detail.height != 0) return;
    console.log(e);
    console.log('--------')
    this.setData({ keyboardHeight: e.detail.height, enableTouchShadow: false })
    // var animation = wx.createAnimation({

    //   duration: 700,
    //   timingFunction: "ease-out",
    //   delay: 0,

    // })
    // animation.translateY(-e.detail.height).step();
    // this.setData({
    //   animationData: animation.export(),
    // })

  },
  blurAction: function (e) {
    this.setData({ keyboardHeight: 0 })
  },

  // 发送formid
  formSubmit: function (e) {
    utils.formSubmitAuth(e)
  },
  /**
   * 关闭遮罩
   */
  touchShadow: function () {
    
    this.setData({
      editing: false,
      bottomHolder: "",
      selectedToUserFromName: '',
      selectedToUserFromId: '',
      anony: false,
      keyboardHeight: 0
    })
  },

  /**
   * 投票选中左侧
   */
  voteYes: function () {

    if (this.data.isVoting) return;
    this.setData({
      isVoting: true
    })

    let voteParams = {
      query: {
        articleId: this.data.articleId,
        interactionId: this.data.infoVote.id,
        interactionInfoItemId: this.data.infoVote.interactionItems[0].id,
        oppoInteractionItemId: [this.data.infoVote.interactionItems[1].id],
        status: 1,
        type: 1
      }
    }

    addVote(voteParams).then(res => {

      let x = res.resultContent[this.data.infoVote.interactionItems[0].id];
      let y = res.resultContent[this.data.infoVote.interactionItems[1].id];

      this.setData({
        voteEnd: true,
        radioVote: [(x * 100 / (x + y)).toFixed(2), (y * 100 / (x + y)).toFixed(2)]
      })
    })

    this.statisticsVote('a');
  },

  /**
   * 投票选中右侧
   */
  voteNo: function () {

    if (this.data.isVoting) return;
    this.setData({
      isVoting: true
    })

    let voteParams = {
      query: {
        articleId: this.data.articleId,
        interactionId: this.data.infoVote.id,
        interactionInfoItemId: this.data.infoVote.interactionItems[1].id,
        oppoInteractionItemId: [this.data.infoVote.interactionItems[0].id],
        status: 1,
        type: 1
      }
    }
    addVote(voteParams).then(res => {
      let x = res.resultContent[this.data.infoVote.interactionItems[0].id];
      let y = res.resultContent[this.data.infoVote.interactionItems[1].id];

      this.setData({
        voteEnd: true,
        radioVote: [(x * 100 / (x + y)).toFixed(2), (y * 100 / (x + y)).toFixed(2)]
      })
    });

    this.statisticsVote('b');
  },
  /**
   * 显示全文按钮
   */
  showAllContent: function () {
    if (this.data.showAllContent) {
      this.navigateToContent()
    }
    this.setData({
      showAllContent: !this.data.showAllContent
    })

    this.statisticsAllContent();
  },
  reportAction: function (e) {

    var url = '../report/report'
    if (e.currentTarget.dataset.item) {
      url = '../report/report?commentId=' + e.currentTarget.dataset.item.id
    } else {
      url = '../report/report?articleId=' + this.data.articleId
    }
    wx.showActionSheet({
      itemList: ["投诉"],
      success(res) {
        wx.navigateTo({
          url: url,
        })
      }
    })
  },
  /**
   * 调用分享按钮
   */
  shareAction: function () {
    wx.showToast({
      title: '分享',
    })
  },
  /**
   * 点击输入框，获得焦点
   */
  bottomCommentAction: function (e) {

    this.setData({
      editing: true,
      bottomHolder: this.data.bottomHolder,
      selectedToUserFromId: e.currentTarget.dataset.userfromid,
      selectedToUserFromName: e.currentTarget.dataset.userfromname == '' ? this.data.selectedCommentInfo.fromUserName : e.currentTarget.dataset.userfromname,
      selectedToUserType: e.currentTarget.dataset.type == '' ? this.data.selectedCommentInfo.type : e.currentTarget.dataset.type
    })

  },
  /**
   * 点击二级评论按钮，弹出评论图层
   */
  commentAction: function (e) {
    let index = e.currentTarget.dataset.index;
    let {
      dataList
    } = this.data;
    let item = dataList[index];

    this.statisticsCheck(item)

    this.setData({
      selectedCommentIndex: index,
      selectedCommentInfo: item,
      inputValue: "",
      videoHeight: '0rpx'
    })

    let childCommentsParams = {
      parentId: item.id,
    }

    getChildComments(childCommentsParams).then(res => {

      this.parseChildComments(res);

      this.setData({
        selectedOnceComment: true,
      })
    })


  },
  /**
   * 收起二级评论
   */
  hideSubComment: function () {
    this.setData({
      videoHeight: this.data.video ? '400rpx' : '0rpx',
      selectedOnceComment: false,
      subDataList: [],
      selectedToUserFromId: "",
      selectedToUserFromName: "",
      inputValue: "",
      anony: false
    })
  },
  /**
   * 点赞
   */
  thumbAction: function (e) {
    if (this.data.thumbing) return;
    let index = e.currentTarget.dataset.index;
    let {
      dataList
    } = this.data;
    let item = dataList[index];

    let thumbUpParams = {
      query: {
        "status": item.thumbUpFlag ? 3 : 1,
        "thumbId": item.id,
        "type": 2,
      }
    }

    if (item.thumbDownFlag) {
      item.thumbDownNum -= 1;
    }
    item.thumbDownFlag = false;
    item.thumbUpFlag ^= 1;
    if (item.thumbUpFlag) {
      item.thumbUpNum += 1;
    } else {
      item.thumbUpNum -= 1;
    }

    if (item.thumbUpFlag) {
      item.thumbAnimation = true
    }

    this.setData({
      thumbing: true,
      dataList,
      selectedCommentInfo: item,
    }, () => {
      setTimeout(() => {
        let {
          dataList
        } = this.data;
        let item = dataList[index];
        item.thumbAnimation = false;
        this.setData({ dataList, selectedCommentInfo: item })
      }, 200)
    })



    addThumbUp(thumbUpParams).then(res => {

      this.statisticsThumb(item)

      this.setData({

        thumbing: false
      });

    })
  },
  /**
   * 踩
   */
  stampAction: function (e) {
    if (this.data.thumbing) return;
    let index = e.currentTarget.dataset.index;
    let {
      dataList
    } = this.data;
    let item = dataList[index];

    let thumbDownParams = {
      query: {
        "status": item.thumbDownFlag ? 4 : 2,
        "thumbId": item.id,
        "type": 2,
      }
    }
    if (item.thumbUpFlag) {
      item.thumbUpNum -= 1;
    }
    item.thumbUpFlag = false;
    item.thumbDownFlag ^= 1;
    if (item.thumbDownFlag) {
      item.thumbDownNum += 1;
    } else {
      item.thumbDownNum -= 1;
    }
    this.setData({
      thumbing: true,
      dataList,
      selectedCommentInfo: item,
    })
    addThumbUp(thumbDownParams).then(res => {

      this.statisticsStamp(item)


      this.setData({

        thumbing: false
      });

    })
  },

  /**
   * 子评论点赞
   */
  subThumbAction: function (e) {
    if (this.data.thumbing) return;
    let index = e.currentTarget.dataset.index;
    let {
      subDataList
    } = this.data;
    let item = subDataList[index];
    let thumbUpParams = {
      query: {
        "status": item.thumbUpFlag ? 3 : 1,
        "thumbId": item.id,
        "type": 2,
      }
    }

    if (item.thumbDownFlag) {
      item.thumbDownNum -= 1;
    }
    item.thumbDownFlag = false;
    item.thumbUpFlag ^= 1;
    if (item.thumbUpFlag) {
      item.thumbUpNum += 1;
    } else {
      item.thumbUpNum -= 1;
    }

    if (item.thumbUpFlag) {
      item.thumbAnimation = true;
    }

    this.setData({
      thumbing: true,
      subDataList,
    }, () => {
      setTimeout(() => {
        let {
          subDataList
        } = this.data;
        let item = subDataList[index];
        item.thumbAnimation = false;
        this.setData({ subDataList })
      }, 200)
    })





    addThumbUp(thumbUpParams).then(res => {

      this.statisticsThumb(item)

      this.setData({

        thumbing: false
      });

    })

  },
  /**
   * 子评论踩
   */
  subStampAction: function (e) {
    if (this.data.thumbing) return;
    let index = e.currentTarget.dataset.index;
    let {
      subDataList
    } = this.data;
    let item = subDataList[index];
    let thumbDownParams = {
      query: {
        "status": item.thumbDownFlag ? 4 : 2,
        "thumbId": item.id,
        "type": 2,
      }
    }
    if (item.thumbUpFlag) {
      item.thumbUpNum -= 1;
    }
    item.thumbUpFlag = false;
    item.thumbDownFlag ^= 1;
    if (item.thumbDownFlag) {
      item.thumbDownNum += 1;
    } else {
      item.thumbDownNum -= 1;
    }
    this.setData({
      thumbing: true,
      subDataList,
    })
    addThumbUp(thumbDownParams).then(res => {

      this.statisticsStamp(item)


      this.setData({

        thumbing: false
      });

    })
  },
  /**
   * 上拉加载
   */
  refreshFooter: function () {
    if (this.data.loading) return;
    this.setData({
      currentPage: this.data.currentPage + 1,
      loading: true
    })
    if (!this.data.loadMoreData) return;
    let superCommentsParams = {
      articleId: this.data.articleId,
      currentPage: this.data.currentPage,
      pageSize: this.data.pageSize
    }
    getSuperComments(superCommentsParams).then(res => {
      this.parseSuperComments(res);
    });


  },
  /**
   * 匿名
   */
  anonyAction: function () {
    this.setData({
      anony: !this.data.anony
    })
    if (this.data.anony) {
      this.setData({
        showAnony: true
      })
      setTimeout(() => {
        this.setData({ showAnony: false })
      }, 1500);

    }
  },
  /**
   * 点击图片放大
   */
  clickImage: function (e) {
    let image = e.currentTarget.dataset.image;
    wx.previewImage({
      current: image, // 当前显示图片的http链接
      urls: [image] // 需要预览的图片http链接列表
    })

  },
  /**
   * 删除评论图
   */
  deletePic: function () {
    this.setData({
      recommentImage: ''
    })
  },
  /**
   * 点击热门推荐
   */
  recommandAction: function (e) {
    wx.navigateTo({
      url: '../main/main?articleId=' + e.currentTarget.dataset.item.id
    })

  },


  /**
   * 新增评论
   */
  addComment: function () {
    var regu = "^[ ]+$";
    var re = new RegExp(regu);
    if ((this.data.inputValue.length == 0 || re.test(this.data.inputValue)) && this.data.recommentImage.length == 0) {
      wx.showToast({
        title: '回复内容不能空',
      })
      return;
    }


    if (this.data.selectedOnceComment) {
      if (this.data.superRecommenting || this.data.childRecommenting) {
        return
      } else {
        this.setData({
          superRecommenting: true,
          childRecommenting: true
        })
      }
    } else {
      if (this.data.superRecommenting) {
        return
      } else {
        this.setData({
          superRecommenting: true
        })
      }
    }




    let addCommentParam = this.data.selectedToUserFromId == "" ? (this.data.selectedOnceComment ? {
      query: {
        parentId: this.data.selectedCommentInfo.id,
        toUserId: this.data.selectedCommentInfo.fromUserId,
        articleId: this.data.articleId,
        content: this.data.inputValue,
        status: 1,
        type: this.data.selectedCommentInfo.type == 1 || this.data.selectedCommentInfo.type == 3 ? (!this.data.anony ? 1 : 2) : (!this.data.anony ? 3 : 4)
      }
    } :
      {
        query: {
          articleId: this.data.articleId,
          content: this.data.inputValue,
          status: 1,
          type: !this.data.anony ? 1 : 2
        }
      }) : {
        query: {
          parentId: this.data.selectedCommentInfo.id,
          toUserId: this.data.selectedToUserFromId,
          articleId: this.data.articleId,
          content: this.data.inputValue,
          status: 1,
          type: this.data.selectedToUserType == 1 || this.data.selectedToUserType == 3 ? (!this.data.anony ? 1 : 2) : (!this.data.anony ? 3 : 4)
        }
      }

    if (this.data.recommentImage != '') {
      addCommentParam.query['pictureUrl'] = this.data.recommentImage
    }

    addComment(addCommentParam).then(res => {

      this.deletePic();

      if (res.resultCode == '101' || res.resultCode == '102') {

        wx.showToast({
          title: '评论涉及敏感词',
          icon: 'loading',
          image: '',

        })
        this.setData({
          childRecommenting: false,
          superRecommenting: false
        })
        return;
      }
      if (res.resultCode == '103') {

        wx.showToast({
          title: '图片含敏感信息',
          icon: 'loading',
          image: '',

        })
        this.setData({
          childRecommenting: false,
          superRecommenting: false
        })
        return;
      }



      if (!addCommentParam.query.parentId) {
        this.statisticsComment(res)
      } else {
        this.statisticsSubComment(res)
      }

      this.touchShadow();
      let dict = this.data.selectedCommentInfo;
      dict.childCommentNum += 1;
      this.setData({
        dataList: [],
        currentPage: 0,
        inputValue: "",
        bottomHolder: "",
        loadMoreData: true,
        editing: false,
        selectedCommentInfo: dict,
        showGuide: true
      })

      let superCommentsParams = {
        articleId: this.data.articleId,
        currentPage: this.data.currentPage,
        pageSize: this.data.pageSize
      }
      this.setData({
        loading: true
      })
      getSuperComments(superCommentsParams).then(res => {




        this.setData({
          commentCount: Math.floor(Math.random() * res.pageInfo.totalRecords),
          superRecommenting: false
        })
        this.parseSuperComments(res, true);

      })



      if (this.data.selectedOnceComment) {
        this.setData({
          subDataList: [],
          selectedToUserFromId: "",
          selectedToUserFromName: ""
        })


        let childCommentsParams = {
          parentId: this.data.selectedCommentInfo.id,
        }
        wx.showLoading({
          title: '正在加载中..',
        })
        getChildComments(childCommentsParams).then(res => {

          this.parseChildComments(res);
          this.setData({
            selectedOnceComment: true,
            superRecommenting: false,
            childRecommenting: false
          })
        })
      } else {
        this.setData({
          selectedToUserFromId: "",
          selectedToUserFromName: ""
        })
      }
    });

  },



  chooseImage: function () {
    var that = this
    wx.chooseImage({
      success: function (res) {
        let params = {
          query: res.tempFilePaths[0]
        }
        uploadFile(params).then(res => {

          let result = JSON.parse(res)
          that.setData({
            recommentImage: result.resultContent.url
          })

        })
      },
    })
  },

  getUserInfo: function (e) {

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
    var that = this;
    this.setData({ showGuide: false })
    var shareObj = {
      title: this.data.articleInfoResult.title, // 默认是小程序的名称(可以写slogan等)
      path: '/pages/main/main?articleId=' + this.data.articleId, // 默认是当前页面，必须是以‘/’开头的完整路
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
    app.aldstat.sendEvent('进入小程序(包括授权前)', {
      '内容ID': this.data.articleId,
    });
    app.globalData.G_SDK.push('pages/main/main', '进入小程序(包括授权前)')

  },
  statisticsLoad: function () {
    app.aldstat.sendEvent('进入小程序(授权后)', {
      '内容ID': this.data.articleId,
      '用户openID': wx.getStorageSync('openid'),
      '用户unionID': wx.getStorageSync('unionid')
    });
    app.globalData.G_SDK.push('pages/main/main', '进入小程序(授权后)', wx.getStorageSync('unionid'))

  },
  statisticsUser: function () {
    app.aldstat.sendEvent('打开详情页面(有数据展示后)', {
      '内容ID': this.data.articleId,
      '用户openID': wx.getStorageSync('openid'),
      '用户unionID': wx.getStorageSync('unionid')
    });
    app.globalData.G_SDK.push('pages/main/main', '进入小程序(有数据展示后)', wx.getStorageSync('unionid'))

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