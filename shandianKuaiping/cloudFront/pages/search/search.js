import { getAccessToken } from "../../utils/AuthProvider";
import { getHotArticle } from "../../utils/api.js"

const utils = require('../../utils/util.js')

const app = getApp();



Page({

  /**
   * 页面的初始数据
   */
  data: {
    inputValue:"",
    hotList:[],
    navigationHeight: '64px',
    
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    getHotArticle({}).then(res => {

      let list = [];
      
      for (var index in res.resultContent) {
        let item = res.resultContent[index];
        var object = {
          title:item.title
        };
        list.push(object);
      }

      that.setData({hotList:list})

      
    })
  },
  onReady: function (options) {
    app.globalData.G_SDK.loaded('pages/search/search')
  },

  onShow:function(){
    app.globalData.G_SDK.loading('pages/search/search')
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

  keyAction:function(e){
    let key = e.currentTarget.dataset.title;
    wx.reLaunch({
      url: '../../pages/list/list?searchKey=' + key,
    })
  },

  backAction:function(){
    wx.navigateBack({
      delta:1
    })
  },
 
  searchAction:function(e){
    if(e.detail.value || e.detail.value == ""){
      wx.reLaunch({
        url: '../../pages/list/list?searchKey='+e.detail.value,
      })
      
    }
  },
  
  cancelAction:function(){
    wx.navigateBack({//返回
      delta: 1
    })
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
  
  }
})