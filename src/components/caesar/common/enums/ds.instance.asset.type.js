const DsInstanceAssetType = Object.freeze({
  LDAP : {
    USER : 'USER',
    GROUP: 'GROUP'
  },
  GITLAB : {
    USER : 'USER',
    GITLAB_PROJECT: 'GITLAB_PROJECT',
    GITLAB_GROUP:'GITLAB_GROUP'
  },
  ALIYUN: {
    ECS: "ECS",
  }
})

export default DsInstanceAssetType
