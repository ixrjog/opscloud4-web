<template>
  <d2-container>
    <el-tabs type="border-card" v-model="activeName" @tab-click="handleClick">
      <el-tab-pane :name="docKeys.SSH_SERVER_README">
        <span slot="label"><i class="fas fa-bookmark"></i> 使用前</span>
        <my-markdown v-if="docs.introduction !== null" :content="docs.introduction.content"></my-markdown>
      </el-tab-pane>
      <el-tab-pane :name="docKeys.SSH_SERVER_LOGIN_README">
        <span slot="label"><i class="fas fa-sign-in-alt"></i> 登录认证</span>
        <my-markdown v-if="docs.login !== null" :content="docs.login.content"></my-markdown>
      </el-tab-pane>
      <el-tab-pane :name="docKeys.SSH_SERVER_KUBERNETES_README">
        <span slot="label"><i class="fab fa-docker"></i> Kubernetes</span>
        <my-markdown v-if="docs.kubernetes !== null" :content="docs.kubernetes.content"></my-markdown>
      </el-tab-pane>
      <el-tab-pane :name="docKeys.SSH_SERVER_SERVER_README">
        <span slot="label"><i class="fas fa-server"></i> Server</span>
        <my-markdown v-if="docs.server !== null" :content="docs.server.content"></my-markdown>
      </el-tab-pane>
      <el-tab-pane :name="docKeys.SSH_SERVER_EVENT_README">
        <span slot="label"><i class="fab fa-google-drive"></i> Event</span>
        <my-markdown v-if="docs.event !== null" :content="docs.event.content"></my-markdown>
      </el-tab-pane>
    </el-tabs>

  </d2-container>
</template>

<script>

import { PREVIEW_DOCUMENT } from '@/api/modules/sys/sys.doc.api.js'
import MyMarkdown from '@/components/opscloud/common/MyMarkdown'

const docKeys = {
  SSH_SERVER_README: 'SSH_SERVER_README',
  SSH_SERVER_LOGIN_README: 'SSH_SERVER_LOGIN_README',
  SSH_SERVER_KUBERNETES_README: 'SSH_SERVER_KUBERNETES_README',
  SSH_SERVER_SERVER_README: 'SSH_SERVER_SERVER_README',
  SSH_SERVER_EVENT_README: 'SSH_SERVER_EVENT_README'
}

export default {
  name: 'ssh-server',
  data () {
    return {
      activeName: docKeys.SSH_SERVER_README,
      docs: {
        introduction: null,
        login: null,
        kubernetes: null,
        server: null,
        event: null
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
    this.fetchDoc(this.docKeys.SSH_SERVER_README)
    // for (let key in this.docKeys) {
    //   this.fetchDoc(this.docKeys[key])
    // }
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
            case this.docKeys.SSH_SERVER_README:
              this.docs.introduction = res.body
              break
            case this.docKeys.SSH_SERVER_LOGIN_README:
              this.docs.login = res.body
              break
            case this.docKeys.SSH_SERVER_KUBERNETES_README:
              this.docs.kubernetes = res.body
              break
            case this.docKeys.SSH_SERVER_SERVER_README:
              this.docs.server = res.body
              break
            case this.docKeys.SSH_SERVER_EVENT_README:
              this.docs.event = res.body
              break
          }
        })
    }
  }
}
</script>

<style scoped>

</style>
