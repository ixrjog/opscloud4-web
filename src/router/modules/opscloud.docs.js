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
  }
]
