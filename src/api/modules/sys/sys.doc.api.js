import { request } from '@/api/_service.js'

const baseUrl = '/sys/doc'

export function PREVIEW_DOCUMENT (data) {
  return request({
    url: baseUrl + '/preview',
    method: 'post',
    data
  })
}
