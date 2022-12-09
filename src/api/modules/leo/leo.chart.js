import { request } from '@/api/_service.js'

const baseUrl = '/leo/chart'

export function GET_LEO_CHART_KEYWORDS () {
  return request({
    url: baseUrl + '/keywords/get',
    method: 'get'
  })
}
