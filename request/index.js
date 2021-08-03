// 同时发送异步代码的次数
let ajaxTimes=0;

const baseUrl = "https://sztuours.sztu.edu.cn";


// 普通 URL
export const request=async(params)=>{
    ajaxTimes++;
    const token =  wx.getStorageSync('token')
    // console.log("request参数",arguments,token);
    // 显示加载中的效果
    wx.showLoading({
        title: '加载中',
        mask:true
    })
    return new Promise((resolve,reject)=>{
        wx.request({
            ...params,
            url: baseUrl+params.url,
            header:{
                AUTHORIZATION:`Bearer ${token}`
            },
            success:(result)=>{
                resolve(result);
            },
            fail:(err)=>{
                reject(err);
            },
            complete:()=>{
                ajaxTimes--;
                if(ajaxTimes===0){
                    // 关闭loading
                    wx.hideLoading();
                }
                
            }
        });
    })
}

// 图片上传
// 参数需求 obj 包含 url 以及 key
export const upload = (url='', key='')=>{
  const token =  wx.getStorageSync('token')
  return new Promise( async (resolve,reject)=>{
    const res = await wx.chooseImage({
      count: 1,
    })
    const file = res.tempFilePaths[0]
    wx.uploadFile({
      url: `${baseUrl}${url}`, 
      filePath: file,
      name: key,
      header:{
        AUTHORIZATION:`Bearer ${token}`
      },
      success (res){
        if(res.errMsg === "uploadFile:ok"){
          wx.showToast({
            title: '上传成功',
            duration:1000
          })
        }
        console.log("上传成功的结果",res)
        resolve('ok')
      },
      fail(err){
          wx.showToast({
            title: '上传失败',
            duration:1000,
            mask:true
          })
          reject('fail')
      }
    })

  })
}