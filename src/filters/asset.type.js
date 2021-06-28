import DsInstanceAssetType from '@/components/caesar/common/enums/ds.instance.asset.type.js'

export function getAssetTypeText (value) {
  switch (value) {
    case DsInstanceAssetType.LDAP.GROUP:
      return '用户组'
    case DsInstanceAssetType.LDAP.USER:
      return '用户'
    case DsInstanceAssetType.GITLAB.GITLAB_GROUP:
      return '群组'
    case DsInstanceAssetType.GITLAB.GITLAB_PROJECT:
      return '项目'
    case DsInstanceAssetType.GITLAB.USER:
      return '用户'
    case DsInstanceAssetType.ALIYUN.ECS:
      return 'Ecs'
    case DsInstanceAssetType.ALIYUN.ECS_IMAGE:
      return '镜像'
    case DsInstanceAssetType.ALIYUN.VPC:
      return 'Vpc'
    case DsInstanceAssetType.ALIYUN.ECS_SG:
      return '安全组'
    case DsInstanceAssetType.ALIYUN.V_SWITCH:
      return '交换机'
    case DsInstanceAssetType.ZABBIX.ZABBIX_USER:
      return '用户'
    case DsInstanceAssetType.ZABBIX.ZABBIX_USER_GROUP:
      return '用户组'
    default:
      return value
  }
}
