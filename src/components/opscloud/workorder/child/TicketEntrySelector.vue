<!--suppress HtmlUnknownTag -->
<template>
  <div>
    <el-row>
      <el-select v-model="ticketEntry" size="mini" filterable clearable value-key="name"
                 style="display: inline-block; width: 250px"
                 remote reserve-keyword :placeholder="$t('common.search.search') + ' '+ entryDesc.toLowerCase()" :remote-method="fetchData"
                 :loading="searchLoading">
        <el-option v-for="item in ticketEntryOptions"
                   :key="item.name"
                   :label="item.name"
                   :value="item">
          <select-item :name="item.name" :comment="item.comment"/>
        </el-option>
      </el-select>
      <el-button type="success" :disabled="ticketEntry === ''" plain size="mini" @click="addTicketEntry"
                 :loading="buttonAdding"
                 style="margin-left: 10px">{{ $t('common.add') }}
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
    },
    applicationId: {
      type: [String, Number],
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
      ADD_WORK_ORDER_TICKET_ENTRY(this.ticketEntry).then(res => {
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
        workOrderTicketId: this.workOrderTicketId,
        length: 20
      }
      if (this.applicationId !== '') {
        requestBody.applicationId = this.applicationId
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
