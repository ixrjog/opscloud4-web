<!--suppress HtmlUnknownTag -->
<template>
  <d2-container>
    <template>
      <div>
        <h1>{{ title }}</h1>
      </div>
      <el-row>
        <el-input v-model="queryParam.envName" size="mini" clearable placeholder="名称" class="input-bar"/>
        <el-button @click="fetchData" size="mini" class="button">查询</el-button>
        <el-button @click="handleAdd" size="mini" class="button">新增</el-button>
      </el-row>
      <div style="height: 5px"/>
      <el-table :data="table.data" style="width: 100%" v-loading="table.loading" :row-class-name="tableRowClassName"
                :default-sort="{prop: 'envType', order: 'ascending'}">
        <el-table-column prop="name" label="名称">
          <template v-slot="scope">
            <env-tag :env="scope.row"/>
          </template>
        </el-table-column>
        <el-table-column prop="name" label="终端提示色">
          <template v-slot="scope">
            <prompt-color-tag v-if="scope.row.promptColor !== null" :env="scope.row"
                              :promptColorOptions="promptColorOptions"/>
          </template>
        </el-table-column>
        <el-table-column prop="envType" label="类型值" sortable/>
        <el-table-column prop="seq" label="顺序" sortable/>
        <el-table-column prop="isActive" label="有效">
          <template v-slot="scope">
            <active-tag :is-active="scope.row.isActive"/>
          </template>
        </el-table-column>
        <el-table-column prop="comment" label="描述"/>
        <el-table-column fixed="right" label="操作" width="280">
          <template v-slot="scope">
            <el-button type="primary" plain size="mini" @click="handleRowUpdate(scope.row)">编辑</el-button>
            <el-button type="danger" plain size="mini" @click="handleRowDel(scope.row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
      <pagination :pagination="table.pagination" @paginationCurrentChange="paginationCurrentChange"
                  @handleSizeChange="handleSizeChange"/>
      <env-editor :formStatus="formStatus.env" ref="envEditor" :promptColorOptions="promptColorOptions"
                  @close="fetchData"/>
    </template>
  </d2-container>
</template>

<script>

// API
import { QUERY_ENV_PAGE, DELETE_ENV_BY_ID } from '@/api/modules/sys/sys.env.api.js'
import Pagination from '../../../components/opscloud/common/page/Pagination'
import EnvTag from '../../../components/opscloud/common/tag/EnvTag'
import EnvEditor from '../../../components/opscloud/sys/EnvEditor'
import PromptColorTag from '../../../components/opscloud/common/tag/PromptColorTag'
import ActiveTag from '@/components/opscloud/common/tag/ActiveTag'

const promptColorOptions = [{
  value: 0,
  label: 'BLACK'
}, {
  value: 1,
  label: 'RED'
}, {
  value: 2,
  label: 'GREEN'
}, {
  value: 3,
  label: 'YELLOW'
}, {
  value: 4,
  label: 'BLUE'
}, {
  value: 5,
  label: 'MAGENTA'
}, {
  value: 6,
  label: 'CYAN'
}, {
  value: 7,
  label: 'WHITE'
}, {
  value: 8,
  label: 'BRIGHT'
}]

export default {
  data () {
    return {
      title: '系统环境配置',
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
        env: {
          visible: false,
          addTitle: '新增环境类型配置',
          updateTitle: '更新环境类型配置',
          operationType: true
        }
      },
      queryParam: {
        envName: ''
      },
      promptColorOptions: promptColorOptions
    }
  },
  components: {
    EnvTag,
    EnvEditor,
    Pagination,
    ActiveTag,
    PromptColorTag
  },
  computed: {},
  mounted () {
    this.fetchData()
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
    tableRowClassName ({ row, rowIndex }) {
      if (row.isActive) {
        return 'warning-row'
      } else {
        return ''
      }
    },
    handleRowDel (row) {
      this.$confirm('此操作将删除当前配置?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        DELETE_ENV_BY_ID(row.id).then(res => {
          this.$message.success('删除成功!')
          this.fetchData()
        })
      }).catch(() => {
        this.$message.info('已取消删除!')
      })
    },
    handleAdd () {
      const env = {
        id: '',
        envName: '',
        envType: '',
        color: '',
        isActive: true,
        comment: ''
      }
      this.$refs.envEditor.initData(env)
      this.formStatus.env.operationType = true
      this.formStatus.env.visible = true
    },
    handleRowUpdate (row) {
      this.$refs.envEditor.initData(Object.assign({}, row))
      this.formStatus.env.operationType = false
      this.formStatus.env.visible = true
    },
    fetchData () {
      this.table.loading = true
      const requestBody = {
        ...this.queryParam,
        page: this.table.pagination.currentPage,
        length: this.table.pagination.pageSize
      }
      QUERY_ENV_PAGE(requestBody)
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
.input-bar {
  display: inline-block;
  max-width: 200px;
}

.button {
  margin-left: 5px;
}
</style>
