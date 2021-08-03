import {request} from '../../request/index';
const {log} = console
// pages/changeUser/changeUser.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    user:{
      name:'',
      phone:null,
      password:null
    }
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    wx.lin.initValidateForm(this)

    // 获取用户初始信息
    this.getUserInfo()
  
  },


  async getUserInfo(){
    try {
      let res = await request({
        url:'/user'
      })
      log("获取到的用户信息",res)
      this.setData({
        user:res.data
      })
    } catch (error) {
      // do thing
    }
  },


  async submit(e){
    // console.log(e)
    const _this = this
    const {name, phone} = e.detail.values
    log(name,phone)
    try {
      let res = await request({
        url:'/user',
        method:'POST',
        data:{
          name,
          phone
        }

      })
      log('修改结果',res)
      const {statusCode} = res 
      if(statusCode == 200) {
        _this.show("修改成功")
      }
    } catch (error) {
      _this.show("修改失败","error")
    }
  },

  async show(cnt, type){
    wx.lin.showMessage({
      type:type || 'success',
      content: cnt || '网络错误错误，请重新登录'
  })
  }

})