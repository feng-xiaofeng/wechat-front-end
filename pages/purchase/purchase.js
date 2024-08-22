// pages/purchase/purchase.js
var app = getApp();
const httpUrl = app.globalData.httpUrl;
Page({

    /**
     * 页面的初始数据
     */
    data: {
        goodsId: '',
        getPurchaseGoods: [],
        checked: '',
        httpUrl: app.globalData.httpUrl,
    },
    accomplish: function (res) {
        var that = this
        var goods_sate = res.currentTarget.dataset.goods_sate

        wx.showModal({
            title: '提示',
            content: '线下自行交易以完成！',
            success(res) {

                if (res.confirm) {
                    console.log('用户点击确定')
                    that.setData({
                        checked: 4
                    })
                    that.goodsRequest(goods_sate);
                    setTimeout(() => {
                        wx.navigateBack({
                            delta: 2
                        });
                    }, 2000)
                } else if (res.cancel) {
                    console.log('用户点击取消')
                }
            }
        })
    },
    goodsRequest: function (goodsSate) {
        console.log("goodsSate", goodsSate)
        var goodsId = this.data.goodsId
        var checked = this.data.checked
        console.log("goodsId", goodsId)
        wx.request({
            url: httpUrl + 'api/purchase/doEdit',
            method: 'POST',
            data: {
                goods_id: goodsId,
                goods_sate: goodsSate,
                checked: checked
            },
            header: {
                "Content-Type": "application/x-www-form-urlencoded;charset=utf-8"
            },
            dataType: 'json',
            success: (result) => {

                //   清除cookie
                wx.removeStorageSync('getPurchaseGoods')

            },
            fail: (err) => {},
            complete: (res) => {

            },
        })
    },
    cancell: function (res) {
        var that = this;
        var goods_sate = res.currentTarget.dataset.goods_sate;
        wx.showModal({
            title: '提示',
            content: '取消交易商品继续上架！',
            success(res) {
                if (res.confirm) {
                    console.log('用户点击确定')
                    that.setData({
                        checked: 1
                    })
                    that.goodsRequest(goods_sate);
                    setTimeout(() => {
                        wx.navigateBack({
                            delta: 1
                        });
                    }, 2000)
                } else if (res.cancel) {
                    console.log('用户点击取消')
                }
            }
        })
    },
    getPurchaseGoods: function (e) {
        var that = this
        const eventChannel = this.getOpenerEventChannel();
        eventChannel.on('acceptDataFromOpenerPage', (data) => {
            var goodsId = data.data[0]
            var checked = data.data[1]
            console.log("checked", checked)
            that.setData({
                goodsId: goodsId,

            })
            wx.request({
                url: httpUrl + 'api/purchase/add',
                method: 'GET',
                data: {
                    goods_id: goodsId,
                    checked: checked
                },
                header: {
                    "Content-Type": "application/x-www-form-urlencoded;charset=utf-8"
                },
                dataType: 'json',
                success: (result) => {
                    console.log("777")
                    wx.setStorageSync('getPurchaseGoods', result.data.purchaseGodos)
                    that.setData({
                        getPurchaseGoods: result.data.purchaseGodos,
                    })
                },
                fail: (err) => {},
                complete: (res) => {},
            })
        })
    },
    contactBuy: function (e) {
        wx.navigateTo({
            url: '/pages/contact/contact',
            success: function (res) {}
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

    },

    /**
     * 生命周期函数--监听页面显示
     */
    onShow() {
        var that = this
        var purchaseGoodsData = wx.getStorageSync('getPurchaseGoods') || [];
        if (purchaseGoodsData === []) {

            that.getPurchaseGoods();
        } else {
            that.setData({
                purchaseGoodsData: purchaseGoodsData,
            })
        }
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