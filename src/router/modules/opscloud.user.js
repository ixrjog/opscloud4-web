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
  },
  {
    path: '/user/mfa',
    name: 'user-mfa',
    component: () => import('@/pages/user/mfa'),
    meta: {
      auth: true,
      title: 'MFA'
    }
  },
  {
    path: '/user/inactive',
    name: 'user-inactive',
    component: () => import('@/pages/user/inactive'),
    meta: {
      auth: true,
      title: '无效用户配置'
    }
  },
  {
    path: '/user/info',
    name: 'user-info',
    component: () => import('@/pages/user/info'),
    meta: {
      auth: true,
      title: '用户详情'
    }
  }
]
