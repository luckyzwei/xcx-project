// pages/list/list.js
import { get_topic_list, set_likes, save_view_num} from '../../utils/config.js';
import { pageGo,successShowText} from '../../utils/util.js'
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    hasUserInfo: null,
    topicName:'',
    topicList:[
      // {
      //   "avatar_url": "../../images/icon/ic_like_hi.png",
      //   "nickname": "春夏秋冬2",
      //   "post_id": "2",
      //   "content": "今年柿子长得还可以，鸟啄了不少，也落了不艺术展览大家没事可以去拍拍照。",
      //   "comments": 12,
      //   "likes": 23,
      //   "like": false,
      //   "create_date": "2019-04-02"
      // }
    ],
    thumbing: false, //正在点赞:true
    thumbAnimation: false, //点赞是否有动画
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // console.log(options, 'onLoad==options')
    wx.setStorageSync('topic_name', options.topic_name) //存储topic_name
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
    let params = {
      topic_name: decodeURIComponent(wx.getStorageSync('topic_name')),
      union_id: wx.getStorageSync('union_id') ? wx.getStorageSync('union_id'):''
    }
    get_topic_list(params).then(res => {
      this.setData({
        topicName: res.data.topic_name,
        topicList: res.data.posts.map(item => Object.assign({}, { ...item, thumbAnimation: false }, {})),
      })
    })
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
  //点赞
  thumbAction(e){
    let self=this
    let { thumbing, topicList} = self.data;
    // console.log(thumbing)
    if (thumbing) return
    let index = e.currentTarget.dataset.index;
    let item = topicList[index];
    // console.log(item)

    if(item.like){
      item.likes-=1
      item.like = false
    }else{
      item.likes +=1
      item.like = true
      item.thumbAnimation=true
    }

    this.setData({
      thumbing:true,//正在点赞
      topicList
    },()=>{
      setTimeout(() => {
        let { topicList} = this.data;
        let item = topicList[index];
        item.thumbAnimation = false;
        this.setData({
          topicList
        })
      },200)
    })
  
    let parmas = {
      "union_id": wx.getStorageSync('union_id'),
      "post_id": item.post_id, //type为1时必填
      "comment_id": null, //type为2时必填
      "type": 1, //1代表论点，2代表评论
      "action": item.like ? 1 : 0 //0代表取消点赞，1代表点赞
    }

    // console.log(item, parmas, '------')

    set_likes(parmas).then(res=>{
      this.setData({
        thumbing: false
      })
    })
  },
  
  /**
   * 用户点击右上角分享
   */
  // onShareAppMessage: function () {
  //   let topic_name = wx.getStorageSync('topic_name');
  //   return {
  //     title:'话题精华',
  //     path: '/pages/list/list?topic_name=' + topic_name,
  //   }
  // },
  goDetail(e){
    let post_id = e.currentTarget.dataset.id
    pageGo('/pages/details/details?post_id=' + post_id,1)
    let params = {
      "union_id": wx.getStorageSync('union_id') ? wx.getStorageSync('union_id'):'',
      "topic_name": null, //type为1时必填
      "post_id": post_id, //type为2必填
      "type": 2  //1代表浏览话题 2代表浏览论点
    }
    save_view_num(params)
  },
  //滚动到顶部
  doubleTap(e) {
    this.setData({
      scrollTopNum: e.detail.scrollTopNum
    })
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
})