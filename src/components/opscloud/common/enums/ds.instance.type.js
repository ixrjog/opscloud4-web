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
  GITLAB: 3,
  SONAR: 4,
  ANSIBLE: 5,
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
  PROMETHEUS: 8,
  GUACAMOLE: 9,
  NEXUS: 10,
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
  AWS: 51
})

export default DsInstanceType
