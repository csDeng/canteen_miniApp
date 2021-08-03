
import {request , upload} from '../../../request/index'

Page({

  /**
   * 页面的初始数据
   */
  data: {
    canteen_id:'',
    category_id:'',
    imgBaseUrl:"",
    token:"",
    List:[],
    show:false,
    shop:{
      name:'',
      price:0,
      id:0,
      top:1
    },
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // 初始化表单
    wx.lin.initValidateForm(this)
    // 获取query参数
    const { canteen_id, category_id } = options

    const res1 = wx.getStorageSync('token')
    const res2 =  wx.getStorageSync("imgBaseUrl")

    this.setData({
      token:res1,
      imgBaseUrl:res2,
      canteen_id,
      category_id
    })

  },
  onShow(){
    this.getList()
  },


  async getList(){
      // 获取商品列表
      let  {category_id,canteen_id, imgBaseUrl } = this.data
      request({
        methods:'get',
        url:'/admin/products',
        data:{
          category_id,
          canteen_id
        }
      }).then((res,err)=>{
        if(err){
         return wx.showToast({
            title: '获取列表失败',
            icon: 'error',
            duration: 2000
          })
        }

        console.log('商品列表',res.data)
        let ans = res.data.products
        console.log(ans)
        ans.forEach((r,i)=>{
          // 图片图片路径处理
          r.photo = imgBaseUrl + r.photo
        })
        this.setData({
          List:ans
        })
      })
  },
  // 上传图片
  async uploadImg(e){
    // 餐厅id
    const id = e.currentTarget.dataset.index
    upload(`/admin/product/${id}/upload`,'photo')
    .then((res,err)=>{
      if(res){
        //  更新信息
        this.getList()
      }
    })

  },

  // 前往添加商品
  gotoAdd(){
    let  {category_id,canteen_id } = this.data
    wx.navigateTo({
      url: `../addProduct/addProduct?category_id=${category_id}&&canteen_id=${canteen_id}`,
    })
  },


  // 删除商品
  delCanteen(e){
    const id = e.currentTarget.dataset.index
    request({
      url:`/admin/product/${id}`,
      method:'DELETE'
    }).then((res,err)=>{
      if(err) return wx.showToast({
        title: '删除失败',
      })
      else{
        wx.showToast({
          title: '删除成功',
          duration:1000
        })
        // 更新餐厅信息
        this.getList()
      }
    })
  },

// 修改商品信息
change(e){
  console.log(e)
  const {id,name,price, top} = e.currentTarget.dataset.shop
  this.setData({
    shop:{
      id,
      name,
      price,
      top
    }
    
  })
  this.changeShow()
},


// 显示修改信息的弹框
changeShow(){
  this.setData({show: !this.data.show})
},

// 提交修改

// 提交修改
async submit(event){
  const {canteen_id, category_id} = this.data
  const {id} = this.data.shop
  const values = event.detail.values;
  // console.log('参数',values)
  let res = await request({
    url:`/admin/product/${id}`,
    method:'POST',
    data:{
      ...values,
      canteen_id,
      category_id
    }
  })
  if(res.statusCode===200){
    wx.showToast({
      title: '修改请求成功',
      duration:1000
    })
    this.getList()
    this.changeShow()
  }
  else{
    wx.showToast({
      title: '修改失败',
    })
  }
},

  
  



})