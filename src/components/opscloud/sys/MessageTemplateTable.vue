<!--suppress HtmlUnknownTag -->
<template>
  <div>
    <el-row>
      <el-input v-model="queryParam.queryName" size="mini" @change="fetchData" placeholder="输入关键字查询"/>
      <el-button @click="fetchData" size="mini" class="button">查询</el-button>
    </el-row>
    <div style="height: 5px"/>
    <el-table :data="table.data" style="width: 100%" v-loading="table.loading">
      <el-table-column prop="name" label="名称"/>
      <el-table-column prop="msgKey" label="Key">
        <template v-slot="scope">
          <el-tag>{{ scope.row.msgKey }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="msgType" label="消息格式"/>
      <el-table-column prop="consumer" label="消费者"/>
      <el-table-column prop="title" label="消息标题"/>
      <el-table-column label="操作" width="230">
        <template v-slot="scope">
          <el-button type="primary" plain size="mini" @click="handleRowEdit(scope.row)">编辑</el-button>
        </template>
      </el-table-column>
    </el-table>
    <pagination :pagination="table.pagination" @paginationCurrentChange="paginationCurrentChange"
                @handleSizeChange="handleSizeChange"/>
    <message-template-editor :formStatus="formStatus.message" ref="messageTemplateEditor"
                             @close="fetchData"/>
  </div>
</template>

<script>

import Pagination from '../common/page/Pagination'
import { QUERY_MESSAGE_TEMPLATE_PAGE } from '@/api/modules/template/message.template.api'
import MessageTemplateEditor from '@/components/opscloud/sys/MessageTemplateEditor.vue'

export default {
  name: 'MessageTemplateTable',
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
        message: {
          visible: false,
          operationType: true,
          addTitle: '新增消息模板',
          updateTitle: '更新消息模板'
        }
      },
      queryParam: {
        queryName: '',
        extend: true
      }
    }
  },
  mounted () {
  },
  computed: {},
  components: {
    Pagination,
    MessageTemplateEditor
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
    handleRowEdit (row) {
      this.$refs.messageTemplateEditor.initData(Object.assign({}, row))
      this.formStatus.message.visible = true
      this.formStatus.message.operationType = false
    },
    fetchData () {
      this.table.loading = true
      const requestBody = {
        ...this.queryParam,
        page: this.table.pagination.currentPage,
        length: this.table.pagination.pageSize
      }
      QUERY_MESSAGE_TEMPLATE_PAGE(requestBody)
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
