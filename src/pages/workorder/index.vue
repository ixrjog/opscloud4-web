<template>
  <d2-container>
    <h1>我的工单</h1>
    <el-row :gutter="20">
      <el-col :span="6">
        <work-order-card @createTicket="createTicket"></work-order-card>
      </el-col>
      <el-col :span="18">
        <my-ticket-card @editTicket="editTicket"
                        @previewTicket="previewTicket"
                        @approvalTicket="approvalTicket"
                        ref="myTicketCard"></my-ticket-card>
      </el-col>
    </el-row>
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
    <nacos-ticket-editor :formStatus="formStatus.ticket.nacos"
                         ref="nacosTicketEditor"
                         @close="fetchData"></nacos-ticket-editor>
    <ons-topic-ticket-editor :formStatus="formStatus.ticket.onsTopic"
                             ref="onsTopicTicketEditor"
                             @close="fetchData"></ons-topic-ticket-editor>
  </d2-container>
</template>

<script>

import WorkOrderCard from '@/components/opscloud/workorder/WorkOrderCard'
import MyTicketCard from '@/components/opscloud/workorder/MyTicketCard'
// TicketEditor
import ServerGroupTicketEditor from '@/components/opscloud/workorder/ticket/ServerGroupTicketEditor'
import WorkOrderKeyConstants from '@/components/opscloud/common/enums/workorder.key.constants'
import ApplicationPermissionTicketEditor from '@/components/opscloud/workorder/ticket/ApplicationPermissionTicketEditor'
import ConfluenceTicketEditor from '@/components/opscloud/workorder/ticket/ConfluenceTicketEditor'
import VpnTicketEditor from '@/components/opscloud/workorder/ticket/VpnTicketEditor'
import NexusTicketEditor from '@/components/opscloud/workorder/ticket/NexusTicketEditor'
import RamPolicyTicketEditor from '@/components/opscloud/workorder/ticket/RamPolicyTicketEditor'
import NacosTicketEditor from '@/components/opscloud/workorder/ticket/NacosTicketEditor'
import ticketFormStatus from '@/components/opscloud/workorder/child/ticket.form'
import OnsTopicTicketEditor from '@/components/opscloud/workorder/ticket/OnsTopicTicketEditor'
// import { CREATE_WORK_ORDER_TICKET, GET_WORK_ORDER_TICKET_VIEW } from '@/api/modules/workorder/workorder.ticket.api'

export default {
  data () {
    return {
      workOrderKeyConstants: WorkOrderKeyConstants,
      formStatus: {
        ticket: Object.assign({}, ticketFormStatus.ticket)
      }
    }
  },
  mounted () {
  },
  components: {
    WorkOrderCard,
    MyTicketCard,
    ServerGroupTicketEditor,
    ApplicationPermissionTicketEditor,
    ConfluenceTicketEditor,
    VpnTicketEditor,
    NexusTicketEditor,
    RamPolicyTicketEditor,
    NacosTicketEditor,
    OnsTopicTicketEditor
  },
  methods: {
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
        case this.workOrderKeyConstants.NACOS:
          this.handleOpenTicketEditor(this.formStatus.ticket.nacos)
          this.$refs.nacosTicketEditor.initData(ticket)
          break
        case this.workOrderKeyConstants.ONS_ROCKETMQ_TOPIC:
          this.handleOpenTicketEditor(this.formStatus.ticket.onsTopic)
          this.$refs.onsTopicTicketEditor.initData(ticket)
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
