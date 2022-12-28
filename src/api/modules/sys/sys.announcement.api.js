import { request } from '@/api/_service.js'

const baseUrl = '/sys/announcement'

export function GET_ANNOUNCEMENT (param) {
  return request({
    url: baseUrl + '/get',
    method: 'get',
    params: param
  })
}
