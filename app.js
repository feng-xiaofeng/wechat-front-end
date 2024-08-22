// app.js
const EventBus = require('./eventBus.js');
App({
    globalData: { //全局变量
        // httpUrlimg:'https://weixinxiaochengxguangguang.oss-cn-beijing.aliyuncs.com/',
        httpUrl: 'http://fxiaofeng.top/',
        ws: "ws:http://fxiaofeng.top//ws",
        refresh: 0,
        getOrderGoods: [],
        socketTask: null,
        detailed: false,
        eventBus: new Map(),

        avatar: "static/avatar_upload",
        artworkAvatar: "static/upload",
        avatarCount: 20,
        ViewArtwork: 1, // 0  功能已经有所改动查看原图

    },
    /**
     * 当小程序初始化完成时，会触发 onLaunch（全局只触发一次）
     */
    onLaunch: function () {
        //   清除cookie
        //   wx.removeStorageSync('userInfo')
        //   文件里取值
        this.initUserInfo();
        this.goodsType();
        setTimeout(() => {
            this.connectWebSocket();
            this.listenForMessages();
        }, 3000)

        // 初始化事件总线
        wx.$eventBus = new EventBus();
        
    },
    goodsType: function (e) {
        var that = this
        wx.request({
            url: that.globalData.httpUrl + 'api/goodsType',
            method: "GET",
            header: {
                "Content-Type": "application/x-www-form-urlencoded;charset=utf-8"
            },
            dataType: 'json',
            success: (res) => {
                var goodsType = res.data.goodsType
                wx.setStorageSync('goodstype', goodsType)
            },
        })
    },
    connectWebSocket: function () {
        var getUser = wx.getStorageSync('getUser') || [];
        var that = this;
        this.globalData.socketTask = wx.connectSocket({
            url: that.globalData.ws + '?user_id=' + getUser.id,
            header: {
                'content-type': 'application/json'
            },
            method: "GET",
            success: function () {
                console.log("连接成功");
                that.heartbeat(); // 在连接成功后启动心跳协程
            },
            fail: function () {
                console.log("连接失败");
            }
        });
        this.globalData.socketTask.onOpen(function (res) {
            console.log('WebSocket连接已打开');
        });
        // 监听 WebSocket 错误事件
        this.globalData.socketTask.onError(function (res) {
            console.error('WebSocket 错误:', res);
        });

    },
    heartbeat: function () {
        var that = this;
        setInterval(function () {
            if (that.globalData.socketTask.readyState === 1) {
                that.globalData.socketTask.send("heartbeat"); // 发送心跳包
            }
        }, 10000); // 每隔5秒发送一次心跳包
    },
    listenForMessages: function () {
        var that = this;

    function handleMessage(res) {
        // 检查是否是心跳包
        if (res.data === 'heartbeat') {
            console.log('收到心跳包');
            return;
        }
      
        var message;
        try {
            message = JSON.parse(res.data);
        } catch (error) {
            return;
        }
      
        if (message === null) {
            console.log("app_收到空信息", message);
            return;
        }
      
        console.log("app_收到的信息", message);
      
        var messagekey = message.user_id_to * message.user_id;
        var messageList = wx.getStorageSync('messageList' + messagekey) || [];
        if (Array.isArray(messageList)) {
            messageList.push(message);
            wx.setStorageSync('messageList' + messagekey, messageList);
            that.getMessage(message);
            wx.$eventBus.triggerEvent('receiveMessage');
        } else {
            console.log('信息接收数据错误', messageList);
        }
    }

    this.globalData.socketTask.onMessage(handleMessage);
    },
    
    getMessageUser: async function (Message) {
        var that = this
        var user_to = wx.getStorageSync('user_to') || [];
        if (user_to.length > 0) {
            try {
                var userMessage = await that.getUserTo(Message.user_id);
                var foundMatchingUser = true;
                for (var i = 0; i < user_to.length; i++) {
                    if (user_to[i].id.toString() === Message.user_id.toString()) {
                        user_to[i] = userMessage;
                        foundMatchingUser = false;
                        break;
                    }
                }
                if (foundMatchingUser) {
                    // Add the friend's message record to the message list
                    user_to.push(userMessage);
                }
                wx.setStorageSync('user_to', user_to);
            } catch (err) {
                console.error(err);
                // Handle the error here
            }
        } else {
            try {
                var user_toStructure = await that.getUserTo(Message.user_id);
                user_to.push(user_toStructure);
                wx.setStorageSync('user_to', user_to);
            } catch (err) {
                console.error(err);
                // Handle the error here
            }
        }
    },
    getUserTo: function (user_id_to) {
        var that = this
        return new Promise((resolve, reject) => {
            wx.request({
                url: that.globalData.httpUrl + 'api/getUserTo' + '?user_to=' + user_id_to,
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
    getMessage: function (Message) {
        var that = this
        var foundMatchingUser = true;
        if (Array.isArray([Message])) {
            that.getMessageUser(Message);
            var getMessage = wx.getStorageSync('getMessage_information') || []; // Initialize as an empty array if not defined
            if (Array.isArray(getMessage)) {
                for (var i = 0; i < getMessage.length; i++) {
                    if (Message.user_id === getMessage[i].user_id && Message.user_id_to === getMessage[i].user_id_to || Message.user_id === getMessage[i].user_id_to && Message.user_id_to === getMessage[i].user_id) {
                        console.log(getMessage[i])
                        if (isNaN(getMessage[i].unreadCount)) {
                            Message.unreadCount = 1;
                        } else {
                            Message.unreadCount = getMessage[i].unreadCount + 1;
                        }
                        getMessage[i] = Message;
                        foundMatchingUser = false;
                        break;
                    }
                }
                if (foundMatchingUser) {
                    // Add the friend's message record to the message list
                    Message.unreadCount = 1;
                    getMessage.push(Message);
                }
                wx.setStorageSync('getMessage_information', getMessage);
            } else {
                console.log('getMessage信息接收数据错误', getMessage);
            }
        } else {
            console.log('Message信息接收数据错误', Message);
        }
    },
    putchase: function (message) {
        wx.switchTab({
            url: '/pages/information/information',
            success: function (res) {
                res.eventChannel.emit('acceptDataFromOpenerPage', {
                    data: [
                        message,
                    ]
                })
            }
        })
    },
    closeWebSocket: function () {
        var that = this
        if (that.globalData.socketTask) {
            that.globalData.socketTask.close();
        }
    },
    userDoAdd: function (signature, nickName, avatarUrl) {
        wx.request({
            url: this.globalData.httpUrl + 'api/users/doAdd',
            data: {
                user_name: nickName,
                signature: signature,
                avatar_url: avatarUrl
            },
            header: {
                "Content-Type": "application/x-www-form-urlencoded;charset=utf-8"
            },
            dataType: 'json',
            method: 'POST',
            success: (result) => {
                var getUser = result.data.user;
                wx.setStorageSync('getUser', getUser)
                console.log("getUser11", getUser)
            },
            fail: (err) => {},
            complete: (res) => {},
        })
    },
    //   公共全局变量
    initUserInfo: function (res, localInfo) {
        var that = this;
        wx.getSetting({
            success(result) {
                if (result.authSetting['scope.userInfo']) {
                    that.getUserInfo();
                } else {
                    wx.showModal({
                        title: '提示',
                        content: '您未授权获取用户信息，请点击确定进行授权。',
                        success: function (res) {
                            if (res.confirm) {
                                wx.openSetting({
                                    success: function (result) {
                                        if (result.authSetting['scope.userInfo']) {
                                            that.getUserInfo();
                                        } else {
                                            wx.navigateBackMiniProgram();
                                        }
                                    },
                                    fail: function (result) {
                                        console.log('用户拒绝打开设置页');
                                        wx.navigateBackMiniProgram();
                                    }
                                });
                            } else {
                                console.log('用户点击了取消');
                                wx.navigateBackMiniProgram();
                            }
                        }
                    });
                }
            },
            fail(result) {
                console.log('获取用户设置失败');
                wx.navigateBackMiniProgram();
            }
        });
    },
    getUserInfo: function () {
        var that = this;
        var getUser = wx.getStorageSync('getUser') || [];
        console.log("getUser", getUser)
        if (getUser.length === 0) {
            wx.showModal({
                title: '提示',
                content: '获取用户信息，请点击确定进行授权。',
                success: function (res) {
                    if (res.confirm) {
                        wx.getUserProfile({
                            desc: '用于完善资料',
                            success(resp) {
                                var userInfo = resp.userInfo;
                                var signature = resp.signature;
                                that.userDoAdd(signature, userInfo.nickName, userInfo.avatarUrl);
                            },
                            fail(res) {}
                        })
                    } else {
                        console.log('用户点击了取消');
                        wx.navigateBackMiniProgram({
                            extraData: {
                                foo: 'bar'
                            },
                            success(res) {
                                // 退出成功
                            },
                            fail(err) {
                                // 退出失败
                            }
                        });
                    }
                }
            });
        }
    },
    generateRandomSignature: function (length) {
        const characters = 'abcdef0123456789';
        let signature = '';

        for (let i = 0; i < length; i++) {
            const randomIndex = Math.floor(Math.random() * characters.length);
            signature += characters[randomIndex];
        }

        return signature;
    },
    generateRandomGuestName: function () {
        const characters = 'abcdefghijklmnopqrstuvwxyz0123456789';
        let guestName = '游客';

        for (let i = 0; i < 6; i++) {
            const randomIndex = Math.floor(Math.random() * characters.length);
            guestName += characters[randomIndex];
        }

        return guestName;
    },
    /**
     * 当小程序启动，或从后台进入前台显示，会触发 onShow
     */
    onShow: function (options) {
        // 重新连接WebSocket
        this.connectWebSocket();
        this.listenForMessages();
    },

    /**
     * 当小程序从前台进入后台，会触发 onHide
     */
    onHide: function () {
        // this.listenForMessages();

        this.closeWebSocket();
    },

    /**
     * 当小程序发生脚本错误，或者 api 调用失败时，会触发 onError 并带上错误信息
     */
    onError: function (msg) {

    }
})