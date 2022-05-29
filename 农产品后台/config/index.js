var path = require('path')
var time = new Date();
var projectName="ncp";
var buildTime = time.getDate() + "_" + (Number(time.getMonth()) + 1) + "_" + time.getHours() + "." + time.getMinutes();
var fileName = projectName + buildTime;

module.exports = {
  build: {
    env: require('./prod.env'),
    index: path.resolve(__dirname, '../dist/'+fileName+'/index.html'),
    assetsRoot: path.resolve(__dirname, '../dist/'+fileName),
    assetsSubDirectory: 'static',
    assetsPublicPath: './',
    productionSourceMap: false,
    productionGzip: false,
    productionGzipExtensions: ['js', 'css'],
    bundleAnalyzerReport: process.env.npm_config_report
  },
  dev: {
    env: require('./dev.env'),
    port: 3008,
    //是否自动打开浏览器
    autoOpenBrowser: true,
    assetsSubDirectory: 'static',
    assetsPublicPath: '/',
    //本地请求设置代理 默认 http://localhost:3000 ===  'http://47.96.250.111:8088'
    proxyTable: {//重点是配置这里
      // '/httpService3.0.6': 'http://180.76.161.247:8521',
      // "/httpService3.0.6": {
      //   target: "http://180.76.161.247:8521", // 要访问的接口域名
      //   // ws: true, // 是否启用websockets
      //   // changeOrigin: true, //开启代理：在本地会创建一个虚拟服务端，然后发送请求的数据，并同时接收请求的数据，这样服务端和服务端进行数据的交互就不会有跨域问题
      //   pathRewrite: {
      //       '^/httpService3.0.6': '/' ,      } ,
      //   }

        "/area": {
          target: "http://180.76.161.247:8521", // 要访问的接口域名
          // ws: true, // 是否启用websockets
          // changeOrigin: true, //开启代理：在本地会创建一个虚拟服务端，然后发送请求的数据，并同时接收请求的数据，这样服务端和服务端进行数据的交互就不会有跨域问题
          pathRewrite: {
              '^/area': '/' ,      } ,
          }
 
    },
    cssSourceMap: true
  }
}
