const DsInstanceType = Object.freeze({
  LDAP: {
    type: 1,
    name: 'LDAP',
    instanceType: [
      {
        value: 'LDAP',
        label: 'LDAP'
      },
    ]
  },
  JENKINS: { type: 2, name: 'JENKINS' },
  GITLAB: 3,
  SONAR: 4,
  ANSIBLE: 5,
  ZABBIX: 7,
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
