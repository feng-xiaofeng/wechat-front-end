// index.js
//获取应用实例
var app = getApp();
const httpUrl = app.globalData.httpUrl;
// var socketMsgQueue = []

Page({
    data: {
        color: "",
        location: "位置",
        msg1: "1",
        noramalData: [],
        navigation: [],
        goods: [],
        httpUrl1: httpUrl,
        key: '',
        type_id: '',
        startY: 0, //滑动开始y轴位置
        lastY: 0, //滑动开始y轴位置
        showSearch: true,
        startX1: 0, // 触摸开始的X坐标
        endX1: 0, // 触摸结束的X坐标

        scrollFlag: true, // 控制滚动事件的触发频率
        scrollRight: 0,
        page: 1,
        windowHeight: wx.getSystemInfoSync().windowHeight,

        refresherEnabled:true,
        refresherTriggered:false,
        noGoods:false,
        onnectedUserIDs:"",
    },  

    onRefresh:function (params) {
        var that = this
        setTimeout(function () {
            that.setData({
                refresherTriggered:false,
                key: '', //获取点击的当前规格的index
                page: 1,
                goods:[],
            })
            that.Selectshow();
            
        }, 2000)
       
    },
    goodsPage: function (params) {
        const nextPage = this.data.page + 1;
        this.setData({
            page: nextPage,
        })
        this.Selectshow()
    },
    searchKey: function (params) {
        wx.navigateTo({
            url: '/pages/searchPage/searchPage',
            success: function (res) {
                //   let user_id = e.currentTarget.dataset.user_id
                //   res.eventChannel.emit('acceptDataFromOpenerPage', { data: [
                //     user_id,
                //   ]})
            },
            fail: (res) => {},
            complete: (res) => {},
        })
    },
    // 触摸开始事件
    handletouchstart1: function (e) {
        this.setData({
            startX1: e.touches[0].clientX
        });
    },

    // 触摸移动事件
    handletouchmove1: function (e) {
        this.setData({
            endX1: e.touches[0].clientX
        });
    },

    // 触摸结束事件
    handletouchend1: function (e) {
        const startX1 = this.data.startX1;
        const endX1 = this.data.endX1;

        // 判断滑动方向
        if (endX1 - startX1 > 50) {
            // 右滑动
            console.log('向右滑动');

        } else if (startX1 - endX1 > 50) {
            // 左滑动
            console.log('向左滑动');
        }
    },
    

    Selectshow: function (e) {
        var that = this
        var getUser = wx.getStorageSync('getUser') || [];
        wx.request({
            url: httpUrl + 'api',
            method: "GET",
            header: {
                "Content-Type": "application/x-www-form-urlencoded;charset=utf-8"
            },
            dataType: 'json',
            data: {
                id: getUser.id,
                page: that.data.page
            },
            success: (res) => {
                var goods = res.data.goods
                var onnectedUserIDs = res.data.onnectedUserIDs
                wx.setStorageSync('onnectedUserIDs', onnectedUserIDs)
                this.setData({
                    goods: that.data.goods.concat(goods),
                    onnectedUserIDs:onnectedUserIDs,
                    scrollFlag: true ,// 恢复滚动事件触发频率
                    noGoods:true
                })
            },
        })

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
    Getdingwei: function () {
        var that = this;
        wx.choosePoi({
            success: function (res) {
                console.log('获取到', res);
                // res.address
                that.setData({
                    location: res.name
                })
            },
            fail: function (res) {
                console.log('获取不到', res)
            }
        })
    },
    selShopTc: function (e) {
        var curIdx = e.currentTarget.dataset.index;
        this.setData({
            key: curIdx, //获取点击的当前规格的index
            noGoods:true,
        })

    },
    goodsTypeId: function (e) {
        var type_id = e.currentTarget.dataset.type_id
        var getUser = wx.getStorageSync('getUser') || [];
        wx.request({
            url: httpUrl + 'api/typeIdIndex',
            method: "GET",
            header: {
                "Content-Type": "application/x-www-form-urlencoded;charset=utf-8"
            },
            dataType: 'json',
            data: {
                user_id: getUser.id,
                type_id: type_id,
            },
            success: (res) => {
                var goods = res.data.goods
                this.setData({
                    goods: goods,
                    noGoods:true
                })
            },
        })

    },
    // 监听页面滚动事件
    handletouchmove(event) {
        let currentY = event.changedTouches[0].clientY
        
        if (currentY <= this.data.startY) {
            this.setData({
                showSearch: false
            })
        } else {
            this.setData({
                showSearch: true
            })
        }
    },
    goodsType:function (params) {
        var goodstype = wx.getStorageSync('goodstype') || [];
        this.setData({
            navigation:goodstype,
        })
    },
    //滑动开始事件
    handletouchstart: function (event) {
        this.data.startY = event.changedTouches[0].clientY
    },
    /**
     * 生命周期函数--监听页面加载
     */
    onLoad(options) {
        //   文件里取值S
        // this.handleScroll()
    },
    
    /**
     * 页面相关事件处理函数--监听用户下拉动作
     */
    onPullDownRefresh(e) {
        
    },

    /**
     * 生命周期函数--监听页面初次渲染完成
     */
    onReady: function () {
        wx.getSystemInfo({
            success: function (res) {
                var screenHeight = parseInt(res.screenHeight, 10) * 0.1;
                wx.setStorageSync('screenHeight', screenHeight)
            }
        });
        this.goodsType()

        this.Selectshow()

    },
    /**
     * 生命周期函数--监听页面显示
     */
    onShow() {
        var refresh = app.globalData.refresh
        if (refresh != 0) {
            this.Selectshow();
            app.globalData.refresh = 0
        }

    },
})