import { request } from '@/api/_service.js'

const baseUrl = '/datasource/instance/asset/subscription'

export function QUERY_ASSET_SUBSCRIPTION_PAGE (data) {
  // 接口请求
  return request({
    url: baseUrl + '/page/query',
    method: 'post',
    data
  })
}

export function ADD_ASSET_SUBSCRIPTION (data) {
  // 接口请求
  return request({
    url: baseUrl + '/add',
    method: 'post',
    data
  })
}

export function UPDATE_ASSET_SUBSCRIPTION (data) {
  // 接口请求
  return request({
    url: baseUrl + '/update',
    method: 'put',
    data
  })
}

export function PUBLISH_ASSET_SUBSCRIPTION_BY_ID (id) {
  // 接口请求
  return request({
    url: baseUrl + '/publish?id=' + id,
    method: 'put'
  })
}

export function DELETE_ASSET_SUBSCRIPTION_BY_ID (id) {
  return request({
    url: baseUrl + '/del?id=' + id,
    method: 'delete'
  })
}
