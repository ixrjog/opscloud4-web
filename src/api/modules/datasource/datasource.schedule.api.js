import { request } from '@/api/_service.js'

const baseUrl = '/datasource/instance/schedule'

export function QUERY_DATASOURCE_INSTANCE_SCHEDULE_BY_ID (parameter) {
  // 接口请求
  return request({
    url: baseUrl + '/get',
    method: 'get',
    params: parameter
  })
}
