import { request } from '@/api/_service.js'

const baseUrl = '/server/task'

export function QUERY_SERVER_TASK_PAGE (data) {
  return request({
    url: baseUrl + '/page/query',
    method: 'post',
    data
  })
}

export function SUBMIT_SERVER_TASK (data) {
  // 接口请求
  return request({
    url: baseUrl + '/submit',
    method: 'post',
    data
  })
}
