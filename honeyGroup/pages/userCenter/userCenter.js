// pages/userCenter/userCenter.js
const app = getApp()
const util = require("../../utils/util.js")
const API = require('../../utils/api.js')
Page({

    /**
     * 页面的初始数据
     */
    data: {
        list: [],
        noData: false,
        hasRefesh: false,
        loadingMore: true,
        pageNum: 0,
        totalPage: 0,
        amount: 0 //总数
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function(options) {

    },
    onShow:function(){
         console.log('userCenteronShow')
        let self = this
        let data = {
            "sourceSys": 6,
            "slipType": 4
        }
        //总数
        app.fetchToken(API.accountAmount, 'GET', '', (err, res) => {
            if (res.resultCode == '100') {
                self.setData({
                    amount: res.resultContent.balanceAmount
                })
                if (res.resultContent.balanceAmount == null || res.resultContent.balanceAmount == undefined) {
                    self.setData({
                        amount: 0
                    })
                }
            } else {
                util.showModal('加载失败', '网络不好，退出再试试咯~')

            }
        })
        app.fetchToken(API.account + 0 + '&_size=10', 'POST', data, (err, res) => {
            if (res.resultCode == '100') {
                self.setData({
                    list: res.resultContent,
                    totalPage: res.pageInfo.totalPage,
                    pageNum: res.pageInfo.currentPage
                })
                console.log(self.data.list)
                if (self.data.pageNum == self.data.totalPage - 1) {
                    console.log('totalPage' + self.data.totalPage)
                    self.setData({
                        loadingMore: false
                    })
                }
            } else if (res.resultCode == '02529011') {
                self.setData({
                    noData: true,
                    loadingMore: false
                })
            } else {
                util.showModal('加载失败', '网络不好，退出再试试咯~')
            }
        })
    },
    toChange: function(e) {
        console.log(e.detail.formId)
        let formId = e.detail.formId
        util.getFormId(formId,app)
        // util.showModal('敬请期待', '该功能即将上线~')
        wx.navigateTo({
            url:'/pages/integralStore/integralStore'
            // url:'/pages/taskDetail/webview/webview'
        })
    },
    exchangeLog:function(e){
      console.log(e.currentTarget.dataset)
      let item=e.currentTarget.dataset.item
      let route='account'
      let selled='false'
      let ticketId=item.ticketId
      if(item.sourceType==10){
        wx.navigateTo({
          url:'/pages/integralStore/goodsDetail/goodsDetail?selled='+selled+'&route='+route+'&ticketId='+ticketId
        })
      }   
    },
    loadMore: function(e) {
        console.log('unload')
        let _this = this;

        if (_this.data.hasRefesh) {
            return
        } else {
            console.log(_this.data.pageNum, '当前页')
            if (_this.data.pageNum == _this.data.totalPage - 1) {
                console.log(_this.data.totalPage)
                _this.setData({
                    hasRefesh: false,
                    loadingMore: false
                })
                return
            }
            _this.setData({
                hasRefesh: true
            });
            var currentPages = _this.data.pageNum + 1
            var datas = currentPages + '&_size=10'
            let hideLoading = 1
            let urlData = {
                "sourceSys": 6,
                "slipType": 4
            }
            app.fetchToken(API.account + datas, 'POST', urlData, (err, res) => {
                if (res.resultCode == '100') {
                    _this.setData({
                        list: _this.data.list.concat(res.resultContent),
                    })
                    setTimeout(function() {
                        _this.setData({
                            hasRefesh: false,
                            pageNum: res.pageInfo.currentPage
                        })
                    }, 1000)
                }
            }, hideLoading)
        }
    },

    /**
     * 用户点击右上角分享
     */
    onShareAppMessage(options) {
        let unionId = wx.getStorageSync('unionid')
        var titles = '加入闺蜜团和千万妈妈一起分享育儿经验';
        var paths = '/pages/index/index?unionId=' + unionId;
        var urls = '/images/share.png'
        return app.shareIndex(titles, paths, urls)
    }
})