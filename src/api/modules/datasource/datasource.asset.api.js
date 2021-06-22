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
