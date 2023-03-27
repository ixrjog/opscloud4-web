import { request } from '@/api/_service.js'

const baseUrl = '/template/message'

export function QUERY_MESSAGE_TEMPLATE_PAGE (data) {
  return request({
    url: baseUrl + '/page/query',
    method: 'post',
    data
  })
}

export function UPDATE_MESSAGE_TEMPLATE (data) {
  return request({
    url: baseUrl + '/update',
    method: 'put',
    data
  })
}
