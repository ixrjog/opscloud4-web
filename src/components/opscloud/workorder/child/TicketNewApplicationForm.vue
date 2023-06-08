<template>
  <div>
    <el-form :model="applicationData" label-width="120px">
      <el-form-item label="应用名称" required>
        <el-input v-model="applicationData.name"></el-input>
        <div style="margin-top: 5px">
          <my-highlight code="Application Name Regex: [a-z][\\d0-9a-z-]{3,32}" lang="json"></my-highlight>
        </div>
      </el-form-item>
      <el-form-item label="应用级别" required>
        <el-radio-group v-model="applicationData.levelTag">
          <el-radio-button label="A1"></el-radio-button>
          <el-radio-button label="A2"></el-radio-button>
          <el-radio-button label="A3"></el-radio-button>
          <el-radio-button label="B1"></el-radio-button>
          <el-radio-button label="B2"></el-radio-button>
          <el-radio-button label="B3"></el-radio-button>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="GitLab实例">
        <el-select v-model="instanceUuid" filterable value-key="instanceName"
                   style="width: 400px;" placeholder="选择数据源实例" reserve-keyword @change="selInstance">
          <el-option v-for="item in dsInstanceOptions" :key="item.uuid" :label="item.instanceName" :value="item.uuid">
            <select-item :name="item.instanceName" :comment="item.instanceType"></select-item>
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="GitLab项目" required>
        <el-select v-model="ticketEntry" filterable value-key="name"
                   style="width: 400px;" remote reserve-keyword placeholder="输入关键词搜索项目"
                   :remote-method="fetchData"
                   :loading="searchLoading" :disabled="instanceUuid === ''">
          <el-option v-for="item in ticketEntryOptions" :key="item.id" :label="item.entry.assetKey" :value="item">
            <select-item :name="item.entry.assetKey" :comment="item.comment"></select-item>
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="描述" required>
        <el-input v-model="applicationData.comment" placeholder="请输入应用描述"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button plain type="primary" @click="addTicketEntry" :disabled="JSON.stringify(ticketEntry) === '{}'"
                   :loading="buttonAdding">保存
        </el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>

import {
  QUERY_WORK_ORDER_TICKET_ENTRY,
  ADD_WORK_ORDER_TICKET_ENTRY
} from '@/api/modules/workorder/workorder.ticket.api'
import SelectItem from '@/components/opscloud/common/SelectItem'
import MyHighlight from '@/components/opscloud/common/MyHighlight.vue'
import { QUERY_DATASOURCE_INSTANCE } from '@/api/modules/datasource/datasource.instance.api'

const applicationData = {
  name: '',
  levelTag: 'B3',
  comment: ''
}

export default {
  name: 'TicketNewApplicationForm',
  props: {
    workOrderTicketId: {
      type: Number,
      required: true
    }
  },
  components: {
    MyHighlight,
    SelectItem
  },
  data () {
    return {
      instanceUuid: '',
      instanceType: 'GITLAB',
      applicationData: applicationData,
      searchLoading: false,
      buttonAdding: false,
      dsInstanceOptions: '',
      ticketEntry: {},
      ticketEntryOptions: []
    }
  },
  mounted () {
  },
  methods: {
    initDate () {
      this.getDsInstance()
    },
    addTicketEntry () {
      if (this.applicationData.name === '') {
        this.$message.warning('请输入应用名称')
        return
      }
      if (this.applicationData.tag === '') {
        this.$message.warning('请选择应用级别')
        return
      }
      if (this.applicationData.comment === '') {
        this.$message.warning('请输入应用描述')
        return
      }
      this.buttonAdding = true
      const requestBody = {
        ...this.ticketEntry,
        name: this.applicationData.name,
        comment: this.applicationData.comment
      }
      this.ticketEntry.entry.levelTag = this.applicationData.levelTag
      requestBody.content = JSON.stringify(this.ticketEntry.entry)
      ADD_WORK_ORDER_TICKET_ENTRY(requestBody).then(() => {
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
