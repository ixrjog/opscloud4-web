<template>
  <el-dialog :title="formStatus.operationType ? formStatus.addTitle : formStatus.updateTitle"
             :visible.sync="formStatus.visible">
    <el-form :model="serverGroupType">
      <el-form-item label="名称" :label-width="formStatus.labelWidth">
        <el-input v-model="serverGroupType.name" placeholder="请输入内容"></el-input>
      </el-form-item>
      <el-form-item label="颜色" :label-width="formStatus.labelWidth">
        <el-color-picker v-model="serverGroupType.color"></el-color-picker>
      </el-form-item>
      <el-form-item label="描述" :label-width="formStatus.labelWidth">
        <el-input v-model="serverGroupType.comment" placeholder="请输入内容"></el-input>
      </el-form-item>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button size="mini" @click="formStatus.visible = false">取消</el-button>
      <el-button size="mini" type="primary" @click="handlerSave">确定</el-button>
    </div>
  </el-dialog>
</template>

<script>

import { ADD_SERVER_GROUP_TYPE, UPDATE_SERVER_GROUP_TYPE } from '@/api/modules/server/server.group.type.api.js'

export default {
  data () {
    return {
      serverGroupType: ''
    }
  },
  name: 'ServerGroupTypeEditor',
  props: ['formStatus'],
  mounted () {
  },
  methods: {
    initData (serverGroupType) {
      this.serverGroupType = serverGroupType
    },
    handlerUpdate (requestBody) {
      UPDATE_SERVER_GROUP_TYPE(requestBody)
        .then(res => {
          this.$message.success('保存成功!')
          this.formStatus.visible = false
          this.$emit('close')
        })
    },
    handlerAdd (requestBody) {
      ADD_SERVER_GROUP_TYPE(requestBody)
        .then(res => {
          this.$message.success('新增成功!')
          this.formStatus.visible = false
          this.$emit('close')
        })
    },
    handlerSave () {
      if (this.formStatus.operationType) {
        this.handlerAdd(this.serverGroupType)
      } else {
        this.handlerUpdate(this.serverGroupType)
      }
    }
  }
}
</script>

<style scoped>

</style>
