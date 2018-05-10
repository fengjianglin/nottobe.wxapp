// pages/post/text/text.js
Page({
  data: {
  
  },
  onLoad: function (options) {
  
  },
  onShareAppMessage: function () {
  
  },

  do_post: function(e) {
    wx.showLoading({
      title: "正在发表...",
      mask: true
    })
    wx.request({
      url: getApp().getUrl("/moment/post_text"),
      method: 'POST',
      data: {
        SessionId: getApp().data.sessionId,
        text: e.detail.value.text
      },
      header: { 'content-type': 'application/x-www-form-urlencoded' },
      success: function (res) {
        if (res.data.code == 200) {
          wx.navigateBack()
        } else {
          wx.showToast({
            title: '发表失败',
            icon: 'none',
            duration: 2000
          })
        }
      },
      fail: function() {
        wx.showToast({
          title: '发表失败',
          icon: 'none',
          duration: 2000
        })
      },
      complete: function() {
        wx.hideLoading()
      }
    })
  }
})