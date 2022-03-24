<template>
  <el-dialog title="编辑数据源实例动态分布式任务" :visible.sync="formStatus.visible">
    <el-form :model="instanceSchedule">
      <el-table :data="instanceSchedule.schedules" style="width: 100%">
        <el-table-column prop="name" label="任务名称" width="100"></el-table-column>
        <el-table-column prop="cronExpression" label="CRON表达式" width="100">
          <template slot-scope="scope">
            <span>{{ scope.row.cronExpression }}</span>
            <el-popover placement="right" trigger="hover" title="最近5次执行时间">
              <i class="el-icon-info" style="color: green;margin-left: 5px" slot="reference"></i>
              <div v-for="time in scope.row.executionTime">
                <span>{{ time }}</span>
              </div>
            </el-popover>
          </template>
        </el-table-column>
        <el-table-column prop="status" label="状态" width="80">
          <template slot-scope="scope">
            <el-tag>{{ scope.row.status }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="description" label="描述" width="120"></el-table-column>
        <el-table-column label="操作" width="80">
          <template slot-scope="scope">
            <el-button type="danger" plain size="mini" @click="handleDelSchedule(scope.row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>

    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button size="mini" @click="formStatus.visible = false">关闭</el-button>
    </div>
  </el-dialog>
</template>

<script>
export default {
  name: 'DsInstanceScheduleEditor',
  props: ['formStatus'],
  data () {
    return {
      labelWidth: '150px',
      instanceSchedule: {
        schedules: [],
        instance: {}
      }
    }
  },
  mixins: [],
  components: {},
  methods: {
    initData (instanceSchedule) {
      this.instanceSchedule = instanceSchedule
    },
    handleDelSchedule (row) {

    }
  }
}
</script>

<style scoped>

</style>
