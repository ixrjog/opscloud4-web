export default [
  {
    path: '/sys/credential',
    name: 'sys-credential',
    component: () => import('@/pages/sys/credential'),
    meta: {
      auth: true,
      title: '系统凭据配置'
    }
  },
  {
    path: '/sys/tag',
    name: 'sys/tag',
    component: () => import('@/pages/sys/tag'),
    meta: {
      auth: true,
      title: '标签配置'
    }
  },
  {
    path: '/sys/env',
    name: 'sys/env',
    component: () => import('@/pages/sys/env'),
    meta: {
      auth: true,
      title: '环境配置'
    }
  },
  {
    path: '/sys/guacamole',
    name: 'sys/guacamole',
    component: () => import('@/pages/sys/guacamole'),
    meta: {
      auth: true,
      title: 'VNC/RDP'
    }
  },
  {
    path: '/sys/menu',
    name: 'sys/menu',
    component: () => import('@/pages/sys/menu'),
    meta: {
      auth: true,
      title: '菜单管理'
    }
  }
]
