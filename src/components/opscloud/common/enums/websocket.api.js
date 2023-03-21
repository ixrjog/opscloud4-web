/**
 * 不需要加 /api/
 * @type {Readonly<{KUBERNETES_DEPLOYMENT: string, CONTINUOUS_DELIVERY_DEPLOY: string, CONTINUOUS_DELIVERY_JENKINS_CONSOLE_STREAM: string, CONTINUOUS_DELIVERY_BUILD: string}>}
 */
const WebSocketAPI = Object.freeze({
  CONTINUOUS_DELIVERY_JENKINS_CONSOLE_STREAM: 'ws/continuous-delivery/jenkins/console/stream',
  CONTINUOUS_DELIVERY_BUILD: 'ws/continuous-delivery/build',
  CONTINUOUS_DELIVERY_DEPLOY: 'ws/continuous-delivery/deploy',
  KUBERNETES_DEPLOYMENT: 'ws/kubernetes/deployment'
})

export default WebSocketAPI
