export default [
  {
    path: '/user',
    name: 'user',
    component: () => import('@/pages/user'),
    meta: {
      auth: true,
      title: '用户配置'
    }
  }
]
