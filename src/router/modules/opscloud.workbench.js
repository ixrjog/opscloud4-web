export default [
  {
    path: '/workbench/web-terminal',
    name: 'web-terminal',
    component: () => import('@/pages/workbench/web-terminal'),
    meta: {
      auth: true,
      cache: true,
      title: 'WebTerminal'
    }
  },
  {
    path: '/workbench/ssh-server',
    name: 'ssh-server',
    component: () => import('@/pages/workbench/ssh-server'),
    meta: {
      auth: true,
      cache: true,
      title: 'SSH服务器'
    }
  },
  {
    path: '/workbench/remote-desktop',
    name: 'remote-desktop',
    component: () => import('@/pages/workbench/remote-desktop'),
    meta: {
      auth: true,
      cache: true,
      title: '远程桌面'
    }
  },
  {
    path: '/workbench/kubernetes-web-terminal',
    name: 'kubernetes-web-terminal',
    component: () => import('@/pages/workbench/kubernetes-web-terminal'),
    meta: {
      auth: true,
      cache: true,
      title: '容器终端'
    }
  },
  {
    path: '/workbench/continuous-delivery',
    name: 'continuous-delivery',
    component: () => import('@/pages/workbench/continuous-delivery'),
    meta: {
      auth: true,
      cache: true,
      title: '持续交付'
    }
  }
]
