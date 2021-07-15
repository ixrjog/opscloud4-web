import { request } from '@/api/_service.js'

const baseUrl = '/application'

export function QUERY_APPLICATION_KUBERNETES_PAGE (data) {
  return request({
    url: baseUrl + '/kubernetes/page/query',
    method: 'post',
    data
  })
}
