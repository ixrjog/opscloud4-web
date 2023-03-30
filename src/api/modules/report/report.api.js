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

export function GET_WORK_EVENT_TIME_REPORT (param) {
  return request({
    url: baseUrl + '/workevent/timeliness',
    method: 'get',
    params: param
  })
}

export function GET_WORK_EVENT_INTERCEPT_REPORT (param) {
  return request({
    url: baseUrl + '/workevent/intercept',
    method: 'get',
    params: param
  })
}

export function GET_WORK_EVENT_SOLVE_REPORT (param) {
  return request({
    url: baseUrl + '/workevent/solve',
    method: 'get',
    params: param
  })
}

export function GET_WORK_EVENT_FAULT_REPORT (param) {
  return request({
    url: baseUrl + '/workevent/fault',
    method: 'get',
    params: param
  })
}

export function GET_LEO_REPORT () {
  return request({
    url: baseUrl + '/leo/get',
    method: 'get'
  })
}

export function GET_LATEST_LEO_BUILD (param) {
  return request({
    url: '/leo/latest/build/get',
    method: 'get',
    params: param
  })
}

export function GET_LATEST_LEO_DEPLOY (param) {
  return request({
    url: '/leo/latest/deploy/get',
    method: 'get',
    params: param
  })
}
