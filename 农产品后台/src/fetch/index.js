/**
 * api请求索引
 *
 */

//导入模块
import * as api_user from './api/user'
import * as api_base from './api/base'
import * as api_cg from './api/purchase'

const apiObj = {
  api_user,
  api_base,
  api_cg
}

const install = function (Vue) {
  if (install.installed) return
  install.installed = true

  //定义属性到Vue原型中
  Object.defineProperties(Vue.prototype, {
    $fetch: {
      get() {
        return apiObj
      }
    }
  })
}

export default {
  install
}
