// pages/integralStore/goodsDetail/goodsDetail.js
const app = getApp()
const util = require("../../../utils/util.js")
const API = require('../../../utils/api.js')
Page({

  /**
   * 页面的初始数据
   */
  data: {
  url:'',
  title:'',
  exchange:0,
  stock:0,//库存
  addressInfo:false,
  liziAmount:0,
  detialImg:'',
  ifExchange:true,//按钮文案立即兑换
  scrollH: 0,
  logistics:false,//查看物流
  ExpressNumber:'',//快递单号
  logisticCompany:'',//物流公司
  virtualGoods:false,//是否虚拟商品
  link:'www.gemii.cc',
  tips:'',//虚拟商品链接描述
  changeCode:'',//兑换码
  goodsId:0,//商品ID
  receivePhone:13435355322,
  receiveAddress:'',//收货地址
  userName:'',//收货人
  description:'',
  showAddress:true,
  showLink:true,
  checkCode:false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(options)
    let self=this
    self.setData({
      ifExchange:options.selled
    })
    if(options.route=='integral'){
       let optionId=options.id
       let sellOut=options.selled
       // 兑换商品详情数据
       self.integralData(optionId,sellOut)
    }else if(options.route=='account'){
      self.setData({
        logistics:true
      })
      let ticketId=options.ticketId
      //账本商品详情数据
      self.accountData(ticketId)
    }
  
    // 详情文案断句
    let tip=self.data.tips
        tip.replace(/;/g,"\n");
    self.setData({
      tips:tip
    })
  },
  onShow:function(){

  },
  exChange:function(){
    let self=this
    if(!self.data.addressInfo&&!self.data.virtualGoods){
        util.showModal('兑换失败', '请填写收件地址后继续兑换')
    }else{
      //  let datas=self.data.goodsId+'&receiveName='+self.data.userName+'&receivePhone='+self.data.receivePhone+'&receiveAddress='+self.data.receiveAddress
        let datas = {
          "goodsId": self.data.goodsId,
          "receiveAddress": self.data.receiveAddress,
          "receiveName": self.data.userName,
          "receivePhone": self.data.receivePhone
        }
        console.log(datas)
                
        util.waitShow()
        app.fetchToken(API.exChange, 'POST', datas, (err, res) => {
          util.waitHide()
            if(res.resultCode=='100'){
               wx.showModal({
                  title: '兑换成功',
                  content: '恭喜您，已兑换成功啦~',
                  mask: true,
                  confirmColor: '#FF6666',
                  confirmText: '确认',
                  showCancel: false,
                  success:(res)=>{
                    if (res.confirm) {
                      wx.redirectTo({
                        url:'/pages/integralStore/integralStore'
                      })
                    }
                  }
               })
            }else if(res.resultCode=='101'){
              util.showModal('兑换失败','很遗憾，您未兑换成功~')
            }else if(res.resultCode=='02529100'){
              util.showModal('兑换失败','很遗憾，您的账户余额不足~')
            }else if(res.resultCode=='02529102'){
              util.showModal('兑换失败','很遗憾，当前商品库存不足')
            }else if(res.resultCode=='02529130'){
              util.showModal('兑换失败','很遗憾，当前领取次数不足~')
            }
        })
    }
  },
  logistics:function(){
    let self=this
    var content=''
    var title=''
    var confirmText=''
    var data=''
    if(self.data.checkCode){
      title='兑换码'
      confirmText='复制'
      content='您的兑换码是：'+self.data.changeCode
      data=self.data.changeCode
      util.modalCallback(title,content,confirmText,data) 

    }else{
      if(self.data.logisticCompany==null&&self.data.ExpressNumber==null||self.data.ExpressNumber==''){
       util.showModal('物流信息','该商品暂未发货~')

      }else{
        content=self.data.logisticCompany+': '+self.data.ExpressNumber
        title='物流信息'
        confirmText='复制单号'
        data=self.data.ExpressNumber
        util.modalCallback(title,content,confirmText,data)
      }
    }
  },
  copyLink:function(){
     wx.setClipboardData({
              data: this.data.link,
              success: res=>{
                 console.log(res)
                 util.successShowText('复制链接成功')
              }
     })
  },
  integralData:function(optionId,sellOut){
       let self=this
       let urlPrefix = API.imgFileId//拼接图片
       // console.log(optionId+sellOut)
       util.waitShow()
       app.fetchToken(API.goodsDetail+optionId, 'GET', '', (err, res) => {
          util.waitHide()
          if(res.resultCode=='100'){
           self.setData({
            title:res.resultContent.name,
            exchange:res.resultContent.usedCount,
            liziAmount:res.resultContent.useIntegral,
            stock:res.resultContent.freeCount,
            description:res.resultContent.description,
            goodsId:res.resultContent.id
           })
           let files=res.resultContent.files
             // 拼接图片
             self.jointImg(files)
           if(res.resultContent.type=='1'){
              self.setData({
                virtualGoods:true,
                tips:res.resultContent.description,
                link:res.resultContent.cdKeyUrl
              })
               if(res.resultContent.cdKeyUrl==null){
                self.setData({
                  showLink:false
                })
               }
           }else{
            self.setData({
              virtualGoods:false
            })
           }
          }else{
            util.showModal('加载失败','服务开了点小差，您稍后再试试吧~')
          }
            
           // 是否显示收货地址
            if(sellOut == 'true' && self.data.virtualGoods==false){
              // console.log('showAddress'+self.data.virtualGoods)
              self.setData({
                showAddress:true
              })
            }else{
              self.setData({
                showAddress:false
              })
            }
       })
  },
  accountData:function(ticketId){
    // console.log(ticketId)
    let self=this
      util.waitShow()
      app.fetchToken(API.accountDetail+ticketId+'/detail', 'GET', '', (err, res) => {
        util.waitHide()
          if(res.resultCode=='100'){
            self.setData({
              userName:res.resultContent.receiveName,
              showAddress:true,
              addressInfo:true,
              title:res.resultContent.goodsName,
              logisticCompany:res.resultContent.expressname,
              ExpressNumber:res.resultContent.trackingNum,
              liziAmount:res.resultContent.useIntegral,
              description:res.resultContent.description,
              changeCode:res.resultContent.cdKeyCode,
              receiveAddress:res.resultContent.receiveAddress
            })
            if(res.resultContent.type==1){
              self.setData({
                checkCode:true,
                showAddress:false
              })
            }
             let files=res.resultContent.files
             // 拼接图片
             self.jointImg(files)
          }else{
            util.showModal('加载失败','服务开了点小差，您稍后再试试吧~')
          }
      })
  },
  exchangeCode:function(){
    let self=this
    let datas = {"goodsId":self.data.goodsId}
        // console.log(datas)
        util.waitShow()
        app.fetchToken(API.exChange, 'POST', datas, (err, res) => {
             self.setData({
               changeCode :res.resultContent
             })
            let content='您的兑换码是：'+res.resultContent
            util.waitHide()
            if(res.resultCode=='100'){
               wx.showModal({
                  title: '兑换成功',
                  content: content,
                  mask: true,
                  confirmColor: '#FF6666',
                  confirmText: '确认',
                  showCancel: false,
                  success:(res)=>{
                    if (res.confirm) {
                       wx.setClipboardData({
                        data: self.data.changeCode,
                        success: res=>{
                           console.log(res)
                           util.successShowText('复制兑换码成功')
                           // setTimeout(function(){
                           //  wx.redirectTo({
                           //    url:'/pages/integralStore/integralStore'
                           //  })
                           // },2000)
                        }
                      })
                    }
                  }
               })
            }else if(res.resultCode=='101'){
              util.showModal('兑换失败','很遗憾，您未兑换成功~')
            }else if(res.resultCode=='02529100'){
              util.showModal('兑换失败','很遗憾，您的账户余额不足~')
            }else if(res.resultCode=='02529102'){
              util.showModal('兑换失败','很遗憾，当前商品库存不足')
            }else if(res.resultCode=='02529130'){
              util.showModal('兑换失败','很遗憾，当前领取次数不足~')
            }else{
              util.showModal('兑换失败','很遗憾，您目前还不能兑换商品~')
            }
        })
  },
  editAddress: function() {
        let self = this
        if (wx.chooseAddress) {
            wx.chooseAddress({
                success: res => {
                    console.log(JSON.stringify(res))
                    self.chooseAddress(res)
                },
                fail: err => {
                    console.log(JSON.stringify(err))
                    if (err.errMsg == 'chooseAddress:cancel') {
                        return
                    }
                    wx.showModal({ // 向用户提示需要权限才能继续
                        title: '提示',
                        content: '您未正确选择地址，将无法使用收货地址，请重新授权或选择地址',
                        mask: true,
                        confirmColor: '#F45C43',
                        success: function(res) {
                            if (res.confirm) {
                                console.log('用户点击确定')
                                wx.openSetting({ //打开授权开关界面，让用户手动授权
                                    success: (res) => {
                                        console.log(res)
                                        if (res.authSetting["scope.address"]) {
                                            wx.chooseAddress({
                                                success: res => {
                                                    console.log(res)
                                                    self.chooseAddress(res)
                                                }
                                            })
                                        } else {
                                            console.log('reject authrize')
                                        }
                                    }
                                })
                            } else if (res.cancel) {
                                console.log('用户点击取消')
                            }
                        }
                    })
                }
            })
        } else {
            console.log('当前微信版本不支持chooseAddress');
        }
  },
  chooseAddress: function(res) {
        this.setData({
          receivePhone:res.telNumber,
          receiveAddress:res.cityName+res.countyName+res.detailInfo,
          userName:res.userName,
          addressInfo:true
        })
  },
  jointImg:function(files){
    let self=this
    let urlPrefix = API.imgFileId//拼接图片
           for(let i=0;i<files.length;i++){
              if(files[i].type=='0'){
                self.setData({
                  url:urlPrefix+files[i].fileId
                })
              }else if(files[i].type=='1'){
                self.setData({
                  detialImg:urlPrefix+files[i].fileId
                })
              }
           }
  },
  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
        let unionId = wx.getStorageSync('unionid')

        var titles = '加入闺蜜团和千万妈妈一起分享育儿经验';
        var paths = '/pages/index/index?unionId=' + unionId;
        var urls = '/images/share.png'
        return app.shareIndex(titles, paths, urls)
  }
})