<!--suppress HtmlUnknownTag -->
<template>
  <el-dialog :title="title" :visible.sync="formStatus.visible" width="30%">
    <el-form :model="terminalSettings" :label-width="labelWidth">
      <el-form-item label="Foreground">
        <el-color-picker v-model="terminalSettings.theme.foreground"/>
      </el-form-item>
      <el-form-item label="Background">
        <el-color-picker v-model="terminalSettings.theme.background"/>
      </el-form-item>
      <el-form-item label="Cursor">
        <el-color-picker v-model="terminalSettings.theme.cursor"/>
      </el-form-item>
      <el-form-item label="Cursor Accent" v-if="false">
        <el-color-picker v-model="terminalSettings.theme.cursorAccent"/>
      </el-form-item>
      <el-form-item label="Selection">
        <el-color-picker v-model="terminalSettings.theme.selection"/>
      </el-form-item>
      <el-form-item label="Windows Rows">
        <el-input-number v-model="terminalSettings.rows" :min="22" :max="60" label="终端行数"/>
      </el-form-item>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button size="mini" @click="formStatus.visible = false">Cancel</el-button>
      <el-button size="mini" type="primary" @click="save">Save</el-button>
    </div>
  </el-dialog>
</template>

<script>

import { mapActions, mapState } from 'vuex'

import TerminalSettings from '@/components/opscloud/common/enums/terminal.settings.js'

export default {
  data () {
    return {
      title: 'User Profiles',
      labelWidth: '180px',
      // Docs https://github.com/xtermjs/xterm.js/blob/5.1.0/typings/xterm.d.ts
      terminalSettings: TerminalSettings
    }
  },
  name: 'UserTerminalSettings',
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
      if (typeof (this.info.terminalSettings) !== 'undefined') {
        this.terminalSettings = this.info.terminalSettings
      }
    },
    save () {
      this.info.terminalSettings = this.terminalSettings
      this.setting(this.info)
      this.formStatus.visible = false
    }
  }
}
</script>
