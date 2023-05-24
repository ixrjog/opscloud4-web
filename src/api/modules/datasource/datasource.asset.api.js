import { request } from '@/api/_service.js'

const baseUrl = '/datasource/instance/asset'

export function QUERY_ASSET_PAGE (data) {
  return request({
    url: baseUrl + '/page/query',
    method: 'post',
    data
  })
}

export function PULL_ASSET (data) {
  return request({
    url: baseUrl + '/pull',
    method: 'put',
    data
  })
}

export function PUSH_ASSET (data) {
  return request({
    url: baseUrl + '/push',
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
  return request({
    url: baseUrl + '/set/config',
    method: 'put',
    data
  })
}

export function SCAN_ASSET_BUSINESS (data) {
  return request({
    url: baseUrl + '/business/scan',
    method: 'put',
    data
  })
}

export function SET_ASSET_ACTIVE (data) {
  return request({
    url: baseUrl + '/active/set',
    method: 'put',
    params: data
  })
}

export function DELETE_ASSET_BY_TYPE (param) {
  return request({
    url: baseUrl + '/type/del',
    method: 'delete',
    params: param
  })
}
