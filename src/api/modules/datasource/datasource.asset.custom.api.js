import { request } from '@/api/_service.js'

const baseUrl = '/datasource/instance'

export function QUERY_APOLLO_RELEASE_ASSET_PAGE (data) {
  return request({
    url: baseUrl + '/apollo/release/asset/page/query',
    method: 'post',
    data
  })
}
