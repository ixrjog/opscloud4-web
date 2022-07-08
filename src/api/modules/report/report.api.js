import { request } from '@/api/_service.js'

const baseUrl = '/report'

export function GET_TERMINAL_REPORT () {
  return request({
    url: baseUrl + '/terminal/get',
    method: 'get'
  })
}
