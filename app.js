//app.js
App({
  data: {
    "scope.userInfo": false,
    user: null,
    sessionId: null,
    isReviewed: false
  },
  
  getUrl: function (path) {
    return 'https://ntb.manlanvideo.com' + path;
  },

  onLaunch: function () {
    
    var date = new Date("2018-06-09").getTime()
    var now = new Date().getTime()
    if(now - date > 0) {
      this.data.isReviewed = true
    }

    wx.login({
      success: res => {
        wx.request({
          url: this.getUrl('/user/login?code=' + res.code),
          method: 'GET',
          success: function (res) {
            if (res.data.code == 200) {
              var user = res.data.data
              getApp().data.sessionId = res.data.sessionId
              if(getApp().setSessionIdInIndex) {
                getApp().setSessionIdInIndex(res.data.sessionId)
              }
              getApp().data.user = user
              if (getApp().setUserInfo) {
                getApp().setUserInfo(user)
              }
            }
          }
        })
      }
    })
  }
})