<!--suppress HtmlUnknownTag -->
<template>
  <el-dialog :title="$t('webTerm.settings.userProfiles')" :visible.sync="formStatus.visible" width="30%">
    <el-form :model="terminalSettings" :label-width="labelWidth">
      <el-form-item :label="$t('webTerm.settings.foreground')">
        <el-color-picker v-model="terminalSettings.theme.foreground"/>
      </el-form-item>
      <el-form-item :label="$t('webTerm.settings.background')">
        <el-color-picker v-model="terminalSettings.theme.background"/>
      </el-form-item>
      <el-form-item :label="$t('webTerm.settings.cursor')">
        <el-color-picker v-model="terminalSettings.theme.cursor"/>
      </el-form-item>
      <el-form-item label="Cursor Accent" v-if="false">
        <el-color-picker v-model="terminalSettings.theme.cursorAccent"/>
      </el-form-item>
      <el-form-item :label="$t('webTerm.settings.selection')">
        <el-color-picker v-model="terminalSettings.theme.selection"/>
      </el-form-item>
      <el-form-item :label="$t('webTerm.settings.windowsRows')">
        <el-input-number v-model="terminalSettings.rows" :min="22" :max="60" label="终端行数"/>
      </el-form-item>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button size="mini" @click="formStatus.visible = false">{{ $t('common.cancel') }}</el-button>
      <el-button size="mini" type="primary" @click="save">{{ $t('common.save') }}</el-button>
    </div>
  </el-dialog>
</template>

<script>

import { mapActions, mapState } from 'vuex'

import TerminalSettings from '@/components/opscloud/common/enums/terminal.settings.js'

export default {
  data () {
    return {
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
