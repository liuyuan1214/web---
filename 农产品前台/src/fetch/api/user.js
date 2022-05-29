/**
 *用户信息请求
 *
 */

import fetch from '../axios/'
import { userInfo } from '../port_uri/'

//用户登录
export function user_login(data) {
  var params = Object.assign({data:data},userInfo.user.login)
  return fetch(params);
}
//修改密码
export function user_modifyPwd(data) {
  var params = Object.assign({data:data},userInfo.user.modifyPwd)
  return fetch(params);
}
//用户信息-初始化
export function user_list(data) {
  var params = Object.assign({data:data},userInfo.user.pageZtyhByQyid)
  return fetch(params);
}
//用户信息-保存/修改
export function user_save(data) {
  var params = Object.assign({data:data},userInfo.user.saveUser)
  return fetch(params);
}
//用户信息-验证用户信息唯一性
export function user_exist(data) {
  var params = Object.assign({data:data},userInfo.user.checkUserIsExistQY )
  return fetch(params);
}
//用户信息-停用、启用
export function user_status(data) {
  var params = Object.assign({data:data},userInfo.user.updateUser )
  return fetch(params);
}


//用户信息-停用、启用
export function user_comInfo(data) {
  var params = Object.assign({data:data},userInfo.user.getScjyqyById)
  return fetch(params);
}
// 企业信息-企业信息保存 
export function user_comSave(data) {
  var params = Object.assign({data:data},userInfo.user.saveScjyqy)
  return fetch(params);
}

// 企业信息-企业信息保存 
export function user_compiclist(data) {
  var params = Object.assign({data:data},userInfo.user.listJcQypicByQyId)
  return fetch(params);
}

 

// 企业信息-企业信息保存 
export function user_compicdelete(data) {
  var params = Object.assign({data:data},userInfo.user.delJcQypic)
  return fetch(params);
}


// 企业信息-企业信息保存 
export function user_compicsave(data) {
  var params = Object.assign({data:data},userInfo.user.saveJcQypic)
  return fetch(params);
}