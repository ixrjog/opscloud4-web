<template>
  <el-dialog :title="formStatus.title" :visible.sync="formStatus.visible">
    <el-form :model="businessTags">
      <el-transfer v-model="businessTags.tagIds"
                   :props="{ key: 'id', label: 'tagKey' }"
                   :data="tagOptions"
                   :titles="['所有标签', '当前标签']">
      </el-transfer>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button size="mini" @click="formStatus.visible = false">关闭</el-button>
      <el-button type="primary" size="mini" @click="handlerSave">确定</el-button>
    </div>
  </el-dialog>
</template>

<script>
// API
import { UPDATE_BUSINESS_TAGS, GET_TAG_BY_BUSINESS_TYPE } from '@/api/modules/tag/tag.api.js'

export default {
  data () {
    return {
      businessTags: {
        tagIds: []
      },
      tagOptions: []
    }
  },
  name: 'BusinessTagEditor',
  props: ['formStatus', 'businessId', 'businessType'],
  mixins: [],
  mounted () {
  },
  methods: {
    initData (businessTags) {
      this.getTags()
      this.businessTags = businessTags
    },
    getTags () {
      const parameter = {
        businessType: this.businessType
      }
      GET_TAG_BY_BUSINESS_TYPE(parameter)
        .then(res => {
          this.tagOptions = res.body
        })
    },
    handlerSave () {
      const requestBody = Object.assign({}, this.businessTags)
      requestBody.businessType = this.businessType
      requestBody.businessId = this.businessId
      UPDATE_BUSINESS_TAGS(requestBody)
        .then(res => {
          // 返回数据
          this.$message.success('成功!')
          this.formStatus.visible = false
          this.$emit('close')
        })
    }
  }
}
</script>
