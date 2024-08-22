// pages/myOrder/myOrder.js
var app = getApp();
const httpUrl = app.globalData.httpUrl;
Page({

    /**
     * 页面的初始数据
     */
    data: {
        orderStatus: [{
                Id: 0,
                Name: "全部"
            },
            {
                Id: 1,
                Name: "交易中"
            },
            {
                Id: 2,
                Name: "已完成"
            },
        ],
        key: '',
        getOrderGoods: [],
        httpUrl: httpUrl,
        isShowConfirm: false,
    },
    //点击取消按钮
    cancel: function (e) {
        var that = this
        that.setData({
            isShowConfirm: false,
        })
    },
    //点击确认按钮
    confirmAcceptance: function () {
        var that = this
        that.setData({
            isShowConfirm: false,
        })
    },
    //拒绝
    close(e) {
        console.log(e)
        this.setData({
            isShowConfirm: true,
        })
    },
    getOrderGoods: function (checked) {
        var that = this
        var getUser = wx.getStorageSync('getUser') || [];
        wx.request({
            url: httpUrl + 'api/order/getOrderGoods',
            method: "GET",
            header: {
                "Content-Type": "application/x-www-form-urlencoded;charset=utf-8"
            },
            dataType: 'json',
            data: {
                user_id: getUser.id,
                checked: checked,
            },
            success: (res) => {
                var getOrderGoods = res.data.getOrderGoods
                wx.setStorageSync('getOrderGoods', getOrderGoods)
                that.setData({
                    getOrderGoods: getOrderGoods,
                })
            },
        })
    },
    getOrder: function (e) {
        var that = this
        var checked = e.currentTarget.dataset.checked
        var getOrderGoods = wx.getStorageSync('getOrderGoods') || [];
        if (getOrderGoods == []) {
            that.getOrderGoods(checked)  
        }
        that.setData({
            getOrderGoods: getOrderGoods
        })
    },
    selShopTc: function (e) {
        var curIdx = e.currentTarget.dataset.index;
        console.log(e.currentTarget.dataset.index)
        this.setData({
            key: curIdx, //获取点击的当前规格的index
        })

    },
    /**
     * 生命周期函数--监听页面加载
     */
    onLoad(options) {

    },

    /**
     * 生命周期函数--监听页面初次渲染完成
     */
    onReady() {
        var checked = ''
        const eventChannel = this.getOpenerEventChannel();
        eventChannel.on('acceptDataFromOpenerPage', (data) => {
            checked = data.data[0]
            this.setData({
                key: checked,
            })

        })
        this.getOrderGoods(checked)
    },


    /**
     * 生命周期函数--监听页面显示
     */
    onShow() {

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