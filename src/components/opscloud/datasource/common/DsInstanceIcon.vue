<!--suppress HtmlUnknownTag -->
<template>
  <div class="img">
    <img :src="icon" alt=""/>
  </div>
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
  consul: require('@/static/icons/ds-consul.svg'),
  common: require('@/static/icons/ds-common.svg'),
  aliyunDevops: require('@/static/icons/ds-aliyunDevops.svg'),
  meterSphere: require('@/static/icons/ds-metersphere.svg'),
  apollo: require('@/static/icons/ds-apollo.svg')
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
          break
        case DsInstanceType.AWS.name:
          this.icon = iconUrl.aws
          break
        case DsInstanceType.LDAP.name:
          this.icon = iconUrl.ldap
          break
        case DsInstanceType.NACOS.name:
          this.icon = iconUrl.nacos
          break
        case DsInstanceType.KUBERNETES.name:
          this.icon = iconUrl.kubernetes
          break
        case DsInstanceType.GITLAB.name:
          this.icon = iconUrl.gitlab
          break
        case DsInstanceType.ZABBIX.name:
          this.icon = iconUrl.zabbix
          break
        case DsInstanceType.DINGTALK_APP.name:
          this.icon = iconUrl.dingtalk
          break
        case DsInstanceType.ANSIBLE.name:
          this.icon = iconUrl.ansible
          break
        case DsInstanceType.SONAR.name:
          this.icon = iconUrl.sonar
          break
        case DsInstanceType.GUACAMOLE.name:
          this.icon = iconUrl.guacamole
          break
        case DsInstanceType.JENKINS.name:
          this.icon = iconUrl.jenkins
          break
        case DsInstanceType.NEXUS.name:
          this.icon = iconUrl.nexus
          break
        case DsInstanceType.PROMETHEUS.name:
          this.icon = iconUrl.prometheus
          break
        case DsInstanceType.HUAWEICLOUD.name:
          this.icon = iconUrl.huaweiCloud
          break
        case DsInstanceType.CONSUL.name:
          this.icon = iconUrl.consul
          break
        case DsInstanceType.ALIYUN_DEVOPS.name:
          this.icon = iconUrl.aliyunDevops
          break
        case DsInstanceType.METER_SPHERE.name:
          this.icon = iconUrl.meterSphere
          break
        case DsInstanceType.APOLLO.name:
          this.icon = iconUrl.apollo
          break
        default:
          this.icon = iconUrl.common
      }
    }
  }
}
</script>

<style scoped lang="less">
img {
  width: 45px;
  transition: all .2s ease-out;
}

.img {
  width: 60px;
  height: 60px;
  border-radius: 12px;
  display: flex;
  justify-content: center;
  align-items: center;
  box-shadow: 5px 5px 10px rgba(0, 0, 0, 0.1),
    -5px -5px 10px rgba(255, 255, 255, 0.5);
  transition: all .2s ease-out;

  &:hover {
    box-shadow: 0 0 0 rgba(0, 0, 0, 0.2),
    0 0 0 rgba(255, 255, 255, 0.8),
      inset -5px -5px 10px rgba(0, 0, 0, 0.1),
      inset -5px -5px 10px rgba(255, 255, 255, 0.5)
  }

  &:hover img {
    width: 40px;
  }
}

</style>
