<!--suppress HtmlUnknownTag -->
<template>
  <el-dialog :title="formStatus.operationType ? formStatus.addTitle : formStatus.updateTitle"
             :visible.sync="formStatus.visible">
    <el-form :model="tag">
      <el-form-item label="标签关键字" :label-width="labelWidth" required>
        <el-input v-model="tag.tagKey" placeholder="请输入内容" :disabled="!formStatus.operationType" size="mini"/>
      </el-form-item>
      <el-form-item label="标签业务类型" :label-width="labelWidth" required>
        <el-select v-model="tag.businessType" placeholder="选择分类" size="mini">
          <el-option v-for="item in businessTypeOptions" :key="item.value" :label="item.label" :value="item.value"/>
        </el-select>
      </el-form-item>
      <el-form-item label="颜色" :label-width="labelWidth" required>
        <el-color-picker v-model="tag.color"/>
      </el-form-item>
      <el-form-item label="描述" :label-width="labelWidth">
        <el-input v-model="tag.comment" placeholder="请输入内容" size="mini"/>
      </el-form-item>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button size="mini" @click="formStatus.visible = false">取消</el-button>
      <el-button size="mini" type="primary" @click="handleSave">确定</el-button>
    </div>
  </el-dialog>
</template>

<script>
// API
import { ADD_TAG, UPDATE_TAG } from '@/api/modules/tag/tag.api.js'

export default {
  data () {
    return {
      tag: '',
      labelWidth: '150px'
    }
  },
  name: 'TagEditor',
  props: ['formStatus', 'businessTypeOptions'],
  mounted () {
  },
  methods: {
    initData (tag) {
      this.tag = tag
    },
    handleUpdate (requestBody) {
      UPDATE_TAG(requestBody)
        .then(res => {
          // 返回数据
          this.$message({
            message: '成功',
            type: 'success'
          })
          this.formStatus.visible = false
          this.$emit('close')
        })
    },
    handleAdd (requestBody) {
      ADD_TAG(requestBody)
        .then(res => {
          // 返回数据
          this.$message({
            message: '成功',
            type: 'success'
          })
          this.formStatus.visible = false
          this.$emit('close')
        })
    },
    handleSave () {
      if (this.formStatus.operationType) {
        this.handleAdd(this.tag)
      } else {
        this.handleUpdate(this.tag)
      }
    }
  }
}
</script>
