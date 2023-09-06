<!--suppress HtmlUnknownTag -->
<template>
  <el-dialog :title="$t('leo.build.buildDetail')" :visible.sync="formStatus.visible" width="50%" append-to-body>
    <el-tabs v-model="activeName" @tab-click="handleClick">
      <el-tab-pane :label="$t('leo.build.versionInformation')" name="build" v-if="leoBuild != null">
        <el-form :model="leoBuild">
          <el-form-item :label="$t('leo.build.versionName')" :label-width="formStatus.labelWidth">
            <el-input v-model="leoBuild.versionName"/>
          </el-form-item>
          <el-form-item :label="$t('leo.build.versionDesc')" :label-width="formStatus.labelWidth">
            <el-input v-model="leoBuild.versionDesc"/>
          </el-form-item>
          <el-form-item :label="$t('common.active')" :label-width="formStatus.labelWidth" required>
            <el-select v-model="leoBuild.isActive">
              <el-option v-for="item in activeOptions"
                         :key="item.value"
                         :label="$t(item.label)"
                         :value="item.value"/>
            </el-select>
          </el-form-item>
        </el-form>
      </el-tab-pane>
      <el-tab-pane :label="$t('leo.build.buildConfig')" name="buildConfig" v-if="leoBuild != null">
        <el-row>
          <el-card shadow="never">
            <my-highlight :code="leoBuild.buildConfig" lang="yaml" :myStyle="style"/>
          </el-card>
        </el-row>
      </el-tab-pane>
    </el-tabs>
    <div slot="footer" class="dialog-footer">
      <el-button size="mini" @click="formStatus.visible = false">{{ $t('common.close') }}</el-button>
      <el-button size="mini" type="primary" @click="handleSave">{{ $t('common.ok') }}</el-button>
    </div>
  </el-dialog>
</template>

<script>

import MyHighlight from '@/components/opscloud/common/MyHighlight'
import { UPDATE_LEO_BUILD } from '@/api/modules/leo/leo.build.api'

const activeOptions = [{
  value: true,
  label: 'common.activeOptions.active'
}, {
  value: false,
  label: 'common.activeOptions.inactive'
}]

export default {
  data () {
    return {
      activeName: 'build',
      leoBuild: null,
      editing: false,
      style: { height: '400px' },
      activeOptions: activeOptions
    }
  },
  name: 'LeoBuildDetailsEditor',
  props: ['formStatus'],
  components: {
    MyHighlight
  },
  mixins: [],
  mounted () {
  },
  methods: {
    initData (leoBuild) {
      this.activeName = 'build'
      this.leoBuild = leoBuild
    },
    handleClick (tab, event) {
      if (tab.name === 'build') {
        this.editing = false
      }
    },
    handleSave () {
      UPDATE_LEO_BUILD(this.leoBuild)
        .then(() => {
          this.$message.success('保存成功!')
          this.formStatus.visible = false
          this.$emit('close')
        })
    }
  }
}
</script>
