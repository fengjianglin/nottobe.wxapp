//app.js
App({
  data: {
    user: null,
    sessionId: null,
  },

  dataChangeListeners: [],

  getUrl: function (path) {
    return 'https://ntb.manlanvideo.com' + path;
  },

  setData: function(options) {
    for (var key in options) {
      this.data[key] = options[key]
    }
    for (var i in this.dataChangeListeners) {
      this.dataChangeListeners[i](this.data)
    }
  },

  registerDataChangeListener: function(l) {
    this.dataChangeListeners.push(l)
  },
  
  getUserInfo: function (res) {
    var self = this
    if (res.detail.errMsg == "getUserInfo:ok") {
      wx.request({
        url: self.getUrl("/user/authorize"),
        method: 'POST',
        data: {
          SessionId: self.data.sessionId,
          encryptedData: res.detail.encryptedData,
          iv: res.detail.iv
        },
        header: { 'content-type': 'application/x-www-form-urlencoded' },
        success: function (res) {
          if (res.data.code == 200) {
            self.setData({ user: res.data.data })
          }
        }
      })
    }
  }
})