<template>
  <div>
    <el-form :model="groupData" label-width="120px">
      <el-form-item label="阿里云实例">
        <el-select v-model="instanceUuid" filterable value-key="instanceName"
                   style="width: 250px;" placeholder="选择数据源实例" reserve-keyword @change="selInstance">
          <el-option
            v-for="item in dsInstanceOptions"
            :key="item.uuid"
            :label="item.instanceName"
            :value="item.uuid">
            <select-item :name="item.instanceName" :comment="item.instanceType"></select-item>
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="ONS实例">
        <el-select v-model="ticketEntry" filterable value-key="name"
                   style="width: 250px;" remote reserve-keyword placeholder="输入关键词搜索ONS实例" :remote-method="fetchData"
                   :loading="searchLoading" :disabled="instanceUuid === ''" @change="onsInstanceChange">
          <el-option
            v-for="item in ticketEntryOptions"
            :key="item.name"
            :label="item.name"
            :value="item">
            <select-item :name="item.name" :comment="item.comment"></select-item>
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="GID" required>
        <el-input v-model="groupData.groupId" :disabled="added"></el-input>
        <el-alert type="info" show-icon :closable="false" style="margin-top: 10px">
          <li>以 “GID_”开头，只能包含大写字母、数字和下划线（_）</li>
          <li>长度限制在 7~64 字符之间</li>
          <li>Group ID 一旦创建，则无法修改</li>
        </el-alert>
      </el-form-item>
      <el-form-item label="客户端协议" required>
        <el-radio-group v-model="groupData.groupType" :disabled="added">
          <el-radio-button :label="groupType.tcp.type"></el-radio-button>
          <el-radio-button :label="groupType.http.type" disabled></el-radio-button>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="描述" required>
        <el-input v-model="groupData.remark" :disabled="added"  placeholder="请输入备注，例如:营销 - 促销优惠"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button plain type="primary" @click="addTicketEntry" :loading="buttonAdding">添加
        </el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>

import { QUERY_DATASOURCE_INSTANCE } from '@/api/modules/datasource/datasource.instance.api'
import {
  QUERY_WORK_ORDER_TICKET_ENTRY,
  ADD_WORK_ORDER_TICKET_ENTRY
} from '@/api/modules/workorder/workorder.ticket.api'
import SelectItem from '@/components/opscloud/common/SelectItem'
import OnsGroupGroupType from '@/components/opscloud/workorder/child/ticket.ons'

const groupData = {
  groupType: 'tcp',
  groupId: 'GID_',
  instanceId: '',
  remark: ''
}

export default {
  name: 'TicketOnsGroupForm',
  props: {
    workOrderTicketId: {
      type: Number,
      required: true
    }
  },
  components: {
    SelectItem
  },
  data () {
    return {
      added: false,
      instanceType: 'ALIYUN',
      groupData: {},
      instanceUuid: '',
      searchLoading: false,
      buttonAdding: false,
      dsInstanceOptions: '',
      ticketEntry: '',
      ticketEntryOptions: [],
      groupType: Object.assign({}, OnsGroupGroupType.group)
    }
  },
  mounted () {
  },
  methods: {
    initDate (ticketEntries) {
      if (JSON.stringify(ticketEntries) === '[]') {
        this.groupData = Object.assign({}, groupData)
        this.added = false
      } else {
        this.groupData = {
          groupId: ticketEntries[0].entry.groupId,
          remark: ticketEntries[0].entry.remark,
          groupType: ticketEntries[0].entry.groupType,
          instanceId: '',
          regionId: ''
        }
        this.added = true
      }
    },
    onsInstanceChange () {
      this.groupData.instanceId = this.ticketEntry.entry.assetId
      this.groupData.regionId = this.ticketEntry.entry.regionId
    },
    addTicketEntry () {
      if (this.groupData.instanceId === '') {
        this.$message.warning('请选择ONS实例')
        return
      }
      if (this.groupData.groupId === '' || this.groupData.groupId === 'GID_') {
        this.$message.warning('请输入GID名称')
        return
      }
      if (this.groupData.remark === '') {
        this.$message.warning('请输入GID描述')
        return
      }
      this.buttonAdding = true
      const requestBody = {
        ...this.ticketEntry,
        instanceUuid: this.ticketEntry.entry.instanceUuid
      }
      requestBody.name = requestBody.name + ':' + this.groupData.groupId
      requestBody.content = JSON.stringify(this.groupData)
      requestBody.comment = this.groupData.remark
      ADD_WORK_ORDER_TICKET_ENTRY(requestBody).then(() => {
        this.buttonAdding = false
        this.ticketEntry = ''
        this.handleNotify()
        this.added = true
      }).catch(() => {
        this.buttonAdding = false
      })
    },
    getDsInstance () {
      const requestBody = {
        instanceType: this.instanceType,
        isActive: true,
        extend: false
      }
      QUERY_DATASOURCE_INSTANCE(requestBody)
        .then(({ body }) => {
          if (body !== null) {
            this.dsInstanceOptions = body
            // 默认选择第一个数据源实例
            if (this.dsInstanceOptions.length !== 0) {
              this.instanceUuid = this.dsInstanceOptions[0].uuid
              this.fetchData('')
            }
          }
        })
    },
    selInstance () {
      this.fetchData('')
    },
    fetchData (name) {
      this.searchLoading = true
      const requestBody = {
        queryName: name,
        instanceUuid: this.instanceUuid,
        workOrderTicketId: this.workOrderTicketId,
        length: 20
      }
      QUERY_WORK_ORDER_TICKET_ENTRY(requestBody)
        .then(res => {
          this.ticketEntryOptions = res.body
          this.searchLoading = false
        })
    },
    handleNotify () {
      this.$emit('handleNotify')
    }
  }
}
</script>

<style scoped>

</style>
