<template>
  <d2-container>
    <h1>帮助文档</h1>
    <el-tabs type="border-card" v-model="activeName" @tab-click="handleClick">
      <el-tab-pane :name="docKeys.NACOS_B_README">
        <span slot="label"><i class="fab fa-instalod"></i>商户域 Nacos</span>
        <my-markdown v-if="docs.bNacos !== null" :content="docs.bNacos.content"></my-markdown>
      </el-tab-pane>
      <el-tab-pane :name="docKeys.NACOS_C_README">
        <span slot="label"><i class="fab fa-instalod"></i>用户域 Nacos</span>
        <my-markdown v-if="docs.cNacos !== null" :content="docs.cNacos.content"></my-markdown>
      </el-tab-pane>
    </el-tabs>
  </d2-container>
</template>

<script>

import MyMarkdown from '@/components/opscloud/common/MyMarkdown'
import { PREVIEW_DOCUMENT } from '@/api/modules/sys/sys.doc.api.js'

const docKeys = {
  NACOS_B_README: 'NACOS_B_README',
  NACOS_C_README: 'NACOS_C_README'
}

export default {
  data () {
    return {
      activeName: docKeys.NACOS_B_README,
      docs: {
        bNacos: null,
        cNacos: null
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
    this.fetchDoc(this.docKeys.NACOS_B_README)
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
            case this.docKeys.NACOS_B_README:
              this.docs.bNacos = res.body
              break
            case this.docKeys.NACOS_C_README:
              this.docs.cNacos = res.body
              break
          }
        })
    }
  }
}
</script>
