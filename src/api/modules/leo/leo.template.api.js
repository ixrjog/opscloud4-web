import { request } from '@/api/_service.js'

const baseUrl = '/leo/template'

export function QUERY_LEO_TEMPLATE_PAGE (data) {
  return request({
    url: baseUrl + '/page/query',
    method: 'post',
    data
  })
}


export function ADD_LEO_TEMPLATE (data) {
  return request({
    url: baseUrl + '/add',
    method: 'post',
    data
  })
}

export function UPDATE_LEO_TEMPLATE (data) {
  return request({
    url: baseUrl + '/update',
    method: 'put',
    data
  })
}
