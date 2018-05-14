// pages/moment/moment.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    moment: {
      type: Object
    }
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
    }
  }
})
