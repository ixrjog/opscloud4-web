<template>
  <div>
    <el-form :model="snsSubscriptionData" label-width="120px" ref="snsSubscriptionDataForm" :rules="rules">
      <el-form-item label="AWS实例">
        <el-select v-model="instanceUuid" filterable value-key="instanceName"
                   style="width: 250px;" placeholder="选择数据源实例" reserve-keyword>
          <el-option
            v-for="item in dsInstanceOptions"
            :key="item.uuid"
            :label="item.instanceName"
            :value="item.uuid">
            <select-item :name="item.instanceName" :comment="item.instanceType"></select-item>
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="Region ID" prop="regionId">
        <el-select v-model="snsSubscriptionData.regionId" filterable style="width: 250px;" placeholder="请选择Region Id"
                   :disabled="instanceUuid === ''" @change="regionIdChange">
          <el-option
            v-for="item in regionOptions"
            :key="item.value"
            :label="item.label"
            :value="item.value">
            <select-item :name="item.value" :comment="item.desc"></select-item>
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="SNS 主题">
        <el-select v-model="snsTopicEntry" filterable value-key="name"
                   style="width: 250px;" remote reserve-keyword placeholder="输入关键词搜索 SNS 主题"
                   :remote-method="fetchSnsTopicData" @change="snsTopicChange"
                   :disabled="snsSubscriptionData.regionId === ''">
          <el-option
            v-for="item in snsTopicEntryOptions"
            :key="item.name"
            :label="item.name"
            :value="item">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="订阅协议">
        <span style="font-size: 10px;color: #909399">目前仅支持 Amazon SQS 协议</span>
      </el-form-item>
      <el-form-item label="SQS 队列" prop="endpoint">
        <el-select v-model="snsSubscriptionData.endpoint" filterable
                   style="width: 250px;" remote reserve-keyword placeholder="输入关键词搜索 SQS 队列"
                   :remote-method="fetchSqsData"
                   :disabled="snsSubscriptionData.topicArn === ''">
          <el-option
            v-for="item in sqsEntryOptions"
            :key="item.name"
            :label="item.content"
            :value="item.content">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="描述" prop="remark">
        <el-input v-model="snsSubscriptionData.remark" placeholder="请输入备注"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button plain type="primary" @click="addTicketEntry" :loading="buttonAdding">保存
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
import CloudRegionType from '@/components/opscloud/common/enums/cloud.region.type'
import DsInstanceAssetType from '@/components/opscloud/common/enums/ds.instance.asset.type'

const snsSubscriptionData = {
  topicArn: '',
  protocol: 'sqs',
  endpoint: '',
  instanceId: '',
  regionId: 'ap-northeast-2',
  remark: ''
}

export default {
  name: 'TicketSnsSubscriptionForm',
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
      instanceType: 'AWS',
      snsSubscriptionData: {},
      instanceUuid: '',
      regionOptions: CloudRegionType.AWS.regionType,
      buttonAdding: false,
      dsInstanceOptions: '',
      dsInstanceAssetType: DsInstanceAssetType,
      snsTopicEntry: '',
      sqsEntryOptions: [],
      snsTopicEntryOptions: [],
      rules: {
        regionId: [
          { required: true, message: '请选择 Region', trigger: 'change' }
        ],
        endpoint: [
          { required: true, message: '请选择 SQS 队列', trigger: 'change' }
        ],
        remark: [
          { required: true, message: '请输入描述说明', trigger: 'blur' }
        ]
      }
    }
  },
  mounted () {
  },
  methods: {
    initDate () {
      this.getDsInstance()
      this.snsTopicEntry = ''
      this.sqsEntryOptions = []
      this.snsTopicEntryOptions = []
      this.snsSubscriptionData = Object.assign({}, snsSubscriptionData)
    },
    regionIdChange () {
      this.snsTopicEntry = ''
      this.snsSubscriptionData.topicArn = ''
      this.snsSubscriptionData.endpoint = ''
      this.fetchSnsTopicData('')
    },
    snsTopicChange () {
      this.snsSubscriptionData.topicArn = this.snsTopicEntry.content
      this.snsSubscriptionData.endpoint = ''
      this.fetchSqsData('')
    },
    addTicketEntry () {
      this.$refs.snsSubscriptionDataForm.validate((valid) => {
        if (valid) {
          this.buttonAdding = true
          const data = {
            regionId: this.snsSubscriptionData.regionId,
            topicArn: this.snsSubscriptionData.topicArn,
            protocol: this.snsSubscriptionData.protocol,
            endpoint: this.snsSubscriptionData.endpoint
          }
          const requestBody = {
            workOrderTicketId: this.workOrderTicketId,
            name: this.snsTopicEntry.name,
            instanceUuid: this.instanceUuid,
            businessType: 5,
            businessId: 0,
            entryStatus: 0,
            entryKey: this.snsSubscriptionData.regionId,
            comment: this.snsSubscriptionData.remark,
            content: JSON.stringify(data)
          }
          ADD_WORK_ORDER_TICKET_ENTRY(requestBody).then(() => {
            this.$emit('handleNotify')
            this.$message.success('保存成功')
            this.buttonAdding = false
          }).catch(() => {
            this.buttonAdding = false
          })
        }
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
    fetchSnsTopicData (name) {
      this.snsTopicEntryOptions = []
      const requestBody = {
        queryName: name,
        regionId: this.snsSubscriptionData.regionId,
        assetType: this.dsInstanceAssetType.AWS.SNS_TOPIC,
        instanceUuid: this.instanceUuid,
        workOrderTicketId: this.workOrderTicketId,
        length: 20
      }
      QUERY_WORK_ORDER_TICKET_ENTRY(requestBody)
        .then(res => {
          this.snsTopicEntryOptions = res.body
        })
    },
    fetchSqsData (name) {
      this.sqsEntryOptions = []
      const requestBody = {
        queryName: name,
        regionId: this.snsSubscriptionData.regionId,
        assetType: this.dsInstanceAssetType.AWS.SQS,
        instanceUuid: this.instanceUuid,
        kind: this.snsTopicEntry.entryKey,
        workOrderTicketId: this.workOrderTicketId,
        length: 20
      }
      QUERY_WORK_ORDER_TICKET_ENTRY(requestBody)
        .then(res => {
          this.sqsEntryOptions = res.body
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