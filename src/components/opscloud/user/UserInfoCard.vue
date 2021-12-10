<template>
  <div>
    <el-card class="box-card" shadow="hover">
      <div slot="header" class="clearfix">
        <span>我的信息</span>
        <el-button style="float: right; padding: 3px 0" type="text" @click="handleEdit()">编辑</el-button>
      </div>
      <el-form :model="user" label-width="60px">
        <el-form-item label="用户名">
          <el-input v-model="user.username" readonly></el-input>
        </el-form-item>
        <el-form-item label="显示名">
          <el-input v-model="user.displayName" readonly></el-input>
        </el-form-item>
        <el-form-item label="姓名">
          <el-input v-model="user.name" readonly></el-input>
        </el-form-item>
        <el-form-item label="电话">
          <el-input v-model="user.phone" readonly></el-input>
        </el-form-item>
        <el-form-item label="邮箱">
          <el-input v-model="user.email" readonly></el-input>
        </el-form-item>
        <el-form-item label="微信">
          <el-input v-model="user.wechat" readonly></el-input>
        </el-form-item>
        <el-form-item label="留言">
          <el-input v-model="user.comment" readonly></el-input>
        </el-form-item>
      </el-form>
    </el-card>
    <user-editor :formStatus="formStatus.user" ref="userEditor" @close="fetchData"></user-editor>
  </div>
</template>

<script>
import UserEditor from './UserEditor'

export default {
  name: 'UserInfoCard',
  props: ['user'],
  data () {
    return {
      formStatus: {
        user: {
          visible: false,
          operationType: true,
          addTitle: '新增用户信息',
          updateTitle: '更新用户信息'
        }
      }
    }
  },
  components: {
    UserEditor
  },
  methods: {
    handleEdit () {
      this.formStatus.user.visible = true
      this.formStatus.user.operationType = false
      this.$refs.userEditor.initData(Object.assign({}, this.user))
    },
    fetchData () {
      this.$emit('fetchData')
    }
  }
}
</script>

<style scoped>
>>> .el-card__header {
  padding: 10px 10px;
  border-bottom: 1px solid #EBEEF5;
  -webkit-box-sizing: border-box;
  box-sizing: border-box;
}

>>> .el-card__body {
  padding: 10px 10px;
}
</style>
