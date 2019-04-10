// pages/component/navigationBar/navigationBar.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    isBack:Boolean,
    heigthStatus:String,
    heightTitle: String
  },

  /**
   * 组件的初始数据
   */
  data: {
    // 触摸开始时间
    touchStartTime: 0,
    // 触摸结束时间
    touchEndTime: 0,
    // 最后一次单击事件点击发生时间
    lastTapTime: 0,
    scrollTopNum:0
  },

  /**
   * 组件的方法列表
   */
  methods: {
    //返回上一级
    _backAction(){
      if(getCurrentPages().length==1){
        wx.navigateTo({
          url: '/pages/index/index',
        })
      }else{
        wx.navigateBack({
          delta: 1
        })
      }
    },

    //返回首页
    _homeAction(){
      if (getCurrentPages().length == 1) {
        wx.navigateTo({
          url: '/pages/index/index',
        })
      } else {
        wx.navigateBack({
          delta:100
        })
      }
    },
    //滚动之后双击滚动顶部
    //必须要有 scroll-view 标签
    /**
     * ios：点击 <view class="status-bar" style="height:{{heigthStatus}}px"></view> 部分返回顶部
     * 安卓：点击<view class="title-bar" style="height:{{heightTitle}}px"></view>部分返回顶部
     */
    _doubleTap(e){
      let that = this
       // 控制点击事件在350ms内触发，加这层判断是为了防止长按时会触发点击事件
       if(that.touchEndTime - that.touchStartTime <350){
         // 当前点击的时间
         var currentTime = e.timeStamp
         var lastTapTime = that.lastTapTime
         // 更新最后一次点击时间
         that.lastTapTime = currentTime

         // 如果两次点击时间在300毫秒内，则认为是双击事件
         if (currentTime - lastTapTime < 300) {
           // 成功触发双击事件时，取消单击事件的执行
           clearTimeout(that.lastTapTimeoutFunc);
           that.setData({
             scrollTopNum: 0
           })

           //子传父方式
           const myEventDetail = {
             scrollTopNum: 0
           } // detail对象，提供给事件监听函数
           const myEventOption = {} // 触发事件的选项

           this.triggerEvent('scrolltop', myEventDetail, myEventOption)
         }
       }
   
      
    },
    /// 按钮触摸开始触发的事件
    _touchStart(e){
      this.touchStartTime = e.timeStamp;
    },
    // 按钮触摸结束触发的事件
    _touchEnd(e){
      this.touchEndTime = e.timeStamp
    }
  }
})
