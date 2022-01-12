const DsInstanceType = Object.freeze({
  LDAP: {
    type: 1,
    name: 'LDAP',
    instanceType: [
      {
        value: 'LDAP',
        label: 'LDAP'
      }
    ]
  },
  JENKINS: {
    type: 2,
    name: 'JENKINS',
    instanceType: [
      {
        value: 'JENKINS',
        label: 'JENKINS'
      }
    ]
  },
  GITLAB: {
    type: 3,
    name: 'GITLAB',
    instanceType: [
      {
        value: 'GITLAB',
        label: 'GITLAB'
      }
    ]
  },
  SONAR: {
    type: 4,
    name: 'SONAR',
    instanceType: [
      {
        value: 'SONAR',
        label: 'SONAR'
      }
    ]
  },
  ANSIBLE: {
    type: 5,
    name: 'ANSIBLE',
    instanceType: [
      {
        value: 'ANSIBLE',
        label: 'ANSIBLE'
      }
    ]
  },
  KUBERNETES: {
    type: 6,
    name: 'KUBERNETES',
    instanceType: [
      {
        value: 'KUBERNETES',
        label: 'KUBERNETES'
      }
    ]
  },
  ZABBIX: {
    type: 7,
    name: 'ZABBIX',
    instanceType: [
      {
        value: 'ZABBIX',
        label: 'ZABBIX'
      }
    ]
  },
  PROMETHEUS: {
    type: 8,
    name: 'PROMETHEUS',
    instanceType: []
  },
  GUACAMOLE: {
    type: 9,
    name: 'GUACAMOLE',
    instanceType: [
      {
        value: 'GUACAMOLE',
        label: 'GUACAMOLE'
      }
    ]
  },
  NEXUS: {
    type: 10,
    name: 'NEXUS',
    instanceType: [
      {
        value: 'NEXUS',
        label: 'NEXUS'
      }
    ]
  },
  TENCENT_EXMAIL: {
    type: 11,
    name: 'TENCENT_EXMAIL',
    instanceType: [
      {
        value: 'TENCENT_EXMAIL',
        label: 'TENCENT_EXMAIL'
      }
    ]
  },
  NACOS: {
    type: 12,
    name: 'NACOS',
    instanceType: [
      {
        value: 'NACOS',
        label: 'NACOS'
      }
    ]
  },
  DINGTALK_APP: {
    type: 14,
    name: 'DINGTALK_APP',
    instanceType: [
      {
        value: 'DINGTALK_APP',
        label: 'DINGTALK_APP'
      }
    ]
  },
  ALIYUN: {
    type: 50,
    name: 'ALIYUN',
    instanceType: [
      {
        value: 'ALIYUN',
        label: 'ALIYUN'
      },
      {
        value: 'ECS',
        label: 'ECS'
      },
      {
        value: 'OSS',
        label: 'OSS'
      },
      {
        value: 'SLS',
        label: 'SLS'
      }
    ]
  },
  AWS: {
    type: 51,
    name: 'AWS',
    instanceType: [
      {
        value: 'EC2',
        label: 'EC2'
      }
    ]
  }
})

export default DsInstanceType
