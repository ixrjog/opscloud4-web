export default [
  {
    path: '/report/terminal',
    name: 'terminal-report',
    component: () => import('@/pages/report/terminal'),
    meta: {
      auth: true,
      title: '终端报表'
    }
  },
  {
    path: '/report/workorder',
    name: 'workorder-report',
    component: () => import('@/pages/report/workorder'),
    meta: {
      auth: true,
      title: '工单报表'
    }
  },
  {
    path: '/report/workevent',
    name: 'report-workevent',
    component: () => import('@/pages/report/workevent'),
    meta: {
      auth: true,
      title: '工作事件'
    }
  },
  {
    path: '/report/platform/auth',
    name: 'report-platform-auth',
    component: () => import('@/pages/report/platform/auth'),
    meta: {
      auth: true,
      title: '平台认证'
    }
  },
  {
    path: '/report/leo',
    name: 'report-leo',
    component: () => import('@/pages/report/leo'),
    meta: {
      auth: true,
      title: 'Leo报表'
    }
  }
]
