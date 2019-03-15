let Promise = require('./es6-promise');

function wxPromisify(fn) {
  
    return function (obj = {}) {
      
        return new Promise((resolve, reject) => {
          
            obj.success = function (res) {
                console.log("请求成功123，返回数据：");
                console.log("当前请求token" + wx.getStorageSync('access_token'));
                console.log(res.data);
                wx.hideToast();
                wx.hideLoading();
                resolve(res.data)
            }
            obj.fail = function (req) {
                console.log("请求失败，返回数据：");
                console.log("当前请求token" + wx.getStorageSync('access_token'));
                console.log(req);
                wx.hideLoading();
                wx.hideToast();
                reject(req);
            }
            fn(obj);
        })
    }
}

Promise.prototype.finally = function (callback) {
    let P = this.constructor;
    return this.then(
        value => P.resolve(callback()).then(() => value),
        reason => P.resolve(callback()).then(() => {
            throw reason
        })
    );
};

/**
 * 微信请求，以是否有token传入判断是否走鉴权
 */

function wxRequest(params = {}, url) {
    console.log(params,'-------------')
    let data = params.query || {};
    console.log(url);
    console.log('→data：');
    console.log(data);
    var toastString = "加载中";
  if (url.indexOf("/comment/addComment") != -1) {
    toastString = '发送中';
  }
 
  if (url.indexOf("/thumbup/addThumbup") == -1 && url.indexOf("/getAllPrimaryComments") == -1 && url.indexOf("/getChildCommentsByParentId") == -1 && url.indexOf("/article/list") == -1 && url.indexOf("/article/myBrowseRecord") == -1) {
    if (url.indexOf("/article/mergeImage") != -1) toastString = '拼图中...'
      wx.showToast({
        title: toastString,
        icon: 'loading',
        duration: 10000
      });
    }
    let wxtRequest = wxPromisify(wx.request);
    let headers = {
        'Content-Type': 'application/json;charset=UTF-8'
    };
    if (params.token) {
        headers = {
            'Content-Type': 'application/json;charset=UTF-8',
            "Authorization": params.token.type + ' ' + params.token.value
        }
    }
    console.log(params)
    

    return wxtRequest({ 
        url: url,
        method: params.method || "GET",
        data: data,
        dataType: 'json',
        header: headers
    })
}

module.exports = {
    fetch: wxRequest
}

/**
 * 参数定义：params:{
 *              query:{},//body参数
 *              method:"POST",//不传默认是GET，
 *              token:{type:'',value:""},//默认不传非鉴权，
 *              ...其他参数自定义，处理url参数
 *          }
 **/