// pages/admin/canteenAdmin/canteenAdmin.js
import {request , upload} from '../../../request/index'

Page({

  /**
   * 页面的初始数据
   */
  data: {
    imgBaseUrl:"",
    token:"",
    canteenList:[],
    categories:[]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    wx.getStorage({key:"token"}).then(res=>{
      this.setData({
        token:res.data
      })
    })
    wx.getStorage({key:"imgBaseUrl"}).then(res=>{
      this.setData({
        imgBaseUrl:res.data
      })
    })

  },
  onShow(){
    this.getCanteenList()
  },


  getCanteenList(){
      // 获取餐厅列表
      request({
        methods:'get',
        url:'/admin/canteens'
      }).then((res,err)=>{
        if(err){
         return wx.showToast({
            title: 'error',
            icon: 'error',
            duration: 2000
          })
        }

        console.log('餐厅列表',res.data)
        let ans = res.data
        let { imgBaseUrl } = this.data
        ans.forEach((r,i)=>{
          // 图片图片路径处理
          r.photo = imgBaseUrl + r.photo
        })
        this.setData({
          canteenList:ans
        })
      })
  },
  // 上传图片
  async uploadImg(e){
    // 餐厅id
    const id = e.currentTarget.dataset.index
    upload(`/admin/canteen/${id}/upload`,'photo')
    .then((res,err)=>{
      if(res){
        //  更惨餐厅信息
        this.getCanteenList()
      }
    })

  },

  // 前往添加餐厅
  gotoAdd(){
    wx.navigateTo({
      url: '../addCanteen/addCanteen',
    })
  },


  // 删除餐厅
  delCanteen(e){
    const id = e.currentTarget.dataset.index
    request({
      url:`/admin/canteen/${id}`,
      method:'DELETE'
    }).then((res,err)=>{
      if(err) return wx.showToast({
        title: '删除失败',
      })
      else{
        wx.showToast({
          title: '删除成功',
          duration:1000
        })
        // 更新餐厅信息
        this.getCanteenList()
      }
    })
  },

// 修改餐厅信息
  changeCanteen(e){
    const id = e.currentTarget.dataset.index
    wx.navigateTo({
      url: `../changeCanteen/changeCanteen?id=${id}`,
    })
  }
  



})