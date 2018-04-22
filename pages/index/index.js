var dataUrl = '../../voice/notice.mp3'
//index.js
var util = require("../../utils/util.js");

//更改数组，第一个参数为原来存储任务的数组，第二个参数为需要改变的任务所在的位置，第三个参数是对象
function editArr(arr, i, editCnt) {
  let newArr = arr, editingObj = newArr[i];
  //通过map函数返回用函数处理之后的数组
  newArr.map(function (a) {
    if (a.id == i) {
      for (var x in editCnt) {
        a[x] = editCnt[x];
      }
    }
  })

  // for (var x in editCnt){
  //   editingObj[x]= editCnt[x];
  // }
  return newArr;
}

//获取应用实例
var app = getApp()
Page({
  data: {
    userInfo: {},
    showAll: true,
    lists: [],
    newLi: { id: '', content: '', begin: util.formatTime2(), needRemind: true, editing: false, done: false },
    src: 'https://www.ihewro.com/notice.mp3',
    logs: []
  },
  onReady: function (e) {
    this.audioCtx = wx.createAudioContext('myAudio');
    this.remind();
  },
  toUrl(e) {
    let url = e.target.dataset.url;
    wx.navigateTo({
      url: '../' + url + '/' + url
    })
  },
  //事件处理函数
  bindViewTap: function () {
    wx.navigateTo({
      url: '../logs/logs'
    })
  },

  onLoad: function () {
    var that = this;
    //获取之前保留在缓存里的数据
    var logs = wx.getStorageSync('todo_logs')
    if (logs) {
      this.setData({ logs: logs })
    }

    wx.getStorage({
      key: 'todolist',
      success: function (res) {
        if (res.data) {
          that.setData({
            lists: res.data
          })
        }
      }
    })
    //获取用户信息
    app.getUserInfo(function (userInfo) {
      that.setData({
        userInfo: userInfo
      })
    })
  },

  iptChange(e) {
    this.setData({
      'newLi.content': e.detail.value,
      'newLi.begin': util.formatTime2()
    })
  },

  //清空按钮
  formReset() {
    this.setData({
      'newLi.content': ''
    })
  },

  //提交按钮
  formSubmit() {
    let newLists = this.data.lists, i = 0, newTodo = this.data.newLi;
    let logs = this.data.logs;
    if (newLists.length > 0) {
      i = Number(util.sortBy(newLists, 'id', true)[0].id) + 1;
    }
    newTodo.id = i;
    if (newTodo.content != '') {
      logs.push({
        timestamp: new Date(),
        action: '创建',
        name: newTodo.content
      })
      newLists.push(newTodo);
      this.setData({
        lists: newLists,
        logs: logs,
        newLi: { id: '', content: '', begin: util.formatTime2(), needRemind: true, editing: false, done: false }
      })
    }
    this.remind();
    console.log("保存到本地");
    wx.setStorageSync('todolist', this.data.lists)
    wx.setStorageSync('todo_logs', this.data.logs)
    wx.showToast({
      title: '提交任务成功',
      icon: 'succes',
      duration: 1000,
      mask: true
    })
  },
  beginTime(e) {
    this.setData({
      'newLi.begin': e.detail.value
    })
  },
  switch1Change(e) {
    this.setData({
      'newLi.needRemind': e.detail.value
    })
  },
  //修改任务
  toChange(e) {
    let i = e.target.dataset.id;
   // console.log("点击进行修改:"+i)
    this.setData({
      lists: editArr(this.data.lists, i, { editing: true })
    });
  },
  //进入修改之后编辑任务
  iptEdit(e) {
    let i = e.target.dataset.id;
   // console.log("编辑:"+i)
    // this.setData({
    //   lists: editArr(this.data.lists, i, { curVal: e.detail.value })
    // })
    console.log(e.detail.value)
    this.setData({
      lists: editArr(this.data.lists, i, { content: e.detail.value })
    })
  },
  //保存修改之后的任务
  saveEdit(e) {
    let i = e.target.dataset.id;
    let logs = this.data.logs;
        logs.push({
      timestamp: new Date(),
      action: '修改任务内容',
      name: '任务'+i
    })
    this.setData({
      lists: editArr(this.data.lists, i, {editing: false }), 
      logs:logs 
    })
    console.log("保存到本地");
    wx.setStorageSync('todolist', this.data.lists)
    wx.setStorageSync('todo_logs', this.data.logs)
    wx.showToast({
      title: '修改数据成功',
      icon: 'succes',
      duration: 1000,
      mask: true
    })
  },

  //完成任务逻辑
  setDone(e) {
    let i = e.target.dataset.id;
    let newLists = this.data.lists;
    let logs = this.data.logs;
    newLists.map(function (l, index) {
      if (l.id == i) {
        newLists[index].done = !l.done;
        newLists[index].needRemind = false;
        if(newLists[index].done == true){
          logs.push({
            timestamp: new Date(),
            action: '修改为完成',
            name: newLists[index].content
          });
        }
        if (newLists[index].done == false) {
          logs.push({
            timestamp: new Date(),
            action: '修改为未完成',
            name: newLists[index].content
          });
        }
      }
    })
    this.setData({
      lists: newLists,
      logs: logs
    })
    console.log("保存到本地");
    wx.setStorageSync('todolist', this.data.lists)
    wx.setStorageSync('todo_logs', this.data.logs)
    wx.showToast({
      title: '修改成功',
      icon: 'succes',
      duration: 1000,
      mask: true
    })
  },

  //删除任务逻辑
  toDelete(e) {
    let i = e.target.dataset.id, newLists = this.data.lists,logs = this.data.logs;
    newLists.map(function (l, index) {
      if (l.id == i) {
        logs.push({
          timestamp: new Date(),
          action: '删除',
          name: newLists[index].content
        })
        newLists.splice(index, 1);
      
      }
    })
    this.setData({
      lists: newLists,
      logs: logs
    })
    console.log("保存到本地");
    wx.setStorageSync('todolist', this.data.lists)
    wx.setStorageSync('todo_logs', this.data.logs)
    wx.showToast({
      title: '删除任务成功',
      icon: 'succes',
      duration: 1000,
      mask: true
    })
  },

  //完成全部任务逻辑
  doneAll() {
    let newLists = this.data.lists;
    let logs = this.data.logs;
    newLists.map(function (l) {
      l.done = true;
    });
    logs.push({
      timestamp: new Date(),
      action: '完成所有任务',
      name: '所有任务'
    })
    this.setData({
      lists: newLists,
      logs: logs
    })
    console.log("保存到本地");
    wx.setStorageSync('todolist', this.data.lists)
    wx.setStorageSync('todo_logs', this.data.logs)
    wx.showToast({
      title: '完成全部任务',
      icon: 'succes',
      duration: 1000,
      mask: true
    })
  },

  //删除全部任务逻辑
  deleteAll() {
    let logs = this.data.logs;
    logs.push({
      timestamp:new Date(),
      action:'删除所有任务',
      name:'所有任务'
    }
    )
    this.setData({
      lists: [],
      logs:logs
    })
    console.log("保存到本地");
    wx.setStorageSync('todolist', this.data.lists)
    wx.setStorageSync('todo_logs', this.data.logs)
    wx.showToast({
      title: '删除全部任务',
      icon: 'succes',
      duration: 1000,
      mask: true
    })
  },

  //显示没有完成的
  showUnfinished() {
    this.setData({
      showAll: false
    })
  },

  //显示全部事项
  showAll() {
    this.setData({
      showAll: true
    })
  },

  //保存数据到本地
  saveData() {
    console.log("保存到本地");
    wx.setStorageSync('todolist', this.data.lists)
    wx.setStorageSync('todo_logs', this.data.logs)
    wx.showToast({
      title: '保存数据成功',
      icon: 'succes',
      duration: 1000,
      mask: true
    })
  },

  //音频播放
  audioPlay: function () {
    this.audioCtx.play()
  },
  audioPause: function () {
    this.audioCtx.pause()
  },

  audioStart: function () {
    this.audioCtx.seek(0)
  },


  getRemindArr() {
    let thisLists = this.data.lists, closeT = 0, notDoneLists = [];
    let date = new Date(), now = [date.getHours(), date.getMinutes()];
    thisLists.map(function (l) {
      if (l.needRemind) {
        notDoneLists.push(l)
      }
    })
    if (notDoneLists.length > 0) {
      let newLists = util.sortBy(notDoneLists, 'begin'), firstT = (newLists[0].begin).split(':'), id = newLists[0].id, cnt = newLists[0].content;
      closeT = ((firstT[0] - now[0]) * 60 + (firstT[1] - now[1]) - 1) * 60;
      closeT = closeT >= 0 ? closeT : 0;
      return { closeT, id, cnt };
    } else {
      return false;
    }
  },

  //
  remind() {
    let result = this.getRemindArr(), t = result.closeT, id = result.id, that = this, cnt = result.cnt;
    function alarm() {
      that.audioPlay();
      let newLists = that.data.lists;
      wx.showModal({
        title: '现在去做这件事？',
        content: cnt,
        success: function (res) {
          if (res.confirm) {
            that.audioPause();
            that.audioStart();
            newLists.map(function (l, index) {
              if (l.id == id) {
                newLists[index].done = true;
                newLists[index].needRemind = false;
              }
            })
            that.setData({
              lists: newLists
            })
          } else {
            that.audioPause();
            that.audioStart();
            newLists.map(function (l, index) {
              if (l.id == id) {
                newLists[index].needRemind = false;
              }
            })
            that.setData({
              lists: newLists
            })
          }
        }
      })

    }
    if (result) {
      setTimeout(alarm, Math.floor(t * 1000), function () {
        that.remind();
      })
    }

  }


})
