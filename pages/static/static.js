var app = getApp()

Page({
  data: {
    logs: [],
    todo: [],
    logins: 0,
    recorded: 0,
    done: 0,
    days: 0
  },

  //加载数据
  onLoad: function () {
    let recorded = 0;
    let done = 0
    let days = 0;
    //加载todo日志
    var todo = wx.getStorageSync('todo_logs')
    if (todo) {
      this.setData({ todo: todo })
    }

    //加载登录日志
    var logs = wx.getStorageSync('logs')
    if (logs) {
      this.setData({ logs: logs })
      this.setData({ logins: logs.length })
    }

    let difference = logs[0] - logs[logs.length-1];//相差的毫秒数
    days = Math.ceil(difference / (1000 * 60 * 60 * 24));

    this.setData({logs: logs.length,days: days});
    for(let i =0;i<todo.length;i++){
      console.log(todo[i]);
      if (todo[i].action == "创建"){
        recorded ++;
      } else if (todo[i].action == "完成"){
        done ++;
      }
    }

    this.setData({ 
      recorded: recorded,
      done: done
    });

  }
})
