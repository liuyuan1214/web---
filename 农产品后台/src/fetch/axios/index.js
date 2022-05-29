/**
 * @intro: 数据请求统一封装.
 */

//导入模块
import axios from 'axios'
import * as responseCode from './responseCode'
import {pjConfig} from './config'
import router from 'src/router'
import {Message} from 'element-ui'
import store from 'store'
import {tools_uri} from 'common/tools'  

async function fetchbase(options) {
    //创建一个axios实例
    const instance = axios.create({
      //设置默认根地址
     baseURL: process.env.NODE_ENV === 'development'? pjConfig.serviceName:pjConfig.server_base_url+pjConfig.serviceName,
    // baseURL: process.env.NODE_ENV === 'development'? 'http://180.76.161.247:8521':'http://180.76.161.247:8521',
    
     //设置请求超时设置
      timeout: 10000,
      withCredentials: true
    })
    console.log('333' + process.env.NODE_ENV)
    //请求处理过程报错
		try{
      
      var {data} = await instance(options);
 
		}catch(err){
      console.error('网络中断或者接口错误！');
			return Promise.reject(err);
    }
    //请求响应处理
    console.log(data.code,"请求返回码")
    console.log(responseCode.success,"请求返回码")
    if (data.code == responseCode.success) {
      console.log("请求返回码相同")
        return Promise.resolve(data)
    } else if(data.code === responseCode.error ||data.resCode === responseCode.uploadImgErr ){
        var errorMess = data.code=='100002'?'图片格式不正确，修改后再上传！':data.errorMess
        Message({type:'error',message:errorMess})
        return Promise.reject(data)
    }else if (data.cde === responseCode.unlogin) {
      //用户未登录的处理
      localStorage.removeItem("ncpUserInfo");
      store.dispatch('setUserInfo')
      Message({type:'error',message:'登录失效，请重新登录！'})
      setTimeout(()=>{
        router.replace({name: "login"})
      },1000)
    }else{
        return Promise.reject(data);
    }
}

const fetch = async function(options){
  console.log(options,"请求的数据1")
    if(options.method!=='upload'){
        if(options.data &&  typeof options.data ==='object'){
            var params={};
            for(var i in options.data){
              options.data[i]===0 || options.data[i]?  params[i]=String(options.data[i]):'';
            }
            //判断登录是否失效sessionKey
            if(store.getters.getUserInfo){
                  params.sessionKey = store.getters.getUserInfo.sessionKey;
            }
            //参数操作终端  1-PC端 2-移动端
            params.xtczzd = "1";
            params.proType="NCP_Product"
            options.data = params;
         }
         //参数会进行编译，开发环境则打印参数，可删除
         if(process.env.NODE_ENV==='development'){
           console.log(options,"888");
           console.log(options.data,"999"); 
         }
         if(options.method==='get'){
             options.data = options.data &&  typeof options.data ==='object' ? tools_uri.encode(JSON.stringify(options.data)):'';
             //options.url = options.url +  options.data;
             delete options.data
          }
          options.headers={
           'Content-Type':"text/plain;charset=UTF-8",
           "Accept":"text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8"
          }
          console.log("555")
    }else{
        options.method="post"
    }
    console.log(options,"返回的数据33")
   return await fetchbase(options)
}

export default fetch;
