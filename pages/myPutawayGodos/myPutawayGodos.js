// pages/myPutawayGodos/myPutawayGodos.js
var app = getApp();
const httpUrl = app.globalData.httpUrl;
Page({

    /**
     * 页面的初始数据
     */
    data: {
        goodsState: [{
                Id: 0,
                Name: "全部"
            },
            {
                Id: 1,
                Name: "上架中"
            },
            {
                Id: 2,
                Name: "待上架"
            },
            {
                Id: 3,
                Name: "交易中"
            },
            {
                Id: 4,
                Name: "已完成"
            },
        ],
        key: '',
        checked: '',
        user_id: '',
        getUserGoods: [],
        httpUrl: httpUrl,
        startY: 0, //滑动开始y轴位置
        lastY: 0, //滑动开始y轴位置
        showSearch: 'fixed',
        returnChecked: [],
        goodsType: []

    },
    selShopTc: function (e) {
        var curIdx = e.currentTarget.dataset.index;
        console.log(e.currentTarget.dataset.index)
        this.setData({
            key: curIdx, //获取点击的当前规格的index
        })

    },
    getGoods: function (e) {
        var that = this
        var checked = e.currentTarget.dataset.checked
        that.getUserGoods(checked)
    },
    getUserGoods: function (checked) {
        var that = this
        var user_id = that.data.user_id
        wx.request({
            url: httpUrl + 'api/goods/doUserIssue',
            method: "GET",
            header: {
                "Content-Type": "application/x-www-form-urlencoded;charset=utf-8"
            },
            dataType: 'json',
            data: {
                user_id: user_id,
                checked: checked,
            },
            success: (res) => {
                var getUserGoods = res.data.getUserGoods
                //  wx.setStorageSync('getUserGoods',getUserGoods)
                that.setData({
                    getUserGoods: getUserGoods,
                })
            },
        })

    },
    tttt:function(e) {
      var checked = ''
      const eventChannel = this.getOpenerEventChannel();
      eventChannel.on('acceptDataFromOpenerPage', (data) => {
          checked = data.data[0]
          var user_id = data.data[1].toString()
          this.setData({
              checked: checked,
              key: checked,
              user_id: user_id,
          })

      })
      this.getUserGoods(checked)
    },
    /**
     * 生命周期函数--监听页面加载
     */
    onLoad(options) {
      

    },
    //滑动开始事件
    handletouchstart: function (event) {
        this.data.startY = event.changedTouches[0].clientY
    },
    // 监听页面滚动事件
    handletouchmove(event) {
        let currentY = event.changedTouches[0].clientY
        if (currentY <= this.data.startY) {
            this.setData({
                showSearch: 'relative'
            })
        } else {
            this.setData({
                showSearch: 'fixed'
            })
        }
    },
    /**
     * 生命周期函数--监听页面初次渲染完成
     */
    onReady() {
        this.tttt()
    },
    // 下架
    soldOut: function (e) {
        var that = this
        var checked = e.currentTarget.dataset.checked
        var goods_id = e.currentTarget.dataset.goods_id
        console.log(e.currentTarget.dataset.goods_id)
        wx.showModal({
            title: '提示',
            content: '确定要下架',
            success(res) {

                if (res.confirm) {
                    console.log('用户点击确定')
                    that.goodsChecked(checked, goods_id)
                } else if (res.cancel) {
                    console.log('用户点击取消')
                }
            }
        })

    },
    // 上架
    putaway: function (e) {
        var checked = e.currentTarget.dataset.checked
        var goods_id = e.currentTarget.dataset.goods_id
        var that = this
        wx.showModal({
            title: '提示',
            content: '确定要上架',
            success(res) {

                if (res.confirm) {
                    console.log('用户点击确定')
                    that.goodsChecked(checked, goods_id)
                } else if (res.cancel) {
                    console.log('用户点击取消')
                }
            }
        })
    },
    // 修改
    modification: function (e) {
        console.log(e)
        var user_id = e.currentTarget.dataset.user_id
        var goods_id = e.currentTarget.dataset.goods_id
        wx.navigateTo({
            url: '/pages/modification/modification',
            success: function (res) {
                res.eventChannel.emit('acceptDataFromOpenerPage', {
                    data: [
                        user_id,
                        goods_id,
                    ]
                })
            }
        })

    },
    // 删除
    delete: function (e) {
        var goods_id = e.currentTarget.dataset.goods_id
        var user_id = e.currentTarget.dataset.user_id
        var that = this
        wx.showModal({
            title: '提示',
            content: '清空本商品',
            success(res) {

                if (res.confirm) {
                    console.log('用户点击确定')
                    wx.request({
                        url: httpUrl + 'api/purchase/delete',
                        method: "GET",
                        header: {
                            "Content-Type": "application/x-www-form-urlencoded;charset=utf-8"
                        },
                        dataType: 'json',
                        data: {
                            user_id: user_id,
                            goods_id: goods_id,
                        },
                        success: (res) => {
                            var getUserGoods = res.data.getGoods
                            that.setData({
                                getUserGoods: getUserGoods,
                            })
                        },
                    })
                } else if (res.cancel) {
                    console.log('用户点击取消')
                }
            }
        })
    },
    // 取消
    cancel: function (e) {
        var checked = e.currentTarget.dataset.checked
        var goods_id = e.currentTarget.dataset.goods_id
        var that = this
        wx.showModal({
            title: '提示',
            content: '确定要取消',
            success(res) {

                if (res.confirm) {
                    console.log('用户点击确定')
                    that.goodsChecked(checked, goods_id)
                } else if (res.cancel) {
                    console.log('用户点击取消')
                }
            }
        })
    },
    // 完成
    accomplish: function (e) {
        var checked = e.currentTarget.dataset.checked
        var goods_id = e.currentTarget.dataset.goods_id
        var that = this
        wx.showModal({
            title: '提示',
            content: '确保完成哦',
            success(res) {

                if (res.confirm) {
                    console.log('用户点击确定')
                    that.goodsChecked(checked, goods_id)
                } else if (res.cancel) {
                    console.log('用户点击取消')
                }
            }
        })
    },
    goodsChecked: function (checked, goods_id) {
        var that = this
        var returnChecked = ''
        wx.request({
            url: httpUrl + 'api/purchase/doEditChecked',
            method: "POST",
            header: {
                "Content-Type": "application/x-www-form-urlencoded;charset=utf-8"
            },
            dataType: 'json',
            data: {
                goods_id: goods_id,
                checked: checked,
            },
            success: (res) => {
                returnChecked = res.data.returnChecked
                var getUserGoods = that.data.getUserGoods
                console.log("returnChecked", returnChecked)
                for (var i = 0; i < getUserGoods.length; i++) {
                    if (getUserGoods[i].Id == returnChecked.Id) {
                        getUserGoods[i] = returnChecked
                    }
                }
                this.setData({
                    getUserGoods: getUserGoods,
                })
            },
        })

    },
    /**
     * 生命周期函数--监听页面显示
     */
    onShow() {
        var goodsType = wx.getStorageSync('goodstype') || [];
        this.setData({
            goodsType: goodsType
        })

        app.globalData.refresh = 1;
    },

    /**
     * 生命周期函数--监听页面隐藏
     */
    onHide() {

    },

    /**
     * 生命周期函数--监听页面卸载
     */
    onUnload() {
    },

    /**
     * 页面相关事件处理函数--监听用户下拉动作
     */
    onPullDownRefresh() {
        var that = this
        var checked = 0
        that.getUserGoods(checked);
        this.setData({
            key: '', //获取点击的当前规格的index
        })

        setTimeout(function () {
            // 不加这个方法真机下拉会一直处于刷新状态，无法复位
            wx.stopPullDownRefresh()
        }, 1000)
    },

    /**
     * 页面上拉触底事件的处理函数
     */
    onReachBottom() {

    },

    /**
     * 用户点击右上角分享
     */
    onShareAppMessage() {

    }
})