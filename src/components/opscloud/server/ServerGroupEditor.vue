<!--suppress HtmlUnknownTag -->
<template>
  <el-dialog :title="formStatus.operationType ? formStatus.addTitle : formStatus.updateTitle"
             :visible.sync="formStatus.visible" width="1000px">
    <el-tabs v-model="activeName">
      <el-tab-pane label="基本信息" name="base">
        <el-form :model="serverGroup">
          <el-form-item label="名称" :label-width="labelWidth" :required="true">
            <el-input v-model="serverGroup.name" placeholder="请输入内容" size="mini"/>
          </el-form-item>
          <el-form-item label="组类型" size="mini" :label-width="labelWidth" :required="true">
            <el-select v-model="serverGroup.serverGroupTypeId" filterable clearable
                       remote reserve-keyword placeholder="输入关键词搜组类型" :remote-method="getGroupType">
              <el-option v-for="item in groupTypeOptions"
                         :key="item.id"
                         :label="item.name"
                         :value="item.id">
                <select-item :name="item.name" :comment="item.comment"/>
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="工单申请" :label-width="labelWidth" :required="true">
            <el-select v-model="serverGroup.allowOrder" size="mini" placeholder="选择类型">
              <el-option v-for="item in allowOrderOptions"
                         :key="item.value"
                         :label="item.label"
                         :value="item.value"/>
            </el-select>
          </el-form-item>
          <el-form-item label="描述" :label-width="labelWidth">
            <el-input v-model="serverGroup.comment" placeholder="请输入内容" size="mini"/>
          </el-form-item>
        </el-form>
      </el-tab-pane>
      <el-tab-pane label="属性配置" name="property" :disabled="serverGroup.id === '' || serverGroup.id === 0">
        <business-property-editor :business-type="serverGroup.businessType" :business-id="serverGroup.businessId"
                                  ref="businessPropertyEditor"/>
      </el-tab-pane>
    </el-tabs>
    <div slot="footer" class="dialog-footer">
      <el-button size="mini" @click="formStatus.visible = false">取消</el-button>
      <el-button size="mini" type="primary" @click="save">确定</el-button>
    </div>
  </el-dialog>
</template>

<script>
// API
import { QUERY_SERVER_GROUP_TYPE_PAGE } from '@/api/modules/server/server.group.type.api.js'
import { ADD_SERVER_GROUP, UPDATE_SERVER_GROUP } from '@/api/modules/server/server.group.api.js'
import BusinessPropertyEditor from '../business/BusinessPropertyEditor'
import SelectItem from '@/components/opscloud/common/SelectItem.vue'

const allowOptions = [{
  value: false,
  label: '禁止'
}, {
  value: true,
  label: '允许'
}]

export default {
  name: 'ServerGroupEditor',
  props: ['formStatus'],
  data () {
    return {
      serverGroup: '',
      labelWidth: '150px',
      allowOrderOptions: allowOptions,
      groupTypeOptions: [],
      activeName: 'base'
    }
  },
  components: {
    BusinessPropertyEditor,
    SelectItem
  },
  mounted () {
  },
  methods: {
    getGroupType (name) {
      const requestBody = {
        name: name,
        page: 1,
        length: 10
      }
      QUERY_SERVER_GROUP_TYPE_PAGE(requestBody)
        .then(res => {
          this.groupTypeOptions = res.body.data
        })
    },
    initData (serverGroup) {
      this.activeName = 'base'
      this.serverGroup = serverGroup
      if (JSON.stringify(serverGroup.serverGroupType) === '{}') {
        this.getGroupType('')
      } else {
        this.groupTypeOptions = []
        this.groupTypeOptions.push(serverGroup.serverGroupType)
      }
      this.$nextTick(() => {
        // 业务对象属性
        this.$refs.businessPropertyEditor.initData(this.serverGroup.businessProperty)
      })
    },
    handleUpdate (requestBody) {
      UPDATE_SERVER_GROUP(requestBody)
        .then(res => {
          this.$message.success('保存成功!')
          this.formStatus.visible = false
          this.$emit('close')
        })
    },
    handleAdd (requestBody) {
      ADD_SERVER_GROUP(requestBody)
        .then(res => {
          this.$message.success('新增成功!')
          this.formStatus.visible = false
          this.$emit('close')
        })
    },
    save () {
      if (this.formStatus.operationType) {
        this.handleAdd(this.serverGroup)
      } else {
        this.handleUpdate(this.serverGroup)
      }
    }
  }
}
</script>
