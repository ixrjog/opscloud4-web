<template>
  <div>
    <el-row :gutter="24">
      <el-select v-model="ticketEntry" filterable clearable value-key="name"
                 style="display: inline-block; width: 250px; margin-left: 10px"
                 remote reserve-keyword :placeholder="'输入关键词搜索'+ entryDesc" :remote-method="fetchData"
                 :loading="searchLoading">
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

import {
  QUERY_WORK_ORDER_TICKET_ENTRY,
  ADD_WORK_ORDER_TICKET_ENTRY
} from '@/api/modules/workorder/workorder.ticket.api'
import SelectItem from '@/components/opscloud/common/SelectItem'

export default {
  name: 'TicketEntrySelector',
  props: {
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
      searchLoading: false,
      buttonAdding: false,
      ticketEntry: '',
      ticketEntryOptions: []
    }
  },
  mounted () {
    this.fetchData('')
  },
  methods: {
    addTicketEntry () {
      this.buttonAdding = true
      ADD_WORK_ORDER_TICKET_ENTRY(this.ticketEntry)
        .then(res => {
          this.buttonAdding = false
          this.ticketEntry = ''
          this.handleNotify()
        }).catch(() => {
        this.buttonAdding = false
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
