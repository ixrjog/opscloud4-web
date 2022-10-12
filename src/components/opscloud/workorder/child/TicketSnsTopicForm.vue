<template>
  <div>
    <el-form :model="snsTopicData" label-width="120px" ref="snsTopicDataForm" :rules="rules">
      <el-form-item label="AWS实例" prop="instanceUuid">
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
        <el-select v-model="snsTopicData.envName" filterable style="width: 250px;" placeholder="请选择环境"
                   :disabled="instanceUuid === ''">
          <el-option
            v-for="item in regionOptions"
            :key="item.label"
            :label="item.label"
            :value="item.label">
            <select-item :name="item.label" :comment="item.desc"></select-item>
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="主题名称" prop="topic">
        <el-input v-model="snsTopicData.topic"></el-input>
        <span style="height: 18px;font-size: 10px;color: #909399">
          以 {{ topicPrefix }} 开头,以 {{ topicSuffix }} 结尾，包含小写英文、数字和下划线（_）,最多 256 个字符，FIFO 名称必须以“.fifo”结尾。
        </span>
      </el-form-item>
      <el-form-item label="主题类型" prop="topicType">
        <el-radio-group v-model="snsTopicData.topicType" @change="topicTypeChange">
          <el-radio label="0">标准
            <el-alert type="info" :closable="false">
              <div style="font-size: 10px;color: #909399;width: 260px">
                <li>最优消息排序</li>
                <li>至少一次消息传输</li>
                <li>每秒最高发布吞吐量</li>
              </div>
            </el-alert>
          </el-radio>
          <el-radio label="1" disabled>FIFO(暂不支持)
            <el-alert type="info" :closable="false">
              <div style="font-size: 10px;color: #909399;width: 260px">
                <li>严格保持的消息排序</li>
                <li>只执行一次的消息传输</li>
                <li>高吞吐量，每秒可发布多达 300 条消息</li>
              </div>
            </el-alert>
          </el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item prop="contentBasedDeduplication" v-if="snsTopicData.topicType === '1'">
        <el-checkbox v-model="snsTopicData.contentBasedDeduplication">基于内容的消息重复数据删除</el-checkbox>
        <div style="height: 18px;font-size: 10px;color: #909399">
          根据消息内容启用默认消息重复数据删除。如果未选中，则必须为每个发布请求提供重复数据删除 ID。
        </div>
      </el-form-item>
      <el-form-item label="描述" prop="remark">
        <el-input v-model="snsTopicData.remark" placeholder="请输入备注，例如：用户 - 领券队列"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button plain type="primary" @click="addTicketEntry" :loading="buttonAdding">保存</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>

import { QUERY_DATASOURCE_INSTANCE } from '@/api/modules/datasource/datasource.instance.api'
import {
  ADD_WORK_ORDER_TICKET_ENTRY
} from '@/api/modules/workorder/workorder.ticket.api'
import SelectItem from '@/components/opscloud/common/SelectItem'
import CloudRegionType from '@/components/opscloud/common/enums/cloud.region.type'

const snsTopicData = {
  envName: 'dev',
  topic: '_dev_topic',
  topicType: '0',
  instanceId: '',
  regionId: 'ap-northeast-2',
  contentBasedDeduplication: false,
  remark: ''
}

export default {
  name: 'TicketSnsTopicForm',
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
      ticketData: {},
      instanceType: 'AWS',
      snsTopicData: {},
      instanceUuid: '',
      buttonAdding: false,
      dsInstanceOptions: '',
      regionOptions: CloudRegionType.AWS.regionType,
      fifoSuffix: '.fifo',
      topicPrefix: 'transsnet_',
      topicSuffix: '',
      rules: {
        topic: [
          { required: true, message: '请输入队列名称', trigger: 'blur' },
          { max: 256, message: '长度限制在256个字符之内', trigger: 'blur' }
        ],
        topicType: [
          { required: true, message: '请选择主题类型', trigger: 'change' }
        ],
        remark: [
          { required: true, message: '请输入描述说明', trigger: 'blur' }
        ]
      }
    }
  },
  mounted () {
  },
  watch: {
    'snsTopicData.envName': {
      handler (newName, oldName) {
        switch (newName) {
          case 'dev':
            this.topicSuffix = '_dev_topic'
            this.snsTopicData.regionId = 'ap-northeast-2'
            if (this.snsTopicData.topicType === '1') {
              this.snsTopicData.topic = this.topicSuffix + this.fifoSuffix
            } else {
              this.snsTopicData.topic = this.topicSuffix
            }
            break
          case 'daily':
            this.topicSuffix = '_test_topic'
            this.snsTopicData.regionId = 'ap-east-1'
            if (this.snsTopicData.topicType === '1') {
              this.snsTopicData.topic = this.topicSuffix + this.fifoSuffix
            } else {
              this.snsTopicData.topic = this.topicSuffix
            }
            break
          case 'frankfurt-daily':
            this.topicSuffix = '_daily_topic'
            this.snsTopicData.regionId = 'eu-central-1'
            if (this.snsTopicData.topicType === '1') {
              this.snsTopicData.topic = this.topicSuffix + this.fifoSuffix
            } else {
              this.snsTopicData.topic = this.topicSuffix
            }
            break
          case 'gray':
            this.topicSuffix = '_canary_topic'
            this.snsTopicData.regionId = 'eu-west-1'
            if (this.snsTopicData.topicType === '1') {
              this.snsTopicData.topic = '_canary_topic' + this.fifoSuffix
            } else {
              this.snsTopicData.topic = '_canary_topic'
            }
            break
          case 'pre':
            this.topicSuffix = '_pre_topic'
            this.snsTopicData.regionId = 'eu-west-1'
            if (this.snsTopicData.topicType === '1') {
              this.snsTopicData.topic = '_pre_topic' + this.fifoSuffix
            } else {
              this.snsTopicData.topic = '_pre_topic'
            }
            break
          case 'prod':
            this.topicSuffix = '_prod_topic'
            this.snsTopicData.regionId = 'eu-west-1'
            if (this.snsTopicData.topicType === '1') {
              this.snsTopicData.topic = '_prod_topic' + this.fifoSuffix
            } else {
              this.snsTopicData.topic = '_prod_topic'
            }
            break
        }
      },
      immediate: true
    }
  },
  methods: {
    initDate () {
      this.getDsInstance()
      this.snsTopicData = Object.assign({}, snsTopicData)
    },
    topicTypeChange () {
      if (this.snsTopicData.topicType === '1') {
        if (!this.snsTopicData.topic.endsWith('.fifo')) {
          this.snsTopicData.topic = this.snsTopicData.topic + '.fifo'
        }
      } else {
        if (this.snsTopicData.topic.endsWith('.fifo')) {
          this.snsTopicData.topic = this.snsTopicData.topic.substr(0, this.snsTopicData.topic.length - 5)
        }
      }
    },
    addTicketEntry () {
      this.$refs.snsTopicDataForm.validate((valid) => {
        if (valid) {
          this.buttonAdding = true
          const attributes = {
            DisplayName: this.snsTopicData.remark
          }
          if (this.snsTopicData.topicType === '1') {
            attributes.FifoTopic = 'true'
            if (this.snsTopicData.contentBasedDeduplication) {
              attributes.ContentBasedDeduplication = 'true'
            }
          }
          const data = {
            envName: this.snsTopicData.envName,
            topic: this.snsTopicData.topic,
            regionId: this.snsTopicData.regionId,
            attributes: attributes
          }
          const requestBody = {
            workOrderTicketId: this.workOrderTicketId,
            name: this.snsTopicData.topic,
            instanceUuid: this.instanceUuid,
            businessType: 5,
            businessId: 0,
            entryStatus: 0,
            entryKey: this.snsTopicData.regionId,
            comment: this.snsTopicData.remark,
            content: JSON.stringify(data),
            properties: attributes
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
    }
  }
}
</script>

<style scoped lang="less">

</style>
