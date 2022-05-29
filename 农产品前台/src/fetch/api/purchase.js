import fetch from '../axios/'
import { purchase } from '../port_uri/'

export function ncp_list(data) {
    var params = Object.assign({data:data},purchase.ncp.list)
    return fetch(params);
  }