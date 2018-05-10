Page({
  data: {
    moments: null,
    page: 0
  },

  onLoad: function (options) {
    var self = this
    wx.request({
      url: getApp().getUrl("/moment/list?page=" + (++this.data.page)),
      method: 'GET',
      success: function (res) {
        if (res.data.code == 200) {
          console.log(res.data.data)
          self.setData({ moments: res.data.data.content})
        }
      }
    })
  },

  onPullDownRefresh: function () {
  
  },

  onReachBottom: function () {
  
  },

  onShareAppMessage: function () {
  
  }
})