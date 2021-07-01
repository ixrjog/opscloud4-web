export default [
  {
    path: '/rbac/role',
    name: 'rbac-role',
    component: () => import('@/pages/rbac/role'),
    meta: {
      auth: true,
      title: '角色管理'
    }
  },
  {
    path: '/rbac/resource',
    name: 'rbac-resource',
    component: () => import('@/pages/rbac/resource'),
    meta: {
      auth: true,
      title: '资源管理'
    }
  },
  {
    path: '/rbac/user-role',
    name: 'rbac-user-role',
    component: () => import('@/pages/rbac/user-role'),
    meta: {
      auth: true,
      title: '用户角色管理'
    }
  }
]
