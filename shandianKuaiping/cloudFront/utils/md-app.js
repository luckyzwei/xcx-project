// 参数： pathname, eventName [, options]
// pathname
// eventName
// options

// ['eventName',...]
! function (n, o) {
    "object" == typeof exports && "undefined" != typeof module ? module.exports = o() : "function" == typeof define && define.amd ? define(o) : n.G_SDK = o()
}(this, function () {
    // 域名 需要手动配置
    var config = require("./md-app-conf")
    var __host = config.host;
    // siteid 需要手动设置
    var __site = config.site;
     // 设置cookie
    function __setCookie(name, value) {
        wx.setStorageSync(name,value)
    }

    // 获取cookie
    function __getCookie(name) {
      return wx.getStorageSync(name)
    }

    // ajax请求
    // url 链接
    // type 请求类型
    // data 请求数据
    // successCall 成功回调
    // errCall 失败回调
    function __ajax(conf){
        var {url,type,data,successCall,errCall} = conf
        wx.request({
          url: url,
          method: type,
          data: data
        })
    }

    // 生成唯一标识
    function __uuid() {
        return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
            var r = Math.random()*16|0, v = c == 'x' ? r : (r&0x3|0x8);
            return v.toString(16);
        });
    }

    function getUUID() {
        var uuid = __getCookie('gemii_uuid')
        var gemii_vaild = __getCookie('gemii_vaild')
        var currentTime = new Date().getTime()

        if (!uuid || currentTime > gemii_vaild){
          uuid = __uuid()
          __setCookie('gemii_uuid', uuid)
          __setCookie('gemii_vaild', currentTime+24*3600*1000)
        }
        return uuid
    }

    function SDK() {
        this.uuid = getUUID()
         // laoding
        this.loading = function(){
            var ar = arguments
            var __pathname = ar[0]
            var url = `${__host}/e/?_s=${__site}&_p=${encodeURIComponent(__pathname)}&_u=${this.uuid}&_e=__LOADING__`
            __ajax({
                url: url,
                type:'get',
                data: null
            })
        }

        this.loaded = function () {
            var ar = arguments
            var __pathname = ar[0]
            var url = `${__host}/e/?_s=${__site}&_p=${encodeURIComponent(__pathname)}&_u=${this.uuid}&_e=__LOADED__`
            __ajax({
                url: url,
                type:'get',
                data: null
            })
        }

        // 事件
        this.push = function () {
            var ar = arguments
            var __pathname = ar[0]
            var __event = ar[1]
            var url = `${__host}/e/?_s=${__site}&_p=${encodeURIComponent(__pathname)}&_u=${this.uuid}&_e=${__event}`
            if(ar.length>2){
                for(var i=2;i<ar.length;i++){
                    url = `${url}&_a${i-2}=${ar[i]}`
                }
            }
            __ajax({
                url: url,
                type:'get',
                data: null
            })
        }
    }

    return new SDK()
})