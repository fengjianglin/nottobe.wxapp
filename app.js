//app.js
App({
  data: {
    user: null,
    sessionId: null,
    isReviewed: false
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

  onLaunch: function () {
    
    var date = new Date("2018-03-31").getTime()
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
              getApp().setData({
                user: res.data.data,
                sessionId: res.data.sessionId
              })
            }
          }
        })
      }
    })
  }
})