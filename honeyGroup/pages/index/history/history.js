// pages/index/history/history.js
const app = getApp()
const util = require("../../../utils/util.js")
const API = require('../../../utils/api.js')
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
        totalPage: 0
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function(options) {
        let self = this
        // 查询历史任务列表
        app.fetchToken(API.userTask+0+'&_pageSize=10', 'GET', '', (err, res) => {
            if (res.resultCode == '100') {
                self.setData({
                    list: res.resultContent,
                    totalPage: res.pageInfo.totalPage,
                    pageNum: res.pageInfo.currentPage
                })
                if (self.data.pageNum == self.data.totalPage - 1) {
                    console.log('totalPage' + self.data.totalPage)
                    self.setData({
                        loadingMore: false
                    })
                }
            } else if (res.resultCode == '02529011') {
                self.setData({
                    noData: true
                })
            } else {
                util.showModal('加载失败', '网络不好，再试试咯~')
            }
        })
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
            var datas = currentPages + '&_pageSize=10'
            let hideLoading=1

            app.fetchToken(API.userTask+datas, 'GET', '', (err, res) => {
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
            },hideLoading)
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