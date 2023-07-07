<!--suppress HtmlUnknownTag -->
<template>
  <div>
    <el-form :model="topicData" label-width="120px">
      <el-form-item label="阿里云实例">
        <el-select v-model="instanceUuid" size="mini" filterable value-key="instanceName"
                   style="width: 250px;" placeholder="选择数据源实例" reserve-keyword @change="selInstance">
          <el-option v-for="item in dsInstanceOptions"
                     :key="item.uuid"
                     :label="item.instanceName"
                     :value="item.uuid">
            <select-item :name="item.instanceName" :comment="item.instanceType"/>
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="ONS实例">
        <el-select v-model="ticketEntry" size="mini" filterable value-key="name"
                   style="width: 250px;" remote reserve-keyword placeholder="输入关键词搜索ONS实例"
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
      <el-form-item label="Topic" required>
        <el-input v-model="topicData.topic" :disabled="added" size="mini"></el-input>
        <span style="height: 18px;font-size: 10px;color: #909399">
          以 “TOPIC_”开头，包含大写英文、数字和下划线（_）,最多 64 个字符
        </span>
      </el-form-item>
      <el-form-item label="消息类型" required>
        <el-radio-group v-model="topicData.messageType" size="mini" :disabled="added">
          <el-radio-button :label="messageType.type0.type">{{ messageType.type0.desc }}</el-radio-button>
          <el-radio-button :label="messageType.type1.type">{{ messageType.type1.desc }}</el-radio-button>
          <el-radio-button :label="messageType.type2.type">{{ messageType.type2.desc }}</el-radio-button>
          <el-radio-button :label="messageType.type4.type">{{ messageType.type4.desc }}</el-radio-button>
          <el-radio-button :label="messageType.type5.type">{{ messageType.type5.desc }}</el-radio-button>
        </el-radio-group>
        <el-tooltip class="item" effect="dark" content="点击查看更多" placement="right">
          <el-link href="https://help.aliyun.com/document_detail/155952.html" :underline="false" target="_blank">
            <i class="el-icon-info" style="margin-left: 5px;height: 200%"/>
          </el-link>
        </el-tooltip>
        <el-alert type="info" :closable="false" style="margin-top: 10px;line-height: 1.5">
          <template v-slot:default>
            <i class="el-icon-info" style="font-size: 14px;color: #409eff;"/>
            <span v-if="topicData.messageType === messageType.type0.type">
              普通消息适用于系统间异步解耦、削峰填谷、日志服务、大规模机器的Cache同步以及实时计算分析等场景。
            </span>
            <span v-if="topicData.messageType === messageType.type1.type">
              消息根据Sharding Key进行分区，同一个分区的消息将严格按照先入先出的方式进行顺序发布和顺序消费，可以提高并发度和整体性能。
            </span>
            <span v-if="topicData.messageType === messageType.type2.type">
              所有消息将严格按照先入先出的顺序，进行顺序发布和顺序消费。
            </span>
            <span v-if="topicData.messageType === messageType.type4.type">
              事务消息提供类似 X/Open XA 的分布事务功能，通过事务消息能达到分布式事务的最终一致。
            </span>
            <span v-if="topicData.messageType === messageType.type5.type">
              定时消息是指将消息发送到MQ服务端，在消息发送时间（当前时间）之后的指定时间点进行投递。
            </span>
          </template>
        </el-alert>
      </el-form-item>
      <el-form-item label="描述" required>
        <el-input v-model="topicData.remark" :disabled="added" placeholder="请输入备注，例如：用户 - 领券消息" size="mini"/>
      </el-form-item>
      <el-form-item>
        <el-button plain type="primary" @click="addTicketEntry" :loading="buttonAdding" size="mini">添加</el-button>
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
        this.added = true
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
