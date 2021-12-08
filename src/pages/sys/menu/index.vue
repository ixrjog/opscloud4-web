<template>
  <d2-container>
    <h1>{{ title }}</h1>
    <el-row :gutter="40">
      <el-col :span="9">
        <menu-card @handlerMenuChild="handlerMenuChild"></menu-card>
      </el-col>
      <el-col :span="12">
        <menu-child-card ref="menuChildCard"></menu-child-card>
      </el-col>
    </el-row>
  </d2-container>
</template>

<script>

import MenuCard from '@/components/opscloud/sys/MenuCard'
import MenuChildCard from '@/components/opscloud/sys/MenuChildCard'

export default {
  data () {
    return {
      title: '菜单管理'
    }
  },
  components: {
    MenuCard,
    MenuChildCard
  },
  mounted () {
  },
  methods: {
    handlerMenuChild (menuId, title) {
      this.$refs.menuChildCard.initData(menuId, title)
    }
  }
}
</script>

<style scoped>
</style>
