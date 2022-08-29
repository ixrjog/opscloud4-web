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
      <el-form-item label="环境">
        <el-select v-model="snsSubscriptionData.envName" filterable style="width: 250px;" placeholder="请选择环境"
                   :disabled="instanceUuid === ''" @change="regionIdChange">
          <el-option
            v-for="item in regionOptions"
            :key="item.label"
            :label="item.label"
            :value="item.label">
            <select-item :name="item.label" :comment="item.desc"></select-item>
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
      <el-form-item label="SQS 队列">
        <el-select v-model="sqsEntry" filterable value-key="name"
                   style="width: 250px;" remote reserve-keyword placeholder="输入关键词搜索 SQS 队列"
                   :remote-method="fetchSqsData" @change="sqsChange"
                   :disabled="snsSubscriptionData.topicArn === ''">
          <el-option
            v-for="item in sqsEntryOptions"
            :key="item.name"
            :label="item.name"
            :value="item">
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
  envName: 'dev',
  topicArn: '',
  protocol: 'sqs',
  endpoint: '',
  queueName: '',
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
      sqsEntry: '',
      sqsEntryOptions: [],
      snsTopicEntryOptions: [],
      rules: {
        regionId: [
          { required: true, message: '请选择环境', trigger: 'change' }
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
      this.sqsEntry = ''
      this.sqsEntryOptions = []
      this.snsTopicEntryOptions = []
      this.snsSubscriptionData = Object.assign({}, snsSubscriptionData)
    },
    regionIdChange () {
      switch (this.snsSubscriptionData.envName) {
        case 'dev':
          this.snsSubscriptionData.regionId = 'ap-northeast-2'
          break
        case 'daily':
          this.snsSubscriptionData.regionId = 'ap-east-1'
          break
        case 'gray':
          this.snsSubscriptionData.regionId = 'eu-west-1'
          break
        case 'pre':
          this.snsSubscriptionData.regionId = 'eu-west-1'
          break
        case 'prod':
          this.snsSubscriptionData.regionId = 'eu-west-1'
          break
      }
      this.snsTopicEntry = ''
      this.sqsEntry = ''
      this.snsSubscriptionData.topicArn = ''
      this.snsSubscriptionData.endpoint = ''
      this.snsSubscriptionData.queueName = ''
      this.fetchSnsTopicData('')
    },
    snsTopicChange () {
      this.snsSubscriptionData.topicArn = this.snsTopicEntry.content
      this.fetchSqsData('')
    },
    sqsChange () {
      this.snsSubscriptionData.endpoint = this.sqsEntry.content
      this.snsSubscriptionData.queueName = this.sqsEntry.name
    },
    addTicketEntry () {
      this.$refs.snsSubscriptionDataForm.validate((valid) => {
        if (valid) {
          if (this.snsSubscriptionData.endpoint === '') {
            this.$message.warning('请选择SQS队列')
            return
          }
          this.buttonAdding = true
          const data = {
            envName: this.snsSubscriptionData.envName,
            regionId: this.snsSubscriptionData.regionId,
            topicArn: this.snsSubscriptionData.topicArn,
            protocol: this.snsSubscriptionData.protocol,
            endpoint: this.snsSubscriptionData.endpoint,
            queueName: this.snsSubscriptionData.queueName
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
