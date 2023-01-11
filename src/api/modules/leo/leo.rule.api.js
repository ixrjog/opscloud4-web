import { request } from '@/api/_service.js'

const baseUrl = '/leo/rule'

export function QUERY_LEO_RULE_PAGE (data) {
  return request({
    url: baseUrl + '/page/query',
    method: 'post',
    data
  })
}

export function ADD_LEO_RULE (data) {
  return request({
    url: baseUrl + '/add',
    method: 'post',
    data
  })
}

export function UPDATE_LEO_RULE (data) {
  return request({
    url: baseUrl + '/update',
    method: 'put',
    data
  })
}

export function DELETE_LEO_RULE_BY_ID (param) {
  return request({
    url: baseUrl + '/del',
    method: 'delete',
    params: param
  })
}
