import {request} from "../../request/index.js";

Page({

  /**
   * 页面的初始数据
   */
  data: {
    baseUrl:"",
    token:""
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    wx.getStorage({key:"token"}).then(res=>{
      console.log(res)
      this.setData({
        token:res.data
      })
    })
    wx.getStorage({key:"baseUrl"}).then(res=>{
      console.log(res)
      this.setData({
        baseUrl:res.data
      })
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  // 上传图片
  uploadIMG:function(){
    wx.chooseImage({
      
     success: (res)=> {
      console.log("文件",res)
      const tempFilePaths = res.tempFilePaths[0]
      console.log("文件路径",tempFilePaths);
      console.log("链接",this.data.baseUrl)


      wx.uploadFile({
        url: `${this.data.baseUrl}/admin/canteen/1/upload`, //开发者服务器的 url
        filePath: tempFilePaths, // 要上传文件资源的路径 String类型！！！
        name: 'photo', // 文件对应的 key ,(后台接口规定的关于图片的请求参数)
        header: {
          "AUTHORIZATION":"Bearer "+this.data.token,
          "Content-Type": "application/x-www-form-urlencoded",
        }, // 设置请求的 header
        success:  (res)=> {
          console.log(res)
        },
        fail:  (err) =>{
          wx.showToast({
            title: 'error',
            icon: 'error',
            duration: 2000
          })
        }
      })

    }
  })
  },

  // 跳转到餐厅的管理
  gotocantenAdmin(){
    wx.navigateTo({
      url: './canteenAdmin/canteenAdmin'
    })
  },

// 跳转到用户管理
  gotoUserAdmin(){
    wx.navigateTo({
      url: './userAdmin/userAdmin'
    })
  },

  // 跳转到分类管理
  gotoCategory(){
    wx.navigateTo({
      url: './category/category',
    })
  },

    // 跳转到订单管理
    gotoOrder(){
      wx.navigateTo({
        url: './adminOrder/adminOrder',
      })
    },


  
})