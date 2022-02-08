const WorkOrderStatus = Object.freeze({
  NORMAL: {
    type: 0,
    desc: '正常',
    color: 'success'
  },
  DEVELOPING: {
    type: 1,
    desc: '开发中',
    color: 'warning'
  },
  SYS: {
    type: 2,
    desc: '系统工单',
    color: 'primary'
  },
  INACTIVE: {
    type: 3,
    desc: '停用',
    color: 'danger'
  }
})

export default WorkOrderStatus
