import { request } from '@/api/_service.js'

const baseUrl = '/template/business'

export function QUERY_BUSINESS_TEMPLATE_PAGE (data) {
  return request({
    url: baseUrl + '/page/query',
    method: 'post',
    data
  })
}

export function ADD_BUSINESS_TEMPLATE (data) {
  return request({
    url: baseUrl + '/add',
    method: 'post',
    data
  })
}

export function UPDATE_BUSINESS_TEMPLATE (data) {
  return request({
    url: baseUrl + '/update',
    method: 'post',
    data
  })
}

export function CREATE_ASSET_BY_BUSINESS_TEMPLATE_ID (id) {
  return request({
    url: baseUrl + '/asset/create?id=' + id,
    method: 'put'
  })
}

export function DELETE_BUSINESS_TEMPLATE_BY_ID (id) {
  return request({
    url: baseUrl + '/del?id=' + id,
    method: 'delete'
  })
}

