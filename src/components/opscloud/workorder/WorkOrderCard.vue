<template>
  <div>
    <el-card shadow="hover">
      <!--      accordion-->
      <el-collapse v-model="activeNames">
        <div v-for="(group,index) in workOrderView.workOrderGroups" :key="group.id">
          <el-collapse-item :name="index">
            <template slot="title">
              <i :class="group.icon" style="margin-right: 5px"></i>{{ group.name }}
            </template>
            <!--            style="width: 100%"-->
            <el-table :data="group.workOrders" stripe :show-header=false>
              <el-table-column label="工单">
                <template slot-scope="scope">
                  <i v-if="scope.row.icon !== null && scope.row.icon !== ''" :class="scope.row.icon"
                     style="margin-right: 5px"></i>
                  <span>{{ scope.row.name }}</span>
                  <el-button :type="scope.row.status === 0 ? 'primary' :'warning'"
                             style="float: right"
                             plain size="mini"
                             @click="createTicket(scope.row)"
                             :disabled="disabled"
                             :loading="scope.row.loading">{{ scope.row.status === 0 ? '新建' : '开发中' }}
                  </el-button>
                </template>
              </el-table-column>
            </el-table>
          </el-collapse-item>
        </div>
      </el-collapse>
    </el-card>
  </div>
</template>

<script>

import { GET_WORK_ORDER_VIEW } from '@/api/modules/workorder/workorder.api.js'
import { CREATE_WORK_ORDER_TICKET } from '@/api/modules/workorder/workorder.ticket.api.js'

export default {
  name: 'WorkOrderCard',
  props: ['user'],
  data () {
    return {
      activeNames: [0],
      workOrderView: {},
      disabled: false
    }
  },
  components: {},
  mounted () {
    this.fetchData()
  },
  methods: {
    createTicket (row) {
      row.loading = true
      this.disabled = true
      const workOrderKey = row.workOrderKey
      const requestBody = {
        workOrderKey: workOrderKey
      }
      CREATE_WORK_ORDER_TICKET(requestBody).then(res => {
        const ticket = res.body
        const param = {
          workOrderKey: workOrderKey,
          ticket: ticket
        }
        this.$emit('createTicket', param)
        row.loading = false
        this.disabled = false
      }).catch(() => {
        row.loading = false
        this.disabled = false
      })
    },
    fetchData () {
      GET_WORK_ORDER_VIEW()
        .then(res => {
          this.workOrderView = res.body
        })
    }
  }
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
