// pages/information/information.js
var app = getApp();
Page({

    /**
     * 页面的初始数据
     */
    data: {
        msgNotification: [],
        httpUrl1: app.globalData.httpUrl,
    },
    deleteTechnician: function (e) {
        var that = this;

        var user_id = e.currentTarget.dataset.user_id; //   获取当前长按图片下标
        var user_id_to = e.currentTarget.dataset.user_id_to; //   获取当前长按图片下标
        var messagekey = user_id * user_id_to

        wx.showModal({
            // cancelColor: 'cancelColor',
            title: '提示',
            content: '删除聊天',
            success: function (res) {
                if (res.confirm) {
                    console.log('确定');
                    wx.removeStorageSync('messageList' + messagekey)
                    var msgNotification = wx.getStorageSync('msgNotification') || [];
                    console.log("msgNotification", msgNotification)
                    for (var i = 0; msgNotification.length; i++) {
                        if (msgNotification[i].user_id_to.toString() === user_id_to.toString()) {
                            msgNotification.splice(i, 1); // 删除当前元素
                            that.setData({
                                msgNotification: msgNotification
                            })
                            wx.setStorageSync('msgNotification', msgNotification)

                            break; // 注意 break，避免出现问题
                        }
                    }
                    var getMessage = wx.getStorageSync('getMessage_information') || [];
                    console.log("getMessage", getMessage)
                    for (var i = 0; getMessage.length; i++) {
                        if (getMessage[i].user_id_to.toString() === user_id_to.toString()) {
                            getMessage.splice(i, 1); // 删除当前元素
                            wx.setStorageSync('getMessage_information', getMessage)
                            break; // 注意 break，避免出现问题
                        }
                    }
                } else if (res.cancel) {
                    console.log('取消');
                    return false;
                }

            }
        })
    },
    skipDetailed: function (e) {
        wx.navigateTo({
            url: '/pages/contact/contact',
            success: function (res) {
                var user_id_to = e.currentTarget.dataset.user_id_to;
                res.eventChannel.emit('acceptDataFromOpenerPage', {
                    data: [
                        user_id_to,
                    ]
                })
            }
        })

    },

    msgNotification: function (params) {
        var that = this;
        // 从本地存储中获取消息和用户信息，如果未定义则初始化为空数组
        var getMessage = wx.getStorageSync('getMessage_information') || [];

        var user_to = wx.getStorageSync('user_to') || [];
        // 对getMessage和user_to进行遍历
        getMessage.forEach(function (message) {
            user_to.forEach(function (user) {
                if (message && message.speaker && message.speaker === "customer") {
                    // 如果消息的speaker为customer且发送给的用户与当前遍历的用户相匹配
                    if (message.user_id_to.toString() === user.id.toString()) {
                        var msgNotification = wx.getStorageSync('msgNotification') || [];
                        var foundMatchingUser = false;

                        for (var k = 0; k < msgNotification.length; k++) {
                            if (msgNotification[k].user_id_to.toString() === user.id.toString()) {
                                // 更新已存在的用户消息的内容
                                msgNotification[k].content = message.content;
                                msgNotification[k].information_time = message.information_time;
                                msgNotification[k].speaker = message.speaker;
                                msgNotification[k].type = message.type;
                                msgNotification[k].user_id = message.user_id;
                                msgNotification[k].user_id_to = user.id;
                                msgNotification[k].user_to_img = user.avatar_url;
                                msgNotification[k].user_name = user.user_name;
                                foundMatchingUser = true;
                                break;
                            }
                        }
                        if (!foundMatchingUser) {
                            // 将好友消息记录添加到消息列表
                            msgNotification.push({
                                content: message.content,
                                information_time: message.information_time,
                                speaker: message.speaker,
                                type: message.type,
                                user_id: message.user_id,
                                user_id_to: user.id,
                                user_to_img: user.avatar_url,
                                user_name: user.user_name,
                            });
                        }
                        // 更新本地存储和页面数据
                        msgNotification.sort(function (a, b) {
                            return b.information_time - a.information_time;
                        });
                        wx.setStorageSync('msgNotification', msgNotification);
                        that.setData({
                            msgNotification: msgNotification
                        });
                        // 结束当前循环
                        return false;
                    }
                } else {
                    // 如果消息的speaker为server且发送给的用户与当前遍历的用户相匹配
                    if (message.user_id.toString() === user.id.toString()) {
                        var msgNotification = wx.getStorageSync('msgNotification') || [];
                        var foundMatchingUser = false;
                        for (var k = 0; k < msgNotification.length; k++) {
                            if (msgNotification[k].user_id_to.toString() === user.id.toString()) {
                                // 更新已存在的用户消息的内容
                                msgNotification[k].content = message.content;
                                msgNotification[k].information_time = message.information_time;
                                msgNotification[k].speaker = message.speaker;
                                msgNotification[k].type = message.type;
                                msgNotification[k].user_id = message.user_id_to;
                                msgNotification[k].user_id_to = user.id.toString();
                                msgNotification[k].user_to_img = user.avatar_url;
                                msgNotification[k].user_name = user.user_name;
                                msgNotification[k].unreadCount = message.unreadCount;
                                foundMatchingUser = true;
                                break;
                            }
                        }
                        if (!foundMatchingUser) {
                            // 将好友消息记录添加到消息列表
                            msgNotification.push({
                                content: message.content,
                                information_time: message.information_time,
                                speaker: message.speaker,
                                type: message.type,
                                user_id: message.user_id_to,
                                user_id_to: user.id.toString(),
                                user_to_img: user.avatar_url,
                                user_name: user.user_name,
                                unreadCount: message.unreadCount
                            });
                        }
                        // 更新本地存储和页面数据
                        msgNotification.sort(function (a, b) {
                            return b.information_time - a.information_time;
                        });
                        wx.setStorageSync('msgNotification', msgNotification);
                        that.setData({
                            msgNotification: msgNotification
                        });
                        // 结束当前循环
                        return false;
                    }
                }
            });
        });
    },
    /**
     * 生命周期函数--监听页面加载
     */
    onLoad(options) {
        // this.msgNotification()
        // this. detailed();
        // 监听自定义事件，接收来自app.js的消息通知
        wx.$eventBus.on('receiveMessage', this.msgNotification, this);
        // wx.$eventBus.utilEvent('utilEventMessage', this.getMessage, this);
    },

    /**
     * 生命周期函数--监听页面初次渲染完成
     */
    onReady() {
        var msgNotification = wx.getStorageSync("msgNotification")
        if (msgNotification) {
            this.setData({
                msgNotification: msgNotification
            })
        }
    },

    /**
     * 生命周期函数--监听页面显示
     */
    onShow() {
        this.msgNotification()

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