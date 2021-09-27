export default [
  {
    path: '/task/playbook',
    name: 'task/playbook',
    component: () => import('@/pages/task/playbook'),
    meta: {
      auth: true,
      title: '剧本任务'
    }
  },
  {
    path: '/task/playbook/play',
    name: 'task/playbook/play',
    component: () => import('@/pages/task/playbook/play'),
    meta: {
      auth: true,
      title: '播放剧本任务'
    }
  }
]
