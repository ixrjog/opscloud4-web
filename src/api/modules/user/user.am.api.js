import { request } from '@/api/_service.js'

const baseUrl = '/user/am'

export function GET_AM (param) {
  return request({
    url: baseUrl + '/get',
    method: 'get',
    params: param
  })
}
