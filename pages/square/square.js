var app = getApp()

Page({
  data: {
    moments: null,
    page: 0,
    isLastPage: false
  },

  onLoad: function (options) {
    var self = this
    self.fresh()
  },

  onPullDownRefresh: function () {
    wx.showNavigationBarLoading();
    this.fresh(function () {
      wx.hideNavigationBarLoading()
      wx.stopPullDownRefresh()
    }) 
  },

  onReachBottom: function () {
    if (this.data.isLastPage) {
      return
    }
    wx.showNavigationBarLoading();
    this.nextPage(function () {
      wx.hideNavigationBarLoading()
    })
  },

  onShareAppMessage: function () {},

  fresh: function (callback) {
    var self = this
    this.setData({
      page: 0,
      isLastPage: false
    })
    wx.request({
      url: app.getUrl("/moment/list?page=" + (++self.data.page)),
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
    if (this.data.isLastPage) {
      if (callback) {
        callback();
      }
      return
    }
    var self = this
    wx.request({
      url: app.getUrl("/moment/list?page=" + (++self.data.page)),
      method: 'GET',
      success: function (res) {
        if (res.data.code == 200) {
          var more = res.data.data.content
          self.data.moments.push(...more)
          self.setData({ moments: self.data.moments })
          self.setData({ isLastPage: res.data.data.last })
        }
      },
      complete: function () {
        if (callback) {
          callback();
        }
      }
    })
  }
})