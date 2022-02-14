<template>
  <d2-container>
    <h1>{{ title }}</h1>
    <el-tabs v-model="activeName" @tab-click="handleClick">
      <el-tab-pane label="票据" name="ticket">
        <my-ticket-card :isAdmin="true" :title="'所有工单'" @editTicket="editTicket"
                        @previewTicket="previewTicket"
                        @approvalTicket="approvalTicket"
                        ref="myTicketCard"></my-ticket-card>
      </el-tab-pane>
      <el-tab-pane label="配置" name="workorder">
        <el-tabs tab-position="left">
          <el-tab-pane label="群组配置">
            <work-order-group-table></work-order-group-table>
          </el-tab-pane>
          <el-tab-pane label="工单配置">
            <work-order-table></work-order-table>
          </el-tab-pane>
        </el-tabs>
      </el-tab-pane>
      <el-tab-pane label="报表" name="report">
        <work-order-report></work-order-report>
      </el-tab-pane>
    </el-tabs>
    <server-group-ticket-editor :formStatus="formStatus.ticket.serverGroup"
                                ref="serverGroupTicketEditor"
                                @close="fetchData"></server-group-ticket-editor>
    <application-permission-ticket-editor :formStatus="formStatus.ticket.applicationPermission"
                                          ref="applicationPermissionTicketEditor"
                                          @close="fetchData"></application-permission-ticket-editor>
    <confluence-ticket-editor :formStatus="formStatus.ticket.confluence"
                              ref="confluenceTicketEditor"
                              @close="fetchData"></confluence-ticket-editor>
    <vpn-ticket-editor :formStatus="formStatus.ticket.vpn"
                       ref="vpnTicketEditor"
                       @close="fetchData"></vpn-ticket-editor>
    <nexus-ticket-editor :formStatus="formStatus.ticket.nexus"
                         ref="nexusTicketEditor"
                         @close="fetchData"></nexus-ticket-editor>
    <ram-policy-ticket-editor :formStatus="formStatus.ticket.ramPolicy"
                              ref="ramPolicyTicketEditor"
                              @close="fetchData"></ram-policy-ticket-editor>
    <iam-policy-ticket-editor :formStatus="formStatus.ticket.iamPolicy"
                              ref="iamPolicyTicketEditor"
                              @close="fetchData"></iam-policy-ticket-editor>
    <nacos-ticket-editor :formStatus="formStatus.ticket.nacos"
                         ref="nacosTicketEditor"
                         @close="fetchData"></nacos-ticket-editor>
  </d2-container>
</template>

<script>

import MyTicketCard from '@/components/opscloud/workorder/MyTicketCard'
import ServerGroupTicketEditor from '@/components/opscloud/workorder/ticket/ServerGroupTicketEditor'
import ApplicationPermissionTicketEditor from '@/components/opscloud/workorder/ticket/ApplicationPermissionTicketEditor'
import ConfluenceTicketEditor from '@/components/opscloud/workorder/ticket/ConfluenceTicketEditor'
import VpnTicketEditor from '@/components/opscloud/workorder/ticket/VpnTicketEditor'
import NexusTicketEditor from '@/components/opscloud/workorder/ticket/NexusTicketEditor'
import RamPolicyTicketEditor from '@/components/opscloud/workorder/ticket/RamPolicyTicketEditor'
import NacosTicketEditor from '@/components/opscloud/workorder/ticket/NacosTicketEditor'
import WorkOrderKeyConstants from '@/components/opscloud/common/enums/workorder.key.constants'
import ticketFormStatus from '@/components/opscloud/workorder/child/ticket.form'
import WorkOrderGroupTable from '@/components/opscloud/workorder/WorkOrderGroupTable'
import WorkOrderTable from '@/components/opscloud/workorder/WorkOrderTable'
import IamPolicyTicketEditor from '@/components/opscloud/workorder/ticket/IamPolicyTicketEditor'
import WorkOrderReport from '@/components/opscloud/workorder/WorkOrderReport'

export default {
  data () {
    return {
      title: '工单管理',
      activeName: 'ticket',
      workOrderKeyConstants: WorkOrderKeyConstants,
      formStatus: {
        ticket: Object.assign({}, ticketFormStatus.ticket)
      }
    }
  },
  components: {
    WorkOrderReport,
    WorkOrderGroupTable,
    WorkOrderTable,
    MyTicketCard,
    ServerGroupTicketEditor,
    ApplicationPermissionTicketEditor,
    ConfluenceTicketEditor,
    VpnTicketEditor,
    NexusTicketEditor,
    RamPolicyTicketEditor,
    IamPolicyTicketEditor,
    NacosTicketEditor
  },
  computed: {},
  mounted () {
    // this.fetchData()
  },
  methods: {
    handleClick (tab, event) {
      if (tab.name === 'ticket') {
        this.$refs.myTicketCard.fetchData()
      }
    },
    handleOpenTicketEditor (formStatus) {
      this.$nextTick(() => {
        formStatus.visible = true
        formStatus.operationType = false
      })
    },
    /**
     * param:{
     *   workOrderKey,
     *   ticket
     * }
     * @param param
     */
    previewTicket (ticket) {
      this.openTicketEditor(ticket.workOrderKey, ticket)
    },
    approvalTicket (ticket) {
      this.openTicketEditor(ticket.workOrderKey, ticket)
    },
    createTicket (param) {
      this.openTicketEditor(param.workOrderKey, param.ticket)
    },
    editTicket (ticket) {
      this.openTicketEditor(ticket.workOrderKey, ticket)
    },
    openTicketEditor (workOrderKey, ticket) {
      switch (workOrderKey) {
        case this.workOrderKeyConstants.SERVER_GROUP:
          this.handleOpenTicketEditor(this.formStatus.ticket.serverGroup)
          this.$refs.serverGroupTicketEditor.initData(ticket)
          break
        case this.workOrderKeyConstants.APPLICATION_PERMISSION:
          this.handleOpenTicketEditor(this.formStatus.ticket.applicationPermission)
          this.$refs.applicationPermissionTicketEditor.initData(ticket)
          break
        case this.workOrderKeyConstants.CONFLUENCE:
          this.handleOpenTicketEditor(this.formStatus.ticket.confluence)
          this.$refs.confluenceTicketEditor.initData(ticket)
          break
        case this.workOrderKeyConstants.VPN:
          this.handleOpenTicketEditor(this.formStatus.ticket.vpn)
          this.$refs.vpnTicketEditor.initData(ticket)
          break
        case this.workOrderKeyConstants.NEXUS:
          this.handleOpenTicketEditor(this.formStatus.ticket.nexus)
          this.$refs.nexusTicketEditor.initData(ticket)
          break
        case this.workOrderKeyConstants.RAM_POLICY:
          this.handleOpenTicketEditor(this.formStatus.ticket.ramPolicy)
          this.$refs.ramPolicyTicketEditor.initData(ticket)
          break
        case this.workOrderKeyConstants.IAM_POLICY:
          this.handleOpenTicketEditor(this.formStatus.ticket.iamPolicy)
          this.$refs.iamPolicyTicketEditor.initData(ticket)
          break
        case this.workOrderKeyConstants.NACOS:
          this.handleOpenTicketEditor(this.formStatus.ticket.nacos)
          this.$refs.nacosTicketEditor.initData(ticket)
          break
        default:
          this.$message.error('工单类型错误或未配置!')
      }
    },
    fetchData () {
      this.$refs.myTicketCard.fetchData()
    }
  }
}
</script>

<style scoped>

</style>
