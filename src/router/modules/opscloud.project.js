export default [
  {
    path: '/project',
    name: 'project',
    component: () => import('@/pages/project'),
    meta: {
      auth: true,
      title: '项目管理'
    }
  }
]
