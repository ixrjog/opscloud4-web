<template>
  <d2-container>
    <div>
      <h1>标签配置</h1>
    </div>
    <el-row :gutter="24" style="margin-bottom: 5px">
      <el-input v-model.trim="queryParam.tagKey" placeholder="标签关键字"/>
      <el-select v-model="queryParam.businessType" clearable placeholder="业务类型">
        <el-option
          v-for="item in businessTypeOptions"
          :key="item.value"
          :label="item.label"
          :value="item.value">
        </el-option>
      </el-select>
      <el-button @click="fetchData" class="button">查询</el-button>
      <el-button @click="handlerAdd" class="button">新增</el-button>
    </el-row>
    <el-table :data="table.data" style="width: 100%">
      <el-table-column prop="tagKey" label="标签关键字">
        <template slot-scope="scope">
          <el-tag disable-transitions :style="{ color: scope.row.color }">{{scope.row.tagKey}}</el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="businessTypeEnum" label="标签业务类型">
        <template slot-scope="scope">
          <el-tag disable-transitions>{{scope.row.businessTypeEnum}}</el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="comment" label="描述"></el-table-column>
      <el-table-column fixed="right" label="操作" width="280">
        <template slot-scope="scope">
          <el-button type="primary" plain size="mini" @click="handlerRowUpdate(scope.row)">编辑</el-button>
          <!--          <el-button type="danger" plain size="mini" @click="delItem(scope.row)">删除</el-button>-->
        </template>
      </el-table-column>
    </el-table>
    <pagination :pagination="table.pagination" @paginationCurrentChange="paginationCurrentChange"
                @handleSizeChange="handleSizeChange"></pagination>
    <tag-editor ref="tagEditor" :formStatus="formStatus.tag" :business-type-options="businessTypeOptions"
                @close="fetchData"></tag-editor>
  </d2-container>
</template>

<script>

import { GET_TAG_BUSINESS_OPTIONS, QUERY_TAG_PAGE } from '@/api/modules/tag/tag.api.js'
import Pagination from '../../../components/caesar/common/page/Pagination'
import TagEditor from '../../../components/caesar/tag/TagEditor'

export default {
  data () {
    return {
      formStatus: {
        tag: {
          visible: false,
          addTitle: '新增标签配置',
          updateTitle: '更新标签配置',
          operationType: true
        }
      },
      table: {
        data: [],
        loading: false,
        pagination: {
          currentPage: 1,
          pageSize: 10,
          total: 0
        }
      },
      businessTypeOptions: [],
      options: {
        stripe: true
      },
      queryParam: {
        tagKey: '',
        businessType: ''
      }
    }
  },
  mounted () {
    this.getBusinessTypeOptions()
    this.fetchData()
  },
  computed: {},
  components: {
    Pagination,
    TagEditor
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
    getBusinessTypeOptions () {
      GET_TAG_BUSINESS_OPTIONS()
        .then(res => {
          this.businessTypeOptions = res.body.options
        })
    },
    handlerAdd () {
      const tag = {
        id: '',
        tagKey: '',
        businessType: 0,
        color: '',
        comment: ''
      }
      this.formStatus.tag.operationType = true
      this.formStatus.tag.visible = true
      this.$refs.tagEditor.initData(tag)
    },
    handlerRowUpdate (row) {
      this.$refs.tagEditor.initData(row)
      this.formStatus.tag.operationType = false
      this.formStatus.tag.visible = true
    },
    fetchData () {
      this.table.loading = true
      const requestBody = {
        tagKey: this.queryParam.tagKey,
        businessType: this.queryParam.businessType,
        page: this.table.pagination.currentPage,
        length: this.table.pagination.pageSize
      }
      QUERY_TAG_PAGE(requestBody)
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
