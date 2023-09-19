export default [
  {
    path: '/workbench/web-terminal',
    name: 'web-terminal',
    component: () => import('@/pages/workbench/web-terminal'),
    meta: {
      auth: true,
      cache: true,
      title: 'Web-Terminal'
    }
  },
  {
    path: '/workbench/ssh-server',
    name: 'ssh-server',
    component: () => import('@/pages/workbench/ssh-server'),
    meta: {
      auth: true,
      cache: true,
      title: 'SSH-Server'
    }
  },
  {
    path: '/workbench/remote-desktop',
    name: 'remote-desktop',
    component: () => import('@/pages/workbench/remote-desktop'),
    meta: {
      auth: true,
      cache: true,
      title: 'Remote-Desktop'
    }
  },
  {
    path: '/workbench/kubernetes-web-terminal',
    name: 'kubernetes-web-terminal',
    component: () => import('@/pages/workbench/kubernetes-web-terminal'),
    meta: {
      auth: true,
      cache: true,
      title: 'Kubernetes-Terminal'
    }
  },
  {
    path: '/workbench/continuous-delivery',
    name: 'continuous-delivery',
    component: () => import('@/pages/workbench/continuous-delivery'),
    meta: {
      auth: true,
      cache: true,
      title: 'Continuous-Delivery'
    }
  },
  {
    path: '/workbench/ser-deploy',
    name: 'ser-deploy',
    component: () => import('@/pages/workbench/ser-deploy/index'),
    meta: {
      auth: true,
      cache: true,
      title: 'SerDeploy'
    }
  }
]
