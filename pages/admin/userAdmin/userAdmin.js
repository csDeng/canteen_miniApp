import {request} from '../../../request/index'


// pages/admin/userAdmin/userAdmin.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
        userList:[],
        show:false,          
        Rule:{
            required:true
          },
        user: {
          name: '',
          stu_id: '',
          status: 1,
          power:0,
          password:"",
        },

        pages:{}
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
    this.get()
  },

// 自定义方法
addUser(){
  wx.navigateTo({
    url: '../addUser/addUser',
  })
},

// 获取用户列表
async get(page=1){
  try {
    let res= await request({
      url:'/admin/users?page='+page
    })
    // console.log(res.data)
    const { current_page, total, per_page } = res.data
    let pages = {}
    pages['total_pages'] = total/per_page
    pages['current_page'] = current_page
    if(res.statusCode === 200 ||  res.statusCode ===304){
      this.setData({
        userList:res.data.data,
        pages
      })
    }
    else wx.showToast({
      title:'获取列表失败'
    })
  } catch(e) {
    wx.showToast({
      title:'获取列表失败'
    })
  }
  
},

// 获取分页数据
getpage(e){
  const {pages} = this.data
  const id = e.currentTarget.dataset.id
  // console.log(pages,id)
  let page = pages.current_page 
  if(id == '+1'){
    page += 1
  }
  else{
    page -=1
  }
  // console.log(page)
  this.get(page)
},

// 修改用户信息
async changeUser(e){
  // 获取学号查询
  const stu_id = e.currentTarget.dataset.id

  let res = await request({
    url:`/admin/users?stu_id=${stu_id}`,
    method:'GET'
  })
  // console.log(res)
  // 初始化数据
  await  this.setData({
    user:{
      ...res.data.data[0]
    }
  })

  // 弹框
  this.changeShow()
},

// 提交修改用户的表单
async submit(event){
  const {id} = this.data.user
  // console.log(event)
  const values = event.detail.values;
  // console.log('参数',values)
  let res = await request({
    url:`/admin/user/${id}`,
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
    this.changeShow()
  }
  else{
    wx.showModal({
      content:res.data.errors.password[0]
    })
  }
  this.get()
},

// 软删除
delUser(e){
  const {id} = e.currentTarget.dataset
  const _this = this
  wx.showModal({
    title:'提示',
    content:'确认删除吗？',
    async success(res){
      if(res.confirm){
        let ans = await request({
          url:`/admin/user/${id}`,
          method:'DELETE'
        })
        if(ans.errMsg === "request:ok") {
          wx.showToast({
          title: '删除成功',
        })
        // 更新用户列表
        _this.get()
      }
        else wx.showToast({
          title: '删除失败',
        })
      }
    }
  })
},

// 是否显示弹出层
changeShow(){
  this.setData({
    show:!this.data.show
  })
},
















  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})