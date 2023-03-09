<template>
  <el-row :gutter="10" style="margin-left: 5px; margin-bottom: 5px">
        <span v-for="version in deploymentVersionDetails" :key="version.jobName">
          <el-col :span="6" v-for="deployment in version.deploymentVersions" :key="deployment.name">
<!--            backgroundColor: deployment.versionColor-->
           <el-card style="font-size: 12px; margin-bottom: 5px"
                    :class="deployment|toDeploymentVersionClass"
                    shadow="hover">
            <div><b>{{ version.jobName }}</b>
              <env-tag :env="version.env" style="margin-left: 10px"></env-tag>
              <el-tag v-if="false" style="float: right" size="mini">Version</el-tag>
            </div>
            <div><span class="label">环境分组</span>{{ deployment.name }}</div>
            <div><span class="label">副本数量</span>
              <deployment-replicas :replicas="deployment.replicas"></deployment-replicas>
            </div>
            <div><span class="label">版本名称</span>{{ deployment.versionName }}
              <el-popover placement="right" trigger="hover">
                <i class="el-icon-info" slot="reference"></i>
                 <span style="font-size: 10px; color: #9d9fa3">{{deployment.versionDesc === '' ? '用户未填写版本说明' : deployment.versionDesc}}</span>
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
import { toDeploymentVersionClass } from '@/filters/kubernetes.pod'

export default {
  name: 'LeoDeploymentVersionDetails',
  props: ['deploymentVersionDetails'],
  components: {
    DeploymentReplicas,
    EnvTag
  },
  filters: {
    toDeploymentVersionClass
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
  color: #99a9bf;
  margin-right: 5px;
}

.versionBlue {
  border: 3px solid #128ca8;
}

.versionGreen {
  border: 3px solid #2bbe32;
}

.versionOther {
  border: 3px solid #e56c0d;
}

.versionOffline {
  border: 3px solid #9d9fa3;
}

.el-icon-info {
  color: green;
  margin-left: 5px;
}

</style>
