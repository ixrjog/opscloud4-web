<template>
  <div>
    <el-form :model="topicData" label-width="120px">
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
      <el-form-item label="Topic" required>
        <el-input v-model="topicData.topic" :disabled="added"></el-input>
        <el-alert type="warning" show-icon :closable="false" style="margin-top: 10px">
          <li>Topic只能以 “TOPIC_”开头，包含大写英文、数字和下划线（_）</li>
          <li>长度限制在3~64个字符之间</li>
          <li>Topic一旦创建，则无法修改</li>
        </el-alert>
      </el-form-item>
      <el-form-item label="消息类型" required>
        <el-radio-group v-model="topicData.messageType" :disabled="added">
          <el-radio-button :label="messageType.type0.type">{{ messageType.type0.desc }}</el-radio-button>
          <el-radio-button :label="messageType.type1.type">{{ messageType.type1.desc }}</el-radio-button>
          <el-radio-button :label="messageType.type2.type">{{ messageType.type2.desc }}</el-radio-button>
          <el-radio-button :label="messageType.type4.type">{{ messageType.type4.desc }}</el-radio-button>
          <el-radio-button :label="messageType.type5.type">{{ messageType.type5.desc }}</el-radio-button>
        </el-radio-group>
        <el-tooltip class="item" effect="dark" content="消息类型概述，点击查看" placement="right">
          <el-link
            href="https://help.aliyun.com/document_detail/172114.html?spm=5176.11065259.1996646101.searchclickresult.38ad6704oBWYjo"
            :underline="false" target="_blank">
            <i class="el-icon-info" style="margin-left: 5px;height: 200%"></i>
          </el-link>
        </el-tooltip>
      </el-form-item>
      <el-form-item label="描述" required>
        <el-input v-model="topicData.remark" :disabled="added"></el-input>
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
import OnsTopicMessageType from '@/components/opscloud/workorder/child/ticket.ons'

const topicData = {
  topic: 'TOPIC_',
  remark: '',
  messageType: 0,
  instanceId: '',
  regionId: ''
}

export default {
  name: 'TicketOnsTopicForm',
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
      topicData: {},
      instanceUuid: '',
      searchLoading: false,
      buttonAdding: false,
      dsInstanceOptions: '',
      ticketEntry: '',
      ticketEntryOptions: [],
      messageType: Object.assign({}, OnsTopicMessageType.topic)
    }
  },
  mounted () {
  },
  methods: {
    initDate (ticketEntries) {
      if (JSON.stringify(ticketEntries) === '[]') {
        this.topicData = Object.assign({}, topicData)
        this.added = false
      } else {
        this.topicData = {
          topic: ticketEntries[0].entry.topic,
          remark: ticketEntries[0].entry.remark,
          messageType: ticketEntries[0].entry.messageType,
          instanceId: '',
          regionId: ''
        }
        this.added = true
      }
    },
    onsInstanceChange () {
      this.topicData.instanceId = this.ticketEntry.entry.assetId
      this.topicData.regionId = this.ticketEntry.entry.regionId
    },
    addTicketEntry () {
      if (this.topicData.instanceId === '') {
        this.$message.warning('请选择ONS实例')
        return
      }
      if (this.topicData.topic === '' || this.topicData.topic === 'TOPIC_') {
        this.$message.warning('请输入TOPIC名称')
        return
      }
      if (this.topicData.remark === '') {
        this.$message.warning('请输入TOPIC描述')
        return
      }
      this.buttonAdding = true
      this.added = true
      const requestBody = {
        ...this.ticketEntry,
        instanceUuid: this.ticketEntry.entry.instanceUuid
      }
      requestBody.name = requestBody.name + ':' + this.topicData.topic
      requestBody.content = JSON.stringify(this.topicData)
      requestBody.comment = this.topicData.remark
      ADD_WORK_ORDER_TICKET_ENTRY(requestBody).then(() => {
        this.buttonAdding = false
        this.ticketEntry = ''
        this.handleNotify()
      }).catch(() => {
        this.buttonAdding = false
        this.added = false
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
