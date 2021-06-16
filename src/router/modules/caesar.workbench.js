export default [
  {
    path: '/workbench/web-terminal',
    name: 'web-terminal',
    component: () => import('@/pages/workbench/web-terminal'),
    meta: {
      auth: true,
      title: '批量终端'
    }
  },
  {
    path: '/workbench/ssh-server',
    name: 'ssh-server',
    component: () => import('@/pages/workbench/ssh-server'),
    meta: {
      auth: true,
      title: 'SSH服务器'
    }
  }
]
