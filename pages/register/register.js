// pages/register/register.js
import {request} from "../../request/index.js"

// 正则表达式
const REpwd = /^[\w\d!@#$%^&*]{6,20}$/;

Page({

  /**
   * 页面的初始数据
   */
  data: {
    userName:"",
    stu_id:0,
    password:"",
    power:0,
    status:1,
    image:'',
    captcha:'',
    key:''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getCode()
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

    
  // 获取图片验证码
  getCode(){
    const _this = this
    this.setData({
      image:null,
      code:null
    })
    request({
      url:'/captcha/api/math'
    }).then(r=>{
      // console.log('验证码\n',r)
      const { img, key } = r.data
      this.setData({
        image: img,
        key
      })
    }),()=>{
      _this.show("获取验证码失败，请稍后重试")
    }

  },
  // 获取输入的验证码
  getInputCode(e){
    this.setData({
      captcha:e.detail.value
    })
  },



  async Register(){
      const  {userName,password,stu_id,captcha,key} = this.data;
      const _this = this
 
    if (stu_id===0){
      wx.showToast({
        title: '学号格式错误',
        duration: 1000,
        mask:true
      })
    }
    else if(REpwd.test(password)===false){
      wx.showToast({
        title: '密码格式错误',
        duration: 1000,
        mask:true
      })
    }
    else{
      try {
        let res = await request({
          method:"POST",
          url:"/register",
          data:{
            name:userName,
            username:stu_id,
            password,
            status:0,
            power:0,
            captcha,
            key
          }
        })
        console.log("注册",res)
        const {statusCode} = res
          if(statusCode === 200 || statusCode === 201){
            _this.show("注册成功","success")
            setTimeout(()=>{
              wx.navigateTo({
                url: '../login/login'
              })
            },500)
          }
          else if(statusCode===429){
            _this.show("验证码错误次数过多，请5分钟后点击验证码刷新重试","error")
          }
          else{
            // 重新获取验证码
            _this.getCode()
            if(res.data.errors.captcha){
              _this.show("验证码错误","error")
            }
            else{
              _this.show()
            }
      }
    }catch(e){
      _this.show()
    }
    }
  },

    show(cnt,type){
      wx.lin.showMessage({
        content:cnt||'网络错误',
        type:type||"primary"
      })
    }
})