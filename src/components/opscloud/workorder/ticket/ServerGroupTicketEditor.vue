<template>
  <el-dialog :title="formStatus.operationType ? formStatus.addTitle : formStatus.updateTitle"
             :visible.sync="formStatus.visible">
    <el-tabs v-model="activeName">
      <el-tab-pane label="基本信息" name="base">
        <el-form :model="server">
          <el-form-item label="名称" :label-width="labelWidth" required>
            <el-input v-model.trim="server.name" placeholder="请输入内容"></el-input>
          </el-form-item>
          <el-form-item label="服务器类型" :label-width="labelWidth" required>
            <el-select v-model="server.serverType" placeholder="选择类型">
              <el-option
                v-for="item in serverTypeOptions"
                :key="item.value"
                :label="item.label"
                :value="item.value">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="服务器组" :label-width="labelWidth" required>
            <el-select v-model.trim="server.serverGroupId" filterable clearable
                       remote reserve-keyword placeholder="搜索服务器组" :remote-method="getGroup" @clear="getGroup('')">
              <el-option
                v-for="item in serverGroupOptions"
                :key="item.id"
                :label="item.name"
                :value="item.id">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="环境" :label-width="labelWidth" required>
            <el-select v-model.trim="server.envType" clearable
                       remote reserve-keyword placeholder="选择环境" :remote-method="getEnv">
              <el-option
                v-for="item in envOptions"
                :key="item.envType"
                :label="item.envName"
                :value="item.envType">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="系统类型" :label-width="labelWidth" required>
            <el-select v-model="server.osType" placeholder="选择类型">
              <el-option
                v-for="item in osTypeOptions"
                :key="item.value"
                :label="item.label"
                :value="item.value">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="有效" :label-width="labelWidth" required>
            <el-select v-model="server.isActive" placeholder="选择">
              <el-option
                v-for="item in activeOptions"
                :key="item.value"
                :label="item.label"
                :value="item.value">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="区" :label-width="labelWidth">
            <el-input v-model.trim="server.area" placeholder="请输入内容"></el-input>
          </el-form-item>
          <el-form-item label="公网ip" :label-width="labelWidth">
            <el-input v-model.trim="server.publicIp" placeholder="请输入内容"></el-input>
          </el-form-item>
          <el-form-item label="私网ip" :label-width="labelWidth" required>
            <el-input v-model.trim="server.privateIp" placeholder="请输入内容"></el-input>
          </el-form-item>
          <el-form-item label="序号" :label-width="labelWidth" required>
            <el-input v-model.number="server.serialNumber" placeholder="请输入内容"></el-input>
          </el-form-item>
          <el-form-item label="描述" :label-width="labelWidth">
            <el-input v-model.trim="server.comment" placeholder="请输入内容"></el-input>
          </el-form-item>
        </el-form>
      </el-tab-pane>
      <el-tab-pane label="属性配置" name="property" :disabled="server.id === '' || server.id === 0">
        <business-property-editor :business-type="server.businessType"
                                  :business-id="server.businessId"
                                  ref="businessPropertyEditor"></business-property-editor>
      </el-tab-pane>
      <el-tab-pane label="账户配置" name="account" :disabled="server.id === '' || server.id === 0">
        <server-account-transfer :serverId="server.id" ref="serverAccountTransfer"></server-account-transfer>
      </el-tab-pane>
    </el-tabs>
    <div slot="footer" class="dialog-footer">
      <el-button size="mini" @click="formStatus.visible = false">取消</el-button>
      <el-button size="mini" type="primary" @click="handleSave">确定</el-button>
    </div>
  </el-dialog>
</template>

<script>

import { QUERY_WORK_ORDER_TICKET_ENTRY } from '@/api/modules/workorder/workorder.ticket.api.js'
import { QUERY_SERVER_GROUP_PAGE } from '@/api/modules/server/server.group.api'

export default {
  data () {
    return {
      labelWidth: '150px',
    }
  },
  name: 'ServerGroupTicketEditor',
  props: ['formStatus'],
  components: {
  },
  mixins: [],
  mounted () {
  },
  methods: {
    getEntry (name) {
      const requestBody = {
        queryName: name,
        instanceUuid: '',
        workOrderTicketId: 1,
        length: 20
      }
      QUERY_WORK_ORDER_TICKET_ENTRY(requestBody)
        .then(res => {
          this.envOptions = res.body.data
        })
    },
    fetchData () {
      this.table.loading = true
      const requestBody = {
        ...this.queryParam,
        page: this.table.pagination.currentPage,
        length: this.table.pagination.pageSize
      }
      QUERY_SERVER_GROUP_PAGE(requestBody)
        .then(res => {
          this.table.data = res.body.data
          this.table.pagination.total = res.body.totalNum
          this.table.loading = false
        })
    }
  }
}
</script>
