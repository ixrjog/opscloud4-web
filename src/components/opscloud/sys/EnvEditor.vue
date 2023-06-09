<!--suppress HtmlUnknownTag -->
<template>
  <el-dialog :title="formStatus.operationType ? formStatus.addTitle : formStatus.updateTitle"
             :visible.sync="formStatus.visible">
    <el-form :model="env">
      <el-form-item label="环境名称" :label-width="labelWidth" prop="envName" required>
        <el-input v-model="env.envName" placeholder="请输入内容"/>
      </el-form-item>
      <el-form-item label="类型值" :label-width="labelWidth" prop="envType" required>
        <el-input v-model="env.envType" placeholder="请输入内容"
                  :disabled="!formStatus.operationType"/>
      </el-form-item>
      <el-form-item label="顺序" :label-width="labelWidth" prop="seq" required>
        <el-input v-model="env.seq" placeholder="请输入内容"/>
      </el-form-item>
      <el-form-item label="环境颜色" :label-width="labelWidth">
        <el-color-picker v-model="env.color"/>
      </el-form-item>
      <el-form-item label="终端提示色" :label-width="labelWidth" required>
        <el-select v-model="env.promptColor" placeholder="选择类型">
          <el-option v-for="item in promptColorOptions"
                     :key="item.value"
                     :label="item.label"
                     :value="item.value">
            <select-prompt-color-tag :item="item"/>
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="有效" :label-width="labelWidth" required>
        <el-select v-model="env.isActive" placeholder="选择类型">
          <el-option v-for="item in activeOptions"
                     :key="item.value"
                     :label="item.label"
                     :value="item.value">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="描述" :label-width="labelWidth">
        <el-input v-model="env.comment" placeholder="请输入内容"/>
      </el-form-item>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button size="mini" @click="formStatus.visible = false">取消</el-button>
      <el-button size="mini" type="primary" @click="save ">确定</el-button>
    </div>
  </el-dialog>
</template>

<script>
// API
import { ADD_ENV, UPDATE_ENV } from '@/api/modules/sys/sys.env.api.js'
import SelectPromptColorTag from '../common/tag/SelectPromptColorTag'

const activeOptions = [{
  value: true,
  label: '有效'
}, {
  value: false,
  label: '无效'
}]

export default {
  data () {
    return {
      env: '',
      labelWidth: '150px',
      activeOptions: activeOptions
    }
  },
  name: 'EnvEditor',
  props: ['formStatus', 'promptColorOptions'],
  mixins: [],
  components: {
    SelectPromptColorTag
  },
  mounted () {
  },
  methods: {
    initData (env) {
      this.env = env
    },
    handleUpdate (requestBody) {
      UPDATE_ENV(requestBody)
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
      ADD_ENV(requestBody)
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
    save () {
      if (this.formStatus.operationType) {
        this.handleAdd(this.env)
      } else {
        this.handleUpdate(this.env)
      }
    }
  }
}
</script>
