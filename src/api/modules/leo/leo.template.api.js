import { request } from '@/api/_service.js'

const baseUrl = '/leo/template'

export function QUERY_LEO_TEMPLATE_PAGE (data) {
  return request({
    url: baseUrl + '/page/query',
    method: 'post',
    data
  })
}
