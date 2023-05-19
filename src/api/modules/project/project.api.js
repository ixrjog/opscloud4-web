import { request } from '@/api/_service.js'

const baseUrl = '/project'

export function QUERY_PROJECT_PAGE (data) {
  return request({
    url: baseUrl + '/page/query',
    method: 'post',
    data
  })
}
export function QUERY_RES_PROJECT_PAGE (data) {
  return request({
    url: baseUrl + '/res/page/query',
    method: 'post',
    data
  })
}
