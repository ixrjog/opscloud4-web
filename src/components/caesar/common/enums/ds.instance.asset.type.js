const DsInstanceAssetType = Object.freeze({
  LDAP: {
    USER: 'USER',
    GROUP: 'GROUP'
  },
  GITLAB: {
    USER: 'USER',
    GITLAB_PROJECT: 'GITLAB_PROJECT',
    GITLAB_GROUP: 'GITLAB_GROUP'
  },
  ALIYUN: {
    ECS: 'ECS',
    VPC: 'VPC',
    V_SWITCH: 'V_SWITCH',
    ECS_IMAGE: 'ECS_IMAGE',
    ECS_SG: 'ECS_SG'
  }
})

export default DsInstanceAssetType
