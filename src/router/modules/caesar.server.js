export default [
  {
    path: '/server',
    name: 'server',
    component: () => import('@/pages/server'),
    meta: {
      auth: true,
      title: '服务器'
    }
  },
  {
    path: '/server/group',
    name: 'server-group',
    component: () => import('@/pages/server/group'),
    meta: {
      auth: true,
      title: '服务器组'
    }
  }
]
