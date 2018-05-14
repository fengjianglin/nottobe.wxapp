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
          self.upload_images(res.data.data.id)
        } else {
          self.post_fail()
        }
      },
      fail: self.post_fail
    })
  },

  upload_images: function(moment_id) {
    var self = this;
    var length = this.data.images.length;
    var complete = function () {
      length--;
      if (length <= 0){
        console.log(self);
        self.post_success();
      }
    }

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
        complete: complete
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
  },

  preview_images: function (e) {
    var urls = []
    for (var i in this.data.images) {
      urls.push(this.data.images[i])
    }
    wx.previewImage({
      current: e.currentTarget.dataset.src, // 当前显示图片的http链接
      urls: urls // 需要预览的图片http链接列表
    })
  },

  add_images: function () {
    var self = this
    wx.chooseImage({
      count: 9 - this.data.images.length, // 默认9
      sourceType: ['album', 'camera'], 
      success: function (res) {
        if (res.errMsg == "chooseImage:ok") {
          var images = res.tempFilePaths
          self.data.images.push(...images)
          self.setData({images: self.data.images})
        }
      }
    })
  },
  
  del_images: function (e) {
    var self = this
    var index = e.currentTarget.dataset.index
    wx.showModal({
      title: '删除',
      content: '是否确认删除？',
      success: function (res) {
        if (res.confirm) {
          self.data.images.splice(index, 1)
          self.setData({ images: self.data.images })
        }
      }
    })
  }
})