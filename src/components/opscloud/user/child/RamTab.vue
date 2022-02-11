<template>
  <div>
    <el-row :gutter="24" style="margin-bottom: 5px; margin-left: 0px;">
      <el-form label-width="100px">
        <el-form-item label="阿里云实例">
          <el-select v-model="dsInstance" filterable placeholder="选择阿里云实例" style="width: 300px"
                     value-key="id" @change="selInstance">
            <el-option
              v-for="item in dsInstanceOptions"
              :key="item.id"
              :label="item.instanceName"
              :value="item">
              <select-item :name="item.instanceType" :comment="item.instanceName"></select-item>
            </el-option>
          </el-select>
          <el-button @click="handleAddRamUser" :disabled="!button.create.disabled" :loading="button.create.creating">
            新建
          </el-button>
        </el-form-item>
        <el-form-item label="RAM策略">
          <el-select v-model.trim="policy" filterable clearable style="width: 300px" :disabled="dsInstance === null"
                     remote reserve-keyword placeholder="选择RAM策略" value-key="id" :remote-method="getAsset">
            <el-option
              v-for="item in policyOptions"
              :key="item.id"
              :label="item.name"
              :value="item"
              :disabled="!item.isActive">
              <select-item :name="item.name" :comment="item.description"></select-item>
            </el-option>
          </el-select>
          <el-button @click="handleGrantPolicy" :disabled="policy === null" :loading="button.grant.granting">授权
          </el-button>
        </el-form-item>
      </el-form>
    </el-row>
    <el-table :data="table.data" style="width: 100%">
      <el-table-column label="实例 / 账户">
        <template slot-scope="scope">
          <el-row>
            <span>{{ scope.row.instanceName }}</span>
          </el-row>
          <el-row class="ramInfo">
            <span> {{ scope.row.loginUser }}</span>
          </el-row>
        </template>
      </el-table-column>
      <el-table-column prop="accessKeys" label="Access Key">
        <template slot-scope="scope">
          <el-tag v-for="ak in scope.row.accessKeys" :key="ak.assetId">
            {{ ak.assetId }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="policies" label="策略">
        <template slot-scope="scope">
          <div class="tag-group">
            <div v-for="policy in scope.row.policies" :key="policy.assetId">
              <el-tooltip class="item" effect="light" :content="policy.description" placement="top-start">
                <el-tag style="margin-left: 5px" closable @close="handleRevokePolicy(policy)">{{ policy.name }}</el-tag>
              </el-tooltip>
            </div>
          </div>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>

import { GET_AM, CREATE_AM_USER, GRANT_AM_POLICY, REVOKE_AM_POLICY } from '@/api/modules/user/user.am.api.js'
import { QUERY_DATASOURCE_INSTANCE } from '@/api/modules/datasource/datasource.instance.api'
import BusinessType from '@/components/opscloud/common/enums/business.type'
import {
  QUERY_ASSET_PAGE
} from '@/api/modules/datasource/datasource.asset.api.js'
import DsInstanceAssetType from '@/components/opscloud/common/enums/ds.instance.asset.type'
import SelectItem from '@/components/opscloud/common/SelectItem'

export default {
  name: 'ramTab',
  props: ['user'],
  data () {
    return {
      table: {
        data: [],
        loading: false
      },
      queryParam: {
        queryName: '',
        filterTag: true,
        isActive: true,
        extend: true
      },
      dsInstance: null,
      dsInstanceOptions: [],
      policy: null,
      businessType: BusinessType.USER,
      dsInstanceAssetType: DsInstanceAssetType,
      policyOptions: [],
      button: {
        create: {
          disabled: false,
          creating: false
        },
        grant: {
          granting: false
        }
      }
    }
  },
  computed: {},
  mounted () {
    this.getDsInstance()
  },
  components: { SelectItem },
  methods: {
    init () {
      this.button = {
        create: {
          disabled: false,
          creating: false
        },
        grant: {
          granting: false
        }
      }
      this.dsInstance = null
      this.dsInstanceOptions = []
      this.policy = null
      this.policyOptions = []
      this.fetchData()
      this.getDsInstance()
    },
    getDsInstance () {
      const requestBody = {
        instanceType: 'ALIYUN',
        isActive: true,
        extend: true
      }
      QUERY_DATASOURCE_INSTANCE(requestBody)
        .then(({ body }) => {
          this.dsInstanceOptions = body
        })
    },
    /**
     * 校验创建RAM账户
     */
    checkCreateRamUser () {
      if (this.dsInstance === null || this.table.data === []) {
        this.button.create.disabled = false
        return
      }
      let isCreated = false
      if (this.table.data.length !== 0) {
        for (const ramUser of this.table.data) {
          if (this.dsInstance.uuid === ramUser.instanceUuid) {
            isCreated = true
            break
          }
        }
      }
      this.button.create.disabled = !isCreated
    },
    handleAddRamUser () {
      const requestBody = {
        instanceUuid: this.dsInstance !== {} ? this.dsInstance.uuid : '',
        username: this.user.username
      }
      this.button.create.creating = true
      CREATE_AM_USER(requestBody)
        .then(res => {
          this.fetchData()
          this.button.create.creating = false
        })
    },
    selInstance () {
      this.policy = null
      this.getAsset('')
      this.checkCreateRamUser()
    },
    getAsset (queryName) {
      const requestBody = {
        assetType: this.dsInstanceAssetType.ALIYUN.RAM_POLICY,
        extend: true,
        instanceId: this.dsInstance !== {} ? this.dsInstance.id : '',
        instanceUuid: this.dsInstance !== {} ? this.dsInstance.uuid : '',
        isActive: true,
        length: 15,
        page: 1,
        queryName: queryName,
        relation: true
      }
      QUERY_ASSET_PAGE(requestBody)
        .then(res => {
          this.policyOptions = res.body.data
        })
    },
    /**
     * 授权
     */
    handleGrantPolicy () {
      if (this.policy === null) return
      const requestBody = {
        policy: {
          policyName: this.policy.assetId,
          policyType: this.policy.assetKey
        },
        instanceId: this.dsInstance !== {} ? this.dsInstance.id : '',
        instanceUuid: this.dsInstance !== {} ? this.dsInstance.uuid : '',
        username: this.user.username
      }
      this.button.grant.granting = true
      GRANT_AM_POLICY(requestBody).then(() => {
        this.fetchData()
        this.button.grant.granting = false
      }).catch(() => {
        this.button.grant.granting = false
      })
    },
    /**
     * 撤销
     */
    handleRevokePolicy (policy) {
      const requestBody = {
        policy: {
          policyName: policy.assetId,
          policyType: policy.assetKey
        },
        instanceUuid: policy.instanceUuid,
        username: this.user.username
      }
      REVOKE_AM_POLICY(requestBody)
        .then(res => {
          this.fetchData()
        })
    },
    fetchData () {
      this.table.loading = true
      GET_AM({ username: this.user.username, amType: this.dsInstanceAssetType.ALIYUN.RAM_USER })
        .then(res => {
          this.table.data = res.body
          this.table.loading = false
          this.checkCreateRamUser()
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
</style>
