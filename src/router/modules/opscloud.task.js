export default [
  {
    path: '/task/playbook',
    name: 'task-playbook',
    component: () => import('@/pages/task/playbook'),
    meta: {
      auth: true,
      title: '剧本任务'
    }
  }
]
