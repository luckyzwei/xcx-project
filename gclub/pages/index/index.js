//index.js
//获取应用实例
import { pageGo} from '../../utils/util.js';
import { get_topic_group,save_view_num} from '../../utils/config.js';

const app = getApp()

Page({
  data: {
    dataList:[],
    hasUserInfo: null,
    openGid:''

  },
  onLoad(){
    let self = this
    wx.showShareMenu({
      withShareTicket:true
    })

    app.getShareTiket((globalData)=>{
      console.log(globalData)
      self.setData({
        openGid: globalData.openGid
      })
    })

  },
  onShow(){
    let unionId = wx.getStorageSync('union_id')
    if (unionId){
      this.setData({
        hasUserInfo:true
      })
    }
    get_topic_group().then(res=>{
      if(res.code==1200){
        this.setData({
          dataList: res.data
        })
      }
    })
  },
  onReady() {
    const vm = this
    vm.setData({
      statusBarHeight: getApp().globalData.statusBarHeight,
      titleBarHeight: getApp().globalData.titleBarHeight
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
  goList(e) {
    if (!e.currentTarget.dataset.hasuserinfo) return
    //跳转 并且授权
    let item = e.currentTarget.dataset.item
    let topic_name = item.topic_name, post_id = item.post_id
    let group_code = this.data.dataList.group_code
    pageGo(`/pages/list/list?topic_name=${encodeURIComponent(topic_name)}`, 1)

    let params={
      "union_id": wx.getStorageSync('union_id'),
      "topic_name": topic_name, //type为1时必填
      "post_id": post_id, //type为2必填
      "type": 1  //1代表浏览话题 2代表浏览论点
    }
    save_view_num(params)

  },
  //滚动到顶部
  doubleTap(e) {
    this.setData({
      scrollTopNum: e.detail.scrollTopNum
    })
  },
  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
   
  },
})
