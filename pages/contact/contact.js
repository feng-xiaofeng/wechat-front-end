var app = getApp();
const httpUrl = app.globalData.httpUrl;
const util = require('../detailed/detailed.js');
import models from '../models.js'
var windowHeight1 = wx.getSystemInfoSync().windowHeight;
var keyHeight = 0;
// var debounceScrollHandler = models.debounce(this.scrollHandler, 500); // Adjust the debounce time as needed

/**
 * 计算msg总高度
 */
function calScrollHeight(that, keyHeight) {
    var query = wx.createSelectorQuery();
    query.select('.scrollMsg').boundingClientRect(function (rect) {}).exec();
}
/**
 * 初始化数据
 */
Page({
    /**
     * 页面的初始数据
     */
    data: {
        toView: "",
        scrollHeight: '90vh',
        inputBottom: 0,
        inputMessage: '',
        user_img: '',
        user_name: "",
        user_to_Data: [],
        messageList: [],
        contact_user_id_to: '',
        setFocus: false,
        mistiming: '300',
        showPlusPage: false, // 控制+号展开的页面显示与隐藏
        imgcount: "6",
        httpUrl1: app.globalData.httpUrl,
        windowheight: windowHeight1 * 0.3,
        Width: 700, //压缩图片的宽度
        quality: 30, //压缩图片的质量
        page: 1,
        pageSize: 15,
        hasMoreMessages: true,
        holdKeyboard: true,
        scrollTop: 0,
    },
    handletouchstart: function (event) {
        var setFocus = this.data.setFocus
        if (!setFocus) {
            this.setData({
                //     holdKeyboard: false,
                scrollHeight: '90vh',
                showPlusPage: false,
                inputBottom: 0,

            })
        }

    },

    getPagedMessages: function (messagekey, pageNumber, pageSize) {
        var messageList = wx.getStorageSync(messagekey) || [];
        var start = messageList.length - (pageNumber * pageSize);
        var end = start + pageSize;
        if (start < 0) {
            start = 0;
        }
        var pagedMessages = messageList.slice(start, end);
        pagedMessages.sort(function (a, b) {
            return a.information_time - b.information_time;
        });
        return pagedMessages;
    },
    loadMoreMessages: function () {
        var that = this
        var contact_user_id_to = that.data.contact_user_id_to
        var pageNumber = that.data.page + 1
        that.setData({
            page: pageNumber
        })
        if (!that.data.hasMoreMessages) {
            return;
        }
        that.historicalMessageList(contact_user_id_to)
    },
    historicalMessageList: function (contact_user_id_to) {
        var that = this
        var getUser = wx.getStorageSync('getUser') || [];
        var messagekey = contact_user_id_to * getUser.id
        var pageNumber = that.data.page
        var pageSize = that.data.pageSize
        var messageKeyStr = 'messageList' + messagekey
        var messageList = that.getPagedMessages(messageKeyStr, pageNumber, pageSize);
        if (messageList.length < pageSize) {
            that.setData({
                hasMoreMessages: false
            });
        }
        that.setData({
            toView: 'msg-' + 15,
            // 将新消息拼接在旧消息的前面
            messageList: messageList.concat(that.data.messageList),
            // 将新消息拼接在旧消息的后面
            // messageList: that.data.messageList.concat(messageList),
        })

    },
    messageList: function (contact_user_id_to) {

        var that = this
        var getUser = wx.getStorageSync('getUser') || [];
        var user_id = getUser.id
        var messagekey = contact_user_id_to * user_id
        var messageList = wx.getStorageSync('messageList' + messagekey) || [];
        console.log("messageList0", messageList)
        if (Array.isArray(messageList)) {
            if (messageList.length > that.data.pageSize) {
                messageList = messageList.slice(messageList.length - that.data.pageSize);
                console.log("messageList", messageList)

            }
        } else {
            console.log('获取消息记录错误');
        }
        that.setData({
            toView: 'msg-' + (messageList.length - 1),
            messageList: messageList,

        })

    },
    previewTechnician: function (e) {
        var index = e.currentTarget.dataset.index;
        var upload = []
        var messageList = this.data.messageList;
        var count = 0
        var technicianAssessPicture = [];

        var replacedString = app.globalData.artworkAvatar;
        for (var j = index; messageList[j]; j--) {
            if (messageList[j].type == 'pm') {
                count++

            }
        }
        for (var i = 0; i < messageList.length; i++) {
            if (messageList[i].type == 'img') {

                if (messageList[i].speaker == 'server') {
                    upload.push(app.globalData.httpUrl + messageList[i].content)
                } else {
                    upload.push(messageList[i].content)
                }
            }
        }
        if (app.globalData.ViewArtwork === 1) {
            if (Array.isArray(upload) && upload.length > 0) { // Check if url is a valid array
                for (var i = 0; i < upload.length; i++) {
                    technicianAssessPicture.push(upload[i].replace(/static\/compress_upload/, replacedString));
                }
            }
        } else {
            technicianAssessPicture = upload
        }
        var index1 = (index - count)
        wx.previewImage({
            //当前显示图片
            current: technicianAssessPicture[index1],
            //所有图片
            urls: technicianAssessPicture,
        })
    },
    onChoosePhoto: function (params) {
        var that = this;
        that.setData({
            showPlusPage: false,
            inputBottom: 0
        })
        wx.chooseMedia({
            count: that.data.imgcount, // 可选择的数量，这里设置为最多选择9张照片
            mediaType: ['image'], // 限定选择的媒体类型为照片
            success(res) {


                // 获取选择的照片列表
                const mediaList = res.tempFiles;
                // 判断是否有选择照片
                if (mediaList.length > 0) {
                    // 遍历选中的照片列表
                    mediaList.forEach((photo) => {
                        var uploadPromises = [];
                        models.compressAndReturnPath(photo.tempFilePath, that.data.quality, that.data.Width)
                            .then((compressPath) => {
                                console.log("compressAndReturnPath11", compressPath);
                                uploadPromises.push(models.uploadImage(compressPath, httpUrl));
                                Promise.all(uploadPromises).then((results) => {
                                        results.forEach((res) => {
                                            var data1 = JSON.parse(res.data);
                                            var images = data1.imgDir;
                                            that.sendImage(images, photo.tempFilePath)
                                        });
                                    })
                                    .catch((error) => {
                                        console.log("图片上传失败", error);
                                    });
                            })
                            .catch((error) => {
                                console.log("图片压缩失败", error);
                            });
                    });
                }
            }

        });
    },
    // 发送照片的逻辑示例
    sendImage: function (image, tempFilePath) {
        var that = this;

        var getUser = wx.getStorageSync('getUser') || [];
        var socketTask = app.globalData.socketTask;
        var user_to_Data = this.data.user_to_Data;
        var msg = {
            type: 'img',
            speaker: 'customer',
            user_id_to: user_to_Data.id.toString(), //接收者ID
            user_id: getUser.id.toString(),
            content: image,
            information_time: Math.round(new Date().getTime() / 1000).toString(),
        };

        // 在连接打开后发送消息
        socketTask.send({
            data: JSON.stringify(msg),
            success: function () {
                var messagekey = msg.user_id_to * msg.user_id

                var messageList = wx.getStorageSync('messageList' + messagekey) || [];
                if (Array.isArray(messageList)) {
                    msg.content = tempFilePath
                    messageList.push(msg);
                    wx.setStorageSync('messageList' + messagekey, messageList);
                    that.messageList(user_to_Data.id.toString());
                    that.getMessage(msg);
                } else {
                    console.log('messageList 数据错误', messageList);
                }
            }.bind(that),
            fail: function (res) {
                console.log('消息发送失败', res);
            }
        });


    },
    onPlus() {
        var that = this;
        var height = that.data.windowheight
        var showPlusPage = that.data.showPlusPage
        var myViewHeight = 0
        // 获取节点的高度
        wx.createSelectorQuery().select('#myView').boundingClientRect(function (rect) {
            // rect 是该节点的信息，包括宽度、高度等
            myViewHeight = rect.height
        }).exec();
        if (!showPlusPage) {
            showPlusPage = true

            that.setData({
                inputBottom: height + 'px',
                scrollHeight: (windowHeight1 - (height + myViewHeight)) + 'px',
                toView: 'msg-' + (that.data.messageList.length - 1),
            })
        } else {
            showPlusPage = false
            that.setData({
                scrollHeight: '90vh',
                inputBottom: 0
            })
        }
        this.setData({
            showPlusPage: showPlusPage,
            setFocus: false,
            scrollTop: 9999999999999, // 设置一个足够大的值，保证滚动到底部

        });
    },
    // 发送消息
    sendMessage: function () {
        this.setData({
            setFocus: true,
        })
        var that = this;
        var getUser = wx.getStorageSync('getUser') || [];
        var socketTask = app.globalData.socketTask;
        var inputMessage = this.data.inputMessage;
        var user_to_Data = this.data.user_to_Data;

        if (inputMessage && inputMessage.trim() !== "") {
            var msg = {
                type: 'pm',
                speaker: 'customer',
                user_id_to: user_to_Data.id.toString(), //接收者ID
                user_id: getUser.id.toString(),
                content: inputMessage,
                information_time: Math.round(new Date().getTime() / 1000).toString(),
            };
            // 在连接打开后发送消息
            socketTask.send({
                data: JSON.stringify(msg),
                success: function () {
                    var messagekey = msg.user_id_to * msg.user_id
                    var messageList = wx.getStorageSync('messageList' + messagekey) || [];
                    if (Array.isArray(messageList)) {
                        messageList.push(msg);
                        wx.setStorageSync('messageList' + messagekey, messageList);
                        that.messageList(user_to_Data.id.toString());
                        that.getMessage(msg);
                        console.log('消息发成功', msg);
                    } else {
                        console.log('messageList 数据错误', messageList);
                    }
                    that.setData({
                        inputMessage: '',
                    });
                }.bind(that),
                fail: function (res) {
                    console.log('消息发送失败', res);
                }
            });
            // });

        } else {
            //弹出提示框
            wx.showToast({
                title: '消息不能为空哦~',
                icon: 'none',
                duration: 2000
            });
        }
    },
    getMessage: function (Message) {
        if (Array.isArray([Message])) {
            var getMessage = wx.getStorageSync('getMessage_information') || []; // Initialize as an empty array if not defined
            if (Array.isArray(getMessage)) {
                var foundMatchingUser = true;
                for (var i = 0; i < getMessage.length; i++) {
                    if (Message.user_id === getMessage[i].user_id && Message.user_id_to === getMessage[i].user_id_to || Message.user_id === getMessage[i].user_id_to && Message.user_id_to === getMessage[i].user_id) {
                        getMessage[i] = Message;
                        foundMatchingUser = false;
                        break;
                    }
                }
                if (foundMatchingUser) {
                    // Add the friend's message record to the message list
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

    onReceiveMessage: function () {
        // 更新页面数据，例如：
        var contact_user_id_to = this.data.contact_user_id_to
        this.messageList(contact_user_id_to)
    },
    bindInputMessage: function (e) {
        this.setData({
            inputMessage: e.detail.value
        })
    },
    detailed: async function (e) {
        var that = this
        var getUser = wx.getStorageSync('getUser') || [];
        var user_to_Data = []
        var contact_user_id_to = ''
        const eventChannel = this.getOpenerEventChannel();
        eventChannel.on('acceptDataFromOpenerPage', (data) => {
            contact_user_id_to = data.data[0].toString()
        })
        that.messageList(contact_user_id_to);
        var storedData = wx.getStorageSync('user_to') || [];
        if (storedData.length > 0) {
            for (var i = 0; storedData.length; i++) {
                if (storedData[i].id.toString() === contact_user_id_to) {
                    user_to_Data = storedData[i];
                    break;
                }
            }
        } else {
            try {
                user_to_Data = await util.getUserTo(contact_user_id_to);
            } catch (err) {
                console.error(err);
                // Handle the error here
            }
        }
        this.setData({
            user_name: user_to_Data.user_name,
            user_to_Data: user_to_Data,
            user_img: getUser.avatar_url,
            contact_user_id_to: contact_user_id_to,
        })

    },
    /**
     * 获取聚焦
     */
    focus: function (e) {
        var that = this;
        keyHeight = e.detail.height;
        this.setData({
            setFocus: true,
            scrollHeight: (windowHeight1 - keyHeight) + 'px',
            showPlusPage: false,

        });
        this.setData({
            toView: 'msg-' + (that.data.messageList.length - 1),
            inputBottom: keyHeight + 'px',
            showPlusPage: false,
            scrollTop: 99999, // 设置一个足够大的值，保证滚动到底部

        })
        //计算msg高度
        calScrollHeight(this, keyHeight);

    },

    //失去聚焦(软键盘消失)
    blur: function (e) {
        var that = this;
        if (that.data.showPlusPage) {
            that.setData({
                scrollHeight: '65vh',
            })
        } else {
            that.setData({
                inputBottom: 0,

                scrollHeight: '90vh',
            })
        }
        that.setData({
            setFocus: false,
            scrollTop: 99999, // 设置一个足够大的值，保证滚动到底部
            toView: 'msg-' + (that.data.messageList.length - 1),


        })



    },
    /**
     * 退回上一页
     */
    toBackClick: function () {
        wx.navigateBack({})
    },
    /**
     * 生命周期函数--监听页面加载
     */
    onLoad(options) {
        var that = this

        console.log("that.data.messageList.length", that.data.messageList.length)
        // 监听自定义事件，接收来自app.js的消息通知
        wx.$eventBus.on('receiveMessage', this.onReceiveMessage, this);
        // wx.$eventBus.on('receiveMessagerrrr', this.getMessage, this);

    },
    /**
     * 生命周期函数--监听页面初次渲染完成
     */
    onReady() {
        var that = this
        this.detailed()
        // let shopname=wx.getStorageSync('shopName')
        wx.setNavigationBarTitle({
            title: that.data.user_name //页面切换，更换页面标题
        })

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
        var that = this
        const getMessage = wx.getStorageSync('getMessage_information') || [];
        const msgNotification = wx.getStorageSync('msgNotification') || [];
        for (let i = 0; i < getMessage.length; i++) {
            if (parseInt(getMessage[i].user_id) === parseInt(that.data.contact_user_id_to)) {
                getMessage[i].unreadCount = 0;
                break;
            }
        }
        for (let j = 0; j < msgNotification.length; j++) {
            if (parseInt(msgNotification[j].user_id_to) === parseInt(that.data.contact_user_id_to)) {
                msgNotification[j].unreadCount = 0;
                break;
            }
        }

        wx.setStorageSync('getMessage_information', getMessage);
        wx.setStorageSync('msgNotification', msgNotification);
        this.setData({
            user_to_Data: '',
            contact_user_id_to: '',
            toView: "",
            inputBottom: 0,
            inputMessage: '',
            user_img: '',
            user_name: "",
            messageList: [],
        })
    },

    /**
     * 页面相关事件处理函数--监听用户下拉动作
     */
    onPullDownRefresh() {

    },
    /**
     * 页面上拉触底事件的处理函数
     */
    onReachBottom() {},
    /**
     * 用户点击右上角分享
     */
    onShareAppMessage() {

    },
})