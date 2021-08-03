import {request} from '../../request/index' ;

Page({

  /**
   * 页面的初始数据
   */
  data: {
    name:'',
    stu_num:'',
    total:0,
    money:0,
    myCart:[],
    imgBaseUrl:'',
    // 备注
    comments:"",
    time:'',
    now:'',
    canteen_id:null
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: async function (options) {
    const {canteen_id} = options
    this.setData({
      canteen_id
    })
    this.imgUrl()
    this.getUserInfo()
    this.get(canteen_id)
    await this.getNow();
  },

  getNow(){
    let date = new Date()
    let now = date.toTimeString().substring(0,5)
    this.setData({
      now
    })
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
    request({
      url:'/user'
    }).then(res=>{
      // console.log(res)
      this.setData({
        name : res.data.name,
        stu_num: res.data.stu_id
      })
    }).catch(err=>{
      wx.showToast({
        title: '获取失败',
      })
    })
  },

  // 获取购物车信息
async get(canteen_id){
  let res = await request({
    url:'/carts?canteen_id='+canteen_id,
    method:'GET'
  })
 // console.log('获取购物车列表',res)

  if(res.statusCode === 200){
    let myCart = res.data.carts
    let total = 0
    let money = 0
    myCart.forEach(item=>{
      total +=item.amount
      money +=item.price*item.amount
    })
    // 更新本地购物车信息
    this.setData({
      total,
      money,
      myCart,
    })
  }
  else{
    wx.lin.showMessage({
      type:'error',
      content:'更新购物车失败'
  })
  }
},



getcomments(e){
  // console.log(e)
  this.setData({
    comments:e.detail
  })
},

getTime(e){
  this.setData({
    time:e.detail.value
  })
},

ok(){
  const _this = this 
  wx.showModal({
    content: '请预留足够时间给商家',
    success (res) {
      if (res.confirm) {
        let {comments, time, now,canteen_id} = _this.data
        var date = new Date()
        let m = date.getMonth()+1
        let d = date.getDate()
        const day = `${date.getFullYear()}-${m>10?m:'0'+m}-${d>10?d:'0'+d}`
        if(time){
          time = `${day} ${time}`
        }
        else{
          time = `${day} ${now}:59`
        }
        request({
          url:'/order',
          method:'POST',
          data:{
            comments,
            appointment:time,
            canteen_id
          }
        })
        .then(async ret=>{
          if(ret.statusCode === 200){
            wx.lin.showMessage({
              content:'预约成功，请按时到餐厅取餐',
              type:'success'
            })
            setTimeout(()=>{
              wx.switchTab({
                url: '/pages/order/order'
              })
            },2000)
            
          }
          else{
            return wx.lin.showMessage({
              content:'请选择商品与预约时间',
              type:'error',
              duration:3000
            })
          }
          
        },err=>{
          wx.lin.showMessage({
            content:'网络错误',
          })
        })
      } else if (res.cancel) {
        // do nothing
      }
    }
  })
},

bindTimeChange(e){
  let time = e.detail.value+':00'
  this.setData({
    time
  })
}



})