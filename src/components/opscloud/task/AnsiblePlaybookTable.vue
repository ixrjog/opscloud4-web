<!--suppress HtmlUnknownTag -->
<template>
  <div>
    <el-row>
      <el-input v-model="queryParam.name" placeholder="名称" size="mini"/>
      <el-button size="mini" @click="fetchData">查询</el-button>
      <el-button size="mini" @click="handleAdd">新增</el-button>
    </el-row>
    <div style="height: 5px"/>
    <el-table :data="table.data" style="width: 100%" v-loading="table.loading">
      <el-table-column prop="name" label="名称" width="250px"></el-table-column>
      <el-table-column prop="playbook" label="剧本" width="800px">
        <template v-slot="scope">
          <el-divider content-position="left">
            <b style="color: #9d9fa3">Playbook</b>
          </el-divider>
          <my-highlight :code="scope.row.playbook" lang="yaml"/>
          <template v-if="scope.row.vars !== null && scope.row.vars !== ''">
            <el-divider content-position="left">
              <b style="color: #9d9fa3">Vars</b>
            </el-divider>
            <my-highlight :code="scope.row.vars" lang="yaml"/>
          </template>
          <template v-if="scope.row.tags !== null && scope.row.tags !== ''">
            <el-divider content-position="left">
              <b style="color: #9d9fa3">Tags</b>
            </el-divider>
            <my-highlight :code="scope.row.tags" lang="yaml"/>
          </template>
        </template>
      </el-table-column>
      <el-table-column prop="comment" label="描述"></el-table-column>
      <el-table-column label="操作" width="280">
        <template v-slot="scope">
          <el-button type="primary" plain size="mini" @click="handleRowUpdate(scope.row)">编辑</el-button>
          <el-button type="danger" plain size="mini" @click="handleRowDel(scope.row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <pagination :pagination="table.pagination" @paginationCurrentChange="paginationCurrentChange"
                @handleSizeChange="handleSizeChange"/>
    <ansible-playbook-editor :formStatus="formStatus.playbook" ref="playbookEditor" @close="fetchData"/>
  </div>
</template>

<script>

// API
import { QUERY_ANSIBLE_PLAYBOOK_PAGE, DELETE_ANSIBLE_PLAYBOOK_BY_ID } from '@/api/modules/task/task.playbook.api.js'
import Pagination from '../common/page/Pagination'
import AnsiblePlaybookEditor from './AnsiblePlaybookEditor'
import MyHighlight from '@/components/opscloud/common/MyHighlight'

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
        playbook: {
          operationType: true,
          visible: false,
          addTitle: '新增剧本配置',
          updateTitle: '更新剧本配置'
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
    MyHighlight,
    AnsiblePlaybookEditor,
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
      const playbook = {
        id: '',
        playbookUuid: '',
        name: '',
        playbook: '',
        vars: '',
        tags: '',
        comment: ''
      }
      this.$refs.playbookEditor.initData(playbook)
      this.formStatus.playbook.operationType = true
      this.formStatus.playbook.visible = true
    },
    handleRowUpdate (row) {
      this.$refs.playbookEditor.initData(Object.assign({}, row))
      this.formStatus.playbook.operationType = false
      this.formStatus.playbook.visible = true
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
