<template>
  <div>
    <el-row :gutter="24" style="margin-bottom: 5px; margin-left: 0px;">
      <el-input v-model="queryParam.queryName" @change="fetchData" placeholder="输入关键字查询"/>
      <el-select v-model="queryParam.isActive" clearable placeholder="有效" @change="fetchData">
        <el-option
          v-for="item in activeOptions"
          :key="item.value"
          :label="item.label"
          :value="item.value">
        </el-option>
      </el-select>
      <el-button @click="fetchData" class="button">查询</el-button>
      <!--      <el-button @click="handleAdd" class="button">新增</el-button>-->
    </el-row>
    <el-table :data="table.data" style="width: 100%" v-loading="table.loading" :row-class-name="tableRowClassName">
      <el-table-column prop="name" label="名称"></el-table-column>
      <el-table-column prop="icon" label="图标">
        <template v-slot="scope">
          <i :class="scope.row.icon"></i>
        </template>
      </el-table-column>
      <el-table-column prop="documentKey" label="Key"></el-table-column>
      <el-table-column prop="mountZone" label="文档挂载区"></el-table-column>
      <el-table-column prop="seq" label="顺序" sortable></el-table-column>
      <el-table-column prop="isActive" label="有效">
        <template v-slot="scope">
          <active-tag :is-active="scope.row.isActive"></active-tag>
        </template>
      </el-table-column>
      <el-table-column label="操作" width="230">
        <template v-slot="scope">
          <el-button type="primary" plain size="mini" @click="handleRowEdit(scope.row)">编辑</el-button>
        </template>
      </el-table-column>
    </el-table>
    <pagination :pagination="table.pagination" @paginationCurrentChange="paginationCurrentChange"
                @handleSizeChange="handleSizeChange"></pagination>
    <document-editor :formStatus="formStatus.doc" ref="documentEditor"
                          @close="fetchData"></document-editor>
  </div>
</template>

<script>

import SelectItem from '../common/SelectItem'
import ActiveTag from '../common/tag/ActiveTag'
import BusinessTags from '../common/tag/BusinessTags'
import Pagination from '../common/page/Pagination'
import { QUERY_DOCUMENT_PAGE } from '@/api/modules/sys/sys.doc.api'
import DocumentEditor from '@/components/opscloud/sys/DocumentEditor.vue'

const activeOptions = [{
  value: true,
  label: '有效'
}, {
  value: false,
  label: '无效'
}]


export default {
  name: 'document-table',
  data () {
    return {
      instance: {
        id: ''
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
      formStatus: {
        doc: {
          visible: false,
          operationType: true,
          addTitle: '新增平台文档',
          updateTitle: '更新平台文档'
        }
      },
      queryParam: {
        queryName: '',
        isActive: '',
        extend: true
      },
      activeOptions: activeOptions
    }
  },
  mounted () {
  },
  computed: {},
  components: {
    Pagination,
    SelectItem,
    BusinessTags,
    ActiveTag,
    DocumentEditor
  },
  filters: {},
  methods: {
    paginationCurrentChange (currentPage) {
      this.table.pagination.currentPage = currentPage
      this.fetchData()
    },
    handleSizeChange (size) {
      this.table.pagination.pageSize = size
      this.fetchData()
    },
    tableRowClassName ({ row, rowIndex }) {
      if (!row.isActive) {
        return 'warning-row'
      } else {
        return ''
      }
    },
    handleRowEdit (row) {
      this.$refs.documentEditor.initData(Object.assign({}, row))
      this.formStatus.doc.visible = true
      this.formStatus.doc.operationType = false
    },
    handleAdd (){
      // documentEditor
    },
    fetchData () {
      this.table.loading = true
      const requestBody = {
        ...this.queryParam,
        page: this.table.pagination.currentPage,
        length: this.table.pagination.pageSize
      }
      QUERY_DOCUMENT_PAGE(requestBody)
        .then(res => {
          this.table.data = res.body.data
          this.table.pagination.total = res.body.totalNum
          this.table.loading = false
        })
    }
  }
}
</script>

<style>

.el-table .warning-row {
  background: oldlace;
}

.el-table .success-row {
  background: #f0f9eb;
}
</style>

<style scoped>

.el-input {
  display: inline-block;
  max-width: 200px;
}

.el-select {
  margin-left: 5px;
}

.el-button {
  margin-left: 5px;
}

</style>
