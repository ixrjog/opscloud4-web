<template>
  <d2-container>
    <h1>模板管理</h1>
    <el-tabs v-model="activeName" @tab-click="handleClick">
      <el-tab-pane label="消息模板管理" name="message">
        <message-template-table ref="messageTemplateTable"></message-template-table>
      </el-tab-pane>
    </el-tabs>
  </d2-container>
</template>

<script>

import MessageTemplateTable from '@/components/opscloud/sys/MessageTemplateTable.vue'

export default {
  data () {
    return {
      activeName: 'message'
    }
  },
  components: {
    MessageTemplateTable
  },
  mounted () {
    setTimeout(() => {
      if (this.$refs.messageTemplateTable) {
        this.$refs.messageTemplateTable.fetchData()
      }
    }, 50)
  },
  methods: {
    handleClick (tab, event) {
      if (tab.name === 'message') {
        this.$refs.messageTemplateTable.fetchData()
        return
      }
    }
  }
}
</script>
