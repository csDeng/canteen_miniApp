import {request} from '../../../request/index'

Page({
  data: {
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
      location: ''
    },
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
    const {detail} = event;
    const {
      breakfast_open_time, 
      breakfast_close_time,
      lunch_open_time,
      lunch_close_time,
      dinner_open_time,
      dinner_close_time
    } = this.data
    console.log(detail)
    request({
      url:'/admin/canteen',
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
          title: '添加成功',
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
  onLoad: function () {
    wx.lin.initValidateForm(this)
  },
})