// pages/sell/history/index.js
const app = getApp();
let util = require('../../../utils/util');
let SELL = require('../../../utils/sellFetch');


import WeCropper from '../../../we-cropper/we-cropper.js'

const device = wx.getSystemInfoSync()
// console.log(device);
const width = device.windowWidth
// console.log(width);
const height = device.windowHeight - 50
// console.log(height);

Page({
    /**
     * 页面的初始数据
     */
    data: {
        showStatus: false,
        cropperOpt: {
            id: 'cropper',
            width,
            height,
            scale: 2.5,
            zoom: 8,
            cut: {
                x: (width - 300) / 2,
                y: (height - 300) / 2,
                width: 300,
                height: 300
            }
        },
        popErrorMsg: null,//错误提示
        stop: true,//阻止机制
        killStatus: false,//秒杀时间选择
        startH: null,
        endH: null,
        startM: null,
        endM: null,
        valueInit: null,//选择后value数组
        killDate: '',//秒杀时间显示
        BargainDate: null,//砍价日期
        BargainTime: null,//砍价时间
        fromData: {
            mediaItems: [{
                mediaId: null,//图片id
                path: null,//图片path
            }],//图片信息
            name: null,//商品标题
            costPrice: null,//秒杀价
            marketPrice: null,//市场价
            bargainQuantity: null,//砍价次数
            totalQuantity: null,//库存
            effectiveDate: null,//开始时间
            expiredDate: null,//结束时间
            address: null,//地址
            phone: null,//联系方式
            description: null,//商品描述
            storeName: null,//门店名称
            wechatNo: null,//商家微信号
            paymentType: 3,//支付方式 支付方式，0--线下支付/门店支付 3--微信支付 4--支付宝支付 ,
            takingType: 1,//取货方式，1--到店取货 2--快递 3--无需取货
        },
        takingTypeState: true,//快递物流btn显示状态
        takingTypeStatus: false,//组件显示状态
        imgList: [],//上传图片数组
        selectImgData: {},
        updateImg: false,//是否是更新图片
        typeStatus: false,//砍价true，秒杀false
        typeText: "发起秒杀",//秒杀，砍价
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        let typeStatus = false;
        let typeText = "发起秒杀";
        if (options.type === "bargain") {
            console.log("砍价");
            wx.setNavigationBarTitle({
              title: '发起砍价'
            });
            typeText = "生成海报";
            typeStatus = true;
            this.setData({
                'fromData.phoneNum': wx.getStorageSync("phoneNum")
            });
            const { cropperOpt } = this.data;
            new WeCropper(cropperOpt).on('ready', (ctx) => {}).on('beforeImageLoad', (ctx) => {
                    wx.showToast({
                        title: '上传中',
                        icon: 'loading',
                        duration: 20000
                    })
                }).on('imageLoad', (ctx) => {wx.hideToast()})
        } else if (options.type === "seckill") {
            console.log("秒杀");
            typeStatus = false;
            typeText = "发起秒杀";
            this.setData({
                'fromData.phoneNum': null
            })
        }
        this.setData({
            stop: true,
            typeStatus: typeStatus,
            typeText: typeText
        });
        const { cropperOpt } = this.data;
        if (options.id) {
            this.setData({
                id: options.id
            })
        }
        SELL.getShopMessage(res => {
            "use strict";
            if (res.data.resultCode === '100' && res.data.resultContent.length) {
                this.setData({
                    'fromData.storeName': res.data.resultContent[0].name,
                    'fromData.phone':wx.getStorageSync('bargainPhone'),
                    'fromData.address': res.data.resultContent[0].detailAddr
                })
            }
        })
        new WeCropper(cropperOpt)
            .on('ready', (ctx) => {})
            .on('beforeImageLoad', (ctx) => {
                wx.showToast({
                    title: '上传中',
                    icon: 'loading',
                    duration: 20000
                })
            })
            .on('imageLoad', (ctx) => {
                wx.hideToast()
            })
            .on('beforeDraw', (ctx, instance) => {
            })
            .updateCanvas()
    },
    onShow: function () {
        this.setData({
            stop: true,
            BargainDate: "请选择日期",
            BargainTime: "时间"
        });
    },
    selectImg: function (e) {
        if (e.currentTarget.dataset.imgstate) {
            this.setData({
                updateImg: false
            })
        } else {
            this.setData({
                updateImg: true
            })
        }
        this.uploadTap();
    },//添加图片
    changeImgNav: function (e) {
        this.setData({
            selectImgData: e.currentTarget.dataset.item
        })
    },//切换图片
    deleteImg: function (e) {
        let date = e.currentTarget.dataset.img;
        let dates = this.data.imgList;
        dates.splice(date.value, 1);
        let selectImgData = {};
        if (dates.length) {
            for (let i = 0; i < dates.length; i++) {
                dates[i].value = i
            }
            selectImgData = dates[0]
        }
        this.setData({
            imgList: dates,
            selectImgData: selectImgData
        })
    },//删除图片
    changeName: function (e) {
        "use strict";
        this.setData({
            'fromData.name': e.detail.value
        })
    },//填写姓名
    changeKillPrice: function (e) {
        "use strict";
        this.setData({
            'fromData.costPrice': e.detail.value
        })
    },//填写秒杀价
    changeOldPrice: function (e) {
        "use strict";
        this.setData({
            'fromData.marketPrice': e.detail.value || null
        })
    },//填写原价
    changeBargainNum: function (e) {
        this.setData({
            'fromData.bargainQuantity': e.detail.value || null
        })
    },//砍价次数
    changeNum: function (e) {
        "use strict";
        this.setData({
            'fromData.totalQuantity': e.detail.value || null
        })
    },//填写库存
    bindChange: function (e) {
        this.setData({
            valueInit: e.detail.value
        });
    },//选择秒杀时间
    confirmDateModule: function () {
        let valueInit = this.data.valueInit;
        let { startH, startM, endH, endM } = this.data;
        if (!valueInit) {
            util.ErrorTips(this, '请选择秒杀时间');
            return;
        }
        let killDate = `${startH[valueInit[0]]}:${startM[valueInit[1]]}`;
        let killEndDate = `${endH[valueInit[2]]}:${endM[valueInit[3]]}`;
        if (startH[valueInit[0]] > endH[valueInit[2]]) {
            util.ErrorTips(this, '结束时间必须大于开始时间');
            return;
        } else if (startH[valueInit[0]] === endH[valueInit[2]] && startM[valueInit[1]] >= endM[valueInit[3]]) {
            util.ErrorTips(this, '结束时间必须大于开始时间');
            return;
        } else {
            this.setData({
                killDate: killDate + ' 到 ' + killEndDate,
                'fromData.effectiveDate': updateTime(killDate),
                'fromData.expiredDate': updateTime(killEndDate)
            }, () => {
                "use strict";
                console.log('秒杀时间为：' + this.data.killDate + '到' + this.data.killEndDate)
            });
            this.closeDateModule()
        }
    },//确定秒杀时间
    closeDateModule: function () {
        this.setData({
            killStatus: false
        })
    },//关闭秒杀时间
    showDateModule: function () {
        "use strict";
        this.setData({
            killStatus: true,
            valueInit: null,
            killDate: null
        })
        let dateNew = new Date();
        let newH = dateNew.getHours();
        let startH = [];
        let startM = [];
        for (let i = newH; i < 24; i++) {
            startH.push(util.formatZero(i))
        }
        for (let i = 0; i < 60; i++) {
            startM.push(util.formatZero(i))
        }
        this.setData({
            startH: startH,
            endH: startH,
            startM: startM,
            endM: startM
        })
    },//打开秒杀时间
    bindBargainDateChange: function (e) {
        this.setData({
            BargainDate: e.detail.value
        })
    },//选择砍价结束日期
    bindBargainTimeChange: function (e) {
        this.setData({
            BargainTime: e.detail.value
        })
    },//选择砍价结束时间
    paymentTypeChange: function (e) {
        if (e.detail.value == 8) {
            this.setData({
                'fromData.takingType': 1,
                takingTypeState: false
            })
        } else {
            this.setData({
                takingTypeState: true
            })
        }
        this.setData({
            'fromData.paymentType': e.detail.value
        })
    },//选择支付方式
    takingTypeChange: function (e) {
        this.setData({
            'fromData.takingType': e.detail.value
        })
        if (e.detail.value == 2) {
            this.setData({
                takingTypeStatus: true
            });
            if (!this.data.fromData.wechatNo) {
                SELL.weChatNo(res => {
                    console.log(res)
                    if (res.data.resultCode === '100') {
                        this.setData({
                            "fromData.wechatNo": res.data.resultContent ? res.data.resultContent : null
                        })
                    }
                })
            }
        } else {
            this.setData({
                takingTypeStatus: false
            })
        }
    },//选择取货方式
    changeSellNum: function (e) {
        console.log(e.detail.value);
        this.setData({
            'fromData.wechatNo': e.detail.value
        })
    },//商家微信号
    changeStoreName: function (e) {
        this.setData({
            'fromData.storeName': e.detail.value
        })
    },//名店名称
    changeAdr: function () {
        if (wx.chooseAddress) {
            let _this = this;
            wx.chooseAddress({
                success: res => {
                    let adr = res.provinceName + res.cityName + res.countyName + res.detailInfo;
                    _this.setData({
                        'fromData.address': adr
                    })
                },
                fail: req => {
                    "use strict";
                    wx.showModal({ // 向用户提示需要权限才能继续
                        title: '提示',
                        content: '您未正确选择地址，将无法使用收货地址，请重新授权或选择地址',
                        mask: true,
                        confirmColor: '#F45C43',
                        success: function (res) {
                            if (res.confirm) {
                                wx.openSetting({ //打开授权开关界面，让用户手动授权
                                    success: (res) => {
                                        if (res.authSetting["scope.address"]) {
                                            wx.chooseAddress({
                                                success: res => {
                                                    let adr = res.provinceName + res.cityName + res.countyName + res.detailInfo;
                                                    _this.setData({
                                                        'fromData.address': adr
                                                    })
                                                }
                                            })
                                        } else {
                                            console.log('reject authrize')
                                        }
                                    }
                                })
                            } else if (res.cancel) {
                                wx.redirectTo({
                                    url: `/pages/adr/index?getAdr=1&goods=${JSON.stringify(self.data.returnGoods)}`
                                })
                            }
                        }
                    })
                }
            })
        } else {
            console.log('当前微信版本不支持chooseAddress');
        }
    },//选择地址
    changePhoneNum: function (e) {
        this.setData({
            'fromData.phone': e.detail.value
        })
    },//填写手机号码，联系方式
    changeDesc: function (e) {
        "use strict";
        this.setData({
            'fromData.description': e.detail.value
        })
    },//填写描述
    submitKill: function () {
        let { stop, fromData, imgList, takingTypeStatus } = this.data;
        console.log(fromData, '发起秒杀参数');
        if (!takingTypeStatus) {
            if (!fromData.address || !fromData.storeName) {
                util.ErrorTips(this, '请完成店铺信息的填写');
                return;
            }
            if (this.data.typeStatus) {
                if (!fromData.phone) {
                    util.ErrorTips(this, '请填写手机号码');
                    return;
                }else {
                    wx.setStorageSync('bargainPhone', fromData.phone);
                }
            }
        } else {
            if (!fromData.wechatNo) {
                util.ErrorTips(this, '请完成商家微信号的填写');
                return;
            }
        }
        //判断砍价
        if (this.data.typeStatus) {
            if (!fromData.bargainQuantity) {
                util.ErrorTips(this, "请填写砍价次数");
                return;
            }
            //判断砍价时间
            if (this.data.BargainDate === "请选择日期" || this.data.BargainTime === "时间") {
                util.ErrorTips(this, "请完善砍价活动结束时间");
                return;
            } else {
                let nowDate = Date.now();
                let endTime = new Date(this.data.BargainDate + " " + this.data.BargainTime).getTime();
                let chaTime = endTime - nowDate;
                if (chaTime <= 60 * 60 * 1000) {
                    util.ErrorTips(this, "时间间隔必须大于1个小时");
                    return;
                }
                this.setData({
                    "fromData.effectiveDate": nowDate,
                    "fromData.expiredDate": endTime
                })
            }
        }
        if (!imgList.length || !Number(fromData.costPrice) || !fromData.paymentType
            || !fromData.name) {
            util.ErrorTips(this, '请完成商品属性的填写');
            return;
        } else if (Number(fromData.marketPrice) && Number(fromData.marketPrice) <= Number(fromData.costPrice)) {
            util.ErrorTips(this, '秒杀价不得低于原价');
            return;
        } else {
            if (stop) {
                this.setData({
                    stop: false
                });
                if (fromData.totalQuantity === 'null' || fromData.totalQuantity === '0' || !fromData.totalQuantity || fromData.totalQuantity === '0.0' || fromData.totalQuantity === '0.00') {
                    fromData.totalQuantity = 1;
                }
                fromData.mediaItems = this.data.imgList;
                if (takingTypeStatus) {
                    fromData.address = null;
                    fromData.storeName = null;
                } else {
                    fromData.wechatNo = null
                }
                if(this.data.typeStatus){
                    //砍价商品
                    console.log("砍价商品");
                    SELL.createBargain(fromData,res=>{
                        if (res.data.resultCode === '100') {
                            wx.removeStorageSync('bargainBuyId');
                            util.pageGo('/pages/sell/webView/index?updateState=1&scene=' + res.data.resultContent, 1);
                        } else {
                            util.ErrorTips(this, res.data.detailDescription)
                        }
                    })
                }else {
                    //秒杀商品
                    console.log("秒杀商品");
                    SELL.createProduct(fromData, res => {
                        "use strict";
                        if (res.data.resultCode === '100') {
                            util.pageGo('/pages/sell/webView/index?updateState=1&scene=' + res.data.resultContent, 1);
                        } else {
                            util.ErrorTips(this, res.data.detailDescription)
                        }
                    })
                }
            }
        }
    },//提交秒杀参数
    formSubmit: function (e) {
        util.formSubmit(e)
    },
    touchStart(e) {
        this.wecropper.touchStart(e)
    },
    touchMove(e) {
        this.wecropper.touchMove(e)
    },
    touchEnd(e) {
        this.wecropper.touchEnd(e)
    },
    getCropperImage() {
        let _this = this;
        if (this.data.stop) {
            this.setData({
                stop: false
            });
            this.wecropper.getCropperImage((src) => {
                if (src) {
                    console.log(src, 'tupianlianjie');
                    util.downloadImg(src, res => {
                        let imgObj = {
                            path: res.url,
                            mediaId: res.id,
                            value: isNaN(_this.data.selectImgData.value) ? 0 : (this.data.selectImgData.value + 1)
                        };
                        let imgList = [];
                        if (_this.data.updateImg) {
                            if (_this.data.imgList.length) {
                                let upDate = _this.data.imgList;
                                upDate[this.data.selectImgData.value].path = imgObj.path;
                                upDate[this.data.selectImgData.value].mediaId = imgObj.mediaId;
                                imgObj.value = imgObj.value - 1;
                                imgList = upDate;
                            } else {
                                imgList = _this.data.imgList.concat(imgObj);
                            }
                        } else {
                            imgList = _this.data.imgList.concat(imgObj);
                        }
                        _this.setData({
                            selectImgData: imgObj,
                            imgList: imgList,
                            showStatus: false,
                            stop: true
                        })
                    })
                    // wx.previewImage({
                    //     current: '', // 当前显示图片的http链接
                    //     urls: [src] // 需要预览的图片http链接列表
                    // })
                } else {
                    _this.setData({
                        stop: true
                    });
                    util.ErrorTips(_this, '获取图片地址失败，请稍后重试')
                    //console.log('获取图片地址失败，请稍后重试')
                }
            })
        }
    },
    uploadTap() {
        const self = this
        wx.chooseImage({
            count: 1, // 默认9
            sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有
            sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
            success(res) {
                const src = res.tempFilePaths[0]
                //  获取裁剪图片资源后，给data添加src属性及其值
                self.setData({
                    showStatus: true
                });
                self.wecropper.pushOrign(src)
            }
        })
    }
})

function updateTime(str) {
    let date = new Date();
    let Y = date.getFullYear();
    let M = date.getMonth() + 1;
    let D = date.getDate();
    let timer = Y + '/' + M + '/' + D + ' ' + str;
    let timers = new Date(timer).getTime();
    return timers;
}
