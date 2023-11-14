<!--suppress HtmlUnknownTag -->
<template>
  <div class="deploy-content">
    <leo-label :name="$t('leo.deploy.details.startTime')">
                  <span v-show="deploy.startTime !== null && deploy.startTime !== ''">
                    {{ deploy.startTime }} - {{ deploy.endTime ? deploy.endTime : '?' }}
                    <span v-show="deploy.runtime !== null" style="margin-left: 2px">
                      <span style="color: #3b97d7">{{ deploy.runtime }}</span>
                    </span>
                  </span>
    </leo-label>

    <!-- 集群名称-->
    <leo-label :name="$t('leo.deploy.deploymentVersion.clusterName')">
      {{ deploy.deployDetails.deploy.kubernetes.instance !== null && deploy.deployDetails.deploy.kubernetes.instance.name !== null ? deploy.deployDetails.deploy.kubernetes.instance.name : 'n/a' }}
    </leo-label>
    <!-- 命名空间-->
    <leo-label :name="$t('leo.deploy.deploymentVersion.namespace')">
      {{ deploy.deployDetails.deploy.kubernetes.deployment !== null ? deploy.deployDetails.deploy.kubernetes.deployment.namespace : 'n/a' }}
    </leo-label>
    <!-- 分组名称-->
    <leo-label :name="$t('leo.deploy.deploymentVersion.name')">
      {{ deploy.deployDetails.deploy.kubernetes.deployment !== null ? deploy.deployDetails.deploy.kubernetes.deployment.name : 'n/a' }}
    </leo-label>
    <leo-label :name="$t('leo.deploy.deployResult')">
      <deploy-result :deploy="deploy"/>
    </leo-label>
    <leo-label :name="$t('leo.deploy.releaseVersion')">
      {{ deploy.versionName === null ? '-' : deploy.versionName }}
    </leo-label>
    <template
      v-if="deploy.deployDetails.deploy.dict !== null && deploy.deployDetails.deploy.dict.deployTypeDesc !== null">
      <leo-label :name="$t('leo.deploy.deployType')" :value="deploy.deployDetails.deploy.dict.deployTypeDesc"/>
    </template>
  </div>
</template>

<script>

import DeploymentName from '@/components/opscloud/leo/child/DeploymentName.vue'
import DeployResult from '@/components/opscloud/leo/child/DeployResult.vue'
import LeoLabel from '@/components/opscloud/leo/child/LeoLabel.vue'

export default {
  name: 'DeployTaskContent',
  components: { LeoLabel, DeployResult, DeploymentName },
  props: {
    deploy: {
      type: Object,
      required: true,
      default: () => ({})
    }
  }
}
</script>

<style scoped>

.deploy-content {
  line-height: 18px;
}

</style>
