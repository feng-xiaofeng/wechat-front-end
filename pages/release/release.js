// pages/release/release.js
var app = getApp();

const httpUrl = app.globalData.httpUrl;
import models from '../models.js'

Page({
    /**
     * 页面的初始数据
     */
    data: {
        select: false,
        getType: [],
        tihouWay: '其他',
        upload: [],
        imageCount: true,
        imgcount: 9,
        checked: 1,
        typeId: '',
        goods_name: '',
        goods_price: '',
        goods_state: '',
        screenHeight: '',

        Width: 700, //压缩图片的宽度
        quality: 30, //压缩图片的质量
    },

    // 下拉框
    bindShowMsg() {
        this.setData({
            select: !this.data.select
        })
    },
    // 下拉框展示的内容
    mySelectName(e) {
        var name = e.currentTarget.dataset.name;
        var type_id = e.currentTarget.dataset.id;
        this.setData({
            tihouWay: name,
            typeId: type_id,
            select: false
        })
    },

    //   图片显示
    previewTechnician: function (e) {
        //获取当前图片的下标
        var index = e.currentTarget.dataset.index;
        //所有图片  
        var technicianAssessPicture = this.data.upload;
        wx.previewImage({
            //当前显示图片
            current: technicianAssessPicture[index],
            //所有图片
            urls: technicianAssessPicture
        })
    },
    //   删除
    deleteTechnician: function (e) {
        var that = this;
        var technicianAssessPicture = that.data.upload;
        var index = e.currentTarget.dataset.index; //   获取当前长按图片下标

        wx.showModal({
            // cancelColor: 'cancelColor',
            title: '提示',
            content: '确定要删除此图片吗？',
            success: function (res) {
                if (res.confirm) {
                    console.log('确定');
                    technicianAssessPicture.splice(index, 1);
                } else if (res.cancel) {
                    console.log('取消');
                    return false;
                }
                that.setData({
                    upload: technicianAssessPicture,
                })
            }
        })
    },
    //   是否上架
    checkboxTap: function (e) {
        var count = this.data.checked;
        if (count === 0) {
            this.setData({
                checked: 1,
            })
        } else {
            this.setData({
                checked: 0
            })
        }
        console.log(count)
    },
    // 商品名称
    goodsName: function (e) {
        var that = this;
        this.setData({
            goods_name: e.detail.value
        })
        console.log(e.detail.value)

    },
    // 价 格
    goodaPrice: function (e) {
        // console.log(e.detail.value)
        this.setData({
            goods_price: e.detail.value
        })
    },
    // 详细说明
    goodsState: function (e) {
        // console.log(e.detail.value)
        this.setData({
            goods_state: e.detail.value
        })
    },
    // 取消
    previewbutton: function (e) {
        // console.log(e)
        this.setData({
            select: false,
            tihouWay: '其他',
            upload: [],
            imageCount: true,
            checked: 1,
            goods_name: '',
            goods_price: '',
            goods_state: '',
            typeId: ''
        })

    },
    upload: function (e) {
        var that = this;
        var imgCount = this.data.upload; // 文件上传数量
        var MAX_IMAGE_SIZE = 8 * 1024 * 1024; // 设置最大图片大小为8MB

        if (imgCount.length >= that.data.imgcount) {
            that.setData({
                imageCount: false,
            })
            wx.showModal({
                title: '提示',
                content: `最多只能上传 ${that.data.imgcount}张照片哦!`,
                success: function (res) {
                    if (res.confirm) {
                        console.log('确定');
                    } else if (res.cancel) {
                        console.log('取消');
                    }
                }
            })
            return;
        }

        wx.chooseMedia({
            count: that.data.imgcount - imgCount.length, // 可选媒体数量
            mediaType: ['image', 'video'], // 支持选择图片和视频
            sourceType: ['album', 'camera'], // 可从相册和摄像头选择
            maxDuration: 10, // 视频最大时长（秒）
            success: (result) => {
                let selectedFileType = '';

                result.tempFiles.forEach(file => {
                    console.log("111file", file)

                    if (file.fileType === 'image') {
                        selectedFileType = 'image';
                        if (file.size > MAX_IMAGE_SIZE) {
                            wx.showToast({
                                title: '图片过大',
                                icon: 'none'
                            });
                        } else {


                            that.setData({
                                upload: that.data.upload.concat(file.tempFilePath)
                            });
                        }
                    } else if (file.fileType === 'video') {
                        selectedFileType = 'video';
                        if (file.size > MAX_IMAGE_SIZE) {
                            wx.showToast({
                                title: '视频过大',
                                icon: 'none'
                            });
                        } else {

                            that.setData({
                                upload: that.data.upload.concat(file.tempFilePath)
                            });
                        }
                    }
                });

                if (selectedFileType === 'image' && that.data.upload.some(path => path.includes('.mp4'))) {
                    const filteredUpload = that.data.upload.filter(path => !path.includes('.mp4'));
                    that.setData({
                        upload: filteredUpload
                    });
                    wx.showToast({
                        title: '不能同时上传照片和视频',
                        icon: 'none'
                    });
                } else if (selectedFileType === 'video' && that.data.upload.some(path => path.includes('.jpg') || path.includes('.png'))) {
                    const filteredUpload = that.data.upload.filter(path => !path.includes('.jpg') && !path.includes('.png'));
                    that.setData({
                        upload: filteredUpload
                    });
                    wx.showToast({
                        title: '不能同时上传照片和视频',
                        icon: 'none'
                    });
                }
            },
        });
    },


    // 发布和保存
    buttonRelease: async function (e) {
        var that = this;
        var getUser = wx.getStorageSync('getUser') || [];
        app.globalData.refresh = 1;
        var type_id = this.data.typeId;
        var goods_name = this.data.goods_name;
        var goods_price = this.data.goods_price;
        var goods_state = this.data.goods_state;
        var checked = this.data.checked;
        
        if (checked == 0) {
          checked = 2;
        }
        
        if (type_id == '') {
          type_id = e.target.dataset.id;
        }
        
        if (goods_name.trim().length === 0) {
          wx.showModal({
            title: '提示',
            content: '商品名称不能为空！',
            success: function (res) {
              if (res.confirm) {
                console.log('确定');
              } else if (res.cancel) {
                console.log('取消');
                return false;
              }
            }
          });
          return;
        }
      
        if (goods_price.trim().length === 0) {
          wx.showModal({
            title: '提示',
            content: '商品价格不能为空！',
            success: function (res) {
              if (res.confirm) {
                console.log('确定');
              } else if (res.cancel) {
                console.log('取消');
                return false;
              }
            }
          });
          return;
        }
      
        var tempFilePath = this.data.upload;
        var images_list = [];
        var uploadPromises = [];
      
        // Upload images to the server
        for (var i = 0; i < tempFilePath.length; i++) {
          try {
            var compressPath = await models.compressAndReturnPath(tempFilePath[i], that.data.quality, that.data.Width);
            console.log("compressAndReturnPath11", compressPath);
            uploadPromises.push(models.uploadImage(compressPath, httpUrl));
          } catch (error) {
            console.log("图片压缩失败", error);
          }
        }
        // 使用await关键字可以使异步代码看起来像同步代码，提供了更好的可读性和易用性
        try {
          var results = await Promise.all(uploadPromises);
          results.forEach((res) => {
            var data1 = JSON.parse(res.data);
            var images = data1.imgDir;
            console.log("images", images)
            images_list.push(images);
          });
      
          console.log("images_list", images_list)
      
          if (getUser.id != '' && getUser.id.length != 0 && getUser.school_id != '' && getUser.school_id.length != 0) {
            try {
              var result = await wx.request({
                url: httpUrl + 'api/release/doAdd',
                data: {
                  type_id: type_id,
                  goods_name: goods_name,
                  goods_price: goods_price,
                  goods_state: goods_state,
                  chec_ked: checked,
                  images_list: images_list,
                  user_id: getUser.id,
                  school_id: getUser.school_id,
                },
                header: {
                  "Content-Type": "application/x-www-form-urlencoded;charset=utf-8"
                },
                dataType: 'json',
                method: 'POST',
                responseType: 'arraybuffer',
                timeout: 0,
              });
      
              console.log("成功", result.data);
              wx.showToast({
                title: '上传成功',
                icon: 'none',
                duration: 2000
              });
      
              setTimeout(() => {
                that.previewbutton();
              }, 2000);
            } catch (error) {
              console.log("失败", error);
            }
          } else {
            wx.showModal({
              title: '立即前往',
              content: '需要完成基本信息',
              success(res) {
                if (res.confirm) {
                  console.log('用户点击确定');
                  wx.navigateTo({
                    url: '/pages/persInfo/persInfo',
                    success: function (res) {
                      console.log(res);
                    }
                  });
                } else if (res.cancel) {
                  console.log('用户点击取消');
                }
              }
            });
          }
        } catch (error) {
          console.log("图片上传失败", error);
        }
      },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad() {

    },

    /**
     * 生命周期函数--监听页面初次渲染完成
     */
    onReady() {
        var screenHeight = wx.getStorageSync('screenHeight') || [];
        this.setData({
            screenHeight: screenHeight
        })
        var getType = wx.getStorageSync('goodstype') || [];
        this.setData({
            getType: getType
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