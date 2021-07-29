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
    path: '/sys/menu',
    name: 'sys/menu',
    component: () => import('@/pages/sys/menu'),
    meta: {
      auth: true,
      title: '菜单管理'
    }
  },
  {
    path: '/sys/audit',
    name: 'sys/audit',
    component: () => import('@/pages/sys/audit'),
    meta: {
      auth: true,
      title: '审计管理'
    }
  },
  {
    path: '/sys/audit/terminal/play',
    name: 'sys/audit/terminal/play',
    component: () => import('@/pages/sys/audit/terminal/play'),
    meta: {
      auth: true,
      title: '终端会话播放'
    }
  }
]