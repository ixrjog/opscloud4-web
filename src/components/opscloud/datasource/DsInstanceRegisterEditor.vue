<!--suppress HtmlUnknownTag -->
<template>
  <el-dialog :title="formStatus.operationType ? formStatus.addTitle : formStatus.updateTitle"
             :visible.sync="formStatus.visible">
    <el-form :model="datasource">
      <el-form-item label="名称" :label-width="labelWidth" required>
        <el-input v-model="datasource.instance.instanceName" placeholder="请输入内容" size="mini"/>
      </el-form-item>
      <el-form-item label="数据源类型" :label-width="labelWidth" required>
        <el-select v-model="datasource.config.dsType" size="mini" placeholder="选择类型" disabled>
          <el-option v-for="item in dsTypeOptions"
                     :key="item.value"
                     :label="item.label"
                     :value="item.value"/>
        </el-select>
      </el-form-item>
      <el-form-item label="实例类型" :label-width="labelWidth" required>
        <el-select v-model="datasource.instance.instanceType" size="mini" placeholder="选择类型">
          <el-option v-for="item in instanceTypeOptions"
                     :key="item.value"
                     :label="item.label"
                     :value="item.value"/>
        </el-select>
      </el-form-item>
      <el-form-item label="有效" :label-width="labelWidth" required>
        <el-select v-model="datasource.instance.isActive" size="mini" placeholder="选择类型">
          <el-option v-for="item in activeOptions"
                     :key="item.value"
                     :label="item.label"
                     :value="item.value"/>
        </el-select>
      </el-form-item>
      <el-form-item label="版本" :label-width="labelWidth">
        <el-input v-model="datasource.instance.version" placeholder="请输入内容" size="mini"/>
      </el-form-item>
      <el-form-item label="实例分类" :label-width="labelWidth">
        <el-input v-model="datasource.instance.kind" placeholder="请输入内容" size="mini"/>
      </el-form-item>
      <el-form-item label="描述" :label-width="labelWidth">
        <el-input v-model="datasource.instance.comment" placeholder="请输入内容" size="mini"/>
      </el-form-item>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button size="mini" @click="formStatus.visible = false">取消</el-button>
      <el-button type="primary" size="mini" @click="handleRegister"
                 v-text="datasource.instance.uuid === ''? '注册':'更新'">
      </el-button>
    </div>
  </el-dialog>
</template>

<script>

import { REGISTER_DATASOURCE_INSTANCE } from '@/api/modules/datasource/datasource.instance.api.js'
import DsInstanceType from '@/components/opscloud/common/enums/ds.instance.type.js'

export default {
  name: 'DatasourceInstanceRegisterEditor',
  props: ['formStatus', 'activeOptions', 'dsTypeOptions'],
  data () {
    return {
      activeName: 'dsInfo',
      labelWidth: '150px',
      datasource: {
        config: '',
        instance: ''
      },
      instanceTypeOptions: [],
      dsInstanceType: DsInstanceType
    }
  },
  mixins: [],
  components: {},
  methods: {
    initData (datasource) {
      this.datasource = datasource
      let instanceType
      switch (datasource.config.dsType) {
        case this.dsInstanceType.LDAP.type:
          instanceType = this.dsInstanceType.LDAP
          break
        case this.dsInstanceType.GITLAB.type:
          instanceType = this.dsInstanceType.GITLAB
          break
        case this.dsInstanceType.ALIYUN.type:
          instanceType = this.dsInstanceType.ALIYUN
          break
        case this.dsInstanceType.AWS.type:
          instanceType = this.dsInstanceType.AWS
          break
        case this.dsInstanceType.KUBERNETES.type:
          instanceType = this.dsInstanceType.KUBERNETES
          break
        case this.dsInstanceType.JENKINS.type:
          instanceType = this.dsInstanceType.JENKINS
          break
        case this.dsInstanceType.ZABBIX.type:
          instanceType = this.dsInstanceType.ZABBIX
          break
        case this.dsInstanceType.GUACAMOLE.type:
          instanceType = this.dsInstanceType.GUACAMOLE
          break
        case this.dsInstanceType.ANSIBLE.type:
          instanceType = this.dsInstanceType.ANSIBLE
          break
        case this.dsInstanceType.TENCENT_EXMAIL.type:
          instanceType = this.dsInstanceType.TENCENT_EXMAIL
          break
        case this.dsInstanceType.NEXUS.type:
          instanceType = this.dsInstanceType.NEXUS
          break
        case this.dsInstanceType.SONAR.type:
          instanceType = this.dsInstanceType.SONAR
          break
        case this.dsInstanceType.NACOS.type:
          instanceType = this.dsInstanceType.NACOS
          break
        case this.dsInstanceType.DINGTALK_ROBOT.type:
          instanceType = this.dsInstanceType.DINGTALK_ROBOT
          break
        case this.dsInstanceType.DINGTALK_APP.type:
          instanceType = this.dsInstanceType.DINGTALK_APP
          break
        case this.dsInstanceType.HUAWEICLOUD.type:
          instanceType = this.dsInstanceType.HUAWEICLOUD
          break
        case this.dsInstanceType.CONSUL.type:
          instanceType = this.dsInstanceType.CONSUL
          break
        case this.dsInstanceType.LXHL.type:
          instanceType = this.dsInstanceType.LXHL
          break
        case this.dsInstanceType.ALIYUN_DEVOPS.type:
          instanceType = this.dsInstanceType.ALIYUN_DEVOPS
          break
        case this.dsInstanceType.METER_SPHERE.type:
          instanceType = this.dsInstanceType.METER_SPHERE
          break
        case this.dsInstanceType.APOLLO.type:
          instanceType = this.dsInstanceType.APOLLO
          break
        case this.dsInstanceType.ALIYUN_ARMS.type:
          instanceType = this.dsInstanceType.ALIYUN_ARMS
          break
        case this.dsInstanceType.ALIYUN_EVENTBRIDGE.type:
          instanceType = this.dsInstanceType.ALIYUN_EVENTBRIDGE
          break
        default:
          this.$message({
            message: '未知的数据源实例类型',
            type: 'warning'
          })
      }
      this.instanceTypeOptions = instanceType.instanceType
      this.datasource.instance.instanceType = instanceType.name
    },
    handleRegister () {
      REGISTER_DATASOURCE_INSTANCE(this.datasource.instance)
        .then(() => {
          if (this.formStatus.operationType) {
            this.$message.success('注册成功')
          } else {
            this.$message.success('更新成功')
          }
          this.formStatus.visible = false
          this.$emit('close')
        })
    }
  }
}
</script>

<style scoped>

</style>
