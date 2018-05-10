var app = getApp()

Page({

  data: {
    images: null
  },

  onLoad: function (options) {
    var images = JSON.parse(options.imagesStr);
    this.setData({images: images})
  },

  do_post: function (e) {
    var self = this
    wx.showLoading({
      title: "正在发表...",
      mask: true
    })
    wx.request({
      url: app.getUrl("/moment/post_text"),
      method: 'POST',
      data: {
        SessionId: getApp().data.sessionId,
        text: e.detail.value.text
      },
      header: { 'content-type': 'application/x-www-form-urlencoded' },
      success: function (res) {
        if (res.data.code == 200) {
          self.upload_images(res.data.data.id, self.post_success, self.post_fail)
        } else {
          self.post_fail()
        }
      },
      fail: self.post_fail
    })
  },

  upload_images: function(moment_id, success, fail) {
    for(var i in this.data.images) {
      var image = this.data.images[i]
      wx.uploadFile({
        url: getApp().getUrl("/moment/upload_image"),
        filePath: image,
        name: 'image',
        formData: {
          SessionId: getApp().data.sessionId,
          moment_id: moment_id
        },
        success: function (res) {
          var data = res.data
          console.log(res.data)
        }
      })
    }
  },

  post_success: function () {
    wx.hideLoading()
    wx.navigateBack()
  },

  post_fail: function() {
    wx.hideLoading()
    wx.showToast({
      title: '发表失败',
      icon: 'none',
      duration: 2000
    })
  }
})