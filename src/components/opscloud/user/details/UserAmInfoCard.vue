<!--suppress HtmlUnknownTag -->
<template>
  <el-card class="box-card" shadow="hover" style="margin-bottom: 10px" v-if="JSON.stringify(user.amMap) !== '{}'">
    <div slot="header" class="clearfix">云账户</div>
    <div v-for="(value,key) in user.amMap" :key="key" :label="key">
      <el-divider content-position="left"><b style="color: #9d9fa3">{{ key | getAmTypeText }}</b></el-divider>
      <el-table :data="value" style="width: 100%">
        <el-table-column label="实例 / 账户">
          <template v-slot="scope">
            <el-row>
              <span>{{ scope.row.instanceName }}</span>
            </el-row>
            <el-row class="amInfo">
              <el-tooltip class="item" effect="light" content="点击打开登录连接" placement="top-start">
                <el-button style="padding: 3px 0" type="text" @click="openUrl(scope.row.loginUrl)">
                  {{ scope.row.loginUser }}
                </el-button>
              </el-tooltip>
              <span v-clipboard:copy="scope.row.loginUser" v-clipboard:success="onCopy"
                    v-clipboard:error="onError">
              <i style="margin-left: 5px" class="el-icon-copy-document"/>
            </span>
            </el-row>
          </template>
        </el-table-column>
        <el-table-column prop="accessKeys" label="Access Key">
          <template v-slot="scope">
            <div v-for="ak in scope.row.accessKeys" :key="ak.assetId">
              <el-tag size="mini">{{ ak.assetId }}</el-tag>
            </div>
          </template>
        </el-table-column>
        <el-table-column prop="policies" label="策略" width="400">
          <template v-slot="scope">
            <div class="tag-group">
              <div v-for="policy in scope.row.policies" :key="policy.assetId">
                <el-tooltip class="item" effect="light"
                            :content="policy.description !==  null? policy.description : policy.assetKey2"
                            placement="top-start">
                  <el-tag size="mini">{{ policy.name }}</el-tag>
                </el-tooltip>
              </div>
            </div>
          </template>
        </el-table-column>
      </el-table>
    </div>
  </el-card>
</template>

<script>

import DsInstanceAssetType from '@/components/opscloud/common/enums/ds.instance.asset.type'

export default {
  props: ['user'],
  name: 'UserAmInfoCard',
  data () {
    return {
      // dsInstanceAssetType: DsInstanceAssetType
    }
  },
  filters: {
    getAmTypeText (value) {
      switch (value) {
        case DsInstanceAssetType.ALIYUN.RAM_USER:
          return 'Aliyun RAM'
        case DsInstanceAssetType.AWS.IAM_USER:
          return 'AWS IAM'
        default:
          return value
      }
    }
  },
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

<style scoped lang="less">
.el- {
  &card {
    /deep/ .el-card__body {
      padding: 10px 10px;
    }

    /deep/ .el-card__header {
      padding: 10px 10px;
      border-bottom: 1px solid #EBEEF5;
      -webkit-box-sizing: border-box;
      box-sizing: border-box;
    }
  }

  &divider--horizontal {
    margin: 12px 0;
  }
}

.amInfo i {
  display: none;
}

.amInfo:hover i {
  display: inline;
}
</style>
