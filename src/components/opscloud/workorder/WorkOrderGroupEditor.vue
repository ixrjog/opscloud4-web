<template>
  <el-dialog :title="formStatus.operationType ? formStatus.addTitle : formStatus.updateTitle"
             :visible.sync="formStatus.visible">
    <el-form :model="workOrderGroup" label-width="80px">
      <el-form-item label="名称" :required="true">
        <el-input v-model.trim="workOrderGroup.name" placeholder="请输入工单群组名称"></el-input>
      </el-form-item>
      <el-form-item label="类型">
        <el-select v-model="workOrderGroup.groupType">
          <el-option
            v-for="item in groupTypeOptions"
            :key="item.value"
            :label="item.label"
            :value="item.value">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="顺序">
        <el-input v-model.number="workOrderGroup.seq" placeholder="请输入工单群组顺序"></el-input>
      </el-form-item>
      <el-form-item label="图标">
        <el-input v-model="workOrderGroup.icon" placeholder="请输入工单群组图标">
          <i slot="suffix" :class=workOrderGroup.icon aria-hidden="true"></i>
        </el-input>
      </el-form-item>
      <el-form-item label="描述">
        <el-input v-model.trim="workOrderGroup.comment" placeholder="请输入工单群组描述"></el-input>
      </el-form-item>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button @click="formStatus.visible = false">取消</el-button>
      <el-button type="primary" @click="handleSave">确定</el-button>
    </div>
  </el-dialog>
</template>

<script>
import { SAVE_WORK_ORDER_GROUP } from '@/api/modules/workorder/workorder.group.api'

export default {
  data () {
    return {
      workOrderGroup: '',
      groupTypeOptions: [{
        value: 0,
        label: '普通工单'
      }, {
        value: 1,
        label: '系统工单'
      }]
    }
  },
  name: 'WorkOrderGroupEditor',
  props: ['formStatus'],
  methods: {
    initData (workOrderGroup) {
      this.workOrderGroup = workOrderGroup
    },
    handleSave () {
      SAVE_WORK_ORDER_GROUP(this.workOrderGroup)
        .then(() => {
          this.$message.success('保存成功')
          this.closeEditor()
        })
    },
    closeEditor () {
      this.formStatus.visible = false
      this.$emit('close')
    }
  }
}
</script>

<style scoped>

</style>
