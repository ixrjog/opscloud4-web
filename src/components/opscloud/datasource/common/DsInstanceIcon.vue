<template>
  <img :src="icon" :style="style">
</template>

<script>
import DsInstanceType from '@/components/opscloud/common/enums/ds.instance.type'

const iconUrl = {
  aliyun: require('@/static/icons/ds-aliyun.svg'),
  aws: require('@/static/icons/ds-aws.svg'),
  ldap: require('@/static/icons/ds-ldap.svg'),
  nacos: require('@/static/icons/ds-nacos.svg'),
  kubernetes: require('@/static/icons/ds-kubernetes.svg'),
  gitlab: require('@/static/icons/ds-gitlab.svg'),
  zabbix: require('@/static/icons/ds-zabbix.svg'),
  dingtalk: require('@/static/icons/ds-dingtalk.svg'),
  ansible: require('@/static/icons/ds-ansible.svg'),
  sonar: require('@/static/icons/ds-sonar.svg'),
  guacamole: require('@/static/icons/ds-guacamole.svg'),
  jenkins: require('@/static/icons/ds-jenkins.svg'),
  nexus: require('@/static/icons/ds-nexus.svg'),
  prometheus: require('@/static/icons/ds-prometheus.svg'),
  huaweiCloud: require('@/static/icons/ds-huaweiCloud.svg'),
  common: require('@/static/icons/ds-common.svg')
}

export default {
  data () {
    return {
      dsInstanceType: DsInstanceType,
      icon: '',
      style: ''
    }
  },
  name: 'DsInstanceIcon',
  props: {
    instanceType: {
      type: String,
      required: false,
      default: ''
    },
    isActive: {
      type: Boolean,
      required: true
    }
  },
  mounted () {
    this.initData()
  },
  methods: {
    initData () {
      switch (this.instanceType) {
        case DsInstanceType.ALIYUN.name:
          this.icon = iconUrl.aliyun
          this.style = 'width: 90px'
          break
        case DsInstanceType.AWS.name:
          this.icon = iconUrl.aws
          this.style = 'width: 90px'
          break
        case DsInstanceType.LDAP.name:
          this.icon = iconUrl.ldap
          this.style = 'width: 50px'
          break
        case DsInstanceType.NACOS.name:
          this.icon = iconUrl.nacos
          this.style = 'width: 90px'
          break
        case DsInstanceType.KUBERNETES.name:
          this.icon = iconUrl.kubernetes
          this.style = 'width: 90px'
          break
        case DsInstanceType.GITLAB.name:
          this.icon = iconUrl.gitlab
          this.style = 'width: 90px'
          break
        case DsInstanceType.ZABBIX.name:
          this.icon = iconUrl.zabbix
          this.style = 'width: 90px'
          break
        case DsInstanceType.DINGTALK_APP.name:
          this.icon = iconUrl.dingtalk
          this.style = 'width: 50px'
          break
        case DsInstanceType.ANSIBLE.name:
          this.icon = iconUrl.ansible
          this.style = 'width: 90px;'
          break
        case DsInstanceType.SONAR.name:
          this.icon = iconUrl.sonar
          this.style = 'width: 90px'
          break
        case DsInstanceType.GUACAMOLE.name:
          this.icon = iconUrl.guacamole
          this.style = 'width: 150px'
          break
        case DsInstanceType.JENKINS.name:
          this.icon = iconUrl.jenkins
          this.style = 'width: 90px'
          break
        case DsInstanceType.NEXUS.name:
          this.icon = iconUrl.nexus
          this.style = 'width: 90px'
          break
        case DsInstanceType.PROMETHEUS.name:
          this.icon = iconUrl.prometheus
          this.style = 'width: 150px'
          break
        case DsInstanceType.HUAWEICLOUD.name:
          this.icon = iconUrl.huaweiCloud
          this.style = 'width: 150px'
          break
        default:
          this.icon = iconUrl.common
          this.style = 'width: 50px'
      }
    }
  }
}
</script>

<style scoped>

</style>
