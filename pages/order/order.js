import {request} from '../../request/index';


Page({

  /**
   * 页面的初始数据
   */
  data: {
    pagination:{},
    orders:[],
    imgBaseUrl:'',
    status:["退款成功","申请退款","已关闭","正在交易","交易完成"],
    imgList:[],
    next:''
  },

  onLoad: function (options) {
    this.imgUrl()
   
  },
  onPullDownRefresh: function () {
    this.getOrders()
    wx.stopPullDownRefresh()

  },
  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

     this.getOrders()

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
  
  getPrev(){
    this.getOrders(this.data.pagination.current_page-1)
  },
  getNext(){
    this.getOrders(this.data.pagination.current_page+1)
  },
  async getOrders(page=1){
    const _this = this
    const {order} = this.data
    try {
      let res = await request({
        url:'/orders?page='+page
      })
      // console.log('订单信息',res)
      if(res.statusCode === 200 || res.statusCode === 304){
        // _this.show('订单更新成功',"success")
        const {orders, meta} = res.data
        let next = meta.pagination.links.next || null
        // console.log(next)
        // console.log(orders)
        _this.setData({
          orders,
          next
        })

        // 判断是否需要加载下一页数据     
      }
      else{
        _this.show()
      }
    } catch (error) {
      return _this.show("", "error")
    }
    
  },
  gotoOrderInfo(e){
    const id = e.currentTarget.dataset.id
    wx.navigateTo({
      url: '/pages/orderInfo/orderInfo?id='+id,
    });
  },
  gotoCanteen(e){
    const {id} = e.currentTarget.dataset
    wx.navigateTo({
      url:'/pages/canteen/canteen?id='+id
    })
  },
  show(content,type){
    wx.lin.showMessage({
      content:content||'网络错误，请重新登录',
      type:type||"primary"
    })
  }

})