<template>
  <div>
    <el-row style="margin-bottom: 5px; margin-left: 0px" :gutter="20">
      <el-input v-model="queryParam.queryName" placeholder="关键字查询" class="input"/>
      <el-button @click="fetchData" class="button">查询</el-button>
      <el-button @click="handleRowAdd" style="margin-left: 5px">新增</el-button>
    </el-row>
    <el-table :data="table.data" style="width: 100%" v-loading="table.loading">
      <el-table-column prop="accountUid" label="主账户uid" v-if="false"></el-table-column>
      <el-table-column prop="project" label="日志服务配置">
        <template slot-scope="scope">
          <div>日志项目:
            <el-tag size="mini">{{ scope.row.project }}</el-tag>
          </div>
          <div>日志库:
            <el-tag size="mini">{{ scope.row.logstore }}</el-tag>
          </div>
          <div>Logtail配置:
            <el-tag size="mini">{{ scope.row.config }}</el-tag>
          </div>
        </template>
      </el-table-column>
      <el-table-column prop="logstore" label="日志库" v-if="false"></el-table-column>
      <el-table-column prop="config" label="Logtail配置" v-if="false"></el-table-column>
      <el-table-column prop="memberSize" label="成员" width="80">
        <template slot-scope="props">
          <el-tag style="margin-left: 5px" size="mini">{{ props.row.memberSize }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column fixed="right" label="操作" width="240">
        <template slot-scope="scope">
          <el-button @click="handleRowMember(scope.row)" type="primary" plain size="mini" style="margin-left: 5px">成员
          </el-button>
          <el-button @click="handleRowEdit(scope.row)" type="primary" plain size="mini" style="margin-left: 5px">编辑
          </el-button>
          <el-popconfirm title="确定删除该配置吗？" @confirm="handleRowDel(scope.row)">
            <el-button slot="reference" type="danger" plain size="mini" style="margin-left: 5px">删除</el-button>
          </el-popconfirm>
        </template>
      </el-table-column>
    </el-table>
    <pagination :pagination="table.pagination" @paginationCurrentChange="paginationCurrentChange"
                @handleSizeChange="handleSizeChange"></pagination>
    <aliyun-log-editor ref="aliyunLogEditor" :formStatus="formStatus.log" :instanceId="instanceId"
                       @close="fetchData"></aliyun-log-editor>
  </div>
</template>

<script>

// API
import { DELETE_LOG_BY_ID, QUERY_LOG_PAGE } from '@/api/modules/datasource/datasource.aliyun.log.api.js'
import AliyunLogEditor from './AliyunLogEditor'
import Pagination from '../../../common/page/Pagination'

export default {
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
        log: {
          visible: false,
          addTitle: '新增日志服务配置',
          updateTitle: '更新日志服务配置',
          operationType: true
        }
      },
      queryParam: {
        extend: true,
        queryName: ''
      }
    }
  },
  name: 'AliyunLogTable',
  props: ['instanceId'],
  mounted () {
  },
  computed: {},
  components: {
    Pagination,
    AliyunLogEditor
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
    handleRowAdd () {
      const aliyunLog = {
        id: '',
        datasourceInstanceId: this.instanceId,
        project: '',
        logstore: '',
        config: '',
        comment: ''
      }
      this.formStatus.log.operationType = true
      this.formStatus.log.visible = true
      this.$refs.aliyunLogEditor.initData(aliyunLog)
    },
    handleRowMember (row) {
      this.$emit('handleSelLog', row.id)
    },
    handleRowEdit (row) {
      this.formStatus.log.operationType = false
      this.formStatus.log.visible = true
      this.$refs.aliyunLogEditor.initData(Object.assign({}, row))
    },
    handleRowDel (row) {
      DELETE_LOG_BY_ID(row.id)
        .then(res => {
          this.$message.success('删除成功!')
          this.fetchData()
        })
    },
    fetchData () {
      this.table.loading = true
      const requestBody = {
        ...this.queryParam,
        instanceId: this.instanceId,
        page: this.table.pagination.currentPage,
        length: this.table.pagination.pageSize
      }
      QUERY_LOG_PAGE(requestBody)
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
.table-expand {
  font-size: 0;
}

.table-expand label {
  width: 150px;
  color: #99a9bf;
}

.table-expand .el-form-item {
  margin-right: 0;
  margin-bottom: 0;
  width: 50%;
}

.input {
  display: inline-block;
  max-width: 200px;
  margin-right: 5px;
}

.select {
  margin-right: 5px;
}

.button {
  margin-right: 5px;
}
</style>
