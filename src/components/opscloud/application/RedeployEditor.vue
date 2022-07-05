<template>
  <el-dialog title="Deployment重新部署操作"
             :visible.sync="formStatus.visible" width="50%">
    <el-form :model="resource">
      <el-form-item label="命名空间" :label-width="labelWidth">
        <el-input v-model="resource.asset.assetKey2" readonly></el-input>
      </el-form-item>
      <el-form-item label="Deployment" :label-width="labelWidth">
        <el-input v-model="resource.asset.assetKey" readonly></el-input>
      </el-form-item>
      <el-form-item label="标签" :label-width="labelWidth">
        <business-tags :tags="resource.tags"></business-tags>
      </el-form-item>
      <el-form-item label="操作说明" :label-width="labelWidth" required>
        <el-input v-model="requestParam.comment" placeholder="生产环境执行操作必须说明原因"></el-input>
      </el-form-item>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button size="mini" @click="formStatus.visible = false">取消</el-button>
      <el-button size="mini" type="primary" @click="handleOperation">确定</el-button>
    </div>
  </el-dialog>
</template>

<script>

// API
import BusinessTags from '@/components/opscloud/common/tag/BusinessTags'
import { OPERATION_APPLICATION_RES } from '@/api/modules/application/application.api'

export default {
  data () {
    return {
      labelWidth: '150px',
      resource: '',
      requestParam : {
        comment: ''
      }
    }
  },
  name: 'RedeployEditor',
  props: ['formStatus'],
  components: {
    BusinessTags
  },
  mixins: [],
  mounted () {
  },
  methods: {
    initData (resource) {
      this.resource = resource
      this.requestParam.comment = ''
    },
    // handleClick (tab, event) {
    //   if (tab.name === 'document') {
    //     this.$refs.businessDocEditor.open(this.server.document)
    //   }
    // },
    handleOperation () {
      let requestBody = {
        resourceId: this.resource.id,
        operationType: 'REDEPLOY',
        comment: this.requestParam.comment
      }
      OPERATION_APPLICATION_RES(requestBody)
        .then(() => {
          this.$message.success('执行成功!')
        })
    }
  }
}
</script>
