<template>
  <div v-show="queryParam.aliyunLogId !== ''">
    <el-row style="margin-bottom: 5px; margin-left: 0px" :gutter="20">
      <el-input v-model="queryParam.queryName" placeholder="关键字查询" class="input"/>
      <el-button @click="fetchData" class="button">查询</el-button>
      <el-button @click="handleAdd" style="margin-left: 5px">新增</el-button>
      <el-button @click="handlePush" style="margin-left: 5px">推送</el-button>
    </el-row>
    <el-table :data="table.data" style="width: 100%" v-loading="table.loading">
      <el-table-column prop="serverGroupName" label="服务器组名称"></el-table-column>
      <el-table-column prop="topic" label="自定义Topic">
        <template slot-scope="props">
          <el-tag style="margin-left: 5px" v-show="props.row.topic != null && props.row.topic != ''">
            {{ props.row.topic }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="env" label="环境" width="80">
        <template slot-scope="scope">
          <env-tag :env="scope.row.env"></env-tag>
        </template>
      </el-table-column>
      <el-table-column prop="ago" label="推送时间" width="100"></el-table-column>
      <el-table-column fixed="right" label="操作" width="240">
        <template slot-scope="scope">
          <el-button @click="handleRowPush(scope.row)" type="primary" plain size="mini" style="margin-left: 5px">推送
          </el-button>
          <el-button @click="handleRowEdit(scope.row)" type="primary" plain size="mini" style="margin-left: 5px">编辑
          </el-button>
          <el-popconfirm title="确定删除改配置吗？" @confirm="handleRowDel(scope.row)">
            <el-button slot="reference" type="danger" plain size="mini" style="margin-left: 5px">删除
            </el-button>
          </el-popconfirm>
        </template>
      </el-table-column>
    </el-table>
    <pagination :pagination="table.pagination" @paginationCurrentChange="paginationCurrentChange"
                @handleSizeChange="handleSizeChange"></pagination>
    <aliyun-log-member-editor ref="aliyunLogMemberEditor" :formStatus="formStatus.member"
                              @close="fetchData"></aliyun-log-member-editor>
  </div>
</template>

<script>

import {
  DELETE_LOG_MEMBER_BY_ID,
  QUERY_LOG_MEMBER_PAGE,
  PUSH_LOG_MEMBER_BY_ID
} from '@/api/modules/datasource/datasource.aliyun.log.member.api.js'
import { PUSH_LOG_BY_ID } from '@/api/modules/datasource/datasource.aliyun.log.api.js'
import Pagination from '../../../common/page/Pagination'
import AliyunLogMemberEditor from './AliyunLogMemberEditor'
import EnvTag from '../../../common/tag/EnvTag'

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
        member: {
          visible: false,
          addTitle: '新增日志服务配置成员',
          updateTitle: '更新日志服务配置成员',
          operationType: true
        }
      },
      queryParam: {
        extend: true,
        aliyunLogId: '',
        queryName: ''
      }
    }
  },
  name: 'AliyunLogMemberTable',
  mounted () {
  },
  computed: {},
  components: {
    Pagination,
    AliyunLogMemberEditor,
    EnvTag
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
    initData (logId) {
      this.queryParam.aliyunLogId = logId
      this.fetchData()
    },
    handleAdd () {
      let aliyunLogMember = {
        id: 0,
        aliyunLogId: this.queryParam.aliyunLogId,
        serverGroupId: '',
        serverGroupName: '',
        topic: '',
        envType: 0,
        comment: ''
      }
      this.formStatus.member.operationType = true
      this.formStatus.member.visible = true
      this.$refs.aliyunLogMemberEditor.initData(aliyunLogMember)
    },
    handlePush () {
       PUSH_LOG_BY_ID(this.queryParam.aliyunLogId)
        .then(res => {
          // 返回数据
          if (res.success) {
            this.$message({
              message: '推送成功',
              type: 'success'
            })
          } else {
            this.$message.error(res.msg)
          }
        })
    },
    handleRowPush (row) {
      PUSH_LOG_MEMBER_BY_ID(row.id)
        .then(res => {
          // 返回数据
          if (res.success) {
            this.$message({
              message: '推送成功',
              type: 'success'
            })
            this.fetchData()
          } else {
            this.$message.error(res.msg)
          }
        })
    },
    handleRowEdit (row) {
      this.formStatus.member.operationType = false
      this.formStatus.member.visible = true
      this.$refs.aliyunLogMemberEditor.initData(row)
    },
    handleRowDel (row) {
      DELETE_LOG_MEMBER_BY_ID(row.id)
        .then(res => {
          this.$message.success('删除成功')
          this.fetchData()
        })
    },
    fetchData () {
      this.table.loading = true
      let requestBody = {
        ...this.queryParam,
        page: this.table.pagination.currentPage,
        length: this.table.pagination.pageSize
      }
      QUERY_LOG_MEMBER_PAGE(requestBody)
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
