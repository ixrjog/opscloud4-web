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
  },
  {
    path: '/datasource/instance/gitlab',
    name: 'datasource-instance-gitlab',
    component: () => import('@/pages/datasource/instance/gitlab'),
    meta: {
      auth: true,
      title: 'Gitlab数据源实例'
    }
  },
  {
    path: '/datasource/instance/kubernetes',
    name: 'datasource-instance-kubernetes',
    component: () => import('@/pages/datasource/instance/kubernetes'),
    meta: {
      auth: true,
      title: 'Kubernetes数据源实例'
    }
  },
  {
    path: '/datasource/instance/zabbix',
    name: 'datasource-instance-zabbix',
    component: () => import('@/pages/datasource/instance/zabbix'),
    meta: {
      auth: true,
      title: 'Zabbix数据源实例'
    }
  }
]
