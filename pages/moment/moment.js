
Component({

  properties: {
    moment: {
      type: Object,
      observer: function (newVal, oldVal) {

        var app = getApp()
        var user = app.data.user

        var utils = require('../utils.js')
        var time = newVal.createdAt
        var timeStr = utils.timeTxt(time)

        var txtStatus = (newVal.text.length > 100 || newVal.text.split('\n').length > 6) ? 1 : 0
        var isUpped = -1
        var comment = -1
        if (user.status == 1) {
          isUpped = 0
          comment = 1
          if (newVal.ups != null) {
            for (var i in newVal.ups) {
              var up = newVal.ups[i]
              if (up.author.id == user.id) {
                isUpped = 1
              }
            }
          }
        }
        this.setData({
          timeTxt: timeStr,
          hidden: false,
          isMine: false,
          txtStatus: txtStatus,
          isUpped: isUpped,
          comment: comment
        })
        if (user.status != 1) {
          return
        }
        var author = newVal.author
        if (!utils.isBlank(user.unionid)
          && !utils.isBlank(author.unionid)
          && user.unionid == author.unionid) {
          this.setData({ isMine: true })
          return
        }

        if (!utils.isBlank(user.openid)
          && !utils.isBlank(author.openid)
          && user.openid == author.openid) {
          this.setData({ isMine: true })
          return
        }
      } 
    }
  },

  data: {
    hidden: false,
    timeTxt: null,
    isMine: false,
    txtStatus: -1, // 0 正常；1 收起； 2 全文
    isUpped: -1,  // -1 不显示赞按钮；0 没有赞过；1 已经赞过
    comment: -1 // -1 不显示评论按钮；1 显示评论按钮
  }, 

  methods: {
    extend: function () {
      this.setData({ txtStatus : 2 })
    },

    fold:function(){
      this.setData({ txtStatus: 1 })
    },

    preview_images: function (e) {
      var urls = []
      for (var i in this.properties.moment.images) {
        urls.push(this.properties.moment.images[i].url)
      }
      wx.previewImage({
        current: e.currentTarget.dataset.src, // 当前显示图片的http链接
        urls: urls // 需要预览的图片http链接列表
      })
    },
    del_moment: function(e) {
      var self = this
      wx.showModal({
        content: '是否确认删除？',
        success: function (res) {
          if (res.confirm) {
            wx.showLoading({
              title: "正在删除...",
              mask: true
            })
            wx.request({
              url: getApp().getUrl("/moment/delete"),
              method: 'POST',
              data: {
                SessionId: getApp().data.sessionId,
                id: e.currentTarget.dataset.id
              },
              header: { 'content-type': 'application/x-www-form-urlencoded' },
              success: function (res) {
                if (res.data.code == 200) {
                  self.setData({ hidden: true })
                } else {
                  wx.showToast({
                    title: '删除失败',
                    icon: 'none',
                    duration: 2000
                  })
                }
              },
              fail: function () {
                wx.showToast({
                  title: '删除失败',
                  icon: 'none',
                  duration: 2000
                })
              },
              complete: function () {
                wx.hideLoading()
              }
            })
          }
        }
      })
    },
    do_up: function() {
      var self = this
      wx.request({
        url: getApp().getUrl("/moment/up"),
        method: 'GET',
        data: {
          SessionId: getApp().data.sessionId,
          id: self.properties.moment.id
        },
        success: function (res) {
          if (res.data.code == 200) {
            self.setData({ isUpped: 1 })
          }
        }
      })
    },
    cancel_up: function() {
      var self = this
      wx.request({
        url: getApp().getUrl("/moment/cancel_up"),
        method: 'GET',
        data: {
          SessionId: getApp().data.sessionId,
          id: self.properties.moment.id
        },
        success: function (res) {
          if (res.data.code == 200) {
            self.setData({ isUpped: 0 })
          }
        }
      })
    }
  }
})
