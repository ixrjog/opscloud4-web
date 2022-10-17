<template>
  <d2-container>
    <h1>帮助文档</h1>
    <el-tabs type="border-card" v-model="activeName" @tab-click="handleClick">
      <el-tab-pane :name="docKeys.GITLAB_PROJECT_README">
        <span slot="label"><i class="fab fa-gitlab"></i> Gitlab 项目权限申请</span>
        <my-markdown v-if="docs.gitlabProject !== null" :content="docs.gitlabProject.content"></my-markdown>
      </el-tab-pane>
    </el-tabs>
  </d2-container>
</template>

<script>

import MyMarkdown from '@/components/opscloud/common/MyMarkdown'
import { PREVIEW_DOCUMENT } from '@/api/modules/sys/sys.doc.api.js'

const docKeys = {
  GITLAB_PROJECT_README: 'GITLAB_PROJECT_README'
}

export default {
  data () {
    return {
      activeName: docKeys.GITLAB_PROJECT_README,
      docs: {
        gitlabProject: null
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
    this.fetchDoc(this.docKeys.GITLAB_PROJECT_README)
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
            case this.docKeys.GITLAB_PROJECT_README:
              this.docs.gitlabProject = res.body
              break
          }
        })
    }
  }
}
</script>
