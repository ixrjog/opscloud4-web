<template>
  <d2-container>
    <h1>Leo模板管理</h1>
    <el-tabs v-model="activeName">
      <el-tab-pane label="模板配置" name="template">
        <leo-template-table></leo-template-table>
      </el-tab-pane>
    </el-tabs>
  </d2-container>
</template>

<script>

import LeoTemplateTable from '@/components/opscloud/leo/LeoTemplateTable'

export default {
  name: 'leoTemplate',
  data () {
    return {
      activeName: 'template'
    }
  },
  mounted () {
  },
  components: {
    LeoTemplateTable
  },
  methods: {
  }
}
</script>

<style scoped>

</style>
