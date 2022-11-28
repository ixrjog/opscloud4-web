<template>
  <d2-container>
    <h1>帮助文档</h1>
    <el-tabs type="border-card" v-model="activeName" @tab-click="handleClick">
      <el-tab-pane :name="docKeys.IAM_README">
        <span slot="label"><i class="fab fa-aws"></i> Amazon IAM(身份认证)</span>
        <my-markdown v-if="docs.iam !== null" :content="docs.iam.content"></my-markdown>
      </el-tab-pane>
    </el-tabs>
  </d2-container>
</template>

<script>

import MyMarkdown from '@/components/opscloud/common/MyMarkdown'
import { PREVIEW_DOCUMENT } from '@/api/modules/sys/sys.doc.api.js'

const docKeys = {
  IAM_README: 'IAM_README'
}

export default {
  data () {
    return {
      activeName: docKeys.IAM_README,
      docs: {
        iam: null
      },
      docKeys: docKeys,
      dict: {
        sshServerHost: window.location.hostname
      }
    }
  },
  components: {
    MyMarkdown
  },
  mounted () {
    this.fetchDoc(this.docKeys.IAM_README)
  },
  methods: {
    handleClick (tab, event) {
      this.fetchDoc(tab.name)
    },
    fetchDoc (key) {
      const requestBody = {
        dict: this.dict,
        documentKey: key
      }
      PREVIEW_DOCUMENT(requestBody)
        .then(res => {
          switch (key) {
            case this.docKeys.IAM_README:
              this.docs.iam = res.body
              break
          }
        })
    }
  }
}
</script>
