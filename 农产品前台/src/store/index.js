/**
 *
 * 状态管理器

 */

import Vue from 'vue'
import Vuex from 'vuex'

import createLogger from 'vuex/dist/logger'

//引入模块
import tagsView from './modules/tagsView'
import userInfo from './modules/userInfo'

const debug = process.env.NODE_ENV !== 'production'

Vue.use(Vuex)

export default new Vuex.Store({
	modules:{
    tagsView,
    userInfo
  },
  strict:debug,
	plugins: debug ? [createLogger()] : []
})
