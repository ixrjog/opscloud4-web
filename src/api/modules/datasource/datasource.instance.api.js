import { request } from '@/api/_service.js'

const baseUrl = '/datasource/instance'

export function QUERY_DATASOURCE_INSTANCE (data) {
  // 接口请求
  return request({
    url: baseUrl + '/query',
    method: 'post',
    data
  })
}

export function REGISTER_DATASOURCE_INSTANCE (data) {
  // 接口请求
  return request({
    url: baseUrl + '/register',
    method: 'post',
    data
  })
}
