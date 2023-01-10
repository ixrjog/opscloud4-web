<template>
  <el-dialog :title="title" :visible.sync="formStatus.visible" width="40%" :before-close="handleClose">
    <el-card shadow="hover">
      <div slot="header" class="clearfix">
        <my-span :content="workEventData.workItemTree" style="font-size: 14px"></my-span>
        <span style="float: right;margin-left: 5px">
          <span style="margin-right: 2px">{{ workEventData.workEventTime }}</span>
          <span style="color: #20A9D9">[{{ workEventData.ago }}]</span>
        </span>
      </div>
      <el-form v-model="workEventData" label-width="80px">
        <span v-if="JSON.stringify(workEventData) !== '{}' && workEventData.workRole.workRoleKey === 'SUPPORT'">
          <el-form-item label="解决时效">
            <el-radio-group v-model="workEventData.property.timeliness">
              <el-radio label="24小时内">24小时内</el-radio>
              <el-radio label="48小时内">48小时内</el-radio>
             <el-radio label="超48小时">超48小时</el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item label="是否拦截">
            <el-radio-group v-model="workEventData.property.intercept">
              <el-radio label="true">拦截</el-radio>
              <el-radio label="false">未拦截</el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item label="是否解决">
            <el-radio-group v-model="workEventData.property.solve">
              <el-radio label="true">已解决</el-radio>
              <el-radio label="false">处理中</el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item label="是否故障">
            <el-radio-group v-model="workEventData.property.fault">
              <el-radio label="true">故障</el-radio>
              <el-radio label="false">未故障</el-radio>
            </el-radio-group>
          </el-form-item>
        </span>
        <el-form-item label="事件次数">
          <el-input-number controls-position="right" :min="1" v-model="workEventData.workEventCnt"></el-input-number>
        </el-form-item>
        <el-form-item label="事件说明">
          <el-input type="textarea" :rows="4" v-model="workEventData.comment"></el-input>
        </el-form-item>
      </el-form>
    </el-card>
    <div slot="footer" class="dialog-footer">
      <el-button @click="formStatus.visible = false">取消</el-button>
      <el-button type="primary" @click="handleSave" :disabled="saving">保存</el-button>
    </div>
  </el-dialog>
</template>

<script>
// API
import { UPDATE_WORK_EVENT } from '@/api/modules/report/workevent/work.event.api'
import MySpan from '@/components/opscloud/common/MySpan'

export default {
  data () {
    return {
      title: '编辑工作事件',
      workEventData: {},
      saving: false
    }
  },
  name: 'WorkEventUpdateEditor',
  props: ['formStatus'],
  mounted () {
  },
  components: {
    MySpan
  },
  methods: {
    initData (data) {
      this.workEventData = data
      this.saving = false
    },
    handleSave () {
      const request = {
        workEvent: Object.assign({}, this.workEventData)
      }
      delete (request.workEvent.user)
      this.saving = true
      UPDATE_WORK_EVENT(request).then(() => {
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
>>> .el-card__header {
  padding: 10px 10px;
  border-bottom: 1px solid #EBEEF5;
  -webkit-box-sizing: border-box;
  box-sizing: border-box;
}
</style>
