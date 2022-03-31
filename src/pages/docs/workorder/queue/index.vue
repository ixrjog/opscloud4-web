<template>
  <d2-container>
    <h1>帮助文档</h1>
    <el-tabs type="border-card" v-model="activeName" @tab-click="handleClick">
      <el-tab-pane :name="docKeys.SQS_README">
        <span slot="label"><i class="fab fa-ubuntu"></i> SQS消息队列</span>
        <my-markdown v-if="docs.sqs !== null" :content="docs.sqs.content"></my-markdown>
      </el-tab-pane>
      <el-tab-pane :name="docKeys.SNS_README">
        <span slot="label"><i class="fas fa-stream"></i> SNS消息收发服务</span>
        <my-markdown v-if="docs.sns !== null" :content="docs.sns.content"></my-markdown>
      </el-tab-pane>
    </el-tabs>
  </d2-container>
</template>

<script>

import MyMarkdown from '@/components/opscloud/common/MyMarkdown'
import { PREVIEW_DOCUMENT } from '@/api/modules/sys/sys.doc.api.js'

const docKeys = {
  SQS_README: 'SQS_README',
  SNS_README: 'SNS_README'
}

export default {
  data () {
    return {
      activeName: docKeys.SQS_README,
      docs: {
        sqs: null,
        sns: null
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
    this.fetchDoc(this.docKeys.SQS_README)
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
            case this.docKeys.SQS_README:
              this.docs.sqs = res.body
              break
            case this.docKeys.SNS_README:
              this.docs.sns = res.body
              break
          }
        })
    }
  }
}
</script>
