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
  },
  {
    path: '/datasource/instance/ldap',
    name: 'datasource-instance-ldap',
    component: () => import('@/pages/datasource/instance/ldap'),
    meta: {
      auth: true,
      title: 'LDAP数据源实例'
    }
  },
  {
    path: '/datasource/instance/aliyun',
    name: 'datasource-instance-aliyun',
    component: () => import('@/pages/datasource/instance/aliyun'),
    meta: {
      auth: true,
      title: 'Aliyun数据源实例'
    }
  }
]
