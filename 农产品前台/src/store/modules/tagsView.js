 /*标签页*/
 import * as types from '../mutation-types'
  const state = {
    gvisitedViews: [
      {
        path:'/home',
        title:'首页',
        name:'home',
        meta:{keepAlive:true}
      }
    ],
    gcachedViews: []
  };

  const getters = {
    getvisitedViews : state => state.gvisitedViews,
    getcachedViews : state => state.gcachedViews,
  };

  const mutations = {
    [types.ADD_VISITED_VIEWS]: (state, view) => {
      if (state.gvisitedViews.some(v => v.path === view.path)) return
      console.log(view);
      let obj = {
        path:view.path,
        title:view.meta.title || 'no-name',
        name:view.name,
        meta:{keepAlive:view.meta.keepAlive || false}
      }
      state.gvisitedViews.push(obj)
      if (view.meta.keepAlive) {
        state.gcachedViews.push(view.name)
      }
    },
    [types.DEL_VISITED_VIEWS]: (state, view) => {
      if(view.path ==='/home'){
        return
      }
      for (const [i, v] of state.gvisitedViews.entries()) {
        if (v.path === view.path ) {
          state.gvisitedViews.splice(i, 1)
          break
        }
      }
      for (const i of state.gcachedViews) {
        if (i === view.name) {
          const index = state.gcachedViews.indexOf(i)
          state.gcachedViews.splice(index, 1)
          break
        }
      }
    },
    [types.DEL_OTHERS_VIEWS]: (state, view) => {
      for (const [i, v] of state.gvisitedViews.entries()) {
        if (v.path === view.path) {
          // state.gvisitedViews = state.gvisitedViews.slice(i, i + 1)
          //修改删除其他的tags
          const currentPage = state.gvisitedViews.slice(i, i + 1)
          const homePage = state.gvisitedViews.slice(0, 1);
          state.gvisitedViews = homePage.concat(currentPage);
          break
        }
      }
      for (const i of state.gcachedViews) {
        if (i === view.name) {
          const index = state.gcachedViews.indexOf(i)
          state.gcachedViews = state.gcachedViews.slice(index, index + 1)
          break
        }
      }
    },
    [types.DEL_ALL_VIEWS]: (state) => {
      // state.gvisitedViews = []
      state.gvisitedViews =state.gvisitedViews.slice(0,1)
      state.gcachedViews = []
    }
  }
  const actions = {
    addVisitedViews({ commit }, view = {}) {
      commit(types.ADD_VISITED_VIEWS, view)
    },
    delVisitedViews({ commit, state }, view) {
      return new Promise((resolve) => {
        commit(types.DEL_VISITED_VIEWS, view)
        resolve([...state.gvisitedViews])
      })
    },
    delOthersViews({ commit, state }, view) {
      return new Promise((resolve) => {
        commit(types.DEL_OTHERS_VIEWS, view)
        resolve([...state.gvisitedViews])
      })
    },
    delAllViews({ commit, state }) {
      return new Promise((resolve) => {
        commit(types.DEL_ALL_VIEWS)
        resolve([...state.gvisitedViews])
      })
    }
  };

export default {
  state,
  actions,
  getters,
  mutations
}