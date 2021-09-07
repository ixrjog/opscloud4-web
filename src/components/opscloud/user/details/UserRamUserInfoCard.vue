<template>
  <el-card class="box-card" shadow="never" style="margin-bottom: 10px"
           v-if="JSON.stringify(user.ramUsers) !== '[]'">
    <div slot="header" class="clearfix">阿里云RAM账户</div>
    <el-table :data="user.ramUsers" style="width: 100%">
      <el-table-column prop="instanceName" label="实例"></el-table-column>
      <el-table-column prop="loginUser" label="RAM账户">
        <template slot-scope="props">
          <el-tooltip class="item" effect="light" content="点击打开登录连接" placement="top-start">
            <el-button style="padding: 3px 0" type="text" @click="openUrl(props.row.loginUrl)">
              {{ props.row.loginUser }}
            </el-button>
          </el-tooltip>
        </template>
      </el-table-column>
      <el-table-column prop="accessKeys" label="Access Key" width="210">
        <template slot-scope="props">
          <el-tag v-for="ak in props.row.accessKeys" :key="ak.assetId">
            {{ ak.assetId }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="ramPolicies" label="策略" width="400">
        <template slot-scope="props">
          <div class="tag-group">
            <div v-for="policy in props.row.ramPolicies" :key="policy.assetId">
              <el-tooltip class="item" effect="light" :content="policy.description" placement="top-start">
                <el-tag style="margin-left: 5px">{{ policy.name }}</el-tag>
              </el-tooltip>
            </div>
          </div>
        </template>
      </el-table-column>
    </el-table>
  </el-card>
</template>

<script>
export default {
  props: ['user'],
  name: 'UserRamUserInfoCard',
  methods: {
    openUrl (url) {
      window.open(url)
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
