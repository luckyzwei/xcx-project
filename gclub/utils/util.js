
// 页面跳转数据字典
// 1:navigate  保留当前页面，跳转到应用内的某个页面，使用wx.navigateBack可以返回到原页面  可加参数
// 2:redirectTo 关闭当前页面，跳转到应用内的某个页面。 可加参数
// 3:reLaunch 关闭所有页面，打开到应用内的某个页面。 可加参数
// 4:switchTab 跳转到 tabBar 页面，并关闭其他所有非 tabBar 页面  不可加参数
// 5:navigateBack 关闭当前页面，返回上一页面或多级页面。可通过 getCurrentPages()) 获取当前的页面栈，决定需要返回几层
/**
 * 页面跳转函数
 * @param path 跳转路径 部分可携带参数
 * @param type 跳转类型
 * @param num 是否为返回上级
 */
function pageGo(path, type, num) {
  if (num) {
    wx.navigateBack({
      delta: path
    })
  } else {
    switch (type) {
      case 1:
        wx.navigateTo({
          url: path
        });
        break;
      case 2:
        wx.redirectTo({
          url: path
        });
        break;
      case 3:
        wx.reLaunch({
          url: path
        });
        break;
      case 4:
        wx.switchTab({
          url: path
        });
        break;
      default:
        break
    }
  }
}

/**
 * 分享集成函数
 * @param title 分享的标题
 * @param path 分享的页面路径
 * @param imageUrl 分享出去要显示的图片
 * @param callback 分享后的回调
 * @returns {{title: *, path: *, imageUrl: *, success: success, complete: complete}}
 */
function openShare(title, path, imageUrl, callback) {
  return {
    title: title,
    path: path,
    imageUrl: imageUrl,
    success: function (res) {
      console.log('res success',res)
      wx.showToast({
        title: '分享成功',
        icon: 'success',
        duration: 3000
      })
    },
    complete: function (req) {
      callback(req)
    }
  }
}

function successShowText(str) {
  wx.showToast({
    title: str,
    icon: 'none'
  })
}
function showLoading() {
  wx.showLoading({
    title: '加载中',
    mask: true,
  }); 
}
function hideLoading() {
  wx.hideLoading()
}
function promptTips(that, str) {
  that.setData({
    stop: true,
    popErrorMsg: str
  });
  hidepromptTips(that);
}

function hidepromptTips(that) {
  let fadeOutTimeout = setTimeout(() => {
    that.setData({
      popErrorMsg: null,
    });
    clearTimeout(fadeOutTimeout);
  }, 2000);
}

module.exports = {
  successShowText: successShowText,
  promptTips: promptTips,
  pageGo: pageGo,
  openShare: openShare,
  showLoading: showLoading,
  hideLoading: hideLoading
}
