import {request} from "../../request/index.js"

// 正则表达式
const REusername = /^\d{4,20}/;
const REpwd = /^[\w\d!@#$%^&*]{6,20}$/;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    userName:"",
    pwd:"",
    image:'',
    baseUrl:'',
    key:'',
    // 输入的验证码 captcha
    captcha:''
    // 用户名跟密码都正确才能登录
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: async function (options) {
    //清缓存
    // try {
    //   wx.clearStorageSync()
    // } catch(e) {
    //   // Do something when catch error
    // }
    wx.setStorage({
      key:'imgBaseUrl',
      data:'https://sztuours.sztu.edu.cn/storage/app/'
    })  

    
    // 分享
    wx.showShareMenu({
      withShareTicket: true,
      menus: ['shareAppMessage', 'shareTimeline']
    })
  },
  onShow(){
    this.getCode()
  },

  // 获取用户名
  getUserName(e){
    // console.log(e.detail);
    const {value} = e.detail;
    // 验证用户名的合法性
    this.setData({
        userName:value
      })
  },
  // 获取密码
  getpwd(e){
    // console.log(e);
    const {value} = e.detail;
    this.setData({
        pwd:value,
      })
  },
  
  // 获取图片验证码
  getCode(){
    const _this = this
    this.setData({
      image:null,
      code:null
    });
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

  // 登录 
  userLogin(){
    const _this = this
    const  {userName,pwd,key,captcha} = this.data;
    // console.log(userName)
    // 二次验证
    // console.log(REusername.test(userName))
    // console.log(REpwd.test(pwd))
    if (REusername.test(userName)===false){
      _this.show("学工号格式错误","error")
    }
    else if(REpwd.test(pwd)===false){
      _this.show("密码格式错误","error")
    }
    else{
      request({
        url:"/authorizations",
        method:"POST",
        data:{
          username:userName,
          password:pwd,
          client_id:1,
          grant_type:"password",
          client_secret:"pjetY8oK0fqA9cgo54kwkmiG2iGMOUZeIlgFiCbk",
          key,
          captcha
        }
      }).then(
        res=>{
          console.log('登录结果\n',res);
          const {statusCode} = res
          if(statusCode === 200 || statusCode === 201){
            _this.show("登录成功","success")
           wx.setStorage({
             key:'token', 
             data:res.data['access_token'],
             success(res){
               wx.switchTab({
                url: '../index/index'
              })
             }
            })
            
            
          }
          else if(statusCode===429){
            _this.show("验证码错误次数过多，请5分钟后点击验证码刷新重试","error")
          }
          else if(res.statusCode===401){
              _this.show("学工号与密码不匹配","error")
              _this.getCode()
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
          },
          
        err=>{
          _this.show()
        }
      )
    // }
  }
},
  // 前往注册
  gotoRegister(){
    wx.navigateTo({
      url: '../register/register'
  })
},
show(cnt,type){
  wx.lin.showMessage({
    content:cnt||'网络错误',
    type:type||"primary"
  })
}
})