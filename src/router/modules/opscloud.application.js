export default [
  {
    path: '/application',
    name: 'application',
    component: () => import('@/pages/application'),
    meta: {
      auth: true,
      title: '应用管理'
    }
  }
]
