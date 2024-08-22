// pages/modNmae/modName.js
var app = getApp();
const httpUrl = app.globalData.httpUrl;
Page({

    /**
     * 页面的初始数据
     */
    data: {
        user_name:null
    },
    userName:function(e){
        if(e.detail.value.length <= 12){
            this.setData({
                user_name:e.detail.value
            })
        }
    },
    buttonRelease:function(e){
        var that = this
        var getUser = wx.getStorageSync('getUser') || [];
        var userName =  this.data.user_name
        
        if (userName == null ){
            wx.showToast({
                title: '名字不能为空哦！',
                icon:'none',
                duration:3000
            })
            return
        }if (userName.match(/^\s+$/)) {
            wx.showToast({
                title: '名字不能全是空格符哦！',
                icon:'none',
                duration:3000
            })
            return
        } else {
            wx.request({
              url: httpUrl+'api/users/doEdit',
              data: {
                  user_name:userName,
                  id:getUser.id
              },
              header: { "Content-Type": "application/x-www-form-urlencoded;charset=utf-8" },
              dataType: 'json',
              method: 'POST',
              timeout: 5000,
              success: (result) => {
                  getUser.user_name = result.data.user.user_name
                  wx.setStorageSync('getUser', getUser)
                app.globalData.refresh = 1
                wx.showToast({
                    title: '修改成功',
                    icon:"none",
                    duration:3000
                    })
                    // 延迟执行
                setTimeout(()=>
                {
                    wx.navigateBack({
                    });
                }, 2000)
            },
            fail: (err) => {
              console.log("失败",err)
            },
              complete: (res) => {},
            })
        }
        
    },
    /**
     * 生命周期函数--监听页面加载
     */
    onLoad(options) {

    },

    /**
     * 生命周期函数--监听页面初次渲染完成
     */
    onReady(e) {

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