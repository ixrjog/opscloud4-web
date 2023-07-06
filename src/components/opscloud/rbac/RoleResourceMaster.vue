<!--suppress HtmlUnknownTag -->
<template>
  <div>
    <el-row>
      <el-select v-model="roleId" size="mini" filterable clearable
                 remote reserve-keyword placeholder="输入关键词搜索角色" :remote-method="getRole"
                 style="display: inline-block; max-width:200px">
        <el-option v-for="item in roleOptions" :key="item.id" :label="item.roleName" :value="item.id">
          <select-item :name="item.roleName" :comment="item.comment"/>
        </el-option>
      </el-select>
      <el-select v-model="groupId" size="mini" filterable clearable
                 remote reserve-keyword placeholder="输入关键词搜索资源组" :remote-method="getGroup"
                 style="margin-left: 5px">
        <el-option v-for="item in groupOptions" :key="item.id" :label="item.groupName" :value="item.id">
          <select-item :name="item.groupName" :comment="item.comment"/>
        </el-option>
      </el-select>
      <el-button @click="fetchData" size="mini" style="margin-left: 5px" :disabled="roleId === ''">查询</el-button>
    </el-row>
    <div style="height: 5px"/>
    <el-row :gutter="20">
      <el-col :span="12">
        <role-resource-table :group-id="groupId" :role-id="roleId" :bind="false" ref="bindRoleResource"
                             @fetchData="fetchData"/>
      </el-col>
      <el-col :span="12">
        <role-resource-table :group-id="groupId" :role-id="roleId" :bind="true" ref="unbindRoleResource"
                             @fetchData="fetchData"/>
      </el-col>
    </el-row>
  </div>
</template>

<script>

import { QUERY_ROLE_PAGE } from '@/api/modules/auth/auth.role.api.js'
import { QUERY_GROUP_PAGE } from '@/api/modules/auth/auth.group.api.js'
import RoleResourceTable from './RoleResourceTable'
import SelectItem from '../common/SelectItem'

export default {
  name: 'RoleResourceMaster',
  data () {
    return {
      roleId: '',
      groupId: '',
      roleOptions: [],
      groupOptions: []
    }
  },
  components: {
    RoleResourceTable,
    SelectItem
  },
  mixins: [],
  mounted () {
    this.getRole('')
    this.getGroup('')
  },
  methods: {
    getRole (roleName) {
      const requestBody = {
        roleName: roleName,
        page: 1,
        length: 10
      }
      QUERY_ROLE_PAGE(requestBody)
        .then(res => {
          this.roleOptions = res.body.data
        })
    },
    getGroup (groupName) {
      const requestBody = {
        groupName: groupName,
        page: 1,
        length: 10
      }
      QUERY_GROUP_PAGE(requestBody)
        .then(res => {
          this.groupOptions = res.body.data
        })
    },
    fetchData () {
      if (this.roleId === '') return
      this.$refs.bindRoleResource.fetchData()
      this.$refs.unbindRoleResource.fetchData()
    }
  }
}
</script>

<style scoped>

</style>
