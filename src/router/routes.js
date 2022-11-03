import playground from './modules/playground'
import plugins from './modules/plugins'
import components from './modules/components'

import sys from './modules/opscloud.sys'
import user from './modules/opscloud.user'
import report from './modules/opscloud.report'
import server from './modules/opscloud.server'
import rbac from './modules/opscloud.rbac'
import datasource from './modules/opscloud.datasource'
import workbench from './modules/opscloud.workbench'
import workorder from './modules/opscloud.workorder'
import application from './modules/opscloud.application'
import task from './modules/opscloud.task'
import docs from './modules/opscloud.docs'
import leo from './modules/opscloud.leo'

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
      // 系统配置
      ...sys,
      // 工作台
      ...workbench,
      // 工单
      ...workorder,
      // 报表
      ...report,
      // 用户
      ...user,
      // 服务器
      ...server,
      // Datasource 数据源
      ...datasource,
      // RBAC 基于角色的访问控制
      ...rbac,
      // 应用
      ...application,
      ...task,
      ...docs,
      // 发布模块
      ...leo
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
