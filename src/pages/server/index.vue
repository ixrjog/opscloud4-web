<template>
  <d2-container>
    <template>
      <div>
        <h1>{{title}}</h1>
      </div>
      <el-row :gutter="24" style="margin-bottom: 5px">
        <el-input v-model.trim="queryParam.queryName" placeholder="输入关键字查询" class="input-bar"/>
        <el-select v-model.trim="queryParam.serverGroupId" filterable clearable class="select-bar"
                   remote reserve-keyword placeholder="搜索服务器组" :remote-method="getServerGroup" :loading="loading">
          <el-option
            v-for="item in serverGroupOptions"
            :key="item.id"
            :label="item.name"
            :value="item.id">
          </el-option>
        </el-select>
        <el-select v-model="queryParam.envType" clearable placeholder="环境" class="select-bar">
          <el-option
            v-for="item in envTypeOptions"
            :key="item.id"
            :label="item.envName"
            :value="item.envType">
          </el-option>
        </el-select>
        <el-select v-model="queryParam.isActive" clearable placeholder="有效" class="select-bar">
          <el-option
            v-for="item in activeOptions"
            :key="item.value"
            :label="item.label"
            :value="item.value">
          </el-option>
        </el-select>
        <el-select v-model="queryParam.serverStatus" clearable placeholder="状态" class="select-bar">
          <el-option
            v-for="item in serverStatusOptions"
            :key="item.value"
            :label="item.label"
            :value="item.value">
          </el-option>
        </el-select>
        <el-select
          v-model="queryParam.tagId" filterable clearable remote reserve-keyword class="select-bar"
          placeholder="请输入关键词搜索标签" :remote-method="getTag" :loading="loading">
          <el-option
            v-for="item in tagOptions"
            :key="item.id"
            :label="item.tagKey"
            :value="item.id">
          </el-option>
        </el-select>
        <el-button @click="fetchData" class="button">查询</el-button>
        <el-button @click="handlerAdd" class="button">新增</el-button>
      </el-row>
      <el-table :data="tableData" style="width: 100%" v-loading="loading">
        <el-table-column type="expand">
          <template slot-scope="props">
            <el-form label-position="left" inline class="table-expand">
              <el-form-item label="服务器类型">
                <span>{{props.row.serverType | getServerTypeText}}</span>
              </el-form-item>
              <el-form-item label="服务器描述">
                <span>{{ props.row.comment }}</span>
              </el-form-item>
              <el-form-item label="服务器组">
                <span>{{ props.row.serverGroup.name }}</span>
              </el-form-item>
              <el-form-item label="服务器组描述">
                <span>{{ props.row.serverGroup.comment }}</span>
              </el-form-item>
              <el-form-item label="服务器组类型">
                <el-tag disable-transitions :style="{ color: props.row.serverGroup.serverGroupType.color }">
                  {{props.row.serverGroup.serverGroupType.name}}
                </el-tag>
              </el-form-item>
              <el-form-item label="登录类型">
                <span>{{props.row.loginType | getLoginTypeText}}</span>
              </el-form-item>
              <el-form-item label="登录用户">
                <span>{{ props.row.loginUser }}</span>
              </el-form-item>
              <el-form-item label="区">
                <span>{{ props.row.area }}</span>
              </el-form-item>
              <el-form-item label="监控状态">
                <el-tag disable-transitions :type="props.row.monitorStatus | getMonitorStatusType ">{{
                  props.row.monitorStatus | getMonitorStatusText}}
                </el-tag>
              </el-form-item>
            </el-form>
          </template>
        </el-table-column>
        <el-table-column prop="name" label="名称"></el-table-column>
        <el-table-column prop="serialNumber" label="序号" width="80" sortable></el-table-column>
        <el-table-column prop="publicIp" label="公网ip"></el-table-column>
        <el-table-column prop="privateIp" label="私网ip"></el-table-column>
        <el-table-column prop="env" label="环境" width="80">
          <template slot-scope="scope">
            <env-tag :env="scope.row.env"></env-tag>
          </template>
        </el-table-column>
        <el-table-column prop="isActive" label="有效" width="80">
          <template slot-scope="scope">
            <active-tag :is-active="scope.row.isActive"></active-tag>
          </template>
        </el-table-column>
        <el-table-column prop="serverStatus" label="状态" width="80">
          <template slot-scope="scope">
            <el-tag disable-transitions :type="scope.row.serverStatus | getServerStatusType">{{
              scope.row.serverStatus | getServerStatusText}}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="tags" label="标签">
          <template slot-scope="props">
            <business-tags :tags="props.row.tags"></business-tags>
          </template>
        </el-table-column>
        <el-table-column fixed="right" label="操作" width="280">
          <template slot-scope="scope">
            <el-button type="primary" plain size="mini" @click="handlerRowTagEdit(scope.row)">标签</el-button>
            <el-button type="primary" plain size="mini" @click="handlerRowEdit(scope.row)">编辑</el-button>
            <el-button type="primary" plain size="mini" @click="handlerTerminal(scope.row)">登录</el-button>
            <el-button type="danger" plain size="mini" @click="handlerRowDel(scope.row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
      <el-pagination background @current-change="paginationCurrentChange" :page-sizes="[10, 15, 20, 25, 30]"
                     @size-change="handleSizeChange"
                     layout="sizes, prev, pager, next" :total="pagination.total" :current-page="pagination.currentPage"
                     :page-size="pagination.pageSize">
      </el-pagination>
      <!-- server编辑-->
      <server-dialog :formStatus="formStatus.server" ref="serverDialog" @closeDialog="fetchData"></server-dialog>
      <!-- tag编辑-->
      <tag-transfer-dialog :formStatus="formStatus.tagTransfer" ref="tagTransferDialog"
                           @closeDialog="fetchData"></tag-transfer-dialog>
      <!--      <terminal :formStatus="formXtermStatus" ref="xtermDialog"></terminal>-->
      <terminal-master :formStatus="formStatus.terminal" ref="terminalMaster"></terminal-master>
    </template>
  </d2-container>
</template>

<script>
  import { mapState, mapActions } from 'vuex'
  // Component
  import ServerDialog from '@/components/opscloud/dialog/ServerDialog'
  import TagTransferDialog from '@/components/opscloud/dialog/TagTransferDialog'
  import terminalMaster from '@/components/opscloud/xterm/TerminalMaster'

  // Filters
  import {
    getLoginTypeText, getMonitorStatusText, getMonitorStatusType, getServerTypeText, getServerStatusType,
    getServerStatusText
  } from '@/filters/server.js'
  // API
  import { queryEnvPage } from '@api/env/env.js'
  import { queryBusinessTag, queryTagPage } from '@api/tag/tag.js'
  import { queryServerGroupPage } from '@api/server/server.group.js'
  import { fuzzyQueryServerPage, deleteServerById } from '@api/server/server.js'
  import BusinessTags from '../../components/opscloud/common/BusinessTags'
  import EnvTag from '../../components/opscloud/common/EnvTag'
  import ActiveTag from '../../components/opscloud/common/ActiveTag'

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

  export default {
    data () {
      return {
        formStatus: {
          tagTransfer: {
            visible: false,
            title: '编辑服务器标签'
          },
          server: {
            visible: false,
            labelWidth: '150px',
            operationType: true,
            addTitle: '新增服务器配置',
            updateTitle: '更新服务器配置'
          },
          terminal: {
            visible: false
          }
        },
        tableData: [],
        options: {
          stripe: true
        },
        loading: false,
        pagination: {
          currentPage: 1,
          pageSize: 10,
          total: 0
        },
        queryParam: {
          queryName: '',
          serverGroupId: '',
          envType: '',
          tagId: '',
          isActive: '',
          serverStatus: ''
        },
        title: '服务器信息',
        tagOptions: [],
        envTypeOptions: [],
        serverGroupOptions: [],
        businessType: 1,
        activeOptions: activeOptions,
        serverStatusOptions: serverStatusOptions
      }
    },
    mounted () {
      this.initPageSize()
      this.fetchData()
      this.getEnvType()
      this.getTag('')
    },
    computed: {
      ...mapState('d2admin/user', [
        'info'
      ])
    },
    components: {
      ServerDialog,
      TagTransferDialog,
      terminalMaster,
      BusinessTags,
      EnvTag,
      ActiveTag
    },
    filters: {
      getLoginTypeText,
      getMonitorStatusText,
      getMonitorStatusType,
      getServerTypeText,
      getServerStatusType,
      getServerStatusText
    },
    methods: {
      ...mapActions({
        setPageSize: 'd2admin/user/set'
      }),
      handleSizeChange (size) {
        this.pagination.pageSize = size
        this.info.pageSize = size
        this.setPageSize(this.info)
        this.fetchData()
      },
      initPageSize () {
        if (typeof (this.info.pageSize) !== 'undefined') {
          this.pagination.pageSize = this.info.pageSize
        }
      },
      getTag (tagKey) {
        queryTagPage(tagKey, 1, 100)
          .then(res => {
            this.tagOptions = res.body.data
          })
      },
      getEnvType () {
        queryEnvPage('', '', 1, 20)
          .then(res => {
            this.envTypeOptions = res.body.data
          })
      },
      getServerGroup (queryName) {
        queryServerGroupPage(queryName, '', 1, 20)
          .then(res => {
            this.serverGroupOptions = res.body.data
          })
      },
      handleClick () {
        this.$emit('input', !this.value)
      },
      handlerTerminal (server) {
        this.formStatus.terminal.visible = true
        this.$refs.terminalMaster.open(server)
      },
      handlerRowDel (row) {
        this.$confirm('此操作将删除当前配置?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          deleteServerById(row.id).then(res => {
            this.fetchData()
            this.$message({
              type: 'success',
              message: '删除成功!'
            })
          })
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          })
        })
      },
      handlerRowTagEdit (row) {
        this.formStatus.tagTransfer.visible = true
        let tagTransfer = {
          businessId: row.id,
          businessType: this.businessType,
          tagIds: [],
          tagOptions: []
        }
        queryTagPage('', 1, 100)
          .then(res => {
            tagTransfer.tagOptions = res.body.data
          })
        queryBusinessTag(this.businessType, tagTransfer.businessId, '')
          .then(res => {
            for (let index in res.body) {
              tagTransfer.tagIds.push(res.body[index].id)
            }
          })
        this.formStatus.tagTransfer.visible = true
        this.$refs.tagTransferDialog.initData(tagTransfer)
      },
      handlerRowEdit (row) {
        // server
        let serverData = Object.assign({}, row)
        let serverGroupOptions = []
        serverGroupOptions.push(serverData.serverGroup)
        // form
        this.formStatus.server.visible = true
        this.formStatus.server.operationType = false
        this.$refs.serverDialog.initData(serverData, serverGroupOptions)
      },
      handlerAdd () {
        this.formStatus.server.operationType = true
        this.formStatus.server.visible = true
        let serverData = {
          serverGroup: '',
          id: '',
          name: '',
          serverGroupId: '',
          loginType: 0,
          loginUser: '',
          envType: 4,
          publicIp: '',
          privateIp: '',
          serverType: 0,
          area: '',
          serialNumber: 0,
          monitorStatus: -1,
          comment: '',
          // options
          serverGroupOptions: []
        }
        this.$refs.serverDialog.initData(serverData)
      },
      handleDialogCancel (done) {
        this.$message({
          message: '取消保存',
          type: 'warning'
        })
        done()
      },
      paginationCurrentChange (currentPage) {
        this.pagination.currentPage = currentPage
        this.fetchData()
      },
      fetchData () {
        this.loading = true
        let requestBody = Object.assign({}, this.queryParam)
        requestBody.extend = 1
        requestBody.page = this.pagination.currentPage
        requestBody.length = this.pagination.pageSize
        fuzzyQueryServerPage(requestBody)
          .then(res => {
            this.tableData = res.body.data
            this.pagination.total = res.body.totalNum
            this.loading = false
          })
      }
    }
  }
</script>

<style>
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

  .input-bar {
    display: inline-block;
    max-width: 200px;
    margin-left: 10px;
  }

  .select-bar {
    margin-left: 5px;
  }

  .button {
    margin-left: 5px;
  }
</style>
