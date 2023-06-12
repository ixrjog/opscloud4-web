<!--suppress HtmlUnknownTag -->
<template>
  <d2-container>
    <h1>文档管理</h1>
    <el-tabs v-model="activeName" @tab-click="handleClick">
      <el-tab-pane label="运维文档" name="ops">
        <document-zone mount-zone="OPS_DOCS"/>
      </el-tab-pane>
      <el-tab-pane label="文档区域管理" name="zone">
        <document-zone-table ref="documentZoneTable"/>
      </el-tab-pane>
      <el-tab-pane label="文档管理" name="document">
        <document-table ref="documentTable"/>
      </el-tab-pane>
    </el-tabs>
  </d2-container>
</template>

<script>

import DocumentZone from '@/components/opscloud/sys/DocumentZone.vue'
import DocumentTable from '@/components/opscloud/sys/DocumentTable.vue'
import DocumentZoneTable from '@/components/opscloud/sys/DocumentZoneTable.vue'

export default {
  data () {
    return {
      activeName: 'ops'
    }
  },
  components: {
    DocumentZone,
    DocumentZoneTable,
    DocumentTable
  },
  mounted () {
  },
  methods: {
    handleClick (tab, event) {
      if (tab.name === 'zone') {
        this.$refs.documentZoneTable.fetchData()
      }
      if (tab.name === 'document') {
        this.$refs.documentTable.fetchData()
      }
    }
  }
}
</script>
