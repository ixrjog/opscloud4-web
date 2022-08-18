<template>
  <d2-container>
    <h1>帮助文档</h1>
    <el-tabs type="border-card" v-model="activeName" @tab-click="handleClick">
      <el-tab-pane :name="docKeys.APPLICATION_SCALE_REPLICAS_README">
        <span slot="label"><i class="fas fa-location-arrow"></i> 应用副本扩容</span>
        <my-markdown v-if="docs.scaleReplicas !== null" :content="docs.scaleReplicas.content"></my-markdown>
      </el-tab-pane>
    </el-tabs>
  </d2-container>
</template>

<script>

import MyMarkdown from '@/components/opscloud/common/MyMarkdown'
import { PREVIEW_DOCUMENT } from '@/api/modules/sys/sys.doc.api.js'

const docKeys = {
  APPLICATION_SCALE_REPLICAS_README: 'APPLICATION_SCALE_REPLICAS_README'
}

export default {
  data () {
    return {
      activeName: docKeys.APPLICATION_SCALE_REPLICAS_README,
      docs: {
        scaleReplicas: null
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
    this.fetchDoc(this.docKeys.APPLICATION_SCALE_REPLICAS_README)
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
            case this.docKeys.APPLICATION_SCALE_REPLICAS_README:
              this.docs.scaleReplicas = res.body
              break
          }
        })
    }
  }
}
</script>
