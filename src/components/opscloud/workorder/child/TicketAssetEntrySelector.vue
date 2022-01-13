<template>
  <div>
    <el-row :gutter="24">
      <el-select v-model="instanceUuid" filterable clearable value-key="instanceName"
                 placeholder="选择数据源实例" style="display: inline-block; width: 250px; margin-left: 10px" reserve-keyword>
        <el-option
          v-for="item in dsInstanceOptions"
          :key="item.uuid"
          :label="item.instanceName"
          :value="item.uuid">
          <select-item :name="item.instanceName" :comment="item.instanceType"></select-item>
        </el-option>
      </el-select>
      <el-select v-model="ticketEntry" filterable clearable value-key="name"
                 style="display: inline-block; width: 250px; margin-left: 10px"
                 remote reserve-keyword :placeholder="'输入关键词搜索'+ entryDesc" :remote-method="fetchData"
                 :loading="searchLoading" :disabled="instanceUuid === ''">
        <el-option
          v-for="item in ticketEntryOptions"
          :key="item.name"
          :label="item.name"
          :value="item">
          <select-item :name="item.name" :comment="item.comment"></select-item>
        </el-option>
      </el-select>
      <el-button type="success" :disabled="ticketEntry === ''" plain size="mini" @click="addTicketEntry()"
                 :loading="buttonAdding"
                 style="margin-left: 10px">添加
      </el-button>
    </el-row>
  </div>
</template>

<script>

import { QUERY_DATASOURCE_INSTANCE } from '@/api/modules/datasource/datasource.instance.api'
import {
  QUERY_WORK_ORDER_TICKET_ENTRY,
  ADD_WORK_ORDER_TICKET_ENTRY
} from '@/api/modules/workorder/workorder.ticket.api'
import SelectItem from '@/components/opscloud/common/SelectItem'

export default {
  name: 'TicketAssetEntrySelector',
  props: {
    instanceType: {
      type: String,
      required: false
    },
    assetType: {
      type: String,
      required: true
    },
    workOrderTicketId: {
      type: Number,
      required: false,
      default: () => 0
    },
    entryDesc: {
      type: String,
      required: false,
      default: () => ''
    }
  },
  components: {
    SelectItem
  },
  data () {
    return {
      instanceUuid: '',
      searchLoading: false,
      buttonAdding: false,
      dsInstanceOptions: '',
      ticketEntry: '',
      ticketEntryOptions: []
    }
  },
  mounted () {
    this.getDsInstance()
  },
  methods: {
    addTicketEntry () {
      this.buttonAdding = true
      const requestBody = {
        ...this.ticketEntry,
        instanceUuid: this.ticketEntry.entry.instanceUuid
      }
      ADD_WORK_ORDER_TICKET_ENTRY(requestBody)
        .then(res => {
          this.buttonAdding = false
          this.ticketEntry = ''
          this.handleNotify()
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
            }
          }
        })
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
