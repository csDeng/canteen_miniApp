import {request} from '../../../request/index'


// pages/admin/userAdmin/userAdmin.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    username:"",
    stu_id:"",
    password:"",
    power:0,
    status:1,
    baseUrl:"",
    token:""
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    wx.getStorage({key:"token"}).then(res=>{
      // console.log(res)
      this.setData({
        token:res.data
      })
    })
    wx.getStorage({key:"baseUrl"}).then(res=>{
      // console.log(res)
      this.setData({
        baseUrl:res.data
      })
    })
  },

// 获取用户名
getUserName(e){
  const {value} = e.detail;
  this.setData({
      userName:value
    })
},
// 获取密码
getpwd(e){
  const {value} = e.detail;
  this.setData({
      password:value,
    })
},
// 获取学号
getstu_id(e){
  const {value} = e.detail;
  this.setData({
      stu_id:value,
    })
},
addUser(){
  const {userName,password,stu_id,token} = this.data;
  request({
    method:"POST",
    url:"/admin/user",
    header:{
      "AUTHORIZATION":"Bearer "+ token,
    },
    data:{
      "name":userName,
      "password":password,
      "stu_id":stu_id,

      // 默认前端展示
      "status":1,

      // 默认位普通用户
      "power":0,
    }
  }).then(
    async res=>{
      if(res.statusCode===200){
        await wx.showToast({
          title: '添加成功',
          duration:1000
        })

        // 数据清零
        this.setData({
          name:'',
          password:'',
          stu_id:''
        })
        setTimeout(()=>{
          wx.navigateBack({
            delta: 1,
          })
        },1000)
        
      }
    },
    err=>{
      wx.showToast({
        title: '添加失败',
      })
    }
  )

},

})