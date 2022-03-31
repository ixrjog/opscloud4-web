<template>
  <d2-container>
    <h1>帮助文档</h1>
    <el-tabs type="border-card" v-model="activeName" @tab-click="handleClick">
      <el-tab-pane :name="docKeys.NEXUS_README">
        <span slot="label"><i class="fab fa-instalod"></i> Nexus构件仓库</span>
        <my-markdown v-if="docs.nexus !== null" :content="docs.nexus.content"></my-markdown>
      </el-tab-pane>
    </el-tabs>
  </d2-container>
</template>

<script>

import MyMarkdown from '@/components/opscloud/common/MyMarkdown'
import { PREVIEW_DOCUMENT } from '@/api/modules/sys/sys.doc.api.js'

const docKeys = {
  NEXUS_README: 'NEXUS_README'
}

export default {
  data () {
    return {
      activeName: docKeys.NEXUS_README,
      docs: {
        nexus: null
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
    this.fetchDoc(this.docKeys.NEXUS_README)
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
            case this.docKeys.NEXUS_README:
              this.docs.nexus = res.body
              break
          }
        })
    }
  }
}
</script>
