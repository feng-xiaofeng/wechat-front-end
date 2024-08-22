// pages/confirmOrder/confirmOrder.js
var app = getApp();
const httpUrl = app.globalData.httpUrl;
Page({

    /**
     * 页面的初始数据
     */
    data: {
        isShowConfirm:false,
        orderNote:'',
        height:'',
        goodsId:'',
        goods:[],
        checked:'',
        httpUrl : app.globalData.httpUrl,
        
    },
    goods:function(){
        var that = this
        const eventChannel = this.getOpenerEventChannel();
        eventChannel.on('acceptDataFromOpenerPage',(data)=> {
        var goodsId = data.data[0]
        that.setData({
            goodsId:goodsId,
        })
        wx.request({
            url: httpUrl + 'api/order/add',
            method: 'GET',
            data: {
                goods_id:goodsId,
            },
            header: { "Content-Type": "application/x-www-form-urlencoded;charset=utf-8" },
            dataType: 'json', 
            success: (result) => {
                wx.getStorageSync('goods',result.data.goods)
                that.setData({
                    goods:result.data.goods,
                })
            },
        })
        })
    },
    
    //输入框中的值
  setValue: function (e) {
    this.setData({
      orderNote: e.detail.value
    })
  },
  //点击取消按钮
  cancel: function (e) {
    var that = this
    that.setData({
      isShowConfirm: false,
    })
  },
  //点击确认按钮
  confirmAcceptance:function(){
    var that = this
    that.setData({
      isShowConfirm: false,
    })
  },
  //拒绝
  close(e) {
    this.setData({
      isShowConfirm: true,
    }) 
  },
  
  submitOrder:function(e){
    var getUser = wx.getStorageSync('getUser') || [];
    var that = this
    var checked = e.currentTarget.dataset.checked
    var user_id = getUser.id
    var seller_id = e.currentTarget.dataset.seller_id
    var price = e.currentTarget.dataset.price
    var goods_name = e.currentTarget.dataset.goods_name
    var school_name = e.currentTarget.dataset.checked
    var goods_image = e.currentTarget.dataset.goods_image
    var remark = that.data.orderNote
    var goods_id = e.currentTarget.dataset.goods_id
    wx.request({
        url: httpUrl + 'api/order/doAdd',
        method: 'POST',
        data: {
            goods_id:goods_id,
            checked:checked,
            user_id:user_id,
            price:price,
            goods_name:goods_name,
            school_name:school_name,
            goods_image:goods_image,
            remark:remark,
            seller_id:seller_id,
        },
        header: { "Content-Type": "application/x-www-form-urlencoded;charset=utf-8" },
        dataType: 'json', 
        success: (result) => {
            
            console.log("result",result.data.goods)
                // wx.getStorageSync('getGoods',result.data.getGoods)
        },
    })
  },
    /**
     * 生命周期函数--监听页面加载
     */
    onLoad(options) {
        var that = this
        that.goods();
        this.setData({
            height:wx.getSystemInfoSync().windowHeight,
            // width:wx.getSystemInfoSync().windowWidth
        })
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