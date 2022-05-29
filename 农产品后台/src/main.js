
//导入ele样式
import 'element-ui/lib/theme-chalk/index.css'
//导入element组件
import ElementUI from 'element-ui'
//引入全局通用样式
import './scss/index.scss';
//导入Vue框架
import Vue from 'vue'
//导入路由
import router from './router'
//导入状态管理器vuex
import store from 'store'
//导入请求api
import fetch from './fetch/'
//导入自定义指令
import directives from './directives'
//导入主视图文件
import App from './App'
//引入全剧组件
import sComponent from './components'
//md5加密
import md5 from 'js-md5';
import Print from 'vue-print-nb';
import QRCode from 'qrcode';

Vue.use(QRCode);
Vue.use(Print);
Vue.prototype.$md5 = md5;
import * as echarts from "echarts";
Vue.prototype.$echarts = echarts
//使用element-ui
Vue.use(ElementUI,{size: 'medium'})
//使用自定义指令
directives(Vue) //指令集
//使用各个模块的fetch
Vue.use(fetch)
//注册全局组件
Object.keys(sComponent).forEach((key)=>{
  Vue.component(key, sComponent[key]); 
})
//发布后是否显示提示
Vue.config.productionTip = false
Vue.mixin({
  created() {
    var now = new Date();
    var year = now.getFullYear();
    var month = now.getMonth() >= 9 ? now.getMonth() + 1 : "0" + (now.getMonth() + 1);
    var date = now.getDate() > 9 ? now.getDate() : "0" + now.getDate();
    var startDay = year + "-01-01";
    var endDay = year + "-" + month + "-" + date;
    this.selDateRange = [startDay, endDay];
  }
});
//是否开启工具调试
Vue.config.devtools = process.env.NODE_ENV === 'development'
new Vue({
  router,
  store,
  ...App
}).$mount('mainbody')
