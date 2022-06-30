import { request } from '@/api/_service.js'

const baseUrl = '/sys/nav'

export function LIST_NAV () {
  return request({
    url: baseUrl + '/list',
    method: 'get'
  })
}
