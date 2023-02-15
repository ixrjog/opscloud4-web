<template>
  <div v-if="docZone.zone.isActive" :key="key">
    <el-tabs type="border-card" v-model="activeName" @tab-click="handleClick">
      <el-tab-pane v-for="doc in docZone.docs" :name="doc.documentKey" :key="doc.id">
        <span slot="label"><i :class="doc.icon"></i> {{ doc.name }}</span>
        <my-markdown :content="doc.content"></my-markdown>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>

import { GET_DOCUMENT_ZONE } from '@/api/modules/sys/sys.doc.api'
import MyMarkdown from '@/components/opscloud/common/MyMarkdown.vue'

export default {
  name: 'DocumentZone',
  props: ['mountZone'],
  data () {
    return {
      key: 0,
      activeName: '',
      docZone: {
        zone: {
          isActive: false
        },
        docs: []
      },
      dict: {
        sshServerHost: window.location.hostname
      }
    }
  },
  components: {
    MyMarkdown
  },
  mounted () {
    this.fetchData()
  },
  methods: {
    handleClick (tab, event) {
      this.key++
    },
    fetchData (key) {
      const requestBody = {
        mountZone: this.mountZone,
        dict: this.dict
      }
      GET_DOCUMENT_ZONE(requestBody)
        .then(res => {
          this.docZone = res.body
          if (this.docZone.zone.isActive) {
            this.activeName = this.docZone.docs[0].documentKey
          }
        })
    }
  }
}
</script>

<style scoped>

</style>
