
var app = getApp();

Page({
  data: {
    user: null,
    moments: null,
    page: 0,
    actionSheetHidden: true,
    actionSheetItems: [
      { bindtap: 'tap_shoot', txt: '拍摄' },
      { bindtap: 'tap_album', txt: '从手机相册选择' }
    ]
  },

  onLoad: function (options) {
    var self = this
    if(app.data.user == null) {
      app.setUserInfo = function (user) {
        self.setData({user: user})
      }
    } else {
      this.setData({user: app.data.user})
    }

    if (app.data.sessionId) {
      self.fresh()
    } else {
      app.setSessionIdInIndex = function (sessionId) {
        self.fresh()
      }
    }
  },
  onPullDownRefresh: function () {
    // 显示顶部刷新图标  
    wx.showNavigationBarLoading();
    var self = this;
    var stop = function() {
      wx.hideNavigationBarLoading();
      wx.stopPullDownRefresh();
    }

    setTimeout(stop, 2000)
  },  

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    var more = require('data.js').data.data
    this.data.moments.push(...more)
    this.setData({ moments: this.data.moments })
  },

  onShareAppMessage: function () {
  
  },

  getuserinfo: res => {
    if (res.detail.errMsg == "getUserInfo:ok") {
      wx.request({
        url: getApp().getUrl("/user/authorize"),
        method: 'POST',
        data: {
          SessionId: getApp().data.sessionId,
          encryptedData: res.detail.encryptedData,
          iv: res.detail.iv
        },
        header: { 'content-type': 'application/x-www-form-urlencoded' },
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
  },

  fresh: function() {
    var self = this
    this.setData({page: 0})
    wx.request({
      url: app.getUrl("/moment/mylist?SessionId=" + app.data.sessionId + "&page=" + (++self.data.page)),
      method: 'GET',
      success: function (res) {
        if (res.data.code == 200) {
          self.setData({ moments: res.data.data.content })
        }
      }
    })
  },

  tap_xiangji: function () {
    this.setData({actionSheetHidden: false})
  },

  long_press_xiangji: function () {
    wx.navigateTo({url: '/pages/post/text/text'})
  },

  actionSheetbindchange: function () {
    this.setData({ actionSheetHidden: true})
  },

  tap_shoot: function () {
    this.setData({ actionSheetHidden: true})
    wx.showToast({
      title: '拍摄',
      icon: 'none',
      duration: 2000
    })
  },

  tap_album: function () {
    this.setData({ actionSheetHidden: true})
    wx.showToast({
      title: '相册',
      icon: 'none',
      duration: 2000
    })
  },

  to_square: function () {
    wx.navigateTo({ url: '/pages/square/square' })
  }

})