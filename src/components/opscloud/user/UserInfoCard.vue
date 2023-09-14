<!--suppress HtmlUnknownTag -->
<template>
  <div>
    <el-card class="box-card" shadow="hover">
      <div slot="header" class="clearfix" v-if="false">
        <span>Hi {{ user.displayName }}</span>
        <el-button style="float: right; padding: 3px 0" type="text" @click="handleEdit()">编辑</el-button>
      </div>
      <div>
        <div style="width:100%; text-align: center">
          <el-avatar v-if="user.avatar !== null && user.avatar !== undefined" :src="user.avatar" :size="50"/>
        </div>
        <div style="width:100%; text-align: center">
          {{ user.displayName }}
          <div style="color: rgb(98,98,98)">{{ user.comment }}</div>
        </div>
      </div>
      <el-divider></el-divider>
      <el-form :model="user" label-width="60px">
        <el-form-item label="用户名">
          <span>{{ user.username }}</span>
        </el-form-item>
        <el-form-item label="显示名">
          <span>{{ user.displayName }}</span>
        </el-form-item>
        <el-form-item label="姓名">
          <span>{{ user.name }}</span>
        </el-form-item>
        <el-form-item label="电话">
          <span>{{ user.phone }}</span>
        </el-form-item>
        <el-form-item label="邮箱">
          <span>{{ user.email }}</span>
        </el-form-item>
        <el-form-item label="微信">
          <span>{{ user.wechat }}</span>
        </el-form-item>
      </el-form>
      <div style="width: 100%; text-align: center">
        <el-button type="primary" plain @click="handleEdit()">{{ $t('common.edit') }}</el-button>
      </div>
    </el-card>
    <user-editor :formStatus="formStatus.user" ref="userEditor" @close="fetchData"/>
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
