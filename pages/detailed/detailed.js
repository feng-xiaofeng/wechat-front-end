// pages/index/detailed/detailed.js
var app = getApp();
var httpUrl = app.globalData.httpUrl;

Page({

    /**
     * 页面的初始数据
     */
    data: {
        goods: [],
        goodImage: [],
        swiperHeight: "",
        url: [],
        httpUrl1: httpUrl,
        imgCollect1: 0,
        user_id: '',
    },
    skipDetailed: function (e) {
        console.log(e)
        wx.navigateTo({
            url: '/pages/contact/contact',
            success: function (res) {
                var user_id_to = e.currentTarget.dataset.user_id_to;
                console.log("user_id_to", user_id_to)
                res.eventChannel.emit('acceptDataFromOpenerPage', {
                    data: [
                        user_id_to,
                    ]
                })
            }
        })
    },
    getUserTo: function (user_id_to) {
        return new Promise((resolve, reject) => {
            wx.request({
                url: httpUrl + 'api/getUserTo' + '?user_to=' + user_id_to,
                method: "GET",
                header: {
                    "Content-Type": "application/x-www-form-urlencoded;charset=utf-8"
                },
                dataType: 'json',
                success: (res) => {
                    var user_to = res.data.user;
                    resolve(user_to); // Return the fetched user data
                },
                fail: (err) => {
                    reject(err); // Return error information on request failure
                }
            });
        });
    },
    onReadygetUserTo: async function (e) {
        var that = this
        var user_toStructure = [];
        var user_id = this.data.goods.UserId;
        try {
            var userMessage = await that.getUserTo(user_id);
            var storedData = wx.getStorageSync('user_to');
            if (Array.isArray(storedData)) {
                user_toStructure = storedData;
            }
            var foundMatchingUser = true;

            for (var i = 0; i < user_toStructure.length; i++) {
                if (user_toStructure[i].id === user_id) {
                    user_toStructure[i] = userMessage;
                    foundMatchingUser = false;
                    break;
                }
            }
            if (foundMatchingUser) {
                // Add the friend's message record to the message list
                user_toStructure.push(userMessage);
            }
            wx.setStorageSync('user_to', user_toStructure);
        } catch (err) {
            console.error(err);
            // Handle the error here
        }
    },
    imgCollect: function (e) {
        var count = e.currentTarget.dataset.collect
        if (count == 0) {
            this.setData({
                imgCollect1: 1
            })
        }
        if (count == 1) {
            this.setData({
                imgCollect1: 0
            })
        }
        console.log(e.currentTarget.dataset.collect)
    },
    //   查看图片，和删除
    deleteTechnician: function (e) {
        var src = e.currentTarget.dataset.src;
        var url = e.currentTarget.dataset.url;
        var replacedString = app.globalData.artworkAvatar;
        var imgUrlStr = []
        var imgUrl = ''
        if (app.globalData.ViewArtwork === 1){
            if (src) { // Check if src is defined
                imgUrl = src.replace(/static\/compress_upload/, replacedString);
            }
    
            if (Array.isArray(url) && url.length > 0) { // Check if url is a valid array
                for (var i = 0; i < url.length; i++) {
                    imgUrlStr.push(url[i].replace(/static\/compress_upload/, replacedString));
                }
            }
        }else{
            imgUrl = src;
            imgUrlStr = url
        }
       
        wx.previewImage({
            current: imgUrl,
            urls: imgUrlStr,
        })
    },
    // 获取图片高度
    computeImgHeight: function (e) {
        var winWid = wx.getSystemInfoSync().windowWidth;
        var imgh = e.detail.height - 900; //图片高度
        var imgw = e.detail.width;
        var swiperH = Math.max(winWid * imgh / imgw, 400) + "px"; // 设置最小高度为 200px
        this.setData({
            swiperHeight: swiperH, //设置swiper高度
        });
    },
    detailed: function (e) {
        var that = this
        var userName = ""
        var id = ""
        const eventChannel = this.getOpenerEventChannel();
        eventChannel.on('acceptDataFromOpenerPage', (data) => {
            userName = data.data[0]
            id = data.data[1]
            wx.request({
                url: httpUrl + 'api/detailed/add',
                method: "GET",
                data: {
                    user_name: userName,
                    id: id
                },
                header: {
                    "Content-Type": "application/x-www-form-urlencoded;charset=utf-8"
                },
                dataType: 'json',
                success: (res) => {
                    var imgArr = res.data.goodImage
                    var array = new Array()
                    for (var i in imgArr) {
                        var arr2 = imgArr[i];
                        var count = 0;
                        for (var j in arr2) {
                            if (count === 2) {
                                var img = httpUrl + arr2.ImgUrl;
                                array.push(img)
                            }
                            count++
                        }
                    }
                    var getUser = wx.getStorageSync('getUser') || []
                    console.log("getUser.id", getUser.id)
                    console.log("res.data.goods", res.data.goods)
                    that.setData({
                        goods: res.data.goods,
                        goodImage: res.data.goodImage,
                        url: array,
                        user_id: getUser.id
                    })
                },
                fail: (err) => {
                    console.log("失败", err)
                },
                complete: (res) => {},
            })
        })
    },
    putchase: function (e) {
        console.log(e.currentTarget.dataset.goods_id)
        wx.navigateTo({
            url: '/pages/confirmOrder/confirmOrder?goodsId=' + e.currentTarget.dataset.goods_id,
            success: function (res) {
                app.globalData.refresh = 1
                let goods_id = e.currentTarget.dataset.goods_id
                res.eventChannel.emit('acceptDataFromOpenerPage', {
                    data: [
                        goods_id,
                    ]
                })
            }
        })
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad(options) {
        this.detailed()

    },

    /**
     * 生命周期函数--监听页面初次渲染完成
     */
    onReady() {
        setTimeout(() => {
            this.onReadygetUserTo()
        }, 500)

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