// pages/report/report.js
import {
  addComplain
} from "../../utils/api.js"

Page({

  /**
   * 页面的初始数据
   */
  data: {
    navigationHeight: '64px',
    dataList:["色情低俗","垃圾广告","辱骂攻击","虚假信息","其他"],
    selectIndex:5,
    content:"",
    complainType:0,
    complainInfo:""
  },

 
  onLoad: function (options) {
    
    if(options.articleId) {
      this.setData({ complainType: 0, complainInfo:options.articleId})
    }else {
      this.setData({ complainType: 1, complainInfo:options.commentId })
    }
  },

  clickAction:function(e){
    this.setData({
      selectIndex:e.currentTarget.dataset.index
    })
  },

  inputAction:function(e){
    this.setData({content:e.detail.value})
  },

  backAction:function() {
    wx.navigateBack({
      delta:1
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

  submitAction:function(){
    var that = this
    if(this.data.selectIndex == 5) {
      wx.showToast({
        title: '请选择投诉理由',
        icon:'none'
      })
      return
    }
    

    let addComplainParams = {
      query: {
        'status': 1,
        'type': this.data.complainType,
        'complainReason':(this.data.selectIndex + 1)
      }
    }
    if (this.data.complainType == 0) {
      addComplainParams.query.articleId = this.data.complainInfo
    }else {
      addComplainParams.query.commentId = this.data.complainInfo
    }

    if (this.data.selectIndex == 4) {
      addComplainParams.query.reasonExt = this.data.content
    }
    

    addComplain(addComplainParams).then(res => {
      wx.showToast({
        title: '投诉成功',
        icon: 'none'
      })
      setTimeout(()=>{
        that.backAction();
      },1000)
    })

  }
  
})