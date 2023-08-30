<!--suppress HtmlUnknownTag -->
<template>
  <d2-container>
    <div v-if="false">
      <h1>数据源实例</h1>
    </div>
    <div>
      <el-row>
        <el-radio-group v-model="queryParam.instanceType" size="mini" @change="fetchData">
          <el-radio-button v-for="item in dsInstanceType" :label="item.name" :key="item.name">
            {{ item.name }}
          </el-radio-button>
        </el-radio-group>
        <el-select v-model="queryParam.instanceType" size="mini" clearable placeholder="数据源类型" filterable @change="fetchData" v-if="false">
          <el-option v-for="item in dsInstanceType"
                     :key="item.name"
                     :label="item.name"
                     :value="item.name" />
        </el-select>
        <el-button @click="fetchData" size="mini"><i class="fas fa-circle-notch"/></el-button>
      </el-row>
      <div style="height: 5px"/>
      <el-row :gutter="10">
        <el-col :span="8" v-for="instance in dsInstances" :key="instance.id">
          <datasource-instance-card :instance="instance"/>
        </el-col>
      </el-row>
    </div>
  </d2-container>
</template>

<script>

import { QUERY_DATASOURCE_INSTANCE } from '@/api/modules/datasource/datasource.instance.api.js'
import DatasourceInstanceCard from '../../../components/opscloud/datasource/DsInstanceCard'
import DsInstanceType from '@/components/opscloud/common/enums/ds.instance.type.js'

const activeOptions = [{
  value: true,
  label: '有效'
}, {
  value: false,
  label: '无效'
}]

const dsTypeOptions = [{
  value: 1,
  label: 'LDAP'
}]

export default {
  name: 'datasource-instance',
  data () {
    return {
      dsInstances: [],
      activeOptions: activeOptions,
      dsTypeOptions: dsTypeOptions,
      dsInstanceType: DsInstanceType,
      formStatus: {
        config: {
          visible: false,
          addTitle: '新增数据源配置',
          updateTitle: '更新数据源配置',
          operationType: true
        }
      },
      queryParam: {
        instanceType: '',
        isActive: '',
        extend: true
      },
      roleOptions: []
    }
  },
  computed: {},
  mounted () {
  },
  components: {
    DatasourceInstanceCard
  },
  methods: {
    handlerRowEdit (row) {
      this.$refs.datasourceConfigEditor.initData(Object.assign({}, row))
      this.formStatus.config.operationType = false
      this.formStatus.config.visible = true
    },
    fetchData () {
      const requestBody = {
        ...this.queryParam
      }
      QUERY_DATASOURCE_INSTANCE(requestBody)
        .then(res => {
          this.dsInstances = res.body
        })
    }
  }
}
</script>

<style scoped>

.el-input {
  display: inline-block;
  max-width: 200px;
}

.el-button {
  margin-left: 5px;
}

>>> .el-card__header {
  padding: 10px 10px;
  border-bottom: 1px solid #EBEEF5;
  //-webkit-box-sizing: border-box;
  box-sizing: border-box;
}

</style>
