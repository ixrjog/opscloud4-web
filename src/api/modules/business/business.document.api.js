import { request } from '@/api/_service.js'

const baseUrl = '/business/document'

export function SAVE_BUSINESS_DOCUMENT (data) {
  return request({
    url: baseUrl + '/save',
    method: 'post',
    data
  })
}

export function GET_BUSINESS_DOCUMENT_BY_UNIQUE_KEY (param) {
  return request({
    url: baseUrl + '/unique/get',
    method: 'get',
    params: param
  })
}

export function DELETE_BUSINESS_DOCUMENT_BY_ID (id) {
  return request({
    url: baseUrl + '/del?id=' + id,
    method: 'delete'
  })
}
