// pages/modPhone/modPhone.js
var app = getApp();
const httpUrl = app.globalData.httpUrl;
Page({

    /**
     * 页面的初始数据
     */
    data: {
        user_phone:'',
        phone_code:''
    },
    userPhone:function(e){
        this.setData({
            user_phone:e.detail.value
        })
    },
    phoneCode:function(e){
        this.setData({
            phone_code:e.detail.value
        })
    },
    
    phoneCodeTap:function(e){
        wx.showToast({
            title: '获取验证码，未开放， 可以直接保存！',
            icon:"none",
            duration:3000
          })
          return
        // 判断手机号码格式是否正确
        // var lengPhone = this.data.user_phone.length
        // if ( lengPhone == 0){
        //     wx.showToast({
        //         title: '请填写手机号码',
        //         icon:'none',
        //         duration:3000
        //     })
        //     return
        // }
        // // 正规匹配手机号号格式
        // var reg = /^(1[3|4|5|6|7|8|9])\d{9}$/;
        // if(!reg.test(this.data.user_phone)){
        //     wx.showToast({
        //         title: '手机号码格式不对',
        //         icon:"none",
        //         duration:3000
        //       })
        //       return
        // };
        // // 发送短信验证码， 登录成功后获取jwt和微信用户信息，保存到globalData和本地存储
        // wx.request({
        //     url: 'url',
        //     data:{
        //         user_phone:this.data.user_phone
        //     },
        //     method:'GET',
        //     dataType:'json',
        //     success:function(res) {
        //       if(res.data.status) {
        //           // 开始倒计时
        //           wx.showToast({
        //             title: '短信发送成功',
        //             icon:'none',
        //             duration:3000
        //           })
        //       }else{
        //           wx.showToast({
        //               title: '短信发送失败',
        //               icon:'none',
        //               duration:3000
        //           })
        //       }
        //     }
        // })
    },
    buttonRelease:function(e){
        var user_phone = this.data.user_phone
        var getUser = wx.getStorageSync('getUser') || [];
        if ( user_phone == 0){
            wx.showToast({
                title: '请填写手机号码',
                icon:'none',
                duration:3000
            })
            return
        };
        wx.request({
           
                  url: httpUrl+'api/users/doEdit',
                  data: {
                      user_phone:user_phone,
                      id:getUser.id
                  },
                  header: { "Content-Type": "application/x-www-form-urlencoded;charset=utf-8" },
                  dataType: 'json',
                  method: 'POST',
                  success: (result) => {
                    getUser.user_phone = result.data.user.user_phone
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
                         wx.navigateBack({});
                     }, 2000)
                      return
                  },
                  fail: (err) => {},
                  complete: (res) => {},
                })
        // wx.request({
        //   url: httpUrl+'api/users/getUsers',
        //   header: { "Content-Type": "application/x-www-form-urlencoded;charset=utf-8" },
        //   dataType: 'json',
        //   method: 'GET',
        //   success: (result) => {
        //       code = result //验证码
        //   },
        //   fail: (err) => {},
        //   complete: (res) => {},
        // })
        // if (this.data.phone_code == code){
        //     wx.request({
        //       url: httpUrl+'api/users/getUsers',
        //       data: {
        //           user_phone:user_phone,
        //           signature:app.globalData.signature
        //       },
        //       header: { "Content-Type": "application/x-www-form-urlencoded;charset=utf-8" },
        //       dataType: 'json',
        //       method: 'POST',
        //       success: (result) => {
        //         wx.showToast({
        //             title: '修改成功',
        //             icon:"none",
        //             duration:3000
        //           })
        //          // 延迟执行
        //          setTimeout(()=>
        //          {
        //              wx.navigateBack({});
        //          }, 2000)
        //           return
        //       },
        //       fail: (err) => {},
        //       complete: (res) => {},
        //     })
        // }else{
        //     wx.showToast({
        //         title: '手机验证码错误',
        //         icon:"none",
        //         duration:3000
        //       })
        //       return
        // }

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