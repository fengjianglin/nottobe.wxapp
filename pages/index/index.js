
const app = getApp();

Page({
  data: {
    pullDownRefreshTip: "继续下拉刷新",
    moments: null,
    page: 0,
    isLastPage: false,
    appData: app.data,
    isReviewed: false
  },

  onLoad: function (options) {
    var self = this
    wx.request({
      url: app.getUrl('/ntb/reviewed.txt.3.txt'),
      method: 'GET',
      success: function (res) {
        if (res.data == 1) {
          self.setData({ isReviewed: true })
          if (self.data.appData.sessionId) {
            self.fresh()
          } else {
            app.registerDataChangeListener(_appData => {
              self.setData({ appData: _appData })
              self.fresh()
            })
          }
        } else {
          self.toCalc()
        }
      },
      fail: function () {
        self.toCalc()
      }
    })
  },

  toCalc: function () {
    wx.redirectTo({
      url: '/pages/calc/calc'
    })
  },

  // 下拉刷新
  onPullDownRefresh: function () {
    var self = this
    wx.showNavigationBarLoading();
    this.setData({ pullDownRefreshTip: "刷新中..."})
    var restoreTip = function() {
      self.setData({ pullDownRefreshTip: "继续下拉刷新" })
    }
    this.fresh(function() {
      wx.hideNavigationBarLoading()
      wx.stopPullDownRefresh()
      setTimeout(restoreTip, 500)
    })   
  },  

  // 上拉加载更多
  onReachBottom: function () {
    if (this.data.isLastPage) {
      return
    }
    wx.showNavigationBarLoading();
    this.nextPage(function () {
      wx.hideNavigationBarLoading()
    })
  },

  onShareAppMessage: function () {
    return {
      title: ' ',
      path: '/pages/index/index'
    }
  },

  getuserinfo: res => {
    if (res.detail.errMsg == "getUserInfo:ok") {
      wx.request({
        url: app.getUrl("/user/authorize"),
        method: 'POST',
        data: {
          SessionId: app.data.sessionId,
          encryptedData: res.detail.encryptedData,
          iv: res.detail.iv
        },
        header: { 'content-type': 'application/x-www-form-urlencoded' },
        success: function (res) {
          if (res.data.code == 200) {
              app.setData({ user: res.data.data})
          }
        }
      })
    }
  },

  fresh: function (callback) {
    var self = this
    this.setData({
        page: 0,
        isLastPage: false
      })
    wx.request({
      url: app.getUrl("/moment/followingslist?SessionId=" + app.data.sessionId + "&page=" + (++self.data.page)),
      method: 'GET',
      success: function (res) {
        if (res.data.code == 200) {
          self.setData({ moments: res.data.data.content })
          self.setData({ isLastPage: res.data.data.last })
        }
      },
      complete: function () {
        if (callback) {
          callback();
        }
      }
    })
  },

  nextPage: function (callback) {
    if(this.data.isLastPage) {
      if (callback) {
        callback();
      }
      return
    }
    var self = this
    wx.request({
      url: app.getUrl("/moment/followingslist?SessionId=" + app.data.sessionId + "&page=" + (++self.data.page)),
      method: 'GET',
      success: function (res) {
        if (res.data.code == 200) {
          var more = res.data.data.content
          self.data.moments.push(...more)
          self.setData({ moments: self.data.moments })
          self.setData({ isLastPage: res.data.data.last })
        }
      },
      complete: function() {
        if (callback) {
          callback();
        }
      }
    })
  },

  tap_xiangji: function () {
    wx.chooseImage({
      count: 9, // 默认9
      success: function (res) {
        if (res.errMsg == "chooseImage:ok") {
          var images = res.tempFilePaths
          var imagesStr = JSON.stringify(images)
          wx.navigateTo({ url: '/pages/post/photo/photo?imagesStr=' + imagesStr })
        }
      }
    })
  },

  long_press_xiangji: function () {
    wx.navigateTo({url: '/pages/post/text/text'})
  },

  to_square: function () {
    wx.navigateTo({ url: '/pages/square/square' })
  },

  to_people: function () {
    wx.navigateTo({ url: '/pages/people/people' })
  }

})