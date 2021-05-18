import { request } from '@/api/_service.js'

const baseUrl = '/datasource/config'

export function QUERY_DATASOURCE_CONFIG_PAGE (data) {
  // 接口请求
  return request({
    url: baseUrl + '/page/query',
    method: 'post',
    data
  })
}

export function ADD_DATASOURCE_CONFIG (data) {
  return request({
    url: baseUrl + '/add',
    method: 'post',
    data
  })
}

export function UPDATE_DATASOURCE_CONFIG (data) {
  return request({
    url: baseUrl + '/update',
    method: 'put',
    data
  })
}
