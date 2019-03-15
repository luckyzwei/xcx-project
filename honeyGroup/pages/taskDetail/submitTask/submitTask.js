// pages/submitTask/submitTask.js
const app = getApp()
const util = require("../../../utils/util.js")
const API = require('../../../utils/api.js')
Page({

    /**
     * 页面的初始数据
     */
    data: {
        imgLists: [],
        showDel: false,
        submitImg: '',
        uploadBtn: false,
        textInput: '',
        shareText: '',
        imgId: [],
        unloadImg: [
            {}, {}, {}
        ],
        userTaskId: 0,
        detailTip: ''

    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        let self = this
        console.log(options, "options")
        self.setData({
            shareText: options.shareTip,
            detailTip: options.submitComment,
            userTaskId: options.userTaskId
        })

        if (options.params) {
            console.log(options.params);
            let params = JSON.parse(options.params);
            console.log(params);
            self.setData({
                shareText: params.shareTip,
                detailTip: params.submitComment,
                userTaskId: params.userTaskId
            })
        }

    },
    textInput: function (e) {
        console.log(e.detail.value)
        this.setData({
            textInput: e.detail.value
        })
    },
    confirmInput: function (e) {
        console.log('confirmInput')
        console.log(e.detail.value)
    },
    chooseImg: function () {
        let self = this
        if (self.data.imgLists.length == 0) {
            self.setData({
                showDel: false
            })
        } else {
            self.setData({
                showDel: true
            })
        }
        if (self.data.imgLists.length >= 3) {
            console.log('啊哦，您只能上传3张图片诶')
            self.setData({
                uploadBtn: true
            })
            util.showModal('上传失败', '啊哦，您只能上传3张图片诶~')
        } else {
            let amount = 3 - self.data.imgLists.length
            console.log(amount)
            wx.chooseImage({
                count: amount, // 默认9
                sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有
                sourceType: ['album'], // 可以指定来源是相册还是相机，默认二者都有
                success: function (res) {
                    // 返回选定照片的本地文件路径列表，tempFilePath可以作为img标签的src属性显示图片
                    // var tempFilePaths = res.tempFilePaths
                    // console.log(res.tempFilePaths)
                    self.setData({
                        imgLists: self.data.imgLists.concat(res.tempFilePaths),
                        showDel: true
                    })
                    console.log(self.data.imgLists)

                }
            })

        }

    },
    bindFormSubmit: function (e) {
        console.log(e.detail.formId)
        let formId = e.detail.formId
        let self = this
        let submitImgs = []
        let unloadImgs = self.data.unloadImg

        util.getFormId(formId, app)
        // console.log(self.data.textInput)
        if (self.data.imgLists.length == 0) {
            util.showModal('提交失败', '请至少上传一张截图')
        } else {
            let screenImg = self.data.imgLists.slice(0, 3)
            console.log(screenImg)

            for (var i = 0; i < screenImg.length; i++) {
                wx.uploadFile({
                    url: API.uploadImg, //文件服务器url
                    filePath: self.data.imgLists[i],
                    name: 'file',
                    formData: {
                        'user': 'test'
                    },
                    success: function (res) {
                        console.log(res)
                        var jsonStr = res.data
                        let picId = self.data.imgId
                        // console.log(jsonStr)

                        if (res.statusCode == '413') {
                            util.showModal('提交失败', '您上传的图片文件太大~')

                        } else if (res.statusCode == '200') {
                            jsonStr = jsonStr.replace(" ", "");
                            if (typeof jsonStr != 'object') {
                                jsonStr = jsonStr.replace(/\ufeff/g, ""); //重点
                                var datas = JSON.parse(jsonStr);
                                if (datas.resultCode == '100') {
                                    // console.log(datas.resultContent)
                                    submitImgs.push(datas.resultContent.url)
                                    picId.push(datas.resultContent.id) //文件服务器图片对应ID
                                    if (submitImgs.length == screenImg.length) {
                                        console.log(submitImgs)
                                        self.setData({
                                            submitImg: submitImgs
                                        })
                                        unloadImgs.length = screenImg.length;
                                        for (var i = 0; i < screenImg.length; i++) {
                                            unloadImgs[i]['fileType'] = 'image'
                                            unloadImgs[i]['fileId'] = picId[i]

                                        }
                                        console.log(unloadImgs)
                                        console.log(self.data, 'self.data')
                                        let datas = {
                                            "recordFiles": unloadImgs,
                                            "suggestion": self.data.textInput,
                                            "userTaskId": self.data.userTaskId
                                        }
                                        //任务提交
                                        app.fetchToken(API.submitTask, 'POST', datas, (err, res) => {
                                            if (res.resultCode == '100') {
                                                wx.showModal({
                                                    title: '提交成功',
                                                    content: '您的任务提交成功啦~',
                                                    confirmColor: '#FF6666',
                                                    confirmText: '知道了',
                                                    showCancel: false,
                                                    success: function () {
                                                        wx.redirectTo({
                                                            url: '/pages/index/index'
                                                        })
                                                    }
                                                })
                                            } else if (res.resultCode == '02529015') {
                                                util.showModal('提交失败', '您已经提交过了，不能重复提交哦~')
                                            } else {
                                                util.showModal('提交失败', '网络不好，再试试咯~')
                                            }
                                        })
                                    }
                                }
                            }
                        } else {
                            util.showModal('提交失败', '网络不好，再试试咯~')
                        }
                    }
                })
            }
        }
    },
    delImg: function (e) {
        let self = this
        var imgList = self.data.imgLists
        let id = e.currentTarget.dataset.id
        for (var i = 0; i < imgList.length; i++) {
            if (id === i) {
                imgList.splice(i, 1)
            }
        }
        self.setData({
            imgLists: imgList
        })
        if (self.data.imgLists.length == 0) {
            self.setData({
                showDel: false
            })
        }
        console.log(self.data.imgLists)
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