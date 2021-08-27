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
