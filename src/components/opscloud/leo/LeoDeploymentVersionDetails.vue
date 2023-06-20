<!--suppress HtmlUnknownTag -->
<template>
  <el-row :gutter="10" style="margin-left: 5px; margin-bottom: 5px">
        <span v-for="version in deploymentVersionDetails" :key="version.jobName">
          <el-col :span="6" v-for="deployment in version.deploymentVersions" :key="deployment.name">
<!--            backgroundColor: deployment.versionColor-->
           <el-card style="font-size: 12px; margin-bottom: 5px"
                    :class="deployment|toDeploymentVersionClass"
                    shadow="hover">
            <!--  head -->
            <div>
              <b>{{ version.jobName }}</b>
              <env-tag :env="version.env" style="margin-left: 10px"/>
              <span style="float: right; color: #9d9fa3">
                <!-- 一键回滚-->
                <el-button type="text" @click="handleRollback(deployment)"
                           :disabled="deployment.replicas === 0"
                           v-show="deployment.versionType === 'BLUE' && deployment.doDeployVersion.active">
                  <i class="fas fa-undo-alt"/></el-button>
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
                <el-button type="text" @click="handleRedeploy(deployment)" :disabled="deployment.replicas === 0"><i
                  class="fab fa-instalod"/></el-button>
                <!-- 克隆无状态-->
                <el-button type="text" @click="handleClone(deployment)"><i class="fas fa-clone"/></el-button>
              </span>
            </div>
            <div><span class="label">环境分组</span>{{ deployment.name }}</div>
            <div><span class="label">资源限制</span>
              <deployment-resources-limits :properties="deployment.properties"/>
            </div>
            <div><span class="label">副本数量</span>
              <deployment-replicas :replicas="deployment.replicas"/>
            </div>
            <div><span class="label">版本名称</span>{{ deployment.versionName }}
              <el-popover placement="right" trigger="hover">
                <i class="el-icon-info" slot="reference"/>
                 <span
                   style="font-size: 10px; color: #9d9fa3">{{
                     deployment.versionDesc === '' ? '用户未填写版本说明' : deployment.versionDesc
                   }}</span>
              </el-popover>
            </div>
               <div v-if="false"><span class="label">镜像地址</span>{{ deployment.image }}</div>
               <div><span class="label">镜像地址</span><container-image-display :image="deployment.image"/></div>
            </el-card>
          </el-col>
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
}

.label {
  /*color: #99a9bf;*/
  color: #99a9bf;
  margin-right: 5px;
}

.versionBlue {
  border: 3px solid #128ca8;
}

.versionGreen {
  border: 3px solid #2bbe32;
}

.versionOther {
  border: 3px solid #e56c0d;
}

.versionOffline {
  border: 3px solid #9d9fa3;
}

.el-icon-info {
  color: green;
  margin-left: 5px;
}

.el-button--mini, .el-button--mini.is-round {
  padding: 2px;
}

</style>
