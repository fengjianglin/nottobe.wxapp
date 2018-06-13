const app = getApp()

Component({
  properties: {
    moment: {
      type: Object,
      observer: 'moment_observer'
    }
  },

  data: {
    hidden: false,
    timeTxt: null,
    isMine: false,
    txtStatus: -1, // 0 正常；1 收起； 2 全文
    isUpped: -1,  // -1 不显示赞按钮；0 没有赞过；1 已经赞过
    isCommentBtn: -1, // -1 不显示评论按钮；1 显示评论按钮
    ups: null,
    showCommentInput: false,
    comments: null,
    commentInputPlaceholder: "评论",
    toUserId: 0,
    appData: app.data
  }, 
  
  attached: function () {
    var self = this
    app.registerDataChangeListener(_appData => {
      self.setData({ appData: _appData })
    })
  },

  methods: {
    moment_observer: function (newVal, oldVal) {
      var user = app.data.user
      var utils = require('../utils.js')
      var time = newVal.createdAt
      var timeStr = utils.timeTxt(time)

      var txtStatus = (newVal.text.length > 100 || newVal.text.split('\n').length > 6) ? 1 : 0
      var isUpped = -1
      var isCommentBtn = -1
      if (user.status == 1) {
        isUpped = 0
        isCommentBtn = 1
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
        isCommentBtn: isCommentBtn,
        ups: newVal.ups,
        comments: newVal.comments
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
    },

    getuserinfo: function (res) {
      app.getUserInfo(res)
    },

    to_user_detail: function () {
      wx.navigateTo({ url: '/pages/userdetail/userdetail?id=' + this.properties.moment.author.id })
    },

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
            var app = getApp()
            var user = app.data.user
            var _up = { author: user}
            self.data.ups.push(_up)
            self.setData({ ups: self.data.ups})
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
            var app = getApp()
            var user = app.data.user
            for(var i in self.data.ups) {
              if (user.id == self.data.ups[i].author.id) {
                self.data.ups.splice(i, 1)
                break
              }
            }
            self.setData({ ups: self.data.ups })
          }
        }
      })
    },

    show_comment_input: function (placeholder, toUserId) {
      this.setData({ 
        showCommentInput: true, 
        commentInputPlaceholder: placeholder,
        toUserId: toUserId
      })
    },

    hide_comment_input: function () {
      this.setData({ showCommentInput: false });
    },
    
    tap_comment_btn: function () {
      this.show_comment_input("评论", 0)
    },

    do_comment: function(e) {
      var self = this
      var text = e.detail.value
      wx.showLoading({
        title: "正在发表...",
        mask: true
      })
      wx.request({
        url: getApp().getUrl("/moment/post_comment"),
        method: 'POST',
        data: {
          SessionId: getApp().data.sessionId,
          mid: this.properties.moment.id,
          text: text,
          to_user_id: this.data.toUserId
        },
        header: { 'content-type': 'application/x-www-form-urlencoded' },
        success: function (res) {
          if (res.data.code == 200) {
            var c = res.data.data
            self.data.comments.push(c)
            self.setData({ comments: self.data.comments })
            wx.showToast({
              title: '发表成功',
              icon: 'success',
              duration: 2000
            })
          } else {
            wx.showToast({
              title: '发表失败',
              icon: 'none',
              duration: 2000
            })
            wx.hideLoading()
          }
        },
        fail: function () {
          wx.showToast({
            title: '发表失败',
            icon: 'none',
            duration: 2000
          })
          wx.hideLoading()
        }
      })
    },

    tap_comment: function(e) {
      var self = this
      var index = e.currentTarget.dataset.commnet_index
      var comment = this.data.comments[index]
      var app = getApp()
      var user = app.data.user
      if (user.id == comment.author.id) {
        wx.showModal({
          content: '是否确认删除？',
          success: function (res) {
            if (res.confirm) {
              wx.showLoading({
                title: "正在删除...",
                mask: true
              })
              wx.request({
                url: getApp().getUrl("/moment/delete_comment"),
                method: 'POST',
                data: {
                  SessionId: getApp().data.sessionId,
                  id: comment.id
                },
                header: { 'content-type': 'application/x-www-form-urlencoded' },
                success: function (res) {
                  if (res.data.code == 200) {
                    self.data.comments.splice(index, 1)
                    self.setData({ comments: self.data.comments })
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
      } else { // 回复某人
        this.show_comment_input("回复" + comment.author.nickname + "：", comment.author.id)
      }
    }
  }
})
