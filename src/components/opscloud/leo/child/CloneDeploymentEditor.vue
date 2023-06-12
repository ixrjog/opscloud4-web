<!--suppress HtmlUnknownTag -->
<template>
  <el-dialog :title="'从 ' + deploymentVersion.name + ' 克隆无状态分组'" :visible.sync="formStatus.visible" width="25%"
             append-to-body>
    <el-form :model="deploymentVersion">
      <el-form-item label="分组名称" :label-width="labelWidth" required>
        <el-input v-model="deploymentVersion.deploymentName"/>
      </el-form-item>
      <el-form-item label="副本数量" :label-width="labelWidth" required>
        <el-input v-model="deploymentVersion.replicas"/>
      </el-form-item>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button size="mini" @click="formStatus.visible = false">关闭</el-button>
      <el-button size="mini" type="primary" @click="clone">确定</el-button>
    </div>
  </el-dialog>
</template>

<script>

import { CLONE_DEPLOY_DEPLOYMENT } from '@/api/modules/leo/leo.deploy.api'

export default {
  data () {
    return {
      labelWidth: '100px',
      deploymentVersion: ''
    }
  },
  name: 'CloneDeploymentEditor',
  props: ['formStatus'],
  components: {},
  mixins: [],
  mounted () {
  },
  methods: {
    initData (deploymentVersion) {
      this.deploymentVersion = deploymentVersion
    },
    clone () {
      const requestBody = {
        buildId: this.deploymentVersion.buildId,
        // 获取applicationId
        jobId: this.deploymentVersion.jobId,
        assetId: this.deploymentVersion.assetId,
        name: this.deploymentVersion.name,
        deploymentName: this.deploymentVersion.deploymentName,
        replicas: this.deploymentVersion.replicas
      }
      CLONE_DEPLOY_DEPLOYMENT(requestBody)
        .then(() => {
          this.$message.success('克隆成功!')
          this.formStatus.visible = false
          this.$emit('close')
        })
    }
  }
}
</script>
