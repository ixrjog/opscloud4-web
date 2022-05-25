<template>
  <d2-container>
    <h1>运维文档</h1>
    <el-tabs type="border-card" v-model="activeName" @tab-click="handleClick">
      <el-tab-pane :name="docKeys.CHANNEL_VPN_README">
        <span slot="label"><i class="fab fa-instalod"></i> 渠道VPN</span>
        <my-markdown v-if="docs.vpn !== null" :content="docs.vpn.content"></my-markdown>
      </el-tab-pane>
      <el-tab-pane :name="docKeys.B_ARCHITECT">
        <span slot="label"><i class="fab fa-instalod"></i> B侧架构</span>
        <my-markdown v-if="docs.bArchitect !== null" :content="docs.bArchitect.content"></my-markdown>
      </el-tab-pane>
      <el-tab-pane :name="docKeys.C_ARCHITECT">
        <span slot="label"><i class="fab fa-instalod"></i> C侧架构</span>
        <my-markdown v-if="docs.cArchitect !== null" :content="docs.cArchitect.content"></my-markdown>
      </el-tab-pane>
    </el-tabs>
  </d2-container>
</template>

<script>

import MyMarkdown from '@/components/opscloud/common/MyMarkdown'
import { PREVIEW_DOCUMENT } from '@/api/modules/sys/sys.doc.api.js'

const docKeys = {
  CHANNEL_VPN_README: 'CHANNEL_VPN_README',
  B_ARCHITECT: 'B_ARCHITECT',
  C_ARCHITECT: 'C_ARCHITECT'
}

export default {
  data () {
    return {
      activeName: docKeys.CHANNEL_VPN_README,
      docs: {
        vpn: null,
        bArchitect: null,
        cArchitect:null
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
            case this.docKeys.B_ARCHITECT:
              this.docs.bArchitect = res.body
              break
            case this.docKeys.C_ARCHITECT:
              this.docs.cArchitect = res.body
              break
          }
        })
    }
  }
}
</script>
