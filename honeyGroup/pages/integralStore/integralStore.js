// pages/account/account.js
const app = getApp()
const util = require("../../utils/util.js")
const API = require('../../utils/api.js')
Page({

    /**
     * 页面的初始数据
     */
    data: {
        index: 0,
        noData: true,
        hasRefesh: false,
        loadingMore: true,
        pageNum: 0,
        totalPage: 0,
        list: [],
        sortList: [
            { name: '积分由高到低', state: false },
            { name: '积分由低到高', state: false },
            { name: '库存由高到低' , state: false },
            { name: '最新上架优先', state: false }
        ],
        options: '最新上架优先', //排序方式
        showSelect: false,
        sortType:3
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function(options) {
        // console.log('onload list')
        
    },
    onShow:function(){
        console.log('onShow list')
        let self=this
          // 请求商品列表
        self.goodsDatas()
    },
    loadMore: function(e) {
        console.log('unload')
        let self = this;

        if (self.data.hasRefesh) {
            return
        } else {
            if (self.data.pageNum == self.data.totalPage - 1) {
                console.log(self.data.totalPage)
                self.setData({
                    hasRefesh: false,
                    loadingMore: false
                })
                return
            }
            self.setData({
                hasRefesh: true
            });
            var currentPages = self.data.pageNum + 1
            let datas=currentPages+'&_pageSize='+10+'&orderType='+self.data.sortType
            let urlPrefix = API.imgFileId//拼接图片
            
            app.fetchToken(API.goodsList + datas, 'GET', '', (err, res) => {
                if (res.resultCode == '100') {
                    for (var i = 0; i < res.resultContent.length; i++) {
                      res.resultContent[i].fileId = urlPrefix + res.resultContent[i].fileId
                    }
                    // console.log(res.resultContent)

                    self.setData({
                        list: self.data.list.concat(res.resultContent),
                    })
                    setTimeout(function() {
                        self.setData({
                            hasRefesh: false,
                            pageNum: res.pageInfo.currentPage
                        })
                    }, 1000)
                }
            })
        }
    },
    showSelectBox: function() {
        this.setData({
            showSelect: true
        })
    },
    selectOption: function(e) {
        console.log(e.currentTarget.dataset.item)
        let self = this
        let selected=e.currentTarget.dataset.item.name
        var arr = self.data.sortList;
        for (let i = 0; i < arr.length; i++) {
            if (selected == arr[i].name) {
                arr[i].state = true;
                self.setData({
                    sortType:i
                })
            } else {
                arr[i].state = false;
            }
        }
        self.setData({
            showSelect: false,
            options: selected,
            sortList: arr
        })
        console.log(self.data.sortType)
        // 请求商品列表
        self.goodsDatas()
    },
    goToDetail:function(e){
      console.log(e.currentTarget.dataset.item)
      let item=e.currentTarget.dataset.item
      let selled=''
      if(item.freeCount=='0'){
         selled='false'
      }else{
        selled='true'
      }
      let route='integral'
      wx.navigateTo({
        url:'/pages/integralStore/goodsDetail/goodsDetail?selled='+selled+'&route='+route+'&id='+item.id
      })
    },
    goodsDatas:function(){
        let self=this
        let data=0+'&_pageSize='+10+'&orderType='+self.data.sortType
        let urlPrefix = API.imgFileId//拼接图片
        util.waitShow()
          app.fetchToken(API.goodsList+data, 'GET', '', (err, res) => {
            util.waitHide()
            if (res.resultCode == '100') {
                 for (var i = 0; i < res.resultContent.length; i++) {
                      res.resultContent[i].fileId = urlPrefix + res.resultContent[i].fileId
                 }
                 console.log(res.resultContent)
                self.setData({
                    list: res.resultContent,
                    totalPage: res.pageInfo.totalPage,
                    pageNum: res.pageInfo.currentPage,
                    noData:false
                })
                if (self.data.pageNum == self.data.totalPage - 1) {
                    console.log('totalPage' + self.data.totalPage)
                    self.setData({
                        loadingMore: false
                    })
                }
                if(res.resultContent.length==0){
                    self.setData({
                        noData:true
                    })
                }
            }else if(res.resultCode == '101'){
                util.showModal('很遗憾','目前还没有可兑换商品~')
            }else{
                util.showModal('加载失败','网络不好，您稍后再试试吧~')
            }
        })
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