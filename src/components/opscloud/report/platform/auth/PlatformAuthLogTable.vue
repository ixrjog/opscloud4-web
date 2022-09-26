<template>
  <div>
    <el-row :gutter="24" style="margin-bottom: 5px; margin-left: 0px;">
      <el-input v-model="queryParam.username" placeholder="输入关键字查询用户"/>
      <el-select v-model="queryParam.platformId" clearable placeholder="平台">
        <el-option
          v-for="item in platformOptions"
          :key="item.platformId"
          :label="item.name"
          :value="item.platformId">
        </el-option>
      </el-select>
      <el-select v-model="queryParam.result" clearable placeholder="认证结果">
        <el-option
          v-for="item in resultOptions"
          :key="item.value"
          :label="item.label"
          :value="item.value">
        </el-option>
      </el-select>
      <el-button @click="fetchData" class="button">查询</el-button>
    </el-row>
    <el-table :data="table.data" style="width: 100%" v-loading="table.loading">
      <el-table-column prop="platformName" label="平台" width="150" sortable></el-table-column>
      <el-table-column prop="username" label="用户名" width="300" sortable></el-table-column>
      <el-table-column prop="otp" label="使用OTP" width="100">
        <template slot-scope="scope">
          <el-tag :type="scope.row.otp ? 'success' : 'info'">{{
              scope.row.otp ? '是' : '否'
            }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="result" label="认证结果" width="150">
        <template slot-scope="scope">
          <el-tag :type="scope.row.result ? 'success' : 'danger'">{{
              scope.row.result ? '认证成功' : '认证失败'
            }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="createTime" label="认证时间" width="250">
        <template slot-scope="scope">
          <div>
            <span style="margin-right: 2px">{{ scope.row.createTime }}</span>
            <span style="color: #20A9D9">[{{ scope.row.ago }}]</span>
          </div>
        </template>
      </el-table-column>
      <el-table-column prop="resultMsg" label="认证信息"></el-table-column>
    </el-table>
    <pagination :pagination="table.pagination" @paginationCurrentChange="paginationCurrentChange"
                @handleSizeChange="handleSizeChange"></pagination>
  </div>
</template>

<script>

import { GET_PLATFORM_OPTIONS, QUERY_AUTH_PLATFORM_LOG_PAGE } from '@/api/modules/report/platform/platform.auth.api'
import Pagination from '@/components/opscloud/common/page/Pagination'

const resultOptions = [{
  value: true,
  label: '成功'
}, {
  value: false,
  label: '失败'
}]

export default {
  name: 'PlatformAuthLogTable',
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
      queryParam: {
        username: '',
        platformId: null,
        result: null,
        extend: true
      },
      tagOptions: [],
      platformOptions: [],
      resultOptions: resultOptions
    }
  },
  mounted () {
    this.fetchData()
    this.getPlatform()
  },
  computed: {},
  components: {
    Pagination
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
    getPlatform () {
      GET_PLATFORM_OPTIONS()
        .then(res => {
          this.platformOptions = res.body
        })
    },
    fetchData () {
      this.table.loading = true
      const requestBody = {
        ...this.queryParam,
        page: this.table.pagination.currentPage,
        length: this.table.pagination.pageSize
      }
      QUERY_AUTH_PLATFORM_LOG_PAGE(requestBody)
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

.el-select {
  margin-left: 5px;
}

.el-button {
  margin-left: 5px;
}

</style>
