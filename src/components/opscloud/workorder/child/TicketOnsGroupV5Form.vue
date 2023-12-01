<!--suppress HtmlUnknownTag -->
<template>
  <div>
    <el-form :model="groupData" label-width="120px">
      <el-form-item :label="$t('workOrder.onsTopicV5Ticket.instanceName')">
        <el-select v-model="instanceUuid" size="mini" filterable value-key="instanceName"
                   style="width: 250px;" :placeholder="$t('common.select.selectDatasourceInstance')" reserve-keyword
                   @change="selInstance">
          <el-option v-for="item in dsInstanceOptions"
                     :key="item.uuid"
                     :label="item.instanceName"
                     :value="item.uuid">
            <select-item :name="item.instanceName" :comment="item.instanceType"/>
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item :label="$t('workOrder.onsTopicV5Ticket.onsInstance')">
        <el-select v-model="ticketEntry" size="mini" filterable value-key="name"
                   style="width: 250px;" remote reserve-keyword :placeholder="$t('common.search.search')"
                   :remote-method="fetchData"
                   :loading="searchLoading" :disabled="instanceUuid === ''" @change="onsInstanceChange">
          <el-option v-for="item in ticketEntryOptions"
                     :key="item.name"
                     :label="item.name"
                     :value="item">
            <select-item :name="item.name" :comment="item.comment"/>
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="GID" required>
        <el-input v-model="groupData.consumerGroupId" :disabled="added" size="mini"/>
        <span style="height: 18px; font-size: 12px; color: #909399">
          {{ $t('workOrder.onsGroupV5Ticket.gidDesc') }}
        </span>
      </el-form-item>
      <el-form-item :label="$t('workOrder.onsGroupV5Ticket.deliveryOrder')" required>
        <el-radio-group v-model="groupData.deliveryOrderType" size="mini" :disabled="added">
          <el-radio-button :label="deliveryOrderType.concurrently.type">
            {{ $t('workOrder.onsGroupV5Ticket.deliveryOrderTypes.concurrently.name') }}
          </el-radio-button>
          <el-radio-button :label="deliveryOrderType.orderly.type">
            {{ $t('workOrder.onsGroupV5Ticket.deliveryOrderTypes.orderly.name') }}
          </el-radio-button>
        </el-radio-group>
        <el-alert type="info" :closable="false" style="margin-top: 10px; line-height: 1.5">
          <template v-slot:default>
            <i class="el-icon-info" style="font-size: 14px; color: #409eff;"/>
            {{ $t(getDeliveryOrderTypeDesc(groupData.deliveryOrderType)) }}
          </template>
        </el-alert>
        <div style="height: 10px"/>
        <el-card shadow="never">
          <el-form>
            <el-form-item :label="$t('workOrder.onsGroupV5Ticket.consumptionRetryPolicy')" required>
              <el-tag size="mini" type="info" v-if="groupData && groupData.consumeRetryPolicy">
                {{ $t(getRetryPolicyText(groupData.consumeRetryPolicy.retryPolicy)) }}
              </el-tag>
              <el-tooltip class="item" effect="dark" content="点击查看更多" placement="right" v-if="false">
                <el-link
                  href="https://help.aliyun.com/zh/apsaramq-for-rocketmq/cloud-message-queue-rocketmq-5-x-series/developer-reference/consumption-retries"
                  :underline="false" target="_blank">
                  <i class="el-icon-info" style="margin-left: 5px; height: 200%"/>
                </el-link>
              </el-tooltip>
              <el-alert type="info" :closable="false" style="margin-top: 10px;line-height: 1.5">
                <template v-slot:default v-if="groupData && groupData.consumeRetryPolicy">
                  <i class="el-icon-info" style="font-size: 14px;color: #409eff;"/>
                  {{ $t(getRetryPolicyDesc(groupData.consumeRetryPolicy.retryPolicy)) }}
                </template>
              </el-alert>
            </el-form-item>
            <el-form-item :label="$t('workOrder.onsGroupV5Ticket.maximumRetries')" required>
              <el-input-number v-model="groupData.consumeRetryPolicy.maxRetryTimes" :step="1" step-strictly :min="1"
                               :max="1000" size="mini" :disabled="added"
                               v-if="groupData && groupData.consumeRetryPolicy"></el-input-number>
            </el-form-item>
          </el-form>
        </el-card>
      </el-form-item>
      <el-form-item :label="$t('workOrder.onsGroupV5Ticket.desc')" required>
        <el-input v-model="groupData.remark" :disabled="added" placeholder="Enter a group description"
                  size="mini"/>
      </el-form-item>
      <el-form-item>
        <el-button plain type="primary" @click="addTicketEntry" :loading="buttonAdding" size="mini">
          {{ $t('common.add') }}
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
import OnsGroupV5 from '@/components/opscloud/workorder/child/ticket.ons'

const groupData = {
  instanceId: '',
  consumerGroupId: 'GID_',
  deliveryOrderType: 'Concurrently',
  consumeRetryPolicy: {
    retryPolicy: 'FixedRetryPolicy',
    maxRetryTimes: 16
  },
  remark: ''
}

export default {
  name: 'TicketOnsGroupV5Form',
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
      deliveryOrderType: Object.assign({}, OnsGroupV5.group5.deliveryOrderType),
      retryPolicy: Object.assign({}, OnsGroupV5.group5.retryPolicy)
    }
  },
  mounted () {
  },
  filters: {
    getRetryPolicyText (value) {
      switch (value) {
        case OnsGroupV5.group5.retryPolicy.fixedRetryPolicy.type:
          return OnsGroupV5.group5.retryPolicy.fixedRetryPolicy.desc
        case OnsGroupV5.group5.retryPolicy.defaultRetryPolicy.type:
          return OnsGroupV5.group5.retryPolicy.defaultRetryPolicy.desc
        default:
          return value
      }
    }
  },
  watch: {
    'groupData.deliveryOrderType': {
      handler (newName, oldName) {
        switch (newName) {
          case 'Concurrently':
            this.groupData.consumeRetryPolicy.retryPolicy = 'DefaultRetryPolicy'
            break
          case 'Orderly':
            this.groupData.consumeRetryPolicy.retryPolicy = 'FixedRetryPolicy'
        }
      }
    }
  },
  methods: {
    initDate (ticketEntries) {
      if (JSON.stringify(ticketEntries) === '[]') {
        this.groupData = Object.assign({}, groupData)
        this.added = false
      } else {
        this.groupData = {
          consumerGroupId: ticketEntries[0].entry.consumerGroupId,
          remark: ticketEntries[0].entry.remark,
          consumeRetryPolicy: Object.assign({}, ticketEntries[0].entry.consumeRetryPolicy),
          deliveryOrderType: ticketEntries[0].entry.deliveryOrderType,
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
      if (this.groupData.consumerGroupId === '' || this.groupData.consumerGroupId === 'GID_') {
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
      requestBody.name = requestBody.name + ':' + this.groupData.consumerGroupId
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
    getDeliveryOrderTypeDesc (type) {
      switch (type) {
        case 'Concurrently':
          return 'workOrder.onsGroupV5Ticket.deliveryOrderTypes.concurrently.desc'
        case 'Orderly':
          return 'workOrder.onsGroupV5Ticket.deliveryOrderTypes.orderly.desc'
      }
    },
    getRetryPolicyText (type) {
      switch (type) {
        case 'DefaultRetryPolicy':
          return 'workOrder.onsGroupV5Ticket.retryPolicy.defaultRetryPolicy.text'
        case 'FixedRetryPolicy':
          return 'workOrder.onsGroupV5Ticket.retryPolicy.fixedRetryPolicy.text'
      }
    },
    getRetryPolicyDesc (type) {
      switch (type) {
        case 'DefaultRetryPolicy':
          return 'workOrder.onsGroupV5Ticket.retryPolicy.defaultRetryPolicy.desc'
        case 'FixedRetryPolicy':
          return 'workOrder.onsGroupV5Ticket.retryPolicy.fixedRetryPolicy.desc'
      }
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
