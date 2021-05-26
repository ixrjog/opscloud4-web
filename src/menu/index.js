import { uniqueId } from 'lodash'

// 插件
import demoPlugins from './modules/demo-plugins'
// 组件
import demoComponents from './modules/demo-components'
// 功能
import demoPlayground from './modules/demo-playground'

/**
 * @description 给菜单数据补充上 path 字段
 * @description https://github.com/d2-projects/d2-admin/issues/209
 * @param {Array} menu 原始的菜单数据
 */
function supplementPath (menu) {
  return menu.map(e => ({
    ...e,
    path: e.path || uniqueId('d2-menu-empty-'),
    ...e.children ? {
      children: supplementPath(e.children)
    } : {}
  }))
}

// 菜单 侧边栏
export const menuAside = supplementPath([
  {
    path: '/sys',
    title: '系统管理',
    icon: 'cogs',
    children: [
      { path: '/sys/credential', title: '凭据配置', icon: 'key' },
      { path: '/sys/tag', title: '标签配置', icon: 'tag' },
      { path: '/sys/env', title: '环境配置', icon: 'sun-o' },
      { path: '/sys/guacamole', title: 'Guacamole', icon: 'terminal' }
    ]
  },
  {
    title: '服务器管理',
    icon: 'server',
    children: [
      { path: '/server', title: '服务器', icon: 'server' },
      { path: '/server/group', title: '服务器组', icon: 'window-restore' }
    ]
  },
  {
    path: '/datasource',
    title: '数据源管理',
    icon: 'superpowers',
    children: [
      { path: '/datasource/instance', title: '数据源实例', icon: 'th' },
      { path: '/datasource/config', title: '数据源配置', icon: 'modx' }
    ]
  },
  {
    path: '/auth',
    title: 'RBAC管理',
    icon: 'address-card',
    children: [
      { path: '/rbac/resource', title: '资源配置', icon: 'modx' },
      { path: '/rbac/role', title: '角色配置', icon: 'users' },
      { path: '/rbac/user-role', title: '用户角色配置', icon: 'id-card' }
    ]
  }
])

// 菜单 顶栏
export const menuHeader = supplementPath([
  {
    path: '/index',
    title: '首页',
    icon: 'home'
  },
  demoPlayground,
  demoComponents,
  demoPlugins
])
