<!--suppress HtmlUnknownTag -->
<template>
  <d2-container>
    <el-row :gutter="20">
      <el-col :span="6">
        <work-order-card @createTicket="createTicket"/>
      </el-col>
      <el-col :span="18">
        <my-ticket-card @editTicket="editTicket"
                        @previewTicket="previewTicket"
                        @approvalTicket="approvalTicket"
                        ref="myTicketCard"/>
      </el-col>
    </el-row>
    <aliyun-ram-update-login-profile-ticket-editor :formStatus="formStatus.ticket.aliyunRamUpdateLoginProfile" ref="aliyunRamUpdateLoginProfileTicketEditor" @close="fetchData"/>
    <server-group-ticket-editor :formStatus="formStatus.ticket.serverGroup" ref="serverGroupTicketEditor" @close="fetchData"/>
    <application-permission-ticket-editor :formStatus="formStatus.ticket.application.permission" ref="applicationPermissionTicketEditor" @close="fetchData"/>
    <confluence-ticket-editor :formStatus="formStatus.ticket.confluence" ref="confluenceTicketEditor" @close="fetchData"/>
    <vpn-ticket-editor :formStatus="formStatus.ticket.vpn" ref="vpnTicketEditor" @close="fetchData"/>
    <grafana-ticket-editor :formStatus="formStatus.ticket.grafana" ref="grafanaTicketEditor" @close="fetchData"/>
    <nexus-ticket-editor :formStatus="formStatus.ticket.nexus" ref="nexusTicketEditor" @close="fetchData"/>
    <ram-policy-ticket-editor :formStatus="formStatus.ticket.ramPolicy" ref="ramPolicyTicketEditor" @close="fetchData"/>
    <iam-policy-ticket-editor :formStatus="formStatus.ticket.iamPolicy" ref="iamPolicyTicketEditor" @close="fetchData"/>
    <nacos-ticket-editor :formStatus="formStatus.ticket.nacos" ref="nacosTicketEditor" @close="fetchData"/>
    <gitlab-project-ticket-editor :formStatus="formStatus.ticket.gitlab.project" ref="gitlabProjectTicketEditor" @close="fetchData"/>
    <gitlab-group-ticket-editor :formStatus="formStatus.ticket.gitlab.group" ref="gitlabGroupTicketEditor" @close="fetchData"/>
    <ons-topic-ticket-editor :formStatus="formStatus.ticket.ons.topic" ref="onsTopicTicketEditor" @close="fetchData"/>
    <ons-group-ticket-editor :formStatus="formStatus.ticket.ons.group" ref="onsGroupTicketEditor" @close="fetchData"/>
    <employee-resign-ticket-editor :formStatus="formStatus.ticket.employeeResign" ref="employeeResignTicketEditor" @close="fetchData"/>
    <sqs-ticket-editor :formStatus="formStatus.ticket.sqs" ref="sqsTicketEditor" @close="fetchData"/>
    <sns-topic-ticket-editor :formStatus="formStatus.ticket.sns.topic" ref="snsTopicTicketEditor" @close="fetchData"/>
    <sns-subscription-ticket-editor :formStatus="formStatus.ticket.sns.subscription" ref="snsSubscriptionTicketEditor" @close="fetchData"/>
    <application-scale-replicas-ticket-editor :formStatus="formStatus.ticket.application.scaleReplicas" ref="applicationScaleReplicasTicketEditor" @close="fetchData"/>
    <application-reduce-replicas-ticket-editor :formStatus="formStatus.ticket.application.reduceReplicas" ref="applicationReduceReplicasTicketEditor" @close="fetchData"/>
    <apollo-ticket-editor :formStatus="formStatus.ticket.apollo.permission" ref="apolloTicketEditor" @close="fetchData"/>
    <apollo-release-ticket-editor :formStatus="formStatus.ticket.apollo.release" ref="apolloReleaseTicketEditor" @close="fetchData"/>
    <aws-iam-update-login-profile-ticket-editor :formStatus="formStatus.ticket.awsIamUpdateLoginProfile" ref="awsIamUpdateLoginProfileTicketEditor" @close="fetchData"/>
    <application-deploy-ticket-editor :formStatus="formStatus.ticket.application.deploy" ref="applicationDeployTicketEditor" @close="fetchData"/>
    <new-application-ticket-editor :formStatus="formStatus.ticket.application.new" ref="newApplicationTicketEditor" @close="fetchData"/>
    <ser-deploy-ticket-editor :formStatus="formStatus.ticket.application.serDeploy" ref="serDeployTicketEditor" @close="fetchData"/>
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
import GitlabGroupTicketEditor from '@/components/opscloud/workorder/ticket/GitlabGroupTicketEditor'
import OnsTopicTicketEditor from '@/components/opscloud/workorder/ticket/OnsTopicTicketEditor'
import OnsGroupTicketEditor from '@/components/opscloud/workorder/ticket/OnsGroupTicketEditor'
import IamPolicyTicketEditor from '@/components/opscloud/workorder/ticket/IamPolicyTicketEditor'
import EmployeeResignTicketEditor from '@/components/opscloud/workorder/ticket/EmployeeResignTicketEditor'
import GrafanaTicketEditor from '@/components/opscloud/workorder/ticket/GrafanaTicketEditor'
import SqsTicketEditor from '@/components/opscloud/workorder/ticket/SqsTicketEditor'
import SnsTopicTicketEditor from '@/components/opscloud/workorder/ticket/SnsTopicTicketEditor'
import SnsSubscriptionTicketEditor from '@/components/opscloud/workorder/ticket/SnsSubscriptionTicketEditor'
import ticketFormStatus from '@/components/opscloud/workorder/child/ticket.form'
import ApplicationScaleReplicasTicketEditor
  from '@/components/opscloud/workorder/ticket/ApplicationScaleReplicasTicketEditor'
import ApolloTicketEditor from '@/components/opscloud/workorder/ticket/ApolloTicketEditor.vue'
import ApplicationReduceReplicasTicketEditor
  from '@/components/opscloud/workorder/ticket/ApplicationReduceReplicasTicketEditor.vue'
import AwsIamUpdateLoginProfileTicketEditor
  from '@/components/opscloud/workorder/ticket/AwsIamUpdateLoginProfileTicketEditor.vue'
import ApplicationDeployTicketEditor from '@/components/opscloud/workorder/ticket/ApplicationDeployTicketEditor.vue'
import NewApplicationTicketEditor from '@/components/opscloud/workorder/ticket/NewApplicationTicketEditor.vue'
import AliyunRamUpdateLoginProfileTicketEditor
  from '@/components/opscloud/workorder/ticket/AliyunRamUpdateLoginProfileTicketEditor.vue'
import ApolloReleaseTicketEditor from '@/components/opscloud/workorder/ticket/ApolloReleaseTicketEditor.vue'
import SerDeployTicketEditor from '@/components/opscloud/workorder/ticket/SerDeployTicketEditor.vue'

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
    GitlabGroupTicketEditor,
    OnsTopicTicketEditor,
    OnsGroupTicketEditor,
    EmployeeResignTicketEditor,
    SqsTicketEditor,
    SnsTopicTicketEditor,
    SnsSubscriptionTicketEditor,
    ApplicationScaleReplicasTicketEditor,
    ApplicationReduceReplicasTicketEditor,
    ApolloTicketEditor,
    AwsIamUpdateLoginProfileTicketEditor,
    AliyunRamUpdateLoginProfileTicketEditor,
    ApplicationDeployTicketEditor,
    NewApplicationTicketEditor,
    ApolloReleaseTicketEditor,
    SerDeployTicketEditor
  },
  methods: {
    handleOpenTicketEditor (formStatus) {
      this.$nextTick(() => {
        formStatus.visible = true
        formStatus.operationType = false
      })
    },
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
          this.handleOpenTicketEditor(this.formStatus.ticket.application.permission)
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
        case this.workOrderKeyConstants.GITLAB_GROUP:
          this.handleOpenTicketEditor(this.formStatus.ticket.gitlab.group)
          this.$refs.gitlabGroupTicketEditor.initData(ticket)
          break
        case this.workOrderKeyConstants.ONS_ROCKETMQ_TOPIC:
          this.handleOpenTicketEditor(this.formStatus.ticket.ons.topic)
          this.$refs.onsTopicTicketEditor.initData(ticket)
          break
        case this.workOrderKeyConstants.ONS_ROCKETMQ_GROUP:
          this.handleOpenTicketEditor(this.formStatus.ticket.ons.group)
          this.$refs.onsGroupTicketEditor.initData(ticket)
          break
        case this.workOrderKeyConstants.SYS_EMPLOYEE_RESIGN:
          this.handleOpenTicketEditor(this.formStatus.ticket.employeeResign)
          this.$refs.employeeResignTicketEditor.initData(ticket)
          break
        case this.workOrderKeyConstants.SQS:
          this.handleOpenTicketEditor(this.formStatus.ticket.sqs)
          this.$refs.sqsTicketEditor.initData(ticket)
          break
        case this.workOrderKeyConstants.SNS_TOPIC:
          this.handleOpenTicketEditor(this.formStatus.ticket.sns.topic)
          this.$refs.snsTopicTicketEditor.initData(ticket)
          break
        case this.workOrderKeyConstants.SNS_SUBSCRIPTION:
          this.handleOpenTicketEditor(this.formStatus.ticket.sns.subscription)
          this.$refs.snsSubscriptionTicketEditor.initData(ticket)
          break
        case this.workOrderKeyConstants.APPLICATION_SCALE_REPLICAS:
          this.handleOpenTicketEditor(this.formStatus.ticket.application.scaleReplicas)
          this.$refs.applicationScaleReplicasTicketEditor.initData(ticket)
          break
        case this.workOrderKeyConstants.APPLICATION_REDUCE_REPLICAS:
          this.handleOpenTicketEditor(this.formStatus.ticket.application.reduceReplicas)
          this.$refs.applicationReduceReplicasTicketEditor.initData(ticket)
          break
        case this.workOrderKeyConstants.APOLLO:
          this.handleOpenTicketEditor(this.formStatus.ticket.apollo.permission)
          this.$refs.apolloTicketEditor.initData(ticket)
          break
        case this.workOrderKeyConstants.AWS_IAM_UPDATE_LOGIN_PROFILE:
          this.handleOpenTicketEditor(this.formStatus.ticket.awsIamUpdateLoginProfile)
          this.$refs.awsIamUpdateLoginProfileTicketEditor.initData(ticket)
          break
        case this.workOrderKeyConstants.ALIYUN_RAM_UPDATE_LOGIN_PROFILE:
          this.handleOpenTicketEditor(this.formStatus.ticket.aliyunRamUpdateLoginProfile)
          this.$refs.aliyunRamUpdateLoginProfileTicketEditor.initData(ticket)
          break
        case this.workOrderKeyConstants.APPLICATION_DEPLOY:
          this.handleOpenTicketEditor(this.formStatus.ticket.application.deploy)
          this.$refs.applicationDeployTicketEditor.initData(ticket)
          break
        case this.workOrderKeyConstants.NEW_APPLICATION:
          this.handleOpenTicketEditor(this.formStatus.ticket.application.new)
          this.$refs.newApplicationTicketEditor.initData(ticket)
          break
        case this.workOrderKeyConstants.APOLLO_RELEASE:
          this.handleOpenTicketEditor(this.formStatus.ticket.apollo.release)
          this.$refs.apolloReleaseTicketEditor.initData(ticket)
          break
        case this.workOrderKeyConstants.SER_DEPLOY:
          this.handleOpenTicketEditor(this.formStatus.ticket.application.serDeploy)
          this.$refs.serDeployTicketEditor.initData(ticket)
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
