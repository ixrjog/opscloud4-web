<!--suppress HtmlUnknownTag -->
<template>
  <div>
    <el-card shadow="hover" body-style="padding: 2px" class="card">
      <div slot="header">
        <deploy-number-icon :deploy="deploy"/>
        <span style="margin-right: 5px"/>
        <i class="far fa-clock"/>{{ deploy.ago }}
        <span style="margin-right: 5px"/>
        <i class="fab fa-teamspeak"/>{{ deploy.deployDetails.deploy.dict !== null && deploy.deployDetails.deploy.dict.displayName !== null ? deploy.deployDetails.deploy.dict.displayName : '-' }}
        <span style="margin-right: 10px"/>
        <business-tags :tags="deploy.tags"/>
      </div>
      <el-row>
        <el-col :span="12">
          <div>
            <span class="label">执行时间</span>
            <span v-show="deploy.startTime !== null && deploy.startTime !== ''">{{deploy.startTime}} - {{ deploy.endTime ? deploy.endTime : '?' }}
              <span v-show="deploy.runtime !== null" style="margin-left: 2px">
                <b style="color: #3b97d7"> {{ deploy.runtime }}</b>
              </span>
            </span>
          </div>
          <div>
            <span class="label">分组信息</span>
            <deployment-name
              :deployment="deploy.deployDetails.deploy.kubernetes.deployment !== null ? deploy.deployDetails.deploy.kubernetes.deployment.name : 'n/a'"
              :namespace="deploy.deployDetails.deploy.kubernetes.deployment !== null ? deploy.deployDetails.deploy.kubernetes.deployment.namespace : 'n/a'"
              :cluster="deploy.deployDetails.deploy.kubernetes.instance !== null && deploy.deployDetails.deploy.kubernetes.instance.name !== null ? deploy.deployDetails.deploy.kubernetes.instance.name : 'n/a'"/>
          </div>
          <div v-if="deploy.deployDetails.deploy.dict !== null && deploy.deployDetails.deploy.dict.deployTypeDesc !== null">
            <span class="label">部署类型</span>{{ deploy.deployDetails.deploy.dict.deployTypeDesc }}
          </div>
          <div>
            <span class="label">部署结果</span>
            <deploy-result :deploy="deploy"/>
          </div>
          <div><span class="label">发布版本</span>{{ deploy.versionName === null ? '-': deploy.versionName }}</div>
        </el-col>
        <el-col :span="12">
          <div style="border-radius: 2px; background-color: #d9d9d9">
            <div><span class="label-b">项目仓库</span>{{ deploy.deployDetails.deploy.dict.sshUrl }}</div>
            <div><span class="label-b">构建分支</span>{{ deploy.deployDetails.deploy.dict.branch }}</div>
            <div><span class="label-b">COMMIT</span>{{ deploy.deployDetails.deploy.dict.commit }}</div>
            <div><span class="label-b">容器镜像</span>{{ deploy.deployDetails.deploy.dict.image }}</div>
            <div><span class="label-b">镜像标签</span>{{ deploy.deployDetails.deploy.dict.imageTag }}</div>
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

export default {
  name: 'LeoDeployDetails',
  props: ['deploy'],
  components: {
    DeploymentName,
    DeployNumberIcon,
    DeployResult,
    BusinessTags
  }
}
</script>

<style scoped>

.label {
  color: #99a9bf;
  margin-right: 5px;
}

.label-b {
  color: #e56c0d;
  margin-left: 3px;
  margin-right: 5px;
}

</style>
