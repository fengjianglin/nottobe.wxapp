
Component({

  properties: {
    moment: {
      type: Object,
      observer: function (newVal, oldVal) {
        var utils = require('../utils.js')
        var time = newVal.createdAt
        var timeStr = utils.timeTxt(time)
        this.setData({
          timeTxt: timeStr,
          hidden: false,
          isMine: false
        })
        var app = getApp()
        var user = app.data.user
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
    isMine: false
  }, 

  methods: {
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
        title: '删除',
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
    }
  }
})
