import { request } from '@/api/_service.js'

const baseUrl = '/leo/pipeline'

export function  GET_PIPELINE_RUN_NODE_STEP_LOG (data) {
  return request({
    url: baseUrl + '/node/step/log/get',
    method: 'post',
    data
  })
}

export function GET_PIPELINE_RUN_NODE_STEPS (data) {
  return request({
    url: baseUrl + '/node/steps/get',
    method: 'post',
    data
  })

}
