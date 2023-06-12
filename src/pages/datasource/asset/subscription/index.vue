<!--suppress HtmlUnknownTag -->
<template>
  <d2-container>
    <div>
      <h1>资产订阅配置</h1>
    </div>
    <div style="margin-bottom: 5px">
      <el-row :gutter="24" style="margin-bottom: 5px">
        <el-input v-model="queryParam.queryName" placeholder="名称"/>
        <el-select v-model="queryParam.isActive" clearable placeholder="有效">
          <el-option v-for="item in activeOptions"
                     :key="item.value"
                     :label="item.label"
                     :value="item.value"/>
        </el-select>
        <el-button @click="handleAdd">新增</el-button>
        <el-button @click="fetchData">查询</el-button>
      </el-row>
    </div>
    <el-table :data="table.data" style="width: 100%">
      <el-table-column prop="instance" label="实例名称" width="200">
        <template v-slot="scope">
          <el-row>
            <span>{{ scope.row.instance.instanceName }}</span>
          </el-row>
          <el-row>
            <span>{{ scope.row.instance.comment }}</span>
          </el-row>
        </template>
      </el-table-column>
      <el-table-column prop="instance" label="实例类型" width="120">
        <template v-slot="scope">
          <el-tag size="mini">{{ scope.row.instance.instanceType }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="asset" label="资产类型" width="150">
        <template v-slot="scope">
          <el-tag size="mini">{{ scope.row.asset.assetType }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="asset" label="资产详情">
        <template v-slot="scope">
          <span>{{ scope.row.asset.assetKey2 }}</span>
        </template>
      </el-table-column>
      <el-table-column prop="isActive" label="有效" width="80">
        <template v-slot="scope">
          <active-tag :is-active="scope.row.isActive"/>
        </template>
      </el-table-column>
      <el-table-column prop="lastSubscriptionTime" label="发布时间" width="200">
        <template v-slot="scope">
          <span>{{ scope.row.lastSubscriptionTime }}&lt;{{ scope.row.ago }}&gt;</span>
        </template>
      </el-table-column>
      <el-table-column fixed="right" label="操作" width="280">
        <template v-slot="scope">
          <el-button type="primary" plain size="mini" @click="handleRowPublish(scope.row)">发布</el-button>
          <el-button type="primary" plain size="mini" @click="handleRowLog(scope.row)">日志</el-button>
          <el-button type="primary" plain size="mini" @click="handleRowEdit(scope.row)">编辑</el-button>
          <el-button type="danger" plain size="mini" @click="handleRowDel(scope.row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <pagination :pagination="table.pagination" @paginationCurrentChange="paginationCurrentChange"
                @handleSizeChange="handleSizeChange"/>
    <asset-subscription-editor :form-status="formStatus.config"
                               ref="assetSubscriptionEditor"
                               @close="fetchData"/>
    <view-log :formStatus="formStatus.log" ref="viewLog"/>
  </d2-container>
</template>

<script>

import {
  QUERY_ASSET_SUBSCRIPTION_PAGE, PUBLISH_ASSET_SUBSCRIPTION_BY_ID, DELETE_ASSET_SUBSCRIPTION_BY_ID
} from '@/api/modules/datasource/datasource.asset.subscription.api.js'
import Pagination from '../../../../components/opscloud/common/page/Pagination'
import ActiveTag from '../../../../components/opscloud/common/tag/ActiveTag'
import AssetSubscriptionEditor
  from '../../../../components/opscloud/datasource/asset/subscription/AssetSubscriptionEditor'
import ViewLog from '../../../../components/opscloud/datasource/asset/subscription/ViewLog'

const activeOptions = [{
  value: true,
  label: '有效'
}, {
  value: false,
  label: '无效'
}]

export default {
  data () {
    return {
      table: {
        data: [],
        loading: false,
        pagination: {
          currentPage: 1,
          pageSize: 10,
          total: 0
        }
      },
      activeOptions: activeOptions,
      dsTypeOptions: [],
      formStatus: {
        config: {
          visible: false,
          addTitle: '新增资产订阅配置',
          updateTitle: '更新资产订阅配置',
          operationType: true
        },
        log: {
          visible: false,
          title: '发布资产订阅日志'
        }
      },
      queryParam: {
        isActive: '',
        extend: true
      }
    }
  },
  computed: {},
  mounted () {
    this.fetchData()
  },
  components: {
    Pagination,
    ActiveTag,
    AssetSubscriptionEditor,
    ViewLog
  },
  methods: {
    paginationCurrentChange (currentPage) {
      this.table.pagination.currentPage = currentPage
      this.fetchData()
    },
    handleSizeChange (size) {
      this.table.pagination.pageSize = size
      this.fetchData()
    },
    handleAdd () {
      const assetSubscription = {
        id: '',
        instanceUuid: '',
        datasourceInstanceAssetId: '',
        isActive: true,
        playbook: '',
        vars: '',
        comment: ''
      }
      this.$refs.assetSubscriptionEditor.initData(assetSubscription)
      this.formStatus.config.operationType = true
      this.formStatus.config.visible = true
    },
    handleRowEdit (row) {
      this.$refs.assetSubscriptionEditor.initData(Object.assign({}, row))
      this.formStatus.config.operationType = false
      this.formStatus.config.visible = true
    },
    handleRowDel (row) {
      DELETE_ASSET_SUBSCRIPTION_BY_ID(row.id)
        .then(res => {
          this.$message.success('删除成功')
          this.fetchData()
        })
    },
    /**
     * 发布
     * @param row
     */
    handleRowPublish (row) {
      this.table.loading = true
      PUBLISH_ASSET_SUBSCRIPTION_BY_ID(row.id)
        .then(res => {
          this.table.loading = false
        })
    },
    handleRowLog (row) {
      this.$refs.viewLog.initData(row.lastSubscriptionLog, row.ago)
      this.formStatus.log.visible = true
    },
    fetchData () {
      this.table.loading = true
      const requestBody = {
        ...this.queryParam,
        page: this.table.pagination.currentPage,
        length: this.table.pagination.pageSize
      }
      QUERY_ASSET_SUBSCRIPTION_PAGE(requestBody)
        .then(res => {
          this.table.data = res.body.data
          this.table.pagination.total = res.body.totalNum
          this.table.loading = false
        })
    }
  }
}
</script>

<style scoped>
.el-input {
  display: inline-block;
  max-width: 200px;
  margin-left: 10px;
}

.el-select {
  margin-left: 5px;
}

.el-button {
  margin-left: 5px;
}

</style>
