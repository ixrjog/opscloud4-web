<template>
  <div>
    <el-row :gutter="24" style="margin-bottom: 5px; margin-left: 0px;">
      <el-input v-model.trim="queryParam.queryName" placeholder="输入关键字模糊查询"/>
      <el-button @click="fetchData">查询</el-button>
      <el-button @click="handlePull">拉取</el-button>
    </el-row>
    <el-table :data="table.data" style="width: 100%" v-loading="table.loading">
      <el-table-column prop="assetId" :label="tableLayout.assetId.alias"></el-table-column>
      <el-table-column prop="name" :label="tableLayout.name.alias"></el-table-column>
      <el-table-column prop="assetKey" :label="tableLayout.assetKey.alias"></el-table-column>
      <el-table-column prop="assetKey2" :label="tableLayout.assetKey2.alias" v-show="tableLayout.assetKey2.show"></el-table-column>
      <el-table-column prop="zone" :label="tableLayout.zone.alias" v-show="tableLayout.zone.show"></el-table-column>
      <el-table-column label="操作" width="280">
        <template slot-scope="scope">
        </template>
      </el-table-column>
    </el-table>
    <pagination :pagination="table.pagination" @paginationCurrentChange="paginationCurrentChange"
                @handleSizeChange="handleSizeChange"></pagination>
  </div>
</template>

<script>

import { QUERY_ASSET_PAGE, PULL_ASSET } from '@/api/modules/datasource/datasource.asset.api.js'
import Pagination from '../../common/page/Pagination'

export default {
  name: 'AssetTable',
  props: ['instanceId', 'assetType','tableLayout'],
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
      queryParam: {
        queryName: '',
        assetType: this.assetType,
        isActive: true,
        extend: true
      }
    }
  },
  computed: {},
  mounted () {
    this.fetchData()
  },
  components: {
    Pagination
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
    handlePull () {
      PULL_ASSET({
        id: this.instanceId,
        assetType: this.assetType
      })
        .then(res => {
          this.$message.success('后台任务执行中！')
        })
    },
    fetchData () {
      this.table.loading = true
      const requestBody = {
        instanceId: this.instanceId,
        ...this.queryParam,
        page: this.table.pagination.currentPage,
        length: this.table.pagination.pageSize
      }
      QUERY_ASSET_PAGE(requestBody)
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
  }

  .el-button {
    margin-left: 5px;
  }
</style>
