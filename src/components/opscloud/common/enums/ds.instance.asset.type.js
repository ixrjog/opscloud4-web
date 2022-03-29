const DsInstanceAssetType = Object.freeze({
  LDAP: {
    USER: 'USER',
    GROUP: 'GROUP'
  },
  GITLAB: {
    GITLAB_USER: 'GITLAB_USER',
    GITLAB_SSHKEY: 'GITLAB_SSHKEY',
    GITLAB_PROJECT: 'GITLAB_PROJECT',
    GITLAB_GROUP: 'GITLAB_GROUP'
  },
  ALIYUN: {
    ECS: 'ECS',
    VPC: 'VPC',
    V_SWITCH: 'V_SWITCH',
    ECS_IMAGE: 'ECS_IMAGE',
    ECS_SG: 'ECS_SG',
    RAM_USER: 'RAM_USER',
    RAM_POLICY: 'RAM_POLICY',
    RAM_ACCESS_KEY: 'RAM_ACCESS_KEY',
    RDS_INSTANCE: 'RDS_INSTANCE',
    RDS_DATABASE: 'RDS_DATABASE',
    REDIS_INSTANCE: 'REDIS_INSTANCE',
    DMS_USER: 'DMS_USER',
    ONS_ROCKETMQ_INSTANCE: 'ONS_ROCKETMQ_INSTANCE',
    ONS_ROCKETMQ_TOPIC: 'ONS_ROCKETMQ_TOPIC',
    ONS_ROCKETMQ_GROUP: 'ONS_ROCKETMQ_GROUP'
  },
  AWS: {
    EC2: 'EC2',
    IAM_POLICY: 'IAM_POLICY',
    IAM_USER: 'IAM_USER',
    IAM_ACCESS_KEY: 'IAM_ACCESS_KEY',
    SQS: 'SQS',
    SNS_TOPIC: 'SNS_TOPIC',
    SNS_SUBSCRIPTION: 'SNS_SUBSCRIPTION'
  },
  KUBERNETES: {
    KUBERNETES_NODE: 'KUBERNETES_NODE',
    KUBERNETES_NAMESPACE: 'KUBERNETES_NAMESPACE',
    KUBERNETES_DEPLOYMENT: 'KUBERNETES_DEPLOYMENT',
    KUBERNETES_SERVICE: 'KUBERNETES_SERVICE',
    KUBERNETES_POD: 'KUBERNETES_POD'
  },
  ANSIBLE: {
    ANSIBLE_VERSION: 'ANSIBLE_VERSION',
    ANSIBLE_HOSTS: 'ANSIBLE_HOSTS'
  },
  ZABBIX: {
    ZABBIX_USER: 'ZABBIX_USER',
    ZABBIX_USER_GROUP: 'ZABBIX_USER_GROUP',
    ZABBIX_HOST: 'ZABBIX_HOST',
    ZABBIX_HOST_GROUP: 'ZABBIX_HOST_GROUP',
    ZABBIX_TEMPLATE: 'ZABBIX_TEMPLATE',
    ZABBIX_TRIGGER: 'ZABBIX_TRIGGER'
  },
  JENKINS: {
    JENKINS_COMPUTER: 'JENKINS_COMPUTER'
  },
  GUACAMOLE: {
    GUACAMOLE: 'GUACAMOLE'
  },
  TENCENT_EXMAIL: {
    TENCENT_EXMAIL_USER: 'TENCENT_EXMAIL_USER'
  },
  NEXUS: {
    NEXUS_ASSET: 'NEXUS_ASSET'
  },
  SONAR: {
    SONAR_PROJECT: 'SONAR_PROJECT'
  },
  NACOS: {
    NACOS_CLUSTER_NODE: 'NACOS_CLUSTER_NODE',
    NACOS_PERMISSION: 'NACOS_PERMISSION',
    NACOS_USER: 'NACOS_USER',
    NACOS_ROLE: 'NACOS_ROLE'
  },
  DINGTALK_APP: {
    DINGTALK_USER: 'DINGTALK_USER',
    DINGTALK_DEPARTMENT: 'DINGTALK_DEPARTMENT'
  }
})

export default DsInstanceAssetType
