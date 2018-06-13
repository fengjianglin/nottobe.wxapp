Component({
  properties: {
    user: {
      type: Object,
      observer: 'user_observer'
    }
  },

  data: {
    avatar_default: "/images/avatar_default.png",
    isFollowing: -1
  },
  
  methods: {
    user_observer: function (newVal, oldVal) {
      if (this.properties.user.id != getApp().data.user.id) {
        var self = this
        wx.request({
          url: getApp().getUrl("/user/isfollowing"),
          method: 'GET',
          data: {
            SessionId: getApp().data.sessionId,
            id: self.properties.user.id
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
    
    to_user_detail: function () {
      wx.navigateTo({ url: '/pages/userdetail/userdetail?id=' + this.properties.user.id })
    },

    unfollow: function () {
      var self = this
      wx.showModal({
        content: "是否取消关注:" + self.properties.user.nickname,
        success: function (res) {
          if (res.confirm) {
            wx.request({
              url: getApp().getUrl("/user/unfollow"),
              method: 'GET',
              data: {
                SessionId: getApp().data.sessionId,
                id: self.properties.user.id
              },
              header: { 'content-type': 'application/x-www-form-urlencoded' },
              success: function (res) {
                if (res.data.code == 200) {
                  self.setData({ isFollowing: false })
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
          id: self.properties.user.id
        },
        header: { 'content-type': 'application/x-www-form-urlencoded' },
        success: function (res) {
          if (res.data.code == 200) {
            self.setData({ isFollowing: true })
          }
        }
      })
    }
  }
})
