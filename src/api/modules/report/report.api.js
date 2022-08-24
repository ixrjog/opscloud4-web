import { request } from '@/api/_service.js'

const baseUrl = '/report'

export function GET_TERMINAL_REPORT () {
  return request({
    url: baseUrl + '/terminal/get',
    method: 'get'
  })
}

export function GET_WORK_EVENT_WEEKLY_REPORT (param) {
  return request({
    url: baseUrl + '/workevent/weekly/get',
    method: 'get',
    params: param
  })
}

export function GET_WORK_EVENT_ITEM_REPORT (param) {
  return request({
    url: baseUrl + '/workevent/item',
    method: 'get',
    params: param
  })
}
