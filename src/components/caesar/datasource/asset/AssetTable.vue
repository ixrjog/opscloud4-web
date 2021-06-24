<template>
  <div>
    <el-row :gutter="24" style="margin-bottom: 5px; margin-left: 0px;">
      <el-input v-model.trim="queryParam.queryName" @change="fetchData" placeholder="输入关键字模糊查询"/>
      <el-button @click="fetchData">查询</el-button>
      <el-button @click="handlePull">拉取</el-button>
    </el-row>
    <el-table :data="table.data" style="width: 100%" v-loading="table.loading">
      <el-table-column prop="assetId" width="200px" :label="tableLayout.assetId.alias"></el-table-column>
      <el-table-column prop="name" width="200px" :label="tableLayout.name.alias"></el-table-column>
      <el-table-column prop="assetKey" width="300px" :label="tableLayout.assetKey.alias"></el-table-column>
      <el-table-column prop="assetKey2" width="200px" :label="tableLayout.assetKey2.alias"
                       v-if="tableLayout.assetKey2.show"></el-table-column>
      <el-table-column prop="zone" :label="tableLayout.zone.alias" v-if="tableLayout.zone.show"></el-table-column>
      <slot name="extend">
        <!--扩展字段-->
      </slot>
      <el-table-column prop="tags" label="标签">
        <template slot-scope="scope">
          <business-tags :tags="scope.row.tags"></business-tags>
        </template>
      </el-table-column>
      <el-table-column label="操作" width="200">
        <template slot-scope="scope">
          <el-button type="primary" plain size="mini" @click="handleRowTagEdit(scope.row)">标签</el-button>
          <el-button type="danger" plain size="mini" @click="handleRowDel(scope.row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <pagination :pagination="table.pagination" @paginationCurrentChange="paginationCurrentChange"
                @handleSizeChange="handleSizeChange"></pagination>
    <business-tag-editor ref="businessTagEditor" :businessType="businessType" :businessId="businessId" :formStatus="formStatus.businessTag" @close="fetchData"></business-tag-editor>

  </div>
</template>

<script>

import { QUERY_ASSET_PAGE, PULL_ASSET,DELETE_ASSET_BY_ID } from '@/api/modules/datasource/datasource.asset.api.js'
import Pagination from '../../common/page/Pagination'
import BusinessTagEditor from '../../common/tag/BusinessTagEditor'

import BusinessType from '@/components/caesar/common/enums/business.type.js'
import BusinessTags from '../../common/tag/BusinessTags'

export default {
  name: 'AssetTable',
  props: ['instanceId', 'assetType', 'tableLayout'],
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
      formStatus: {
        businessTag: {
          visible: false,
          title: '编辑数据源实例资产标签'
        }
      },
      businessId:'',
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
  computed: {},
  mounted () {
    // this.fetchData()
  },
  components: {
    BusinessTagEditor,
    BusinessTags,
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
        instanceId: this.instanceId,
        assetType: this.assetType
      })
        .then(res => {
          this.$message.success('后台任务执行中！')
        })
    },
    handleRowTagEdit (row) {
      this.businessId = row.id
      const businessTags = {
        tagIds: row.tags !== null ? row.tags.map(e => e.id) : []
      }
      this.$refs.businessTagEditor.initData(businessTags)
      this.formStatus.businessTag.visible = true
    },
    handleRowDel (row) {
      this.$confirm('此操作将删除当前配置?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        DELETE_ASSET_BY_ID(row.id).then(res => {
          this.$message.success('删除成功!')
          this.fetchData()
        })
      }).catch(() => {
        this.$message.info('已取消删除!')
      })
    },
    fetchData () {
      this.table.loading = true
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
