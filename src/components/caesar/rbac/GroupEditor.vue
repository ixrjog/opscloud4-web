<template>
  <el-dialog :title="formStatus.operationType ? formStatus.addTitle : formStatus.updateTitle"
             :visible.sync="formStatus.visible">
    <el-form :model="group">
      <el-form-item label="资源组名称" :label-width="labelWidth" required>
        <el-input v-model="group.groupName" placeholder="请输入内容" ></el-input>
      </el-form-item>
      <el-form-item label="描述" :label-width="labelWidth">
        <el-input v-model="group.comment" placeholder="请输入内容"></el-input>
      </el-form-item>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button @click="formStatus.visible = false">取消</el-button>
      <el-button type="primary" @click="handlerSave">确定</el-button>
    </div>
  </el-dialog>
</template>

<script>

// API
import { ADD_GROUP, UPDATE_GROUP } from '@/api/modules/auth/auth.group.api.js'

export default {
  data () {
    return {
      group: '',
      labelWidth: '150px'
    }
  },
  name: 'GroupEditor',
  props: ['formStatus'],
  mounted () {
  },
  methods: {
    initData (group) {
      this.group = group
    },
    handlerUpdate (requestBody) {
      UPDATE_GROUP(requestBody)
        .then(res => {
          // 返回数据
          this.$message({
            message: '成功',
            type: 'success'
          })
          this.formStatus.visible = false
          this.$emit('close')
        })
    },
    handlerAdd (requestBody) {
      ADD_GROUP(requestBody)
        .then(res => {
          // 返回数据
          this.$message({
            message: '成功',
            type: 'success'
          })
          this.formStatus.visible = false
          this.$emit('close')
        })
    },
    handlerSave () {
      if (this.formStatus.operationType) {
        this.handlerAdd(this.group)
      } else {
        this.handlerUpdate(this.group)
      }
    }
  }
}
</script>

<style scoped>

</style>
