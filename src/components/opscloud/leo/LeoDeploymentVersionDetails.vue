<!--suppress HtmlUnknownTag -->
<template>
  <el-row>
        <span v-for="version in deploymentVersionDetails" :key="version.jobName">
          <span v-for="deployment in version.deploymentVersions" :key="deployment.name">
           <el-card style="font-size: 12px; margin-bottom: 5px"
                    :class="deployment|toDeploymentVersionClass"
                    shadow="hover">
             <!--  head -->
             <div>
               <b>{{ version.jobName }}</b>
               <env-tag :env="version.env" style="margin-left: 5px"/>
               <business-tags :tags="deployment.tags" style="margin-left: 5px"/>
               <span style="float: right; color: #9d9fa3">
                 <!-- 一键回滚-->
                 <el-button type="text" @click="handleRollback(deployment)"
                           :disabled="deployment.replicas === 0"
                           v-show="deployment.versionType === 'BLUE' && deployment.doDeployVersion.active">
                   <i class="fas fa-undo-alt"/>
                 </el-button>
                 <!-- 一键升级-->
                 <el-button type="text" @click="handleUpgrade(deployment)" :disabled="deployment.replicas === 0"
                           v-show="deployment.versionType === 'GREEN' && deployment.doDeployVersion.active">
                  <i class="fas fa-redo-alt"/>
                 </el-button>
                 <!-- 一键追平-->
                 <el-button type="text" @click="handleUpgrade(deployment)" :disabled="deployment.replicas === 0"
                           v-show="deployment.versionType === 'OTHER' && deployment.doDeployVersion.active">
                   <i class="fas fa-random"/>
                 </el-button>
                 <!-- 重新部署-->
                 <el-button type="text" @click="handleRedeploy(deployment)" :disabled="deployment.replicas === 0">
                   <i class="fab fa-instalod"/>
                 </el-button>
                 <!-- 克隆无状态-->
                 <el-button type="text" @click="handleClone(deployment)">
                   <i class="fas fa-clone"/>
                 </el-button>
               </span>
             </div>
             <el-divider/>
             <!-- 集群名称-->
             <leo-label :name="$t('leo.deploy.deploymentVersion.clusterName')">
                {{ deployment.name.split(':')[0] }}
             </leo-label>
             <!-- 集群名称-->
             <leo-label :name="$t('leo.deploy.deploymentVersion.namespace')">
                {{ deployment.name.split(':')[1] }}
             </leo-label>
             <!-- 分组名称-->
             <leo-label :name="$t('leo.deploy.deploymentVersion.name')">
                {{ deployment.name.split(':')[2] }}
             </leo-label>
             <leo-label :name="$t('leo.deploy.deploymentVersion.name')" v-if="false">
                {{ deployment.name }}
             </leo-label>
             <leo-label :name="$t('leo.deploy.deploymentVersion.resourcesLimits')">
                <deployment-resources-limits :properties="deployment.properties" simple/>
             </leo-label>
             <leo-label :name="$t('leo.deploy.deploymentVersion.replicas')">
                <deployment-replicas :replicas="deployment.replicas"/>
             </leo-label>
             <leo-label :name="$t('leo.build.versionName')">
                {{ deployment.versionName }}<el-popover placement="right" trigger="hover">
                <i class="el-icon-info" slot="reference"/>
                 <span style="font-size: 10px; color: #9d9fa3">{{
                     deployment.versionDesc === '' ? $t('leo.build.noVersionDesc') : deployment.versionDesc
                   }}</span>
                 </el-popover>
              </leo-label>
              <leo-label :name="$t('leo.build.details.image')">
                 <container-image-display :image="deployment.image"/>
              </leo-label>
            </el-card>
          </span>
        </span>
    <clone-deployment-editor :form-status="formStatus.clone" ref="cloneDeploymentEditor"/>
  </el-row>
</template>

<script>

import EnvTag from '@/components/opscloud/common/tag/EnvTag.vue'
import DeploymentReplicas from '@/components/opscloud/leo/child/DeploymentReplicas.vue'
import { toDeploymentVersionClass } from '@/filters/kubernetes.pod'
import CloneDeploymentEditor from '@/components/opscloud/leo/child/CloneDeploymentEditor.vue'
import { DO_DEPLOY } from '@/api/modules/leo/leo.deploy.api'
import DeploymentResourcesLimits from '@/components/opscloud/leo/child/DeploymentResourcesLimits.vue'
import ContainerImageDisplay from '@/components/opscloud/common/ContainerImageDisplay.vue'
import BusinessTags from '@/components/opscloud/common/tag/BusinessTags.vue'
import LeoLabel from '@/components/opscloud/leo/child/LeoLabel.vue'

export default {
  name: 'LeoDeploymentVersionDetails',
  props: ['deploymentVersionDetails'],
  data () {
    return {
      formStatus: {
        deploy: {
          visible: false,
          labelWidth: '150px'
        },
        clone: {
          visible: false
        }
      }
    }
  },
  components: {
    LeoLabel,
    BusinessTags,
    ContainerImageDisplay,
    CloneDeploymentEditor,
    DeploymentReplicas,
    DeploymentResourcesLimits,
    EnvTag
  },
  filters: {
    toDeploymentVersionClass
  },
  methods: {
    handleClone (deployment) {
      this.$refs.cloneDeploymentEditor.initData(Object.assign({}, deployment))
      this.formStatus.clone.visible = true
    },
    handleUpgrade (deployment) {
      if (deployment.doDeployVersion.active === false) {
        this.$message.warning('操作无效!')
        return
      }
      this.$confirm('确定一键发布当前分组至蓝色版本?', '一键发布', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        const requestBody = {
          jobId: deployment.jobId,
          buildId: deployment.doDeployVersion.buildId,
          assetId: deployment.assetId,
          deployType: 'ROLLING'
        }
        DO_DEPLOY(requestBody).then(res => {
          if (res.success) {
            this.$message({
              type: 'success',
              message: '执行升级任务中!'
            })
          } else {
            this.$message.error(res.msg)
          }
        }).catch((res) => {
          this.$message({
            type: 'error',
            message: res.msg
          })
        })
      })
    },
    handleRollback (deployment) {
      if (deployment.doDeployVersion.active === false) {
        this.$message.warning('操作无效!')
        return
      }
      this.$confirm('确定一键回滚当前分组至绿色版本?', '一键回滚', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        const requestBody = {
          jobId: deployment.jobId,
          buildId: deployment.doDeployVersion.buildId,
          assetId: deployment.assetId,
          deployType: 'ROLLING'
        }
        DO_DEPLOY(requestBody).then(res => {
          if (res.success) {
            this.$message({
              type: 'success',
              message: '执行回滚任务中!'
            })
          } else {
            this.$message.error(res.msg)
          }
        }).catch((res) => {
          this.$message({
            type: 'error',
            message: res.msg
          })
        })
      })
    },
    handleRedeploy (deployment) {
      this.$confirm('确定重新部署当前分组?', '重新部署', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        const requestBody = {
          jobId: deployment.jobId,
          buildId: deployment.buildId,
          assetId: deployment.assetId,
          deployType: 'REDEPLOY'
        }
        DO_DEPLOY(requestBody).then(res => {
          if (res.success) {
            this.$message({
              type: 'success',
              message: '执行部署任务中!'
            })
          } else {
            this.$message.error(res.msg)
          }
        }).catch((res) => {
          this.$message({
            type: 'error',
            message: res.msg
          })
        })
      }).catch(() => {
        this.$message.info('已取消!')
      })
    }
  }
}
</script>

<style scoped>

/*.el-card {*/
/*  font-size: 12px; margin-bottom: 5px;*/
/*}*/

>>> .el-card__body {
  padding: 3px;
  line-height: 14px;
}

.versionBlue {
  border: 3px solid #128ca8;
  width: 420px;
  display: inline-block;
  margin-right: 5px;
}

.versionGreen {
  border: 3px solid #2bbe32;
  width: 420px;
  display: inline-block;
  margin-right: 5px;
}

.versionOther {
  border: 3px solid #e56c0d;
  width: 420px;
  display: inline-block;
  margin-right: 5px;
}

.versionOffline {
  border: 3px solid #9d9fa3;
  width: 420px;
  display: inline-block;
  margin-right: 5px;
}

.el-icon-info {
  color: green;
  margin-left: 5px;
}

.el-button--mini, .el-button--mini.is-round {
  padding: 2px;
}

.el-divider--horizontal {
  margin: 5px 0 !important;
}

</style>
