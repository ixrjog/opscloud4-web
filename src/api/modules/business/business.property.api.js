import { request } from '@/api/_service.js'

const baseUrl = '/business/property'

export function ADD_BUSINESS_PROPERTY (data) {
  return request({
    url: baseUrl + '/add',
    method: 'post',
    data
  })
}

export function UPDATE_BUSINESS_PROPERTY (data) {
  return request({
    url: baseUrl + '/update',
    method: 'put',
    data
  })
}

export function DELETE_BUSINESS_PROPERTY_BY_ID (id) {
  return request({
    url: baseUrl + '/del?id=' + id,
    method: 'delete'
  })
}
