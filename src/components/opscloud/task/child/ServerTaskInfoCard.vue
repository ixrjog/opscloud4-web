<template>
  <el-card shadow="hover" style="margin-top: 5px">
    <div slot="header" class="clearfix">
      <span style="margin-left: 20px;font-size: 12px">执行任务详情
        <el-tag size="mini" style="margin-left: 5px">TaskUUID : {{ serverTaskInfo.taskUuid }}</el-tag>
      </span>
    </div>
    <el-table :data="serverTaskInfo.servers" style="width: 100%">
      <el-table-column prop="name" label="名称" width="200"></el-table-column>
      <el-table-column prop="serialNumber" label="序号" width="80" sortable></el-table-column>
      <el-table-column prop="publicIp" label="公网IP" width="120"></el-table-column>
      <el-table-column prop="privateIp" label="私网IP" width="120"></el-table-column>
      <el-table-column prop="env" label="环境" width="80">
        <template slot-scope="scope">
          <env-tag :env="scope.row.env"></env-tag>
        </template>
      </el-table-column>
    </el-table>
    <div style="width:100%;text-align:center">
      <el-button size="mini" type="primary" @click="close">关闭
      </el-button>
    </div>
  </el-card>
</template>

<script>
import EnvTag from '../../common/tag/EnvTag'

export default {
  name: 'ServerTaskInfoCard',
  props: ['serverTaskInfo'],
  components: {
    EnvTag
  },
  methods: {
    close () {
      this.$emit('close')
    }
  }
}
</script>

<style scoped>

</style>
