<template>
  <div>
    <el-row :gutter="24" style="margin-bottom: 5px; margin-left: 0px;">
      <el-input v-model.trim="queryParam.name" placeholder="名称"/>
      <el-button @click="fetchData">查询</el-button>
      <el-button @click="handleAdd">新增</el-button>
    </el-row>
    <el-table :data="table.data" style="width: 100%" v-loading="table.loading">
      <el-table-column prop="name" label="名称" width="250px"></el-table-column>
      <el-table-column prop="playbook" label="剧本" width="600px">
        <template slot-scope="scope">
          <d2-highlight :code="scope.row.playbook" lang="yaml"></d2-highlight>
        </template>
      </el-table-column>
      <el-table-column prop="comment" label="描述"></el-table-column>
      <el-table-column label="操作" width="280">
        <template slot-scope="scope">
          <el-button type="primary" plain size="mini" @click="handleRowUpdate(scope.row)">编辑</el-button>
          <el-button type="danger" plain size="mini" @click="handleRowDel(scope.row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <pagination :pagination="table.pagination" @paginationCurrentChange="paginationCurrentChange"
                @handleSizeChange="handleSizeChange"></pagination>
    <server-group-editor :formStatus="formStatus.serverGroup" ref="serverGroupEditor"
                         @close="fetchData"></server-group-editor>
  </div>
</template>

<script>

// API
import { QUERY_ANSIBLE_PLAYBOOK_PAGE, DELETE_ANSIBLE_PLAYBOOK_BY_ID } from '@/api/modules/task/task.playbook.api.js'
import ServerGroupEditor from '../server/ServerGroupEditor'
import Pagination from '../common/page/Pagination'


export default {
  name: 'AnsiblePlaybookTable',
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
        serverGroup: {
          operationType: true,
          visible: false,
          addTitle: '新增服务器组配置',
          updateTitle: '更新服务器组配置'
        }
      },
      options: {
        stripe: true
      },
      queryParam: {
        name: '',
        extend: true
      }
    }
  },
  mounted () {
    this.fetchData()
  },
  computed: {},
  components: {
    ServerGroupEditor,
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
    handleRowDel (row) {
      this.$confirm('此操作将删除当前配置?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        DELETE_ANSIBLE_PLAYBOOK_BY_ID(row.id).then(res => {
          this.$message.success('删除成功!')
          this.fetchData()
        })
      }).catch(() => {
        this.$message.info('已取消删除!')
      })
    },
    handleAdd () {
      const serverGroup = {
        id: '',
        name: 'group_',
        allowWorkorder: true,
        serverGroupTypeId: '',
        serverGroupType: {},
        businessProperty: null,
        comment: ''
      }
      this.$refs.serverGroupEditor.initData(serverGroup)
      this.formStatus.serverGroup.operationType = true
      this.formStatus.serverGroup.visible = true
    },
    handleRowUpdate (row) {
      this.$refs.serverGroupEditor.initData(Object.assign({}, row))
      this.formStatus.serverGroup.operationType = false
      this.formStatus.serverGroup.visible = true
    },
    fetchData () {
      this.table.loading = true
      const requestBody = {
        ...this.queryParam,
        page: this.table.pagination.currentPage,
        length: this.table.pagination.pageSize
      }
      QUERY_ANSIBLE_PLAYBOOK_PAGE(requestBody)
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

  .d2-highlight {
    margin-top: 5px;
    font-size: 10px;
    background-color: #dad8c8;
    line-height: 110%;
  }

  .el-button {
    margin-left: 5px;
  }

</style>
