<!--suppress HtmlUnknownTag -->
<template>
  <div>
    <el-row>
      <el-input v-model="queryParam.queryName" size="mini" @change="fetchData" placeholder="输入关键字查询"/>
      <el-select v-model="queryParam.isActive" size="mini" clearable placeholder="有效" @change="fetchData">
        <el-option v-for="item in activeOptions"
                   :key="item.value"
                   :label="item.label"
                   :value="item.value"/>
      </el-select>
      <el-button @click="fetchData" size="mini" class="button">查询</el-button>
    </el-row>
    <div style="height: 5px"/>
    <el-table :data="table.data" style="width: 100%" v-loading="table.loading" :row-class-name="tableRowClassName">
      <el-table-column prop="name" label="名称"/>
      <el-table-column prop="mountZone" label="文档挂载区"/>
      <el-table-column prop="isActive" label="有效">
        <template v-slot="scope">
          <active-tag :is-active="scope.row.isActive"/>
        </template>
      </el-table-column>
      <el-table-column prop="comment" label="描述"/>
      <el-table-column label="操作" width="230">
        <template v-slot="scope">
          <el-button type="primary" plain size="mini" @click="handleRowEdit(scope.row)">编辑</el-button>
        </template>
      </el-table-column>
    </el-table>
    <pagination :pagination="table.pagination" @paginationCurrentChange="paginationCurrentChange"
                @handleSizeChange="handleSizeChange"/>
    <!--    <server-editor :formStatus="formStatus.server" ref="serverEditor" @close="fetchData"></server-editor>-->
    <document-zone-editor :formStatus="formStatus.zone" ref="documentZoneEditor"
                          @close="fetchData"/>
  </div>
</template>

<script>

import ActiveTag from '../common/tag/ActiveTag'
import Pagination from '../common/page/Pagination'
import { QUERY_DOCUMENT_ZONE_PAGE } from '@/api/modules/sys/sys.doc.api'
import DocumentZoneEditor from '@/components/opscloud/sys/DocumentZoneEditor.vue'

const activeOptions = [{
  value: true,
  label: '有效'
}, {
  value: false,
  label: '无效'
}]

export default {
  name: 'document-zone-table',
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
        zone: {
          visible: false,
          labelWidth: '150px',
          operationType: true,
          updateTitle: '更新文档区域配置'
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
    ActiveTag,
    DocumentZoneEditor
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
      this.formStatus.zone.visible = true
      this.formStatus.zone.operationType = false
      this.$refs.documentZoneEditor.initData(Object.assign({}, row))
    },
    fetchData () {
      this.table.loading = true
      const requestBody = {
        ...this.queryParam,
        page: this.table.pagination.currentPage,
        length: this.table.pagination.pageSize
      }
      QUERY_DOCUMENT_ZONE_PAGE(requestBody)
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
