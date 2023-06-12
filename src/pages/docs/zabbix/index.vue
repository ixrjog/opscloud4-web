<!--suppress HtmlUnknownTag -->
<template>
  <d2-container>
    <h1>帮助文档</h1>
    <el-tabs type="border-card" v-model="activeName" @tab-click="handleClick">
      <el-tab-pane :name="docKeys.ZABBIX_README">
        <span slot="label"><i class="fab fa-instalod"></i> ZABBIX</span>
        <my-markdown v-if="docs.zbx !== null" :content="docs.zbx.content"/>
      </el-tab-pane>
    </el-tabs>
  </d2-container>
</template>

<script>

import MyMarkdown from '@/components/opscloud/common/MyMarkdown'
import { PREVIEW_DOCUMENT } from '@/api/modules/sys/sys.doc.api.js'

const docKeys = {
  ZABBIX_README: 'ZABBIX_README'
}

export default {
  data () {
    return {
      activeName: docKeys.ZABBIX_README,
      docs: {
        zbx: null
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
    this.fetchDoc(this.docKeys.ZABBIX_README)
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
            case this.docKeys.ZABBIX_README:
              this.docs.zbx = res.body
              break
          }
        })
    }
  }
}
</script>
