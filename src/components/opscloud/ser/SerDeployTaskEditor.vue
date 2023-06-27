<template>
  <el-dialog :title="formStatus.operationType ? formStatus.addTitle : formStatus.updateTitle"
             :visible.sync="formStatus.visible" :before-close="handleClose" width="50%">
    <el-form :model="serDeployTask" label-width="150px">
      <el-form-item label="应用名称" required>
        <el-input v-model="application.name" readonly></el-input>
      </el-form-item>
      <el-form-item label="任务名称" required>
        <el-input v-model="serDeployTask.taskName" placeholder="请输入内容"></el-input>
      </el-form-item>
      <el-form-item label="任务描述" required>
        <el-input v-model="serDeployTask.taskDesc" placeholder="请输入内容"></el-input>
      </el-form-item>
      <el-form-item label="完成" v-if="!formStatus.operationType">
        <el-switch v-model="serDeployTask.isFinish" :disabled="formStatus.operationType"></el-switch>
      </el-form-item>
      <el-form-item label="有效" v-if="!formStatus.operationType">
        <el-switch v-model="serDeployTask.isActive" :disabled="formStatus.operationType"></el-switch>
      </el-form-item>
      <el-form-item>
        <el-button size="mini" @click="formStatus.visible = false">取消</el-button>
        <el-button size="mini" type="primary" @click="handleSave">确定</el-button>
      </el-form-item>
    </el-form>
  </el-dialog>
</template>

<script>
// API
import { ADD_SER_DEPLOY_TASK, UPDATE_SER_DEPLOY_TASK } from '@/api/modules/ser/ser.api'

export default {
  data () {
    return {
      serDeployTask: {},
      application: {}
    }
  },
  name: 'SerDeployTaskEditor',
  props: ['formStatus'],
  components: {},
  filters: {},
  mounted () {
  },
  methods: {
    initData (serDeployTask, application) {
      this.serDeployTask = serDeployTask
      this.application = application
    },
    handleSave () {
      const requestBody = Object.assign({}, this.serDeployTask)
      if (this.formStatus.operationType) {
        ADD_SER_DEPLOY_TASK(requestBody)
          .then(() => {
            this.$message.success('成功')
            this.formStatus.visible = false
            this.$emit('close')
          })
      } else {
        UPDATE_SER_DEPLOY_TASK(requestBody)
          .then(() => {
            this.$message.success('成功')
            this.formStatus.visible = false
            this.$emit('close')
          })
      }
    },
    handleClose () {
      this.serDeployTask = {}
      this.formStatus.visible = false
      this.$emit('close')
    }
  }
}
</script>

<style scoped lang="less">

</style>
