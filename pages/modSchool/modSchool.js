// pages/modSchool/modSchool.js
var app = getApp();
const httpUrl = app.globalData.httpUrl;
Page({

    /**
     * 页面的初始数据
     */
    data: {
        schoolIndex:[],
        schoolName:[],
        selectSchool:'请选择你的学校',
        value:''
    },
    bindPicker:function(e){
        var schoolarry = wx.getStorageSync('school') || [];
        var index = new Array();
        var school = new Array();
        for(let i in schoolarry){
            var arr = schoolarry[i];
            var const1 = 0;
            for(let j in arr){
                if (const1 % 2 == 0){
                    var k = arr[j]
                    index.push(k)
                }else{
                    var t = arr[j]
                    school.push(t) 
                }
                const1++
            }
        }
        this.setData({
            schoolIndex:index,
            schoolName:school,
        })
    },
    bindPickerChange:function(e){
        var countArr = this.data.schoolIndex;
        var schoolArr = this.data.schoolName;
        var value = ''
        var school = ''
        for (var i = 0; i <= countArr.length; i++){
            if (i == e.detail.value){
                value = countArr[i]
            }
        }
        for (var i = 0; i <= countArr.length; i++){
            if (i == e.detail.value){
                school = schoolArr[i]
            }
        }
        this.setData({
            selectSchool:school,
            value:value
        })
    },
    userSavaSchool:function(e){
        var getUser = wx.getStorageSync('getUser') || [];
        var that = this
        var schoolId = this.data.value
        if (schoolId != '' && schoolId != 0){
            wx.request({
                url: httpUrl+'api/users/doEdit',
                data: {
                    school_id:schoolId,
                    school_name:that.data.selectSchool,
                    id:getUser.id
                },
                header: { "Content-Type": "application/x-www-form-urlencoded;charset=utf-8" },
                dataType: 'json',
                method: 'POST',
                success: (result) => {  
                  getUser.school_name = result.data.user.school_name
                  getUser.school_id = result.data.user.school_id
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
        }
    },
    /**
     * 生命周期函数--监听页面加载
     */
    onLoad(options) {
        this.bindPicker()
    },

    /**
     * 生命周期函数--监听页面初次渲染完成
     */
    onReady() {
        this.bindPicker()
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