import { request } from '@/api/_service.js'

const baseUrl = '/ser'

export function QUERY_SER_DEPLOY_TASK_PAGE (data) {
  return request({
    url: baseUrl + '/task/page/query',
    method: 'post',
    data
  })
}

export function GET_SER_DEPLOY_TASK_BY_UUID (data) {
  return request({
    url: baseUrl + '/task/uuid/query',
    method: 'post',
    data
  })
}

export function ADD_SER_DEPLOY_TASK (data) {
  return request({
    url: baseUrl + '/task/add',
    method: 'post',
    data
  })
}

export function UPDATE_SER_DEPLOY_TASK (data) {
  return request({
    url: baseUrl + '/task/update',
    method: 'put',
    data
  })
}

export function DELETE_SER_DEPLOY_TASK_ITEM (param) {
  return request({
    url: baseUrl + '/task/item/del',
    method: 'delete',
    params: param
  })
}
