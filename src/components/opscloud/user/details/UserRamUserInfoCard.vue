<template>
  <el-card class="box-card" shadow="hover" style="margin-bottom: 10px"
           v-if="JSON.stringify(user.ramUsers) !== '[]'">
    <div slot="header" class="clearfix">阿里云RAM账户</div>
    <el-table :data="user.ramUsers" style="width: 100%">
      <el-table-column label="实例 / 账户">
        <template v-slot="props">
          <el-row>
            <span>{{ props.row.instanceName }}</span>
          </el-row>
          <el-row class="ramInfo">
            <el-tooltip class="item" effect="light" content="点击打开登录连接" placement="top-start">
              <el-button style="padding: 3px 0" type="text" @click="openUrl(props.row.loginUrl)">
                {{ props.row.loginUser }}
              </el-button>
            </el-tooltip>
            <span v-clipboard:copy="props.row.loginUser" v-clipboard:success="onCopy"
                  v-clipboard:error="onError">
              <i style="margin-left: 5px" class="el-icon-copy-document"></i>
            </span>
          </el-row>
        </template>
      </el-table-column>
      <el-table-column prop="accessKeys" label="Access Key">
        <template v-scope="props">
          <el-tag size="mini" v-for="ak in props.row.accessKeys" :key="ak.assetId" style="display: inline-block">
            {{ ak.assetId }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="ramPolicies" label="策略" width="400">
        <template slot-scope="props">
          <div class="tag-group">
            <div v-for="policy in props.row.ramPolicies" :key="policy.assetId">
              <el-tooltip class="item" effect="light" :content="policy.description" placement="top-start">
                <el-tag size="mini">{{ policy.name }}</el-tag>
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
    onCopy (e) {
      this.$message.success('内容已复制到剪切板！')
    },
    onError (e) {
      this.$message.error('抱歉，复制失败！')
    },
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

>>> .el-card__body {
  padding: 10px 10px;
}

.ramInfo i {
  display: none;
}

.ramInfo:hover i {
  display: inline;
}
</style>
