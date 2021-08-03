// 0 引用 用来发送请求的方法
import { request } from "../../request/index.js";

// pages/index/index.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    // 轮播图数组
    swiperList: [
      {
        image_src: "../../icons/test.png"
      },
      {
        image_src: "../../icons/test.png"
      },
      {
        image_src: "../../icons/test.png"
      }
    ],

    // 轮播图的设置
    indicatorDots: true,
    vertical: false,
    autoplay: true,
    interval: 2000,
    duration: 800,
    easingFunction: "easeInOutCubic",

    // 饭堂配置
    fantang: [],
    imgurl:''
  },




  onShow() {
    this.GetFGList()
    this.getImgUrl()
        // 分享
    wx.showShareMenu({
      withShareTicket: true,
      menus: ['shareAppMessage', 'shareTimeline']
    })
    
  },
  getImgUrl(){
    try {
      let res = wx.getStorageSync('imgBaseUrl')
      console.log(res)
      this.setData({
        imgurl:res
      })
    } catch (error) {
      // do nothing
    }
    
  },
  // 获取餐厅列表
  GetFGList() {
    let fantang = [];
    request({ url: "/canteens" })
      .then(res => {
        // console.log(res);
        if(res.statusCode === 401 ){
          wx.showModal({
           content:'登录信息到期，请重新登录',
           success(ret){
             if(ret.confirm){
               wx.navigateTo({
                 url: '/pages/login/login',
               })
             }
             else{
               // do mothing
             }
           }
          })
        }
        res.data.forEach((element, index) => {
          let obj = {
            name: element.name,
            id: element.id,
            url: `/pages/${index + 1}/${index + 1}`,
            english_name:element.english_name
          }
          fantang.push({
            obj
          })
          // 设置信息缓存，避免重复访问
          wx.setStorage({
            key: `${element.id}`,
            data: element
          })
        });
        // 设置首页的饭堂数据
        this.setData({
          fantang
        });
        //设置缓存 

      })
  },

  // 点击饭堂跳转
  goToCanteen(e) {
    // console.log(e)
    const id = e.currentTarget.dataset.id
    wx.navigateTo({
      url: `../canteen/canteen?id=${id}`,
    })
  }
})