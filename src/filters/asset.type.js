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
    case DsInstanceAssetType.ALIYUN.RDS_INSTANCE:
      return 'RDS实例'
    case DsInstanceAssetType.ALIYUN.RDS_DATABASE:
      return 'RDS数据库'
    case DsInstanceAssetType.ALIYUN.ONS_ROCKETMQ_INSTANCE:
      return 'MQ实例'
    case DsInstanceAssetType.ALIYUN.ONS_ROCKETMQ_TOPIC:
      return 'MQ-TOPIC'
    case DsInstanceAssetType.ALIYUN.ONS_ROCKETMQ_GROUP:
      return 'MQ-GROUP'
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
    case DsInstanceAssetType.KUBERNETES.KUBERNETES_SERVICE:
      return '服务'
    case DsInstanceAssetType.JENKINS.JENKINS_COMPUTER:
      return '计算节点'
    // Ansible
    case DsInstanceAssetType.ANSIBLE.ANSIBLE_VERSION:
      return '版本'
    case DsInstanceAssetType.ANSIBLE.ANSIBLE_HOSTS:
      return '主机清单'
    case DsInstanceAssetType.TENCENT_EXMAIL.TENCENT_EXMAIL_USER:
      return '邮箱'
    case DsInstanceAssetType.SONAR.SONAR_PROJECT:
      return '项目'

    case DsInstanceAssetType.NACOS.NACOS_CLUSTER_NODE:
      return '集群节点'
    case DsInstanceAssetType.NACOS.NACOS_PERMISSION:
      return '权限'
    case DsInstanceAssetType.NACOS.NACOS_USER:
      return '用户'

    case DsInstanceAssetType.DINGTALK_APP.DINGTALK_DEPARTMENT:
      return '部门'
    case DsInstanceAssetType.DINGTALK_APP.DINGTALK_USER:
      return '通讯录用户'
    default:
      return value
  }
}
