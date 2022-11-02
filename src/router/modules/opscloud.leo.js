export default [
  {
    path: '/leo/template',
    name: 'leoTemplate',
    component: () => import('@/pages/leo/template'),
    meta: {
      auth: true,
      cache: true,
      title: 'Leo模板'
    }
  }
]
