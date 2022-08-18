<template>
  <el-dialog :title="title" :visible.sync="formStatus.visible" width="50%">
    <el-row :gutter="24" style="margin-bottom: 5px">
      <el-form label-width="80px">
        <el-form-item label="角色">
          <el-select v-model="workRoleId" placeholder="选择角色" class="select" @change="workRoleChange">
            <el-option
              v-for="item in workRoleOptions"
              :key="item.id"
              :label="item.workRoleName"
              :value="item.id">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="类目">
          <el-cascader :options="workItemOptions" filterable @change="handleChange" class="cascader" placeholder="选择类目"
                       collapse-tags :props="workItemProps">
          </el-cascader>
          <el-button type="primary" plain size="mini" @click="handleAdd()" style="margin-left: 10px" :loading="adding">
            添加
          </el-button>
        </el-form-item>
      </el-form>
    </el-row>
    <el-divider></el-divider>
    <el-form v-model="workEventData" label-width="80px">
      <el-form-item label="时间">
        <el-date-picker v-model="workEventData.workEventTime" align="right" type="date" :picker-options="pickerOptions"
                        value-format="timestamp">
        </el-date-picker>
      </el-form-item>
      <el-row v-for="(workEvent,index) in workEventData.workEventList" :key="index">
        <el-row>
          <span class="item-span">{{ workEvent.workItemName }}</span>
        </el-row>
        <el-col :span="6">
          <el-form-item label="次数">
            <el-input-number controls-position="right" :min="1" v-model="workEvent.workEventCnt"></el-input-number>
          </el-form-item>
        </el-col>
        <el-col :span="14">
          <el-form-item label="说明">
            <el-input v-model="workEvent.comment"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="1">
          <el-form-item>
            <el-button @click.prevent="handleDel(workEvent)" icon="el-icon-delete" type="danger" plain></el-button>
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button @click="formStatus.visible = false">取消</el-button>
      <el-button type="primary" @click="handleSave">保存</el-button>
    </div>
  </el-dialog>
</template>

<script>
// API
import {
  ADD_WORK_EVENT,
  QUERY_WORK_ITEM_BY_ID,
  QUERY_WORK_ITEM_TREE
} from '@/api/modules/report/workevent/work.event.api'

const workEvent = {
  workRoleId: '',
  workItemId: '',
  workItemName: '',
  workEventTime: '',
  workEventCnt: 1,
  comment: ''
}

export default {
  data () {
    return {
      title: '新增工作事件',
      workRoleId: '',
      workItemId: '',
      workEventData: {},
      workItemOptions: [],
      adding: false,
      workItemProps: {
        emitPath: false
      },
      pickerOptions: {
        disabledDate (time) {
          return time.getTime() > Date.now()
        },
        shortcuts: [{
          text: '今天',
          onClick (picker) {
            picker.$emit('pick', new Date())
          }
        }, {
          text: '昨天',
          onClick (picker) {
            const date = new Date()
            date.setTime(date.getTime() - 3600 * 1000 * 24)
            picker.$emit('pick', date)
          }
        }, {
          text: '一周前',
          onClick (picker) {
            const date = new Date()
            date.setTime(date.getTime() - 3600 * 1000 * 24 * 7)
            picker.$emit('pick', date)
          }
        }]
      }
    }
  },
  name: 'WorkEventEditor',
  props: ['formStatus', 'workRoleOptions'],
  mounted () {
  },
  components: {},
  filters: {},
  methods: {
    initData () {
      this.workEventData = {
        workEventTime: Date.now(),
        workEventList: []
      }
      this.workItemId = ''
      this.workRoleId = this.workRoleOptions[0].id
      this.getWorkItemTree()
    },
    handleChange (value) {
      this.workItemId = value
    },
    workRoleChange () {
      this.getWorkItemTree()
      this.workEventData.workEventList = []
    },
    getWorkItemTree () {
      this.workItemOptions = []
      const requestBody = {
        workRoleId: this.workRoleId
      }
      QUERY_WORK_ITEM_TREE(requestBody).then(({ body }) => {
        this.workItemOptions = body
      })
    },
    handleAdd () {
      if (this.workItemId === '') {
        this.$message.warning('请选择类目')
        return
      }
      this.adding = true
      QUERY_WORK_ITEM_BY_ID({ id: this.workItemId })
        .then(({ body }) => {
          const data = Object.assign({}, workEvent)
          data.workItemId = this.workItemId
          data.workRoleId = this.workRoleId
          data.workEventTime = this.workEventData.workEventTime
          data.workItemName = body.workItemName
          this.workEventData.workEventList.push(data)
          this.adding = false
        })
    },
    handleDel (item) {
      const index = this.workEventData.workEventList.indexOf(item)
      if (index !== -1) {
        this.workEventData.workEventList.splice(index, 1)
      }
    },
    handleSave () {
      const requestBody = {
        workEventList: []
      }
      this.workEventData.workEventList.map(value => {
        if (value.workEventCnt !== 0) {
          requestBody.workEventList.push({
            workRoleId: value.workRoleId,
            workItemId: value.workItemId,
            workEventCnt: value.workEventCnt,
            workEventTime: value.workEventTime,
            comment: value.comment
          })
        }
      })
      if (JSON.stringify(requestBody.workEventList) === '[]') {
        this.$message.warning('请新增至少一个工作项目')
        return
      }
      ADD_WORK_EVENT(requestBody)
        .then(res => {
          this.adding = false
          this.$message.success('保存成功')
          this.formStatus.visible = false
          this.$emit('closeDialog')
        })
    }
  }
}
</script>

<style scoped>
.select {
  display: inline-block;
  max-width: 200px;
  margin-left: 10px
}

.select {
  margin-left: 5px;
}

.cascader {
  margin-left: 5px;
  width: 400px;
}

.item-span {
  margin-left: 40px;
  color: #B7B6B6;
  font-size: 16px;
}
</style>
