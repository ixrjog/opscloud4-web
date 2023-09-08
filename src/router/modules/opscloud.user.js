export default [
  {
    path: '/user',
    name: 'user',
    component: () => import('@/pages/user'),
    meta: {
      auth: true,
      title: '用户管理'
    }
  },
  {
    path: '/user/group',
    name: 'user-group',
    component: () => import('@/pages/user/group'),
    meta: {
      auth: true,
      title: '用户组管理'
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
    path: '/user/mfa/iam',
    name: 'user-mfa-iam',
    component: () => import('@/pages/user/mfa/iam'),
    meta: {
      auth: true,
      title: 'IAM MFA'
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
