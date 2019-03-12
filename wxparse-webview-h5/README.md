xcx-project

web-view组件是一个可以用来承载网页的容器，会自动铺满整个小程序页面

生成海报

#### html 转换 base64图片
- domtoimage.js
- html2canvas.js
####
- 外表webview跳转进入小程序
```
wx.miniProgram.redirectTo({
    url: `/pages/sell/poster/index?dataUrl=${res2.resultContent}&scene=${parmas.id}&updateState=${parmas.updateState}`
})
```


