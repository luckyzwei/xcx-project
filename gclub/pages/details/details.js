// pages/details/details.js
import { topic_detail, view_comment, set_likes} from '../../utils/config.js';
import { pageGo} from '../../utils/util.js'
const app=getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    hasUserInfo: null,
    listView:0,
    post_info:{
      // "topic_name": "",
      // "avatar_url": "../../images/icon/ic_like_hi.png",
      // "nickname": "12",
      // "post_id": "1",
      // "content": "今年柿子长得还可以，鸟啄了不少，也落了不艺术展览大家没事可以去拍拍照。 今年柿子长得还可以，鸟啄了不少，也落了不艺术展览大家没事可以去拍拍照。",
      // "comments": 12,
      // "likes": 23,
      // "like": true,
      // "create_date": "2019-09-09",
      // thumbAnimation:false
    },
    dataList:[
      
      // {
      //   "comment_id": "12",
      //   "avatar_url": "../../images/icon/ic_tab_edit.png",
      //   "nickname": "绿豆汤",
      //   "content": '有了詹姆斯就等于分区冠军啊！！！不过西部那么强，我觉得有可能……lnc.zm, x, ',
			// 		"likes": 323,
      //   "like": true,
      //   "create_date": '2018-09-09 20:00',
      //   thumbAnimation: false
      // },
      // {
      //   "comment_id": "12",
      //   "avatar_url": "../../images/icon/ic_tab_edit.png",
      //   "nickname": "绿豆汤",
      //   "content": '有了詹姆斯就等于分区冠军啊！！！不过西部那么强，我觉得有可能……lnc.zm, x, ',
			// 		"likes": 323,
      //   "like": false,
      //   "create_date": '2018-09-09 20:00',
      //   thumbAnimation: false
      // }, {
      //   "comment_id": "12",
      //   "avatar_url": "../../images/icon/ic_tab_edit.png",
      //   "nickname": "绿豆汤",
      //   "content": '有了詹姆斯就等于分区冠军啊！！！不过西部那么强，我觉得有可能……lnc.zm, x, ',
      //   "likes": 323,
      //   "like": false,
      //   "create_date": '2018-09-09 20:00',
      //   thumbAnimation: false
      // }, {
      //   "comment_id": "12",
      //   "avatar_url": "../../images/icon/ic_tab_edit.png",
      //   "nickname": "绿豆汤",
      //   "content": '有了詹姆斯就等于分区冠军啊！！！不过西部那么强，我觉得有可能……lnc.zm, x, ',
      //   "likes": 323,
      //   "like": false,
      //   "create_date": '2018-09-09 20:00',
      //   thumbAnimation: false
      // }
    ],
    editing: false, //是否编辑
    inputValue:'',//评论内容
    loadMoreData: false, //主页是否可以继续加载
    keyboardHeight: 0,//键盘弹起高度
    scrollTopNum:0,
    commentStatus:false,//评论中 true
    thumbing:false,//正在点赞 true
    loading:false,//判断页面是否可渲染
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // console.log(options,'options')  
    const post_id = options.post_id
    wx.setStorageSync('post_id', post_id)
    this.get_topic_detail(post_id);  //获取数据
  },
  /**
    * 生命周期函数--监听页面显示
    */
  onShow: function () {
    let unionId = wx.getStorageSync('union_id')
    if (unionId) {
      this.setData({
        hasUserInfo: true
      })
    }
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    const vm = this
    vm.setData({
      statusBarHeight: getApp().globalData.statusBarHeight,
      titleBarHeight: getApp().globalData.titleBarHeight
    })
  },
  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
    const post_id=wx.getStorageSync('post_id')
    return {
      title:'话题精华',
      path: '/pages/details/details?post_id=' + post_id
    }
  },
  //小程序授权 获取用户信息
  getUserInfo: function (e) {
    var self = this;
    app.getUserInfoAll(e, res => {
      self.setData({
        hasUserInfo: res.hasUserInfo,
        userInfo: res.userInfo
      })
    })
  },
  get_topic_detail(post_id) {
    const that = this
    let params = {
      post_id: post_id,
      union_id: wx.getStorageSync('union_id') ? wx.getStorageSync('union_id'):''
    }
    topic_detail(params).then(res => {
      res.data.post_info.thumbAnimation = false
      that.setData({
        post_info: res.data.post_info,
        dataList: res.data.comments.map(item => Object.assign({}, { ...item, thumbAnimation: false }, {})),
        loading: true
      })
      that.getSelectorQuery();
      
    })
  },
  //dom渲染之后获取#topic-content的高度 /获取评论点的高度
  getSelectorQuery(){
    const _this = this
    wx.createSelectorQuery().select('#topic-content').boundingClientRect(function (res) {
        // console.log(res, 'listView-res')
        _this.setData({
          listView: res.height, //这样可以动态获取高度
        }, () => {
          // console.log(_this.data.listView, 'listView====')
        })
      }).exec()
  },
  //显示输入input
  inputAction(){
    this.setData({editing:true})
  },
  //获取焦点
  focusAction(e){
    this.setData({ keyboardHeight: e.detail.height})//键盘高度
  },
  //失去焦点
  blurAction(){
    this.setData({ keyboardHeight: 0 })
  },
  //change input
  textInput(e){
    let that = this
    // bindinput 监听 input 输入框的输入
    if (e.detail.cursor != that.data.cursor)
      that.setData({
        inputValue:e.detail.value,
        cursor: e.detail.cursor
      })
  },
  //关闭遮罩层
  touchShadow(){
    this.setData({
      editing:false,
      keyboardHeight: 0
    })
  },
  //发布
  postComment(){
    let self= this
    const { commentStatus, inputValue, post_info} =this.data
    if (commentStatus) return
    if (inputValue==''){
      wx.showToast({
        title: '评论内容不能空',
      })
      return;
    }
    self.setData({
      commentStatus: true
    })
    let params = {
      "union_id": wx.getStorageSync('union_id'),
      "post_id": post_info.post_id,
      "content": inputValue
    }
    view_comment(params).then(res => {
      if (res.code == 1200) {
        self.setData({
          inputValue: '',
        })
        wx.showToast({
          title: '评论成功',
          duration: 3000
        })
        
      } else {
        wx.showToast({
          title: '评论失败',
          icon:'none'
        })
      }
      self.setData({
        commentStatus: false,
        editing: false,
        keyboardHeight: 0
      },()=>{
        self.get_topic_detail(post_info.post_id)
      })
      
    })
  },

//论点点赞
  postThumbAction(){
    let self = this
    let { thumbing, post_info } = self.data;
    if (thumbing) return
    if (post_info.like){
      post_info.likes -= 1
      post_info.like = false
    }else{
      post_info.likes += 1
      post_info.like = true
      post_info.thumbAnimation = true
    }

    this.setData({
      thumbing: true,//正在点赞
      post_info
    }, () => {
      setTimeout(() => {
        let { post_info } = this.data;
        post_info.thumbAnimation = false;
        this.setData({
          post_info
        })
      }, 200)
    })

    let parmas = {
      "union_id": wx.getStorageSync('union_id'),
      "post_id": post_info.post_id, //type为1时必填
      "comment_id": null, //type为2时必填
      "type": 1, //1代表论点，2代表评论
      "action": post_info.like ? 1 : 0 //0代表取消点赞，1代表点赞
    }
    this.setLikes(parmas)
  },

  //评论点赞
  thumbAction(e){
    let self = this
    let { thumbing, dataList } = self.data;

    if (thumbing) return
    let index = e.currentTarget.dataset.index;
    let item = dataList[index];


    if (item.like) {
      item.likes -= 1
      item.like = false
    } else {
      item.likes += 1
      item.like = true
      item.thumbAnimation = true
    }

    this.setData({
      thumbing: true,//正在点赞
      dataList
    }, () => {
      setTimeout(() => {
        let { dataList } = this.data;
        let item = dataList[index];
        item.thumbAnimation = false;
        this.setData({
          dataList
        })
      }, 200)
    })


    let parmas = {
        "union_id": wx.getStorageSync('union_id'),
        "post_id": null, //type为1时必填
        "comment_id": item.comment_id, //type为2时必填
        "type": 2, //1代表论点，2代表评论
        "action": item.like?1:0 //0代表取消点赞，1代表点赞
      }
    this.setLikes(parmas)

  },
  setLikes(parmas){
    // console.log( parmas, '------')
    set_likes(parmas).then(res=>{
      this.setData({
        thumbing: false
      })
    })
  },
  //滚动到顶部
  doubleTap(e){
    this.setData({
      scrollTopNum: e.detail.scrollTopNum
    })
  },
  goBack(e) {
    let topic_name = e.currentTarget.dataset.name
    pageGo(`/pages/list/list?topic_name=${encodeURIComponent(topic_name)}`, 1)
  },
})

