import { request } from '@/api/_service.js'

const baseUrl = '/datasource/instance/schedule'

export function QUERY_DATASOURCE_INSTANCE_SCHEDULE_BY_ID (parameter) {
  return request({
    url: baseUrl + '/get',
    method: 'get',
    params: parameter
  })
}

export function ADD_DATASOURCE_INSTANCE_SCHEDULE (data) {
  return request({
    url: baseUrl + '/add',
    method: 'post',
    data
  })
}

export function PAUSE_DATASOURCE_INSTANCE_SCHEDULE (data) {
  return request({
    url: baseUrl + '/pause',
    method: 'post',
    data
  })
}

export function RESUME_DATASOURCE_INSTANCE_SCHEDULE (data) {
  return request({
    url: baseUrl + '/resume',
    method: 'post',
    data
  })
}

export function DELETE_DATASOURCE_INSTANCE_SCHEDULE (data) {
  return request({
    url: baseUrl + '/delete',
    method: 'post',
    data
  })
}

export function DATASOURCE_INSTANCE_SCHEDULE_CRON_CHECK (data) {
  return request({
    url: baseUrl + '/cron/check',
    method: 'post',
    data
  })
}
