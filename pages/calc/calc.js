Page({
  data: {
    idBack: "back",
    idClear: "clear",
    idPon: "+-",
    idPlus: "+",
    idMinus: "-",
    idMult: "×",
    idDiv: "÷",
    id9: "9",
    id8: "8",
    id7: "7",
    id6: "6",
    id5: "5",
    id4: "4",
    id3: "3",
    id2: "2",
    id1: "1",
    id0: "0",
    idPoint: ".",
    idIs: "=",
    screenData: "0",
    lastIsOperator: false,
    arr: [],
    logs: []
  },
  onLoad: function (options) {
    // 页面初始化 options为页面跳转所带来的参数

  },
  onReady: function () {
    // 页面渲染完成

  },
  onShow: function () {
    // 页面显示

  },
  onHide: function () {
    // 页面隐藏

  },
  onUnload: function () {
    // 页面关闭

  },
  history: function () {
    wx.navigateTo({ url: "/pages/calc/list/list" });
  },
  clientButton: function (event) {
    var id = event.target.id;
    var data = this.data.screenData;
    if (id == this.data.idBack)//退格
    {
      if (data == "0")
        return;
      else {
        data = data.substring(0, data.length - 1);
        if (data == "" || data == "-") {
          data = "0";
        }
      }
      this.data.arr.pop();
      this.setData({ screenData: data });

    }
    else if (id == this.data.idClear)//清屏
    {
      this.setData({ screenData: "0" });
      this.data.arr.length = 0;
    }
    else if (id == this.data.idPon) {//正负号
      if (data.substring(0, 1) == "-") {
        data = data.substring(1, data.length);
        this.data.arr.shift();
      }
      else {
        data = "-" + data;
        this.data.arr.unshift("-");
      }
      this.setData({ screenData: data });
    }
    else if (id == this.data.idIs) {//运算
      var data = this.data.screenData;
      if (data == "0") {
        return;
      }
      // console.log(data);
      //最后是操作符不合法返回
      var lastWord = data.substring(data.length - 1, data.length);
      //  console.log("lastWord" + lastWord);
      if (isNaN(lastWord)) {
        return;
      }
      var num = "";//存解析后的数字
      var optArr = [];
      var arr = this.data.arr;
      console.log(arr);
      for (var i in arr) {//把字符进行拆分成数字和运算符存到数组里
        if (isNaN(arr[i]) == false || arr[i] == this.data.idPon || arr[i] == this.data.idPoint) {
          num += arr[i];
        }
        else {
          optArr.push(Number(num));
          optArr.push(arr[i]);
          num = "";
        }
      }
      optArr.push(Number(num));
      console.log(optArr);
      var result = Number(optArr[0]) * 1.0;//转换为带小数的结果
      for (var i = 1; i < optArr.length; i++) {
        if (isNaN(optArr[i])) {//非数字
          if (optArr[i] == this.data.idPlus) {
            result += Number(optArr[i + 1]);
          }
          else if (optArr[i] == this.data.idMinus) {
            result -= Number(optArr[i + 1]);
          }
          else if (optArr[i] == this.data.idMult) {
            result *= Number(optArr[i + 1]);
          }
          else if (optArr[i] == this.data.idDiv) {
            result /= Number(optArr[i + 1]);
          }
        }
      }
      var log = data + "=" + result;
      this.data.logs.push(log)
      wx.setStorageSync('callLogs', this.data.logs);
      this.data.arr.length = 0;
      this.data.arr.push(result);
      this.setData({ screenData: result });
    }
    else {//数字及运算符
      if (data == "0") {
        if (id == this.data.idPlus ||
          id == this.data.idMinus ||
          id == this.data.idMult ||
          id == this.data.idDiv) {
          return;
        }
        this.setData({ screenData: event.target.id });
        this.data.arr.push(id);
      }
      else {
        if (id == this.data.idPlus ||
          id == this.data.idMinus ||
          id == this.data.idMult ||
          id == this.data.idDiv) {//阻止连续输入多个运算符
          if (this.data.lastIsOperator == true) {
            return;
          }
        }
        this.setData({ screenData: data + event.target.id });
        this.data.arr.push(id);
        //  console.log(this.data.arr);
        if (id == this.data.idPlus ||
          id == this.data.idMinus ||
          id == this.data.idMult ||
          id == this.data.idDiv) {
          this.setData({ lastIsOperator: true });
        }
        else {
          this.setData({ lastIsOperator: false });
        }
      }
    }
  }
})
