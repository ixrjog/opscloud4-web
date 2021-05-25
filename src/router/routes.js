import playground from './modules/playground'
import plugins from './modules/plugins'
import components from './modules/components'

import layoutHeaderAside from '@/layout/header-aside'

// 由于懒加载页面太多的话会造成webpack热更新太慢，所以开发环境不使用懒加载，只有生产环境使用懒加载
const _import = require('@/libs/util.import.' + process.env.NODE_ENV)

/**
 * 在主框架内显示
 */
const frameIn = [
  {
    path: '/',
    redirect: { name: 'index' },
    component: layoutHeaderAside,
    children: [
      // 首页
      {
        path: 'index',
        name: 'index',
        meta: {
          title: '首页',
          auth: true
        },
        component: _import('system/index')
      },
      // 系统 前端日志
      {
        path: 'log',
        name: 'log',
        meta: {
          title: '前端日志',
          auth: true
        },
        component: _import('system/log')
      },
      // 刷新页面 必须保留
      {
        path: 'refresh',
        name: 'refresh',
        hidden: true,
        component: _import('system/function/refresh')
      },
      // 页面重定向 必须保留
      {
        path: 'redirect/:route*',
        name: 'redirect',
        hidden: true,
        component: _import('system/function/redirect')
      },
      // SysCredential
      {
        path: '/sys/credential',
        name: 'sys-credential',
        component: () => import('@/pages/sys/credential'),
        meta: {
          auth: true,
          title: '系统凭据配置'
        }
      },
      {
        path: '/sys/tag',
        name: 'sys/tag',
        component: () => import('@/pages/sys/tag'),
        meta: {
          auth: true,
          title: '标签配置'
        }
      },
      {
        path: '/sys/guacamole',
        name: 'sys/guacamole',
        component: () => import('@/pages/sys/guacamole'),
        meta: {
          auth: true,
          title: 'VNC/RDP'
        }
      },
      // Server
      // {
      //   path: '/server',
      //   name: 'server',
      //   component: () => import('@/pages/server'),
      //   meta: {
      //     auth: true,
      //     title: '服务器'
      //   }
      // },
      {
        path: '/server/group',
        name: 'server-group',
        component: () => import('@/pages/server/group'),
        meta: {
          auth: true,
          title: '服务器组'
        }
      },
      // Datasource 数据源
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
      // RBAC 基于角色的访问控制
      {
        path: '/rbac/role',
        name: 'rbac-role',
        component: () => import('@/pages/rbac/role'),
        meta: {
          auth: true,
          title: '角色管理'
        }
      },
      {
        path: '/rbac/resource',
        name: 'rbac-resource',
        component: () => import('@/pages/rbac/resource'),
        meta: {
          auth: true,
          title: '资源管理'
        }
      },
      {
        path: '/rbac/user-role',
        name: 'rbac-user-role',
        component: () => import('@/pages/rbac/user-role'),
        meta: {
          auth: true,
          title: '用户角色管理'
        }
      }
      // {
      //   path: '/rbac/resource',
      //   name: 'auth-resource',
      //   component: () => import('@/pages/auth/resource'),
      //   meta: {
      //     auth: true,
      //     title: '资源管理'
      //   }
      // },
      // {
      //   path: '/rbac/user/role',
      //   name: 'auth-user-role',
      //   component: () => import('@/pages/auth/user-role'),
      //   meta: {
      //     auth: true,
      //     title: '用户角色管理'
      //   }
      // }
    ]
  },
  playground,
  plugins,
  components
]

/**
 * 在主框架之外显示
 */
const frameOut = [
  // 登录
  {
    path: '/login',
    name: 'login',
    component: _import('system/login')
  }
]

/**
 * 错误页面
 */
const errorPage = [
  {
    path: '*',
    name: '404',
    component: _import('system/error/404')
  }
]

// 导出需要显示菜单的
export const frameInRoutes = frameIn

// 重新组织后导出
export default [
  ...frameIn,
  ...frameOut,
  ...errorPage
]
