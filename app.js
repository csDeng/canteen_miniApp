

//app.js
App({
  onLaunch: function () {
    // 判断需不需要重新登录

    // 展示本地存储能力
    // 获取用户信息
    wx.showShareMenu({
      withShareTicket: true,
      menus: ['shareAppMessage', 'shareTimeline']
    })
  }
  
})