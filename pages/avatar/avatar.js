var app = getApp();
const httpUrl = app.globalData.httpUrl;
import WeCropper from '../we-cropper/dist/we-cropper.js'

const device = wx.getSystemInfoSync() // 获取设备信息
const width = device.windowWidth // 示例为一个与屏幕等宽的正方形裁剪框
const devicePixelRatio = device.pixelRatio
const height = device.windowHeight - 70
const fs = width / 750 * 2

Page({

    /**
     * 页面的初始数据
     */
    data: {
        cropperOpt: {
            id: 'cropper',
            width: width, // 画布宽度
            height: height, // 画布高度
            scale: 2.5, // 最大缩放倍数
            zoom: 8, // 缩放系数
            cut: {
                x: (width - 350) / 2, // 裁剪框x轴起点(width * fs * 0.128) / 2
                y: (height * 0.5 - 250 * 0.5), // 裁剪框y轴期起点
                width: 350, // 裁剪框宽度
                height: 350 // 裁剪框高度
            }
        },
    },

    touchStart(e) {
        this.cropper.touchStart(e)
    },
    touchMove(e) {
        this.cropper.touchMove(e)
    },
    touchEnd(e) {
        this.cropper.touchEnd(e)
    },

    uploadTap() {

        const self = this
        wx.chooseMedia({
            count: 1,
            mediaType: ['image'],
            success: function (res) {
                const tempFilePaths = res.tempFiles[0].tempFilePath;

                self.wecropper.pushOrign(tempFilePaths);
            }
        });
    },
    uploadImage:function(filePath, httpUrl) {
        return new Promise((resolve, reject) => {
          wx.uploadFile({
            filePath: filePath,
            name: 'file',
            url: httpUrl + 'api/release/avatarUploadImage',
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
    getCropperImage() {
        let that = this;
        var getUser = wx.getStorageSync('getUser') || [];
        wx.showToast({
            title: '上传中',
            icon: 'loading',
            duration: 20000
        })
        // 如果有需要两层画布处理模糊，实际画的是放大的那个画布
        this.wecropper.getCropperImage((src) => {
            if (src) {
                console.log("src", src)
                that.uploadImage(src, httpUrl)
                    .then((res) => {
                        var data1 = JSON.parse(res.data);
                        var images = data1.imgDir;
                        wx.request({
                            url: httpUrl + 'api/users/doEdit',
                            data: {
                                avatar_url: images,
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
                                setTimeout(() => {
                                    wx.navigateBack({});
                                }, 2000);
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


            } else {
                console.log('获取图片地址失败，请稍后重试')
            }
        })
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        const {
            cropperOpt
        } = this.data

        this.cropper = new WeCropper(cropperOpt)
            .on('ready', (ctx) => {
                console.log(`wecropper is ready for work!`)
            })
            .on('beforeImageLoad', (ctx) => {
                wx.showToast({
                    title: '上传中',
                    icon: 'loading',
                    duration: 20000
                })
            })
            .on('imageLoad', (ctx) => {
                wx.hideToast()
            })

        //刷新画面
        this.wecropper.updateCanvas()

    }

})