export default [
  {
    path: '/workbench/web-terminal',
    name: 'web-terminal',
    component: () => import('@/pages/workbench/web-terminal'),
    meta: {
      auth: true,
      title: '批量终端'
    }
  }
]
