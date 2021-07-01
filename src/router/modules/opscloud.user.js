export default [
  {
    path: '/user',
    name: 'user',
    component: () => import('@/pages/user'),
    meta: {
      auth: true,
      title: '用户配置'
    }
  },
  {
    path: '/user/details',
    name: 'user-details',
    component: () => import('@/pages/user/details'),
    meta: {
      auth: true,
      title: '用户详情'
    }
  }
]
