<template>
  <span style="margin-left: 20px; margin-top: 5px; margin-bottom: 5px">
    <el-row :gutter="10">
        <span v-for="version in deploymentVersionDetails" :key="version.jobName">
          <el-col :span="6" v-for="deployment in version.deploymentVersions">
           <el-card :style="{fontSize: '12px', marginBottom: '5px', backgroundColor: deployment.versionColor}" shadow="hover">
            <div><b>{{ version.jobName }}</b>
              <env-tag :env="version.env" style="margin-left: 10px"></env-tag>
              <el-tag style="float: right" size="mini">Version</el-tag>
            </div>
            <div><span class="label">Deployment</span>{{ deployment.name }}</div>
            <div><span class="label">副本数量</span>{{ deployment.replicas }}</div>
            <div><span class="label">版本名称</span>{{ deployment.versionName }}</div>
            <div><span class="label">镜像地址</span>{{ deployment.image }}</div>
            </el-card>
          </el-col>
        </span>
    </el-row>
  </span>
</template>

<script>
import EnvTag from '@/components/opscloud/common/tag/EnvTag.vue'

export default {
  name: 'LeoDeploymentVersionDetails',
  props: ['deploymentVersionDetails'],
  components: {
    EnvTag
  }
}
</script>

<style scoped>

/*.el-card {*/
/*  font-size: 12px; margin-bottom: 5px;*/
/*}*/

>>>.el-card__body {
  padding: 3px;
}

.label {
  /*color: #99a9bf;*/
  color: white;
  margin-right: 5px;
}

</style>
