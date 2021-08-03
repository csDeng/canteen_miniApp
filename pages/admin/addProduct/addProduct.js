// pages/admin/category/category.js

import {request} from '../../../request/index'
Page({

  /**
   * 页面的初始数据
   */
  data: {
    category:{
      price:'',
      name:'',
      status:1,
      english_name:'',
      description:''
    }
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
     // 初始化表单
     const { canteen_id, category_id } = options
     this.setData({
       canteen_id,
       category_id
     })
     wx.lin.initValidateForm(this)
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

// 提交修改
async submit(event){
  const {canteen_id, category_id} = this.data
  const values = event.detail.values;
  // console.log('参数',values)
  let res = await request({
    url:`/admin/product`,
    method:'POST',
    data:{
      ...values,
      canteen_id,
      category_id
    }
  })
  if(res.statusCode===200){
    wx.showToast({
      title: '修改请求成功',
      duration:1000
    })
  }
  else{
    wx.showToast({
      title: '添加失败',
    })
  }
},
})