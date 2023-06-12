<!--suppress HtmlUnknownTag -->
<template>
  <el-dialog title="构建详情" :visible.sync="formStatus.visible" width="50%" append-to-body>
    <el-tabs v-model="activeName" @tab-click="handleClick">
      <el-tab-pane label="版本信息" name="build" v-if="leoBuild != null">
        <el-form :model="leoBuild">
          <el-form-item label="版本名称" :label-width="formStatus.labelWidth">
            <el-input v-model="leoBuild.versionName"/>
          </el-form-item>
          <el-form-item label="版本描述" :label-width="formStatus.labelWidth">
            <el-input v-model="leoBuild.versionDesc"/>
          </el-form-item>
          <el-form-item label="有效" :label-width="formStatus.labelWidth" required>
            <el-select v-model="leoBuild.isActive" placeholder="选择类型">
              <el-option v-for="item in activeOptions"
                         :key="item.value"
                         :label="item.label"
                         :value="item.value"/>
            </el-select>
          </el-form-item>
        </el-form>
      </el-tab-pane>
      <el-tab-pane label="构建详情" name="buildConfig" v-if="leoBuild != null">
        <el-row>
          <el-card shadow="never">
            <my-highlight :code="leoBuild.buildConfig" lang="yaml" :myStyle="style"/>
          </el-card>
        </el-row>
      </el-tab-pane>
    </el-tabs>
    <div slot="footer" class="dialog-footer">
      <el-button size="mini" @click="formStatus.visible = false">关闭</el-button>
      <el-button size="mini" type="primary" @click="handleSave">确定</el-button>
    </div>
  </el-dialog>
</template>

<script>

import MyHighlight from '@/components/opscloud/common/MyHighlight'
import { UPDATE_LEO_BUILD } from '@/api/modules/leo/leo.build.api'

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
