<template>
    <el-row :gutter="10" style="margin-left: 5px; margin-bottom: 5px">
        <span v-for="version in deploymentVersionDetails" :key="version.jobName">
          <el-col :span="6" v-for="deployment in version.deploymentVersions" :key="deployment.name">
           <el-card :style="{fontSize: '12px', marginBottom: '5px', backgroundColor: deployment.versionColor}"
                    shadow="hover">
            <div><b>{{ version.jobName }}</b>
              <env-tag :env="version.env" style="margin-left: 10px"></env-tag>
              <el-tag style="float: right" size="mini">Version</el-tag>
            </div>
            <div><span class="label">环境分组</span>{{ deployment.name }}</div>
            <div><span class="label">副本数量</span>
              <deployment-replicas :replicas="deployment.replicas"></deployment-replicas>
<!--             <span v-for="index of deployment.replicas">-->
<!--               <i class="fas fa-square" style="color: #d9d9d9;margin-right: 1px"></i>-->
<!--               <span v-if="index % 5 === 0" style="margin-right: 2px"></span>-->
<!--             </span> x{{ deployment.replicas }}-->
            </div>
            <div><span class="label">版本名称</span>{{ deployment.versionName }}
              <el-popover placement="right" trigger="hover">
                <i class="el-icon-info" style="color: rgba(255,255,255,0.3);margin-left: 5px" slot="reference"></i>
                 <span style="font-size: 10px;color: #9d9fa3">{{ deployment.versionDesc === ''? '用户未填写版本说明': deployment.versionDesc }}</span>
              </el-popover>
            </div>
               <div><span class="label">镜像地址</span>{{ deployment.image }}</div>
            </el-card>
          </el-col>
        </span>
    </el-row>
</template>

<script>

import EnvTag from '@/components/opscloud/common/tag/EnvTag.vue'
import DeploymentReplicas from '@/components/opscloud/leo/child/DeploymentReplicas.vue'

export default {
  name: 'LeoDeploymentVersionDetails',
  props: ['deploymentVersionDetails'],
  components: {
    DeploymentReplicas,
    EnvTag
  }
}
</script>

<style scoped>

/*.el-card {*/
/*  font-size: 12px; margin-bottom: 5px;*/
/*}*/

>>> .el-card__body {
  padding: 3px;
}

.label {
  /*color: #99a9bf;*/
  color: white;
  margin-right: 5px;
}

</style>
