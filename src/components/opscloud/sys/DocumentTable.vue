<!--suppress HtmlUnknownTag -->
<template>
  <div>
    <el-row :gutter="24" style="margin-bottom: 5px; margin-left: 0">
      <el-input v-model="queryParam.queryName" @change="fetchData" placeholder="输入关键字查询"/>
      <el-select v-model="queryParam.mountZone" filterable clearable
                 remote reserve-keyword placeholder="搜索挂载区" :remote-method="getZone" @change="fetchData">
        <el-option v-for="item in zoneOptions"
                   :key="item.id"
                   :label="item.mountZone"
                   :value="item.mountZone">
          <select-item :name="item.mountZone" :comment="item.name"/>
        </el-option>
      </el-select>
      <el-select v-model="queryParam.isActive" clearable placeholder="有效" @change="fetchData">
        <el-option v-for="item in activeOptions"
                   :key="item.value"
                   :label="item.label"
                   :value="item.value"/>
      </el-select>
      <el-button @click="fetchData" class="button">查询</el-button>
      <el-button @click="handleAdd" class="button">新增</el-button>
    </el-row>
    <el-table :data="table.data" style="width: 100%" v-loading="table.loading" :row-class-name="tableRowClassName">
      <el-table-column prop="name" label="名称"/>
      <el-table-column prop="icon" label="图标">
        <template v-slot="scope">
          <i :class="scope.row.icon"/>
        </template>
      </el-table-column>
      <el-table-column prop="documentKey" label="Key"/>
      <el-table-column prop="mountZone" label="文档挂载区"/>
      <el-table-column prop="seq" label="顺序" sortable/>
      <el-table-column prop="isActive" label="有效">
        <template v-slot="scope">
          <active-tag :is-active="scope.row.isActive"/>
        </template>
      </el-table-column>
      <el-table-column label="操作" width="230">
        <template v-slot="scope">
          <el-button type="primary" plain size="mini" @click="handleRowEdit(scope.row)">编辑</el-button>
          <el-button type="danger" plain size="mini" @click="handleRowDel(scope.row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <pagination :pagination="table.pagination" @paginationCurrentChange="paginationCurrentChange"
                @handleSizeChange="handleSizeChange"/>
    <document-editor :formStatus="formStatus.doc" ref="documentEditor" @close="fetchData"/>
  </div>
</template>

<script>

import SelectItem from '../common/SelectItem'
import ActiveTag from '../common/tag/ActiveTag'
import Pagination from '../common/page/Pagination'
import { DELETE_DOCUMENT_BY_ID, QUERY_DOCUMENT_PAGE, QUERY_DOCUMENT_ZONE_PAGE } from '@/api/modules/sys/sys.doc.api'
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
        mountZone: '',
        isActive: '',
        extend: true
      },
      activeOptions: activeOptions,
      zoneOptions: []
    }
  },
  mounted () {
    this.getZone('')
  },
  computed: {},
  components: {
    Pagination,
    SelectItem,
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
    getZone (name) {
      const requestBody = {
        queryName: name,
        page: 1,
        length: 20
      }
      QUERY_DOCUMENT_ZONE_PAGE(requestBody)
        .then(res => {
          this.zoneOptions = res.body.data
        })
    },
    handleRowEdit (row) {
      this.$refs.documentEditor.initData(Object.assign({}, row))
      this.formStatus.doc.visible = true
      this.formStatus.doc.operationType = false
    },
    handleAdd () {
      const document = {
        id: '',
        name: '',
        icon: '',
        mountZone: '',
        seq: 1,
        documentKey: '',
        documentType: 1,
        isActive: true,
        content: '',
        comment: ''
      }
      this.$refs.documentEditor.initData(document)
      this.formStatus.doc.visible = true
      this.formStatus.doc.operationType = true
    },
    handleRowDel (row) {
      this.$confirm('此操作将删除当前配置?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        DELETE_DOCUMENT_BY_ID(row.id).then(res => {
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
