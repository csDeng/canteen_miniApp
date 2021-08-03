// pages/admin/category/category.js

import {request} from '../../../request/index'
Page({

  /**
   * 页面的初始数据
   */
  data: {
    category:{
      canteen_id:'',
      name:'',
      status:1,
      english_name:''
    }
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
     // 初始化表单
     wx.lin.initValidateForm(this)
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

// 提交修改
async submit(event){
  const {id} = this.data
  const values = event.detail.values;
  // console.log('参数',values)
  let res = await request({
    url:`/admin/category`,
    method:'POST',
    data:{
      ...values
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