<template>
  <div>
    <el-card class="box-card" shadow="hover">
      <div slot="header" class="clearfix">
        <span>个人信息</span>
        <el-button style="float: right; padding: 3px 0" type="text" @click="handlerEdit()">修改基本信息</el-button>
      </div>
      <el-form :model="user" label-width="80px">
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
  </div>
</template>

<script>
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
  methods: {
    handlerEdit () {
      this.formStatus.user.visible = true
      this.formStatus.user.operationType = false
      // this.$refs.userDialog.initData(Object.assign({}, this.userDetail))
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
</style>
