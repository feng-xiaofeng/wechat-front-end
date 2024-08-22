// pages/persInfo/persInfo.js
var app = getApp();
const httpUrl = app.globalData.httpUrl;
Page({

    /**
     * 页面的初始数据
     */
    data: {
        getUser: [],
        httpUrl:httpUrl,
        avatar:app.globalData.avatar,
        avatarUrl:'',
    },
    headImage: function (params) {
        var that = this
        console.log("111");
        var getUser = wx.getStorageSync('getUser') || [];
        wx.chooseMedia({
            count: 1, // 可选择的数量，这里设置为最多选择1张照片
            mediaType: ['image'], // 限定选择的媒体类型为照片
            success(res) {
                // 获取选择的照片列表
                const mediaList = res.tempFiles;
                // 判断是否有选择照片
                if (mediaList.length > 0) {
                    // 遍历选中的照片列表
                    wx.compressImage({
                        src: mediaList[0].tempFilePath,
                        compressedWidth: 150,
                        compressedHeight:150,
                        quality: 100, // 压缩质量，0-100之间
                        success: function (compressRes) {
                            var compressedTempFilePath = compressRes.tempFilePath;

                            that.uploadImage(compressedTempFilePath)
                                .then((res) => {
                                    var data1 = JSON.parse(res.data);
                                    var images = data1.imgDir;
                                    console.log("httpUrl", httpUrl);
                                    console.log("images", images);
                                    wx.request({
                                        url: httpUrl + 'api/users/doEdit',
                                        data: {
                                            avatar_url: httpUrl + images,
                                            id: getUser.id
                                        },
                                        header: {
                                            "Content-Type": "application/x-www-form-urlencoded;charset=utf-8"
                                        },
                                        dataType: 'json',
                                        method: 'POST',
                                        timeout: 5000,
                                        success: (result) => {
                                            getUser.avatar_url = result.data.user.avatar_url;
                                            wx.setStorageSync('getUser', getUser);
                                            wx.showToast({
                                                title: '修改成功',
                                                icon: "none",
                                                duration: 3000
                                            });
                                            // 延迟执行
                                            // setTimeout(() => {
                                            //     wx.navigateBack({});
                                            // }, 2000);
                                        },
                                        fail: (err) => {
                                            console.log("失败", err);
                                        },
                                        complete: (res) => {},
                                    });
                                })
                                .catch((error) => {
                                    console.log("图片上传失败", error);
                                });
                        }
                    });
                }
            }
        });
    },
    uploadImage: function (filePath) {
        return new Promise((resolve, reject) => {
            wx.uploadFile({
                filePath: filePath,
                name: 'file',
                url: httpUrl + 'api/release/uploadImage',
                header: {
                    "content-type": "multipart/form-data"
                },
                success: function (res) {
                    resolve(res);
                },
                fail: function (error) {
                    reject(error);
                }
            });
        });
    },
    userAvatar: function (e) {
        console.log("1111")
        wx.navigateTo({
            url: '/pages/avatar/avatar',
        })
    },
    userName: function (e) {
        wx.navigateTo({
            url: '/pages/modNmae/modName',
        })
    },
    modPhone: function (e) {
        wx.navigateTo({
            url: '/pages/modPhone/modPhone',
        })
    },

    modSchool: function (e) {
        wx.navigateTo({
            url: '/pages/modSchool/modSchool',
        })

    },
    getSchool: function (e) {
        wx.request({
            url: app.globalData.httpUrl + 'api/perslnfo/dstrSchool',
            header: {
                "Content-Type": "application/x-www-form-urlencoded;charset=utf-8"
            },
            dataType: 'json',
            method: 'GET',
            success: (result) => {
                var school = result.data.school
                wx.setStorageSync('school', school)
            },
            fail: (err) => {},
            complete: (res) => {},
        })
    },
    getuser1: function (e) {
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
        this.getSchool()
    },

    /**
     * 生命周期函数--监听页面显示
     */
    onShow(e) {
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