export default [
  {
    path: '/report/terminal',
    name: 'terminal-report',
    component: () => import('@/pages/report/terminal'),
    meta: {
      auth: true,
      title: '终端报表'
    }
  }
]
