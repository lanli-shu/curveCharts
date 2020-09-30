// pages/experience/tests/tests.js
let curve = {
  mW: 345, //canvas宽
  mH: 250, //canvas高
  mCenter: 180, //中心点
  hCenter: 125, //中心点
  points: []
};
Page({

  /**
   * 页面的初始数据
   */
  data: {
    // 数字提示
    numShiow: false,
    tipLeft: 0, //提示的x坐标
    tipHeight: 0, //提示线条的高度
    curveColText: ['100', '80', '60', '40', '20', '0'], //y轴
    // 主要数据
    curve: {
      bgColor: "#fcede0",
      date: ["09-08", "09-09", "09-11", "09-12", "09-14", "09-16", "09-17", "09-18", "09-28"],
      lineColor: "#f9d3b5",
      list: [62, 67, 76, 70, 76, 85, 85, 88, 57],
      name: "肤色",
      xData: [],
    },
    tipIndex: 0,
    whatShow: false,
    getshow: false,
  
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let {curveColText } = this.data //y坐标
    let {bgColor,date,lineColor,list,xData } = this.data.curve //y坐标
    let curveCanvas = wx.createCanvasContext('curveCanvas');
    let lines = wx.createCanvasContext('lines');
    this.drawLines(list, lines);
    this.drawCurve(curveCanvas, curveColText, date, list, xData, lineColor, bgColor);
    },
  // gundong
  scrollCanvas: function (e) {
    console.log(e);
    let index = e.currentTarget.dataset.index
    var canvasLen = e.detail.scrollLeft;
      this.setData({
        indexScroll: index,
        canvasLen: canvasLen
      })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  // 获取坐标
  getZuoBiao(e) {
    let indexs = e.currentTarget.dataset.indexs
    let index = e.target.dataset.index
    let x = e.detail.x
    this.setData({
      tipIndexs: indexs,
      tipIndex: index
    })
    console.log(e)
    let tipHeight =this.data.curve.xData[index].y
    let tipLeft =this.data.curve.xData[index].x
    console.log('x坐标',x)
    console.log(tipHeight)
    this.setData({
      numShiow: true,
      tipLeft:tipLeft-10,
      tipHeight:tipHeight
    })
    let score = this.data.curve.list[index]
    console.log(this.data.curve.list[index])
    console.log(this.data.curve.date[index])
   
    this.setData({
      score: score,
    })
    

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
   
  },
  //
  // 曲线
  drawCurve(curveCtx, curveColText, curveText, curveData, xData, LineColor, colorEnd) {
    this.drawLineBg(curveCtx); //画横纵坐标框架
    this.drawLineColText(curveColText, curveCtx); //绘制纵坐标文字
    this.drawLineRowText(curveText, curveCtx, xData); //绘制横坐标文字
    this.drawCurveCtx(curveData, curveCtx, xData, LineColor, colorEnd); //绘制曲线
    curveCtx.draw();
  },
  // 阴影
  drawLines(curveData, curveCtx) {
    this.drawCurveCtxs(curveData, curveCtx); //绘制曲线
    curveCtx.draw();
  },
  drawCurveCtx(mData, lineCtx, xData, LineColor, colorEnd) {
    curve.points = [];
    for (let i = 0; i < mData.length; i++) {
      curve.points.push({
        x: 29.5 + i * 52,
        y: 200 - mData[i] / 100 * 150
      });
    }
    this.drawCurvePath(curve.points, lineCtx, LineColor, colorEnd);
    // 获取y轴做线条高度
    curve.points.forEach((v, i) => {
      xData[i].y = v.y
    })
  },
  // 阴影
  drawCurveCtxs(mData, lineCtx) {
    curve.points = [];
    for (let i = 0; i < mData.length; i++) {
      curve.points.push({
        x: 29.5 + i * 52,
        y: 200 - mData[i] / 100 * 150
      });
    }
    this.drawCurvePaths(curve.points, lineCtx);
  },
  // 绘制曲线背景
  drawCurvePath(path, ctx, LineColor, colorEnd) {
    var point = getControlPoint(path);
    ctx.beginPath();
    const grd = ctx.createLinearGradient(174, 180, 200, 0);
    grd.addColorStop(0, '#ffffff');
    grd.addColorStop(0.8, colorEnd);
    grd.addColorStop(1, colorEnd);
    ctx.setFillStyle(grd);
    ctx.setGlobalAlpha(0.8);
    ctx.beginPath();
    ctx.moveTo(29, 200);
    ctx.lineTo(curve.points[0].x, curve.points[0].y);
    var int = 0;
    for (let i = 0; i < curve.points.length; i++) {
      if (i == 0) {
        ctx.quadraticCurveTo(point[0].x, point[0].y, curve.points[1].x, curve.points[1].y);
        int = int + 1;
      } else if (i < curve.points.length - 2) {
        ctx.bezierCurveTo(point[int].x, point[int].y, point[int + 1].x, point[int + 1].y, curve.points[i + 1].x, curve.points[i + 1].y);
        int += 2;
      } else if (i == curve.points.length - 2) {
        ctx.quadraticCurveTo(point[point.length - 1].x, point[point.length - 1].y, curve.points[curve.points.length - 1].x, curve.points[curve.points.length - 1].y);
      }
    }
    ctx.lineTo(curve.points[curve.points.length - 1].x, 200);
    ctx.fill();
    ctx.closePath();
    this.drawCurveSign(point, ctx, LineColor)
  },
  
  // 绘制点加线
  drawCurveSign(point, ctx, LineColor) {
    // 绘制线
    ctx.beginPath();
    ctx.setStrokeStyle(LineColor);
    ctx.setGlobalAlpha(1);
    ctx.setLineWidth(4);
    var int = 0;
    ctx.moveTo(curve.points[0].x - 20, curve.points[0].y);
    for (var i = 0; i < curve.points.length; i++) {
      if (i == 0) {
        ctx.quadraticCurveTo(point[0].x, point[0].y, curve.points[1].x, curve.points[1].y);
        int = int + 1;
      } else if (i < curve.points.length - 2) {
        ctx.bezierCurveTo(point[int].x, point[int].y, point[int + 1].x, point[int + 1].y, curve.points[i + 1].x, curve.points[i + 1].y);
        int += 2;
      } else if (i == curve.points.length - 2) {
        ctx.quadraticCurveTo(point[point.length - 1].x, point[point.length - 1].y, curve.points[curve.points.length - 1].x, curve.points[curve.points.length - 1].y);
      }
    }
    ctx.stroke();
    // 绘制点
    // ctx.beginPath();
    // ctx.setGlobalAlpha(1);
    // for (let i = 0; i < curve.points.length; i++) {
    //   ctx.beginPath();
    //   ctx.arc(curve.points[i].x, curve.points[i].y, 5, 0, 2 * Math.PI);
    //   console.log('点',curve.points[i].x, curve.points[i].y, 5, 0, 2 * Math.PI)
    //   ctx.setFillStyle("#3388FF");
    //   ctx.fill();
    //   ctx.closePath();
    // }
  },
  // 阴影
  // 绘制曲线背景
  drawCurvePaths(path, ctx) {
    var point = getControlPoint(path);
    ctx.beginPath();
    this.drawCurveSigns(point, ctx)
  },
  drawCurveSigns(point, ctx) {
    // 绘制线
    ctx.beginPath();
    ctx.setStrokeStyle("rgba(0,0,0,0.05)");
    // ctx.setStrokeStyle("red");
    ctx.setGlobalAlpha(1);
    ctx.setLineWidth(4);
    var int = 0;
    ctx.moveTo(curve.points[0].x - 20, curve.points[0].y);
    for (var i = 0; i < curve.points.length; i++) {
      if (i == 0) {
        ctx.quadraticCurveTo(point[0].x, point[0].y, curve.points[1].x, curve.points[1].y);
        int = int + 1;
      } else if (i < curve.points.length - 2) {
        ctx.bezierCurveTo(point[int].x, point[int].y, point[int + 1].x, point[int + 1].y, curve.points[i + 1].x, curve.points[i + 1].y);
        int += 2;
      } else if (i == curve.points.length - 2) {
        ctx.quadraticCurveTo(point[point.length - 1].x, point[point.length - 1].y, curve.points[curve.points.length - 1].x, curve.points[curve.points.length - 1].y);
      }
    }
    ctx.stroke();
  },

  // 画横坐标
  drawLineBg(lineCtx) {
    lineCtx.setStrokeStyle("#fff");
    for (let i = 0; i < 6; i++) {
      lineCtx.moveTo(curve.mCenter - 160, 50 + 30 * i);
      lineCtx.lineTo(curve.mCenter + 160, 50 + 30 * i);
      lineCtx.stroke();
    }
  },
  // 绘制横坐标文字
  drawLineRowText(mData, lineCtx, xData) {
    lineCtx.setFillStyle("#333");
    lineCtx.setFontSize(12); //设置字体
    for (let i = 0; i < mData.length; i++) {
      if (mData.length >= 3 && mData[1] != '') {
        lineCtx.fillText(mData[i], 20 + i * 49, 220);
        xData.push({
          tiem: mData[i],
          x: 20 + i * 49,
          y: 0
        })

        // lineCtx.fillText(mData[i][1], 15 + i * 65, 235);
      } else if (mData[1] == '') {
        // 数据小于等于2的时候的坐标
        lineCtx.fillText(mData[i], 60 + i * 90, 220);
        // lineCtx.fillText(mData[i][1], 35 + i * 80, 235);
        xData.push({
          tiem: mData[i],
          x: 20 + i * 49,
          y: 0
        })
      } else if (mData[2] == '') {
        // 数据小于等于1的时候的坐标
        lineCtx.fillText(mData[i], 20 + i * 90, 220);
        // lineCtx.fillText(mData[i][1], 35 + i * 80, 235);
        xData.push({
          tiem: mData[i],
          x: 20 + i * 49,
          y: 0
        })
      }
    }
    // this.setData({
    //   xData: xData
    // })
  },
  // 绘制纵坐标文字
  drawLineColText(mData, lineCtx) {
    lineCtx.beginPath();
    lineCtx.setFillStyle("#fff");
    for (let i = 0; i < 6; i++) {
      lineCtx.fillText(mData[i], 10, 55 + 30 * i);
    }
  },



  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  },
  // 日历
  // 日历
  onDayClick: function (event) {
    console.log(event.detail)
    wx.showToast({
      title: '日期被点击，具体信息请看Console信息',
      icon: 'none'
    })
  },
  onRangeComplete: function (event) {
    console.log(event.detail)
    var begin = new Date(event.detail.begin);
    var end = new Date(event.detail.end);
    // + ' ' + d.getHours() + ':' + d.getMinutes() + ':' + d.getSeconds()
    var begintime = begin.getFullYear() + '-' + (begin.getMonth() + 1) + '-' + begin.getDate();
    var endtime = end.getFullYear() + '-' + (end.getMonth() + 1) + '-' + end.getDate();
    console.log(begintime)
    console.log(endtime)
    this.setData({
      beginDate: begintime,
      endDate: endtime
    })
    this.getJieGuo(begintime, endtime)

  },
  onMonthChange: function (event) {
    console.log(event.detail)
    wx.showToast({
      title: '月份变换，具体信息请看Console信息',
      icon: 'none'
    })
  },
})
// quxian
// 折线变曲线
let Vector2 = function (x, y) {
  this.x = x;
  this.y = y;
};
Vector2.prototype = {
  "length": function () {
    return Math.sqrt(this.x * this.x + this.y * this.y);
  },
  "normalize": function () {
    let inv = 1 / this.length() == Infinity ? 0 : 1 / this.length();
    return new Vector2(this.x * inv, this.y * inv);
  },
  "add": function (v) {
    return new Vector2(this.x + v.x, this.y + v.y);
  },
  "multiply": function (f) {
    return new Vector2(this.x * f, this.y * f);
  },
  "dot": function (v) {
    return this.x * v.x + this.y * v.y;
  },
  "angle": function (v) {
    return Math.acos(this.dot(v) / (this.length() * v.length())) * 180 / Math.PI;
  }
};

function getControlPoint(path) {
  let rt = 0.3;
  let count = path.length - 2;
  let arr = [];
  for (let i = 0; i < count; i++) {
    let a = path[i];
    let b = path[i + 1];
    let c = path[i + 2];
    let v1 = new Vector2(a.x - b.x, a.y - b.y);
    let v2 = new Vector2(c.x - b.x, c.y - b.y);
    let v1Len = v1.length();
    let v2Len = v2.length();
    let centerV = v1.normalize().add(v2.normalize()).normalize();
    let ncp1 = new Vector2(centerV.y, centerV.x * -1);
    let ncp2 = new Vector2(centerV.y * -1, centerV.x);
    if (ncp1.angle(v1) < 90) {
      let p1 = ncp1.multiply(v1Len * rt).add(b);
      let p2 = ncp2.multiply(v2Len * rt).add(b);
      arr.push(p1, p2);
    } else {
      let p1 = ncp1.multiply(v2Len * rt).add(b);
      let p2 = ncp2.multiply(v1Len * rt).add(b);
      arr.push(p2, p1);
    }
  }
  return arr;
};