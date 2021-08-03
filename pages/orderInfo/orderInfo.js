import {request} from '../../request/index';


Page({

  /**
   * 页面的初始数据
   */
  data: {
    order:{},
    imgBaseUrl:'',
    status:["退款成功","申请退款","已关闭","正在交易","交易完成"],
    userInfo:{}
  },

  onLoad: function (options) {
    const id = parseInt(options.id)
    this.imgUrl()
    this.getOrders(id)
    this.getUserInfo()
  },

  imgUrl(){
    wx.getStorage({
      key: 'imgBaseUrl',
      success: (res)=> {
        this.setData({
          imgBaseUrl : res.data
        })
      },
      fail:()=>{
        wx.showToast({
          title:'获取失败'
        })
      }
    })
  },
  async getUserInfo(){
    try {
      let res = await request({url:'/user'})
      this.setData({
        userInfo:res.data
      })
    } catch (e) {
      this.show('获取用户信息失败',"error")
    }
  },
  async getOrders(id=1){
    const _this = this
    try {
      let res = await request({
        url:'/order/'+id
      })
      console.log('订单信息',res)
      if(res.statusCode === 200){
        _this.show('获取成功',"success")
        _this.setData({
          order:res.data,
        })
      }
      else{
        _this.show()
      }
    } catch (error) {
      return _this.show("", "error")
    }
    

  },
  show(content,type){
    wx.lin.showMessage({
      content:content||'网络错误，请稍后再试',
      type:type||"primary"
    })
  }

})