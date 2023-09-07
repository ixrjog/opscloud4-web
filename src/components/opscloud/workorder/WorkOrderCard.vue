<!--suppress HtmlUnknownTag -->
<template>
  <div>
    <el-card shadow="hover">
      <el-collapse v-model="activeNames">
        <div v-for="(group,index) in workOrderView.workOrderGroups" :key="group.id">
          <el-collapse-item :name="index">
            <template v-slot:title>
              <i :class="group.icon" style="margin-right: 5px"/>
              <span v-if="$i18n.locale === 'zh-chs'">{{ group.name }}</span>
              <span v-if="$i18n.locale === 'en'">{{ group.i18nEn }}</span>
            </template>
            <el-table :data="group.workOrders" stripe :show-header=false>
              <el-table-column label="工单">
                <template v-slot="scope">
                  <i v-if="scope.row.icon !== null && scope.row.icon !== ''" :class="scope.row.icon"
                     style="margin-right: 5px"/>
                  <span v-if="$i18n.locale === 'zh-chs'">{{ scope.row.name }}</span>
                  <span v-if="$i18n.locale === 'en'">{{ scope.row.i18nEn }}</span>
                  <span v-if="scope.row.docs !== null && scope.row.docs !== ''">
                     <a :href="scope.row.docs">
                       <i class="fab fa-creative-commons-share" style="color: #008200; margin-left: 5px"/>
                     </a>
                  </span>
                  <el-button :type="scope.row.status === 2 ? 'info' :'primary'" style="float: right"
                             :disabled="scope.row.status === 2"
                             :loading="scope.row.loading"
                             plain size="mini"
                             @click="createTicket(scope.row)">
                    <span v-if="$i18n.locale === 'zh-chs'">   {{ scope.row.status | toStatusName }}</span>
                    <span v-if="$i18n.locale === 'en'">   {{ scope.row.status | toStatusNameI18nEn }}</span>
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
import { toStatusName, toStatusNameI18nEn } from '@/filters/workorder'

export default {
  name: 'WorkOrderCard',
  props: ['user'],
  data () {
    return {
      activeNames: [0],
      workOrderView: {}
    }
  },
  components: {},
  filters: {
    toStatusName,
    toStatusNameI18nEn,
  },
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
  box-sizing: border-box;
}

>>> .el-card__body {
  padding: 10px 10px;
}

</style>
