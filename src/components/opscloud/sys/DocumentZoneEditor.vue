<!--suppress HtmlUnknownTag -->
<template>
  <el-dialog :title="formStatus.updateTitle" :visible.sync="formStatus.visible" width="50%">
    <el-form :model="zone">
      <el-form-item label="名称" :label-width="labelWidth" required>
        <el-input v-model="zone.name" placeholder="请输入内容" size="mini"/>
      </el-form-item>
      <el-form-item label="有效" :label-width="labelWidth" required>
        <el-select v-model="zone.isActive" size="mini" placeholder="选择">
          <el-option v-for="item in activeOptions"
                     :key="item.value"
                     :label="item.label"
                     :value="item.value"/>
        </el-select>
      </el-form-item>
      <el-form-item label="挂载区" :label-width="labelWidth">
        <el-input v-model="zone.mountZone" readonly size="mini"/>
      </el-form-item>
      <el-form-item label="描述" :label-width="labelWidth">
        <el-input v-model="zone.comment" placeholder="请输入内容" size="mini"/>
      </el-form-item>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button size="mini" @click="formStatus.visible = false">取消</el-button>
      <el-button size="mini" type="primary" @click="save">确定</el-button>
    </div>
  </el-dialog>
</template>

<script>

// API
import { UPDATE_DOCUMENT_ZONE } from '@/api/modules/sys/sys.doc.api'

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
      activeOptions: activeOptions,
      labelWidth: '150px',
      zone: ''
    }
  },
  name: 'DocumentZoneEditor',
  props: ['formStatus'],
  components: {},
  mixins: [],
  mounted () {
  },
  methods: {
    initData (zone) {
      this.zone = zone
    },
    save () {
      UPDATE_DOCUMENT_ZONE(this.zone)
        .then(() => {
          this.$message.success('保存成功!')
          this.formStatus.visible = false
          this.$emit('close')
        })
    }
  }
}
</script>
