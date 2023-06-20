<!--suppress HtmlUnknownTag -->
<template>
  <div>
    <el-card class="box-card" shadow="hover" style="margin-bottom: 10px">
      <div slot="header" class="clearfix">
        <span>授权的用户组</span>
      </div>
      <div>
        <span class="tag-group">
          <span v-for="item in groups" :key="item.id" style="margin-bottom: 2px">
              <el-tooltip class="item" effect="light" :content="item.comment || '没有填写'" placement="bottom">
                <el-tag size="mini" style="margin-left: 5px">{{ item.name }}</el-tag>
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
  name: 'UserPermissionGroupInfoCard',
  props: ['userId'],
  data () {
    return {
      groups: [],
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
        businessType: this.businessType.USERGROUP,
        userId: this.userId
      }
      QUERY_USER_BUSINESS_PERMISSION(requestBody)
        .then(res => {
          this.groups = res.body.data
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
