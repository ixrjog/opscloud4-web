<template>
  <div>
    <el-card shadow="hover">
      <!--      accordion-->
      <el-collapse v-model="activeNames">
        <div v-for="(group,index) in workOrderView.workOrderGroups" :key="group.id">
          <el-collapse-item :name="index">
            <template slot="title">
              {{ group.name }}<i :class="group.icon"></i>
            </template>
            <el-table :data="group.workOrders" stripe :show-header=false style="width: 100%">
              <el-table-column label="工单名称">
                <template slot-scope="scope">
                  <i v-if="scope.row.icon !== null && scope.row.icon !== ''" :class="scope.row.icon"></i>
                  <span style="margin-left: 5px">{{ scope.row.name }}</span>
                </template>
              </el-table-column>
              <el-table-column label="操作" width="160">
                <template slot-scope="scope">
                  <el-button type="primary" plain size="mini" @click="createTicket(scope.row)"
                             v-if="scope.row.status === 0"
                             :loading="ticketCreating">新建
                  </el-button>
                  <el-button type="warning" plain size="mini" v-if="scope.row.status === 1"
                             :loading="ticketCreating">开发中
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

import ticketFormStatus from './child/ticket.form'

export default {
  name: 'WorkOrderCard',
  props: ['user'],
  data () {
    return {
      activeNames: [0],
      workOrderView: {},
      ticketCreating: false
    }
  },
  components: {},
  mounted () {
    this.fetchData()
  },
  methods: {
    createTicket (row) {
      this.ticketCreating = true
      const workOrderKey = row.workOrderKey
      const requestBody = {
        workOrderKey: workOrderKey
      }
      CREATE_WORK_ORDER_TICKET(requestBody)
        .then(res => {
          const ticket = res.body
          const param = {
            workOrderKey: workOrderKey,
            ticket: ticket
          }
          this.$emit('createTicket', param)
          this.ticketCreating = false
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
