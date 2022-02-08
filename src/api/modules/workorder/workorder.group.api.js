import { request } from '@/api/_service.js'

const baseUrl = '/workorder/group'

export function QUERY_WORK_ORDER_GROUP_PAGE (data) {
  return request({
    url: baseUrl + '/page/query',
    method: 'post',
    data
  })
}

export function SAVE_WORK_ORDER_GROUP (data) {
  return request({
    url: baseUrl + '/save',
    method: 'post',
    data
  })
}

export function DELETE_WORK_ORDER_GROUP (param) {
  return request({
    url: baseUrl + '/del',
    method: 'delete',
    params: param
  })
}
