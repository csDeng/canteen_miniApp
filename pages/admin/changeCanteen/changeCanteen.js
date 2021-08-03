// pages/admin/changeCanteen/changeCanteen.js
import {request} from '../../../request/index'

Page({

  /**
   * 页面的初始数据
   */
  data: {
    id:'',
    activeId:0,
    breakfast_open_time:'07:00:00',
    breakfast_close_time:'09:00:00',
    lunch_open_time:'11:00:00',
    lunch_close_time:'13:00:00',
    dinner_open_time:'17:00:00',
    dinner_close_time:'19:00:00',
    canteen: {
      name: '',
      description: '',
      location: '',
      status:'',
      english_name:''
    },
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: async function (options) {
    wx.lin.initValidateForm(this)
    const {id} = options

    const res= await request({
      url:`/admin/canteen/${id}`,
      method:'GET'
    })


    const {name, description, location, status,english_name,
      breakfast_open_time, 
      breakfast_close_time,
      lunch_open_time,
      lunch_close_time,
      dinner_open_time,
      dinner_close_time
    } = res.data
    this.setData({
      id,
      breakfast_open_time, 
      breakfast_close_time,
      lunch_open_time,
      lunch_close_time,
      dinner_open_time,
      dinner_close_time,
      
      canteen:{
        name,
        description,
        location,
        status,
        english_name
      }
    })
  },

  async bindTimeChange(e){
    // console.log(e)
    let {
      breakfast_open_time, 
      breakfast_close_time,
      lunch_open_time,
      lunch_close_time,
      dinner_open_time,
      dinner_close_time
    } = this.data
    const tid = e.target.dataset.tid || e.currentTarget.dataset.tid
    const value = e.detail.value 
    this.setData({
      activeId:tid
    })
    // console.log(tid,value)
    if(value){
      if(tid=='1'){
      breakfast_open_time=value+':00'
    }else if(tid=='2'){
      breakfast_close_time=value+':00'
    }else if(tid=='3'){
      lunch_open_time=value+':00'
    }else if(tid=='4'){
      lunch_close_time=value+':00'
    }else if(tid=='5'){
      dinner_open_time=value+':00'
    }else if(tid=='6'){
      dinner_close_time=value+':00'
    }

    }
    
    this.setData(
      {
        breakfast_open_time, 
        breakfast_close_time,
        lunch_open_time,
        lunch_close_time,
        dinner_open_time,
        dinner_close_time
      }
    )

  },

  submit(event){
    const {id} = this.data
    let {
      breakfast_open_time, 
      breakfast_close_time,
      lunch_open_time,
      lunch_close_time,
      dinner_open_time,
      dinner_close_time
    } = this.data
    const {detail} = event;

    request({
      url:`/admin/canteen/${id}`,
      method:'POST',
      data:{
        ...detail.values,
        breakfast_open_time, 
        breakfast_close_time,
        lunch_open_time,
        lunch_close_time,
        dinner_open_time,
        dinner_close_time
      }
    }).then(res=>{
      if(res.statusCode === 200){
        wx.showToast({
          title: '修改成功',
        })
        setTimeout(_=>{
          wx.navigateBack({
            delta: 1,
          })
        },1000)

      }
      else{
        wx.showToast({
          title: '添加失败',
        })
      }
    })

    this.reset()
  },

  reset(){
    this.setData({
     name:'',
     description:'',
     location:'',
    })
  },

})