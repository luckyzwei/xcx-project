### 好无来

#### 发起秒杀
1. pages/sell/apply/index
  - 店铺认证
  - 姓名、手机号、店铺名称
2. pages/sell/secKill/index
  - 发起（创建）秒杀
  - 添加图片+名称+时间段+店铺地址+支付方式+取货方式
  - 图片裁剪插件[WeCropper](https://github.com/we-plugin/we-cropper)
3. pages/sell/poster/index
  - 生成海报
  - 转发到群：onShareAppMessage
  - 下载海报：wx.saveImageToPhotosAlbum
4. pages/sell/withdraw/index
  - 已发布的活动
  - 累计销售额
  - 可提现，有确定、取消按钮的提现modal
  - 终止活动
  - 分享：util.pageGo('/pages/sell/webView/index?updateState=1&scene=' + res.data.resultContent, 1);
  - 销售记录: `/pages/sell/record/index?scene=${e.currentTarget.dataset.id}
  - 数据分页展示
  ```
  <scroll-view scroll-y class="sell-withdraw-list" bindscrolltolower='getListLower'></scroll-view>


  pageInfo: {
      currentPage: 0,
      pageSize: 10,
      totalPage: 0
  }

  if (this.data.stop) {
      this.setData({
          stop: false
      });
      let pageInfo = this.data.pageInfo;
      let data = {
          currentPage: 0,
          pageSize: pageInfo.pageSize + 10
      };
      SELL.getProductList(data, res => {
          "use strict";
          //console.log(res);
          if (res.data.resultCode === '100') {
              if (res.data.resultContent.length > this.data.dataListLen) {
                  this.setData({
                      dataList: res.data.resultContent,
                      pageInfo: res.data.pageInfo,
                      dataListLen: res.data.resultContent.length,
                      stop: true
                  })
              } else {
                  util.ErrorTips(this, '没有更多了');
                  this.setData({
                      stop: true
                  })
              }
          } else {
              util.ErrorTips(this, res.data.detailDescription)
          }
      })
  }
  ```
5. pages/sell/record/index
  - 售后记录，
6. pages/sell/webView/index
  - [web-view](https://developers.weixin.qq.com/miniprogram/dev/component/web-view.html) 组件是一个可以用来承载网页的容器，会自动铺满整个小程序页面。
  - <web-view src='{{url}}'></web-view>
  - 外部生成的html
  ```
  onLoad: function (options) {
    //console.log(options);
    let urls = 'https://wx.gemii.cc/gemii/poster/index.html?id=' + options.scene + '&urlType=pro&updateState=' + options.updateState;
    if (options.scene) {
      this.setData({
        url: urls
      })
    }
  },
  ```
  - html2canvas.js生产base64图片
  - 外部H5跳转进入小程序
  ```
  wx.miniProgram.redirectTo({
      url: `/pages/sell/poster/index?dataUrl=${res2.resultContent}&scene=${parmas.id}&updateState=${parmas.updateState}`
  })
  ``` 
#### 发起砍价
1. pages/buyer/secKill/index
  - 距离秒杀时间还有多少
  - 抢购提醒／马上抢
  - 获取商品详情和获取商品sku信息
  - 提交商品购买： 在线支付 wx.requestPayment
  - 预计抢购倒计时
  - 抢购倒计时时间
2. pages/buyer/success/index
  - 秒杀成功
  - 商品和店铺展示
3. pages/buyer/address/index
  - 确定订单，填写姓名、手机号、收货地址
  - 收货地址
    - 需要访问微信自带的地址
    - 否：唤起设置
4. pages/buyer/logView/index
  - 发货通知
  - 接口返回一张图片
5.pages/buyer/bargain/bargain
  - 砍价页面
  - 已经砍价多少，还差多少


开发环境：

  砍价商品 IIr4 
  到店取货  IIrk 
  快递物流

  秒杀商品 IIrn 
  快递物流  IIrZ 
  到店取货