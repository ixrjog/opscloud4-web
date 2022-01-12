export default [
  {
    path: '/workorder/',
    name: 'workorder',
    component: () => import('@/pages/workorder'),
    meta: {
      auth: true,
      title: '我的工单'
    }
  }
]
