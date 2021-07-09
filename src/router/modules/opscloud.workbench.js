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
  },
  {
    path: '/workbench/remote-desktop',
    name: 'remote-desktop',
    component: () => import('@/pages/workbench/remote-desktop'),
    meta: {
      auth: true,
      title: '远程桌面'
    }
  }
]
