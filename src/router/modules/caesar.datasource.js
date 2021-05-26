export default [
  {
    path: '/datasource/config',
    name: 'datasource-config',
    component: () => import('@/pages/datasource/config'),
    meta: {
      auth: true,
      title: '数据源配置'
    }
  },
  {
    path: '/datasource/instance',
    name: 'datasource-instance',
    component: () => import('@/pages/datasource/instance'),
    meta: {
      auth: true,
      title: '数据源实例'
    }
  }
]
