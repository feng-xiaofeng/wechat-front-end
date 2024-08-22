// pages/release/release.js
var app = getApp();
const httpUrl = app.globalData.httpUrl;
Page({
    /**
     * 页面的初始数据
     */
    data: {
        select:false,
        getType:[],
        tihouWay:'其他',
        upload:[],
        imageCount:true,
        imgcount :0,
        checked: 1,
        typeId:'',
        goods_name:'',
        goods_price:'',
        goods_state:'',
        goods_id:'',
        state:'',
        getImage:[],
        httpUrl:httpUrl
        
    },
    // 下拉框
    bindShowMsg(){
        this.setData({
            select:!this.data.select
        })
    },
    // 下拉框展示的内容
    mySelectName(e){
        var name =e.currentTarget.dataset.name;
        var type_id =e.currentTarget.dataset.id;
       console.log("type_id",type_id)
        this.setData({
            tihouWay:name,
            typeId:type_id,
            select:false
        })
    },
    // 图片上传
    upload:function(e){
        var that = this;
        var imgCount = this.data.upload;
        var const1 = this.data.imgcount;
        var state = e.target.dataset.state
        wx.showModal({
            // cancelColor: 'cancelColor',
            title: '提示',
            content: '修改图片将会清空原来的图片',
            success: function (res) {
              if (res.confirm) {
                console.log('确定');
                that.setData({
                    state:state
                })
                if (imgCount.length >= 6 && const1 != 6) {
                    that.setData({                
                        imageCount:false,               
                    })
                    wx.showModal({
                        // cancelColor: 'cancelColor',
                        title: '提示',
                        content: '最多只能上传6张照片哦',
                        success: function (res) {
                          if (res.confirm) {
                            console.log('确定');
                          } else if (res.cancel) {
                            console.log('取消');
                            return false;
                          }
                        }
                      })
                    
                    return
                }
                wx.chooseMedia({
                    camera: 'back',
                    count: 6,
                    maxDuration: 10,
                   
                    mediaType: ['image','mix'],
                    sourceType: ['album','camera'],
                    success: (result) => {
                        console.log(result.tempFiles[0])
                        that.setData({
                          upload:that.data.upload.concat(result.tempFiles[0].tempFilePath)
                        })
                    },
                  })
              } else if (res.cancel) {
                console.log('取消');
                return false;
              }
            }
        })
    },
    
    //   图片显示
      previewTechnician:function(e){
         //获取当前图片的下标
         var index = e.currentTarget.dataset.index;
         console.log(index)
        //所有图片  
        var technicianAssessPicture = this.data.upload;
        console.log(technicianAssessPicture)
        wx.previewImage({
            //当前显示图片
            current: technicianAssessPicture[index],
            //所有图片
            urls: technicianAssessPicture
          })
      },
      previewT:function(e){
        var src = e.currentTarget.dataset.src;
        // src = Array.from(src)
        console.log("e.currentTarget.dataset.url",e.currentTarget.dataset.src)
        wx.previewImage({
            current:src,
        })
     },
    //   查看图片，和删除
      deleteTechnician:function(e){
        var that = this;
        var technicianAssessPicture = that.data.upload;
        var index = e.currentTarget.dataset.index;    //   获取当前长按图片下标
        var count = 0
        
        wx.showModal({
          // cancelColor: 'cancelColor',
          title: '提示',
          content: '确定要删除此图片吗？',
          success: function (res) {
            if (res.confirm) {
              console.log('确定');
              technicianAssessPicture.splice(index, 1);
              count = technicianAssessPicture.length - 1;
            } else if (res.cancel) {
              console.log('取消');
              return false;
            }
            that.setData({
                upload:technicianAssessPicture,
                imgcount:count,
            })
          }
        })
      },
    //   是否上架
    checkboxTap:function(e){
        var count = this.data.checked;
        if (count === 0){
            this.setData({
                checked:1,           
            })
        }else{
            this.setData({
                checked:0
            })  
        }
        console.log(count) 
    },
    // 商品名称
    goodsName:function(e){
        this.setData({
            goods_name:e.detail.value
        })
        console.log(e.detail.value)
        
    },
    // 价 格
    goodaPrice:function(e){
        // console.log(e.detail.value)
        this.setData({
            goods_price:e.detail.value
        })
    },
    // 详细说明
    goodsState:function(e){
        // console.log(e.detail.value)
        this.setData({
            goods_state:e.detail.value
        })
    },
    // 取消
    previewbutton:function(e){
        setTimeout(()=>
        {
            wx.navigateBack({
            });
        }, 1000)
        
    },
    // 修改和保存
    buttonRelease:function(e){
        app.globalData.refresh = 1
        var that = this
        var type_id = this.data.typeId;
        if (type_id == ''){
            type_id = e.target.dataset.id
        }
        var goods_name = this.data.goods_name;
        var goods_price = this.data.goods_price;
        var goods_state = this.data.goods_state;
        var checked = this.data.checked;
        var goods_id = this.data.goods_id
        var state = this.data.state
        if (checked == 0) {
            checked = 2
        }
        if(goods_name.length < 1) {
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
            })
            return
        }
        if(goods_price.length < 1) {
            wx.showModal({
                // cancelColor: 'cancelColor',
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
            })
            return
        }
        var tempFilePath = this.data.upload
        var images_list = []; //设置了一个空数组进行储存服务器端图片路径
        for (var i = 0; i < tempFilePath.length; i++) {
            wx.uploadFile({
                filePath: tempFilePath[i],
                name: 'file',
                url: httpUrl+'api/release/uploadImage',
                header: {
                    "content-type": "multipart/form-data"
                },
                formData: tempFilePath,
                success: function(res){
                    // json转换数组
                var data1 = JSON.parse(res.data);              
                images_list.push(data1.imgDir);//把每次返回的地址放入数组                                                       
                },
            })
        }
        if (goods_id != '' && goods_id.length != 0){
            setTimeout(()=>
            {
                wx.request({
                url: httpUrl+'api/purchase/doEditModification',
                data: {
                    type_id:type_id,
                    goods_name:goods_name,
                    goods_price:goods_price,
                    goods_state:goods_state,
                    checked:checked,
                    images_list:images_list,
                    goods_id:goods_id,
                    state:state,
                },
                header: { "Content-Type": "application/x-www-form-urlencoded;charset=utf-8" },
                dataType: 'json',        
                method: 'POST',
                success: (res) => {
                    var getUserGoods = wx.getStorageSync('getUserGoods') ||[];
                    var getGoods = res.data.getGoods
                    console.log("________________成功",res.data.getGoods)
                    for(var i = 0; i < getUserGoods.length; i++){
                        if (getUserGoods[i].Id == getGoods.Id) {
                            getUserGoods[i] = getGoods
                        }
                    }
                    wx.setStorageSync('getUserGoods', getUserGoods)
                    wx.showToast({
                        title: '修改成功',
                        icon:'none',
                        duration:2000
                    })
                },
                fail: (err) => {
                    console.log("失败",err)
                },
                complete: (res) => {},
                })
            }, 1000) 
        // 延迟执行
            setTimeout(()=>
            {
                that.previewbutton()
            }, 2000)
        }else{
            wx.showToast({
                title: '请到我的完成个人基本信息！',
                icon:'none',
                duration:2000
            })
            return  
        }
    },
    goodsType:function(e){
        var getType = wx.getStorageSync('goodstype')
        this.setData({
            getType:getType
        })
    },
    getModification:function(e){
        var that = this
        const eventChannel = this.getOpenerEventChannel();
        eventChannel.on('acceptDataFromOpenerPage',(data)=> {
            var user_id = data.data[0]
            var goods_id = data.data[1]
            wx.request({
                url: httpUrl+'api/purchase/modification',       
                method: "GET",   
                data: {
                    goods_id:goods_id,
                  },
                  header: { "Content-Type": "application/x-www-form-urlencoded;charset=utf-8" },
                  dataType: 'json',        
                  success: (res) => {
                    console.log(res.data.userGoods)
                    var userGoods = res.data.userGoods
                    var goodsImage = res.data.goodsImage
                    console.log("goodsImage",goodsImage)
                    that.setData({
                        goods_name:userGoods.Title,
                        goods_price:userGoods.Price,
                        goods_state:userGoods.GoodsDetails,
                        user_id:userGoods.Title,
                        goods_id:userGoods.Id,
                        getImage:goodsImage,
                    })
                  },
                  fail: (err) => {
                    console.log("失败",err)
                  },
                  complete: (res) => {},
                })
              })  
    },
    /**
     * 生命周期函数--监听页面加载
     */
    onLoad() {
        
        this.getModification();
    },
    
    /**
     * 生命周期函数--监听页面初次渲染完成
     */
    onReady() {
      this.goodsType();
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
        this.setData({
            getType:''
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
    onReachBottom() {

    },

    /**
     * 用户点击右上角分享
     */
    onShareAppMessage() {

    }
})