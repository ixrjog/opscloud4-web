<!--suppress HtmlUnknownTag -->
<template>
  <el-dialog :title="formStatus.operationType ? formStatus.addTitle : formStatus.updateTitle"
             :visible.sync="formStatus.visible">
    <el-form :model="group">
      <el-form-item label="资源组名称" :label-width="labelWidth" required>
        <el-input v-model="group.groupName" placeholder="请输入内容" size="mini"/>
      </el-form-item>
      <el-form-item label="基本路径" :label-width="labelWidth">
        <el-input v-model="group.basePath" placeholder="请输入内容" size="mini"/>
      </el-form-item>
      <el-form-item label="描述" :label-width="labelWidth">
        <el-input v-model="group.comment" placeholder="请输入内容" size="mini"/>
      </el-form-item>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button size="mini" @click="formStatus.visible = false">取消</el-button>
      <el-button size="mini" type="primary" @click="handleSave">确定</el-button>
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
    handleUpdate (requestBody) {
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
    handleAdd (requestBody) {
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
    handleSave () {
      if (this.formStatus.operationType) {
        this.handleAdd(this.group)
      } else {
        this.handleUpdate(this.group)
      }
    }
  }
}
</script>

<style scoped>

</style>
