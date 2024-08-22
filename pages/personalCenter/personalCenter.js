// pages/personalCenter/personalCenter.js
var app = getApp();
const httpUrl = app.globalData.httpUrl;
Page({

    /**
     * 页面的初始数据
     */
    data: {
        number:'',
        checkedFalse:'',
        checkedTrue:'',
        checkedTrading:'',
        getUser:[],
        all:'',
        checked1:"",
        checked2:"",
        httpUrl:httpUrl,
        avatar:app.globalData.avatar,
        avatarUrl:'',
        
    },
    getWxInfo1:function(e){
        wx.navigateTo({
            url: '/pages/auth/auth',
            success:function(res){ 
            }
          }) 
    },
    persInfo:function(e){
        wx.navigateTo({
          url: '/pages/persInfo/persInfo',
          success:function(res){ 
            let user_id = e.currentTarget.dataset.user_id
            res.eventChannel.emit('acceptDataFromOpenerPage', { data: [
              user_id,
            ]})
        },
          fail: (res) => {},
          complete: (res) => {},
        })
    },
    getMyPutawayGoods:function(e){
        var getUser = wx.getStorageSync('getUser') || [];
        var that = this
        wx.request({
          url: httpUrl+'api/goods/userIssue',
          data: {
            id:getUser.id, 
          },
          header: { "Content-Type": "application/x-www-form-urlencoded;charset=utf-8" },
          dataType: 'json',        
          method: 'GET',  
          success: (result) => {
              var number = result.data.number;
              var checkedTrue = result.data.checkedTrue;
              var checkedFalse = result.data.checkedFalse;
              var checkedTrading = result.data.checkedTrading;
              that.setData({
                number:number,
                checkedFalse:checkedFalse,
                checkedTrue:checkedTrue,
                checkedTrading:checkedTrading,
              })
          },
          fail: (err) => {},
        })
    },
    myPutawayGoods:function(e){
        wx.navigateTo({
            url: '/pages/myPutawayGodos/myPutawayGodos',
            success:function(res){ 
                var key = e.currentTarget.dataset.key;
                var user_id = e.currentTarget.dataset.user_id;
                console.log("user_id",user_id)
                res.eventChannel.emit('acceptDataFromOpenerPage', { data: [
                  key,
                  user_id,
                 
                ]})
            }
          }) 
    },
    myOrder:function(e){
        wx.navigateTo({
            url: '/pages/myOrder/myOrder',
            success:function(res){ 
                var key = e.currentTarget.dataset.key;
                res.eventChannel.emit('acceptDataFromOpenerPage', { data: [
                  key,
                ]})
            }
          }) 
    },
    getOrderGoods:function(e){
        var getUser = wx.getStorageSync('getUser') || [];
        var that = this
        wx.request({
          url: httpUrl+'api/order/getCount',
          data: {
            id:getUser.id, 
          },
          header: { "Content-Type": "application/x-www-form-urlencoded;charset=utf-8" },
          dataType: 'json',        
          method: 'GET',  
          success: (result) => {
              var all = result.data.all;
              var checked1 = result.data.checked1;
              var checked2 = result.data.checked2;
              that.setData({
                all:all,
                checked1:checked1,
                checked2:checked2,
              })
          },
          fail: (err) => {},
        })
    },
    getuser1:function (e) {
        var getUser = wx.getStorageSync('getUser') || [];
        var  avatarUrl =getUser.avatar_url.substring(0, app.globalData.avatarCount)
        this.setData({
            getUser: getUser,
            avatarUrl:avatarUrl,
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
       
       this.getMyPutawayGoods();
       this.getOrderGoods();
       this.getuser1()
       
       
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

