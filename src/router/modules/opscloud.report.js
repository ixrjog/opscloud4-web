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
    path: '/report/workevent',
    name: 'report-workevent',
    component: () => import('@/pages/report/workevent'),
    meta: {
      auth: true,
      title: '工作事件'
    }
  }
]
