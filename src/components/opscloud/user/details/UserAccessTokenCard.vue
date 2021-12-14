<template>
  <div>
    <el-card class="box-card" shadow="hover" style="margin-bottom: 10px">
      <div slot="header" class="clearfix">
        <span>AccessToken<i class="header-icon el-icon-info"></i>(API)</span>
        <el-button style="float: right; padding: 3px 0" type="text" @click="handleGrant">申请授权</el-button>
      </div>
      <el-table :data="user.accessTokens" style="width: 100%">
        <el-table-column prop="tokenId" label="Token ID"></el-table-column>
        <el-table-column prop="token" label="Access Token"></el-table-column>
        <el-table-column prop="token" label="过期时间">
          <template slot-scope="scope">
            <span>{{ scope.row.expiredTime }}<b style="margin-left: 5px">{{ scope.row.later }}</b></span>
          </template>
        </el-table-column>
        <el-table-column prop="comment" label="描述"></el-table-column>
        <el-table-column label="操作" width="110">
          <template slot-scope="scope">
            <el-button type="primary" plain size="mini" @click="handleRevoke(scope.row)">撤销</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
    <access-token-editor ref="accessTokenEditor" :form-status="formStatus.accessToken"
                         @fetchData="fetchData"></access-token-editor>
  </div>
</template>

<script>

import { REVOKE_ACCESS_TOKEN } from '@/api/modules/user/user.access.token.api.js'
import AccessTokenEditor from './UserAccessTokenEditor'

export default {
  name: 'UserAccessTokenCard',
  props: ['user'],
  data () {
    return {
      formStatus: {
        accessToken: {
          visible: false,
          labelWidth: '100px'
        }
      }
    }
  },
  components: {
    AccessTokenEditor
  },
  methods: {
    handleGrant () {
      this.$refs.accessTokenEditor.initData()
      this.formStatus.accessToken.visible = true
    },
    handleRevoke (row) {
      REVOKE_ACCESS_TOKEN({
        tokenId: row.tokenId
      })
        .then(res => {
          // 返回数据
          this.$message({
            message: '成功',
            type: 'success'
          })
          this.fetchData()
        })
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
