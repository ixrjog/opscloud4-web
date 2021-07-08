import DsInstanceAssetType from '@/components/opscloud/common/enums/ds.instance.asset.type.js'

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
    case DsInstanceAssetType.GITLAB.GITLAB_USER:
      return '用户'
    case DsInstanceAssetType.GITLAB.GITLAB_SSHKEY:
      return '密钥'
    case DsInstanceAssetType.ALIYUN.ECS:
      return 'ECS'
    case DsInstanceAssetType.ALIYUN.ECS_IMAGE:
      return '镜像'
    case DsInstanceAssetType.ALIYUN.VPC:
      return 'VPC'
    case DsInstanceAssetType.ALIYUN.ECS_SG:
      return '安全组'
    case DsInstanceAssetType.ALIYUN.V_SWITCH:
      return '交换机'
    case DsInstanceAssetType.ALIYUN.RAM_USER:
      return 'RAM用户'
    case DsInstanceAssetType.ALIYUN.RAM_POLICY:
      return 'RAM策略'
    case DsInstanceAssetType.ALIYUN.RAM_ACCESS_KEY:
      return 'RAM-AK'
    case DsInstanceAssetType.ZABBIX.ZABBIX_USER:
      return '用户'
    case DsInstanceAssetType.ZABBIX.ZABBIX_USER_GROUP:
      return '用户组'
    case DsInstanceAssetType.ZABBIX.ZABBIX_HOST:
      return '主机'
    case DsInstanceAssetType.ZABBIX.ZABBIX_HOST_GROUP:
      return '主机组'
    case DsInstanceAssetType.ZABBIX.ZABBIX_TEMPLATE:
      return '模板'
    case DsInstanceAssetType.ZABBIX.ZABBIX_TRIGGER:
      return '触发的问题'

    case DsInstanceAssetType.KUBERNETES.KUBERNETES_NAMESPACE:
      return '命名空间'
    case DsInstanceAssetType.KUBERNETES.KUBERNETES_POD:
      return '容器组'
    case DsInstanceAssetType.KUBERNETES.KUBERNETES_DEPLOYMENT:
      return '无状态'
    case DsInstanceAssetType.JENKINS.JENKINS_COMPUTER:
      return '计算节点'
    default:
      return value
  }
}
