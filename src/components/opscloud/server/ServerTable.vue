<template>
  <div>
    <el-row :gutter="24" style="margin-bottom: 5px; margin-left: 0px;">
      <el-input v-model="queryParam.queryName" @change="fetchData" placeholder="输入关键字查询"/>
      <el-select v-model="serverGroupTypeId" filterable clearable
                 remote reserve-keyword placeholder="输入关键词搜组类型" :remote-method="getGroupType" @change="getGroup">
        <el-option
          v-for="item in groupTypeOptions"
          :key="item.id"
          :label="item.name"
          :value="item.id">
          <select-item :name="item.name" :comment="item.comment"></select-item>
        </el-option>
      </el-select>
      <el-select v-model="queryParam.serverGroupId" filterable clearable
                 remote reserve-keyword placeholder="搜索服务器组" :remote-method="getGroup" @change="fetchData">
        <el-option
          v-for="item in serverGroupOptions"
          :key="item.id"
          :label="item.name"
          :value="item.id">
        </el-option>
      </el-select>
      <el-select v-model="queryParam.envType" clearable filterable
                 remote reserve-keyword placeholder="输入关键词搜索环境" :remote-method="getEnv" @change="fetchData">
        <el-option
          v-for="item in envOptions"
          :key="item.id"
          :label="item.envName"
          :value="item.envType">
          <select-item :name="item.envName" :comment="item.comment"></select-item>
        </el-option>
      </el-select>
      <el-select v-model="queryParam.isActive" clearable placeholder="有效" @change="fetchData">
        <el-option
          v-for="item in activeOptions"
          :key="item.value"
          :label="item.label"
          :value="item.value">
        </el-option>
      </el-select>
      <el-select v-model="queryParam.serverStatus" clearable placeholder="状态" v-if="false">
        <el-option
          v-for="item in serverStatusOptions"
          :key="item.value"
          :label="item.label"
          :value="item.value">
        </el-option>
      </el-select>
      <el-select
        v-model="queryParam.tagId" filterable clearable remote reserve-keyword
        placeholder="请输入关键词搜索标签" :remote-method="getTag" @change="fetchData">
        <el-option
          v-for="item in tagOptions"
          :key="item.id"
          :label="item.tagKey"
          :value="item.id">
        </el-option>
      </el-select>
      <el-select v-model="queryParam.monitorStatus" clearable placeholder="监控状态">
        <el-option
          v-for="item in serverMonitorStatusOptions"
          :key="item.value"
          :label="item.label"
          :value="item.value">
        </el-option>
      </el-select>
      <el-button @click="fetchData" class="button">查询</el-button>
      <el-button @click="handleAdd" class="button">新增</el-button>
      <el-button @click="handleScanMonitor" class="button">扫描监控</el-button>
    </el-row>
    <el-table :data="table.data" style="width: 100%" v-loading="table.loading" :row-class-name="tableRowClassName">
      <el-table-column label="名称 / 群组">
        <template v-slot="scope">
          <span>{{ scope.row.name }}</span>
          <el-button type="text" v-if="scope.row.document !== null" style="margin-left: 10px"
                     @click="handleDocRead(scope.row)"><i class="fab fa-creative-commons-share"></i>
          </el-button>
          <div>{{ scope.row.serverGroup.name }}</div>
        </template>
      </el-table-column>
      <el-table-column prop="serialNumber" label="序号" width="80" sortable></el-table-column>
      <el-table-column label="IP地址" width="150">
        <template v-slot="scope">
          <span>{{ scope.row.privateIp }}
            <span style="color: #8492a6 ; font-size: 12px">私有</span>
          </span>
          <div v-if="scope.row.publicIp">{{ scope.row.publicIp }}
            <span style="color: #8492a6 ; font-size: 12px">公有</span>
          </div>
        </template>
      </el-table-column>
      <el-table-column prop="env" label="环境" width="80">
        <template v-slot="scope">
          <env-tag :env="scope.row.env"></env-tag>
        </template>
      </el-table-column>
      <el-table-column prop="isActive" label="有效" width="80">
        <template v-slot="scope">
          <active-tag :is-active="scope.row.isActive"></active-tag>
        </template>
      </el-table-column>
      <!--      暂不启用状态展示-->
      <el-table-column prop="serverStatus" label="状态" width="80" v-if="false">
        <template v-slot="scope">
          <server-status-tag :serverStatus="scope.row.serverStatus"></server-status-tag>
        </template>
      </el-table-column>
      <el-table-column prop="monitorStatus" label="监控" width="80">
        <template v-slot="scope">
          <server-monitor-status-tag :monitorStatus="scope.row.monitorStatus"></server-monitor-status-tag>
        </template>
      </el-table-column>
      <el-table-column prop="account" label="账户">
        <template v-slot="scope">
          <account-tags :accounts="scope.row.accounts"></account-tags>
        </template>
      </el-table-column>
      <el-table-column prop="tags" label="标签">
        <template v-slot="scope">
          <business-tags :tags="scope.row.tags"></business-tags>
        </template>
      </el-table-column>
      <el-table-column label="操作" width="230">
        <template v-slot="scope">
          <el-button type="primary" plain size="mini" @click="handleRowEdit(scope.row)">编辑</el-button>
          <el-button type="primary" plain size="mini" @click="handleRowTagEdit(scope.row)">标签</el-button>
          <el-button type="danger" plain size="mini" @click="handleRowDel(scope.row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <pagination :pagination="table.pagination" @paginationCurrentChange="paginationCurrentChange"
                @handleSizeChange="handleSizeChange"></pagination>
    <server-editor :formStatus="formStatus.server" ref="serverEditor" @close="fetchData"></server-editor>
    <business-tag-editor ref="businessTagEditor" :business-type="businessType" :business-id="instance.id"
                         :form-status="formStatus.businessTag" @close="fetchData"></business-tag-editor>
    <business-doc-reader :form-status="formStatus.businessDoc" ref="businessDocReader"></business-doc-reader>
  </div>
</template>

<script>

import { QUERY_SERVER_PAGE, DELETE_SERVER_BY_ID, SCAN_SERVER_MONITOR } from '@/api/modules/server/server.api.js'
import { QUERY_TAG_PAGE } from '@/api/modules/tag/tag.api.js'
import { QUERY_ENV_PAGE } from '@/api/modules/sys/sys.env.api.js'
import { QUERY_SERVER_GROUP_PAGE } from '@/api/modules/server/server.group.api.js'
import SelectItem from '../common/SelectItem'
import ServerEditor from './ServerEditor'
import EnvTag from '../common/tag/EnvTag'
import ActiveTag from '../common/tag/ActiveTag'
import BusinessTags from '../common/tag/BusinessTags'
import ServerStatusTag from '../common/tag/ServerStatusTag'
import BusinessTagEditor from '../common/tag/BusinessTagEditor'
import AccountTags from '../common/tag/AccountTags'
import Pagination from '../common/page/Pagination'

import BusinessType from '@/components/opscloud/common/enums/business.type.js'
import ServerMonitorStatusTag from '@/components/opscloud/common/tag/ServerMonitorStatusTag'
import BusinessDocReader from '@/components/opscloud/business/BusinessDocReader'
import { QUERY_SERVER_GROUP_TYPE_PAGE } from '@/api/modules/server/server.group.type.api'

const activeOptions = [{
  value: true,
  label: '有效'
}, {
  value: false,
  label: '无效'
}]

const serverStatusOptions = [{
  value: 0,
  label: '离线'
}, {
  value: 1,
  label: '在线'
}, {
  value: -1,
  label: '未知'
}]

const serverMonitorStatusOptions = [{
  value: 0,
  label: '启用'
}, {
  value: 1,
  label: '禁用'
}, {
  value: -1,
  label: '未监控'
}]

export default {
  name: 'server-table',
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
        businessTag: {
          visible: false,
          title: '编辑数据源实例标签'
        },
        businessDoc: {
          visible: false,
          title: '服务器文档'
        },
        server: {
          visible: false,
          labelWidth: '150px',
          operationType: true,
          addTitle: '新增服务器配置',
          updateTitle: '更新服务器配置'
        }
      },
      queryParam: {
        queryName: '',
        serverGroupId: '',
        envType: '',
        tagId: '',
        isActive: '',
        serverStatus: '',
        monitorStatus: '',
        extend: true
      },
      serverGroupTypeId: '',
      tagOptions: [],
      envOptions: [],
      serverGroupOptions: [],
      businessType: BusinessType.SERVER,
      activeOptions: activeOptions,
      serverStatusOptions: serverStatusOptions,
      serverMonitorStatusOptions: serverMonitorStatusOptions,
      groupTypeOptions: []
    }
  },
  mounted () {
    this.fetchData()
    this.getEnv('')
    this.getTag('')
    this.getGroupType('')
    this.getGroup('')
  },
  computed: {},
  components: {
    Pagination,
    SelectItem,
    ServerEditor,
    BusinessTags,
    EnvTag,
    ActiveTag,
    ServerStatusTag,
    ServerMonitorStatusTag,
    BusinessTagEditor,
    AccountTags,
    BusinessDocReader
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
    getTag (name) {
      const requestBody = {
        tagKey: name,
        businessType: this.businessType,
        append: true,
        page: 1,
        length: 20
      }
      QUERY_TAG_PAGE(requestBody)
        .then(res => {
          this.tagOptions = res.body.data
        })
    },
    getEnv (name) {
      const requestBody = {
        envName: name,
        page: 1,
        length: 20
      }
      QUERY_ENV_PAGE(requestBody)
        .then(res => {
          this.envOptions = res.body.data
        })
    },
    getGroupType (name) {
      const requestBody = {
        name: name,
        page: 1,
        length: 10
      }
      QUERY_SERVER_GROUP_TYPE_PAGE(requestBody)
        .then(res => {
          this.groupTypeOptions = res.body.data
        })
    },
    getGroup (name) {
      const requestBody = {
        name: name,
        serverGroupTypeId: this.serverGroupTypeId,
        page: 1,
        length: 10
      }
      QUERY_SERVER_GROUP_PAGE(requestBody)
        .then(res => {
          this.serverGroupOptions = res.body.data
        })
    },
    handleRowTagEdit (row) {
      this.instance.id = row.id
      const businessTags = {
        tagIds: row.tags !== null ? row.tags.map(e => e.id) : []
      }
      this.$refs.businessTagEditor.initData(businessTags)
      this.formStatus.businessTag.visible = true
    },
    handleDocRead (row) {
      this.$refs.businessDocReader.initData(Object.assign({}, row.document))
      this.formStatus.businessDoc.visible = true
    },
    handleRowEdit (row) {
      this.formStatus.server.visible = true
      this.formStatus.server.operationType = false
      this.$refs.serverEditor.initData(Object.assign({}, row))
    },
    handleAdd () {
      const server = {
        serverGroup: {},
        id: '',
        name: '',
        serverGroupId: '',
        envType: 0,
        publicIp: '',
        privateIp: '',
        serverType: 0,
        area: '',
        serialNumber: 0,
        monitorStatus: -1,
        serverStatus: 1,
        isActive: true,
        osType: 'linux',
        comment: '',
        accounts: null
      }
      this.$refs.serverEditor.initData(server)
      this.formStatus.server.operationType = true
      this.formStatus.server.visible = true
    },
    handleRowDel (row) {
      this.$confirm('此操作将删除当前配置?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        DELETE_SERVER_BY_ID(row.id).then(res => {
          this.$message.success('删除成功!')
          this.fetchData()
        })
      }).catch(() => {
        this.$message.info('已取消删除!')
      })
    },
    handleScanMonitor () {
      SCAN_SERVER_MONITOR().then(res => {
        this.$message.success('扫描任务异步执行中!')
      })
    },
    fetchData () {
      this.table.loading = true
      const requestBody = {
        ...this.queryParam,
        page: this.table.pagination.currentPage,
        length: this.table.pagination.pageSize
      }
      QUERY_SERVER_PAGE(requestBody)
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
