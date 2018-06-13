var app = getApp()

Page({

  data: {
    id: 0,
    user: null,
    avatar_default: "/images/avatar_default.png",
    isFollowing: -1,
    moments: null,
    page: 0,
    isLastPage: false
  },

  onLoad: function (options) {
    var self = this
    var id = options.id
    this.setData({ id: id })
    this.fresh()
    if (getApp().data.user.id != id) {
      wx.request({
        url: getApp().getUrl("/user/isfollowing"),
        method: 'GET',
        data: {
          SessionId: getApp().data.sessionId,
          id: id
        },
        header: { 'content-type': 'application/x-www-form-urlencoded' },
        success: function (res) {
          if (res.data.code == 200) {
            if (res.data.data) {
              self.setData({ isFollowing: 1 })
            } else {
              self.setData({ isFollowing: 0 })
            }
          }
        }
      })
    }
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

  unfollow: function () {
    var self = this
    wx.showModal({
      content: "是否取消关注:" + self.data.user.nickname,
      success: function (res) {
        if (res.confirm) {
          wx.request({
            url: getApp().getUrl("/user/unfollow"),
            method: 'GET',
            data: {
              SessionId: getApp().data.sessionId,
              id: self.data.user.id
            },
            header: { 'content-type': 'application/x-www-form-urlencoded' },
            success: function (res) {
              if (res.data.code == 200) {
                self.setData({ isFollowing: 0 })
                self.fresh()
              }
            }
          })
        }
      }
    })
  },

  follow: function () {
    var self = this
    wx.request({
      url: getApp().getUrl("/user/follow"),
      method: 'GET',
      data: {
        SessionId: getApp().data.sessionId,
        id: self.data.user.id
      },
      header: { 'content-type': 'application/x-www-form-urlencoded' },
      success: function (res) {
        if (res.data.code == 200) {
          self.setData({ isFollowing: 1 })
          self.fresh()
        }
      }
    })
  },

  to_followings: function () {
    wx.navigateTo({ url: '/pages/followings/followings?id=' + this.data.id + '&nickname=' + this.data.user.nickname })
  },

  to_followers: function () {
    wx.navigateTo({ url: '/pages/followers/followers?id=' + this.data.id + '&nickname=' + this.data.user.nickname})
  },

  fresh: function (callback) {
    var self = this
    
    wx.request({
      url: getApp().getUrl("/user/get?id=" + this.data.id),
      method: 'GET',
      success: function (res) {
        if (res.data.code == 200) {
          self.setData({ user: res.data.data })
          wx.setNavigationBarTitle({ title: res.data.data.nickname })
        }
      }
    })

    this.setData({
      page: 0,
      isLastPage: false
    })
    wx.request({
      url: app.getUrl("/moment/someonelist?id=" + this.data.id + "&page=" + (++self.data.page)),
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
      url: app.getUrl("/moment/someonelist?id=" + this.data.user.id+ "&page=" + (++self.data.page)),
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