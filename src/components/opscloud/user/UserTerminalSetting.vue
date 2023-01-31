<template>
  <el-dialog :title="title" :visible.sync="formStatus.visible" width="30%">
    <el-form :model="terminalSetting" :label-width="labelWidth">
      <el-form-item label="Foreground">
        <el-color-picker v-model="terminalSetting.theme.foreground"></el-color-picker>
      </el-form-item>
      <el-form-item label="Background">
        <el-color-picker v-model="terminalSetting.theme.background"></el-color-picker>
      </el-form-item>
      <el-form-item label="Windows Rows">
        <el-input-number v-model="terminalSetting.rows" :min="22" :max="60" label="终端行数"></el-input-number>
      </el-form-item>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button size="mini" @click="formStatus.visible = false">Cancel</el-button>
      <el-button size="mini" type="primary" @click="handlerSave">Save</el-button>
    </div>
  </el-dialog>
</template>

<script>
import { mapActions, mapState } from 'vuex'

export default {
  data () {
    return {
      title: 'User Profiles',
      labelWidth: '150px',
      terminalSetting: {
        theme: {
          foreground: '#FFFFFF', // 字体
          background: '#090909' // 背景色
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
