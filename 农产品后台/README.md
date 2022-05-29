#农业生产管理系统

### 安装依赖

***

```
- 通过`npm`安装本地服务第三方依赖模块(需要已安装[Node.js](https://nodejs.org/))
- 如安装过慢，或者报错，则切换淘宝镜像使用命令
npm install -g cnpm --registry=https://registry.npm.taobao.org
安装完毕使用cnpm install 进行安装依赖
```

npm install

```
启动服务: (http://localhost:3000)
```

npm start 
```
发布代码
```
npm run build


***
### 目录结构

<pre>
├── build                     // 项目的 Webpack 配置文件
├── config                    // 项目配置目录（设置开发环境请求代理proxyTable）
├── src                       // 生产目录
│   ├── assets                // 一些资源文件,图片和全局的css样式
│   ├── ├──images             // 静态图片，背景，icon等
│   ├── ├──scss               // 全局的样式
│   ├── fetch                 // 项目开发的请求接口
│   ├── ├──api                // 各个模块的请求
│   ├── ├──port_uri           // 接口的uri 和请求方法post or get
│   ├── ├──axios              // axios的封装
│   ├── ├──index              // 各个模块接口的导出
│   ├── common                // 通用函数
│   ├── components            // 各种组件
│   ├── pages                 // 各种页面
│   ├── directives            // 自定义指令
│   ├── router                // 路由配置及拦截
│   ├── store                 // Vuex 状态管理器
│   ├── App.vue               // 根组件
│   ├── favicon.ico           // ico小图标
│   ├── index.html            // 项目入口文件
│   ├── main.js               // Webpack 编译入口文件，入口js
├── static                    // 静态资源，一般把不需要处理的文件可以放这里
├── .babelrc                  // babelrc配置文件
├── .editorconfig             // 代码风格文件，前提是要你的编辑器支持
├── .gitignore                // 用于Git配置不需要加入版本管理的文件
├── .postcssrc.js             // autoprefixer的配置文件
├── package.json              // 项目配置文件
</pre>