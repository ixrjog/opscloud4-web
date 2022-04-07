<template>
  <d2-container>
    <h1>帮助文档</h1>
    <el-tabs type="border-card" v-model="activeName" @tab-click="handleClick">
      <el-tab-pane :name="docKeys.RAM_README">
        <span slot="label"><i class="fab fa-ubuntu"></i> 阿里云RAM(访问控制)</span>
        <my-markdown v-if="docs.ram !== null" :content="docs.ram.content"></my-markdown>
      </el-tab-pane>
      <el-tab-pane :name="docKeys.LOG_README">
        <span slot="label"><i class="fas fa-stream"></i> 阿里云Log(日志服务)</span>
        <my-markdown v-if="docs.log !== null" :content="docs.log.content"></my-markdown>
      </el-tab-pane>
      <el-tab-pane :name="docKeys.ARMS_README">
        <span slot="label"><i class="fas fa-stream"></i> 阿里云ARMS(应用实时监控服务)</span>
        <my-markdown v-if="docs.arms !== null" :content="docs.arms.content"></my-markdown>
      </el-tab-pane>
    </el-tabs>
  </d2-container>
</template>

<script>

import MyMarkdown from '@/components/opscloud/common/MyMarkdown'
import { PREVIEW_DOCUMENT } from '@/api/modules/sys/sys.doc.api.js'

const docKeys = {
  RAM_README: 'RAM_README',
  LOG_README: 'LOG_README',
  ARMS_README: 'ARMS_README'
}

export default {
  data () {
    return {
      activeName: docKeys.RAM_README,
      docs: {
        ram: null,
        log: null,
        arms: null
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
    this.fetchDoc(this.docKeys.RAM_README)
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
            case this.docKeys.RAM_README:
              this.docs.ram = res.body
              break
            case this.docKeys.LOG_README:
              this.docs.log = res.body
              break
            case this.docKeys.ARMS_README:
              this.docs.arms = res.body
              break
          }
        })
    }
  }
}
</script>
