import { request } from '@/api/_service.js'

const baseUrl = '/log/platform'

export function GET_PLATFORM_OPTIONS () {
  return request({
    url: baseUrl + '/options/get',
    method: 'get'
  })
}


export function QUERY_AUTH_PLATFORM_LOG_PAGE (data) {
  return request({
    url: baseUrl + '/auth/log/page/query',
    method: 'post',
    data
  })
}
