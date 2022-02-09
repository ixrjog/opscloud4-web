<template>
  <el-card class="box-card" shadow="hover" style="margin-bottom: 10px" v-if="JSON.stringify(user.amMap) !== '{}'">
    <div slot="header" class="clearfix">云账户</div>
    <div v-for="(value,key) in user.amMap" :key="key" :label="key" class="resDiv">
      <el-divider content-position="left"><b style="color: #9d9fa3">{{ key | getAmTypeText }}</b></el-divider>
      <el-table :data="value" style="width: 100%">
        <el-table-column label="实例 / 账户">
          <template slot-scope="props">
            <el-row>
              <span>{{ props.row.instanceName }}</span>
            </el-row>
            <el-row class="amInfo">
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
          <template slot-scope="props">
            <el-tag v-for="ak in props.row.accessKeys" :key="ak.assetId">
              {{ ak.assetId }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="policies" label="策略" width="400">
          <template slot-scope="props">
            <div class="tag-group">
              <div v-for="policy in props.row.policies" :key="policy.assetId">
                <el-tooltip class="item" effect="light" :content="policy.description" placement="top-start">
                  <el-tag style="margin-left: 5px">{{ policy.name }}</el-tag>
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

.resTabPane {
  & .el-select {
    max-width: 80%;
    width: 80%;
  }

  .el-col {
    p {
      margin: 0px;
      color: #B7B6B6;
      font-size: 20px;
      font-weight: bolder;
    }

    & .el-tag {
      margin: 5px 5px 5px 0px;
    }
  }
}
</style>
