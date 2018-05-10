//app.js
App({
  data: {
    "scope.userInfo": false,
    user: null,
    sessionId: null
  },
  
  getUrl: function (path) {
    return 'https://ntb.manlanvideo.com' + path;
  },

  onLaunch: function () {
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

            if (res.data.code == 200) {
              wx.getUserInfo({
                success: res => {
                  wx.request({
                    url: getApp().getUrl("/user/authorize"),
                    method: 'POST',
                    data: {
                      SessionId: getApp().data.sessionId,
                      encryptedData: res.encryptedData,
                      iv: res.iv
                    },
                    header: {'content-type': 'application/x-www-form-urlencoded'},
                    success: function (res) {
                      if (res.data.code == 200) {
                        var user = res.data.data
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
          }
        })
      }
    })
  }
})