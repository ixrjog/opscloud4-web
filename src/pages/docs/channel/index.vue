<template>
  <d2-container>
    <h1>帮助文档</h1>
    <el-tabs type="border-card" v-model="activeName" @tab-click="handleClick">
      <el-tab-pane :name="docKeys.CHANNEL_VPN_README">
        <span slot="label"><i class="fab fa-instalod"></i> 渠道VPN</span>
        <my-markdown v-if="docs.vpn !== null" :content="docs.vpn.content"></my-markdown>
      </el-tab-pane>
    </el-tabs>
  </d2-container>
</template>

<script>

import MyMarkdown from '@/components/opscloud/common/MyMarkdown'
import { PREVIEW_DOCUMENT } from '@/api/modules/sys/sys.doc.api.js'

const docKeys = {
  CHANNEL_VPN_README: 'CHANNEL_VPN_README'
}

export default {
  data () {
    return {
      activeName: docKeys.CHANNEL_VPN_README,
      docs: {
        vpn: null
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
    this.fetchDoc(this.docKeys.CHANNEL_VPN_README)
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
            case this.docKeys.CHANNEL_VPN_README:
              this.docs.vpn = res.body
              break
          }
        })
    }
  }
}
</script>
