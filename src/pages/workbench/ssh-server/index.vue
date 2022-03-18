<template>
  <d2-container>
    <el-tabs type="border-card" v-model="activeName" @tab-click="handleClick">
      <el-tab-pane :name="docKeys.SSH_SERVER_README">
        <span slot="label"><i class="fas fa-bookmark"></i> 使用前</span>
        <markdown-it-vue v-if="docs.introduction !== null" :content="docs.introduction.content"
                         :options="options"></markdown-it-vue>
      </el-tab-pane>
      <el-tab-pane :name="docKeys.SSH_SERVER_LOGIN_README">
        <span slot="label"><i class="fas fa-sign-in-alt"></i> 登录认证</span>
        <markdown-it-vue v-if="docs.login !== null" :content="docs.login.content" :options="options"></markdown-it-vue>
      </el-tab-pane>
      <el-tab-pane :name="docKeys.SSH_SERVER_KUBERNETES_README">
        <span slot="label"><i class="fab fa-docker"></i> Kubernetes</span>
        <markdown-it-vue v-if="docs.kubernetes !== null" :content="docs.kubernetes.content"
                         :options="options"></markdown-it-vue>
      </el-tab-pane>
      <el-tab-pane :name="docKeys.SSH_SERVER_SERVER_README">
        <span slot="label"><i class="fas fa-server"></i> Server</span>
        <markdown-it-vue v-if="docs.server !== null" :content="docs.server.content"
                         :options="options"></markdown-it-vue>
      </el-tab-pane>
      <el-tab-pane :name="docKeys.SSH_SERVER_EVENT_README">
        <span slot="label"><i class="fab fa-google-drive"></i> Event</span>
        <markdown-it-vue v-if="docs.event !== null" :content="docs.event.content" :options="options"></markdown-it-vue>
      </el-tab-pane>
    </el-tabs>

  </d2-container>
</template>

<script>
import MarkdownItVue from 'markdown-it-vue'
import 'markdown-it-vue/dist/markdown-it-vue-light.css'
import 'highlight.js/scss/default.scss'
import 'highlight.js/styles/vs2015.css'
import { PREVIEW_DOCUMENT } from '@/api/modules/sys/sys.doc.api.js'

const docKeys = {
  SSH_SERVER_README: 'SSH_SERVER_README',
  SSH_SERVER_LOGIN_README: 'SSH_SERVER_LOGIN_README',
  SSH_SERVER_KUBERNETES_README: 'SSH_SERVER_KUBERNETES_README',
  SSH_SERVER_SERVER_README: 'SSH_SERVER_SERVER_README',
  SSH_SERVER_EVENT_README: 'SSH_SERVER_EVENT_README'
}

const options = {
  markdownIt: {
    html: true,
    linkify: true
  },
  linkAttributes: {
    attrs: {
      target: '_blank',
      rel: 'noopener'
    }
  },
  katex: {
    throwOnError: false,
    errorColor: '#cc0000'
  },
  icons: 'font-awesome',
  githubToc: {
    tocFirstLevel: 2,
    tocLastLevel: 3,
    tocClassName: 'toc',
    anchorLinkSymbol: '',
    anchorLinkSpace: false,
    anchorClassName: 'anchor',
    anchorLinkSymbolClassName: 'octicon octicon-link'
  },
  mermaid: {
    theme: 'default'
  },
  image: {
    hAlign: 'left',
    viewer: true
  }
}

export default {
  name: 'index',
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
      },
      options: options
    }
  },
  components: {
    MarkdownItVue
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

<style>

pre {
  /*控制代码不换行*/
  white-space: pre;
  word-wrap: normal;
  background: #535353 !important;
  border-radius: 4px;
  font-size: 8px;
}

.markdown-body {
  font-size: 10px;
}

</style>
