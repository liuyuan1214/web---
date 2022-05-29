/**
 * 基础模块的请求
 */
import fetch from '../axios/'
import { base } from '../port_uri/index'

//新增地块
export function addArea(data) {
  var params = Object.assign({data:data},base.cpwh.addArea)
  return fetch(params);
}
//地块列表
export function AreaList(data) {
  var params = Object.assign({data:data},base.cpwh.AreaList)
  console.log(params,"请求的数据22")
  return fetch(params);
}
//地块列表
export function SensorList(data) {
  var params = Object.assign({data:data},base.cpwh.SensorList)
  console.log(params,"请求的数据")
  return fetch(params);
}
//传感器告警设置

export function SensorUpdate(data) {
  var params = Object.assign({data:data},base.cpwh.SensorUpdate)
  return fetch(params);
}
//新增产品块
export function addProduct(data) {
  var params = Object.assign({data:data},base.cpwh.addProduct)
  return fetch(params);
}

export function BlockList(data) {
  var params = Object.assign({data:data},base.cpwh.BlockList)
  return fetch(params);
}
export function ProductTypeList(data) {
  var params = Object.assign({data:data},base.cpwh.ProductTypeList)
  return fetch(params);
}

export function ProductBlockInfo(data) {
  var params = Object.assign({data:data},base.cpwh.ProductBlockInfo)
  return fetch(params);
}
export function addlogistics(data) {
  var params = Object.assign({data:data},base.cpwh.addlogistics)
  return fetch(params);
}
export function addqualityCheck(data) {
  var params = Object.assign({data:data},base.cpwh.addqualityCheck)
  return fetch(params);
}
export function addprocess(data) {
  var params = Object.assign({data:data},base.cpwh.addprocess)
  return fetch(params);
}
export function addcultivation(data) {
  var params = Object.assign({data:data},base.cpwh.addcultivation)
  return fetch(params);
}


//1.产品维护页面

//列表
export function cpwh_list(data) {
  var params = Object.assign({data:data},base.cpwh.pageZtNcp)
  return fetch(params);
}
//2产品维护-根据ID获取产品维护信息
export function cpwh_detail(data) {
  var params = Object.assign({data:data},base.cpwh.getNcpInfoById)
  return fetch(params);
}
//3产品维护-保存/修改
export function cpwh_save(data) {
  var params = Object.assign({data:data},base.cpwh.saveSonZtncp)
  return fetch(params);
}
//4产品维护-根据农产品ID获取种植记录
export function cpwh_zzjl(data) {
  var params = Object.assign({data:data},base.cpwh.getZzjlByZtncpId)
  return fetch(params);
}
//5产品维护-提取农产品
export function cpwh_ncplist(data) {
  var params = Object.assign({data:data},base.cpwh.getUnTqNcpList)
  return fetch(params);
}
//6产品维护-保存提取的主体农产品
export function cpwh_saveZtncp(data) {
  var params = Object.assign({data:data},base.cpwh.saveZtncp)
  return fetch(params);
}
//7产品维护-判断农产品代码或者名称是否重复
export function cpwh_exist(data) {
  var params = Object.assign({data:data},base.cpwh.checkZtncpIsExist)
  return fetch(params);
}
//8产品维护-启用、停用
export function cpwh_status(data) {
  var params = Object.assign({data:data},base.cpwh.updateNcpStatus)
  return fetch(params);
}
//8产品维护-大类小类
export function cpwh_type(data) {
  var params = Object.assign({data:data},base.cpwh.getDataByCy)
  return fetch(params);
}


//3.地块负责人页面 
//1地块负责人-初始化
export function dkfzr_list(data) {
  var params = Object.assign({data:data},base.dkfzr.pageNhQY)
  return fetch(params);
}
//2地块负责人-保存修改
export function dkfzr_save(data) {
  var params = Object.assign({data:data},base.dkfzr.saveNh)
  return fetch(params);
}
//3地块负责人-停用启用
export function dkfzr_status(data) {
  var params = Object.assign({data:data},base.dkfzr.updateStatus)
  return fetch(params);
}
//4地块负责人-校验负责人是否存在
export function dkfzr_exist(data) {
  var params = Object.assign({data:data},base.dkfzr.checkNhIsExistQY)
  return fetch(params);
}
//3.地块信息页面 
//1地块信息-初始化
export function dk_list(data) {
  var params = Object.assign({data:data},base.dk.pageSccsByScjyztId)
  return fetch(params);
}
//2地块信息-保存修改
export function dk_save(data) {
  var params = Object.assign({data:data},base.dk.saveSccs)
  return fetch(params);
}
//3地块信息-停用启用
export function dk_status(data) {
  var params = Object.assign({data:data},base.dk.updateSccsStatus)
  return fetch(params);
}
//4地块信息-获得地块类型
export function dk_type(data) {
  var params = Object.assign({data:data},base.dk.getAllData)
  return fetch(params);
}

//5地块信息-判断场所编号/场所名称是否存在
export function dk_exist(data) {
  var params = Object.assign({data:data},base.dk.checkSccsIsExist)
  return fetch(params);
}

//4.往来单位页面 
//1往来单位-初始化
export function kh_list(data) {
  var params = Object.assign({data:data},base.kh.pageKhQY)
  return fetch(params);
}
//2往来单位-保存修改
export function kh_save(data) {
  var params = Object.assign({data:data},base.kh.saveKh)
  return fetch(params);
}
//3往来单位-停用启用
export function kh_status(data) {
  var params = Object.assign({data:data},base.kh.updateKhStatus)
  return fetch(params);
}
//4往来单位-获得地块类型
export function kh_pch(data) {
  var params = Object.assign({data:data},base.kh.getPch)
  return fetch(params);
}

//5往来单位-对客户名称进行新增或修改前的唯一性校核.
export function kh_exist(data) {
  var params = Object.assign({data:data},base.kh.checkKhxmIsExistQY)
  return fetch(params);
}

//5.商铺维护页面 
//1商铺维护-初始化
export function dpwh_list(data) {
  var params = Object.assign({data:data},base.dpwh.pageNcpShop)
  return fetch(params);
}
//2商铺维护-保存修改
export function dpwh_save(data) {
  var params = Object.assign({data:data},base.dpwh.saveNcpShop)
  return fetch(params);
}
//3商铺维护-停用启用
export function dpwh_delete(data) {
  var params = Object.assign({data:data},base.dpwh.deleNcpShopById)
  return fetch(params);
}
//4商铺维护-对客户名称进行新增或修改前的唯一性校核.
export function dpwh_exist(data) {
  var params = Object.assign({data:data},base.dpwh.checkNhIsExistQY)
  return fetch(params);
}

//5.投入品维护页面 
//1投入品维护--获取所有投入品 PAGE
export function trp_list(data) {
  var params = Object.assign({data:data},base.trp.pageZttrp)
  return fetch(params);
}
 //2投入品维护--基地未提取的投入品
export function trp_wtqlist(data) {
  var params = Object.assign({data:data},base.trp.pageZttrp)
  return fetch(params);
}


 //3投入品维护--删除主体投入品
 export function trp_trqdelete(data) {
  var params = Object.assign({data:data},base.trp.delZttrp)
  return fetch(params);
}

 //3投入品维护--删除新增申请
 export function trp_xzdelete(data) {
  var params = Object.assign({data:data},base.trp.delTrpSqb)
  return fetch(params);
}
 //3投入品维护--删除新增申请
 export function trp_xzlist(data) {
  var params = Object.assign({data:data},base.trp.pageTrpSqb)
  return fetch(params);
}


//2商铺维护-保存修改
export function trp_save(data) {
  var params = Object.assign({data:data},base.trp.saveNcpShop)
  return fetch(params);
}
//3商铺维护-停用启用
export function trp_delete(data) {
  var params = Object.assign({data:data},base.trp.deleNcpShopById)
  return fetch(params);
}
//4商铺维护-对客户名称进行新增或修改前的唯一性校核.
export function trp_exist(data) {
  var params = Object.assign({data:data},base.trp.checkNhIsExistQY)
  return fetch(params);
} 


//6.打印机维护页面

// 1保存打印机
export function dyj_save(data) {
  var params = Object.assign({data:data},base.dyj.saveDyjXx)
  return fetch(params);
}

//2获取打印机列表（page）
export function dyj_page(data) {
  var params = Object.assign({data:data},base.dyj.pageDyjXx)
  return fetch(params);
}

//3获取打印机列表（list)
export function dyj_list(data) {
  var params = Object.assign({data:data},base.dyj.listDyjXx)
  return fetch(params);
}

