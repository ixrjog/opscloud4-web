import { request } from '@/api/_service.js'

const baseUrl = '/server/task'


export function SUBMIT_SERVER_TASK (data) {
  // 接口请求
  return request({
    url: baseUrl + '/submit',
    method: 'post',
    data
  })
}
