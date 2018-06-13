var app = getApp()

Page({
  data: {
    id: 0,
    nickname: null,
    follows: null,
    page: 0,
    isLastPage: false
  },

  onLoad: function (options) {
    var id = options.id
    var nickname = options.nickname
    this.setData({
      id: id,
      nickname: nickname
    })
    wx.setNavigationBarTitle({ title: nickname + '的粉丝' })
    this.fresh()
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

  onShareAppMessage: function () {

  },

  fresh: function (callback) {
    var self = this
    this.setData({
      page: 0,
      isLastPage: false
    })
    wx.request({
      url: app.getUrl("/user/followers?id=" + this.data.id + "&page=" + (++self.data.page)),
      method: 'GET',
      success: function (res) {
        if (res.data.code == 200) {
          self.setData({ follows: res.data.data.content })
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
      url: app.getUrl("/user/followers?id=" + this.data.id + "&page=" + (++self.data.page)),
      method: 'GET',
      success: function (res) {
        if (res.data.code == 200) {
          var more = res.data.data.content
          self.data.follows.push(...more)
          self.setData({ follows: self.data.follows })
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