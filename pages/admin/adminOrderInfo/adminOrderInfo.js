import {request} from '../../../request/index';


Page({

  /**
   * 页面的初始数据
   */
  data: {
    order:{},
    imgBaseUrl:'',
    status:["退款成功","申请退款","已关闭","正在交易","交易完成"],
  },

  onLoad: function (options) {
    const id = parseInt(options.id)
    this.imgUrl()
    this.getOrders(id)
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
  async getOrders(id=1){
    const _this = this
    try {
      let res = await request({
        url:'/admin/order/'+id
      })
      console.log('订单管理信息',res)
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
  // 接单
  async rec(){
    const {order} = this.data
    const _this = this
    wx.showModal({
      content: '确认接当前订单吗？',
      async success (res) {
        if (res.confirm) {
          try {
            let res = await request({
              url:'/admin/order/'+order.id,
              method:'POST',
              data:{
                is_paid:1
              }
            })
            _this.show("接单成功","success")
            wx.showModal({
              content:`请在${order.appointment}之前完成当前菜单`,
              success(){    
                  wx.navigateBack({
                    delta: 1
                  });   
              }
            })
          } catch (error) {
            _this.show()
          }
          
        } else if (res.cancel) {
          console.log('用户点击取消')
        }
      }
    })
    
  },
  // 已收款

  getMoney(){
    const {order} = this.data
    const _this = this
    wx.showModal({
      content: '确认已经收到当前订单的费用了吗？',
      async success (res) {
        if (res.confirm) {
          try {
            let res = await request({
              url:'/admin/order/'+order.id,
              method:'POST',
              data:{
                status:2
              }
            })
            _this.show("确认收款成功","success")
            setTimeout(()=>{
              wx.navigateBack({
                delta: 1
              }); 
            },500) 
          } catch (error) {
            _this.show()
          }
          
        } else if (res.cancel) {
          console.log('用户点击取消')
        }
      }
    })
  },
  show(content,type){
    wx.lin.showMessage({
      content:content||'网络错误，请稍后再试',
      type:type||"primary"
    })
  }

})