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
    <server-group-ticket-editor :formStatus="formStatus.ticket.serverGroup" ref="serverGroupTicketEditor"
                                @close="fetchData"></server-group-ticket-editor>
    <application-permission-ticket-editor :formStatus="formStatus.ticket.applicationPermission"
                                          ref="applicationPermissionTicketEditor"
                                          @close="fetchData"></application-permission-ticket-editor>
    <confluence-ticket-editor :formStatus="formStatus.ticket.confluence" ref="confluenceTicketEditor"
                              @close="fetchData"></confluence-ticket-editor>
    <vpn-ticket-editor :formStatus="formStatus.ticket.vpn" ref="vpnTicketEditor" @close="fetchData"></vpn-ticket-editor>
    <grafana-ticket-editor :formStatus="formStatus.ticket.grafana" ref="grafanaTicketEditor"
                           @close="fetchData"></grafana-ticket-editor>
    <nexus-ticket-editor :formStatus="formStatus.ticket.nexus" ref="nexusTicketEditor"
                         @close="fetchData"></nexus-ticket-editor>
    <ram-policy-ticket-editor :formStatus="formStatus.ticket.ramPolicy" ref="ramPolicyTicketEditor"
                              @close="fetchData"></ram-policy-ticket-editor>
    <iam-policy-ticket-editor :formStatus="formStatus.ticket.iamPolicy" ref="iamPolicyTicketEditor"
                              @close="fetchData"></iam-policy-ticket-editor>
    <nacos-ticket-editor :formStatus="formStatus.ticket.nacos" ref="nacosTicketEditor"
                         @close="fetchData"></nacos-ticket-editor>
    <gitlab-project-ticket-editor :formStatus="formStatus.ticket.gitlab.project" ref="gitlabProjectTicketEditor"
                         @close="fetchData"></gitlab-project-ticket-editor>
    <ons-topic-ticket-editor :formStatus="formStatus.ticket.onsTopic" ref="onsTopicTicketEditor"
                             @close="fetchData"></ons-topic-ticket-editor>
    <ons-group-ticket-editor :formStatus="formStatus.ticket.onsGroup" ref="onsGroupTicketEditor"
                             @close="fetchData"></ons-group-ticket-editor>
    <employee-resign-ticket-editor :formStatus="formStatus.ticket.employeeResign" ref="employeeResignTicketEditor"
                                   @close="fetchData"></employee-resign-ticket-editor>
    <sqs-ticket-editor :formStatus="formStatus.ticket.sqsTicketEditor" ref="sqsTicketEditor"
                       @close="fetchData"></sqs-ticket-editor>
    <sns-topic-ticket-editor :formStatus="formStatus.ticket.snsTopicTicketEditor" ref="snsTopicTicketEditor"
                             @close="fetchData"></sns-topic-ticket-editor>
    <sns-subscription-ticket-editor :formStatus="formStatus.ticket.snsSubscriptionTicketEditor"
                                    ref="snsSubscriptionTicketEditor"
                                    @close="fetchData"></sns-subscription-ticket-editor>
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
import GitlabProjectTicketEditor from '@/components/opscloud/workorder/ticket/GitlabProjectTicketEditor'
import OnsTopicTicketEditor from '@/components/opscloud/workorder/ticket/OnsTopicTicketEditor'
import OnsGroupTicketEditor from '@/components/opscloud/workorder/ticket/OnsGroupTicketEditor'
import IamPolicyTicketEditor from '@/components/opscloud/workorder/ticket/IamPolicyTicketEditor'
import EmployeeResignTicketEditor from '@/components/opscloud/workorder/ticket/EmployeeResignTicketEditor'
import GrafanaTicketEditor from '@/components/opscloud/workorder/ticket/GrafanaTicketEditor'
import SqsTicketEditor from '@/components/opscloud/workorder/ticket/SqsTicketEditor'
import SnsTopicTicketEditor from '@/components/opscloud/workorder/ticket/SnsTopicTicketEditor'
import SnsSubscriptionTicketEditor from '@/components/opscloud/workorder/ticket/SnsSubscriptionTicketEditor'
import ticketFormStatus from '@/components/opscloud/workorder/child/ticket.form'

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
    GrafanaTicketEditor,
    NexusTicketEditor,
    RamPolicyTicketEditor,
    IamPolicyTicketEditor,
    NacosTicketEditor,
    GitlabProjectTicketEditor,
    OnsTopicTicketEditor,
    OnsGroupTicketEditor,
    EmployeeResignTicketEditor,
    SqsTicketEditor,
    SnsTopicTicketEditor,
    SnsSubscriptionTicketEditor
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
        case this.workOrderKeyConstants.GRAFANA:
          this.handleOpenTicketEditor(this.formStatus.ticket.grafana)
          this.$refs.grafanaTicketEditor.initData(ticket)
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
        case this.workOrderKeyConstants.GITLAB_PROJECT:
          this.handleOpenTicketEditor(this.formStatus.ticket.gitlab.project)
          this.$refs.gitlabProjectTicketEditor.initData(ticket)
          break
        case this.workOrderKeyConstants.ONS_ROCKETMQ_TOPIC:
          this.handleOpenTicketEditor(this.formStatus.ticket.onsTopic)
          this.$refs.onsTopicTicketEditor.initData(ticket)
          break
        case this.workOrderKeyConstants.ONS_ROCKETMQ_GROUP:
          this.handleOpenTicketEditor(this.formStatus.ticket.onsGroup)
          this.$refs.onsGroupTicketEditor.initData(ticket)
          break
        case this.workOrderKeyConstants.SYS_EMPLOYEE_RESIGN:
          this.handleOpenTicketEditor(this.formStatus.ticket.employeeResign)
          this.$refs.employeeResignTicketEditor.initData(ticket)
          break
        case this.workOrderKeyConstants.SQS:
          this.handleOpenTicketEditor(this.formStatus.ticket.sqsTicketEditor)
          this.$refs.sqsTicketEditor.initData(ticket)
          break
        case this.workOrderKeyConstants.SNS_TOPIC:
          this.handleOpenTicketEditor(this.formStatus.ticket.snsTopicTicketEditor)
          this.$refs.snsTopicTicketEditor.initData(ticket)
          break
        case this.workOrderKeyConstants.SNS_SUBSCRIPTION:
          this.handleOpenTicketEditor(this.formStatus.ticket.snsSubscriptionTicketEditor)
          this.$refs.snsSubscriptionTicketEditor.initData(ticket)
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
