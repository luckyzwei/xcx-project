// pages/fetchTask/fetchTask.js
const app = getApp()
const util = require("../../utils/util.js")
const API = require('../../utils/api.js')
Page({

    /**
     * 页面的初始数据
     */
    data: {
        imgUrl: [],
        shareText: "",
        taskName: "", //任务名称
        urlText: '', //分享链接
        ifUrlText: false,
        ifShareText: false,
        shareImg: false,
        haveGetTask: false, //是否领取任务
        taskId: 0,
        startTime: '2018-01-01',
        endTime: '2018-02-02',
        awards: '', //奖励
        quantity: '', //奖励数量
        userTaskId: null,
        detailTip: '',
        submitComment: '',
        question: false,//问卷任务
        changeCode: '',
        awardsOne: true,//奖励类型
        awardsTwo: false
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        console.log(options, 'operateGuide')
        let self = this
        self.setData({
            taskId: options.currenId,
            submitComment: options.submitComment,
            detailTip: options.operateGuide,
            userTaskId: options.userTaskId
        })

        if (options.active == '1') {
            self.setData({
                haveGetTask: true
            })
        }
        util.waitShow()
        app.fetchToken(API.liziTask + self.data.taskId, 'GET', '', (err, res) => {
            util.waitHide()
            if (res.resultCode == '100') {
                self.setData({
                    taskName: res.resultContent.name,
                    startTime: res.resultContent.startTime,
                    endTime: res.resultContent.endTime,
                    shareText: res.resultContent.mgTaskMaterial.content
                })

                //判断分享类型：0文字 1 链接 2图文 3问卷
                if (res.resultContent.mgTaskMaterial.sourceType == '0') {
                    self.setData({
                        ifShareText: true

                    })
                } else if (res.resultContent.mgTaskMaterial.sourceType == '1') {
                    self.setData({
                        ifShareText: false,
                        ifUrlText: true,
                        urlText: res.resultContent.mgTaskMaterial.link,
                        shareImg: false
                    })
                } else if (res.resultContent.mgTaskMaterial.sourceType == '2') {

                    // 拼接图片数组
                    let materialFiles = res.resultContent.mgTaskMaterial.mgTaskMaterialFiles
                    var newImgList = []
                    let urlPrefix = API.imgFileId
                    for (var i = 0; i < materialFiles.length; i++) {
                        let picUrl = urlPrefix + materialFiles[i].fileId
                        newImgList.push(picUrl)
                        if (newImgList.length == materialFiles.length) {
                            console.log(newImgList)
                            self.setData({
                                imgUrl: newImgList
                            })
                        }
                    }
                    self.setData({
                        ifShareText: false,
                        ifUrlText: false,
                        shareImg: true
                    })
                } else if (res.resultContent.mgTaskMaterial.sourceType == '3') {
                    self.setData({
                        question: true
                    })
                }
                // 判断奖励类型
                if (res.resultContent.mgRewardReq.type == 0) {
                    //积分栗子
                    self.setData({
                        quantity: res.resultContent.mgRewardReq.quantity,
                        awardsOne: true,
                        awardstwo: false
                    })
                } else if (res.resultContent.mgRewardReq.type == 1) {
                    //卡券
                    self.setData({
                        changeCode: res.resultContent.mgRewardReq.code,
                        awardstwo: true,
                        awardsOne: false
                    })
                } else if (res.resultContent.mgRewardReq.type == 2) {
                    // 实物
                    self.setData({
                        awards: res.resultContent.mgRewardReq.name,
                        awardsOne: false,
                        awardstwo: false
                    })
                }

            } else {
                util.showModal('加载失败', '网络不好，再试试咯~')

            }
        })
    },
    toGetTask: function (e) {
        console.log(e.detail.formId)
        let self = this
        let formId = e.detail.formId
        //提交formID
        util.getFormId(formId, app)

        //领取任务
        app.fetchToken(API.getTask + self.data.taskId, 'GET', '', (err, res) => {
            if (res.resultCode == '100') {
                self.setData({
                    haveGetTask: true,
                    userTaskId: res.resultContent
                })
                if (self.data.question) {
                    wx.navigateTo({
                        url: '/pages/taskDetail/webview/webview?userTaskId=' + res.resultContent
                    })
                } else {
                    util.showModal('领取成功', '领取成功，快去做任务吧，任务完成才能提交哦~')
                }

            } else if (res.resultCode == '02529002') {
                util.showModal('领取失败', '该任务已过期，请您领取其他任务吧~')
            } else if (res.resultCode == '02529105') {
                util.showModal('领取失败', '关注[栗子妈妈俱乐部]公众号方可领取~')
            } else if (res.resultCode == '02519106') {
                util.showModal('领取失败', '服务出了点小差，请您稍后再试试~')
            } else {
                util.showModal('领取失败', '网络不好，再试试咯~')
            }
        })
    },
    copyText: function () {
        let copyTexts = this.data.shareText
        console.log(this.data.shareText)
        wx.setClipboardData({
            data: copyTexts,
            success: function (res) {
                console.log(res)
                util.successShowText('复制文字成功')
            }
        })
    },
    copyUrl: function () {
        let copyUrl = '栗子妈干货分享【链接转发】' + this.data.urlText
        console.log(this.data.urlText)
        wx.setClipboardData({
            data: copyUrl,
            success: function (res) {
                console.log(res)
                util.successShowText('复制素材成功')
            }
        })
    },
    toSubmitTask: function () {
        console.log(this.data.question)
        if (this.data.question) {
            wx.navigateTo({
                url: '/pages/taskDetail/webview/webview?userTaskId=' + this.data.userTaskId
            })
        } else {
            console.log(this.data.userTaskId);
            console.log(this.data.submitComment);
            console.log(this.data.shareText);
            let {shareText,submitComment,userTaskId} = this.data;
            wx.navigateTo({
                url: `/pages/taskDetail/submitTask/submitTask?userTaskId=${userTaskId}&submitComment=${submitComment}&shareTip=${shareText}`
            })
        }
    },
    previewImg: function (e) {
        console.log(e.currentTarget.dataset)
        let src = e.currentTarget.dataset.src
        let imgList = e.currentTarget.dataset.list
        // console.log(imgList)
        //图片预览
        wx.previewImage({
            current: src, // 当前显示图片的http链接
            urls: imgList // 需要预览的图片http链接列表
        })
    },
    saveImg: function (e) {
        console.log(e.currentTarget.dataset)
        let self = this
        let imgUrl = e.currentTarget.dataset.item
        wx.downloadFile({
            url: imgUrl,
            success: res => {
                console.log(res)
                let tempFilePath = res.tempFilePath
                wx.getSetting({
                    success: res => {
                        if (!res.authSetting['scope.writePhotosAlbum']) {
                            wx.authorize({
                                scope: 'scope.writePhotosAlbum',
                                success() {
                                    self.saveImageToPhotosAlbum(tempFilePath)
                                },
                                fail() {
                                    console.log('fail----')
                                    wx.showModal({ // 向用户提示升级至最新版微信。
                                        title: '授权失败',
                                        confirmColor: '#F45C43',
                                        content: '为成功保存图片，请重新授权。',
                                        mask: true,
                                        success: function (res) {
                                            wx.openSetting({
                                                success(res) {
                                                    console.log(res)
                                                    if (res.authSetting["scope.writePhotosAlbum"]) {
                                                        self.saveImageToPhotosAlbum(tempFilePath)
                                                    }
                                                }
                                            })
                                        }
                                    })
                                }
                            })
                        } else {
                            self.saveImageToPhotosAlbum(tempFilePath)
                        }
                    }
                })
            }
        })
    },
    saveImageToPhotosAlbum: function (tempFilePath) {
        wx.saveImageToPhotosAlbum({
            filePath: tempFilePath,
            success: function (data) {
                console.log(data.errMsg)
                if (data.errMsg == 'saveImageToPhotosAlbum:ok') {
                    util.successShowText('保存到本地成功')
                }
            },
            fail(err) {
                console.log('failsaveImageToPhotosAlbum----')
                console.log(err)
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