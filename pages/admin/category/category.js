// pages/admin/category/category.js

import {request} from '../../../request/index'
Page({

  /**
   * 页面的初始数据
   */
  data: {
    list:[],
    show:false,
    id:'',
    category:{
      canteen_id:'',
      name:'',
      status:1,
      top:1,
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

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: async function () {
    await this.get()
    if(this.data.list.length===0) wx.showToast({
      title: '网络出错',
    })
  },
// 获取分类列表
async get(){
  const res = await  request({
    url:'/admin/categories'
  })
  this.setData({
    list:res.data
  })
},

// 删除分类
async del(e){
  // console.log(e)
  const id = e.currentTarget.dataset.id
  request({
    url:`/admin/category/${id}`,
    method:'DELETE'
  }).then((ans,err)=>{
    if(err){
      return wx.showToast({
        title: '删除失败',
      })
    }
    wx.showToast({
      title: '删除成功',
      duration:1000
    })
    this.get()
  })
},
// 修改分类信息
async change(e){
  console.log(e)
  const {id,canteen_id,name,top, english_name} = e.currentTarget.dataset.item
  console.log(canteen_id,name,top)
  await this.setData({
    id,
    category:{
      canteen_id,
      name,
      top,
      english_name
    }

  })
  this.changeShow()
},
// 更改弹框的显示模式
changeShow(){
  this.setData({show: !this.data.show})
},


// 提交修改
async submit(event){
  const _this = this
  const {id} = this.data
  const values = event.detail.values;
  console.log('参数',values)
  let res = await request({
    url:`/admin/category/${id}`,
    method:'POST',
    data:{
      ...values
    }
  })
  console.log('分类管理',res)
  if(res.statusCode===200){
    await wx.showToast({
      title: '修改请求成功',
      duration:1000
    })
    setTimeout(()=>{
      _this.get()
      _this.changeShow()
    },1000)
    
  }
  else{
    wx.showModal({
      content:res.data.errors.password[0]
    })
  }
},

// 添加分类
add(){
  wx.navigateTo({
    url: '../addCategory/addCategory',
  })
},

// 跳转商品管理
  gotoProduct(e){
    console.log(e)
    const {id,canteen_id} = e.currentTarget.dataset
    wx.navigateTo({
      url: `../product/product?canteen_id=${canteen_id}&&category_id=${id}`,
    })
  } 



})