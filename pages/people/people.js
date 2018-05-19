
var app = getApp()

Page({

  data: {
    users: null,
    page: 0,
    isLastPage: false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
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
      url: app.getUrl("/user/list?page=" + (++self.data.page)),
      method: 'GET',
      success: function (res) {
        if (res.data.code == 200) {
          self.setData({ users: res.data.data.content })
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
      url: app.getUrl("/user/list?page=" + (++self.data.page)),
      method: 'GET',
      success: function (res) {
        if (res.data.code == 200) {
          var more = res.data.data.content
          self.data.users.push(...more)
          self.setData({ users: self.data.users })
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