
const app = getApp();

Page({ 

  onLoad: function (options) {
    var self = this
    wx.request({
      url: app.getUrl('/ntb/reviewed.txt.4.txt'),
      method: 'GET',
      success: function (res) {
        if (res.data == 1) {
          self.toIndex();
        } else {
          self.toCalc()
        }
      },
      fail: function () {
        self.toCalc()
      }
    })
  },

  toIndex: function () {
    
    wx.login({
      success: res => {
        wx.request({
          url: app.getUrl('/user/login?code=' + res.code),
          method: 'GET',
          success: function (res) {
            if (res.data.code == 200) {
              app.setData({
                user: res.data.data,
                sessionId: res.data.sessionId
              })
              wx.getUserInfo({
                success: res => {
                  wx.request({
                    url: app.getUrl("/user/authorize"),
                    method: 'POST',
                    data: {
                      SessionId: app.data.sessionId,
                      encryptedData: res.encryptedData,
                      iv: res.iv
                    },
                    header: { 'content-type': 'application/x-www-form-urlencoded' },
                    success: function (res) {
                      if (res.data.code == 200) {
                        app.setData({user: res.data.data})
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

    wx.redirectTo({
      url: '/pages/index/index'
    })
  },

  toCalc: function () {
    wx.redirectTo({
      url: '/pages/calc/calc'
    })
  }
})