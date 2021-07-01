<template>
  <el-dialog :title="title" :visible.sync="formStatus.visible" width="30%">
    <el-form :model="terminalSetting" :label-width="labelWidth">
      <el-form-item label="终端字体颜色">
        <el-color-picker v-model="terminalSetting.theme.foreground"></el-color-picker>
      </el-form-item>
      <el-form-item label="终端背景颜色">
        <el-color-picker v-model="terminalSetting.theme.background"></el-color-picker>
      </el-form-item>
      <el-form-item label="终端行数">
        <el-input-number v-model="terminalSetting.rows" :min="22" :max="60" label="终端行数"></el-input-number>
      </el-form-item>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button size="mini" @click="formStatus.visible = false">取消</el-button>
      <el-button size="mini" type="primary" @click="handlerSave">确定</el-button>
    </div>
  </el-dialog>
</template>

<script>
import { mapActions, mapState } from 'vuex'

export default {
  data () {
    return {
      title: '用户终端设置',
      labelWidth: '150px',
      terminalSetting: {
        theme: {
          foreground: '#FFFFFF', // 字体
          background: '#606266' // 背景色
        },
        rows: 30 // 行数
      }
    }
  },
  name: 'UserTerminalSetting',
  props: ['formStatus'],
  computed: {
    ...mapState('d2admin/user', [
      'info'
    ])
  },
  methods: {
    ...mapActions({
      setting: 'd2admin/user/set'
    }),
    init () {
      if (typeof (this.info.terminalSetting) !== 'undefined') {
        this.terminalSetting = this.info.terminalSetting
      }
    },
    handlerSave () {
      this.info.terminalSetting = this.terminalSetting
      this.setting(this.info)
      this.formStatus.visible = false
    }
  }
}
</script>
