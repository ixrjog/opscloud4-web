import { request } from '@/api/_service.js'

const baseUrl = '/business/document'

export function ADD_BUSINESS_DOCUMENT (data) {
  return request({
    url: baseUrl + '/add',
    method: 'post',
    data
  })
}

export function UPDATE_BUSINESS_DOCUMENT (data) {
  return request({
    url: baseUrl + '/update',
    method: 'put',
    data
  })
}

export function DELETE_BUSINESS_DOCUMENT_BY_ID (id) {
  return request({
    url: baseUrl + '/del?id=' + id,
    method: 'delete'
  })
}
