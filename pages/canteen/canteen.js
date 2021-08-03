import {request} from '../../request/index'

Page({

  /**
   * 页面的初始数据
   */
  data: {
    // 餐厅id
    id:'',
    // 被点击的左侧的菜单索引
    currentIndex:0,
    scrollTop:0,
    
    // 餐厅的图片
    photo:"",
// 餐厅图片的基本前缀
    imgBaseUrl :'',
    menu:[],
    // 商品
    menu_item:[],

    // 餐厅的所有信息
    data:null,


    // 当前点击的分类索引
    activeID:0,
    // 当前点击的分类id
    chooseID:'',
    //我的购物车信息
    myCart:[],

    // 当前购物车的钱
    money:0,

    // 购物车中菜品的数量
    total:0,

    // 是否展示购物车
    show:false,
    next:'',

    // 中间弹出层的菜品展示
    midShow:false,
    shop:{}
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    const  { id  } = options
    // 获取图片的基本地址
    wx.getStorage({
      key:'imgBaseUrl',
      success:(res)=>{
        this.setData({
          imgBaseUrl:res.data,
          id
        })
      }
    })

  },
async onShow(options){
  const {id}= this.options
  this.getCanteen(id)
  // 获取分类
  await this.getCategories(id)
  // 获取第一个分类的菜品
  this.getProductsItem()
  // 获取服务器上的购物车信息
  this.get(id)
},


  // 获取餐厅基本信息
  getCanteen(id){
    wx.getStorage({
      key:id,
      success:(res)=>{
        console.log(res);
        const msg = typeof res=="String"?JSON.parse(res):res;
        const { imgBaseUrl } = this.data 
        const {photo}  = msg.data;
        this.setData({
          photo:imgBaseUrl+photo,
          data:msg.data,
          english_name: res.data.english_name
        })
      }
    })
  },

  // 获取选中的分类ID
  changeActiveId(e){
    const index = e.detail
    const { menu } =  this.data
    let chooseID = menu[index].id
    this.setData({
      chooseID
    })
    this.getProductsItem(chooseID)
  },

  // 获取商品分类
  async getCategories(id){
    let menu = []
    let res= await request({
      url:'/categories',
      method:'GET'
    })
    res.data.forEach(item=>{
     // console.log(item)
      if(item.canteen_id==id){
        menu.push(item)
      }
    })
    this.setData({
      menu
    })
  },

  // 获取商品详情
  async getProducts(e){    
    // console.log('ggg',e)
    const category_id = e.currentTarget.dataset.cid
    // console.log("hello",id,e,category_id)
    this.getProductsItem(category_id)
    
  },


  // 根据分类id获取分类里的商品
  async getProductsItem(category_id=-1, pid=1){
    const {id, imgBaseUrl,menu} = this.data

    if(category_id===-1){
      category_id = menu[0].id
    }

    let res = await request({
      url:'/products',
      method:'GET',
      data:{
        canteen_id:id,
        category_id,
        page:pid
      }
    })
    // console.log(res)
    let menu_item =[]
    res.data.products.forEach(item=>{
      item.photo = `${imgBaseUrl}${item.photo}`
      menu_item.push(item)
    })
    this.setData({
      menu_item,
      chooseID: category_id,
      next:res.data.meta.pagination.links.next || null
    })

    // 判断是否需要加载分页数据
    this.getmore(category_id,pid+1);
  },

  // 根据分类id获取分类里的分页商品
  async getmore(category_id,pid){
    const {next,id,menu_item,imgBaseUrl} = this.data
    const _this = this
    if(next){
      let res = await request({
        url:'/products',
        method:'GET',
        data:{
          canteen_id:id,
          category_id,
          page:pid
        }
      })
      console.log("分页",res)
      res.data.products.forEach(item=>{
        item.photo = `${imgBaseUrl}${item.photo}`
        menu_item.push(item)
      })
      this.setData({
        menu_item,
        chooseID: category_id,
        next:res.data.meta.pagination.links.next || null
      })
    }
  },


  // 添加商品
  async productAdd(e){
    const _this = this 
    const {id} = e.currentTarget.dataset
    _this.add(id)
  },

  // 购物车的操作方法开始
  async add(id){
    if(typeof(id) !="number"){
      id = id.currentTarget.dataset.cid
    }
    const canteen_id = this.data.id
    let res = await request({
      url:`/cart?canteen_id=${canteen_id}`,
      method:'POST',
      data:{
        product_id:id
      }
    })
    // console.log('添加购物车结果',res)
    if(res.statusCode===200){
      wx.lin.showMessage({
        type:'success',
        content:'添加成功'
    })
    }
    else{
      wx.lin.showMessage({
        type:'error',
        content:'添加失败'
    })
  }

  // 更新本地购物车列表
  this.get(canteen_id)

},//add

  async mius(e){
    const {id} = e.currentTarget.dataset
    const canteen_id = this.data.id
    let res = await request({
      url:`/cart?canteen_id=${canteen_id}`,
      method:'DELETE',
      data:{
        product_id:id
      }
    })
    //console.log(res)
    if(res.statusCode===204){
      wx.lin.showMessage({
        type:'success',
        content:'删除成功'
    })
    }
    else{
      wx.lin.showMessage({
        type:'error',
        content:'删除失败'
    })
  }
  await this.get(canteen_id)
  let {total} = this.data
  if(total===0) {
    this.setData({
      show:false
    })
  }
},


async get(id){
  let res = await request({
    url:'/carts?canteen_id='+id,
    method:'GET'
  })
//  console.log('获取购物车列表',res)

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



// 显示购物车
showCart(){
  this.setData({
    midShow:false,
    show:true
  })
},

// 显示商品详情
showShop(e){
  // console.log(e)
  const shop = e.currentTarget.dataset.obj
  this.setData({
    midShow:true,
    shop
  })
},



// 购物车的操作方法结束
close(){
  this.setData({
    show:false
  })
},

gotoPay(){
  const canteen_id = this.data.id
  wx.navigateTo({
    url: '/pages/prePay/prePay?canteen_id='+canteen_id,
  });
}
  
})