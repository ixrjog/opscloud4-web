import { request } from '@/api/_service.js'

const baseUrl = '/datasource/config'

export function GET_DATASOURCE_CONFIG_TYPE_OPTIONS () {
  return request({
    url: baseUrl + '/type/options/get',
    method: 'get'
  })
}

export function QUERY_DATASOURCE_CONFIG_PAGE (data) {
  return request({
    url: baseUrl + '/page/query',
    method: 'post',
    data
  })
}

export function QUERY_DATASOURCE_BY_ID (param) {
  return request({
    url: baseUrl + '/id/query',
    method: 'get',
    params: param
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
