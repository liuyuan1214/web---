/*用户信息*/
import * as types from '../mutation-types'
import fetch from "fetch/axios/";


  const state = {
    user_info: null,
    change_version:false,
    unread_notice:0,
    leftcontent:false
  };

  const getters = {
    getleftcontent : state => state.leftcontent,
    getUserInfo: state => state.user_info,
    getVersion: state => state.change_version,
    getUnreadNotice: state => state.unread_notice
  };

  const mutations = {
    [types.SET_TO_LEFTCONTENT](state,status) {
      state.leftcontent = status || !state.leftcontent
    },
    [types.GET_TO_USERDATA](state,data) {
        state.user_info = data
    },
    [types.GET_TO_VERSION](state,data) {
      state.change_version = data
   },
   [types.GET_TO_NOTICE](state,data) {
    state.unread_notice = data
 }
  }
  const actions = {
   setLeftcontent({ commit }, status = ''){
      commit(types.SET_TO_LEFTCONTENT, status)
    },
   setUserInfo({ commit }, data=null) {
      commit(types.GET_TO_USERDATA, data)
    },
    changeVersion({ commit }, data=false) {
      commit(types.GET_TO_VERSION, data)
    },
    setUnreadNotice({ commit,state }, data=false) {
        let params = {
          ztyhId: state.user_info.userId
        };
        fetch({
          url: "/utilmodel/qy/pageNoticeRecList/",
          method: "get",
          data: params
        })
          .then(res => {
            let { cdrzNum } = res.list;
            commit(types.GET_TO_NOTICE, cdrzNum?cdrzNum:0)
          })
      
    },
  };

export default {
  state,
  actions,
  getters,
  mutations
}