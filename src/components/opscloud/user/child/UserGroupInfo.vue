<!--suppress HtmlUnknownTag -->
<template>
  <div>
    <el-form :model="userGroup">
      <el-form-item label="名称" :label-width="labelWidth" required>
        <el-input v-model="userGroup.name" placeholder="请输入内容" :disabled="!operationType" size="mini"/>
      </el-form-item>
      <el-form-item label="工单申请" :label-width="labelWidth" :required="true">
        <el-select v-model="userGroup.allowOrder" size="mini" placeholder="选择类型">
          <el-option v-for="item in allowOrderOptions"
                     :key="item.value"
                     :label="item.label"
                     :value="item.value"/>
        </el-select>
      </el-form-item>
      <el-form-item label="描述" :label-width="labelWidth">
        <el-input v-model="userGroup.comment" placeholder="请输入内容" size="mini"/>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>

import { ADD_USER_GROUP, UPDATE_USER_GROUP } from '@/api/modules/user/user.group.api.js'

const allowOptions = [{
  value: false,
  label: '禁止'
}, {
  value: true,
  label: '允许'
}]

export default {
  name: 'UserGroupInfo',
  props: ['operationType'],
  data () {
    return {
      userGroup: {},
      labelWidth: '150px',
      allowOrderOptions: allowOptions
    }
  },
  methods: {
    initData (userGroup) {
      this.userGroup = userGroup
    },
    handleUpdate () {
      UPDATE_USER_GROUP(this.userGroup)
        .then(res => {
          this.$message.success('保存成功!')
          this.$emit('close')
        })
    },
    handleAdd () {
      ADD_USER_GROUP(this.userGroup)
        .then(res => {
          this.$message.success('新增成功!')
          this.$emit('close')
        })
    },
    save () {
      if (this.operationType) {
        this.handleAdd()
      } else {
        this.handleUpdate()
      }
    }
  }
}
</script>

<style scoped>

</style>
