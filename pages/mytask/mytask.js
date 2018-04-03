var app = getApp()
Page({
  data: {
    newList: [{ url: "baidu.com", title: "sdsadsadasdas", classification: "ss", time: "2016-10-17", imgURL: "../../image/my.png" },
    { url: "baidu.com", title: "sdsadsadasdassss", classification: "ss", time: "2016-10-17", imgURL: "../../image/my.png" },
    { url: "baidu.com", title: "sdsadsadasdas", classification: "12", time: "2016-10-17", imgURL: "../../image/my.png" },
    { url: "baidu.com", title: "sdsadsadasdas", classification: "333", time: "2016-10-17", imgURL: "../../image/my.png" },
    { url: "baidu.com", title: "sdsadsadasdas", classification: "44", time: "2016-10-17", imgURL: "../../image/my.png" },
    { url: "baidu.com", title: "sdsadsadasdas", classification: "44", time: "2016-10-17", imgURL: "../../image/my.png" },
    { url: "baidu.com", title: "sdsadsadasdas", classification: "32", time: "2016-10-17", imgURL: "../../image/my.png" },
    { url: "baidu.com", title: "sdsadsadasdas", classification: "123", time: "2016-10-17", imgURL: "../../image/my.png" },
    { url: "baidu.com", title: "sdsadsadasdas", classification: "456", time: "2016-10-17", imgURL: "../../image/my.png" },
    { url: "baidu.com", title: "sdsadsadasdas", classification: "454", time: "2016-10-17", imgURL: "../../image/my.png" }
    ]
  },
  //事件处理函数
  bindViewTap: function () {
    wx.navigateTo({
      url: '../mytask/mytask'
    })
  }

})
