<!--suppress HtmlUnknownTag -->
<template>
  <el-dialog :title="title" :visible.sync="formStatus.visible" width="50%" :before-close="handleClose">
    <el-row :gutter="24" style="margin-bottom: 5px">
      <el-form label-width="80px">
        <el-form-item label="角色" required>
          <el-select v-model="workRoleId" placeholder="选择角色" class="select" @change="workRoleChange">
            <el-option v-for="item in workRoleOptions"
                       :key="item.id"
                       :label="item.workRoleName"
                       :value="item.id"/>
          </el-select>
        </el-form-item>
        <el-form-item label="类目" required>
          <el-cascader v-model="value" :options="workItemOptions" filterable @change="handleChange" class="cascader"
                       placeholder="选择类目" collapse-tags :props="workItemProps">
          </el-cascader>
          <el-button type="primary" plain size="mini" @click="handleAdd()" style="margin-left: 10px" :loading="adding">
            添加
          </el-button>
        </el-form-item>
      </el-form>
    </el-row>
    <el-divider></el-divider>
    <el-form v-model="workEventData" label-width="80px">
      <el-row v-for="(workEvent,index) in workEventData.workEventList" :key="index" style="margin-bottom: 10px">
        <el-card shadow="hover">
          <div slot="header" class="clearfix">
            <my-span :content="workEvent.workItemName" style="font-size: 14px"/>
            <el-button @click.prevent="handleDel(workEvent)" type="text"
                       style="float: right;margin-left: 5px;color: #F56C6C">删除
            </el-button>
          </div>
          <span v-if="workRole.workRoleKey === 'SUPPORT'">
            <el-form-item label="解决时效">
              <el-radio-group v-model="workEvent.property.timeliness">
                <el-radio label="24小时内">24小时内</el-radio>
                <el-radio label="48小时内">48小时内</el-radio>
               <el-radio label="超48小时">超48小时</el-radio>
              </el-radio-group>
            </el-form-item>
            <el-form-item label="是否拦截">
              <el-radio-group v-model="workEvent.property.intercept">
                <el-radio :label="true">拦截</el-radio>
                <el-radio :label="false">未拦截</el-radio>
              </el-radio-group>
            </el-form-item>
            <el-form-item label="是否解决">
              <el-radio-group v-model="workEvent.property.solve">
                <el-radio :label="true">已解决</el-radio>
                <el-radio :label="false">处理中</el-radio>
              </el-radio-group>
            </el-form-item>
            <el-form-item label="是否故障">
              <el-radio-group v-model="workEvent.property.fault">
                <el-radio :label="true">故障</el-radio>
                <el-radio :label="false">未故障</el-radio>
              </el-radio-group>
            </el-form-item>
          </span>
          <el-form-item label="事件次数" required>
            <el-input-number controls-position="right" :min="1" v-model="workEvent.workEventCnt"/>
          </el-form-item>
          <el-form-item label="事件时间" required>
            <el-date-picker v-model="workEvent.workEventTime" type="date" value-format="timestamp"/>
          </el-form-item>
          <el-form-item label="事件说明">
            <el-input type="textarea" :rows="4" v-model="workEvent.comment"/>
          </el-form-item>
        </el-card>
      </el-row>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button @click="formStatus.visible = false">取消</el-button>
      <el-button type="primary" @click="handleSave" :disabled="saving">保存</el-button>
    </div>
  </el-dialog>
</template>

<script>
// API
import {
  ADD_WORK_EVENT, QUERY_MY_WORK_ROLE,
  QUERY_WORK_ITEM_BY_ID,
  QUERY_WORK_ITEM_TREE,
  QUERY_WORK_ROLE_BY_ID
} from '@/api/modules/report/workevent/work.event.api'
import MySpan from '@/components/opscloud/common/MySpan'

const workEvent = {
  workRoleId: '',
  workItemId: '',
  workItemName: '',
  workEventTime: new Date(new Date().setHours(8, 0, 0, 0)),
  workEventCnt: 1,
  comment: ''
}

export default {
  data () {
    return {
      title: '新增工作事件',
      value: '',
      workRoleId: '',
      workRole: {},
      workItemId: '',
      workEventData: {},
      workItemOptions: [],
      workRoleOptions: [],
      adding: false,
      workItemProps: {
        emitPath: false
      },
      workEventProperty: {
        support: {
          timeliness: '24小时内',
          intercept: true,
          fault: false,
          solve: true
        }
      },
      saving: false
    }
  },
  name: 'WorkEventEditor',
  props: ['formStatus'],
  mounted () {
  },
  components: {
    MySpan
  },
  filters: {},
  methods: {
    initData () {
      this.workEventData = {
        workEventList: []
      }
      this.value = ''
      this.workItemId = ''
      this.workRole = {}
      this.saving = false
      this.getMyWorkRole()
    },
    handleChange (value) {
      this.workItemId = value
    },
    getWorkRole () {
      QUERY_WORK_ROLE_BY_ID({ id: this.workRoleId })
        .then(({ body }) => {
          this.workRole = body
        })
    },
    getMyWorkRole () {
      this.workRoleOptions = []
      QUERY_MY_WORK_ROLE().then(({ body }) => {
        this.workRoleOptions = body
        this.workRoleId = body[0].id
        this.getWorkRole()
        this.getWorkItemTree()
      })
    },
    workRoleChange () {
      this.value = ''
      this.getWorkItemTree()
      this.getWorkRole()
      this.workEventData.workEventList = []
    },
    getWorkItemTree () {
      this.workItemId = ''
      this.workItemOptions = []
      QUERY_WORK_ITEM_TREE({ workRoleId: this.workRoleId })
        .then(({ body }) => {
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
          data.workItemName = body.workItemName
          data.comment = body.comment
          if (this.workRole.workRoleKey === 'SUPPORT') {
            data.property = Object.assign({}, this.workEventProperty.support)
          }
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
        const propertyList = []
        if (JSON.stringify(value.property) !== '{}') {
          for (const i in value.property) {
            propertyList.push({
              name: i,
              value: value.property[i]
            })
          }
        }
        requestBody.workEventList.push({
          workRoleId: value.workRoleId,
          workItemId: value.workItemId,
          workEventCnt: value.workEventCnt,
          workEventTime: value.workEventTime,
          comment: value.comment,
          propertyList: propertyList
        })
      })
      if (JSON.stringify(requestBody.workEventList) === '[]') {
        this.$message.warning('请新增至少一个工作项目')
        return
      }
      this.saving = true
      ADD_WORK_EVENT(requestBody).then(() => {
        this.$message.success('保存成功')
        this.formStatus.visible = false
        this.adding = false
        this.saving = false
        this.$emit('closeDialog')
      }).catch(() => {
        this.adding = false
        this.saving = false
      })
    },
    handleClose (done) {
      this.$confirm('确定关闭?')
        .then(_ => {
          done()
          this.closeEditor()
        })
        .catch(_ => {
        })
    },
    closeEditor () {
      this.formStatus.visible = false
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

>>> .el-card__header {
  padding: 10px 10px;
  border-bottom: 1px solid #EBEEF5;
  -webkit-box-sizing: border-box;
  box-sizing: border-box;
}

.el-divider--horizontal {
  display: block;
  height: 1px;
  width: 100%;
  margin: 12px 0;
}
</style>
