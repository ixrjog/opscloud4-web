<template>
  <div>
    <el-card class="box-card" shadow="hover" style="margin-bottom: 10px">
      <div slot="header" class="clearfix">
        <span>平台角色</span>
      </div>
      <div>
        <span class="tag-group">
          <span v-for="item in roles" :key="item.id">
               <el-tooltip class="item" effect="light" :content="item.comment === '' ? '未定义': item.comment"
                           placement="top-start">
                  <el-tag size="mini" style="margin-left: 5px">{{ item.roleName }}</el-tag>
              </el-tooltip>
         </span>
       </span>
      </div>
    </el-card>
  </div>
</template>

<script>
export default {
  name: 'UserRBACRolesInfoCard',
  props: ['roles']
}
</script>

<style scoped>
>>> .el-card__header {
  padding: 10px 10px;
  border-bottom: 1px solid #EBEEF5;
  -webkit-box-sizing: border-box;
  box-sizing: border-box;
}

>>> .el-card__body {
  padding: 10px 10px;
}
</style>
