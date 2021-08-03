import { request } from '@/api/_service.js'

const baseUrl = '/datasource/instance/asset'

export function QUERY_ASSET_PAGE (data) {
  // 接口请求
  return request({
    url: baseUrl + '/page/query',
    method: 'post',
    data
  })
}

export function PULL_ASSET (data) {
  // 接口请求
  return request({
    url: baseUrl + '/pull',
    method: 'put',
    data
  })
}

export function DELETE_ASSET_BY_ID (id) {
  return request({
    url: baseUrl + '/del?id=' + id,
    method: 'delete'
  })
}

export function SET_CONFIG (data) {
  // 接口请求
  return request({
    url: baseUrl + '/set/config',
    method: 'put',
    data
  })
}

export function SCAN_ASSET_BUSINESS (data) {
  // 接口请求
  return request({
    url: baseUrl + '/business/scan',
    method: 'put',
    data
  })
}
