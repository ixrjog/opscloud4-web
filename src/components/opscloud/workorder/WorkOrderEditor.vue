<template>
  <el-dialog :title="formStatus.operationType ? formStatus.addTitle : formStatus.updateTitle"
             :visible.sync="formStatus.visible" :before-close="closeEditor">
    <el-tabs v-model="activeName">
      <el-tab-pane label="基本信息" name="base">
        <el-form :model="workOrder" label-width="80px">
          <el-form-item label="名称" :required="true">
            <el-input v-model="workOrder.name" placeholder="请输入工单名称"></el-input>
          </el-form-item>
          <el-form-item label="类目颜色" :required="true">
            <el-color-picker v-model="workOrder.color"></el-color-picker>
          </el-form-item>
          <el-form-item label="Key" :required="true">
            <el-input v-model="workOrder.workOrderKey" disabled></el-input>
          </el-form-item>
          <el-form-item label="群组" :required="true">
            <el-select v-model="workOrder.workOrderGroupId" filterable remote reserve-keyword placeholder="关键字搜索群组"
                       :remote-method="getWorkOrderGroups">
              <el-option
                v-for="item in workOrderGroupOptions"
                :key="item.id"
                :label="item.name"
                :value="item.id">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="顺序" :required="true">
            <el-input v-model.number="workOrder.seq" placeholder="请输入工单顺序"></el-input>
          </el-form-item>
          <el-form-item label="图标">
            <el-input v-model="workOrder.icon" placeholder="请输入工单图标">
              <i slot="suffix" :class=workOrder.icon aria-hidden="true"></i>
            </el-input>
          </el-form-item>
          <el-form-item label="状态" :required="true">
            <el-radio-group v-model="workOrder.status">
              <el-radio :label="workOrderStatus.NORMAL.type">{{ workOrderStatus.NORMAL.desc }}</el-radio>
              <el-radio :label="workOrderStatus.DEVELOPING.type">{{ workOrderStatus.DEVELOPING.desc }}</el-radio>
              <el-radio :label="workOrderStatus.SYS.type">{{ workOrderStatus.SYS.desc }}</el-radio>
              <el-radio :label="workOrderStatus.INACTIVE.type">{{ workOrderStatus.INACTIVE.desc }}</el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item label="帮助">
            <el-input v-model.number="workOrder.docs" placeholder="只支持内部跳转"></el-input>
          </el-form-item>
          <el-form-item label="描述">
            <el-input v-model="workOrder.comment" placeholder="请输入工单描述"></el-input>
          </el-form-item>
        </el-form>
      </el-tab-pane>
      <el-tab-pane label="工作流" name="workflow">
        <el-form :model="workOrder" label-position="top">
          <el-form-item label="工作流(YML)" required>
            <my-highlight v-if="!editing" :code="workOrder.workflow" lang="yaml"></my-highlight>
            <editor v-if="editing" v-model="workOrder.workflow" @init="editorInit" lang="yaml" theme="chrome"
                    height="250" :options="options"></editor>
          </el-form-item>
        </el-form>
        <div style="width:100%;text-align:center">
          <el-button size="mini" type="primary" @click="handleEditing" v-show="!editing">编辑工作流</el-button>
          <el-button size="mini" type="primary" @click="handleUpdate" v-show="editing">保存工作流</el-button>
        </div>
      </el-tab-pane>
    </el-tabs>
    <div slot="footer" class="dialog-footer">
      <el-button @click="formStatus.visible = false">取消</el-button>
      <el-button type="primary" @click="handleUpdate">保存</el-button>
    </div>
  </el-dialog>
</template>

<script>
import { QUERY_WORK_ORDER_GROUP_PAGE } from '@/api/modules/workorder/workorder.group.api'
import { UPDATE_WORK_ORDER } from '@/api/modules/workorder/workorder.api'
import workorderStatus from '@/components/opscloud/common/enums/workorder.status'
import MyHighlight from '@/components/opscloud/common/MyHighlight'

const options = {
  // vue2-ace-editor编辑器配置自动补全等
  enableBasicAutocompletion: true,
  enableSnippets: true,
  // 自动补全
  enableLiveAutocompletion: true
}

export default {
  data () {
    return {
      activeName: 'base',
      workOrder: {},
      workOrderGroupOptions: [],
      options: options,
      editing: false,
      workOrderStatus: workorderStatus
    }
  },
  name: 'WorkOrderEditor',
  props: ['formStatus'],
  components: {
    MyHighlight,
    editor: require('vue2-ace-editor')
  },
  methods: {
    editorInit: function () {
      // language extension prerequsite...
      require('brace/ext/language_tools')
      // language
      require('brace/mode/yaml')
      require('brace/theme/chrome')
      // snippet
      require('brace/snippets/yaml')
    },
    initData (workOrder) {
      this.workOrder = workOrder
      this.getWorkOrderGroups('')
    },
    getWorkOrderGroups (queryName) {
      const requestBody = {
        name: queryName,
        extend: false,
        page: 1,
        length: 10
      }
      QUERY_WORK_ORDER_GROUP_PAGE(requestBody).then(res => {
        this.workOrderGroupOptions = res.body.data
      })
    },
    handleUpdate () {
      UPDATE_WORK_ORDER(this.workOrder).then(() => {
        this.$message.success('保存成功')
        this.editing = false
      }).catch(() => {
        this.editing = false
      })
    },
    closeEditor () {
      this.formStatus.visible = false
      this.$emit('close')
    },
    handleEditing () {
      this.editing = true
    }
  }
}
</script>

<style scoped>
</style>
