import { request } from '@/api/_service.js'

const baseUrl = '/sys/doc'

export function PREVIEW_DOCUMENT (data) {
  return request({
    url: baseUrl + '/preview',
    method: 'post',
    data
  })
}


export function GET_DOCUMENT_ZONE (data) {
  return request({
    url: baseUrl + '/zone/get',
    method: 'post',
    data
  })
}
