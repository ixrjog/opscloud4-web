<!--suppress HtmlUnknownTag -->
<template>
  <d2-container>
    <div>
      <h1>集群配置</h1>
    </div>
    <el-row>
      <el-input v-model="queryParam.tagKey" size="mini" placeholder="标签关键字"/>
      <el-select v-model="queryParam.businessType" size="mini" clearable placeholder="业务类型">
        <el-option v-for="item in businessTypeOptions"
                   :key="item.value"
                   :label="item.label"
                   :value="item.value"/>
      </el-select>
      <el-button @click="fetchData" size="mini" class="button">查询</el-button>
    </el-row>
    <div style="height: 5px"/>
    <el-table :data="table.data" v-loading="table.loading" style="width: 100%" :row-class-name="tableRowClassName">
      <el-table-column prop="name" label="名称"/>
      <el-table-column prop="hostname" label="主机名"/>
      <el-table-column prop="hostIp" label="注册IP"/>
      <el-table-column prop="systemInfo" label="系统信息">
        <template v-slot="scope">
          <span v-if="scope.row.systemInfo !== null">
            {{ scope.row.systemInfo.cpu.cpuNum }}C/{{ util.bytesToSize(scope.row.systemInfo.mem.total) }}
          </span>
        </template>
      </el-table-column>
      <el-table-column prop="activeSessionMap" label="活动会话" width="250" sortable>
        <template v-slot="scope">
          <div>WebTerminal: {{ scope.row.activeSessionMap.WEB_TERMINAL }}</div>
          <div>KubernetesTerminal: {{ scope.row.activeSessionMap.KUBERNETES_TERMINAL }}</div>
          <div>SSH-Server: {{ scope.row.activeSessionMap.SSH_SERVER }}</div>
        </template>
      </el-table-column>
      <el-table-column prop="isActive" label="有效" width="80">
        <template v-slot="scope">
          <active-tag :is-active="scope.row.isActive"/>
        </template>
      </el-table-column>
      <el-table-column prop="comment" label="描述"></el-table-column>
      <el-table-column fixed="right" label="操作" width="280">
        <template v-slot="scope">
          <el-button :type="scope.row.isActive ? 'danger' : 'success'" plain size="mini"
                     @click="handleSetActive(scope.row)">{{ scope.row.isActive ? '无效' : '有效' }}
          </el-button>
        </template>
      </el-table-column>
    </el-table>
    <pagination :pagination="table.pagination" @paginationCurrentChange="paginationCurrentChange"
                @handleSizeChange="handleSizeChange"/>
  </d2-container>
</template>

<script>

import { QUERY_INSTANCE_PAGE, SET_INSTANCE_ACTIVE } from '@/api/modules/sys/sys.instance.api.js'
import Pagination from '../../../components/opscloud/common/page/Pagination'
import ActiveTag from '../../../components/opscloud/common/tag/ActiveTag'
import util from '@/libs/util'

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
      util: util,
      options: {
        stripe: true
      },
      queryParam: {
        extend: true
      },
      businessTypeOptions: [{
        label: 'OPSCLOUD实例',
        value: 'OPSCLOUD'
      }]
    }
  },
  mounted () {
    this.fetchData()
  },
  computed: {},
  components: {
    ActiveTag,
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
    tableRowClassName ({ row, rowIndex }) {
      if (row.isActive) {
        return 'warning-row'
      } else {
        return ''
      }
    },
    handleSetActive (row) {
      SET_INSTANCE_ACTIVE({ id: row.id })
        .then(res => {
          this.$message.success('设置成功!')
          this.fetchData()
        })
    },
    fetchData () {
      this.table.loading = true
      const requestBody = {
        ...this.queryParam,
        page: this.table.pagination.currentPage,
        length: this.table.pagination.pageSize
      }
      QUERY_INSTANCE_PAGE(requestBody)
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
