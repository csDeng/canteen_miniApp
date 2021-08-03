import {request} from '../../request/index';
import sha from '../../miniprogram_npm/js-sha1/index';

//获取应用实例
const app = getApp()

Page({
  data: {
    name:'',
    stu_num:0,
    power:0,
  },

  onLoad: async function () {
    await this.getUserInfo()
  },
  async onShow(){
    await this.getUserInfo()
  },
  getUserInfo() {
    const _this = this
  request({
      url:'/user'
    })
    .then( res=>{
    //  console.log('用户信息',res)
      if(res.statusCode === 200){
      //   wx.lin.showMessage({
      //     type:'success',
      //     content:'获取用户信息成功'
      // })
      let {name, stu_id, power} = res.data
      const localPower = sha(stu_id + name + 'admin')
      if(power===localPower){
        power = 1
      }else{
        power = 0
      }
      // console.log('sha1---\n',power,localPower)
      _this.setData({
        name:name,
        stu_num:stu_id,
        power:power
      })
      }
      else{
        wx.lin.showMessage({
          type:'error',
          content:'网络错误'
      })
      }
    },err=>{
      return wx.lin.showMessage({
        type:'error',
        content:'网络失败'
    })
    })
  },

  gotoAdmin(){
    wx.navigateTo({
      url:"/pages/admin/admin"
    })
  },
  gotoUpdate(){
    wx.navigateTo({
      url:"/pages/update/update"
    })
  },
  gotoAbout(){
    wx.navigateTo({
      url:"/pages/about/about"
    })
  },
  gotologin(){
    try {
      wx.clearStorageSync()
    } catch(e) {
      // Do something when catch error
    }
    wx.navigateTo({
      url:"/pages/login/login"
    })
  },
  gotofeedback(){
    wx.navigateTo({
      url: '/pages/feedback/feedback',
    })
  },
  gotoUser(){
    const {log} = console 

    log('111')
    wx.navigateTo({
      url:"/pages/changeUser/changeUser"
    })
  }
})
