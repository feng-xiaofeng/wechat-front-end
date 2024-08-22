// pages/searchPage/searchPage.js
var app = getApp();
const httpUrl = app.globalData.httpUrl;
Page({

    /**
     * 页面的初始数据
     */
    data: {
        msg1: "1",
        windowHeight: wx.getSystemInfoSync().windowHeight,
        httpUrl1: httpUrl,
        goods: [],
        search: '',
        noGoods:false,
        onnectedUserIDs:'',
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
        var onnectedUserIDs = wx.getStorageSync('onnectedUserIDs') || [];
        this.setData({
            onnectedUserIDs:onnectedUserIDs,
        })
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
        this.setData({
            goods: [],
            windowHeight:'',
            onnectedUserIDs:'',
        })
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

    },
    // 搜索
    getsearch: function (e) {
        var getUser = wx.getStorageSync('getUser') || [];
        var search = this.data.search;
        if (search != '' && !search.match(/^\s+$/)) {
            wx.request({
                url: httpUrl + 'api/searchGoods',
                method: "GET",
                header: {
                    "Content-Type": "application/x-www-form-urlencoded;charset=utf-8"
                },
                dataType: 'json',
                data: {
                    search: search,
                    signature: getUser.signature,
                },
                success: (res) => {

                    var searchGoods = res.data.searchGoods
                    console.log("searchGoods",searchGoods)
                    this.setData({
                        goods: searchGoods,
                        noGoods:true
                    })
                },
            })

        } else {
            wx.showToast({
                title: '请输入搜索的关键字！',
                icon: 'none',
                duration: 3000
            })
            return
        }
        this.deleteSearch()
    },
    search: function (e) {
        this.setData({
            noGoods:false,
            search: e.detail.value
        })
    },
    deleteSearch: function (e) {
        this.setData({
            search: ''
        })
    },
    // 键盘点击事件
    getSearch: function (e) {
        this.getsearch();
    },
    skipDetailed: function (e) {
        wx.navigateTo({
            url: '/pages/detailed/detailed?userName=' + e.currentTarget.dataset.userName + "&id=" + e.currentTarget.dataset.id,
            success: function (res) {
                var userName = e.currentTarget.dataset.username;
                let id = e.currentTarget.dataset.id
                res.eventChannel.emit('acceptDataFromOpenerPage', {
                    data: [
                        userName,
                        id
                    ]
                })
            }
        })

    },
})