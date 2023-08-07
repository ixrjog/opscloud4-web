<!--suppress HtmlUnknownTag -->
<template>
  <div>
    <el-row>
      <el-select v-model="applicationName" size="mini" filterable clearable style="margin-left: 5px; width: 250px;"
                 remote reserve-keyword placeholder="Search and select my app" :remote-method="getApplication"
                 @change="handleChange">
        <el-option v-for="item in applicationOptions"
                   :key="item.id"
                   :label="item.name"
                   :value="item.name">
          <select-item :name="item.name" :comment="item.comment"/>
        </el-option>
      </el-select>
      <el-select v-model="ticketEntry" size="mini" filterable clearable value-key="name" :disabled="applicationName === ''"
                 style="display: inline-block; width: 250px; margin-left: 10px"
                 reserve-keyword placeholder="Select build version"
                 :loading="searchLoading">
        <el-option v-for="item in ticketEntryOptions"
                   :key="item.name"
                   :label="item.name"
                   :value="item">
          <select-item :name="item.name" :comment="item.comment"/>
        </el-option>
      </el-select>
      <el-button type="success" :disabled="ticketEntry === ''" plain size="mini" @click="addTicketEntry()"
                 :loading="buttonAdding"
                 style="margin-left: 10px">Add
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
import { QUERY_MY_APPLICATION_PAGE } from '@/api/modules/application/application.api'

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
      applicationName: '',
      applicationOptions: [],
      searchLoading: false,
      buttonAdding: false,
      ticketEntry: '',
      ticketEntryOptions: []
    }
  },
  mounted () {
    this.getApplication('')
  },
  methods: {
    addTicketEntry () {
      this.buttonAdding = true
      ADD_WORK_ORDER_TICKET_ENTRY(this.ticketEntry).then(res => {
        this.buttonAdding = false
        this.ticketEntry = ''
        this.handleNotify()
      }).catch(() => {
        this.buttonAdding = false
      })
    },
    getApplication (name) {
      const requestBody = {
        queryName: name,
        extend: false,
        page: 1,
        length: 30
      }
      QUERY_MY_APPLICATION_PAGE(requestBody)
        .then(res => {
          this.applicationOptions = res.body.data
        })
    },
    handleChange () {
      this.ticketEntryOptions = []
      this.ticketEntry = ''
      if (this.applicationName !== '') {
        this.fetchData()
      }
    },
    fetchData () {
      if (this.applicationName === '') return
      this.searchLoading = true
      const requestBody = {
        queryName: this.applicationName,
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
