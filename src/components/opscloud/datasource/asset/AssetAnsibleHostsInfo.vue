<template>
  <div>
    <el-row :gutter="24" style="margin-bottom: 5px; margin-left: 0px;">
      <el-button @click="fetchData">查询</el-button>
      <el-button @click="handlePull">构建配置</el-button>
    </el-row>
    <div v-for="asset in table.data" :key="asset.id">
      <el-card shadow="hover">
        <div slot="header" class="clearfix">
          <el-tag>{{asset.assetKey}}</el-tag>
          <span style="margin-left: 20px;font-size: 12px">{{asset.assetKey2}}</span>
        </div>
        <d2-highlight v-if="asset.description != null && asset.description != ''" :code="asset.description" lang="sh"/>
      </el-card>
    </div>
    <business-tag-editor ref="businessTagEditor" :businessType="businessType" :businessId="businessId"
                         :formStatus="formStatus.businessTag" @close="fetchData"></business-tag-editor>
  </div>
</template>

<script>

import {
  QUERY_ASSET_PAGE,
  PULL_ASSET,
  DELETE_ASSET_BY_ID
} from '@/api/modules/datasource/datasource.asset.api.js'
import BusinessTagEditor from '../../common/tag/BusinessTagEditor'
import BusinessType from '@/components/opscloud/common/enums/business.type.js'
import BusinessTags from '../../common/tag/BusinessTags'

export default {
  name: 'AssetAnsibleHostsInfo',
  props: {
    instanceId: {
      type: String,
      required: true
    },
    assetType: {
      type: String,
      required: true
    }
  },
  components: {
    BusinessTagEditor,
    BusinessTags
  },
  data () {
    return {
      table: {
        data: [],
        pagination: {
          currentPage: 1,
          pageSize: 10,
          total: 0
        }
      },
      formStatus: {
        businessTag: {
          visible: false,
          title: '编辑数据源实例资产标签'
        }
      },
      businessId: '',
      businessType: BusinessType.ASSET,
      queryParam: {
        queryName: '',
        assetType: this.assetType,
        isActive: true,
        relation: true,
        extend: true
      }
    }
  },
  methods: {
    handlePull () {
      PULL_ASSET({
        instanceId: this.instanceId,
        assetType: this.assetType
      }).then(() => {
        this.$message.success('后台任务执行中！')
      })
    },
    fetchData () {
      const requestBody = {
        instanceId: this.instanceId,
        assetType: this.assetType,
        ...this.queryParam,
        page: this.table.pagination.currentPage,
        length: this.table.pagination.pageSize
      }
      QUERY_ASSET_PAGE(requestBody)
        .then(res => {
          this.table.data = res.body.data
        })
    }
  }
}
</script>

<style scoped>

  .d2-highlight {
    margin-top: 5px;
    font-size: 10px;
    background-color: #dad8c8;
    line-height: 100%;
  }

  >>> .el-card__header {
    padding: 10px 10px;
    border-bottom: 1px solid #EBEEF5;
    -webkit-box-sizing: border-box;
    box-sizing: border-box;
  }

</style>
