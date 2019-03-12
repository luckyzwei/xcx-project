栗子集市

在栗子集市app的基础上开发的一款小程序，用于商品推广，
但是在2018年6月份，栗子集市app下架，小程序也随之作废

1. pages/index/index
    - 个人中心
    - 订单管理
    - 我的收获地址
        - 微信授权失败，跳转 `pages/adr/index`
- pages/order/index
    - 订单管理（全部、待支付、待发货、已发货、已完成）
    ```
    <scroll-view wx:else scroll-y class="content" bindscrolltolower='loadMoreList'></scroll-view>

    ```
    - 查看订单详情：`/pages/orderDetail/orderDetail?orderNo=${orderNo}&purchaseInsId=${purchaseInsId}`
    - 申请售后(填写售后信息):'/pages/refund/iptMessage/iptMessage?refundStutas=' + e.detail.value + '&purid=' + this.data.purid + '&orderid=' + this.data.orderid
    - 售后详情:'/pages/refund/refundDetail/refundDetail?nums=' 
    - 支付订单
    - 取消订单
    - 确认收货
    - 查物流:`/pages/logistics/logistics?orderId=${orderId}&orderNo=${orderNo}`
- pages/adr/index
    - 我的收获地址
- pages/PDetail/detail
    - 商品详情
    - 富文本wxParse插件
- pages/pay/pay
    - 等待买家付款
    - 添加地址
    - 需要微信授权：wx.chooseAddress
    - 微信支付：wx.requestPayment
- pages/IdCard/IdCard
    - 身份认证：姓名+身份证
- pages/orderDetail/orderDetail
    - 订单详情
- pages/logistics/logistics
    - 查物流
- pages/refund/refund
    - 售后记录
- pages/refund/iptMessage/iptMessage
    - 填写售后信息
"pages/refund/iptNum/iptNum",
    - 查询快递信息
- pages/refund/refundDetail/refundDetail
    - 售后详情
- pages/sucessPay/sucessPay
    - 付款成功
    - 查看订单
    - 个人中心
- pages/store/store
    - 栗子集市商铺
    - 店铺推荐


