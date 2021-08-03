import {request} from '../../../request/index';
 let t = null

Page({

  /**
   * 页面的初始数据
   */
  data: {
    orders:[],
    imgBaseUrl:'',
    pages:{},
    status:["退款成功","申请退款","已关闭","正在交易","交易完成"]
  },

  onLoad: function (options) {
    this.imgUrl()
    console.log('load')
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    console.log('show')
    this.getOrders()
    
    t = setInterval(() => {
      this.getOrders()
    }, 60000);
  },


  onUnload:async function(){
    console.log("unload")    
      console.log(t)
      await clearInterval(t)
      console.log("已清除",t)
      t = null
      console.log(t)
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

  async getOrders(e){
    let pid = null
    if(e){
      pid = this.data.pages['current_page']+parseInt(e.target.dataset.id)
    }
    const _this = this
    try {
      let res = await request({
        url:`/admin/orders?page=${pid}`
      })
      console.log(res)
      if(res.statusCode === 200){
        _this.show('获取成功',"success")
        _this.setData({
          orders:res.data.orders,
          pages:res.data.meta.pagination
        })
      }
      else{
        _this.show()
      }
    } catch (error) {
      return _this.show("", "error")
    }
    

  },
  gotoOrderInfo(e){
    const { id } = e.currentTarget.dataset
    wx.navigateTo({
      url: '/pages/admin/adminOrderInfo/adminOrderInfo?id='+id,
    });
  },
  show(content,type){
    wx.lin.showMessage({
      content:content||'网络错误，请稍后再试',
      type:type||"primary"
    })
  },
  async deleteOrder(e){
    console.log(e)
    const id = e.currentTarget.dataset.oid
    wx.showModal({
      content:'确认删除吗',
      success:async (ret)=>{
        if(ret.confirm){
          try {
            let res = await request({
              url:'/admin/order/'+id,
              method:'DELETE'
            })
            if(res.statusCode===200 || res.statusCode===204 ){
              this.show("删除成功")
              this.getOrders()
            }
          } catch (error) {
            this.show("删除失败，请稍后重试","error")
          }
        }
      }
    })
    
  }

})