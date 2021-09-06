import { request } from '@/api/_service.js'

const baseUrl = '/instance'

export function QUERY_INSTANCE_PAGE (data) {
  // 接口请求
  return request({
    url: baseUrl + '/registered/page/query',
    method: 'post',
    data
  })
}


export function SET_INSTANCE_ACTIVE (param) {
  // 接口请求
  return request({
    url: baseUrl + '/registered/active/set',
    method: 'PUT',
    params: param
  })
}
