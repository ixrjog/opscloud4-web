<!--suppress HtmlUnknownTag -->
<template>
  <div>
    <el-card shadow="hover" body-style="padding: 2px" class="card">
      <div slot="header">
        <deploy-number-icon :deploy="deploy"/>
        <span style="margin-right: 5px"/>
        <i class="far fa-clock"/>{{ i18nAgo(deploy.ago) }}
        <span style="margin-right: 5px"/>
        <i class="fab fa-teamspeak"/>{{ deploy.deployDetails.deploy.dict !== null && deploy.deployDetails.deploy.dict.displayName !== null ? deploy.deployDetails.deploy.dict.displayName : '-' }}
        <span style="margin-right: 10px"/>
        <business-tags :tags="deploy.tags"/>
      </div>
      <el-row :gutter="20" class="deploy-content">
        <el-col :span="12">
          <leo-label :name="$t('leo.deploy.details.startTime')">
             <span v-show="deploy.startTime !== null && deploy.startTime !== ''">{{deploy.startTime}} - {{ deploy.endTime ? deploy.endTime : '?' }}
              <span v-show="deploy.runtime !== null" style="margin-left: 2px">
                <span style="color: #3b97d7"> {{ deploy.runtime }}</span>
              </span>
            </span>
          </leo-label>
          <leo-label :name="$t('leo.deploy.deploymentVersion.name')">
            <deployment-name
              :deployment="deploy.deployDetails.deploy.kubernetes.deployment !== null ? deploy.deployDetails.deploy.kubernetes.deployment.name : 'n/a'"
              :namespace="deploy.deployDetails.deploy.kubernetes.deployment !== null ? deploy.deployDetails.deploy.kubernetes.deployment.namespace : 'n/a'"
              :cluster="deploy.deployDetails.deploy.kubernetes.instance !== null && deploy.deployDetails.deploy.kubernetes.instance.name !== null ? deploy.deployDetails.deploy.kubernetes.instance.name : 'n/a'"/>
          </leo-label>
          <leo-label :name="$t('leo.deploy.deployResult')">
            <deploy-result :deploy="deploy"/>
          </leo-label>
          <leo-label :name="$t('leo.deploy.releaseVersion')">
            {{ deploy.versionName === null ? '-' : deploy.versionName }}
          </leo-label>
          <template v-if="deploy.deployDetails.deploy.dict !== null && deploy.deployDetails.deploy.dict.deployTypeDesc !== null">
            <leo-label :name="$t('leo.deploy.deployType')" :value="deploy.deployDetails.deploy.dict.deployTypeDesc"/>
          </template>
        </el-col>
        <el-col :span="12">
          <div style="border-radius: 2px">
            <leo-label :name="$t('leo.build.details.sshUrl')" :value="deploy.deployDetails.deploy.dict.sshUrl"/>
            <leo-label :name="$t('leo.build.details.branch')" :value="deploy.deployDetails.deploy.dict.branch"/>
            <leo-label :name="$t('leo.build.details.commit')" :value="deploy.deployDetails.deploy.dict.commit"/>
            <leo-label :name="$t('leo.build.details.image')" :value="deploy.deployDetails.deploy.dict.image"/>
            <leo-label :name="$t('leo.build.details.imageTag')" :value="deploy.deployDetails.deploy.dict.imageTag"/>
          </div>
        </el-col>
      </el-row>
    </el-card>
  </div>
</template>

<script>

import DeployResult from '@/components/opscloud/leo/child/DeployResult.vue'
import DeployNumberIcon from '@/components/opscloud/leo/child/DeployNumberIcon.vue'
import DeploymentName from '@/components/opscloud/leo/child/DeploymentName.vue'
import BusinessTags from '@/components/opscloud/common/tag/BusinessTags.vue'
import tools from '@/libs/tools'
import LeoLabel from '@/components/opscloud/leo/child/LeoLabel.vue'

export default {
  name: 'LeoDeployDetails',
  props: ['deploy'],
  components: {
    LeoLabel,
    DeploymentName,
    DeployNumberIcon,
    DeployResult,
    BusinessTags
  },
  methods: {
    i18nAgo (ago) {
      return this.$i18n.locale === 'zh-chs' ? ago : tools.i18nAgo(ago)
    }
  }
}
</script>

<style scoped>

.label-b {
  color: #e56c0d;
  margin-left: 3px;
  margin-right: 5px;
}

.deploy-content {
  line-height: 18px;
}

</style>
