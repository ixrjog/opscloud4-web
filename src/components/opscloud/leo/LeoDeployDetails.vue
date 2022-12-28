<template>
  <div>
    <el-card shadow="hover" body-style="padding: 2px" class="card" style="margin-bottom: 10px">
      <div slot="header">
        <deploy-number-icon :deploy="deploy"></deploy-number-icon>
        <span style="margin-left: 5px"><i class="far fa-clock"></i>{{ deploy.ago }}</span>
        <span style="margin-left: 8px"
              v-if="deploy.deployDetails.deploy.dict !== null && deploy.deployDetails.deploy.dict.displayName !== null"><i
          class="fab fa-teamspeak"></i>{{ deploy.deployDetails.deploy.dict.displayName }}</span>
      </div>
      <span class="label">执行时间</span>
      <span v-show="deploy.startTime !== null && deploy.startTime !== ''"> {{
          deploy.startTime
        }} - {{ deploy.endTime ? deploy.endTime : '?' }}
              <span v-show="deploy.runtime !== null" style="margin-left: 2px">
                <b style="color: #3b97d7"> {{ deploy.runtime }}</b></span>
              </span>
      <div><span class="label"
                 v-if="deploy.deployDetails.deploy.dict !== null && deploy.deployDetails.deploy.dict.deployTypeDesc !== null">部署类型</span>
        {{ deploy.deployDetails.deploy.dict.deployTypeDesc }}
      </div>
      <div><span class="label">部署状态</span> {{ deploy.deployStatus }}</div>
      <div><span class="label">部署结果</span>
        <deploy-result style="margin-left: 5px" :deploy="deploy"></deploy-result>
      </div>
      <div><span class="label">发布版本</span> {{ deploy.versionName }}</div>
    </el-card>
  </div>
</template>

<script>

import DeployResult from '@/components/opscloud/leo/child/DeployResult.vue'
import DeployNumberIcon from '@/components/opscloud/leo/child/DeployNumberIcon.vue'

export default {
  name: 'LeoDeployDetails',
  props: ['deploy'],
  components: {
    DeployNumberIcon,
    DeployResult
  }
}
</script>

<style scoped>

</style>
