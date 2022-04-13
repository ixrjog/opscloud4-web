export default [
  {
    path: '/docs/workorder/queue',
    name: 'docs-workorder-queue',
    component: () => import('@/pages/docs/workorder/queue'),
    meta: {
      auth: true,
      title: '文档-AWS消息队列'
    }
  },
  {
    path: '/docs/workorder/nexus',
    name: 'docs-workorder-nexus',
    component: () => import('@/pages/docs/workorder/nexus'),
    meta: {
      auth: true,
      title: '文档-Nexus构件仓库'
    }
  },
  {
    path: '/docs/workorder/nacos',
    name: 'docs-workorder-nacos',
    component: () => import('@/pages/docs/workorder/nacos'),
    meta: {
      auth: true,
      title: '文档-Nacos注册中心+配置中心'
    }
  },
  {
    path: '/docs/workorder/ram',
    name: 'docs-workorder-ram',
    component: () => import('@/pages/docs/workorder/ram'),
    meta: {
      auth: true,
      title: '文档-阿里云RAM'
    }
  }
]
