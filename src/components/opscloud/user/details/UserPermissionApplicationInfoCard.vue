<template>
  <div>
    <el-card class="box-card" shadow="hover" style="margin-bottom: 10px" v-if="JSON.stringify(apps) !== '[]'">
      <div slot="header" class="clearfix">
        <span>授权的应用<i class="header-icon el-icon-info"></i>(深色标签拥有管理员权限)</span>
      </div>
      <div>
        <span class="tag-group">
          <span v-for="item in apps" :key="item.id" style="margin-bottom: 2px">
              <el-tooltip class="item" effect="light" :content="item.comment || '没有填写'" placement="bottom">
                 <el-tag size="mini" style="margin-left: 5px"
                         :type=" item.userPermission.permissionRole === 'admin' ? 'danger': '' ">
                   {{ item.name }}</el-tag>
              </el-tooltip>
         </span>
       </span>
      </div>
    </el-card>
  </div>
</template>

<script>

import { QUERY_USER_BUSINESS_PERMISSION } from '@/api/modules/user/user.api.js'

import BusinessType from '@/components/opscloud/common/enums/business.type.js'

const queryParam = {
  authorized: true,
  extend: true,
  queryName: '',
  page: 1,
  length: 1024
}

export default {
  name: 'UserPermissionApplicationInfoCard',
  props: ['userId'],
  data () {
    return {
      apps: [],
      businessType: BusinessType,
      queryParam: queryParam
    }
  },
  mounted () {
    this.fetchData()
  },
  methods: {
    fetchData () {
      const requestBody = {
        ...this.queryParam,
        businessType: this.businessType.APPLICATION,
        userId: this.userId
      }
      QUERY_USER_BUSINESS_PERMISSION(requestBody)
        .then(res => {
          this.apps = res.body.data
        })
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
