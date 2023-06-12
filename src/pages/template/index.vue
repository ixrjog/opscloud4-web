<!--suppress HtmlUnknownTag -->
<template>
  <d2-container>
    <h1>模板管理</h1>
    <el-tabs v-model="activeName" @tab-click="handleClick">
      <el-tab-pane label="模板" name="template">
        <template-table ref="templateTable"/>
      </el-tab-pane>
    </el-tabs>
  </d2-container>
</template>

<script>

import TemplateTable from '@/components/opscloud/template/TemplateTable'

export default {
  data () {
    return {
      activeName: 'template'
    }
  },
  computed: {},
  mounted () {
    this.init()
  },
  components: {
    TemplateTable
  },
  methods: {
    handleClick (tab, event) {
      if (tab.name === 'template') {
        this.$refs.templateTable.fetchData()
      }
    },
    init () {
      setTimeout(() => {
        if (this.$refs.templateTable) {
          this.$refs.templateTable.fetchData()
        }
      }, 50)
    }
  }
}
</script>

<style scoped>
.el-input {
  display: inline-block;
  max-width: 200px;
  margin-left: 10px;
}

.el-select {
  margin-left: 5px;
}

.el-button {
  margin-left: 5px;
}

>>> .el-card__header {
  padding: 10px 10px;
  border-bottom: 1px solid #EBEEF5;
  -webkit-box-sizing: border-box;
  box-sizing: border-box;
}

</style>
